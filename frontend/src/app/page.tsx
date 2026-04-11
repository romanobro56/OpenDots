import Hero from "@/components/sections/Hero";
import CrisisStats from "@/components/sections/CrisisStats";
import MagicMoment from "@/components/sections/MagicMoment";
import WhatChildrenExplore from "@/components/sections/WhatChildrenExplore";
import HowItWorks from "@/components/sections/HowItWorks";
import TheBoard from "@/components/sections/TheBoard";
import WhoItsFor from "@/components/sections/WhoItsFor";
import TheStakes from "@/components/sections/TheStakes";
import Testimonial from "@/components/sections/Testimonial";
import EarlyAccessCTA from "@/components/sections/EarlyAccessCTA";
import Footer from "@/components/sections/Footer";

export default function LandingPage() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <CrisisStats />
      <MagicMoment />
      <WhatChildrenExplore />
      <HowItWorks />
      <TheBoard />
      <WhoItsFor />
      <TheStakes />
      <Testimonial />
      <EarlyAccessCTA />
      <Footer />
    </main>
  );
}
