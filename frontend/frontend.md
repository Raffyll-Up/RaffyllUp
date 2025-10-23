# Raffyl Frontend Implementation Guide

## Overview

This document outlines the frontend implementation for the Raffyl dApp. The application is a decentralized raffle platform where users can create communities and host raffles. The frontend should interact with the deployed smart contracts to provide a seamless user experience.

## User Roles

There are three main user roles in the Raffyl dApp:

1.  **Owner**: The owner of the `RaffylFactory` contract. This role is responsible for managing the treasury address.
2.  **Community Admin**: The creator of a `Community`. This role is responsible for managing the community, creating raffles, and managing the raffle lifecycle.
3.  **User**: A regular user who can join communities and participate in raffles.

## Screens

The following screens are required to implement the full functionality of the Raffyl smart contracts.

### 1. Global Screens

These screens are accessible to all users and provide a global view of the Raffyl platform.

#### 1.1. Home Screen / All Raffles

- **Purpose**: To display all raffles from all communities. This is the main landing page for the dApp.
- **Functionality**:
  - Fetch all raffles by calling `getAllRaffles()` on the `RaffylFactory` contract.
  - For each raffle, display the following information (by calling `getRaffleCore()` on the respective `Community` contract):
    - Raffle Name
    - Community Name
    - Token (ETH or ERC20 address)
    - End Time
    - Number of Winners
    - Maximum Participants
    - Status (Upcoming, Active, Drawn, PaidOut, Cancelled)
    - Total Prize
    - Number of Participants
  - Provide a button to "View Raffle" which navigates to the `Raffle Details Screen`.
  - Provide a button to "Create Community" which navigates to the `Create Community Screen`.
  - Provide a button to "View All Communities" which navigates to the `All Communities Screen`.

#### 1.2. All Communities Screen

- **Purpose**: To display all communities on the platform.
- **Functionality**:
  - Fetch all communities by calling `getCommunities()` on the `RaffylFactory` contract.
  - For each community, display the following information:
    - Community Name
    - Community Address
  - Provide a button to "View Community" which navigates to the `Community Details Screen`.

### 2. Community Screens

These screens are related to the management and viewing of a specific community.

#### 2.1. Create Community Screen

- **Purpose**: To allow a user to create a new community.
- **Functionality**:
  - A form with an input for the "Community Name".
  - A button to "Create Community" which calls the `createCommunity()` function on the `RaffylFactory` contract.
  - After successful creation, redirect the user to the `Community Details Screen` for the newly created community.

#### 2.2. Community Details Screen

- **Purpose**: To display the details of a specific community and its raffles.
- **Functionality**:
  - Display the Community Name and Address.
  - Display a list of all raffles for this community by calling `getAllRaffleIds()` on the `Community` contract.
  - For each raffle, display the same information as on the `Home Screen`.
  - Provide a button to "View Raffle" for each raffle, which navigates to the `Raffle Details Screen`.
  - **For Community Members**:
    - A button to "Join Community" which calls `register()` on the `Community` contract.
  - **For Community Admin**:
    - A button to "Create Raffle" which navigates to the `Create Raffle Screen`.
    - A section to manage the community's funds in the `TimelockVault`.
      - Display the balance of ETH and any ERC20 tokens in the vault by calling `getBalance()` on the `Community` contract.
      - A form to "Deposit ETH" which calls `depositETH()` on the `Community` contract.
      - A form to "Deposit Tokens" which calls `depositToken()` on the `Community` contract.
      - A form to "Withdraw Funds" which calls `withdraw()` on the `Community` contract.
    - A section to manage the community admin by calling `setAdmin()` on the `Community` contract.

### 3. Raffle Screens

These screens are related to the management and viewing of a specific raffle.

#### 3.1. Create Raffle Screen

- **Purpose**: To allow a community admin to create a new raffle.
- **Functionality**:
  - A form with the following inputs:
    - Raffle Name (string)
    - Token Address (address, `0x0` for ETH)
    - End Time (datetime)
    - Number of Winners (number)
    - Max Participants (number, 0 for unlimited)
    - Total Prize (number)
    - Require Community Membership (boolean)
  - A button to "Create Raffle" which calls the `createRaffle()` function on the `Community` contract.
  - After successful creation, redirect the user to the `Raffle Details Screen` for the newly created raffle.

#### 3.2. Raffle Details Screen

- **Purpose**: To display the details of a specific raffle and allow users to interact with it.
- **Functionality**:
  - Display all the details of the raffle.
  - Display the list of participants.
  - **For Users**:
    - If the raffle is `Active`, a button to "Join Raffle" which calls `registerForRaffle()` on the `Community` contract.
  - **For Community Admin**:
    - If the raffle is `Upcoming`, a button to "Lock Funds & Start Raffle" which calls `lockRaffleFunds()` on the `Community` contract.
    - If the raffle is `Active` and has ended (either by time or max participants), a button to "Draw Winners" which calls `drawWinners()` on the `Community` contract.
    - If the raffle is `Active`, has ended, and has no participants, a button to "Cancel Raffle" which calls `cancelRaffle()` on the `Community` contract.
  - **After Winners are Drawn**:
    - Display the list of winners and the amount they have won.

### 4. Owner Screens

These screens are for the owner of the `RaffylFactory` contract.

#### 4.1. Owner Dashboard

- **Purpose**: To allow the owner to manage the `RaffylFactory` contract.
- **Functionality**:
  - A section to manage the treasury address.
    - Display the current treasury address.
    - A form to "Set Treasury Address" which calls `setTreasury()` on the `RaffylFactory` contract.

## Wallet Integration

The frontend must integrate with a wallet like MetaMask to allow users to connect their wallets and interact with the smart contracts. All transactions should be initiated and signed through the user's wallet.

## UI/UX Considerations

- **Clarity**: The UI should be clear and intuitive, making it easy for users to understand the state of raffles and communities.
- **Feedback**: Provide clear feedback to users after they perform an action (e.g., "Transaction submitted", "Raffle created successfully").
- **Error Handling**: Handle potential errors from the smart contracts and display user-friendly error messages.
- **Responsiveness**: The application should be responsive and work well on different screen sizes.
