"use client";

import { useState, useRef } from "react";
import DotGrid from "@/components/DotGrid";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const demoGrids: Record<string, number[][]> = {
  lion: [
    [0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0],
    [0,1,1,0,1,1,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,0,0,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,1,0,0,0,0,0,0],
  ],
  letterA: [
    [0,0,0,0,1,1,0,0,0,0,0,0],
    [0,0,0,1,0,0,1,0,0,0,0,0],
    [0,0,1,0,0,0,0,1,0,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,1,0,0,0],
  ],
  city: [
    [0,0,0,0,0,1,0,0,0,0,1,0],
    [0,0,1,0,0,1,0,0,1,0,1,0],
    [0,0,1,0,1,1,0,0,1,0,1,0],
    [0,1,1,0,1,1,0,1,1,0,1,0],
    [0,1,1,0,1,1,0,1,1,1,1,0],
    [0,1,1,1,1,1,0,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
  ],
};

const tabs = [
  { key: "lion", label: "A Lion", image: "A picture book lion" },
  { key: "letterA", label: "Letter A", image: "The letter A" },
  { key: "city", label: "A City", image: "A city skyline" },
];

export default function MagicMoment() {
  const { ref, isVisible } = useScrollReveal();
  const [activeTab, setActiveTab] = useState("lion");
  const [uploadGrid, setUploadGrid] = useState<number[][] | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentGrid = uploadGrid || demoGrids[activeTab];

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadGrid(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/interpret", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUploadGrid(data.matrix);
    } catch {
      setUploadGrid(demoGrids.lion);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section ref={ref} id="magic-moment" className="bg-white py-24 lg:py-32 relative">
      <div className="absolute inset-0 dot-grid-bg-subtle" />
      <div className="max-w-[1220px] relative z-10 mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] tracking-tight text-navy mb-5 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            From page to fingertip <span className="text-coral">in seconds</span>
          </h2>
          <p className="text-[17px] text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            OpenDots reads any image and raises the exact pin pattern a child needs to feel it — letters, shapes, scenes, and stories, all at the touch of a finger.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-[48px] items-center max-w-5xl mx-auto">
          {/* Left: source selector */}
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setUploadGrid(null); }}
                  className={`px-4 py-2.5 rounded-lg font-semibold text-[14px] transition-all cursor-pointer ${
                    activeTab === tab.key && !uploadGrid
                      ? "bg-coral text-white shadow-sm"
                      : "bg-muted text-navy hover:bg-[#E4E6EB]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-muted rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] border border-[#E4E6EB]">
              <p className="font-bold text-[22px] text-navy mb-2">
                {tabs.find(t => t.key === activeTab)?.image}
              </p>
              <p className="text-muted-foreground text-[13px]">Source image</p>
            </div>

            <div className="mt-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f);
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="text-[14px] font-semibold text-coral hover:underline hover:underline-offset-4 cursor-pointer"
              >
                Or upload your own image &rarr;
              </button>
            </div>
          </div>

          {/* Right: dot grid */}
          <div className="flex justify-center">
            <div className="bg-navy rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              {isUploading ? (
                <div className="flex items-center justify-center" style={{ width: 200, height: 140 }}>
                  <div className="flex gap-2">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-4 h-4 rounded-full bg-coral animate-glow-pulse" style={{ animationDelay: `${i*200}ms` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <DotGrid grid={currentGrid} animate size="md" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
