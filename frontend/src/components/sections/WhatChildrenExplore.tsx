"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BookOpen, Building2, Shapes, Camera } from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    title: "ABC Picture Books",
    description: "Letters and their shapes come alive under curious fingertips.",
    color: "text-coral",
  },
  {
    icon: Building2,
    title: "Story Scenes",
    description: "Feel a city skyline, a forest, a house — the worlds inside every book.",
    color: "text-teal",
  },
  {
    icon: Shapes,
    title: "Shapes & Math",
    description: "Circles, triangles, squares — geometry a child can hold.",
    color: "text-coral",
  },
  {
    icon: Camera,
    title: "Real World",
    description: "Point the camera at anything and feel it. The whole world becomes touchable.",
    color: "text-teal",
  },
];

export default function WhatChildrenExplore() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-muted py-24 lg:py-32">
      <div className="max-w-[1220px] mx-auto px-6">
        <h2
          className={`font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] tracking-tight text-navy text-center mb-5 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          What children can <span className="text-coral">explore</span>
        </h2>
        <p className="text-[17px] text-muted-foreground text-center max-w-xl mx-auto mb-16 leading-relaxed">
          Four ways OpenDots brings the visual world to every child&apos;s fingertips.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-7 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-500 group border border-[#E4E6EB] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <card.icon className={`w-10 h-10 ${card.color} mb-5 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
              <h3 className="font-bold text-[18px] text-navy mb-2.5">{card.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
