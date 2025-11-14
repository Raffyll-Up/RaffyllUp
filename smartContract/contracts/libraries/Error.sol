// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library CommunityError {
    error OnlyAdmin();
    error OnlyFactory();
    error InvalidAddress();
    error AlreadyRegistered();
    error ZeroAmount();
    error VaultETHDepositFail();
    error NoWinners();
    error EndTimeInPast();
    error NotUpcoming();
    error NotActive();
    error RaffleEnded();
    error AlreadyJoined();
    error NotCommunityMember();
    error NotEnded();
    error NotDrawn();
    error ParticipantsExist();
    error InvalidRaffleID();
    error ExceedsMaxParticipants();
}

library FactoryError {
    error INVALID_ADDRESS();
    error NOT_OWNER();
    error ONLY_COMMUNITY();
    error LEN_MISMATCH();
    error NO_WINNERS();
    error INVALID_VAULT();
}

library TimelockVaultError {
    error ONLY_COMMUNITY();
    error ONLY_FACTORY();
    error INVALID_COMMUNITY();
    error INVALID_FACTORY();
    error ENDTIME_IN_PAST();
    error ZERO_AMOUNT();
    error ALREADY_LOCKED();
    error INSUFFICIENT_AVAILABLE();
    error NOT_LOCKED();
    error ALREADY_DISBURSED();
    error INSUFFICIENT_FOR_FEE();
    error LEN_MISMATCH();
    error ETH_TRANSFER_FAILED();
    error TIMELOCK_ACTIVE();
    error INVALID_TO();
    error OVERPAY();
}