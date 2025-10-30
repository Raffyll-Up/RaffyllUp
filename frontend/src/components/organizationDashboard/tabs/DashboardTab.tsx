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
  <Card className="bg-dark-bg border-dark-secondary hover:bg-dark-secondary/10 transition-all duration-200">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
        {icon && <div className="text-text-secondary/80">{icon}</div>}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{value}</div>
      {change && (
        <div className={`text-xs mt-1 flex items-center gap-1 ${
          changeType === 'increase' ? 'text-emerald-400' : 
          changeType === 'decrease' ? 'text-rose-400' : 'text-text-secondary'
        }`}>
          {change}
          {changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : ''}
        </div>
      )}
    </CardContent>
  </Card>);


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
    <div className="space-y-8 relative">
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Welcome to {community.name} Dashboard
        </h2>
        <p className="text-text-secondary text-lg">
          Manage your community raffles, participants, and funds in one place.
        </p>
      </div>

      {/* Company Info */}
      <Card className="bg-dark-bg border-dark-secondary backdrop-blur-sm bg-opacity-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {community.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {community.name}
              </h2>
              <p className="text-text-secondary text-sm">
                <span className="font-medium">Owner:</span> {community.owner}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" 
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1">
                  Active
                </Badge>
                <Badge variant="outline" 
                  className="text-text-secondary border-dark-secondary px-3 py-1">
                  Est. {community.created}
                </Badge>
                <Badge variant="outline" 
                  className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1">
                  Premium
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Recent Raffles</h2>
            <p className="text-text-secondary">Track and manage your organization&apos;s raffles</p>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-dark-secondary bg-dark-bg backdrop-blur-sm bg-opacity-50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-secondary">
              <thead className="bg-dark-secondary/20">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Raffle Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Prize Pool</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-dark-bg/50 divide-y divide-dark-secondary">
                {recentRaffles.map((raffle) => (
                  <tr key={raffle.id} className="hover:bg-dark-secondary/10 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">{raffle.name}</div>
                      <div className="text-xs text-text-secondary mt-0.5">ID: {raffle.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="secondary"
                        className={`${
                          raffle.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          raffle.status === 'PaidOut' 
                            ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        } border px-3 py-1`}
                      >
                        {raffle.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-white">{raffle.prizePool}</div>
                      <div className="text-xs text-text-secondary mt-0.5">Total prize</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{raffle.startDate} to {raffle.endDate}</div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {raffle.status === 'Active' ? 'Ends in 15 days' : 
                         raffle.status === 'PaidOut' ? 'Completed' : 'Starts soon'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="bg-dark-secondary/10 border-dark-secondary hover:bg-dark-secondary/20 text-white"
                      >
                        View Details
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
