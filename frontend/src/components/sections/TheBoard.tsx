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
      <div className="absolute inset-0 dot-grid-bg opacity-15" />
      <div className="max-w-[1220px] relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-[48px] items-center max-w-5xl mx-auto">
          {/* Board visual */}
          <div
            className={`flex justify-center transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="bg-[#243B47] border border-white/10 rounded-2xl p-10 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
              <DotGrid grid={boardGrid} animate size="lg" />
            </div>
          </div>

          {/* Text */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <h2 className="font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] tracking-tight text-white mb-8">
              The <span className="text-coral">board</span>
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {specs.map((spec, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <p className="font-semibold text-white text-[16px]">{spec}</p>
                </div>
              ))}
            </div>

            <p className="text-white/50 text-[17px] leading-relaxed italic font-[Merriweather]">
              &ldquo;The most advanced braille displays on the market cost $15,000 and show one line of text.{" "}
              <span className="text-white font-semibold not-italic font-[Inter]">OpenDots shows the whole world.</span>&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
