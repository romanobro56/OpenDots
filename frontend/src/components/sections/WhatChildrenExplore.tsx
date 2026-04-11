"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BookOpen, Building2, Shapes, Camera } from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    title: "ABC Picture Books",
    description: "Letters and their shapes come alive under curious fingertips.",
    color: "text-gold",
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
    color: "text-gold",
  },
];

export default function WhatChildrenExplore() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-cream py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <h2
          className={`font-black text-3xl sm:text-4xl lg:text-5xl text-navy text-center mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          What children can <span className="text-gold">explore</span>
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-16">
          Four ways OpenDots brings the visual world to every child&apos;s fingertips.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-500 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <card.icon className={`w-12 h-12 ${card.color} mb-6 group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
              <h3 className="font-extrabold text-xl text-navy mb-3">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
