"use client";

import { useState } from "react";
import DotGrid from "@/components/DotGrid";
import FileUpload from "@/components/FileUpload";

type Mode = "interpret" | "direct";

export default function UploadPage() {
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
      const parsed = typeof data.matrix === "string"
        ? data.matrix.trim().split("\n").map((line: string) => line.trim().split(/\s+/).map(Number))
        : data.matrix;
      setMatrix(parsed);
    } else {
      alert("Processing complete — check your terminal for output.");
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[1220px] mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-[28px] font-extrabold tracking-tight text-navy mb-2">Process an Image</h1>
          <p className="text-muted-foreground text-[15px] mb-8">
            Choose a mode, then upload an image to convert it to a tactile pin pattern.
          </p>

          {/* Subtabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setActiveTab("interpret"); setMatrix(null); }}
              className={`px-4 py-2.5 rounded-lg font-semibold text-[14px] transition-all cursor-pointer ${
                activeTab === "interpret"
                  ? "bg-coral text-white shadow-sm"
                  : "bg-muted text-navy hover:bg-[#E4E6EB]"
              }`}
            >
              Interpret (AI)
            </button>
            <button
              onClick={() => { setActiveTab("direct"); setMatrix(null); }}
              className={`px-4 py-2.5 rounded-lg font-semibold text-[14px] transition-all cursor-pointer ${
                activeTab === "direct"
                  ? "bg-coral text-white shadow-sm"
                  : "bg-muted text-navy hover:bg-[#E4E6EB]"
              }`}
            >
              Direct Upload
            </button>
          </div>

          {/* Description */}
          <p className="text-[14px] text-muted-foreground mb-6">
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
              <h2 className="text-[18px] font-bold text-navy mb-4">Result</h2>
              <div className="bg-navy rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                <DotGrid grid={matrix} animate size="lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
