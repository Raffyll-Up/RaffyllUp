// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ICommunity {
    // Admin/Membership (kept for compatibility)
    function admin() external view returns (address);
    function isRegistered(address user) external view returns (bool);

    // Vault accessor
    function vault() external view returns (address);

    // Raffle views for Factory orchestration
    function getAllRaffleIds() external view returns (uint256[] memory);

    // Core raffle state (enums are encoded as uint8 externally)
    function getRaffleCore(uint256 id) external view returns (
        address token,
        uint64 endTime,
        uint32 winnersCount,
        uint32 maxParticipants,
        uint8 status,
        uint256 totalPrize,
        bool requireCommunityMembership,
        uint256 participantsCount
    );

    // Winners view
    function getWinners(uint256 id) external view returns (address[] memory winners, uint256[] memory amounts);

    // Factory marks claims to prevent duplicate payouts
    function markRafflePaidOut(uint256 id) external;
}