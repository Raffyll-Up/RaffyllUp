import { Hero } from "@/components/Hero";
import { Organizations } from "@/components/Organizations";
import { TrendingRaffles } from "@/components/TrendingRaffles";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import HeroBackground from "@/components/HeroBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-b from-dark-primary/5 via-dark-primary/20 to-dark-primary/5 overflow-x-hidden">
      <div className="absolute inset-0 -z-10 bg-[url('/grid-pattern.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="layout-container flex h-full grow flex-col">
        
        <main className="px-4 md:px-8 lg:px-16 flex flex-1 justify-center pt-24 pb-12">
          <div className="layout-content-container flex flex-col max-w-7xl flex-1 gap-16">
            <Hero />
            <Organizations />
            <TrendingRaffles />
            <CTASection />
          </div>
        </main>
        <Footer />
      <HeroBackground />
      </div>
    </div>
  );
}