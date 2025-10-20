import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Copy, ExternalLink, Filter, MoreHorizontal, BarChart2, Ticket, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { formatEther } from "viem";

// Mock data for Web3 participants
const participantsData = [
  {
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    tickets: 5,
    totalSpent: "0.1", // in ETH
    lastActivity: "2 hours ago",
    status: "active",
    joinDate: "2023-10-15",
    txCount: 3
  },
  {
    walletAddress: "0x1234567890123456789012345678901234567890",
    tickets: 3,
    totalSpent: "0.06",
    lastActivity: "1 day ago",
    status: "active",
    joinDate: "2023-10-10",
    txCount: 1
  },
  // ... more participants
];

export function ParticipantsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredParticipants = participantsData.filter(participant => {
    const matchesSearch = 
      participant.walletAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
                placeholder="Search by wallet or ENS..."
                className="pl-10 bg-gray-900 border-gray-800 font-mono"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800">
                  <Filter className="h-4 w-4 text-gray-400 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All Wallets</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              Add Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Participants Table */}
      <Card className="bg-gray-900/40 border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800/50">
              <TableRow className="border-gray-800">
                <TableHead>Wallet Address</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((participant) => (
                  <TableRow key={participant.walletAddress} className="border-gray-800 hover:bg-gray-800/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                        {participant.walletAddress && (
                          <div className="text-xs text-gray-400 font-mono">
                            {formatAddress(participant.walletAddress)}
                          </div>
                        )}
                          <button 
                            onClick={() => copyToClipboard(participant.walletAddress)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <a 
                            href={`https://etherscan.io/address/${participant.walletAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{participant.tickets}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{participant.totalSpent} ETH</div>
                      <div className="text-xs text-gray-400">
                        ${(parseFloat(participant.totalSpent) * 1800).toFixed(2)} USD
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{participant.txCount}</div>
                      <div className="text-xs text-gray-400">transactions</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{participant.lastActivity}</div>
                      <div className="text-xs text-gray-400">Joined {participant.joinDate}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                    No participants found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-400">Total Wallets</p>
                <p className="text-2xl font-bold">{participantsData.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-500/20">
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-400">Total Tickets</p>
                <p className="text-2xl font-bold">
                  {participantsData.reduce((sum, p) => sum + p.tickets, 0)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-purple-500/20">
                <Ticket className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-400">Total Volume</p>
                <p className="text-2xl font-bold">
                  {participantsData.reduce((sum, p) => sum + parseFloat(p.totalSpent), 0).toFixed(2)} ETH
                </p>
              </div>
              <div className="p-2 rounded-full bg-green-500/20">
                {/* <Ethereum className="h-5 w-5 text-green-400" /> */}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-400">Avg. Tickets/Wallet</p>
                <p className="text-2xl font-bold">
                  {(participantsData.reduce((sum, p) => sum + p.tickets, 0) / participantsData.length).toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-amber-500/20">
                <BarChart2 className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}