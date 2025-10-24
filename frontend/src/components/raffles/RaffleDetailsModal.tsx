'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
// import { communityData } from "@/lib/communityData";
import { RaffleStatus } from "@/lib/communityData";

const statusVariant = {
  Upcoming: 'bg-yellow-500/20 text-yellow-400',
  Active: 'bg-green-500/20 text-green-400',
  Drawn: 'bg-blue-500/20 text-blue-400',
  PaidOut: 'bg-purple-500/20 text-purple-400',
  Cancelled: 'bg-red-500/20 text-red-400',
} as const;

type RaffleDetailsModalProps = {
  raffle: {
    id: number;
    name: string;
    token: string;
    endTime: string;
    winnersCount: number;
    maxParticipants: number;
    status: RaffleStatus;
    totalPrize: string;
    requireCommunityMembership: boolean;
    participants: string[];
    winners: string[];
    winnerAmounts: string[];
    startDate: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinRaffle?: (raffleId: string) => Promise<void>;
};

export function RaffleDetailsModal({ raffle, open, onOpenChange, onJoinRaffle }: RaffleDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  // const [ticketCount, setTicketCount] = useState(1);
  
  const startDate = parseISO(raffle.startDate);
  const endDate = parseISO(raffle.endTime);
  const now = new Date();
  const isActive = raffle.status === 'Active';
  // const isCompleted = ['Drawn', 'PaidOut'].includes(raffle.status);
  
  // Calculate progress percentage
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

  const handleJoinRaffle = async () => {
    if (!onJoinRaffle) return;
    
    try {
      setIsLoading(true);
      await onJoinRaffle(raffle.id.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">{raffle.name}</DialogTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    'border-none text-xs',
                    statusVariant[raffle.status as keyof typeof statusVariant]
                  )}
                >
                  {raffle.status}
                </Badge>
                {raffle.requireCommunityMembership && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-none text-xs">
                    Membership Required
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{raffle.totalPrize}</div>
              <div className="text-sm text-gray-400">Total Prize</div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{format(startDate, 'MMM d, yyyy')}</span>
              <span>{format(endDate, 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Raffle Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Winners</div>
              <div className="text-white font-medium">{raffle.winnersCount}</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Max Participants</div>
              <div className="text-white font-medium">{raffle.maxParticipants}</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Token</div>
              <div className="text-white font-medium">
                {raffle.token === '0x0000000000000000000000000000000000000000' ? 'ETH' : 'Token'}
              </div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Participants</div>
              <div className="text-white font-medium">{raffle.participants.length}</div>
            </div>
          </div>

          {/* Winners Section */}
          {raffle.winners && raffle.winners.length > 0 && (
            <div>
              <h4 className="font-medium text-white mb-2">Winners</h4>
              <div className="space-y-2">
                {raffle.winners.map((winner, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-400" />
                      <span className="font-mono text-sm">{winner}</span>
                    </div>
                    {raffle.winnerAmounts?.[index] && (
                      <span className="text-sm font-medium">
                        {raffle.winnerAmounts[index]} {raffle.token === '0x0000000000000000000000000000000000000000' ? 'ETH' : 'TOKENS'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Join Raffle Button */}
          {isActive && onJoinRaffle && (
            <div className="pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                size="lg"
                onClick={handleJoinRaffle}
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join Raffle'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
