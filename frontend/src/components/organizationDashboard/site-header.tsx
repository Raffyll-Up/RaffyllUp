'use client'
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useParams } from "next/navigation"

export function SiteHeader() {

  // Get the dynamic route parameter which is named 'dashboard' in the URL
  const params = useParams<{ dashboard: string }>();
  
  // Decode and format the organization name from the URL parameter
  const organizationName = params.dashboard 
    ? params.dashboard
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Organization';

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/10 bg-transparent backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{organizationName} Community</h1>
      </div>
    </header>
  )
}
