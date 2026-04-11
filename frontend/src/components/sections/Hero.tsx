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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-cream">
      <div className="absolute inset-0 dot-grid-bg-subtle opacity-50" />

      <div className="container relative z-10 mx-auto px-6 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-3 h-3 rounded-full bg-gold animate-glow-pulse" style={{ animationDelay: `${i * 300}ms` }} />
                ))}
              </div>
              <span className="font-extrabold text-xl tracking-tight text-navy">OpenDots</span>
            </div>

            <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl leading-tight text-navy mb-6">
              Every picture tells a story.{" "}
              <span className="text-gold">Now every child can feel it.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
              An AI-powered tactile board that converts any image, book, or shape into raised pins a child can explore with their fingertips — in seconds.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("how-it-works")}
                className="px-8 py-4 rounded-full bg-navy text-cream font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                See how it works
              </button>
              <button
                onClick={() => scrollTo("early-access")}
                className="px-8 py-4 rounded-full bg-coral text-white font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Get early access
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex flex-col items-center gap-8">
            <div className="bg-navy rounded-3xl p-8 shadow-2xl w-full max-w-sm flex items-center justify-center">
              <DotGrid grid={heroGrid} animate size="lg" />
            </div>
            <p className="text-sm text-muted-foreground italic">A butterfly — felt, not seen</p>
          </div>
        </div>
      </div>
    </section>
  );
}
