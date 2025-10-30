export type RaffleStatus = 'Upcoming' | 'Active' | 'Drawn' | 'PaidOut' | 'Cancelled';

export interface Community {
  id: string | number;
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
    id: 1,
    name: "Tech Raffle 2024",
    created: "2025-10-24",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF51111",
    raffles: [
      {
        id: 1,
        name: "Holiday Raffle 1",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2025-12-25").getTime() / 1000),
        winnersCount: 10,
        maxParticipants: 200,
        status: "Upcoming",
        totalPrize: "20000000000000000000", // 20 ETH in wei
        requireCommunityMembership: true,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-12-01",
        endDate: "2025-12-25",
        prizePool: "20 ETH",
      },
      {
        id: 2,
        name: "Spring Fling 2",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2025-11-01").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 100,
        status: "Cancelled",
        totalPrize: "2500000000000000000", // 2.5 ETH in wei
        requireCommunityMembership: true,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-10-25",
        endDate: "2025-11-01",
        prizePool: "2.5 ETH",
      },
    ],
  },
  {
    id: 2,
    name: "EcoSolution Collective",
    created: "2025-10-25",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF52222",
    raffles: [
      {
        id: 3,
        name: "Tech Raffle 2024",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2025-11-15").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 100,
        status: "Active",
        totalPrize: "10000000000000000000", // 10 ETH in wei
        requireCommunityMembership: true,
        participants: ["0x1234...", "0x5678..."],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-10-26",
        endDate: "2025-11-15",
        prizePool: "10 ETH",
      },
      {
        id: 4,
        name: "Summer Giveaway",
        token: "0x1234...", // Some ERC20 token
        endTime: Math.floor(new Date("2025-11-01").getTime() / 1000),
        winnersCount: 3,
        maxParticipants: 50,
        status: "PaidOut",
        totalPrize: "5000000000000000000", // 5000 USDC (assuming 6 decimals)
        requireCommunityMembership: false,
        participants: ["0x9abc...", "0xdef0..."],
        winners: ["0x9abc..."],
        winnerAmounts: ["5000000000000000000"],
        startDate: "2025-10-27",
        endDate: "2025-11-01",
        prizePool: "5000 USDC",
      },
    ],
  },
  {
    id: 3,
    name: "Creative Minds Studio",
    created: "2025-10-28",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF53333",
    raffles: [
      {
        id: 5,
        name: "Tech Raffle 2024",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2025-11-15").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 100,
        status: "Active",
        totalPrize: "10000000000000000000", // 10 ETH in wei
        requireCommunityMembership: true,
        participants: ["0x1234...", "0x5678..."],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-10-29",
        endDate: "2025-11-15",
        prizePool: "10 ETH",
      },
    ],
  },
  {
    id: 4,
    name: "Global health Initiative",
    created: "2025-11-15",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF54444",
    raffles: [
      {
        id: 6,
        name: "Tech Raffle 2024",
        token: "0x0000000000000000000000000000000000000000", // ETH
        endTime: Math.floor(new Date("2025-12-15").getTime() / 1000),
        winnersCount: 5,
        maxParticipants: 100,
        status: "Active",
        totalPrize: "10000000000000000000", // 10 ETH in wei
        requireCommunityMembership: true,
        participants: ["0x1234...", "0x5678..."],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-20",
        endDate: "2025-12-15",
        prizePool: "10 ETH",
      },
    ],
  },
  {
    id: 5,
    name: "Tech Inc",
    created: "2025-12-01",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF55555",
    raffles: [
      {
        id: 7,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-12-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Upcoming",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-12-01",
        endDate: "2025-12-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 6,
    name: "Tech Raffle ",
    created: "2025-10-24",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF56666",
    raffles: [
      {
        id: 8,
        name: "Tech Raffle",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Active",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 7,
    name: "EcoSolution dsdol Collective",
    created: "2025-10-25",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF57777",
    raffles: [
      {
        id: 9,
        name: "Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Drawn",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 8,
    name: "Creative Minds Studio",
    created: "2025-10-26",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF58888",
    raffles: [
      {
        id: 10,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "PaidOut",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 9,
    name: "Global health Initiative",
    created: "2025-10-27",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF59999",
    raffles: [
      {
        id: 11,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Cancelled",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 10,
    name: "Tech Innovators Inc",
    created: "2025-10-28",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50011",
    raffles: [
      {
        id: 12,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Upcoming",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 11,
    name: "EcoSolution Collective",
    created: "2025-10-29",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50022",
    raffles: [
      {
        id: 13,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Active",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 12,
    name: "Creative Minds Studio",
    created: "2025-10-30",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50033",
    raffles: [
      {
        id: 14,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Drawn",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 13,
    name: "Global health Initiative",
    created: "2025-10-31",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50044",
    raffles: [
      {
        id: 15,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "PaidOut",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
  {
    id: 15,
    name: "Tech Innovators Inc",
    created: "2025-11-01",
    owner: "0x08d0d1572A8a714D90D670Ea344Dd23B1dF50055",
    raffles: [
      {
        id: 16,
        name: "Tech Raffle 2024",
        token: "",
        endTime: Math.floor(new Date("2025-11-25").getTime() / 1000),
        winnersCount: 0,
        maxParticipants: 0,
        status: "Cancelled",
        totalPrize: "",
        requireCommunityMembership: false,
        participants: [],
        winners: [],
        winnerAmounts: [],
        startDate: "2025-11-01",
        endDate: "2025-11-25",
        prizePool: "",
      },
    ],
  },
];
