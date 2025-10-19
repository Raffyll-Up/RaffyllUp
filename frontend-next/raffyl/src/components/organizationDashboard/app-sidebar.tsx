"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import {
  IconTicket,
  IconUsers,
  IconCurrencyDollar,
  IconSettings,
  IconPlus,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: IconTicket,
    active: true,
  },
  {
    title: "Raffles",
    url: "#",
    icon: IconTicket,
  },
  {
    title: "Participants",
    url: "#",
    icon: IconUsers,
  },
  {
    title: "Fund Movements",
    url: "#",
    icon: IconCurrencyDollar,
  },
  {
    title: "Settings",
    url: "#",
    icon: IconSettings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="offcanvas" {...props} className="pt-14 bg-gray-900/20 border-r border-gray-800">
      
      <SidebarContent className="p-4 space-y-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                className={`w-full justify-start ${item.active ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                {item.icon && <item.icon className="mr-3 h-5 w-5" />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800">
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <IconPlus className="mr-2 h-4 w-4" />
          Create Raffle
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
