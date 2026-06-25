"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { Lock, RefreshCw, Layers } from "lucide-react";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/";
const AMBIGUOUS = "Il1O0o";

function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function generatePassword(length: number, opts: {
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}): string {
  let pool = "";
  if (opts.upper) pool += UPPER;
  if (opts.lower) pool += LOWER;
  if (opts.digits) pool += DIGITS;
  if (opts.symbols) pool += SYMBOLS;
  if (opts.excludeAmbiguous) {
    pool = pool.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
  }
  if (!pool) return "";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += pool[secureRandomInt(pool.length)];
  }
  return out;
}

function strength(pw: string): { label: string; color: string; bits: number } {
  if (!pw) return { label: "—", color: "bg-muted", bits: 0 };
  let poolSize = 0;
  if (/[a-z]/.test(pw)) poolSize += 26;
  if (/[A-Z]/.test(pw)) poolSize += 26;
  if (/[0-9]/.test(pw)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) poolSize += 26;
  const bits = Math.round(pw.length * Math.log2(poolSize || 1));
  if (bits < 40) return { label: "Weak", color: "bg-rose-500", bits };
  if (bits < 60) return { label: "Fair", color: "bg-amber-500", bits };
  if (bits < 80) return { label: "Good", color: "bg-emerald-500", bits };
  if (bits < 120) return { label: "Strong", color: "bg-emerald-600", bits };
  return { label: "Excellent", color: "bg-emerald-700", bits };
}

export function PasswordGenerator() {
  const [length, setLength] = React.useState(20);
  const [opts, setOpts] = React.useState({
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [current, setCurrent] = React.useState("");
  const [batch, setBatch] = React.useState("");

  const gen = React.useCallback(() => {
    setCurrent(generatePassword(length, opts));
  }, [length, opts]);

  // Auto-generate on mount + when opts change
  React.useEffect(() => {
    gen();
  }, [gen]);

  const genBatch = (n: number) => {
    const arr = Array.from({ length: n }, () => generatePassword(length, opts));
    setBatch(arr.join("\n"));
  };

  const s = strength(current);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      {/* Current password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Password
          </label>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={gen}>
              <RefreshCw className="size-3.5" />
              Regenerate
            </Button>
            <CopyButton value={current} disabled={!current} />
          </div>
        </div>
        <Input
          value={current}
          readOnly
          className="font-mono text-sm"
          placeholder="Click regenerate"
        />
        {/* Strength meter */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${s.color}`}
              style={{ width: `${Math.min(100, (s.bits / 120) * 100)}%` }}
            />
          </div>
          <span className="w-20 text-right text-xs text-muted-foreground">
            {s.label} · {s.bits}b
          </span>
        </div>
      </div>

      {/* Length */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Length</Label>
          <span className="font-mono text-xs text-muted-foreground">{length}</span>
        </div>
        <Slider
          value={[length]}
          onValueChange={(v) => setLength(v[0])}
          min={4}
          max={64}
          step={1}
        />
      </div>

      {/* Char sets */}
      <div className="grid grid-cols-2 gap-2">
        {([
          ["upper", "Uppercase A-Z"],
          ["lower", "Lowercase a-z"],
          ["digits", "Digits 0-9"],
          ["symbols", "Symbols !@#$"],
        ] as const).map(([key, label]) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 text-xs"
          >
            <Checkbox
              checked={opts[key]}
              onCheckedChange={(v) => setOpts((p) => ({ ...p, [key]: v === true }))}
              className="size-3.5"
            />
            {label}
          </label>
        ))}
        <label className="col-span-2 flex cursor-pointer items-center gap-2 text-xs">
          <Checkbox
            checked={opts.excludeAmbiguous}
            onCheckedChange={(v) => setOpts((p) => ({ ...p, excludeAmbiguous: v === true }))}
            className="size-3.5"
          />
          Exclude ambiguous chars (Il1O0o)
        </label>
      </div>

      {/* Batch */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Batch generate
          </label>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => genBatch(10)}>
              <Layers className="size-3.5" />
              x10
            </Button>
            <Button size="sm" variant="outline" onClick={() => genBatch(50)}>
              <Layers className="size-3.5" />
              x50
            </Button>
          </div>
        </div>
        <Textarea
          value={batch}
          readOnly
          placeholder="Click x10 / x50 to batch generate"
          className="min-h-[80px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        {batch && (
          <div className="flex justify-end">
            <CopyButton value={batch} />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        <Lock className="mr-1 inline size-3" />
        Uses crypto.getRandomValues — cryptographically secure.
      </p>
    </div>
  );
}
