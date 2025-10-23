import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Plus, Bell } from "lucide-react";
import { CreateCommunityDialog } from "@/components/home/CreateCommunityDialog";
import { CommunityList } from "@/components/home/CommunityList";
import { RaffleList } from "@/components/home/RaffleList";

const gettingStartedSteps = [
  {
    title: 'Create Your Communities',
    description: 'Start your own community and set up raffles for your members.',
    icon: <Plus className="h-5 w-5 text-teal-400" />,
    buttonText: 'Create Community'
  },
  {
    title: 'Participate in Raffles',
    description: 'Join existing communities and participate in exciting raffles.',
    icon: <Rocket className="h-5 w-5 text-teal-400" />,
    buttonText: 'Browse Raffles'
  },
  {
    title: 'Stay Updated',
    description: 'Get notified about new raffles and community updates.',
    icon: <Bell className="h-5 w-5 text-teal-400" />,
    buttonText: 'Enable Notifications'
  }
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-dark-primary/5 via-dark-primary/20 to-dark-primary/5 overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Create Community Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Create Your Community</h2>
              <p className="text-teal-100">Start building your community and launch your first raffle today</p>
            </div>
            <CreateCommunityDialog />
          </div>
        </div>

        {/* Communities Section */}
        <section className="mb-12">
          <CommunityList />
        </section>

        {/* Raffles Section */}
        <section className="mb-12">
          <RaffleList />
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gettingStartedSteps.map((step, index) => (
              <Card key={index} className="bg-dark-secondary/30 backdrop-blur-sm border-dark-border">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-full bg-teal-900/30 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{step.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/50"
                    >
                      {step.buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
