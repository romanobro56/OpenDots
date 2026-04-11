"use client";

import { useState } from "react";
import Link from "next/link";
import DotGrid from "@/components/DotGrid";
import FileUpload from "@/components/FileUpload";

type Mode = "interpret" | "direct";

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<Mode>("interpret");
  const [matrix, setMatrix] = useState<number[][] | null>(null);

  async function handleUpload(file: File, mode: Mode) {
    const formData = new FormData();
    formData.append("file", file);

    const endpoint =
      mode === "interpret" ? "/api/interpret" : "/api/direct-upload";

    const res = await fetch(endpoint, { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error ?? "Something went wrong");
      return;
    }

    if (data.matrix) {
      setMatrix(data.matrix);
    } else {
      alert("Processing complete — check your terminal for output.");
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gold" />
              ))}
            </div>
            <span className="font-extrabold text-lg text-cream">OpenDots</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-navy mb-2">Process an Image</h1>
          <p className="text-muted-foreground mb-8">
            Choose a mode, then upload an image to convert it to a tactile pin pattern.
          </p>

          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => { setActiveTab("interpret"); setMatrix(null); }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "interpret"
                  ? "bg-navy text-cream shadow-lg"
                  : "bg-muted text-navy hover:bg-navy/10"
              }`}
            >
              Interpret (AI)
            </button>
            <button
              onClick={() => { setActiveTab("direct"); setMatrix(null); }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "direct"
                  ? "bg-navy text-cream shadow-lg"
                  : "bg-muted text-navy hover:bg-navy/10"
              }`}
            >
              Direct Upload
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6">
            {activeTab === "interpret"
              ? "AI simplifies your image into a B&W icon, then converts it to an 8\u00d712 binary matrix."
              : "Converts your image directly to an 8\u00d712 binary matrix (monochrome + contrast + threshold)."}
          </p>

          {/* Upload area */}
          <FileUpload
            key={activeTab}
            onUpload={(file) => handleUpload(file, activeTab)}
          />

          {/* Result */}
          {matrix && (
            <div className="mt-10 flex flex-col items-center">
              <h2 className="text-xl font-bold text-navy mb-4">Result</h2>
              <div className="bg-navy rounded-3xl p-8 shadow-2xl">
                <DotGrid grid={matrix} animate size="lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
