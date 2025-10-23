// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IRaffle {
    enum RaffleStatus { Upcoming, Active, Drawn, PaidOut, Cancelled }
    enum DistributionMode { Equal, Custom }

    struct Winner { address account; uint256 amount; }

    function community() external view returns (address);
    function prizeToken() external view returns (address); // address(0) for ETH
    function endTime() external view returns (uint64);
    function numberOfWinners() external view returns (uint32);
    function distributionMode() external view returns (DistributionMode);
    function status() external view returns (RaffleStatus);

    function participantsCount() external view returns (uint256);
    function isParticipant(address user) external view returns (bool);

    function register(address user) external;
    function start() external;
    function drawWinners() external;
    function winners() external view returns (Winner[] memory);
    function claim() external;
    function batchPayout() external;

    event Registered(address indexed user);
    event Started(uint64 indexed endTime);
    event WinnersDrawn(bytes32 indexed seed, address[] winners);
    event Claimed(address indexed winner, uint256 amount);
    event BatchPayout(uint256 totalPaid);
}