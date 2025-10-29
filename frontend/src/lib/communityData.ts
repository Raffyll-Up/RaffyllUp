export type RaffleStatus = 'Upcoming' | 'Active' | 'Drawn' | 'PaidOut' | 'Cancelled';

export interface Community {
  name: string;
  created: string;
  owner: string;
  raffles: {
    id: number;
    name: string;
    token: string;
    endTime: number;
    winnersCount: number;
    maxParticipants: number;
    status: RaffleStatus;
    totalPrize: string;
    requireCommunityMembership: boolean;
    participants: string[];
    winners: string[];
    winnerAmounts: string[];
    startDate: string;
    endDate: string;
    prizePool: string;
  }[];
}

export const communityData: Community[] = [
  {
    name: "Tech Raffle 2024",
    created: "2024-03-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF51111",
    raffles: [
      {
        id: 1,
        name: "Holiday Raffle 1",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2024-12-25").getTime() / 1000),
        winnersCount: 10,
        maxParticipants: 2000,
        status: "Upcoming",
        totalPrize: "20000000000000000000", // 20 ETH in wei
        requireCommunityMembership: true,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2024-12-01",
        endDate: "2024-12-25",
        prizePool: "20 ETH",
      },
      {
        id: 2,
        name: "Spring Fling 2",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2024-06-01").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 1000,
        status: "Cancelled",
        totalPrize: "2500000000000000000", // 2.5 ETH in wei
        requireCommunityMembership: true,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2024-05-01",
        endDate: "2024-06-01",
        prizePool: "2.5 ETH",
      },
    ],
  },
  {
    name: "EcoSolution Collective",
    created: "2024-04-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF52222",
    raffles: [
      {
        id: 3,
        name: "Tech Raffle 2024",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2024-04-15").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 1000,
        status: "Active",
        totalPrize: "10000000000000000000", // 10 ETH in wei
        requireCommunityMembership: true,
        participants: ["0x1234...", "0x5678..."],
        winners: [],
        winnerAmounts: [],
        startDate: "2024-03-15",
        endDate: "2024-04-15",
        prizePool: "10 ETH",
      },
      {
        id: 4,
        name: "Summer Giveaway",
        token: "0x1234...", // Some ERC20 token
        endTime: Math.floor(new Date("2023-07-01").getTime() / 1000),
        winnersCount: 3,
        maxParticipants: 500,
        status: "PaidOut",
        totalPrize: "5000000000000000000", // 5000 USDC (assuming 6 decimals)
        requireCommunityMembership: false,
        participants: ["0x9abc...", "0xdef0..."],
        winners: ["0x9abc..."],
        winnerAmounts: ["5000000000000000000"],
        startDate: "2023-06-01",
        endDate: "2023-07-01",
        prizePool: "5000 USDC",
      },
    ],
  },
  {
    name: "Creative Minds Studio",
    created: "2024-05-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF53333",
    raffles: [
      {
        id: 5,
        name: "Tech Raffle 2024",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2024-04-15").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 1000,
        status: "Active",
        totalPrize: "10000000000000000000", // 10 ETH in wei
        requireCommunityMembership: true,
        participants: ["0x1234...", "0x5678..."],
        winners: [],
        winnerAmounts: [],
        startDate: "2024-03-15",
        endDate: "2024-04-15",
        prizePool: "10 ETH",
      },
    ],
  },
  {
    name: "Global health Initiative",
    created: "2024-06-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF54444",
    raffles: [
      {
        id: 6,
        name: "Tech Raffle 2024",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2024-04-15").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 1000,
        status: "Active",
        totalPrize: "10000000000000000000", // 10 ETH in wei
        requireCommunityMembership: true,
        participants: ["0x1234...", "0x5678..."],
        winners: [],
        winnerAmounts: [],
        startDate: "2024-03-15",
        endDate: "2024-04-15",
        prizePool: "10 ETH",
      },
    ],
  },
  {
    name: "Tech Inc",
    created: "2024-07-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF55555",
    raffles: [
      {
        id: 7,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Upcoming",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Tech Raffle ",
    created: "2025-10-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF56666",
    raffles: [
      {
        id: 8,
        name: "Tech Raffle",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Active",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "EcoSolution dsdol Collective",
    created: "2024-04-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF57777",
    raffles: [
      {
        id: 9,
        name: "Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Drawn",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Creative Minds Studio",
    created: "2024-05-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF58888",
    raffles: [
      {
        id: 10,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "PaidOut",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Global health Initiative",
    created: "2024-06-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF59999",
    raffles: [
      {
        id: 11,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Cancelled",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Tech Innovators Inc",
    created: "2024-07-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50011",
    raffles: [
      {
        id: 12,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Upcoming",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "EcoSolution Collective",
    created: "2024-04-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50022",
    raffles: [
      {
        id: 13,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Active",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Creative Minds Studio",
    created: "2024-05-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50033",
    raffles: [
      {
        id: 14,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Drawn",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Global health Initiative",
    created: "2024-06-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50044",
    raffles: [
      {
        id: 15,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "PaidOut",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
  {
    name: "Tech Innovators Inc",
    created: "2024-07-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50055",
    raffles: [
      {
        id: 16,
        name: "Tech Raffle 2024",
        token: "",
        endTime: 0,
        winnersCount: 0,
        maxParticipants: 0,
        status: "Cancelled",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "",
        endDate: "",
        prizePool: "",
      },
    ],
  },
];
