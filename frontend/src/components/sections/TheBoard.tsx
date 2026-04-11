"use client";

import DotGrid from "@/components/DotGrid";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const boardGrid: number[][] = [
  [1,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,0],
  [0,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,1,0,1,1,1,1,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0,1,0,1,0],
  [0,1,0,1,0,1,0,1,0,1,0,1],
];

const specs = [
  "96 touch points",
  "Updates in real time",
  "Works with any camera",
  "Built for little hands",
];

export default function TheBoard() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-navy py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-bg opacity-20" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          {/* Board visual */}
          <div
            className={`flex justify-center transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="bg-navy border-2 border-gold/30 rounded-3xl p-10 shadow-2xl">
              <DotGrid grid={boardGrid} animate size="lg" />
            </div>
          </div>

          {/* Text */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl text-cream mb-8">
              The <span className="text-gold">board</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {specs.map((spec, i) => (
                <div key={i} className="bg-cream/5 rounded-2xl p-5 border border-gold/20">
                  <p className="font-bold text-cream text-lg">{spec}</p>
                </div>
              ))}
            </div>

            <p className="text-cream/60 text-lg leading-relaxed italic font-[Merriweather]">
              &ldquo;The most advanced braille displays on the market cost $15,000 and show one line of text.{" "}
              <span className="text-gold font-bold not-italic font-[Nunito]">OpenDots shows the whole world.</span>&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
