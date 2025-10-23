'use client'

import { useState } from "react";
import { AppSidebar } from "@/components/organizationDashboard/app-sidebar";
import { SiteHeader } from "@/components/organizationDashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTab } from "@/components/organizationDashboard/tabs/DashboardTab";
import { RafflesTab } from "@/components/organizationDashboard/tabs/RafflesTab";
import { ParticipantsTab } from "@/components/organizationDashboard/tabs/ParticipantsTab";
import { FundsTab } from "@/components/organizationDashboard/tabs/FundsTab";
import { SettingsTab } from "@/components/organizationDashboard/tabs/SettingsTab";

type TabValue = 'dashboard' | 'raffles' | 'participants' | 'funds' | 'settings';

export default function OrganizationPage({
  params,
}: {
  params: { organizationName: string };
}) {
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'raffles':
        return <RafflesTab />;
      case 'participants':
        return <ParticipantsTab />;
      case 'funds':
        return <FundsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen text-white pt-14">
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
          "backgroundColor": "transparent"
        } as React.CSSProperties}
      >
        <AppSidebar 
          variant="inset" 
          organizationName={params.organizationName}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <SidebarInset className="bg-transparent">
          <SiteHeader />
          <div className="flex-1 p-6 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'raffles' && 'Raffles'}
                  {activeTab === 'participants' && 'Participants'}
                  {activeTab === 'funds' && 'Fund Management'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className="text-gray-400">
                  {activeTab === 'dashboard' && 'Overview of your community\'s performance and activities.'}
                  {activeTab === 'raffles' && 'Manage and track all your community\'s raffles.'}
                  {activeTab === 'participants' && 'View and manage all participants across your raffles.'}
                  {activeTab === 'funds' && 'Track and manage your community\'s funds and transactions.'}
                  {activeTab === 'settings' && 'Manage your community\'s settings.'}
                </p>
              </div>
              <Tabs 
                value={activeTab} 
                onValueChange={(value) => setActiveTab(value as TabValue)}
                className="hidden md:block"
              >
              </Tabs>
            </div>

            {renderTabContent()}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
