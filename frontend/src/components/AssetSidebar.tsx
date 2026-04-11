"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";

interface AssetGroup {
  label: string;
  collection: string;
  files: string[];
}

interface AssetSidebarProps {
  onSelect: (file: string, collection: string) => void;
  selectedFile: string | null;
  loading?: boolean;
}

function displayName(filename: string): string {
  const name = filename.replace(/\.(png|jpg|jpeg)$/i, "");
  if (name.endsWith("_upper")) return name.replace("_upper", "").toUpperCase();
  if (name.startsWith("braille_")) return name.replace("braille_", "");
  if (name === "plus") return "+";
  if (name === "minus") return "-";
  if (name === "multiplication") return "x";
  if (name === "division") return "/";
  return name;
}

export default function AssetSidebar({
  onSelect,
  selectedFile,
  loading,
}: AssetSidebarProps) {
  const [groups, setGroups] = useState<Record<string, AssetGroup>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((data) => {
        setGroups(data);
        const firstKey = Object.keys(data)[0];
        if (firstKey) setExpanded({ [firstKey]: true });
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  function toggleGroup(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading assets...
      </div>
    );
  }

  const groupEntries = Object.entries(groups);
  if (groupEntries.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground text-[13px]">
        No assets found. Generate letters first with{" "}
        <code className="bg-muted px-1.5 py-0.5 rounded text-[12px]">python -m cli.generate_letters</code>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {groupEntries.map(([key, group]) => (
        <div key={key}>
          <button
            onClick={() => toggleGroup(key)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-semibold text-navy hover:bg-muted transition-colors cursor-pointer"
          >
            {expanded[key] ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {group.label}
            <span className="text-[11px] font-normal text-muted-foreground ml-auto">
              {group.files.length}
            </span>
          </button>

          {expanded[key] && (
            <div className="flex flex-wrap gap-1 px-3 pb-2 pt-1">
              {group.files.map((file) => {
                const isSelected = selectedFile === `${group.collection}/${file}`;
                return (
                  <button
                    key={file}
                    onClick={() => onSelect(file, group.collection)}
                    disabled={loading}
                    className={`
                      min-w-[36px] px-2 py-1.5 rounded-lg text-[12px] font-semibold
                      transition-all cursor-pointer border
                      ${
                        isSelected
                          ? "bg-coral text-white border-coral shadow-sm"
                          : "bg-white text-navy border-[#E4E6EB] hover:border-coral/40 hover:bg-muted"
                      }
                      ${loading ? "opacity-50 cursor-wait" : ""}
                    `}
                  >
                    {displayName(file)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
