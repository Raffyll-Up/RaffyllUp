import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Community } from "@/lib/communityData";
import { CreateRaffleModal } from "@/components/raffles/CreateRaffleModal"

interface RafflesTabProps {
  community: Community;
}

type RaffleStatus = 'all' | 'active' | 'upcoming' | 'completed' | 'cancelled';

export function RafflesTab({ community }: RafflesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RaffleStatus>('all');
  const [sortBy, setSortBy] = useState<{ field: 'name' | 'endDate' | 'prize'; direction: 'asc' | 'desc' }>({
    field: 'endDate',
    direction: 'asc'
  });

  const filteredRaffles = useMemo(() => {
    return community.raffles.filter(raffle => {
      // Filter by search query
      const matchesSearch = raffle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        raffle.id.toString().includes(searchQuery);

      // Filter by status
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && raffle.status === 'Active') ||
        (statusFilter === 'upcoming' && raffle.status === 'Upcoming') ||
        (statusFilter === 'completed' && (raffle.status === 'PaidOut' || raffle.status === 'Drawn')) ||
        (statusFilter === 'cancelled' && raffle.status === 'Cancelled');

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      // Sort by selected field
      if (sortBy.field === 'name') {
        return sortBy.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy.field === 'endDate') {
        return sortBy.direction === 'asc'
          ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      } else { // prize
        const prizeA = parseFloat(a.prizePool.replace(/[^0-9.]/g, '')) || 0;
        const prizeB = parseFloat(b.prizePool.replace(/[^0-9.]/g, '')) || 0;
        return sortBy.direction === 'asc' ? prizeA - prizeB : prizeB - prizeA;
      }
    });
  }, [community.raffles, searchQuery, statusFilter, sortBy]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500/20 text-green-400">Active</Badge>;
      case 'Upcoming':
        return <Badge className="bg-blue-500/20 text-blue-400">Upcoming</Badge>;
      case 'PaidOut':
      case 'Drawn':
        return <Badge className="bg-purple-500/20 text-purple-400">Completed</Badge>;
      case 'Cancelled':
        return <Badge className="bg-red-500/20 text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSort = (field: 'name' | 'endDate' | 'prize') => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Raffles</h2>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search raffles..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as RaffleStatus)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <CreateRaffleModal/>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortBy.field === 'name' && (
                        <span className="ml-1">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center">
                      End Date
                      {sortBy.field === 'endDate' && (
                        <span className="ml-1">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('prize')}
                  >
                    <div className="flex items-center">
                      Prize Pool
                      {sortBy.field === 'prize' && (
                        <span className="ml-1">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Participants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredRaffles.length > 0 ? (
                  filteredRaffles.map((raffle) => (
                    <tr key={raffle.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{raffle.name}</div>
                        <div className="text-xs text-gray-400">ID: {raffle.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(raffle.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                        {raffle.prizePool}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {raffle.participants.length} / {raffle.maxParticipants || '∞'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(raffle.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No raffles found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
