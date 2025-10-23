import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rocket, Plus, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CreateCommunityDialog } from "@/components/organization/CreateOrganizationDialog";

type Communities = {
  id: string;
  name: string;
  description: string;
  members: number;
  logo: string;
  isFeatured?: boolean;
};

const myCommunities: Communities[] = [
  {
    id: '1',
    name: 'Tech Innovators Inc.',
    description: 'Building the future of technology',
    members: 24,
    logo: '/placeholder-org.png'
  },
  {
    id: '2',
    name: 'EcoSolutions Collective',
    description: 'Creating sustainable solutions',
    members: 18,
    logo: '/placeholder-org.png'
  },
  {
    id: '3',
    name: 'Creative Minds Studio',
    description: 'Where ideas come to life',
    members: 32,
    logo: '/placeholder-org.png'
  },
  {
    id: '4',
    name: 'Global Health Initiative',
    description: 'Improving lives worldwide',
    members: 45,
    logo: '/placeholder-org.png'
  },
  {
    id: '5',
    name: 'Innovate Solutions Ltd',
    description: 'Transforming businesses',
    members: 12,
    logo: '/placeholder-org.png'
  },
  {
    id: '6',
    name: 'Imaginative Arts Hub',
    description: 'Celebrating creativity',
    members: 28,
    logo: '/placeholder-org.png'
  },
  {
    id: '7',
    name: 'Health Equity Global',
    description: 'Healthcare for all',
    members: 36,
    logo: '/placeholder-org.png'
  }
];

const featuredCommunities: Communities[] = [
  {
    id: 'f1',
    name: 'FutureTech Ventures',
    description: 'Investing in tomorrow',
    members: 52,
    logo: '/placeholder-org.png',
    isFeatured: true
  },
  // Add more featured communities as needed
];

const gettingStartedSteps = [
  {
    title: 'Create Your Communities',
    description: 'Set up your community profile and invite team members',
    buttonText: 'Start Creating',
    icon: <Plus className="h-5 w-5" />
  },
  {
    title: 'Design Your First Raffle',
    description: 'Customize your raffle with prizes and rules',
    buttonText: 'Design Raffle',
    icon: <Rocket className="h-5 w-5" />
  },
  {
    title: 'Promote and Engage',
    description: 'Share your raffle and engage with participants',
    buttonText: 'Promote Now',
    icon: <Bell className="h-5 w-5" />
  }
];

export default function DashboardPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-dark-primary/5 via-dark-primary/20 to-dark-primary/5 overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Create Community Banner */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create Your Community</h2>
              <p className="text-teal-100">Start building your community and launch your first raffle today</p>
            </div>
            {/* <Button className="bg-white text-teal-600 hover:bg-teal-50 font-medium"> */}
              <CreateCommunityDialog />
            {/* </Button> */}
          </div>
        </div>

        {/* Communities */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Communities</h2>
            <div className="flex items-center gap-2"> 
              <Button variant="ghost" className="text-teal-400 hover:bg-teal-900/30 hover:text-teal-300">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myCommunities.slice(0, 4).map((community) => (
              <Link href={`/${community.id}`} key={community.id}>
              <Card key={community.id} className="bg-dark-secondary/30 backdrop-blur-sm border-dark-border hover:border-teal-500/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 bg-teal-500/20 border border-teal-500/30">
                      <AvatarImage src={community.logo} />
                      <AvatarFallback className="bg-transparent text-teal-400">{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white">{community.name}</h3>
                      <p className="text-sm text-gray-400">{community.members} members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Raffles */}
          <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Raffles</h2>
              <Button variant="ghost" className="text-teal-400 hover:bg-teal-900/30 hover:text-teal-300">
                See More <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredCommunities.map((community) => (
                <Link href={`/${community.id}`} key={community.id}>
                <Card key={community.id} className="bg-dark-secondary/30 backdrop-blur-sm border-dark-border hover:border-teal-500/30 transition-colors">
                  {community.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                        Featured
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 bg-teal-500/20 border border-teal-500/30">
                        <AvatarImage src={community.logo} />
                        <AvatarFallback className="bg-transparent text-teal-400">{community.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-lg text-white">{community.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{community.description}</p>
                        <Button variant="outline" size="sm" className="border-teal-500/30 text-teal-800 hover:bg-teal-500/10 hover:border-teal-400/50">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6">Getting Started</h2>
            <div className="space-y-4">
              {gettingStartedSteps.map((step, index) => (
                <Card key={index} className="bg-dark-secondary/30 backdrop-blur-sm border-l-4 border-teal-500 border-opacity-70">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-teal-500/20 p-2 rounded-full text-teal-400">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{step.title}</h3>
                        <p className="text-sm text-gray-400 mb-3">{step.description}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-teal-500/30 text-teal-900 hover:bg-teal-500/10 hover:border-teal-400/50"
                        >
                          {step.buttonText}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
