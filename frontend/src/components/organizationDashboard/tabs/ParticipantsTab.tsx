import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Copy,
  ExternalLink,
  Filter,
  BarChart2,
  Ticket,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

type ParticipantStatus = "all" | "active" | "inactive";

type ParticipantDetails = {
  walletAddress: string;
  tickets: number;
  lastActivity: string;
  joinDate: string;
  status: ParticipantStatus;
  txCount: number;
};

export function ParticipantsTab({ community }: ParticipantsTabProps) {
  const [selectedParticipant, setSelectedParticipant] =
    useState<ParticipantDetails | null>(null);

  const handleViewDetails = (participant: ParticipantDetails) => {
    setSelectedParticipant(participant);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParticipantStatus>("all");
  const [sortBy, setSortBy] = useState<{
    field: "wallet" | "tickets" | "lastActivity";
    direction: "asc" | "desc";
  }>({
    field: "lastActivity",
    direction: "desc",
  });

  // Aggregate all unique wallet addresses from all raffles
  const participants = useMemo(() => {
    const participantMap = new Map<
      string,
      {
        walletAddress: string;
        tickets: number;
        lastActivity: string;
        joinDate: string;
        status: ParticipantStatus;
        txCount: number;
      }
    >();

    community.raffles.forEach((raffle) => {
      raffle.participants.forEach((walletAddress) => {
        if (!participantMap.has(walletAddress)) {
          participantMap.set(walletAddress, {
            walletAddress,
            tickets: 1,
            lastActivity: new Date().toISOString(), // fallback to now
            joinDate: new Date().toISOString(), // fallback to now
            status: "active",
            txCount: 1,
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
    return participants
      .filter((participant) => {
        const matchesSearch = participant.walletAddress
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && participant.status === "active") ||
          (statusFilter === "inactive" && participant.status !== "active");

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy.field === "wallet") {
          return sortBy.direction === "asc"
            ? a.walletAddress.localeCompare(b.walletAddress)
            : b.walletAddress.localeCompare(a.walletAddress);
        } else if (sortBy.field === "tickets") {
          return sortBy.direction === "asc"
            ? a.tickets - b.tickets
            : b.tickets - a.tickets;
        } else {
          // lastActivity
          return sortBy.direction === "asc"
            ? new Date(a.lastActivity).getTime() -
                new Date(b.lastActivity).getTime()
            : new Date(b.lastActivity).getTime() -
                new Date(a.lastActivity).getTime();
        }
      });
  }, [participants, searchQuery, statusFilter, sortBy]);

  const handleSort = (field: "wallet" | "tickets" | "lastActivity") => {
    setSortBy((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-8 relative">
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Participants
          </h2>
          <p className="text-text-secondary text-lg">
            Manage and track participant activity
          </p>
        </div>
      </div>

      <Card className="bg-dark-bg border-dark-secondary backdrop-blur-sm bg-opacity-50">
        <CardHeader className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search by wallet address..."
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
                  onChange={(e) =>
                    setStatusFilter(e.target.value as ParticipantStatus)
                  }
                >
                  <option value="all">All Participants</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <Button
                variant="outline"
                className="bg-dark-secondary/10 border-dark-secondary hover:bg-dark-secondary/20 text-white transition-colors"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Export Data
              </Button>
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
                    onClick={() => handleSort("wallet")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Wallet Address</span>
                      {sortBy.field === "wallet" && (
                        <span className="text-blue-400">
                          {sortBy.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort("tickets")}
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      <span>Tickets</span>
                      {sortBy.field === "tickets" && (
                        <span className="text-blue-400">
                          {sortBy.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span>Transactions</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                    onClick={() => handleSort("lastActivity")}
                  >
                    <div className="flex items-center gap-2">
                      <span>Last Activity</span>
                      {sortBy.field === "lastActivity" && (
                        <span className="text-blue-400">
                          {sortBy.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-bg divide-y divide-dark-secondary/20">
                {filteredParticipants.map((participant, index) => (
                  <tr
                    key={index}
                    className="hover:bg-dark-secondary/10 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200">
                          {participant.walletAddress.slice(0, 6)}...
                          {participant.walletAddress.slice(-4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-text-secondary hover:text-white"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              participant.walletAddress
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-text-secondary hover:text-white"
                          onClick={() =>
                            window.open(
                              `https://etherscan.io/address/${participant.walletAddress}`,
                              "_blank"
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-200">
                        {participant.tickets}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-200">
                        {participant.txCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="text-sm font-medium text-gray-200"
                        title={formatDate(participant.lastActivity)}
                      >
                        {formatTimeAgo(participant.lastActivity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        onClick={() => handleViewDetails(participant)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={selectedParticipant !== null}
        onOpenChange={() => setSelectedParticipant(null)}
      >
        <DialogContent className="bg-dark-bg border-dark-secondary">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Participant Details
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              View detailed information for this participant
            </DialogDescription>
          </DialogHeader>

          {selectedParticipant && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">
                    {selectedParticipant.walletAddress}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-text-secondary hover:text-white"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        selectedParticipant.walletAddress
                      )
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-text-secondary hover:text-white"
                    onClick={() =>
                      window.open(
                        `https://etherscan.io/address/${selectedParticipant.walletAddress}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Total Tickets
                  </label>
                  <p className="text-white">{selectedParticipant.tickets}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Transactions
                  </label>
                  <p className="text-white">{selectedParticipant.txCount}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Status
                  </label>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      selectedParticipant.status === "active"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {selectedParticipant.status === "active"
                      ? "Active"
                      : "Inactive"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Join Date
                  </label>
                  <p className="text-white">
                    {formatDate(selectedParticipant.joinDate)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Last Activity
                </label>
                <p className="text-white">
                  {formatTimeAgo(selectedParticipant.lastActivity)} (
                  {formatDate(selectedParticipant.lastActivity)})
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
