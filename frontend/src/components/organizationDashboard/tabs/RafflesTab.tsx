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
        return (
          <Badge 
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1"
          >
            Active
          </Badge>
        );
      case 'Upcoming':
        return (
          <Badge 
            variant="secondary"
            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1"
          >
            Upcoming
          </Badge>
        );
      case 'PaidOut':
      case 'Drawn':
        return (
          <Badge 
            variant="secondary"
            className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1"
          >
            Completed
          </Badge>
        );
      case 'Cancelled':
        return (
          <Badge 
            variant="secondary"
            className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1"
          >
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge 
            variant="secondary"
            className="bg-dark-secondary/10 text-text-secondary border border-dark-secondary px-3 py-1"
          >
            {status}
          </Badge>
        );
    }
  };

  const handleSort = (field: 'name' | 'endDate' | 'prize') => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-8 relative">
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Raffles
        </h2>
      </div>

      <Card className="bg-dark-bg border-dark-secondary backdrop-blur-sm bg-opacity-50">
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search raffles..."
                className="pl-10 bg-dark-secondary/10 border-dark-secondary text-white placeholder-text-secondary focus:border-blue-500/50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-text-secondary" />
                <select
                  className="bg-dark-secondary/10 border border-dark-secondary text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500/50 transition-colors"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as RaffleStatus)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <CreateRaffleModal/>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark-secondary">
              <thead className="bg-dark-secondary/20">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Name</span>
                      {sortBy.field === 'name' && (
                        <span className="text-blue-400">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center gap-2">
                      <span>End Date</span>
                      {sortBy.field === 'endDate' && (
                        <span className="text-blue-400">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort('prize')}
                  >
                    <div className="flex items-center gap-2">
                      <span>Prize Pool</span>
                      {sortBy.field === 'prize' && (
                        <span className="text-blue-400">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
                  >
                    Participants
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 relative"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-bg/50 divide-y divide-dark-secondary">
                {filteredRaffles.length > 0 ? (
                  filteredRaffles.map((raffle) => (
                    <tr key={raffle.id} className="hover:bg-dark-secondary/10 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{raffle.name}</div>
                        <div className="text-xs text-text-secondary mt-0.5">ID: {raffle.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {new Date(raffle.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{raffle.prizePool}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {raffle.participants.length}
                          <span className="text-text-secondary"> / </span>
                          {raffle.maxParticipants || '∞'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(raffle.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="bg-dark-secondary/10 border-dark-secondary hover:bg-dark-secondary/20 text-white transition-colors"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
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
