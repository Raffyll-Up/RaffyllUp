'use client';

import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";

interface RaffleCardProps {
  raffle: {
    id: number;
    name: string;
    endDate: string;
    prizePool: string;
    participants: string[];
    maxParticipants: number;
    status: string;
  };
  communityName: string;
  communityOwner: string;
}

export function RaffleCard({ raffle, communityName, communityOwner }: RaffleCardProps) {
  const router = useRouter();
  
  // Handle empty or invalid dates
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return 'No end date';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MM/dd/yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const formattedDate = getFormattedDate(raffle.endDate);
  
  // Calculate progress percentage
  const progress = raffle.maxParticipants > 0 
    ? (raffle.participants.length / raffle.maxParticipants) * 100 
    : 0;
  
  // Shorten the owner address for display
  const shortAddress = communityOwner 
    ? `${communityOwner.slice(0, 6)}...${communityOwner.slice(-4)}`
    : 'Unknown';

  return (
    <div className="w-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Card className="bg-dark-secondary/30 backdrop-blur-sm border-dark-border hover:border-teal-500/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{raffle.name}</h3>
              <p className="text-sm text-teal-400">{communityName}</p>
            </div>
            <span className="text-xs bg-teal-900/30 text-teal-400 px-2 py-1 rounded-full">
              {raffle.status}
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Prize: {raffle.prizePool}</span>
              <span>Ends: {formattedDate}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 mb-1">
              <div 
                className="bg-teal-500 h-2 rounded-full" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{raffle.participants.length} participants</span>
              <span>{raffle.maxParticipants} max</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Owner: {shortAddress}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full text-gray-700 hover:text-gray-500 hover:bg-gray-500/10"
            onClick={() => router.push(`/raffles/${raffle.id}`)}
          >
            <Ticket className="w-4 h-4 mr-2" />
            View Raffle
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
