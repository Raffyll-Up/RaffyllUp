'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Gem } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="fixed w-full bg-dark-primary/90 border-b border-dark-secondary/20 px-6 py-3 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Gem
            size={20}
            className="text-teal-400 group-hover:rotate-12 transition-transform duration-300"
          />
          <h2 className="text-xl font-bold text-teal-400">Raffyl</h2>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
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
              Documentation
            </Link>
            <Link
              href="/my-raffles"
              className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors duration-200"
            >
              About Us
            </Link>
          </nav>
        </div>
        
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="px-5 py-2 rounded-lg bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors duration-200"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button 
                        onClick={openChainModal} 
                        type="button"
                        className="px-5 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center' }}
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-dark-secondary/50 text-white text-sm font-medium hover:bg-dark-secondary/70 transition-colors duration-200"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <Image
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                                width={12}
                                height={12}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button 
                        onClick={openAccountModal} 
                        type="button"
                        className="px-4 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition-colors duration-200"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
