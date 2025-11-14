// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ICommunity} from "./interfaces/ICommunity.sol";
import {Community} from "./Community.sol";
import {FactoryError} from "./libraries/Error.sol";

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
 * @notice Deploys and indexes Community contracts, tracks raffles globally, and coordinates batch payouts.
 */
contract RaffylFactory {
    address public owner;
    address public treasury;

    // Registries
    address[] private _communities;
    mapping(address => bool) public isCommunity;
    mapping(address => string) public communityNames;

    struct RaffleRef {
        address community;
        uint256 id;
    }
    RaffleRef[] private _raffles;

    // Events
    event CommunityCreated(address indexed admin, address indexed community, string name);
    event RaffleRegistered(address indexed community, uint256 indexed id);
    event BatchPayoutProcessed(address indexed community, uint256 indexed id, uint256 indexed totalPaid);
    event TreasuryChanged(address indexed newTreasury);

    modifier onlyOwner() {
        if(msg.sender != owner) revert FactoryError.NOT_OWNER();
        _;
    }

    constructor() {
        owner = msg.sender;
    }


    // --- Admin ---
    function setTreasury(address _treasury) external onlyOwner {
        if(_treasury == address(0)) revert FactoryError.INVALID_ADDRESS();
        treasury = _treasury;
        emit TreasuryChanged(_treasury);
    }

    // --- Community Lifecycle ---
    function createCommunity(string calldata name) external returns (address community) {
        community = address(new Community(msg.sender, address(this)));
        _communities.push(community);
        isCommunity[community] = true;
        communityNames[community] = name;

        emit CommunityCreated(msg.sender, community, name);
    }

    function getCommunities() external view returns (address[] memory) {
        return _communities;
    }

    // --- Raffle Registry ---
    function getAllRaffles()
        external
        view
        returns (address[] memory communities, uint256[] memory ids)
    {
        RaffleRef[] storage raffles = _raffles;
        uint256 n = raffles.length;
        communities = new address[](n);
        ids = new uint256[](n);

        for (uint256 i; i < n; ++i) {
            RaffleRef storage ref = raffles[i];
            communities[i] = ref.community;
            ids[i] = ref.id;
        }
    }

    function onRaffleCreated(uint256 id) external {
        if (!isCommunity[msg.sender]) revert FactoryError.ONLY_COMMUNITY();
        _raffles.push(RaffleRef({community: msg.sender, id: id}));
        emit RaffleRegistered(msg.sender, id);
    }

    // --- Payout Orchestration ---
    function processBatchPayout(uint256 id) external {
        if (!isCommunity[msg.sender]) revert FactoryError.ONLY_COMMUNITY();

        (address[] memory winners, uint256[] memory amounts) = ICommunity(msg.sender).getWinners(id);
        if (winners.length != amounts.length) revert FactoryError.LEN_MISMATCH();
        if (winners.length == 0) revert FactoryError.NO_WINNERS();

        (, address token, , , , , , , ) = ICommunity(msg.sender).getRaffleCore(id);

        address vaultAddr = ICommunity(msg.sender).vault();
        if (vaultAddr == address(0)) revert FactoryError.INVALID_VAULT();

        ITimelockVault(vaultAddr).batchPay(id, token, winners, amounts);
        ICommunity(msg.sender).markRafflePaidOut(id);

        emit BatchPayoutProcessed(msg.sender, id, _sum(amounts));
    }

    // --- Helpers ---
    function _sum(uint256[] memory arr) internal pure returns (uint256 s) {
        unchecked {
            for (uint256 i; i < arr.length; ++i) s += arr[i];
        }
    }
}
