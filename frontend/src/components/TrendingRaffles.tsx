import Image from "next/image";
import { Clock, Coins } from "lucide-react";
import { useRouter } from "next/navigation";

interface RaffleCardProps {
  title: string;
  prizePool: string;
  timeLeft: string;
  image: string;
  alt: string;
  participants: number;
  ticketPrice: string;
}

const RaffleCard = ({ raffle }: { raffle: RaffleCardProps }) => (
  <div className="relative group bg-dark-secondary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-teal-400/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
    <div className="relative w-full aspect-video overflow-hidden">
      <Image
        src={raffle.image}
        alt={raffle.alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        {raffle.timeLeft}
      </div>
    </div>
    
    <div className="p-4 flex-1 flex flex-col">
      <h3 className="text-white font-medium text-lg mb-2 line-clamp-1">{raffle.title}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Prize Pool</p>
          <div className="flex items-center">
            <Coins className="w-4 h-4 text-teal-400 mr-1" />
            <span className="text-white font-medium">{raffle.prizePool}</span>
          </div>
        </div>
        <div className="hidden">
          <p className="text-gray-400 text-xs mb-1">Ticket Price</p>
          <div className="flex items-center">
            <Coins className="w-4 h-4 text-teal-400 mr-1" />
            <span className="text-white font-medium">{raffle.ticketPrice}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{raffle.participants} participants</span>
          <span>Max 1000</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3">
          <div 
            className="bg-teal-500 h-1.5 rounded-full" 
            style={{ width: `${Math.min(100, (raffle.participants / 1000) * 100)}%` }}
          ></div>
        </div>
        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Join Raffle
        </button>
      </div>
    </div>
  </div>
);

const raffles: RaffleCardProps[] = [
  {
    title: "CryptoPunk Giveaway",
    prizePool: "2.5 ETH",
    timeLeft: "2d 14h 32m",
    image: "https://images.unsplash.com/photo-1577174787901-1af99a1227af?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx3b29kJTIwY2lyY3VsYXIlMjByaW5ncyUyMHRleHR1cmV8ZW58MHwwfHx8MTc2MDYyODUyNnww&ixlib=rb-4.1.0&q=85",
    alt: "CryptoPunk Raffle",
    participants: 743,
    ticketPrice: "0.01"
  },
  {
    title: "Ethereum Maxi Raffle",
    prizePool: "50 USDC",
    timeLeft: "1d 8h 15m",
    image: "https://images.unsplash.com/photo-1706719683266-9924744c1c9b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx3b29kJTIwc2hlbGwlMjBvcmdhbmljJTIwdGV4dHVyZXxlbnwwfDB8fHwxNzYwNjI4NTI2fDA&ixlib=rb-4.1.0&q=85",
    alt: "Ethereum Raffle",
    participants: 428,
    ticketPrice: "0.02"
  },
  {
    title: "NFT Art Collection",
    prizePool: "1.2 ETH",
    timeLeft: "3d 5h 47m",
    image: "https://images.unsplash.com/photo-1683778203265-7dc8ff00df18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx3b29kJTIwZ3JhaW4lMjB0ZXh0dXJlJTIwbmF0dXJhbHxlbnwwfDB8fHwxNzYwNjI4NTI3fDA&ixlib=rb-4.1.0&q=85",
    alt: "NFT Art Raffle",
    participants: 196,
    ticketPrice: "0.005"
  },
  {
    title: "DeFi Yield Vault",
    prizePool: "85 USDT",
    timeLeft: "5h 22m",
    image: "https://images.unsplash.com/photo-1639765214744-64ef8fae5c4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjcnlwdG8lMjBjdXJyZW5jeSUyMGJpdGNvaW58ZW58MHwwfHx8MTc2MDYyODUyNnww&ixlib=rb-4.1.0&q=85",
    alt: "DeFi Raffle",
    participants: 892,
    ticketPrice: "0.03"
  },
];

export function TrendingRaffles() {
  const router = useRouter()
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Trending Raffles</h2>
            <p className="text-gray-400">Participate in the hottest raffles on the blockchain</p>
          </div>
          <button onClick={()=>router.push('/raffles')} className="mt-4 md:mt-0 px-6 py-2.5 cursor-pointer rounded-lg border border-teal-400/30 text-teal-300 hover:bg-teal-400/10 transition-colors text-sm font-medium">
            View All Raffles
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {raffles.map((raffle, index) => (
            <RaffleCard key={`${raffle.title}-${index}`} raffle={raffle} />
          ))}
        </div>
      </div>
    </section>
  );
}