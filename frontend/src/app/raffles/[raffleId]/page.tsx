'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Ticket, Clock, Users, Award, ArrowLeft } from 'lucide-react';
import { communityData } from '@/lib/communityData';
import { format } from 'date-fns';

export default function RafflePage() {
  const router = useRouter();
  const { raffleId } = useParams();
  const [raffleData, setRaffleData] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raffle: any;
    communityName: string;
    communityOwner: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!raffleId) {
      setError('Invalid raffle ID');
      setIsLoading(false);
      return;
    }

    // Find the raffle with the matching ID
    let found = false;
    
    console.log('Searching for raffle with ID:', raffleId);
    console.log('Available communities:', communityData.map(c => ({
      name: c.name,
      raffles: c.raffles.map(r => ({ id: r.id, name: r.name }))
    })));
    
    for (const community of communityData) {
      const raffle = community.raffles.find(r => {
        console.log(`Checking raffle ID: ${r.id} (type: ${typeof r.id}) against ${raffleId} (type: ${typeof raffleId})`);
        return r.id.toString() === raffleId.toString();
      });
      
      if (raffle) {
        console.log('Found matching raffle:', raffle);
        setRaffleData({
          raffle,
          communityName: community.name,
          communityOwner: community.owner
        });
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.error('No raffle found with ID:', raffleId);
      setError('Raffle not found');
    }
    
    setIsLoading(false);
  }, [raffleId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !raffleData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Raffle Not Found</h1>
        <p className="text-gray-400 mb-6">The raffle you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Raffles
        </Button>
      </div>
    );
  }

  const { raffle, communityName } = raffleData;
  
  // Format the end date
  const formattedEndDate = raffle.endDate 
    ? format(new Date(raffle.endDate), 'MMMM d, yyyy')
    : 'No end date';

  const formattedStartDate = raffle.createdAt 
    ? format(new Date(raffle.createdAt), 'MMMM d, yyyy')
    : 'No start date';
    
  // Calculate progress percentage
  const progress = raffle.maxParticipants > 0 
    ? (raffle.participants.length / raffle.maxParticipants) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-dark-background text-white pt-14">
      {/* Header */}
      <div className="bg-dark-secondary/50 border-b border-dark-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{raffle.name}</h1>
          </div>
          <p className="text-teal-400">{communityName}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Raffle Image */}
            <div className="bg-dark-secondary/30 rounded-lg overflow-hidden h-64 flex items-center justify-center">
              <Ticket className="w-16 h-16 text-teal-400" />
            </div>
            
            {/* Raffle Details */}
            <div className="bg-dark-secondary/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About This Raffle</h2>
              <p className="text-gray-300 mb-6">
                {raffle.description || 'No description provided for this raffle.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-teal-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Ends</p>
                    <p className="font-medium">{formattedEndDate}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-teal-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Participants</p>
                    <p className="font-medium">{raffle.participants.length} / {raffle.maxParticipants || '∞'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-teal-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-400">Prize Pool</p>
                    <p className="font-medium">{raffle.prizePool || 'No prize specified'}</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button className="bg-teal-600 hover:bg-teal-700 flex-1">
                  Enter Raffle
                </Button>
                <Button variant="outline" className="flex-1">
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-dark-secondary/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Raffle Status</h3>
              <div className="flex items-center justify-between p-4 bg-dark-background/50 rounded-lg">
                <span className="text-sm font-medium">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  raffle.status === 'Active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : raffle.status === 'Ended'
                    ? 'bg-red-900/30 text-red-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {raffle.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Created</span>
                  <span>{formattedStartDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Entries</span>
                  <span>{raffle.participants.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Winners</span>
                  <span>{raffle.winnerCount || 1}</span>
                </div>
              </div>
            </div>
            
            {/* Organizer Card */}
            <div className="bg-dark-secondary/30 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Organizer</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <span className="text-teal-400 font-medium">
                    {communityName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{communityName}</p>
                  <p className="text-sm text-gray-400">
                    {raffleData.communityOwner.slice(0, 6)}...{raffleData.communityOwner.slice(-4)}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => router.push(`/communities/${communityName}`)}
              >
                View Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
