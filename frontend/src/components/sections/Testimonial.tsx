"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Testimonial() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-muted py-24 lg:py-32">
      <div className="max-w-[1220px] mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-12 h-[3px] bg-coral mx-auto rounded-full mb-10" />
          <blockquote className="font-[Merriweather] text-[24px] sm:text-[30px] lg:text-[36px] text-navy leading-[1.45] mb-8 italic">
            &ldquo;For the first time, my daughter felt what a butterfly looks like. She wouldn&apos;t stop smiling.&rdquo;
          </blockquote>
          <p className="font-semibold text-muted-foreground text-[15px]">
            — Parent of a 7-year-old OpenDots user
          </p>
        </div>
      </div>
    </section>
  );
}
