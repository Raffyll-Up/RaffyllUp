export type RaffleStatus = 'Upcoming' | 'Active' | 'Drawn' | 'PaidOut' | 'Cancelled';

export interface Raffle {
  id: string;
  name: string;
  token: string; // token address or empty string for ETH
  endTime: number; // Unix timestamp in seconds
  winnersCount: number;
  maxParticipants: number;
  status: RaffleStatus;
  totalPrize: string; // In wei or token units
  requireCommunityMembership: boolean;
  participants: string[]; // Array of participant addresses
  winners?: string[]; // Array of winner addresses
  winnerAmounts?: string[]; // Array of prize amounts in wei/token units
  startDate: string; // ISO date string for display
  endDate: string; // ISO date string for display
  prizePool: string; // Formatted prize amount for display
}

export const rafflesData: Raffle[] = [
  {
    id: '1',
    name: 'Tech Raffle 2024',
    token: '0x0000000000000000000000000000000000000000', // ETH
    endTime: Math.floor(new Date('2024-04-15').getTime() / 1000),
    winnersCount: 5,
    maxParticipants: 1000,
    status: 'Active',
    totalPrize: '10000000000000000000', // 10 ETH in wei
    requireCommunityMembership: true,
    participants: [
      '0x1234...',
      '0x5678...',
    ],
    winners: [],
    winnerAmounts: [],
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    prizePool: '10 ETH',
  },
  {
    id: '2',
    name: 'Summer Giveaway',
    token: '0x1234...', // Some ERC20 token
    endTime: Math.floor(new Date('2023-07-01').getTime() / 1000),
    winnersCount: 3,
    maxParticipants: 500,
    status: 'PaidOut',
    totalPrize: '5000000000000000000', // 5000 USDC (assuming 6 decimals)
    requireCommunityMembership: false,
    participants: [
      '0x9abc...',
      '0xdef0...',
    ],
    winners: ['0x9abc...'],
    winnerAmounts: ['5000000000000000000'],
    startDate: '2023-06-01',
    endDate: '2023-07-01',
    prizePool: '5000 USDC',
  },
  {
    id: '3',
    name: 'Holiday Raffle',
    token: '0x0000000000000000000000000000000000000000', // ETH
    endTime: Math.floor(new Date('2024-12-25').getTime() / 1000),
    winnersCount: 10,
    maxParticipants: 2000,
    status: 'Upcoming',
    totalPrize: '20000000000000000000', // 20 ETH in wei
    requireCommunityMembership: true,
    participants: [],
    winners: [],
    winnerAmounts: [],
    startDate: '2024-12-01',
    endDate: '2024-12-25',
    prizePool: '20 ETH',
  },
  {
    id: '4',
    name: 'Spring Fling',
    token: '0x0000000000000000000000000000000000000000', // ETH
    endTime: Math.floor(new Date('2024-06-01').getTime() / 1000),
    winnersCount: 5,
    maxParticipants: 1000,
    status: 'Cancelled',
    totalPrize: '2500000000000000000', // 2.5 ETH in wei
    requireCommunityMembership: true,
    participants: [],
    winners: [],
    winnerAmounts: [],
    startDate: '2024-05-01',
    endDate: '2024-06-01',
    prizePool: '2.5 ETH',
  },
  {
    id: '5',
    name: 'Autumn Extravaganza',
    token: '0x0000000000000000000000000000000000000000', // ETH
    endTime: Math.floor(new Date('2024-10-01').getTime() / 1000),
    winnersCount: 10,
    maxParticipants: 2000,
    status: 'Active',
    totalPrize: '15000000000000000000', // 15 ETH in wei
    requireCommunityMembership: true,
    participants: [],
    winners: [],
    winnerAmounts: [],
    startDate: '2024-09-01',
    endDate: '2024-10-01',
    prizePool: '15 ETH',
  },
];