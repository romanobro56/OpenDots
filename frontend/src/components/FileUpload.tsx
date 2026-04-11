"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPTED = ".png,.jpg,.jpeg,.heic,.webp,.gif";

export default function FileUpload({
  onUpload,
}: {
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setUploading(true);
      try {
        await onUpload(file);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all ${
        dragOver
          ? "border-gold bg-gold/10"
          : "border-navy/20 hover:border-gold/60 bg-white"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {uploading ? (
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-3 h-3 rounded-full bg-gold animate-glow-pulse" style={{ animationDelay: `${i*200}ms` }} />
          ))}
        </div>
      ) : fileName ? (
        <p className="text-sm text-muted-foreground">
          Uploaded: <span className="font-bold text-navy">{fileName}</span> — click or
          drop to replace
        </p>
      ) : (
        <>
          <p className="text-sm font-bold text-navy">
            Drop an image here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPEG, HEIC, WebP, GIF
          </p>
        </>
      )}
    </div>
  );
}
