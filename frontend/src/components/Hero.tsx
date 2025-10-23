import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCountdown } from "@/hooks/useCountdown";
import { useRouter } from 'next/navigation';

export function Hero() {
  const router = useRouter();
  
    // 60 seconds countdown
    const { formattedTime } = useCountdown(60, () => {
      router.push('/home');
    });

    
  return (
    <section className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 text-teal-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Decentralized Raffles on Lisk Network</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight">
            Win Big with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
              Decentralized Raffles
            </span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Participate in secure, transparent, and provably fair raffles with instant payouts on the blockchain. No middlemen, just pure Web3 magic.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/raffles"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/20"
            >
              Explore Raffles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/create"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-gray-700 hover:border-teal-400/50 text-white font-medium rounded-lg transition-all duration-200 hover:bg-gray-800/30"
            >
              Create Raffle
            </Link>
          </div>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-dark-primary"></div>
                ))}
              </div>
              <span className="ml-3">
                <span className="text-white font-medium">10,000+</span> Active Users
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span>Live on Lisk Network</span>
            </div>
          </div>
            {/* Countdown Overlay */}
              <div className="text-sm text-gray-300">
                Redirecting in
                <span className="text-md font-bold text-teal-400 pl-2">
                  {formattedTime}
                </span>
              </div>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="bg-gray-900/50 border-t border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-800">
            {[
              { value: "$2.5M+", label: "Total Prizes Won" },
              { value: "50+", label: "Active Raffles" },
              { value: "98.5%", label: "Success Rate" },
              { value: "<1min", label: "Average Payout" },
            ].map((stat, index) => (
              <div key={index} className="px-6 py-8 text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}