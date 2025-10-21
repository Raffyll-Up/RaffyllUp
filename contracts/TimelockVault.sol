// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ICommunity} from "./interfaces/ICommunity.sol";

/**
 * @title TimelockVault
 * @notice Community-level multi-token vault that locks funds per raffleId and releases only after timelock.
 *         Factory orchestrates payouts; Community performs funding and locking.
 */
contract TimelockVault {
    using SafeERC20 for IERC20;

    address public immutable community;
    address public immutable factory;

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

    event Locked(
        uint256 indexed raffleId,
        address indexed token,
        uint256 amount,
        uint64 endTime
    );
    event Paid(
        uint256 indexed raffleId,
        address indexed token,
        address indexed to,
        uint256 amount
    );
    event BatchPaid(
        uint256 indexed raffleId,
        address indexed token,
        uint256 totalPaid
    );
    event Disbursed(uint256 indexed raffleId, address indexed token);
    event Unlocked(
        uint256 indexed raffleId,
        address indexed token,
        uint256 amount
    );
    event Withdrawn(address indexed token, address indexed to, uint256 amount);

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

    receive() external payable {}

    // Lock funds for a raffle
    function lockFunds(
        uint256 raffleId,
        address token,
        uint256 amount,
        uint64 endTime
    ) external onlyCommunity {
        require(endTime > block.timestamp, "ENDTIME_IN_PAST");
        require(amount > 0, "ZERO_AMOUNT");
        Lock storage L = locks[raffleId][token];
        require(!L.locked, "ALREADY_LOCKED");
        // ensure sufficient available (balance - reserved)
        uint256 currentBalance = getBalance(token);
        uint256 available = currentBalance - reservedTotal[token];
        require(available >= amount, "INSUFFICIENT_AVAILABLE");
        L.amount = amount;
        L.endTime = endTime;
        L.locked = true;
        reservedTotal[token] += amount;
        emit Locked(raffleId, token, amount, endTime);
    }

    function unlockFunds(
        uint256 raffleId,
        address token
    ) external onlyCommunity {
        Lock storage L = locks[raffleId][token];
        require(L.locked, "NOT_LOCKED");
        require(!L.disbursed, "ALREADY_DISBURSED");

        uint256 amount = L.amount;
        reservedTotal[token] -= amount;

        delete locks[raffleId][token];

        emit Unlocked(raffleId, token, amount);
    }

    function sendFee(
        address token,
        address to,
        uint256 amount
    ) external onlyCommunity {
        require(amount > 0, "ZERO_AMOUNT");
        uint256 available = getBalance(token) - reservedTotal[token];
        require(available >= amount, "INSUFFICIENT_FOR_FEE");

        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    function withdrawAvailable(
        address token,
        address to,
        uint256 amount
    ) external onlyCommunity {
        require(amount > 0, "ZERO_AMOUNT");
        uint256 available = getBalance(token) - reservedTotal[token];
        require(available >= amount, "INSUFFICIENT_AVAILABLE");

        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            require(success, "ETH_TRANSFER_FAILED");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }

        emit Withdrawn(token, to, amount);
    }

    function canDisburse(
        uint256 raffleId,
        address token
    ) public view returns (bool) {
        Lock storage L = locks[raffleId][token];
        if (!L.locked || L.disbursed) return false;

        // Get raffle details from community
        (
            ,
            uint64 endTime,
            ,
            uint32 maxParticipants,
            ,
            ,
            ,
            uint256 participantsCount
        ) = ICommunity(community).getRaffleCore(raffleId);

        // Can disburse if time ended OR max participants reached
        bool timeEnded = block.timestamp >= endTime;
        bool maxReached = maxParticipants > 0 &&
            participantsCount >= maxParticipants;

        return timeEnded || maxReached;
    }

    // Factory-triggered payouts
    function batchPay(
        uint256 raffleId,
        address token,
        address[] calldata tos,
        uint256[] calldata amounts
    ) external onlyFactory {
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
            reservedTotal[token] -= amount;
            total += amount;
            emit Paid(raffleId, token, to, amount);
        }
        emit BatchPaid(raffleId, token, total);

        if (L.paid == L.amount) {
            L.disbursed = true;
            emit Disbursed(raffleId, token);
        }
    }

    // Views
    function getBalance(address token) public view returns (uint256) {
        if (token == address(0)) {
            return address(this).balance;
        }
        return IERC20(token).balanceOf(address(this));
    }

    function getAvailable(address token) external view returns (uint256) {
        return getBalance(token) - reservedTotal[token];
    }
}
