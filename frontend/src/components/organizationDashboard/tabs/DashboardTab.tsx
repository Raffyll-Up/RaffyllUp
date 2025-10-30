import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { Community, communityData } from "@/lib/communityData";
// import { RaffleDetailsModal } from "@/components/raffles/RaffleDetailsModal";
import { Button } from "@/components/ui/button";

interface DashboardTabProps {
  // Either pass a community object directly, or pass the selected organisation's name
  community?: Community;
  selectedOrgName?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MetricCard = ({ title, value, change, changeType = 'neutral', icon }: any) => (
  <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && (
        <div className={`text-xs mt-1 ${
          changeType === 'increase' ? 'text-green-400' : 
          changeType === 'decrease' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {change} {changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : ''}
        </div>
      )}
    </CardContent>
  </Card>
);

export function DashboardTab({ community: communityProp, selectedOrgName }: DashboardTabProps) {
  // Resolve community: prefer provided prop, otherwise lookup by selectedOrgName in communityData
  const community = useMemo<Community>(() => {
    if (communityProp) return communityProp;
    if (selectedOrgName) {
      return communityData.find((c) => c.name === selectedOrgName) ?? communityData[0];
    }
    // Fallback to the first community in the data set
    return communityData[0];
  }, [communityProp, selectedOrgName]);

  // Use a safe raffles array so hooks are called unconditionally
  const raffles = useMemo(() => community?.raffles ?? [], [community]);

  // Calculate metrics based on the resolved community's raffles
  const metrics = useMemo(() => {
    const activeRaffles = raffles.filter((r) => r.status === "Active").length;
    const completedRaffles = raffles.filter((r) => r.status === "PaidOut" || r.status === "Drawn").length;
    const upcomingRaffles = raffles.filter((r) => r.status === "Upcoming").length;

    const totalParticipants = raffles.reduce(
      (sum, raffle) => sum + (raffle.participants?.length ?? 0),
      0
    );

    const totalFunds = raffles.reduce((sum, raffle) => {
      const amount = parseFloat((raffle.prizePool || "").replace(/[^0-9.]/g, "")) || 0;
      return sum + amount;
    }, 0);

    return {
      activeRaffles,
      completedRaffles,
      upcomingRaffles,
      totalParticipants,
      totalFunds: `$${totalFunds.toLocaleString()}`,
    };
  }, [raffles]);

  // Get recent raffles (sort by endDate or startDate if available)
  const recentRaffles = useMemo(() => {
    return [...raffles]
      .sort((a, b) => {
        const da = new Date(a.endDate || a.startDate || 0).getTime();
        const db = new Date(b.endDate || b.startDate || 0).getTime();
        return db - da;
      })
      .slice(0, 5);
  }, [raffles]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome to {community.name} Dashboard</h2>
      <p className="text-gray-400">
        Manage your community raffles, participants, and funds in one place.
      </p>

      {/* Company Info */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {community.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold">{community.name}</h2>
              <p className="text-gray-400 mt-1">{community.owner}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Active</Badge>
                <Badge variant="outline" className="text-gray-400">Est. {community.created}</Badge>
                <Badge variant="outline" className="text-gray-400">Premium</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Active Raffles" 
            value={metrics.activeRaffles}
            change="+2 from last month"
            changeType="increase"
          />
          <MetricCard 
            title="Total Participants" 
            value={metrics.totalParticipants.toLocaleString()}
            change="+124 from last week"
            changeType="increase"
          />
          <MetricCard 
            title="Total Funds Raised" 
            value={metrics.totalFunds}
            change="+12.5% from last month"
            changeType="increase"
          />
          <MetricCard 
            title="Completion Rate" 
            value={`${Math.round((metrics.completedRaffles / community.raffles.length) * 100)}%`}
            change="+5% from last quarter"
            changeType="increase"
          />
        </div>
      </div>

      {/* Raffles Overview */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Recent Raffles</h2>
            <p className="text-gray-400 text-sm">Track and manage your organization&apos;s raffles</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Raffle Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prize Pool</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900/50 divide-y divide-gray-800">
                {recentRaffles.map((raffle) => (
                  <tr key={raffle.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">{raffle.name}</div>
                      <div className="text-xs text-gray-400">ID: {raffle.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={raffle.status === 'Active' ? 'default' : 'secondary'}
                        className={`${raffle.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                          raffle.status === 'PaidOut' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-yellow-500/20 text-yellow-400'}`}
                      >
                        {raffle.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      <div className="font-medium">{raffle.prizePool}</div>
                      <div className="text-xs text-gray-500">Total prize</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{raffle.startDate} to {raffle.endDate}</div>
                      <div className="text-xs text-gray-500">
                        {raffle.status === 'Active' ? 'Ends in 15 days' : 
                         raffle.status === 'PaidOut' ? 'Completed' : 'Starts soon'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
