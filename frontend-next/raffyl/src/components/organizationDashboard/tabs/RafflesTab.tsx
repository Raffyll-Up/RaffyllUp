import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, MoreHorizontal, Calendar, Users, Award } from "lucide-react";
import { rafflesData } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

const statusVariant = {
  Active: 'bg-green-500/20 text-green-400',
  Upcoming: 'bg-blue-500/20 text-blue-400',
  Completed: 'bg-gray-500/20 text-gray-400',
  Draft: 'bg-yellow-500/20 text-yellow-400'
} as const;

export function RafflesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredRaffles = rafflesData.filter(raffle => {
    const matchesSearch = raffle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || raffle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" /> Create Raffle
              </Button>
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
                  <TableRow key={raffle.id} className="border-gray-800 hover:bg-gray-800/30">
                    <TableCell>
                      <div className="font-medium">{raffle.name}</div>
                      <div className="text-sm text-gray-400">ID: {raffle.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusVariant[raffle.status as keyof typeof statusVariant]}`}>
                        {raffle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{raffle.prizePool}</div>
                      <div className="text-xs text-gray-400">Total prize</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>1.2k</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {raffle.startDate} - {raffle.endDate}
                        </span>
                      </div>
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
                    No raffles found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Card className="bg-gray-900/40 border-gray-800">
  <CardContent className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRaffles.map(raffle => (
        <Card key={raffle.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-lg">{raffle.name}</h3>
              <Badge className={statusVariant[raffle.status as keyof typeof statusVariant]}>
                {raffle.status}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Award className="h-4 w-4" />
                <span>{raffle.prizePool}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>1.2k Participants</span>
              </div>
              <div className="pt-3">
                <Progress value={75} className="h-2" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>15 days left</span>
                  <span>75% filled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </CardContent>
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
    </div>
  );
}
