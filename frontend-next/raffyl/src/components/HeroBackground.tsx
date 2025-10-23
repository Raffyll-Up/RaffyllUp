"use client";
import React from "react";
import BackgroundNetwork from "./BackgroundNetwork";

const HeroBackground: React.FC = () => {
  return (
    <section className="relative">
      <BackgroundNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0b0d1b]/70" />
    </section>
  );
};

export default HeroBackground;
