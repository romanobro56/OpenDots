"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GraduationCap, Eye, Sparkles } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "For blind children learning to read",
    text: "Braille literacy is the single greatest predictor of employment and independence for blind adults. OpenDots makes learning it feel like play.",
    accent: "border-gold",
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
    <section ref={ref} className="bg-cream py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <h2
          className={`font-black text-3xl sm:text-4xl lg:text-5xl text-navy text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Who it&apos;s <span className="text-gold">for</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {audiences.map((a, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl p-8 border-t-4 ${a.accent} shadow-md transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <a.icon className="w-10 h-10 text-gold mb-6" strokeWidth={1.5} />
              <h3 className="font-extrabold text-lg text-navy mb-4">{a.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
