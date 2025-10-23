"use client";

import { communityData } from "@/lib/communityData";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { RaffleCard } from "./RaffleCard";

interface RaffleWithCommunity {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raffle: any; 
  communityName: string;
  communityOwner: string;
}

export function RaffleList() {
  const router = useRouter();
  // Flatten all raffles from all communities and add community info
  const allRaffles: RaffleWithCommunity[] = communityData.flatMap(community => 
    community.raffles.map(raffle => ({
      raffle,
      communityName: community.name,
      communityOwner: community.owner
    }))
  );
  
  // Only show the first 3 raffles on the home page
  const displayedRaffles = allRaffles.slice(0, 3);
  
  // Check if there are more raffles to show
  const hasMore = allRaffles.length > 3;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Featured Raffles</h2>
        <div className="flex items-center gap-2">
          {hasMore && (
            <Button
              variant="ghost"
              onClick={() => router.push('/raffles')}
              className="text-teal-400 hover:bg-teal-900/30 hover:text-teal-300"
            >
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRaffles.map(({ raffle, communityName, communityOwner }, index) => (
          <RaffleCard 
            key={`${raffle.id}-${index}`} 
            communityName={communityName}
            communityOwner={communityOwner}
            raffle={raffle}
          />
        ))}
      </div>
    </div>
  );
}
