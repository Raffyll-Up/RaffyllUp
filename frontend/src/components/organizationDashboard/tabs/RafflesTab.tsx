import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Users } from "lucide-react";
import { communityData } from "@/lib/communityData";
import { CreateRaffleModal } from "@/components/raffles/CreateRaffleModal";
import { RaffleDetailsModal } from "@/components/raffles/RaffleDetailsModal";

const statusVariant = {
  Active: 'bg-green-500/20 text-green-400',
  Upcoming: 'bg-blue-500/20 text-blue-400',
  Completed: 'bg-gray-500/20 text-gray-400',
  Draft: 'bg-yellow-500/20 text-yellow-400'
} as const;

export function RafflesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRaffle, setSelectedRaffle] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredRaffles = communityData.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || community.raffles[0].status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRaffleClick = (raffle: any) => {
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

  function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

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
              <CreateRaffleModal 
                // open={isCreateModalOpen} 
                // onOpenChange={setIsCreateModalOpen} 
              />
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
                filteredRaffles.map((community) => (
                  <TableRow 
                    key={community.name} 
                    className="border-gray-800 hover:bg-gray-800/30 cursor-pointer"
                  >
                    <TableCell className="font-medium text-white">{community.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          'border-none text-xs',
                          statusVariant[community.raffles[0].status as keyof typeof statusVariant]
                        )}
                      >
                        {community.raffles[0].status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{community.raffles[0].prizePool}</TableCell>
                    <TableCell className="text-gray-400">{community.raffles[0].endDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{community.raffles[0].participants.length} / {community.raffles[0].maxParticipants}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRaffleClick(community);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                    No raffles found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Raffle Details Modal */}
      {selectedRaffle && (
        <RaffleDetailsModal
          raffle={selectedRaffle}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onJoinRaffle={handleJoinRaffle}
        />
      )}
    </div>
  );
}
