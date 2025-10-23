import Image from "next/image";

const organizations = [
  {
    name: "Charity Foundation",
    description: "Supporting various charitable causes.",
    image:
      "https://images.unsplash.com/photo-1600408942710-9e0ccfe941c2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZm91bmRhdGlvbiUyMGhlbHBpbmclMjBoYW5kcyUyMGhlYXJ0fGVufDB8Mnx8fDE3NjA2Mjg1MjZ8MA&ixlib=rb-4.1.0&q=85",
    alt: "Charity Foundation - Marek Studzinski on Unsplash",
    color: "bg-teal-500"
  },
  {
    name: "Tech Innovators",
    description: "Driving innovation in technology.",
    image:
      "https://images.unsplash.com/photo-1635241161466-541f065683ba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbiUyMGdlb21ldHJpYyUyMHRlY2glMjBsb2dvfGVufDB8Mnx8fDE3NjA2Mjg1MjZ8MA&ixlib=rb-4.1.0&q=85",
    alt: "Tech Innovators - 愚木混株 Yumu on Unsplash",
    color: "bg-blue-500"
  },
  {
    name: "Community Builders",
    description: "Building strong community bonds.",
    image:
      "https://images.unsplash.com/photo-1522973717924-b10fe4e185cc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxjaGFyaXR5JTIwZm91bmRhdGlvbiUyMGhlbHBpbmclMjBoYW5kcyUyMGhlYXJ0fGVufDB8Mnx8fDE3NjA2Mjg1MjZ8MA&ixlib=rb-4.1.0&q=85",
    alt: "Community Builders - Alvin Mahmudov on Unsplash",
    color: "bg-purple-500"
  },
  {
    name: "Creative Collective",
    description: "Fostering creativity and collaboration.",
    image:
      "https://images.unsplash.com/photo-1600408963711-2eca888e587c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjaGFyaXR5JTIwZm91bmRhdGlvbiUyMGhlbHBpbmclMjBoYW5kcyUyMGhlYXJ0fGVufDB8Mnx8fDE3NjA2Mjg1MjZ8MA&ixlib=rb-4.1.0&q=85",
    alt: "Creative Collective - Marek Studzinski on Unsplash",
    color: "bg-amber-500"
  },
];

export function Organizations() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-teal-400 mb-3">
            Trusted by Top Organizations
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of organizations already using Raffyl for their fundraising and community engagement
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {organizations.map((org) => (
            <div 
              key={org.name}
              className="group relative bg-dark-secondary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800 hover:border-teal-400/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className={`w-16 h-16 rounded-xl mb-4 overflow-hidden ${org.color} p-0.5`}>
                  <div className="w-full h-full rounded-[9px] overflow-hidden bg-dark-secondary">
                    <Image
                      src={org.image}
                      alt={org.alt}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{org.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{org.description}</p>
              </div>
              <div className="px-6 pb-6">
                <button 
                  className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center"
                >
                  View Profile
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}