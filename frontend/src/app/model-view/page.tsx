"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { ThreeSceneHandle } from "@/components/ThreeScene";
import { PROFILES } from "@/components/ThreeScene";
import AssetSidebar from "@/components/AssetSidebar";

// Dynamic import avoids SSR issues with Three.js
const ThreeScene = dynamic(() => import("@/components/ThreeScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0e0e0c]">
      <p className="text-coral font-mono text-sm animate-pulse">
        Loading 3D viewer...
      </p>
    </div>
  ),
});

const ROWS = 8;
const COLS = 12;

export default function ModelViewPage() {
  const handleRef = useRef<ThreeSceneHandle | null>(null);
  const [status, setStatus] = useState("starting...");
  const [statusError, setStatusError] = useState(false);
  const [activeProfile, setActiveProfile] = useState("default");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matrixReadout, setMatrixReadout] = useState<number[]>(
    new Array(ROWS * COLS).fill(0)
  );

  const handleReady = useCallback((handle: ThreeSceneHandle) => {
    handleRef.current = handle;
  }, []);

  const handleStatusChange = useCallback(
    (msg: string, isError?: boolean) => {
      setStatus(msg);
      setStatusError(!!isError);
    },
    []
  );

  const handleMatrixChange = useCallback((matrix: Float32Array) => {
    setMatrixReadout(Array.from(matrix));
  }, []);

  async function handleAssetSelect(file: string, collection: string) {
    setLoading(true);
    setSelectedFile(`${collection}/${file}`);

    try {
      const res = await fetch("/api/assets/matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file, collection }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error ?? "Failed to load matrix");
        setStatusError(true);
        return;
      }

      if (data.matrix && handleRef.current) {
        handleRef.current.setMatrix(data.matrix);
        const displayLabel = file
          .replace(/\.(png|jpg|jpeg)$/i, "")
          .replace("_upper", " (upper)")
          .replace("braille_", "braille: ");
        setStatus(`displaying: ${displayLabel}`);
        setStatusError(false);
      }
    } catch {
      setStatus("failed to fetch matrix");
      setStatusError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleProfileChange(key: string) {
    setActiveProfile(key);
    handleRef.current?.applyProfile(key);
  }

  return (
    <main className="h-[calc(100vh-56px)] flex overflow-hidden bg-white">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-[#E4E6EB] overflow-y-auto bg-white">
        <div className="p-4">
          <h2 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
            Assets
          </h2>
          <p className="text-[12px] text-muted-foreground mb-4">
            Select a character or image to display on the model.
          </p>
          <AssetSidebar
            onSelect={handleAssetSelect}
            selectedFile={selectedFile}
            loading={loading}
          />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Three.js viewer */}
        <div className="flex-1 relative">
          <ThreeScene
            onReady={handleReady}
            onStatusChange={handleStatusChange}
            onMatrixChange={handleMatrixChange}
          />

          {/* HUD overlay: status */}
          <div className="absolute top-4 left-4 pointer-events-none z-10">
            <div
              className="font-mono text-xs tracking-widest flex items-center gap-2"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{
                  backgroundColor: statusError ? "#E34F4F" : "#31A24C",
                }}
              />
              <span
                style={{ color: statusError ? "#E34F4F" : "#31A24C" }}
              >
                {status}
              </span>
            </div>
          </div>

          {/* HUD overlay: mini matrix readout */}
          <div className="absolute bottom-4 left-4 pointer-events-none z-10">
            <div
              className="text-[8px] uppercase tracking-[0.22em] mb-2"
              style={{
                color: "#3a4232",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Pin State
            </div>
            <div
              className="inline-grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 7px)`,
                gridTemplateRows: `repeat(${ROWS}, 7px)`,
                gap: "2px",
              }}
            >
              {matrixReadout.map((val, i) => (
                <div
                  key={i}
                  className="rounded-[1px] transition-all duration-150"
                  style={{
                    width: 7,
                    height: 7,
                    backgroundColor: val > 0.5 ? "#0866FF" : "#3a4232",
                    boxShadow:
                      val > 0.5
                        ? "0 0 4px rgba(8,102,255,0.5)"
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Profile bar */}
        <div className="border-t border-[#E4E6EB] bg-white px-4 py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              Visual Profile
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(PROFILES).map(([key, profile]) => (
                <button
                  key={key}
                  onClick={() => handleProfileChange(key)}
                  className={`
                    px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border
                    ${
                      activeProfile === key
                        ? "bg-coral text-white border-coral shadow-sm"
                        : "bg-white text-navy border-[#E4E6EB] hover:border-coral/40"
                    }
                  `}
                >
                  {profile.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
