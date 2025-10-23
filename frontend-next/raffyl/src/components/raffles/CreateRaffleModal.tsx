'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Token = {
  address: string;
  symbol: string;
  decimals: number;
};

export function CreateRaffleModal() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default to 1 week from now
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    winnersCount: 1,
    totalPrize: '',
    requireMembership: false,
  });

  // Mock token list - in a real app, this would come from an API or context
  useEffect(() => {
    // This would typically be fetched from an API or context
    setTokens([
      { address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18 },
      { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6 },
      { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
    ]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    
    setIsLoading(true);
    try {
      const raffleData = {
        ...formData,
        endTime: Math.floor(date.getTime() / 1000), // Convert to Unix timestamp
        totalPrize: parseFloat(formData.totalPrize) * (10 ** (tokens.find(t => t.address === formData.token)?.decimals || 18)), // Convert to wei/units
      };
      
      console.log('Creating raffle:', raffleData);
      // TODO: Connect to your smart contract or API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close dialog on success
      setFormData({
        name: '',
        token: '',
        winnersCount: 1,
        totalPrize: '',
        requireMembership: false,
      });
      setOpen(false);
      // TODO: Refresh raffles list or update state
    } catch (error) {
      console.error('Error creating raffle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2 whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Create Raffle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Raffle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Raffle Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Raffle Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter raffle name"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                disabled={isLoading}
                required
              />
            </div>

            {/* Token Selection */}
            <div className="space-y-2">
              <Label htmlFor="token" className="text-gray-300">
                Prize Token
              </Label>
              <select
                id="token"
                value={formData.token}
                onChange={(e) => setFormData({...formData, token: e.target.value})}
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                required
              >
                <option value="">Select a token</option>
                {tokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label className="text-gray-300">End Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-800/80",
                      !date && "text-muted-foreground"
                    )}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Winners Count */}
            <div className="space-y-2">
              <Label htmlFor="winnersCount" className="text-gray-300">
                Number of Winners
              </Label>
              <Input
                id="winnersCount"
                type="number"
                min="1"
                value={formData.winnersCount}
                onChange={(e) => setFormData({...formData, winnersCount: parseInt(e.target.value) || 1})}
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isLoading}
                required
              />
            </div>

            {/* Total Prize */}
            <div className="space-y-2">
              <Label htmlFor="totalPrize" className="text-gray-300">
                Total Prize Amount
              </Label>
              <div className="relative">
                <Input
                  id="totalPrize"
                  type="number"
                  step="0.000000000000000001"
                  min="0"
                  value={formData.totalPrize}
                  onChange={(e) => setFormData({...formData, totalPrize: e.target.value})}
                  className="pl-12 bg-gray-800 border-gray-700 text-white"
                  disabled={isLoading || !formData.token}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">
                    {tokens.find(t => t.address === formData.token)?.symbol || 'TOKEN'}
                  </span>
                </div>
              </div>
            </div>

            {/* Require Membership */}
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="requireMembership" className="text-gray-300">
                Require Community Membership
              </Label>
              <Switch
                id="requireMembership"
                checked={formData.requireMembership}
                onCheckedChange={(checked) => setFormData({...formData, requireMembership: checked})}
                className="data-[state=checked]:bg-blue-600"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !formData.name || !formData.token || !date || !formData.totalPrize}
            >
              {isLoading ? 'Creating...' : 'Create Raffle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
