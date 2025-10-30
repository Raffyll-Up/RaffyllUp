"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardTab } from '@/components/organizationDashboard/tabs/DashboardTab';
import { RafflesTab } from '@/components/organizationDashboard/tabs/RafflesTab';
import { ParticipantsTab } from '@/components/organizationDashboard/tabs/ParticipantsTab';
import { FundsTab } from '@/components/organizationDashboard/tabs/FundsTab';
import { SettingsTab } from '@/components/organizationDashboard/tabs/SettingsTab';
import { communityData } from '@/lib/communityData';

type TabValue = 'dashboard' | 'raffles' | 'participants' | 'funds' | 'settings';

interface OrganizationPageProps {
  // params may be a Promise-like object in newer Next.js versions; keep it loose here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}

export default function OrganizationPage({ params }: OrganizationPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');
  const [currentCommunity, setCurrentCommunity] = useState(communityData[0]); 
  const [isLoading, setIsLoading] = useState(true);

  // `params` can be a Promise-like object in newer Next.js versions. Use React.use() to unwrap it.
  const resolvedParams = React.use ? React.use(params) : params;
  const dashboardName: string = (resolvedParams?.dashboard ?? "").toString();

  useEffect(() => {
    const community = communityData.find((org) =>
      org.name.toLowerCase() === dashboardName.toLowerCase()
    );

    if (community) {
      setCurrentCommunity(community);
    } else {
      console.log(`Community with name ${dashboardName} not found`);
      // Optionally redirect to 404 or communities list
      // router.push('/communities');
    }
    setIsLoading(false);
  }, [dashboardName, router]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading community data...</p>
        </div>
      );
    }

    if (!currentCommunity) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Community not found</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab community={currentCommunity} />;
      case 'raffles':
        return <RafflesTab community={currentCommunity} />;
      case 'participants':
        return <ParticipantsTab community={currentCommunity} />;
      case 'funds':
        return <FundsTab community={currentCommunity} />;
      case 'settings':
        return <SettingsTab community={currentCommunity} />;
      default:
        return <DashboardTab community={currentCommunity} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-14">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 text-white bg-gray-900/50 p-1 rounded-lg right-24 top-20 absolute">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="raffles">Raffles</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="funds">Funds</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
