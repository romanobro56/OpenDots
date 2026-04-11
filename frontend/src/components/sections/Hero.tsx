"use client";

import DotGrid from "@/components/DotGrid";

const heroGrid: number[][] = [
  [0,0,0,1,1,0,0,0,0,1,1,0],
  [0,0,1,1,1,1,0,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,0,1,1,0,1,1,0,0],
  [0,0,0,1,0,0,0,0,1,0,0,0],
  [0,0,0,0,1,0,0,1,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0],
];

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center bg-white">
      <div className="absolute inset-0 dot-grid-bg-subtle opacity-40" />

      <div className="max-w-[1220px] relative z-10 mx-auto px-6 py-20 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-[48px] items-center">
          {/* Text */}
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/8 text-coral text-[13px] font-semibold tracking-wide mb-8">
              <span className="w-2 h-2 rounded-full bg-coral" />
              AI-Powered Tactile Technology
            </p>

            <h1 className="font-extrabold text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.08] tracking-tight text-navy mb-6">
              Every picture tells a story.{" "}
              <span className="text-coral">Now every child can feel it.</span>
            </h1>

            <p className="text-[18px] text-muted-foreground leading-[1.65] mb-10">
              An AI-powered tactile board that converts any image, book, or shape into raised pins a child can explore with their fingertips — in seconds.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("how-it-works")}
                className="px-6 py-3 rounded-lg bg-coral text-white font-semibold text-[15px] hover:bg-[#0559D4] transition-colors cursor-pointer"
              >
                See how it works
              </button>
              <button
                onClick={() => scrollTo("early-access")}
                className="px-6 py-3 rounded-lg bg-muted text-navy font-semibold text-[15px] hover:bg-[#E4E6EB] transition-colors cursor-pointer"
              >
                Get early access
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex flex-col items-center gap-6">
            <div className="bg-navy rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] w-full max-w-sm flex items-center justify-center">
              <DotGrid grid={heroGrid} animate size="lg" />
            </div>
            <p className="text-[13px] text-muted-foreground tracking-wide">A butterfly — felt, not seen</p>
          </div>
        </div>
      </div>
    </section>
  );
}
