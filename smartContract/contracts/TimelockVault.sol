// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ICommunity} from "./interfaces/ICommunity.sol";
import {TimelockVaultError} from "./libraries/Error.sol";

/**
 * @title TimelockVault
 * @notice Community-level multi-token vault that locks funds per raffleId and releases only after timelock.
 * Factory orchestrates payouts; Community performs funding and locking.
 */
contract TimelockVault is ReentrancyGuard {
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
        if (msg.sender != community) revert TimelockVaultError.ONLY_COMMUNITY();
        _;
    }

    modifier onlyFactory() {
        if (msg.sender != factory) revert TimelockVaultError.ONLY_FACTORY();
        _;
    }

    constructor(address _community, address _factory) {
        if (_community == address(0)) revert TimelockVaultError.INVALID_COMMUNITY();
        if (_factory == address(0)) revert TimelockVaultError.INVALID_FACTORY();
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
        if (endTime <= block.timestamp) revert TimelockVaultError.ENDTIME_IN_PAST();
        if (amount == 0) revert TimelockVaultError.ZERO_AMOUNT();
        
        Lock storage L = locks[raffleId][token];
        if (L.locked) revert TimelockVaultError.ALREADY_LOCKED();
        
        // ensure sufficient available (balance - reserved)
        uint256 currentBalance = getBalance(token);
        uint256 available = currentBalance - reservedTotal[token];
        if (available < amount) revert TimelockVaultError.INSUFFICIENT_AVAILABLE();
        
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
        if (!L.locked) revert TimelockVaultError.NOT_LOCKED();
        if (L.disbursed) revert TimelockVaultError.ALREADY_DISBURSED();

        uint256 amount = L.amount;
        reservedTotal[token] -= amount;

        delete locks[raffleId][token];

        emit Unlocked(raffleId, token, amount);
    }

    function sendFee(
        address token,
        address to,
        uint256 amount
    ) external onlyCommunity nonReentrant {
        if (amount == 0) revert TimelockVaultError.ZERO_AMOUNT();
        
        uint256 available = getBalance(token) - reservedTotal[token];
        if (available < amount) revert TimelockVaultError.INSUFFICIENT_FOR_FEE();

        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) revert TimelockVaultError.ETH_TRANSFER_FAILED();
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    function withdrawAvailable(
        address token,
        address to,
        uint256 amount
    ) external onlyCommunity nonReentrant {
        if (amount == 0) revert TimelockVaultError.ZERO_AMOUNT();
        
        uint256 available = getBalance(token) - reservedTotal[token];
        if (available < amount) revert TimelockVaultError.INSUFFICIENT_AVAILABLE();

        if (token == address(0)) {
            (bool success, ) = payable(to).call{value: amount}("");
            if (!success) revert TimelockVaultError.ETH_TRANSFER_FAILED();
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
            ,  // skip name
            ,  // skip token
            uint64 endTime,
            ,  // skip winnersCount
            uint32 maxParticipants,
            ,  // skip status
            ,  // skip totalPrize
            ,  // skip requireCommunityMembership
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
    ) external onlyFactory nonReentrant {
        if (tos.length != amounts.length) revert TimelockVaultError.LEN_MISMATCH();
        if (!canDisburse(raffleId, token)) revert TimelockVaultError.TIMELOCK_ACTIVE();
        
        Lock storage L = locks[raffleId][token];
        uint256 total;
        
        for (uint256 i = 0; i < tos.length; i++) {
            address to = tos[i];
            uint256 amount = amounts[i];
            
            if (to == address(0)) revert TimelockVaultError.INVALID_TO();
            if (amount == 0) revert TimelockVaultError.ZERO_AMOUNT();
            if (L.paid + amount > L.amount) revert TimelockVaultError.OVERPAY();
            
            // Transfer funds
            if (token == address(0)) {
                (bool success, ) = payable(to).call{value: amount}("");
                if (!success) revert TimelockVaultError.ETH_TRANSFER_FAILED();
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