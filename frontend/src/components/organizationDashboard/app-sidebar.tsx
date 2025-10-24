"use client"

import * as React from "react"
import {
  IconTicket,
  IconUsers,
  IconCurrencyDollar,
  IconSettings,
  IconLayoutDashboard,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { CreateRaffleModal } from "../raffles/CreateRaffleModal"

export type TabValue = 'dashboard' | 'raffles' | 'participants' | 'funds' | 'settings';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  organizationName: string;
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

const navItems: { title: string; value: TabValue; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    title: "Dashboard",
    value: "dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Raffles",
    value: "raffles",
    icon: IconTicket,
  },
  {
    title: "Participants",
    value: "participants",
    icon: IconUsers,
  },
  {
    title: "Fund Management",
    value: "funds",
    icon: IconCurrencyDollar,
  },
  {
    title: "Settings",
    value: "settings",
    icon: IconSettings,
  },
]

export function AppSidebar({ organizationName, activeTab, onTabChange, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="pt-14 bg-gray-900/20 border-r border-gray-800">
      <SidebarContent className="p-4 space-y-2">
        <SidebarHeader>
          <h1 className="text-2xl font-bold text-white">{organizationName}</h1>
        </SidebarHeader>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.value;
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  isActive={isActive}
                  className={cn(
                    "w-full justify-start",
                    isActive ? "bg-gray-800 text-black" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <button 
                    onClick={() => onTabChange(item.value)}
                    className="flex items-center gap-2 w-full text-left p-2 rounded-md"
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-black" : "text-gray-400"
                    )} />
                    <span>{item.title}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800">
        <CreateRaffleModal />
      </SidebarFooter>
    </Sidebar>
  )
}
