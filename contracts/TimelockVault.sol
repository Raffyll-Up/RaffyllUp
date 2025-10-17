// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { IERC20 } from "./interfaces/IERC20.sol";
import { SafeTransferLib } from "./libraries/SafeTransferLib.sol";

/**
 * @title TimelockVault
 * @notice Community-level multi-token vault that locks funds per raffleId and releases only after timelock.
 *         Factory orchestrates payouts; Community performs funding and locking.
 */
contract TimelockVault {
    using SafeTransferLib for IERC20;

    address public immutable community;
    address public immutable factory;

    // token => total balance held
    mapping(address => uint256) public balances;
    // token => total reserved (locked but not yet paid)
    mapping(address => uint256) public reservedTotal;

    struct Lock {
        uint256 amount;
        uint64 endTime;
        bool locked;
        bool disbursed;
        uint256 paid;
    }

    // raffleId => token => lock
    mapping(uint256 => mapping(address => Lock)) public locks;

    event DepositedETH(address indexed from, uint256 amount);
    event DepositedToken(address indexed from, address indexed token, uint256 amount);
    event Locked(uint256 indexed raffleId, address indexed token, uint256 amount, uint64 endTime);
    event Paid(uint256 indexed raffleId, address indexed token, address indexed to, uint256 amount);
    event BatchPaid(uint256 indexed raffleId, address indexed token, uint256 totalPaid);
    event Disbursed(uint256 indexed raffleId, address indexed token);

    modifier onlyCommunity() {
        require(msg.sender == community, "ONLY_COMMUNITY");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "ONLY_FACTORY");
        _;
    }

    constructor(address _community, address _factory) {
        require(_community != address(0), "INVALID_COMMUNITY");
        require(_factory != address(0), "INVALID_FACTORY");
        community = _community;
        factory = _factory;
    }

    receive() external payable {
        revert("USE_DEPOSIT");
    }

    // Funding via Community
    function depositETH() external payable onlyCommunity {
        require(msg.value > 0, "ZERO_AMOUNT");
        balances[address(0)] += msg.value;
        emit DepositedETH(msg.sender, msg.value);
    }

    function recordTokenDeposit(address token, uint256 amount) external onlyCommunity {
        require(token != address(0), "INVALID_TOKEN");
        require(amount > 0, "ZERO_AMOUNT");
        balances[token] += amount;
        emit DepositedToken(msg.sender, token, amount);
    }

    // Lock funds for a raffle
    function lockFunds(uint256 raffleId, address token, uint256 amount, uint64 endTime) external onlyCommunity {
        require(endTime > block.timestamp, "ENDTIME_IN_PAST");
        require(amount > 0, "ZERO_AMOUNT");
        Lock storage L = locks[raffleId][token];
        require(!L.locked, "ALREADY_LOCKED");
        // ensure sufficient available (balance - reserved)
        uint256 available = balances[token] - reservedTotal[token];
        require(available >= amount, "INSUFFICIENT_AVAILABLE");
        L.amount = amount;
        L.endTime = endTime;
        L.locked = true;
        reservedTotal[token] += amount;
        emit Locked(raffleId, token, amount, endTime);
    }

    function canDisburse(uint256 raffleId, address token) public view returns (bool) {
        Lock storage L = locks[raffleId][token];
        return L.locked && !L.disbursed && block.timestamp >= L.endTime;
    }

    // Factory-triggered payouts
    function payWinner(uint256 raffleId, address token, address to, uint256 amount) external onlyFactory {
        require(to != address(0), "INVALID_TO");
        require(amount > 0, "ZERO_AMOUNT");
        require(canDisburse(raffleId, token), "TIMELOCK_ACTIVE");
        Lock storage L = locks[raffleId][token];
        require(L.paid + amount <= L.amount, "OVERPAY");

        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }

        L.paid += amount;
        balances[token] -= amount;
        reservedTotal[token] -= amount;
        emit Paid(raffleId, token, to, amount);
    }

    function batchPay(uint256 raffleId, address token, address[] calldata tos, uint256[] calldata amounts) external onlyFactory {
        require(tos.length == amounts.length, "LEN_MISMATCH");
        require(canDisburse(raffleId, token), "TIMELOCK_ACTIVE");
        Lock storage L = locks[raffleId][token];
        uint256 total;
        for (uint256 i = 0; i < tos.length; i++) {
            address to = tos[i];
            uint256 amount = amounts[i];
            require(to != address(0), "INVALID_TO");
            require(amount > 0, "ZERO_AMOUNT");
            require(L.paid + amount <= L.amount, "OVERPAY");
            if (token == address(0)) {
                (bool success, ) = payable(to).call{value: amount}("");
                require(success, "ETH_TRANSFER_FAILED");
            } else {
                IERC20(token).safeTransfer(to, amount);
            }
            L.paid += amount;
            balances[token] -= amount;
            reservedTotal[token] -= amount;
            total += amount;
            emit Paid(raffleId, token, to, amount);
        }
        emit BatchPaid(raffleId, token, total);
    }

    function markDisbursed(uint256 raffleId, address token) external onlyFactory {
        Lock storage L = locks[raffleId][token];
        require(L.locked, "NOT_LOCKED");
        require(L.paid == L.amount, "NOT_FULLY_PAID");
        require(!L.disbursed, "ALREADY_DISBURSED");
        L.disbursed = true;
        emit Disbursed(raffleId, token);
    }

    // Views
    function getBalance(address token) external view returns (uint256) {
        return balances[token];
    }

    function getAvailable(address token) external view returns (uint256) {
        return balances[token] - reservedTotal[token];
    }
}