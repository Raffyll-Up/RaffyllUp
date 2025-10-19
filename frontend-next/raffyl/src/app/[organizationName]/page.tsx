import { AppSidebar } from "@/components/organizationDashboard/app-sidebar";
import { SiteHeader } from "@/components/organizationDashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Raffle = {
  id: string;
  name: string;
  status: 'Active' | 'Completed' | 'Locked';
  prizePool: string;
  startDate: string;
  endDate: string;
};

const rafflesData: Raffle[] = [
  {
    id: '1',
    name: 'Tech Raffle 2024',
    status: 'Active',
    prizePool: '$10,000',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
  },
  {
    id: '2',
    name: 'Summer Giveaway',
    status: 'Completed',
    prizePool: '$5,000',
    startDate: '2023-06-01',
    endDate: '2023-07-01',
  },
  {
    id: '3',
    name: 'Holiday Raffle',
    status: 'Completed',
    prizePool: '$7,500',
    startDate: '2023-12-01',
    endDate: '2024-01-01',
  },
  {
    id: '4',
    name: 'Spring Fling',
    status: 'Locked',
    prizePool: '$2,500',
    startDate: '2024-05-01',
    endDate: '2024-06-01',
  },
  {
    id: '5',
    name: 'Autumn Extravaganza',
    status: 'Active',
    prizePool: '$15,000',
    startDate: '2024-09-01',
    endDate: '2024-10-01',
  },
];

export default function Page() {
  return (
    <div className="min-h-screen text-white pt-14">
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
          "backgroundColor": "transparent"
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-transparent">
          <SiteHeader />
          <div className="flex-1 p-6 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">Organization Dashboard</h1>
              <p className="text-gray-400">Overview of your organization&apos;s performance and activities.</p>
            </div>

            {/* Company Info */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm font-medium">
                    COMPANY
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Tech Innovators Inc.</h2>
                    <p className="text-gray-400 mt-1">Leading the way in decentralized solutions for a transparent future.</p>
                    <p className="text-gray-500 text-sm mt-2">Established: 2021</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Raffles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">25</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Active Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,500</div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Funds Raised</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$50,000</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Raffles Overview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Raffles Overview</h2>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Raffle
                </Button>
              </div>
              <Card className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Raffle Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Prize Pool</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">End Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {rafflesData.map((raffle) => (
                        <tr key={raffle.id} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{raffle.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={raffle.status === 'Active' ? 'default' : 
                                      raffle.status === 'Completed' ? 'secondary' : 'outline'}
                              className={`${raffle.status === 'Active' ? 'bg-green-500/20 text-green-400' : 
                                        raffle.status === 'Completed' ? 'bg-gray-500/20 text-gray-400' : 
                                        'bg-yellow-500/20 text-yellow-400'}`}
                            >
                              {raffle.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{raffle.prizePool}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{raffle.startDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{raffle.endDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
