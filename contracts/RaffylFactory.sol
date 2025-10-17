// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ICommunity } from "./interfaces/ICommunity.sol";
import { Community } from "./Community.sol";

interface ITimelockVault {
    function batchPay(uint256 raffleId, address token, address[] calldata tos, uint256[] calldata amounts) external;
    function markDisbursed(uint256 raffleId, address token) external;
}

/**
 * @title RaffylFactory
 * @notice Lightweight orchestration per newProposed.md:
 *  - Deploys Community contracts
 *  - Tracks communities and globally lists raffles (by community + id)
 *  - Processes payouts centrally via the community's TimelockVault after timelock expiry
 *  - No per-raffle contracts. Raffles are structs stored inside Community.
 */
contract RaffylFactory {
    // Global registries
    address[] private _communities;
    mapping(bytes32 => address) public ensToCommunity;
    mapping(address => bool) public isCommunity;

    struct RaffleRef {
        address community;
        uint256 id;
    }
    RaffleRef[] private _raffles; // global view: (community, raffleId)

    // Uses top-level ITimelockVault interface declared above

    // Events
    event CommunityCreated(address indexed admin, address indexed community, string ensName);
    event RaffleRegistered(address indexed community, uint256 indexed id);
    event BatchPayoutProcessed(address indexed community, uint256 indexed id, uint256 totalPaid);

    // Community lifecycle
    function createCommunity(string calldata ensName) external returns (address community) {
        bytes32 key = keccak256(bytes(ensName));
        require(ensToCommunity[key] == address(0), "ENS_ALREADY_REGISTERED");
        // Community constructor expects (admin, ensName, factory)
        community = address(new Community(msg.sender, ensName, address(this)));
        ensToCommunity[key] = community;
        _communities.push(community);
        isCommunity[community] = true;
        emit CommunityCreated(msg.sender, community, ensName);
    }

    // Views
    function getCommunities() external view returns (address[] memory) {
        return _communities;
    }

    function getCommunityByENS(string calldata ensName) external view returns (address) {
        return ensToCommunity[keccak256(bytes(ensName))];
    }

    // Global raffles view (parallel arrays for ABI simplicity)
    function getAllRaffles() external view returns (address[] memory communities, uint256[] memory ids) {
        uint256 n = _raffles.length;
        communities = new address[](n);
        ids = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            communities[i] = _raffles[i].community;
            ids[i] = _raffles[i].id;
        }
    }

    // Called by Community when a raffle is created to index globally
    function onRaffleCreated(uint256 id) external {
        require(isCommunity[msg.sender], "ONLY_COMMUNITY");
        _raffles.push(RaffleRef({community: msg.sender, id: id}));
        emit RaffleRegistered(msg.sender, id);
    }

    // Community requests centralized batch payout; Factory orchestrates via the community's vault
    function processBatchPayout(uint256 id) external {
        require(isCommunity[msg.sender], "ONLY_COMMUNITY");

        // Read winners and amounts from Community
        (address[] memory winners, uint256[] memory amounts) = ICommunity(msg.sender).getWinners(id);
        require(winners.length == amounts.length, "LEN_MISMATCH");
        require(winners.length > 0, "NO_WINNERS");

        // Read core raffle to get the token
        (
            address token,
            /*uint64 endTime*/,
            /*uint32 winnersCount*/,
            /*uint8 mode*/,
            /*uint8 status*/,
            uint256 totalPrize,
            /*uint256 remainingPrize*/,
            /*bool requireCommunityMembership*/,
            /*string memory metaCID*/,
            /*uint256 participantsCount*/
        ) = ICommunity(msg.sender).getRaffleCore(id);

        // Access the community vault
        address vaultAddr = ICommunity(msg.sender).vault();
        ITimelockVault vault = ITimelockVault(vaultAddr);

        // Execute batch payout (TimelockVault enforces timelock and totals)
        vault.batchPay(id, token, winners, amounts);

        // Mark claims inside Community to prevent duplicates
        for (uint256 i = 0; i < winners.length; i++) {
            ICommunity(msg.sender).recordClaim(id, winners[i]);
        }

        // Finalize disbursement (requires full paid == locked)
        vault.markDisbursed(id, token);

        emit BatchPayoutProcessed(msg.sender, id, _sum(amounts));
        // Community updates its own raffle status to PaidOut once all claimed via recordClaim path.
        // Alternatively, PaidOut can be set after this by Community if desired.
    }

    // Helpers
    function _sum(uint256[] memory arr) internal pure returns (uint256 s) {
        for (uint256 i = 0; i < arr.length; i++) {
            s += arr[i];
        }
    }
}
