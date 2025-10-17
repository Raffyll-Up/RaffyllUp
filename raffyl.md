PRODUCT REQUIREMENTS DOCUMENT (PRD) FOR RAFFYLLUP

Field
Details
Product Name:
RaffyllUp
Version:
1.0



1.	INTRODUCTION
1.1	Vision
To create a world where raffles and giveaways are 100% fair, transparent, and instant empowering communities, creators, and event organizers to build trust and engagement through decentralized, verifiable, and fun reward experiences.
1.2	Problem
Traditional raffles and online giveaways are plagued by three main issues:
Transparency: Participants can’t verify that winners were chosen fairly; results are often opaque or manipulated.
Delayed or Failed Payouts: Winners frequently wait days or never receive their promised rewards.
Poor Engagement & Accessibility: Existing tools are either too technical for average users or too basic for live event engagement.
1.3	Solution
Raffyl solves these issues by combining blockchain-powered fairness, instant payouts, and interactive experiences in one dApp:
Provably Fair Randomness: Uses Chainlink VRF (Verifiable Random Function) to ensure every draw is verifiable and tamper-proof.
Instant Payouts: Smart contracts handle automatic token distribution directly to winners’ wallets within seconds.
Live Engagement: A real-time “Spin the Wheel” animation displays winners transparently for both on-stage and virtual events.
Simple Onboarding: Participants join via QR code and connect any EVM wallet, no complex setup required (social/email login coming soon).
2.	GOALS AND SUCCESS METRIC
Raffyl’s mission is to make on-chain raffles both trustworthy and engaging, blending decentralized transparency with modern user experience. To achieve that, the following product and business goals guide the MVP and future iterations:

Goal
Description
Success Metric / KPI
Target
Ensure Provable Fairness
Guarantee transparent and auditable winner selection using blockchain randomness.
% of raffles using verifiable randomness (VRF)
100%
Deliver Instant Payouts
Reduce time between draw completion and winner reward.
Avg. payout time after raffle end
< 30 seconds
Boost Engagement
Increase participation and excitement during raffles through interactive UI.
Avg. participants per raffle / Session duration
200+ participants / 3+ mins avg.
Simplify Onboarding
Reduce friction for non-crypto users to join raffles easily.
Wallet connection success rate
≥ 90% success rate
Enhance Reliability
Maintain stable on-chain & UI performance across events.
Platform uptime
99.5%
Drive Growth & Adoption
Position Raffyl as the default raffle tool for Web3 events & creators.
Active organizers per month
100+ active organizers by Q2 2026
Maintain Transparency & Trust
Build user trust via open-source smart contracts and verified audits.
Smart contract audit completion
≥ 1 formal audit per major release







3.	USER PERSONAS/ TARGET USERS

Persona
Description
Key Needs
Pain Points
Event Organizer (Primary User)
Conference or community meetup organizer seeking an engaging, transparent way to run giveaways.
Set up and launch raffles easily within minutes.
Keep attendees entertained and build event reputation.
Showcase fairness and credibility on-stage.


Manual or biased winner selection reduces trust.
Tools requiring manual payout processing.
Time-consuming setup during events.
Creator/Influencer
A social media influencer or Web3 creator hosting token or NFT giveaways for audience engagement.
Run fair, fast giveaways to grow and reward followers.
Prove fairness publicly to avoid backlash.
Automate distribution of digital prizes.
Risk of accusations of rigging or favoritism.
Manual verification and payout tracking.
Limited audience trust in centralized giveaway tools.
DAO/Community Manager
Administrator of decentralized communities or DAOs running periodic token-based reward campaigns.
Distribute rewards transparently to contributors.
Maintain an immutable record of raffle outcomes.
Integrate raffle data with DAO governance dashboards.
Lack of on-chain auditability.
Manual token distribution creates governance friction.
Difficult to verify member eligibility.
Participant/Fan
An attendee, follower, or community member joining raffles for fun or rewards.
Enter raffles quickly using a QR code or wallet connect.
Trust that results are fair and unbiased.
Receive rewards instantly upon winning.
Confusing wallet setup processes.
Long delays or missed rewards.
Skepticism about fairness.


4.	USER STORIES/USE CASES
4.1	Admin / Organizer
As an Admin, I want to create a raffle event through a simple dashboard so that I can quickly set up giveaways during live or online events.
As an Admin, I want to fund my raffle contract using tokens or native assets so that I can guarantee winner payouts.
As an Admin, I want to set the number of winners and reward distribution method (tiered or equal) so that I can manage how prizes are shared.
As an Admin, I want to use timelocks to ensure funds remain locked until the raffle is complete, ensuring trust and transparency.
As an Admin, I want to view live results and payout status so that I can confirm that winners are rewarded instantly and fairly.
As an Admin, I want to update raffle requirements (eligibility, tasks, or quiz data) before kickoff so I can tailor participation to each event type.
As an Admin, I want to link my community contract to my ENS name to brand raffles under my verified identity.
4.2	Community Manager / DAO Admin
As a Community Manager, I want to manage multiple raffles under one community contract so that I can run repeated campaigns for my members.
As a DAO Admin, I want to attach participant registration to wallet addresses to prevent duplicate entries and ensure fairness.
As a DAO Admin, I want to analyze raffle history and winner data for transparency reports and community updates.
4.3	Participant / User
As a User, I want to join raffles gaslessly so I can participate easily without paying transaction fees.
As a User, I want to register with my wallet (or ENS) once and use it across multiple raffles to simplify participation.
As a User, I want to see raffle details (rules, prizes, end time) before joining so that I understand what I’m participating in.
As a User, I want to watch the live spin or draw so I can trust the fairness and enjoy the excitement of the event.
As a User, I want to receive my prize automatically if I win so I don’t need to wait or contact anyone for my reward.
As a User, I want to view my participation history and previous winnings for personal record and bragging rights.
4.4	System / Smart Contract
As the Smart Contract, I must use keccak-based randomness to ensure that winners are selected in a fair, provable manner.
As the Smart Contract, I must disburse funds automatically once winners are selected, removing human intervention.
As the Smart Contract, I must prevent fund withdrawal before raffle completion to guarantee integrity and trust.
As the Smart Contract, I must store event and result data on-chain for public verification.

5.	SCOPE
5.1	In Scope
The MVP will focus on core functionality that enables admins and users to run verifiable raffles securely and easily.

Category
Features
Raffle Management
Create, edit, and manage raffles using a factory contract
Randomness
Keccak-based randomness logic for fair selection
Smart Contracts
Factory contract, community contract, raffle contract, timelock contract
Wallet Connection
Wallet-based login (MetaMask, WalletConnect, etc.)
Funding & Payout
Token deposit, locked funds, automated disbursement
UI/UX
Dashboard for admin and user views, live spin display
Event Types
Giveaway, Gamified, and User Engagement
Gasless Registration
User participation without transaction fees
On-Chain Verification
Transparent raffle result records
Tiered/Equal Rewards
Flexible payout structure


5.2	Out Scope (Post-MVP / Future Versions)
Category
Deferred Features
Social Login
Email or social media login for non-Web3 users
AI Quiz Generator
Dynamic question creation and grading logic
Analytics Dashboard
Historical performance and event insights
Mobile App
Native mobile experience for raffles
NFT Raffles
Raffle support for NFTs or physical goods
Affiliate/Referral System
Incentivized sharing of raffle links
Cross-chain Support
Multi-chain compatibility beyond EVM (e.g., Solana, Aptos)


6.	FUNCTIONAL REQUIREMENTS
6.1	Admin/Community Management
FR-1: The admin can create a new community contract using the Factory contract.
FR-2: The admin can register a community with a unique ENS name and wallet.
FR-3: The admin can fund their community contract with tokens or ETH.
FR-4: The admin can update raffle parameters, such as duration, number of winners, tier levels, and disbursement mode (batch or single).
FR-5: The admin can view all created raffyl events, their participants, and results.
FR-6: The admin can trigger winner selection once the raffle ends, using the built-in randomness logic (keccak256).
FR-7: The admin can initiate disbursement of funds to winners, automatically or manually.
6.2	User Registration & Participation
FR-8: Users can register once per community using their wallet (gasless transaction).
FR-9: Each user’s registration is linked to their wallet address and stored on-chain.
FR-10: Users can view active raffyl events in the community and their participation status.
FR-11: Users can join raffyls that meet eligibility criteria (token holding, community membership, etc.).
FR-12: The system must verify participation through connected wallet addresses or external APIs (for social proofs).
FR-13: Users can claim winnings after being selected, with automatic on-chain verification.
6.3	Raffle Event Logic
a. Giveaway Raffle
FR-14: Contract locks funds once the raffle starts.
FR-15: Randomization via keccak ensures fairness in winner selection.
FR-16: Admin cannot withdraw funds until disbursement is complete.
b. Gamified Raffle
FR-17: Admin can upload a JSON file with questions and answers.
FR-18: Users answer questions to qualify.
FR-19: The system uses AI + Randomization to validate and select winners.
FR-20: Supports tiered or equal-share winnings.
c. User Engagement Raffle
FR-21: Admin defines tasks (e.g., “Retweet”, “Follow”, “Join Discord”).
FR-22: Users perform tasks and submit proof.
FR-23: System uses social API integrations (Twitter, Discord, etc.) to verify proof.
FR-24: Winners selected randomly or by performance ranking.
6.4	Smart Contract & Blockchain Logic
FR-25: All raffyls are created via a Factory contract.
FR-26: Each raffyl contract is timelocked to prevent early fund access.
FR-27: Randomization uses on-chain deterministic logic (keccak256 or VRF for future version).
FR-28: All funds and winner transactions are transparently viewable on-chain.
FR-29: Winners’ addresses and amounts are stored in contract logs.
6.5	UI / UX
FR-30: Admin Dashboard — Create raffyls, manage communities, view results.
FR-31: User Dashboard — Join raffyls, complete tasks, check eligibility.
FR-32: Real-time status display of raffyls (e.g., “Upcoming”, “Active”, “Closed”).
FR-33: Notification system for raffle start, result, and payout.
FR-34: Wallet connection with MetaMask, WalletConnect, or similar Web3 providers.


7.	NON-FUNCTIONAL REQUIREMENTS
Category
Requirement
Performance
- Must handle up to 10,000 participants per raffle without lag.- Randomization and payout confirmation must complete within 5–10 seconds.
Security
- Smart contracts must undergo audit before deployment.- Funds are locked using timelock logic to prevent early withdrawal.- Admin actions must be authorized via multisig.
Scalability
- Factory contract must support unlimited community raffyl deployments.- APIs for gamified and engagement raffyls should be modular and extendable.
Reliability
- Contract must handle edge cases (e.g., no participants, insufficient funds).- In case of transaction failure, retries must be handled gracefully.
Usability
- UI should support dark/light modes.- Must be mobile responsive.- Simple navigation with intuitive raffle status and participant visibility.
Transparency
- All events (creation, registration, selection, payout) must be verifiable on-chain.- Provide public access to event details and randomness logic.
Maintainability
- Smart contracts should be modular and upgradeable using proxy pattern.- Codebase should follow clear documentation and version control.
Availability
- DApp must achieve ≥ 99.5% uptime.- Backup of off-chain metadata (like questions JSON) must exist on IPFS or Filecoin.
Compliance
- Must comply with applicable Web3 and DAO governance standards.- Integrations with APIs must respect user data privacy.



8.	USER FLOW
Flow with Figma

9.	WIREFRAMES
Mock up in Figma / Adobe XD



SDK for Gasless transactions
With Thirdweb SDK, you can integrate gasless registration for your Raffyl smart contract using just the SDK + your frontend—no backend required for the MVP. Thirdweb's SmartWallet + TokenPaymaster handles everything client-side: user connection (MetaMask/social), signing, bundling, and gas sponsorship from your pre-funded wallet. It's the simplest option for your use case.
Quick Setup
1. Install & Configure
bash
npm install thirdweb @thirdweb-dev/wallets
2. Frontend Code (React Example)
jsx
import { createThirdwebClient, getContract } from "thirdweb";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { lisk } from "thirdweb/chains";
import { defineChain } from "thirdweb";

// Your sponsor wallet address (fund this with LSK)
const SPONSOR_WALLET = "0xYourSponsorWalletAddress";
const client = createThirdwebClient({ clientId: "YOUR_CLIENT_ID" }); // Free from thirdweb dashboard

export default function RaffylRegistration() {
 const connectAndRegister = async () => {
   // 1. Connect wallet (MetaMask or social via Web3Auth)
   const smartWallet = new SmartWallet({
     client,
     chain: lisk,
     // Gasless: Sponsor pays from your wallet
     gasless: {
       strategy: "token-paymaster", // Or "sponsor-gas"
       paymasterAddress: SPONSOR_WALLET, // Your funded address
     },
   });

   await smartWallet.connect({
     personalWallet: { type: "evm", walletDetails: { name: "metamask" } },
   });

   // 2. Call YOUR Raffyl contract gaslessly
   const contract = getContract({
     client,
     chain: lisk,
     address: "0xYourRaffylContractAddress", // Your deployed contract
   });

   // User signs OFF-CHAIN, sponsor pays gas
   const tx = await contract.call("registerForRaffle", [raffleId], {
     account: smartWallet,
   });

   console.log("Gasless registration complete! Tx:", tx);
 };

 return <button onClick={connectAndRegister}>Join Raffle Gasless!</button>;
}
3. Fund Your Sponsor Wallet (One-Time)
Deploy to Lisk testnet/mainnet
Send ~10-50 LSK to SPONSOR_WALLET
Each registration costs ~$0.01-0.05
4. Add Social Login (Optional, 2 lines)
jsx
import { inAppWallet } from "@thirdweb-dev/wallets";

await smartWallet.connect({
 personalWallet: { 
   type: "in-app", 
   walletDetails: { name: "google" } // Google/Email/Twitter
 },
});
Why This Works Perfectly for Raffyl
Feature
✅ Thirdweb Delivers
MetaMask Connect
Built-in
Social Login
One line (Google/Email)
Gasless Registration
Your contract call, 0 user gas
No Backend
All client-side
Lisk L2 Native
Official support
QR Code Flow
Works with walletconnect
Production Ready
Used by 10k+ projects


Client ID: Free at thirdweb.com/dashboard
Contract ABI: Thirdweb auto-detects if deployed via their dashboard, or paste yours
Test First: Use Lisk Sepolia testnet
Deploy Your Contract via Thirdweb
If you haven't deployed yet:
bash
npx thirdweb deploy 0xYourRaffylContract.sol --chain lisk
Gets your address + ABI instantly.
Timeline: Copy-paste above code → test in 15 mins → live in 1 hour.
