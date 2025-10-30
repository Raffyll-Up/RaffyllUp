'use client'
import { Community } from "@/lib/communityData";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  const router = useRouter();
  // Format the creation date
  const formattedDate = format(new Date(community.created), 'MMM d, yyyy');

  // Get the first letter of the community name for the avatar
  const avatarLetter = community.name.charAt(0).toUpperCase();

  // Generate a random color based on the community name for the avatar
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-yellow-100 text-yellow-800',
  ];
  const colorIndex = community.name.length % colors.length;
  const avatarClass = `flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold ${colors[colorIndex]}`;

  // Shorten the owner address for display
  const shortAddress = `${community.owner.slice(0, 6)}...${community.owner.slice(-4)}`;

  return (
    <div className="w-full max-w-sm overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Card className="bg-dark-secondary/30 backdrop-blur-sm border-dark-border hover:border-teal-500/30 transition-colors">
        <CardContent className="px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className={avatarClass}>
              {avatarLetter}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-white">{community.name}</CardTitle>
              <CardDescription className="text-sm text-gray-400">Created on {formattedDate}</CardDescription>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-6">
            <p className="flex items-center text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              <span>Owner: {shortAddress}</span>
            </p>
            <Button 
            variant="outline" 
            className="text-gray-700 hover:text-gray-500 hover:bg-gray-500/10"
            onClick={() => router.push(`/communities/${community.id}`)}
            >View Community</Button>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
