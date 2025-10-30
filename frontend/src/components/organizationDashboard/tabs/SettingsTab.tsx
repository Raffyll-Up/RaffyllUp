import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
// Define a local Community type with all required fields for this tab
type Community = {
  id: string | number;
  name: string;
  description?: string;
  website?: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
  isPublic?: boolean;
  allowPublicJoin?: boolean;
};
import { toast } from "sonner";

const settingsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  twitter: z.string().optional(),
  discord: z.string().optional(),
  isPublic: z.boolean().default(true),
  allowPublicJoin: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsTabProps {
  community: Community;
}

export function SettingsTab({ community }: SettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<SettingsFormValues>({
  resolver: zodResolver(settingsFormSchema) as Resolver<SettingsFormValues>,
    defaultValues: {
      name: community.name,
      description: community.description || "",
      website: community.website || "",
      twitter: community.socials?.twitter || "",
      discord: community.socials?.discord || "",
      isPublic: community.isPublic !== false,
      allowPublicJoin: community.allowPublicJoin !== false,
    },
  });

  const onSubmit = useCallback(async (data: SettingsFormValues) => {
    try {
      setIsSaving(true);
      
      // In a real app, you would make an API call here to update the community
      console.log("Updating community settings:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleSocialInput = (e: React.ChangeEvent<HTMLInputElement>, platform: 'twitter' | 'discord') => {
    let value = e.target.value;
    
    // Remove @ symbol and any URL parts if pasted
    if (platform === 'twitter') {
      value = value.replace(/^https?:\/\/(www\.)?twitter\.com\//, '').replace('@', '');
      form.setValue('twitter', value);
    } else if (platform === 'discord') {
      value = value.replace(/^https?:\/\/(www\.)?discord\.(com|gg)\//, '');
      form.setValue('discord', value);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h2>
        <p className="text-text-secondary text-lg">
          Manage your community&apos;s profile and preferences
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-dark-bg/50 border-dark-secondary/30">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">General Information</CardTitle>
            <CardDescription className="text-text-secondary/80">
              Update your community&apos;s public information and visibility settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-secondary text-sm">Community Name</Label>
                <Input
                  id="name"
                  placeholder="Enter community name"
                  className="bg-dark-bg/50 border-dark-secondary/50 text-white placeholder:text-text-secondary/50 focus:border-blue-500/50"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-rose-400">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="text-text-secondary text-sm">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  className="bg-dark-bg/50 border-dark-secondary/50 text-white placeholder:text-text-secondary/50 focus:border-blue-500/50"
                  {...form.register("website")}
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-rose-400">{form.formState.errors.website.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-text-secondary text-sm">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell others about your community..."
                className="min-h-[100px] bg-dark-bg/50 border-dark-secondary/50 text-white placeholder:text-text-secondary/50 focus:border-blue-500/50"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-rose-400">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-text-secondary text-sm">Twitter</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-secondary/50 bg-dark-secondary/10 text-text-secondary/80 text-sm">
                    @
                  </span>
                  <Input
                    id="twitter"
                    placeholder="username"
                    className="rounded-l-none bg-dark-bg/50 border-dark-secondary/50 text-white placeholder:text-text-secondary/50 focus:border-blue-500/50"
                    value={form.watch('twitter')}
                    onChange={(e) => handleSocialInput(e, 'twitter')}
                  />
                </div>
                {form.formState.errors.twitter && (
                  <p className="text-sm text-rose-400">{form.formState.errors.twitter.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discord" className="text-text-secondary text-sm">Discord Server</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-dark-secondary/50 bg-dark-secondary/10 text-text-secondary/80 text-sm whitespace-nowrap">
                    discord.gg/
                  </span>
                  <Input
                    id="discord"
                    placeholder="invite-code"
                    className="rounded-l-none bg-dark-bg/50 border-dark-secondary/50 text-white placeholder:text-text-secondary/50 focus:border-blue-500/50"
                    value={form.watch('discord')}
                    onChange={(e) => handleSocialInput(e, 'discord')}
                  />
                </div>
                {form.formState.errors.discord && (
                  <p className="text-sm text-rose-400">{form.formState.errors.discord.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-bg/50 border-dark-secondary/30">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Privacy & Access</CardTitle>
            <CardDescription className="text-text-secondary/80">
              Control who can view and join your community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-dark-bg/30 border border-dark-secondary/20">
              <div className="space-y-1">
                <Label htmlFor="isPublic" className="text-white text-sm">Public Community</Label>
                <p className="text-sm text-text-secondary/80">
                  {form.watch('isPublic') 
                    ? "Your community is visible to everyone"
                    : "Your community is private and only visible to members"}
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={form.watch('isPublic')}
                onCheckedChange={(checked) => form.setValue('isPublic', checked)}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg bg-dark-bg/30 border border-dark-secondary/20 ${!form.watch('isPublic') ? 'opacity-50' : ''}`}>
              <div className="space-y-1">
                <Label htmlFor="allowPublicJoin" className={`${!form.watch('isPublic') ? 'text-text-secondary' : 'text-white'} text-sm`}>
                  Allow Public Join Requests
                </Label>
                <p className="text-sm text-text-secondary/80">
                  {form.watch('allowPublicJoin')
                    ? "Anyone can request to join your community"
                    : "New members can only be added by admins"}
                </p>
              </div>
              <Switch
                id="allowPublicJoin"
                checked={form.watch('allowPublicJoin')}
                onCheckedChange={(checked) => form.setValue('allowPublicJoin', checked)}
                disabled={!form.watch('isPublic')}
                className="data-[state=checked]:bg-blue-500 disabled:opacity-30"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Danger Zone</CardTitle>
            <CardDescription className="text-red-400/80">
              These actions are irreversible. Proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/10">
              <div className="space-y-1 mb-3 md:mb-0">
                <h4 className="text-sm font-medium text-red-400">Transfer Ownership</h4>
                <p className="text-sm text-red-400/70">
                  Transfer ownership of this community to another wallet address
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors self-start md:self-auto mt-2 md:mt-0"
              >
                Transfer
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/10">
              <div className="space-y-1 mb-3 md:mb-0">
                <h4 className="text-sm font-medium text-red-400">Delete Community</h4>
                <p className="text-sm text-red-400/70">
                  Permanently delete this community and all its data
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors self-start md:self-auto mt-2 md:mt-0"
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
                    console.log('Delete community:', community.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSaving || !form.formState.isDirty}
            className="w-full sm:w-auto border-dark-secondary/50 text-text-secondary hover:bg-dark-secondary/10 hover:border-dark-secondary/70 hover:text-white transition-colors"
          >
            Discard Changes
          </Button>
          <Button 
            type="submit" 
            disabled={isSaving || !form.formState.isDirty}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 transition-opacity"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
