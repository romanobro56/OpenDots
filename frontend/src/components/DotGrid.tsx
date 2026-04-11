"use client";

import { useEffect, useState } from "react";

interface DotGridProps {
  grid: number[][];
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = { sm: 8, md: 12, lg: 16 };
const gapMap = { sm: 2, md: 3, lg: 4 };

export default function DotGrid({ grid, animate = false, size = "md" }: DotGridProps) {
  const [revealed, setRevealed] = useState(!animate);
  const dotSize = sizeMap[size];
  const gap = gapMap[size];

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [animate]);

  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateColumns: `repeat(${grid[0]?.length || 12}, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {grid.flatMap((row, r) =>
        row.map((val, c) => (
          <div
            key={`${r}-${c}`}
            className="rounded-full transition-all duration-500"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: val
                ? revealed ? "#E8A838" : "rgba(232, 168, 56, 0.15)"
                : "rgba(232, 168, 56, 0.1)",
              boxShadow: val && revealed ? "0 0 8px 2px rgba(232, 168, 56, 0.4)" : "none",
              transform: val && revealed ? "scale(1)" : "scale(0.7)",
              transitionDelay: animate ? `${(r * row.length + c) * 15}ms` : "0ms",
            }}
          />
        ))
      )}
    </div>
  );
}
