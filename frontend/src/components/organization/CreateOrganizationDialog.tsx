'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';

export function CreateCommunityDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    try {
      // TODO: Connect to your API to create the community
      console.log('Creating community:', name);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close dialog on success
      setName('');
      setOpen(false);
      // TODO: Refresh communities list or update state
    } catch (error) {
      console.error('Error creating community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-white text-teal-600 hover:bg-teal-50 font-medium">
          <Plus className="h-4 w-4" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Community Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter community name"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                disabled={isLoading}
                required
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
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
