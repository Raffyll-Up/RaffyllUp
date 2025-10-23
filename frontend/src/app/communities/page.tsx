import { CommunityCard } from "@/components/home/CommunityCard";
import { communityData } from "@/lib/communityData";

export default function CommunitiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">All Communities</h1>
          <p className="text-gray-400">Browse through all available communities</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityData.map((community, index) => (
            <CommunityCard 
              key={`${community.name}-${index}`} 
              community={community} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
