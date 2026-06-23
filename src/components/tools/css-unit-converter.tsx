"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/devtoys/copy-button";

// All conversions go through px first, then to the target unit
// px = rem * baseFontSize
// px = em * baseFontSize (we treat em as relative to root for this tool)
// px = pt * 96 / 72
// px = vw * viewportWidth / 100

interface State {
  px: string;
  rem: string;
  em: string;
  pt: string;
  vw: string;
  base: number; // base font size in px
  viewport: number; // viewport width in px for vw
}

function fromPx(px: number, base: number, viewport: number) {
  return {
    rem: px / base,
    em: px / base,
    pt: px * 72 / 96,
    vw: px * 100 / viewport,
  };
}

function toPx(value: number, unit: keyof Omit<State, "base" | "viewport">, base: number, viewport: number): number {
  switch (unit) {
    case "rem": return value * base;
    case "em": return value * base;
    case "pt": return value * 96 / 72;
    case "vw": return value * viewport / 100;
    case "px": return value;
  }
}

const FIELDS: { key: keyof Omit<State, "base" | "viewport">; label: string }[] = [
  { key: "px", label: "px" },
  { key: "rem", label: "rem" },
  { key: "em", label: "em" },
  { key: "pt", label: "pt" },
  { key: "vw", label: "vw" },
];

export function CssUnitConverter() {
  const [base, setBase] = React.useState(16);
  const [viewport, setViewport] = React.useState(1440);
  const [values, setValues] = React.useState<Record<string, string>>({
    px: "16",
    rem: "",
    em: "",
    pt: "",
    vw: "",
  });

  const update = (unit: keyof typeof values, raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setValues({ px: "", rem: "", em: "", pt: "", vw: "" });
      return;
    }
    const n = parseFloat(trimmed);
    if (isNaN(n)) {
      setValues({ ...values, [unit]: raw });
      return;
    }
    const px = toPx(n, unit, base, viewport);
    const rest = fromPx(px, base, viewport);
    setValues({
      px: unit === "px" ? raw : formatNum(px),
      rem: unit === "rem" ? raw : formatNum(rest.rem),
      em: unit === "em" ? raw : formatNum(rest.em),
      pt: unit === "pt" ? raw : formatNum(rest.pt),
      vw: unit === "vw" ? raw : formatNum(rest.vw),
    });
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Root font size (px)</Label>
          <Input
            type="number"
            min={1}
            value={base}
            onChange={(e) => setBase(Math.max(1, Number(e.target.value) || 16))}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Viewport width (px)</Label>
          <Input
            type="number"
            min={1}
            value={viewport}
            onChange={(e) => setViewport(Math.max(1, Number(e.target.value) || 1440))}
            className="h-8 text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1.5"
          >
            <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground">
              {f.label}
            </span>
            <Input
              value={values[f.key] ?? ""}
              onChange={(e) => update(f.key, e.target.value)}
              placeholder="0"
              className="h-8 flex-1 font-mono text-xs"
              spellCheck={false}
            />
            <CopyButton value={values[f.key] ?? ""} disabled={!values[f.key]} />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Type in any field — all others update live. <code className="rounded bg-muted px-1">em</code> is treated as relative to the root (same as rem) for simplicity.
      </p>
    </div>
  );
}

function formatNum(n: number): string {
  if (!isFinite(n)) return "";
  const rounded = Math.round(n * 1000) / 1000;
  return String(rounded);
}
