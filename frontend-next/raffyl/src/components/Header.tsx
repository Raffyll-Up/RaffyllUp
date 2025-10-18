import { Gem } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed w-full bg-dark-primary/90 border-b border-dark-secondary/20 px-6 py-3 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Gem size={20} className="text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
          <h2 className="text-xl font-bold text-teal-400">
            Raffyl
          </h2>
        </Link>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
            >
              Explore
            </Link>
            <Link
              href="/create-raffle"
              className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
            >
              Create
            </Link>
            <Link
              href="/my-raffles"
              className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
            >
              My Raffles
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 rounded-lg bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors duration-200">
              Connect Wallet
            </button>
            <button className="px-5 py-2 rounded-lg border border-teal-400/30 text-teal-300 text-sm font-medium hover:bg-teal-400/10 transition-colors duration-200">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}