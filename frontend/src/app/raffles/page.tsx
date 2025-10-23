import { RaffleCard } from "@/components/home/RaffleCard";
import { communityData } from "@/lib/communityData";

export default function RafflesPage() {
  // Flatten all raffles from all communities with their community info
  const allRaffles = communityData.flatMap(community => 
    community.raffles.map(raffle => ({
      raffle,
      communityName: community.name,
      communityOwner: community.owner
    }))
  );

  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Raffles</h1>
          <p className="text-gray-400">Discover and participate in exciting raffles from various communities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRaffles.map(({ raffle, communityName, communityOwner }) => (
            <RaffleCard 
              key={raffle.id}
              raffle={raffle}
              communityName={communityName}
              communityOwner={communityOwner}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
