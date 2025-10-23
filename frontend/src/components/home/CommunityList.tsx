"use client";

import { communityData } from "@/lib/communityData";
import { CommunityCard } from "./CommunityCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommunityList() {
  const router = useRouter();
  // Only show the first 6 communities on the home page
  const displayedCommunities = communityData.slice(0, 6);

  // Check if there are more communities to show
  const hasMore = communityData.length > 6;

  return (
    <div className="w-full">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Communities</h2>
        <div className="flex items-center gap-2">
          {hasMore && (
            <Button
              variant="ghost"
              onClick={() => router.push('/communities')}
              className="text-teal-400 hover:bg-teal-900/30 hover:text-teal-300">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCommunities.map((community, index) => (
          <CommunityCard key={`${community.name}-${index}`} community={community} />
        ))}
      </div>


    </div>
  );
}
