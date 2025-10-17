// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { IERC20 } from "./interfaces/IERC20.sol";
import { SafeTransferLib } from "./libraries/SafeTransferLib.sol";
/* RewardsLib removed per lightweight architecture; equalShares implemented inline */
import { TimelockVault } from "./TimelockVault.sol";

interface IRaffylFactory {
    function onRaffleCreated(uint256 id) external;
    function processBatchPayout(uint256 id) external;
}

contract Community {
    using SafeTransferLib for IERC20;

    // Factory-coordinated raffle lifecycle
    enum RaffleStatus { Upcoming, Active, Drawn, PaidOut, Cancelled }
    enum DistributionMode { Equal, Custom }

    struct Raffle {
        address token; // address(0) for ETH
        uint64 endTime;
        uint32 winnersCount;
        DistributionMode mode;
        RaffleStatus status;
        uint256 totalPrize;
        uint256 remainingPrize;
        bool requireCommunityMembership;
        string metaCID;

        // participants
        address[] participants;
        mapping(address => bool) isParticipant;

        // winners
        address[] winners;
        uint256[] winnerAmounts;
        mapping(address => bool) isWinner;
        mapping(address => bool) claimed;

        // custom distribution
        uint256[] customAmounts;
    }

    // Admin and factory metadata
    address public admin;
    address public immutable factory;
    string public ensName;

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
    event EnsNameUpdated(string previousName, string newName);
    event Registered(address indexed user);

    event FundedETH(address indexed from, uint256 amount);
    event FundedToken(address indexed from, address indexed token, uint256 amount);

    event RaffleCreated(uint256 indexed id, address indexed token, uint64 endTime, uint32 winnersCount, DistributionMode mode, uint256 totalPrize, string metaCID);
    event RaffleLocked(uint256 indexed id, address indexed token, uint256 amount, uint64 endTime);
    event RegisteredForRaffle(uint256 indexed id, address indexed user);
    event WinnersDrawn(uint256 indexed id, bytes32 indexed seed, address[] winners, uint256[] amounts);
    event Claimed(uint256 indexed id, address indexed winner, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "ONLY_ADMIN");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == factory, "ONLY_FACTORY");
        _;
    }

    constructor(address _admin, string memory _ensName, address _factory) {
        require(_admin != address(0), "INVALID_ADMIN");
        require(_factory != address(0), "INVALID_FACTORY");
        admin = _admin;
        factory = _factory;
        ensName = _ensName;
        vault = new TimelockVault(address(this), _factory);
    }

    // Membership
    function isRegistered(address user) external view returns (bool) {
        return _registered[user];
    }

    function register() external {
        require(!_registered[msg.sender], "ALREADY_REGISTERED");
        _registered[msg.sender] = true;
        emit Registered(msg.sender);
    }

    // Admin can pre-register users (e.g., verified off-chain via gasless sponsorship)
    function registerFor(address user) external onlyAdmin {
        require(user != address(0), "INVALID_USER");
        require(!_registered[user], "ALREADY_REGISTERED");
        _registered[user] = true;
        emit Registered(user);
    }

    // Admin management
    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "INVALID_ADMIN");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    function setEnsName(string calldata newName) external onlyAdmin {
        emit EnsNameUpdated(ensName, newName);
        ensName = newName;
    }

    // Funding: Admin funds the TimelockVault via the Community
    receive() external payable {
        revert("USE_DEPOSIT");
    }

    function depositETH() external payable onlyAdmin {
        require(msg.value > 0, "ZERO_AMOUNT");
        // forward ETH to vault
        (bool ok, ) = address(vault).call{value: msg.value}(abi.encodeWithSignature("depositETH()"));
        require(ok, "VAULT_ETH_DEPOSIT_FAIL");
        emit FundedETH(msg.sender, msg.value);
    }

    function depositToken(address token, uint256 amount) external onlyAdmin {
        require(token != address(0), "INVALID_TOKEN");
        require(amount > 0, "ZERO_AMOUNT");
        // pull from admin directly into vault
        IERC20(token).safeTransferFrom(msg.sender, address(vault), amount);
        // record deposit balances inside vault
        vault.recordTokenDeposit(token, amount);
        emit FundedToken(msg.sender, token, amount);
    }

    function getBalance(address token) external view returns (uint256) {
        return vault.getBalance(token);
    }

    // Raffle creation (data-only)
    function createRaffle(
        address token,
        uint64 endTime,
        uint32 winnersCount,
        DistributionMode mode,
        uint256 totalPrize,
        string calldata metaCID
    ) external onlyAdmin returns (uint256 id) {
        require(winnersCount > 0, "NO_WINNERS");
        require(endTime > block.timestamp, "ENDTIME_IN_PAST");
        require(totalPrize > 0, "ZERO_PRIZE");

        id = _nextRaffleId++;
        Raffle storage r = _raffles[id];
        r.token = token;
        r.endTime = endTime;
        r.winnersCount = winnersCount;
        r.mode = mode;
        r.status = RaffleStatus.Upcoming;
        r.totalPrize = totalPrize;
        r.remainingPrize = totalPrize;
        r.requireCommunityMembership = true;
        if (bytes(metaCID).length > 0) {
            r.metaCID = metaCID;
        }

        _raffleIds.push(id);
        emit RaffleCreated(id, token, endTime, winnersCount, mode, totalPrize, metaCID);

        // Save to factory for global view
        IRaffylFactory(factory).onRaffleCreated(id);
    }

    // Lock funds and start raffle
    function lockRaffleFunds(uint256 id) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Upcoming, "ONLY_BEFORE_START");
        require(r.endTime > block.timestamp, "INVALID_ENDTIME");
        vault.lockFunds(id, r.token, r.totalPrize, r.endTime);
        r.status = RaffleStatus.Active;
        emit RaffleLocked(id, r.token, r.totalPrize, r.endTime);
    }

    // Participant registration
    function registerForRaffle(uint256 id) external {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Active, "NOT_ACTIVE");
        require(block.timestamp < r.endTime, "ENDED");
        address user = msg.sender;
        require(!r.isParticipant[user], "ALREADY_JOINED");
        if (r.requireCommunityMembership) {
            require(_registered[user], "NOT_COMMUNITY_MEMBER");
        }
        r.isParticipant[user] = true;
        r.participants.push(user);
        emit RegisteredForRaffle(id, user);
    }

    // Admin updates pre-start configs
    function setEndTime(uint256 id, uint64 newEndTime) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Upcoming, "ONLY_BEFORE_START");
        require(newEndTime > block.timestamp, "ENDTIME_IN_PAST");
        r.endTime = newEndTime;
    }

    function setWinnersCount(uint256 id, uint32 newCount) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Upcoming, "ONLY_BEFORE_START");
        require(newCount > 0, "NO_WINNERS");
        r.winnersCount = newCount;
    }

    function setDistributionMode(uint256 id, DistributionMode newMode) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Upcoming, "ONLY_BEFORE_START");
        r.mode = newMode;
    }

    function setCustomAmounts(uint256 id, uint256[] calldata amounts) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.mode == DistributionMode.Custom, "MODE_NOT_CUSTOM");
        require(r.status == RaffleStatus.Upcoming || r.status == RaffleStatus.Active, "LOCKED");
        require(amounts.length == r.winnersCount, "LEN_MISMATCH");
        require(_sumMemory(amounts) == r.totalPrize, "AMOUNTS_SUM_MISMATCH");
        r.customAmounts = amounts;
    }

    function setRequireCommunityMembership(uint256 id, bool value) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Upcoming, "ONLY_BEFORE_START");
        r.requireCommunityMembership = value;
    }

    function setMetaCID(uint256 id, string calldata cid) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Upcoming, "ONLY_BEFORE_START");
        require(bytes(r.metaCID).length == 0, "CID_LOCKED");
        require(bytes(cid).length > 0, "EMPTY_CID");
        r.metaCID = cid;
    }

    // Draw winners
    function drawWinners(uint256 id) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Active, "NOT_ACTIVE");
        require(block.timestamp >= r.endTime, "NOT_ENDED");

        uint256 n = r.participants.length;
        uint32 k = r.winnersCount;
        if (n < k) k = uint32(n);

        bytes32 seed = keccak256(
            abi.encodePacked(blockhash(block.number - 1), address(this), id, n, r.endTime)
        );

        address[] memory pool = new address[](n);
        for (uint256 i = 0; i < n; i++) { pool[i] = r.participants[i]; }

        address[] memory sel = _selectWinners(pool, k, seed);
        r.winners = sel;

        uint256[] memory amounts;
        if (r.mode == DistributionMode.Equal) {
            amounts = _equalShares(r.totalPrize, sel.length);
        } else {
            require(r.customAmounts.length == sel.length, "AMOUNTS_NOT_SET");
            require(_sumStorage(r.customAmounts) == r.totalPrize, "AMOUNTS_SUM_MISMATCH");
            amounts = new uint256[](sel.length);
            for (uint256 i = 0; i < sel.length; i++) { amounts[i] = r.customAmounts[i]; }
        }
        r.winnerAmounts = amounts;

        for (uint256 i = 0; i < sel.length; i++) {
            r.isWinner[sel[i]] = true;
        }

        r.status = RaffleStatus.Drawn;
        emit WinnersDrawn(id, seed, sel, amounts);
    }

    // Request factory to process payouts centrally (batch payout)
    function requestFactoryPayout(uint256 id) external onlyAdmin {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Drawn, "NOT_DRAWN");
        IRaffylFactory(factory).processBatchPayout(id);
    }

    // Claim (optional individual path if factory exposes single-winner payout)
    // Community records claimed to prevent duplicates; factory enforces timelock + funds
    function recordClaim(uint256 id, address winner) external onlyFactory {
        Raffle storage r = _raffles[id];
        require(r.status == RaffleStatus.Drawn, "NOT_DRAWN");
        require(r.isWinner[winner], "NOT_WINNER");
        require(!r.claimed[winner], "ALREADY_CLAIMED");
        r.claimed[winner] = true;
        emit Claimed(id, winner, _amountFor(r, winner));
        if (_allClaimed(r)) {
            r.status = RaffleStatus.PaidOut;
        }
    }

    // Views for Factory
    function getAllRaffleIds() external view returns (uint256[] memory) {
        return _raffleIds;
    }

    function getRaffleCore(uint256 id) external view returns (
        address token,
        uint64 endTime,
        uint32 winnersCount,
        uint8 mode,
        uint8 status,
        uint256 totalPrize,
        uint256 remainingPrize,
        bool requireCommunityMembership,
        string memory metaCID,
        uint256 participantsCount
    ) {
        Raffle storage r = _raffles[id];
        require(r.endTime != 0, "INVALID_ID");
        return (
            r.token,
            r.endTime,
            r.winnersCount,
            uint8(r.mode),
            uint8(r.status),
            r.totalPrize,
            r.remainingPrize,
            r.requireCommunityMembership,
            r.metaCID,
            r.participants.length
        );
    }

    function getWinners(uint256 id) external view returns (address[] memory winners, uint256[] memory amounts) {
        Raffle storage r = _raffles[id];
        require(r.endTime != 0, "INVALID_ID");
        uint256 n = r.winners.length;
        winners = new address[](n);
        amounts = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            winners[i] = r.winners[i];
            amounts[i] = r.winnerAmounts[i];
        }
    }

    function _amountFor(Raffle storage r, address user) internal view returns (uint256) {
        for (uint256 i = 0; i < r.winners.length; i++) {
            if (r.winners[i] == user) return r.winnerAmounts[i];
        }
        return 0;
    }

    function _allClaimed(Raffle storage r) internal view returns (bool) {
        for (uint256 i = 0; i < r.winners.length; i++) {
            if (!r.claimed[r.winners[i]]) return false;
        }
        return true;
    }

    function _sumMemory(uint256[] memory arr) internal pure returns (uint256 s) {
        for (uint256 i = 0; i < arr.length; i++) { s += arr[i]; }
    }

    function _sumStorage(uint256[] storage arr) internal view returns (uint256 s) {
        for (uint256 i = 0; i < arr.length; i++) { s += arr[i]; }
    }

    // Equal distribution helper: splits total into n shares, distributing remainder by +1 wei to first rem winners
    function _equalShares(uint256 total, uint256 n) internal pure returns (uint256[] memory shares) {
        require(n > 0, "NO_WINNERS");
        shares = new uint256[](n);
        uint256 base = total / n;
        uint256 rem = total - (base * n);
        for (uint256 i = 0; i < n; i++) {
            shares[i] = base + (i < rem ? 1 : 0);
        }
    }

    function _selectWinners(address[] memory pool, uint32 k, bytes32 seed) internal pure returns (address[] memory) {
        address[] memory res = new address[](k);
        uint256 n = pool.length;
        for (uint256 i = 0; i < k; i++) {
            uint256 r = uint256(keccak256(abi.encode(seed, i))) % (n - i);
            address tmp = pool[i];
            pool[i] = pool[i + r];
            pool[i + r] = tmp;
            res[i] = pool[i];
        }
        return res;
    }

    // View: token for raffle ID (used by Factory orchestrator)
    function getRaffleToken(uint256 id) external view returns (address) {
        Raffle storage r = _raffles[id];
        require(r.endTime != 0, "INVALID_ID");
        return r.token;
    }
}