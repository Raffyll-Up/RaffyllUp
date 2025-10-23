Yes, this architecture is **possible and actually cleaner** for your use case. Here's the structural breakdown:

## Proposed Architecture

**Factory Contract** (Main Hub)
- Deploys new Community Contracts
- Handles automated payments/disbursements centrally
- Tracks all communities and their raffles globally
- Acts as payment processor when raffles end

**Community Contract** (Per Community)
- Stores community metadata (ENS, owner, settings)
- Creates raffle structs (not separate contracts)
- Manages multiple raffles as data structures
- Delegates payment execution to Factory

**Raffle Struct** (Data Only)
- Stored in Community Contract
- Contains: participants, winners, amount, status, timelock, config
- No deployment cost per raffle

**Timelock Vault Contract** (Per Community or Shared)
- Holds locked funds for all raffles in a community
- Releases funds only when Factory/Community calls after timelock expires
- Prevents early withdrawal
 community balances are tracked here

## Flow
1. Factory deploys Community Contract
2. Admin funds Timelock Vault via Community Contract
3. Community creates raffle struct, locks funds in Timelock
4. Users register → stored in raffle struct
5. Raffle ends → Community requests Factory to process payment
6. Factory checks timelock → calls Timelock Vault → disburses to winners

## Benefits
- **Gas efficient**: No contract deployment per raffle
- **Centralized payment logic**: Factory handles all disbursements uniformly
- **Separation of concerns**: Community = data/logic, Factory = orchestration, Timelock = security
- **Scalability**: Unlimited raffles per community as structs

This matches your PRD's Factory pattern while keeping raffles lightweight.