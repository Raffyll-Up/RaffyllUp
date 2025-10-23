'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Award, Clock, Lock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type Raffle = {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Locked' | 'Upcoming';
  prizePool: string;
  startDate: string;
  endDate: string;
  description?: string;
  totalTickets?: number;
  ticketsSold?: number;
  maxTicketsPerUser?: number;
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  requireMembership?: boolean;
  winnersCount?: number;
  winners?: string[];
};

type RaffleDetailsModalProps = {
  raffle: Raffle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinRaffle?: (raffleId: string) => Promise<void>;
};

export function RaffleDetailsModal({ raffle, open, onOpenChange, onJoinRaffle }: RaffleDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  
  const startDate = parseISO(raffle.startDate);
  const endDate = parseISO(raffle.endDate);
  const now = new Date();
  const isActive = raffle.status === 'Active';
  const isCompleted = raffle.status === 'Completed';
  
  // Calculate progress percentage
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
  
  const handleJoinRaffle = async () => {
    if (!onJoinRaffle) return;
    
    setIsLoading(true);
    try {
      await onJoinRaffle(raffle.id);
      // Optionally close the modal after successful join
      // onOpenChange(false);
    } catch (error) {
      console.error('Error joining raffle:', error);
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
                    isActive && 'bg-green-500/20 text-green-400',
                    isCompleted && 'bg-blue-500/20 text-blue-400',
                    !isActive && !isCompleted && 'bg-yellow-500/20 text-yellow-400'
                  )}
                >
                  {raffle.status}
                </Badge>
                {raffle.requireMembership && (
                  <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-none text-xs">
                    Membership Required
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{raffle.prizePool}</div>
              <div className="text-xs text-gray-400">Total Prize Pool</div>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">
                {isCompleted ? 'Raffle Ended' : isActive ? 'Time Remaining' : 'Starts In'}
              </span>
              <span className="text-gray-300">
                {isCompleted 
                  ? format(endDate, 'MMM d, yyyy')
                  : isActive 
                    ? `${Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))} days`
                    : format(startDate, 'MMM d, yyyy')
                }
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{format(startDate, 'MMM d, yyyy')}</span>
              <span>{format(endDate, 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="h-4 w-4" />
                <span className="text-sm">Participants</span>
              </div>
              <div className="text-xl font-bold mt-1">{raffle.ticketsSold || '0'}</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="h-4 w-4" />
                <span className="text-sm">Winners</span>
              </div>
              <div className="text-xl font-bold mt-1">{raffle.winnersCount || '1'}</div>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Ends In</span>
              </div>
              <div className="text-xl font-bold mt-1">
                {isCompleted ? 'Ended' : `${Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}d`}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-300 mb-2">About This Raffle</h3>
            <p className="text-gray-400 text-sm">
              {raffle.description || 'No description provided for this raffle.'}
            </p>
          </div>

          {/* Token Info */}
          {raffle.tokenAddress && (
            <div className="bg-gray-800/30 p-4 rounded-lg">
              <h3 className="font-medium text-gray-300 mb-2">Prize Details</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Token</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{raffle.tokenSymbol || 'TOKEN'}</span>
                  <a 
                    href={`https://etherscan.io/address/${raffle.tokenAddress}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Join Raffle Section */}
          {isActive && onJoinRaffle && (
            <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-gray-300 mb-3">Enter Raffle</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="ticketCount" className="text-sm text-gray-400">Tickets</label>
                    <span className="text-xs text-gray-500">Max: {raffle.maxTicketsPerUser || '10'} per wallet</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      id="ticketCount"
                      min="1"
                      max={raffle.maxTicketsPerUser || 10}
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Math.min(Number(e.target.value), raffle.maxTicketsPerUser || 10))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-sm">Tickets</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 h-11 mt-auto"
                  onClick={handleJoinRaffle}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Enter Raffle'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                By entering this raffle, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}

          {/* Winners Section */}
          {isCompleted && raffle.winners && raffle.winners.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-300 mb-3">Winners</h3>
              <div className="space-y-2">
                {raffle.winners.map((winner, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-mono text-sm text-gray-300">
                        {`${winner.substring(0, 6)}...${winner.substring(38)}`}
                      </span>
                    </div>
                    <a 
                      href={`https://etherscan.io/address/${winner}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm"
                    >
                      View on Etherscan
                    </a>
                  </div>
                ))}
              </div>
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
