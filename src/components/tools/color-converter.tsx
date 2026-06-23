"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

// ---------- color conversions ----------
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360 / 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

interface ColorInfo {
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
  hex: string;
}

function parseColor(input: string): ColorInfo | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // HEX
  if (/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(trimmed.replace(/^#/, ""))) {
    const rgb = hexToRgb(trimmed);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { ...rgb, ...hsl, hex: rgbToHex(rgb.r, rgb.g, rgb.b) };
    }
  }

  // RGB
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );
  if (rgbMatch) {
    const r = clamp(+rgbMatch[1], 0, 255);
    const g = clamp(+rgbMatch[2], 0, 255);
    const b = clamp(+rgbMatch[3], 0, 255);
    const hsl = rgbToHsl(r, g, b);
    return { r, g, b, ...hsl, hex: rgbToHex(r, g, b) };
  }

  // HSL
  const hslMatch = trimmed.match(
    /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );
  if (hslMatch) {
    const h = +hslMatch[1];
    const s = +hslMatch[2];
    const l = +hslMatch[3];
    const rgb = hslToRgb(h, s, l);
    return { ...rgb, h, s, l, hex: rgbToHex(rgb.r, rgb.g, rgb.b) };
  }

  return null;
}

export function ColorConverter() {
  const [input, setInput] = React.useState("");
  const [info, setInfo] = React.useState<ColorInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!input.trim()) {
      setInfo(null);
      setError(null);
      return;
    }
    const c = parseColor(input);
    if (c) {
      setInfo(c);
      setError(null);
    } else {
      setInfo(null);
      setError("Unrecognized format. Use HEX (#RRGGBB), rgb(r,g,b), or hsl(h,s%,l%).");
    }
  }, [input]);

  const clear = () => {
    setInput("");
    setInfo(null);
    setError(null);
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            HEX, RGB, or HSL
          </label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#10b981  or  rgb(16,185,129)  or  hsl(160, 84%, 39%)"
          className="min-h-[64px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">Auto-detects format.</p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs font-mono text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {info && (
        <div className="flex flex-col gap-2">
          {/* Live swatch */}
          <div
            className="h-16 w-full rounded-md border"
            style={{ backgroundColor: info.hex }}
            aria-label={`Color preview ${info.hex}`}
          />

          <ColorRow
            label="HEX"
            value={info.hex.toUpperCase()}
          />
          <ColorRow
            label="RGB"
            value={`rgb(${info.r}, ${info.g}, ${info.b})`}
          />
          <ColorRow
            label="HSL"
            value={`hsl(${info.h}, ${info.s}%, ${info.l}%)`}
          />
          <ColorRow
            label="CSS var"
            value={`--color: ${info.hex};`}
          />
        </div>
      )}
    </div>
  );
}

function ColorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-1.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="truncate text-right font-mono text-xs">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
