"use client";
import React from "react";
import BackgroundNetwork from "./BackgroundNetwork";
// import AnimatedLiskLogo from "./AnimatedLiskLogo";

const HeroBackground: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <BackgroundNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b0d1b]/70" />
      {/* <AnimatedLiskLogo /> */}
    </section>
  );
};

export default HeroBackground;
