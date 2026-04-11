"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GraduationCap, Eye, Sparkles } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "For blind children learning to read",
    text: "Braille literacy is the single greatest predictor of employment and independence for blind adults. OpenDots makes learning it feel like play.",
    accent: "border-coral",
  },
  {
    icon: Eye,
    title: "For children with low vision in school",
    text: "85% of blind and visually impaired students attend public schools — where qualified braille teachers are disappearing every year. OpenDots fills that gap.",
    accent: "border-teal",
  },
  {
    icon: Sparkles,
    title: "For kids with visual impairments in therapy",
    text: "Tactile exploration isn't just literacy. It's how children with visual impairments build spatial reasoning, confidence, and their understanding of the world.",
    accent: "border-coral",
  },
];

export default function WhoItsFor() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-muted py-24 lg:py-32">
      <div className="max-w-[1220px] mx-auto px-6">
        <h2
          className={`font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] tracking-tight text-navy text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Who it&apos;s <span className="text-coral">for</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {audiences.map((a, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-7 border-t-[3px] ${a.accent} shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <a.icon className="w-9 h-9 text-coral mb-5" strokeWidth={1.5} />
              <h3 className="font-bold text-[17px] text-navy mb-3">{a.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
