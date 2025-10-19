// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ICommunity} from "./interfaces/ICommunity.sol";
import {Community} from "./Community.sol";

interface ITimelockVault {
    function batchPay(
        uint256 raffleId,
        address token,
        address[] calldata tos,
        uint256[] calldata amounts
    ) external;
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
    mapping(address => bool) public isCommunity;
    mapping(address => string) public communityNames;

    struct RaffleRef {
        address community;
        uint256 id;
    }
    RaffleRef[] private _raffles; // global view: (community, raffleId)

    // Uses top-level ITimelockVault interface declared above

    // Events
    event CommunityCreated(address indexed admin, address indexed community, string name);
    event RaffleRegistered(address indexed community, uint256 indexed id);
    event BatchPayoutProcessed(
        address indexed community,
        uint256 indexed id,
        uint256 totalPaid
    );

    // Community lifecycle
    // Add name back to creating communities
    function createCommunity(string calldata name) external returns (address community) {
        // Community constructor expects (admin, factory)
        community = address(new Community(msg.sender, address(this)));
        _communities.push(community);
        isCommunity[community] = true;
        communityNames[community] = name;
        emit CommunityCreated(msg.sender, community, name);
    }

    // Views
    function getCommunities() external view returns (address[] memory) {
        return _communities;
    }

    // Global raffles view (parallel arrays for ABI simplicity)
    function getAllRaffles()
        external
        view
        returns (address[] memory communities, uint256[] memory ids)
    {
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
        (address[] memory winners, uint256[] memory amounts) = ICommunity(
            msg.sender
        ).getWinners(id);
        require(winners.length == amounts.length, "LEN_MISMATCH");
        require(winners.length > 0, "NO_WINNERS");

        // Read core raffle to get the token
        (address token, , , , , , ) = ICommunity(msg.sender).getRaffleCore(id);

        // Access the community vault
        address vaultAddr = ICommunity(msg.sender).vault();
        ITimelockVault vault = ITimelockVault(vaultAddr);

        // Execute batch payout (TimelockVault enforces timelock and totals)
        vault.batchPay(id, token, winners, amounts);

        // The vault marks itself as disbursed internally. Now, mark the raffle as paid out.
        ICommunity(msg.sender).markRafflePaidOut(id);

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
