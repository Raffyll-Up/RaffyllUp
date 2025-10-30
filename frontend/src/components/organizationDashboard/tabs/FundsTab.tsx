import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowUpDown, 
  // Filter, 
  Search, 
  // Copy, 
  // ExternalLink
} from "lucide-react";
import { Community } from "@/lib/communityData";
// import { formatEther } from "viem";

interface FundsTabProps {
  community: Community;
}

type TransactionType = 'all' | 'deposit' | 'withdrawal' | 'prize';
type SortField = 'date' | 'amount' | 'type';

export function FundsTab({ community }: FundsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState<TransactionType>('all');
  const [sortBy, setSortBy] = useState<{ field: SortField; direction: 'asc' | 'desc' }>({
    field: 'date',
    direction: 'desc'
  });

  // Calculate total funds from all raffles
  const totalFunds = useMemo(() => {
    return community.raffles.reduce((sum, raffle) => {
      const amount = parseFloat(raffle.prizePool.replace(/[^0-9.]/g, '')) || 0;
      return sum + amount;
    }, 0);
  }, [community.raffles]);

  // Generate transactions from raffles
  const transactions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txns: any[] = [];
    
    community.raffles.forEach(raffle => {
      // Add entry for raffle creation (deposit)
      txns.push({
        id: `deposit-${raffle.id}`,
        type: 'deposit',
        amount: parseFloat(raffle.prizePool.replace(/[^0-9.]/g, '')) || 0,
        date: raffle.startDate,
        status: 'completed',
        raffleId: raffle.id,
        description: `Deposit for ${raffle.name}`
      });

      // Add entry for prize distribution if completed
      if (raffle.status === 'PaidOut' || raffle.status === 'Drawn') {
        txns.push({
          id: `prize-${raffle.id}`,
          type: 'prize',
          amount: -parseFloat(raffle.prizePool.replace(/[^0-9.]/g, '')) || 0,
          date: raffle.endDate,
          status: 'completed',
          raffleId: raffle.id,
          description: `Prize distribution for ${raffle.name}`,
          // winner: raffle.winner
        });
      }
    });

    return txns;
  }, [community.raffles]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.raffleId.toString().includes(searchQuery);
      
      const matchesType = txTypeFilter === 'all' || tx.type === txTypeFilter;
      
      return matchesSearch && matchesType;
    }).sort((a, b) => {
      if (sortBy.field === 'date') {
        return sortBy.direction === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy.field === 'amount') {
        return sortBy.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      } else { // type
        return sortBy.direction === 'asc'
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      }
    });
  }, [transactions, searchQuery, txTypeFilter, sortBy]);

  const handleSort = (field: SortField) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTxTypeBadge = (type: string) => {
    switch (type) {
      case 'deposit':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">Deposit</span>;
      case 'withdrawal':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">Withdrawal</span>;
      case 'prize':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">Prize</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">Other</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Funds</h2>
          <p className="text-sm text-gray-400">Manage and track your community&apos;s financials</p>
        </div>
        <div className="flex items-center gap-3">
          
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFunds.toLocaleString()}</div>
            <p className="text-sm text-green-400 mt-1 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Available to Withdraw</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold">${(totalFunds * 0.9).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <p className="text-sm text-gray-400 mt-1">10% held for fees</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-sm text-gray-400 mt-1">{transactions.filter(tx => tx.type === 'deposit').length} deposits • {transactions.filter(tx => tx.type === 'prize').length} prizes</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold">Transaction History</h3>
              <p className="text-sm text-gray-400">All financial activities in your community</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search transactions..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value as TransactionType)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="prize">Prizes</option>
              </select>
              <Button variant="outline" className="border-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
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
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date & Time
                      {sortBy.field === 'date' && (
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    Transaction
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Type
                      {sortBy.field === 'type' && (
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center justify-end">
                      Amount
                      {sortBy.field === 'amount' && (
                        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{tx.description}</div>
                        <div className="text-xs text-gray-400">
                          Raffle ID: {tx.raffleId}
                          {tx.winner && (
                            <span className="ml-2 text-blue-400">
                              Winner: {`${tx.winner.substring(0, 6)}...${tx.winner.substring(38)}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTxTypeBadge(tx.type)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <div className="flex items-center justify-end">
                          {tx.amount >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1 text-green-400" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 mr-1 text-red-400" />
                          )}
                          ${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      {searchQuery || txTypeFilter !== 'all' 
                        ? 'No transactions match your filters' 
                        : 'No transactions found'}
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
