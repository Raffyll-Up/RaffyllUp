import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Calendar, Users, Award } from "lucide-react";
import { rafflesData } from "@/lib/data";
import { CreateRaffleModal } from "@/components/raffles/CreateRaffleModal";
import { RaffleDetailsModal } from "@/components/raffles/RaffleDetailsModal";
import { Raffle } from "@/lib/data";

const statusVariant = {
  Active: 'bg-green-500/20 text-green-400',
  Upcoming: 'bg-blue-500/20 text-blue-400',
  Completed: 'bg-gray-500/20 text-gray-400',
  Draft: 'bg-yellow-500/20 text-yellow-400'
} as const;

export function RafflesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredRaffles = rafflesData.filter(raffle => {
    const matchesSearch = raffle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || raffle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRaffleClick = (raffle: Raffle) => {
    setSelectedRaffle(raffle);
    setIsDetailsOpen(true);
  };

  const handleJoinRaffle = async (raffleId: string) => {
    console.log('Joining raffle:', raffleId);
    // TODO: Connect to your smart contract here
    // Example:
    // await contract.joinRaffle(raffleId, { value: ticketPrice });
    // Then refresh the raffles list
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-900/40 border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search raffles..."
                className="pl-10 bg-gray-900 border-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <CreateRaffleModal />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raffles Table */}
      <Card className="bg-gray-900/40 border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800/50">
              <TableRow className="border-gray-800">
                <TableHead className="w-[300px]">Raffle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prize Pool</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRaffles.length > 0 ? (
                filteredRaffles.map((raffle) => (
                  <TableRow 
                    key={raffle.id} 
                    className="border-gray-800 hover:bg-gray-800/30 cursor-pointer"
                    onClick={() => handleRaffleClick(raffle)}
                  >
                    <TableCell>
                      <div className="font-medium">{raffle.name}</div>
                      <div className="text-sm text-gray-400">ID: {raffle.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusVariant[raffle.status as keyof typeof statusVariant]}`}>
                        {raffle.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{raffle.prizePool}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{raffle.ticketsSold || '0'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{raffle.startDate} - {raffle.endDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                    No raffles found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Total Raffles</p>
                <p className="text-2xl font-bold">{rafflesData.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Award className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-400">Active Raffles</p>
                <p className="text-2xl font-bold">
                  {rafflesData.filter(r => r.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <Award className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-400">Total Participants</p>
                <p className="text-2xl font-bold">1.2k</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raffle Details Modal */}
      {selectedRaffle && (
        <RaffleDetailsModal
          raffle={{
            ...selectedRaffle,
            // Add any additional properties that might be needed
            description: selectedRaffle.description || `Join ${selectedRaffle.name} for a chance to win amazing prizes!`,
            totalTickets: selectedRaffle.totalTickets || 1000,
            ticketsSold: selectedRaffle.ticketsSold || Math.floor(Math.random() * 500) + 50,
            maxTicketsPerUser: 10,
            tokenAddress: '0x0000000000000000000000000000000000000000', // ETH
            tokenSymbol: 'ETH',
            tokenDecimals: 18,
            winnersCount: selectedRaffle.winnersCount || 1,
            winners: selectedRaffle.winners || [],
            requireMembership: selectedRaffle.requireMembership || false
          }}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onJoinRaffle={handleJoinRaffle}
        />
      )}
    </div>
  );
}
