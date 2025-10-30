import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, ExternalLink, Filter, BarChart2, Ticket, Wallet } from "lucide-react";
// Define a local Community type for this tab
type Community = {
  raffles: Array<{
    id: string | number;
    participants: string[]; // array of wallet addresses
  }>;
};

interface ParticipantsTabProps {
  community: Community;
}

type ParticipantStatus = 'all' | 'active' | 'inactive';

export function ParticipantsTab({ community }: ParticipantsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus>('all');
  const [sortBy, setSortBy] = useState<{ field: 'wallet' | 'tickets' | 'lastActivity'; direction: 'asc' | 'desc' }>({
    field: 'lastActivity',
    direction: 'desc'
  });

  // Aggregate all unique wallet addresses from all raffles
  const participants = useMemo(() => {
    const participantMap = new Map<string, {
      walletAddress: string;
      tickets: number;
      lastActivity: string;
      joinDate: string;
      status: ParticipantStatus;
      txCount: number;
    }>();

    community.raffles.forEach(raffle => {
      raffle.participants.forEach(walletAddress => {
        if (!participantMap.has(walletAddress)) {
          participantMap.set(walletAddress, {
            walletAddress,
            tickets: 1,
            lastActivity: new Date().toISOString(), // fallback to now
            joinDate: new Date().toISOString(), // fallback to now
            status: 'active',
            txCount: 1
          });
        } else {
          const existing = participantMap.get(walletAddress)!;
          existing.tickets += 1;
          existing.txCount += 1;
          // Optionally update lastActivity/joinDate if you have timestamps
        }
      });
    });

    return Array.from(participantMap.values());
  }, [community.raffles]);

  const filteredParticipants = useMemo(() => {
    return participants.filter(participant => {
      const matchesSearch = participant.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && participant.status === 'active') ||
        (statusFilter === 'inactive' && participant.status !== 'active');

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy.field === 'wallet') {
        return sortBy.direction === 'asc'
          ? a.walletAddress.localeCompare(b.walletAddress)
          : b.walletAddress.localeCompare(a.walletAddress);
      } else if (sortBy.field === 'tickets') {
        return sortBy.direction === 'asc'
          ? a.tickets - b.tickets
          : b.tickets - a.tickets;
      } else { // lastActivity
        return sortBy.direction === 'asc'
          ? new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime()
          : new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      }
    });
  }, [participants, searchQuery, statusFilter, sortBy]);

  const handleSort = (field: 'wallet' | 'tickets' | 'lastActivity') => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Participants</h2>
          <p className="text-sm text-gray-400">Manage and track participant activity</p>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by wallet address..."
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
                onChange={(e) => setStatusFilter(e.target.value as ParticipantStatus)}
              >
                <option value="all">All Participants</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-gray-700">
                  <BarChart2 className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
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
                    onClick={() => handleSort('wallet')}
                  >
                    <div className="flex items-center">
                      Wallet Address
                      {sortBy.field === 'wallet' && (
                        <span className="ml-1">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('tickets')}
                  >
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 mr-1" />
                      Tickets
                      {sortBy.field === 'tickets' && (
                        <span className="ml-1">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <Wallet className="w-4 h-4 mr-1 inline" />
                    Transactions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lastActivity')}
                  >
                    <div className="flex items-center">
                      Last Activity
                      {sortBy.field === 'lastActivity' && (
                        <span className="ml-1">
                          {sortBy.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <tr key={participant.walletAddress} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-blue-400">
                            {`${participant.walletAddress.substring(0, 6)}...${participant.walletAddress.substring(participant.walletAddress.length - 4)}`}
                          </div>
                          <button
                            className="ml-2 text-gray-400 hover:text-blue-400"
                            onClick={() => navigator.clipboard.writeText(participant.walletAddress)}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`https://etherscan.io/address/${participant.walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-gray-400 hover:text-blue-400"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Joined {formatDate(participant.joinDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{participant.tickets}</div>
                        <div className="text-xs text-gray-400">total tickets</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{participant.txCount}</div>
                        <div className="text-xs text-gray-400">transactions</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTimeAgo(participant.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          View Activity
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      {searchQuery ? 'No participants found matching your search' : 'No participants found'}
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