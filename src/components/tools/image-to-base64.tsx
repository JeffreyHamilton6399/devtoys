"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { Upload, AlertTriangle } from "lucide-react";

interface ImageInfo {
  dataUri: string;
  mime: string;
  sizeBytes: number;
  width: number;
  height: number;
  name: string;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function ImageToBase64() {
  const [info, setInfo] = React.useState<ImageInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, GIF, SVG, WebP).");
      setInfo(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is larger than 5 MB — base64 will be huge. Choose a smaller file.");
      // Still attempt to load — just warn
    } else {
      setError(null);
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      // Get dimensions
      const img = new Image();
      img.onload = () => {
        setInfo({
          dataUri,
          mime: file.type,
          sizeBytes: file.size,
          width: img.width,
          height: img.height,
          name: file.name,
        });
      };
      img.onerror = () => {
        setInfo({
          dataUri,
          mime: file.type,
          sizeBytes: file.size,
          width: 0,
          height: 0,
          name: file.name,
        });
      };
      img.src = dataUri;
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setInfo(null);
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) {
          handleFile(f);
          break;
        }
      }
    }
  };

  const clear = () => {
    setInfo(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // CSS background-image snippet
  const cssSnippet = info
    ? `background-image: url("${info.dataUri}");`
    : "";
  // HTML img tag snippet
  const htmlSnippet = info
    ? `<img src="${info.dataUri}" alt="${info.name}" width="${info.width}" height="${info.height}" />`
    : "";

  return (
    <div
      className="flex h-full flex-col gap-2 overflow-y-auto"
      onPaste={onPaste}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {/* Drop zone */}
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-muted-foreground/30 hover:border-muted-foreground/50"
        }`}
      >
        <Upload className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drop an image here, paste from clipboard, or
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose file
        </Button>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, GIF, WebP, SVG · max 5 MB recommended
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="flex flex-col gap-2">
          {/* Preview + metadata */}
          <div className="flex items-start gap-3 rounded-md border bg-muted/30 p-3">
            <img
              src={info.dataUri}
              alt={info.name}
              className="size-16 shrink-0 rounded border object-contain"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-xs">
              <span className="truncate font-medium">{info.name}</span>
              <span className="text-muted-foreground">
                {info.width}×{info.height}px · {info.mime} · {formatBytes(info.sizeBytes)}
              </span>
              <span className="text-muted-foreground">
                Base64 length: {info.dataUri.length.toLocaleString()} chars
              </span>
              <ClearButton onClear={clear} className="mt-1 self-start" />
            </div>
          </div>

          {/* Data URI */}
          <SnippetBlock
            label="Data URI"
            value={info.dataUri}
          />
          {/* CSS snippet */}
          <SnippetBlock
            label="CSS background-image"
            value={cssSnippet}
          />
          {/* HTML img snippet */}
          <SnippetBlock
            label="HTML <img> tag"
            value={htmlSnippet}
          />
        </div>
      )}
    </div>
  );
}

function SnippetBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <CopyButton value={value} />
      </div>
      <Textarea
        value={value}
        readOnly
        className="max-h-24 min-h-[48px] resize-none bg-background/60 font-mono text-xs leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
}
