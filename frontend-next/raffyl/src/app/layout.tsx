import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";
import HeroBackground from "@/components/HeroBackground";
import { Providers } from "@/providers/Providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Raffyl - Fun. Fair. Instant Raffles.",
  description: "Experience the thrill of decentralized raffles with Raffyl. Create or join raffles with complete transparency and instant payouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans`}>
        <Providers>
        <HeroBackground />
          <div className="relative min-h-screen bg-transparent">
            <Header />
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
