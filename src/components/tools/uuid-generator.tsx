"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { Fingerprint, Layers } from "lucide-react";

function generateUuid(): string {
  // Native crypto.randomUUID where available; fallback for older browsers
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

export function UuidGenerator() {
  const [output, setOutput] = React.useState("");

  const generate = (count: number) => {
    const lines = Array.from({ length: count }, () => generateUuid());
    setOutput(lines.join("\n"));
  };

  // Auto-generate one on first mount
  React.useEffect(() => {
    if (!output) generate(1);
  }, []);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => generate(1)}>
          <Fingerprint className="size-3.5" />
          Generate 1
        </Button>
        <Button size="sm" variant="outline" onClick={() => generate(10)}>
          <Layers className="size-3.5" />
          x10
        </Button>
        <Button size="sm" variant="outline" onClick={() => generate(50)}>
          <Layers className="size-3.5" />
          x50
        </Button>
        <Button size="sm" variant="outline" onClick={() => generate(100)}>
          <Layers className="size-3.5" />
          x100
        </Button>
        <span className="text-xs text-muted-foreground">
          UUID v4 · crypto.randomUUID()
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Generated UUIDs
          </label>
          <CopyButton value={output} disabled={!output} />
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="UUIDs will appear here"
          className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
