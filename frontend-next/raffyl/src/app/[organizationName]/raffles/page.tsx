import { AppSidebar } from "@/components/organizationDashboard/app-sidebar";
import { SiteHeader } from "@/components/organizationDashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RafflesPage({
  params,
}: {
  params: { organizationName: string };
}) {
  return (
    <div className="min-h-screen text-white pt-14">
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
          "backgroundColor": "transparent"
        } as React.CSSProperties}
      >
        <AppSidebar variant="inset" organizationName={params.organizationName} />
        <SidebarInset className="bg-transparent">
          <SiteHeader />
          <div className="flex-1 p-6 space-y-8">
            <div>
              <h1 className="text-2xl font-bold">Raffles</h1>
              <p className="text-gray-400">Manage and track all your organization&apos;s raffles.</p>
            </div>

            <Card className="bg-gray-900/40 border-gray-800">
              <CardHeader>
                <CardTitle>Raffles Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Your raffles content will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
