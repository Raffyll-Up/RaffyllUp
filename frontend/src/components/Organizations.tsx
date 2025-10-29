// import Image from "next/image";
import Link from "next/link";
import { communityData } from "@/lib/communityData";

export function Organizations() {
  // Generate a consistent color based on the organization name
  const getColorForName = (name: string) => {
    const colors = [
      'bg-teal-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-amber-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-emerald-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Get the first letter of the organization name for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-teal-400 mb-3">
            Featured Communities
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of organizations already using Raffyl for their fundraising and community engagement
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityData.map((org, index) => {
            const activeRaffles = org.raffles.filter(r => r.status === 'Active').length;
            const totalRaffles = org.raffles.length;
            const color = getColorForName(org.name);
            
            return (
              <div 
                key={`${org.name}-${index}`}
                className="group relative bg-dark-secondary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-teal-400/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-xl mb-4 overflow-hidden ${color} p-0.5`}>
                    <div className="w-full h-full rounded-[9px] overflow-hidden bg-dark-secondary flex items-center justify-center text-white text-xl font-bold">
                      {getInitials(org.name)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{org.name}</h3>
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    {activeRaffles} active raffle{activeRaffles !== 1 ? 's' : ''}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {totalRaffles} total raffle{totalRaffles !== 1 ? 's' : ''} created
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{ width: `${(activeRaffles / Math.max(totalRaffles, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link 
                    href={`/dashboard/${encodeURIComponent(org.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center"
                  >
                    View Dashboard
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}