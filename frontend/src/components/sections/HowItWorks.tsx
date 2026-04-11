"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Camera, Cpu, Hand } from "lucide-react";

const steps = [
  {
    icon: Camera,
    step: "1",
    title: "Take a photo or open a book",
    description: "Snap a picture of anything — a page, a toy, a face — or choose from the built-in library.",
  },
  {
    icon: Cpu,
    step: "2",
    title: "AI converts it to a tactile pattern",
    description: "Our AI reads the image and creates the exact raised-pin pattern to represent it.",
  },
  {
    icon: Hand,
    step: "3",
    title: "The child feels the image",
    description: "96 pins rise instantly. The child explores the shape, letter, or scene with their fingertips.",
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} id="how-it-works" className="bg-white py-24 lg:py-32">
      <div className="max-w-[1220px] mx-auto px-6">
        <h2
          className={`font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] tracking-tight text-navy text-center mb-20 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          How it <span className="text-coral">works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-[48px] max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              <div className="relative inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-coral/8 mb-6">
                <s.icon className="w-8 h-8 text-coral" strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral flex items-center justify-center font-bold text-[13px] text-white">
                  {s.step}
                </span>
              </div>
              <h3 className="font-bold text-[18px] text-navy mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Connector lines (desktop) */}
        <div className="hidden md:flex justify-center mt-[-180px] mb-[100px] max-w-4xl mx-auto pointer-events-none">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[2px] bg-coral/15" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[2px] bg-coral/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
