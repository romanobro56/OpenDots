"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TheStakes() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-white py-24 lg:py-32">
      <div className="max-w-[1220px] mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <p className="font-extrabold text-[24px] sm:text-[32px] lg:text-[38px] tracking-tight text-navy leading-[1.35] mb-8">
            The unemployment rate for blind adults is nearly{" "}
            <span className="text-[#E34F4F]">70%</span>. For those who learned braille as children, it drops to{" "}
            <span className="text-coral">44%</span>.
          </p>
          <p className="font-semibold text-[19px] sm:text-[22px] text-muted-foreground mb-8">
            Early tactile literacy isn&apos;t a nice-to-have.{" "}
            <span className="text-navy">It&apos;s a life trajectory.</span>
          </p>
          <div className="w-16 h-[3px] bg-coral mx-auto rounded-full mb-8" />
          <p className="font-bold text-[19px] text-coral">
            That&apos;s why we built OpenDots.
          </p>
        </div>
      </div>
    </section>
  );
}
