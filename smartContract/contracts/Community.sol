// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {TimelockVault} from "./TimelockVault.sol";
import {RaffleHelpers} from "./libraries/RaffleHelpers.sol";
import {CommunityError} from "./libraries/Error.sol";

interface IRaffylFactory {
    function onRaffleCreated(uint256 id) external;

    function processBatchPayout(uint256 id) external;

    function treasury() external view returns (address);
}

contract Community {
    using SafeERC20 for IERC20;

    // Factory-coordinated raffle lifecycle
    enum RaffleStatus {
        Upcoming,
        Active,
        Drawn,
        PaidOut,
        Cancelled
    }

    struct Raffle {
        address token; // address(0) for ETH
        uint64 endTime;
        uint32 winnersCount;
        uint32 maxParticipants;
        RaffleStatus status;
        string name;
        uint256 totalPrize;
        bool requireCommunityMembership;
        // participants
        address[] participants;
        mapping(address => bool) isParticipant;
        // winners
        address[] winners;
        uint256[] winnerAmounts;
        mapping(address => bool) isWinner;
    }

    // Admin and factory metadata
    address public admin;
    address public immutable factory;

    // Community-level vault
    TimelockVault public immutable vault;

    // Membership
    mapping(address => bool) private _registered;

    // Raffles stored as data (no separate contracts)
    uint256 private _nextRaffleId = 1;
    uint256[] private _raffleIds;
    mapping(uint256 => Raffle) private _raffles;

    // Events
    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);
    event Registered(address indexed user);

    event FundedETH(address indexed from, uint256 amount);
    event FundedToken(
        address indexed from,
        address indexed token,
        uint256 amount
    );
    event WithdrawnETH(address indexed to, uint256 amount);
    event WithdrawnToken(
        address indexed to,
        address indexed token,
        uint256 amount
    );

    event RaffleCreated(
        uint256 indexed id,
        string name,
        address indexed token,
        uint64 endTime,
        uint32 winnersCount,
        uint32 maxParticipants,
        uint256 totalPrize,
        bool requireCommunityMembership
    );
    event RaffleLocked(
        uint256 indexed id,
        address indexed token,
        uint256 amount,
        uint64 endTime
    );
    event RegisteredForRaffle(uint256 indexed id, address indexed user);
    event WinnersDrawn(
        uint256 indexed id,
        bytes32 indexed seed,
        address[] winners,
        uint256[] amounts
    );
    event RaffleCancelled(uint256 indexed id);

    modifier onlyAdmin() {
        if (msg.sender != admin) revert CommunityError.OnlyAdmin();
        _;
    }

    modifier onlyFactory() {
        if (msg.sender != factory) revert CommunityError.OnlyFactory();
        _;
    }

    constructor(address _admin, address _factory) {
        if (_admin == address(0)) revert CommunityError.InvalidAddress();
        if (_factory == address(0)) revert CommunityError.InvalidAddress();
        admin = _admin;
        factory = _factory;
        vault = new TimelockVault(address(this), _factory);
    }

    // Membership
    function isRegistered(address user) external view returns (bool) {
        return _registered[user];
    }

    function register() external {
        if (_registered[msg.sender]) revert CommunityError.AlreadyRegistered();
        _registered[msg.sender] = true;
        emit Registered(msg.sender);
    }

    // Admin management
    function setAdmin(address newAdmin) external onlyAdmin {
        if (newAdmin == address(0)) revert CommunityError.InvalidAddress();
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    // Funding: Admin funds the TimelockVault via the Community
    receive() external payable {
        revert("USE_DEPOSIT");
    }

    function depositETH() external payable onlyAdmin {
        if (msg.value == 0) revert CommunityError.ZeroAmount();
        // forward ETH to vault
        (bool ok, ) = address(vault).call{value: msg.value}("");
        if (!ok) revert CommunityError.VaultETHDepositFail();
        emit FundedETH(msg.sender, msg.value);
    }

    function depositToken(address token, uint256 amount) external onlyAdmin {
        if (token == address(0)) revert CommunityError.InvalidAddress();
        if (amount == 0) revert CommunityError.ZeroAmount();
        // pull from admin directly into vault
        IERC20(token).safeTransferFrom(msg.sender, address(vault), amount);
        emit FundedToken(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) external onlyAdmin {
        if (amount == 0) revert CommunityError.ZeroAmount();
        vault.withdrawAvailable(token, admin, amount);

        if (token == address(0)) {
            emit WithdrawnETH(admin, amount);
        } else {
            emit WithdrawnToken(admin, token, amount);
        }
    }

    function getBalance(address token) external view returns (uint256) {
        return vault.getBalance(token);
    }

    // Raffle creation (data-only)
    // Add name back to creating raffles
    function createRaffle(
        string calldata name,
        address token,
        uint64 endTime,
        uint32 winnersCount,
        uint32 maxParticipants,
        uint256 totalPrize,
        bool requireMembership
    ) external onlyAdmin returns (uint256 id) {
        if (winnersCount == 0) revert CommunityError.NoWinners();
        if (endTime <= block.timestamp) revert CommunityError.EndTimeInPast();
        if (totalPrize == 0) revert CommunityError.ZeroAmount();

        id = _nextRaffleId++;
        Raffle storage r = _raffles[id];
        r.name = name;
        r.token = token;
        r.endTime = endTime;
        r.winnersCount = winnersCount;
        r.maxParticipants = maxParticipants;
        r.status = RaffleStatus.Upcoming;
        r.totalPrize = totalPrize;
        r.requireCommunityMembership = requireMembership;

        _raffleIds.push(id);
        emit RaffleCreated(
            id,
            name,
            token,
            endTime,
            winnersCount,
            maxParticipants,
            totalPrize,
            requireMembership
        );

        // Save to factory for global view
        IRaffylFactory(factory).onRaffleCreated(id);
    }

    // Lock funds and start raffle
    function lockRaffleFunds(uint256 id) external onlyAdmin {
        Raffle storage r = _raffles[id];
        if (r.status != RaffleStatus.Upcoming) revert CommunityError.NotUpcoming();
        if (r.endTime <= block.timestamp) revert CommunityError.EndTimeInPast();

        uint256 prize = r.totalPrize;
        address treasury = IRaffylFactory(factory).treasury();
        if (treasury != address(0)) {
            uint256 fee = (prize * 100) / 10000;
            if (fee > 0) {
                prize -= fee;
                vault.sendFee(r.token, treasury, fee);
            }
        }

        r.totalPrize = prize;
        vault.lockFunds(id, r.token, prize, r.endTime);
        r.status = RaffleStatus.Active;
        emit RaffleLocked(id, r.token, prize, r.endTime);
    }

    // Participant registration
    // update this to take an array of addresses
    function registerForRaffle(uint256 id, address[] calldata users) external {
        Raffle storage r = _raffles[id];
        if (r.status != RaffleStatus.Active) revert CommunityError.NotActive();
        if (block.timestamp >= r.endTime) revert CommunityError.RaffleEnded();
        if (r.maxParticipants > 0 && r.participants.length + users.length > r.maxParticipants) {
            revert CommunityError.ExceedsMaxParticipants();
        }
            
        for (uint i = 0; i < users.length; i++) {
            address user = users[i];
            if (r.isParticipant[user]) revert CommunityError.AlreadyJoined();
            if (r.requireCommunityMembership) {
                if (!_registered[user]) revert CommunityError.NotCommunityMember();
            }
            r.isParticipant[user] = true;
            r.participants.push(user);
            emit RegisteredForRaffle(id, user);
        }
    }

    // Draw winners
    function drawWinners(uint256 id) external onlyAdmin {
        Raffle storage r = _raffles[id];
        if (r.status != RaffleStatus.Active) revert CommunityError.NotActive();
        bool timeEnded = block.timestamp >= r.endTime;
        bool maxReached = r.maxParticipants > 0 &&
            r.participants.length >= r.maxParticipants;

        if (!timeEnded && !maxReached) revert CommunityError.NotEnded();

        uint256 n = r.participants.length;
        uint32 k = r.winnersCount;
        if (n < k) k = uint32(n);

        // change to gelato VRF for offchain randomness
        bytes32 seed = keccak256(
            abi.encodePacked(
                blockhash(block.number - 1),
                address(this),
                id,
                n,
                r.endTime
            )
        );

        address[] memory pool = new address[](n);
        for (uint256 i = 0; i < n; i++) {
            pool[i] = r.participants[i];
        }

        address[] memory sel = RaffleHelpers._selectWinners(pool, k, seed);
        r.winners = sel;

        uint256[] memory amounts = RaffleHelpers._equalShares(
            r.totalPrize,
            sel.length
        );
        r.winnerAmounts = amounts;

        for (uint256 i = 0; i < sel.length; i++) {
            r.isWinner[sel[i]] = true;
        }

        r.status = RaffleStatus.Drawn;
        emit WinnersDrawn(id, seed, sel, amounts);
        IRaffylFactory(factory).processBatchPayout(id);
    }

    function cancelRaffle(uint256 id) external onlyAdmin {
        Raffle storage r = _raffles[id];
        if (r.status != RaffleStatus.Active) revert CommunityError.NotActive();
        if (block.timestamp < r.endTime) revert CommunityError.NotEnded();
        if (r.participants.length > 0) revert CommunityError.ParticipantsExist();

        // Unlock funds in the vault and update status
        r.status = RaffleStatus.Cancelled;
        vault.unlockFunds(id, r.token);

        emit RaffleCancelled(id);
    }

    function markRafflePaidOut(uint256 id) external onlyFactory {
        Raffle storage r = _raffles[id];
        if (r.status != RaffleStatus.Drawn) revert CommunityError.NotDrawn();
        r.status = RaffleStatus.PaidOut;
    }

    // Views for Factory
    function getAllRaffleIds() external view returns (uint256[] memory) {
        return _raffleIds;
    }

    function getRaffleCore(
        uint256 id
    )
        external
        view
        returns (
            string memory name,
            address token,
            uint64 endTime,
            uint32 winnersCount,
            uint32 maxParticipants,
            uint8 status,
            uint256 totalPrize,
            bool requireCommunityMembership,
            uint256 participantsCount
        )
    {
        Raffle storage r = _raffles[id];
        if (r.endTime == 0) revert CommunityError.InvalidRaffleID();
        return (
            r.name,
            r.token,
            r.endTime,
            r.winnersCount,
            r.maxParticipants,
            uint8(r.status),
            r.totalPrize,
            r.requireCommunityMembership,
            r.participants.length
        );
    }

    function getWinners(uint256 id) external view returns (address[] memory winners, uint256[] memory amounts) {
        Raffle storage r = _raffles[id];
        if (r.endTime == 0) revert CommunityError.InvalidRaffleID();
        uint256 n = r.winners.length;
        winners = new address[](n);
        amounts = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            winners[i] = r.winners[i];
            amounts[i] = r.winnerAmounts[i];
        }
    }

    function isParticipantInRaffle(uint256 id, address user) external view returns (bool) {
        return _raffles[id].isParticipant[user];
    }

    function getRaffleParticipants(uint256 id) external view returns (address[] memory) {
        return _raffles[id].participants;
    }

    function getRaffleCount() external view returns (uint256) {
        return _raffleIds.length;
    }

    // View: token for raffle ID (used by Factory orchestrator)
    function getRaffleToken(uint256 id) external view returns (address) {
        Raffle storage r = _raffles[id];
        if (r.endTime == 0) revert CommunityError.InvalidRaffleID();
        return r.token;
    }
}
