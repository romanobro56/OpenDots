import { useState, useRef } from "react";
import DotGrid from "@/components/DotGrid";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { API, type ConvertResponse } from "@/config/api";

// Demo grids for the interactive section
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
  { key: "lion", label: "🦁 A Lion", image: "A picture book lion" },
  { key: "letterA", label: "🔤 Letter A", image: "The letter A" },
  { key: "city", label: "🏙️ A City", image: "A city skyline" },
];

const MagicMoment = () => {
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
      form.append("image", file);
      const res = await fetch(API.convert, { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const data: ConvertResponse = await res.json();
      setUploadGrid(data.grid);
    } catch {
      // Fallback to demo
      setUploadGrid(demoGrids.lion);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section ref={ref} id="magic-moment" className="bg-cream py-24 lg:py-32 relative">
      <div className="absolute inset-0 dot-grid-bg-subtle" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`font-display font-black text-3xl sm:text-4xl lg:text-5xl text-navy mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            From page to fingertip <span className="text-gold">in seconds</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            OpenDots reads any image and raises the exact pin pattern a child needs to feel it — letters, shapes, scenes, and stories, all at the touch of a finger.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left: source selector */}
          <div>
            <div className="flex flex-wrap gap-3 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setUploadGrid(null); }}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                    activeTab === tab.key && !uploadGrid
                      ? "bg-navy text-cream shadow-lg"
                      : "bg-muted text-navy hover:bg-navy/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-muted rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px]">
              <p className="font-display font-bold text-2xl text-navy mb-2">
                {tabs.find(t => t.key === activeTab)?.image}
              </p>
              <p className="text-muted-foreground text-sm">Source image</p>
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
                className="text-sm font-bold text-teal underline underline-offset-4 hover:opacity-80"
              >
                Or upload your own image →
              </button>
            </div>
          </div>

          {/* Right: dot grid */}
          <div className="flex justify-center">
            <div className="bg-navy rounded-3xl p-8 shadow-2xl">
              {isUploading ? (
                <div className="flex items-center justify-center" style={{ width: 200, height: 140 }}>
                  <div className="flex gap-2">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-4 h-4 rounded-full bg-gold animate-glow-pulse" style={{ animationDelay: `${i*200}ms` }} />
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
};

export default MagicMoment;
