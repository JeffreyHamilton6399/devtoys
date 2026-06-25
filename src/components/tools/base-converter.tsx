"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

interface BaseDef {
  id: string;
  label: string;
  base: number;
  placeholder: string;
}

const BASES: BaseDef[] = [
  { id: "bin", label: "Binary", base: 2, placeholder: "101010" },
  { id: "oct", label: "Octal", base: 8, placeholder: "52" },
  { id: "dec", label: "Decimal", base: 10, placeholder: "42" },
  { id: "hex", label: "Hexadecimal", base: 16, placeholder: "2a" },
  { id: "b36", label: "Base 36", base: 36, placeholder: "16" },
];

// Base58 (Bitcoin alphabet) — exclude 0, O, I, l to avoid confusion
const B58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function decodeBase58(s: string): bigint | null {
  if (!s) return 0n;
  let n = 0n;
  for (const c of s) {
    const idx = B58_ALPHABET.indexOf(c);
    if (idx < 0) return null;
    n = n * 58n + BigInt(idx);
  }
  return n;
}

function encodeBase58(n: bigint): string {
  if (n === 0n) return "";
  let s = "";
  let x = n;
  while (x > 0n) {
    const r = x % 58n;
    x = x / 58n;
    s = B58_ALPHABET[Number(r)] + s;
  }
  return s;
}

function parseValue(raw: string, base: number): bigint | null {
  const trimmed = raw.trim().toLowerCase().replace(/^0+/, "");
  if (!trimmed) return 0n;
  if (base === 10) {
    if (!/^-?\d+$/.test(trimmed)) return null;
    try {
      return BigInt(trimmed);
    } catch {
      return null;
    }
  }
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
  if (!trimmed.split("").every((c) => chars.includes(c))) return null;
  let n = 0n;
  const b = BigInt(base);
  for (const c of trimmed) {
    n = n * b + BigInt(chars.indexOf(c));
  }
  return n;
}

function formatValue(n: bigint, baseId: string): string {
  if (baseId === "b58") return encodeBase58(n);
  if (baseId === "b64") {
    // Standard base64 of the decimal string — convenient for transport
    const s = n.toString();
    if (typeof btoa !== "undefined") return btoa(s);
    return "";
  }
  const base = BASES.find((b) => b.id === baseId)?.base ?? 10;
  if (n === 0n) return "0";
  let x = n < 0n ? -n : n;
  const b = BigInt(base);
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let s = "";
  while (x > 0n) {
    s = chars[Number(x % b)] + s;
    x = x / b;
  }
  return (n < 0n ? "-" : "") + s;
}

export function BaseConverter() {
  const [values, setValues] = React.useState<Record<string, string>>({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
    b36: "",
    b58: "",
    b64: "",
  });
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const updateFrom = (id: string, raw: string) => {
    setActiveId(id);
    setValues((prev) => ({ ...prev, [id]: raw }));
    if (!raw.trim()) {
      setValues({
        bin: "", oct: "", dec: "", hex: "", b36: "", b58: "", b64: "",
      });
      setError(null);
      return;
    }
    // Parse from the active source
    let n: bigint | null = null;
    if (id === "b58") n = decodeBase58(raw.trim());
    else if (id === "b64") {
      try {
        const dec = typeof atob !== "undefined" ? atob(raw.trim()) : "";
        if (/^\d+$/.test(dec)) n = BigInt(dec);
      } catch {
        n = null;
      }
    } else {
      const def = BASES.find((b) => b.id === id);
      if (def) n = parseValue(raw, def.base);
    }
    if (n === null) {
      setError(`Invalid input for ${id}`);
      return;
    }
    setError(null);
    setValues({
      bin: formatValue(n, "bin"),
      oct: formatValue(n, "oct"),
      dec: formatValue(n, "dec"),
      hex: formatValue(n, "hex"),
      b36: formatValue(n, "b36"),
      b58: formatValue(n, "b58"),
      b64: formatValue(n, "b64"),
    });
    // restore active field to user input
    setValues((prev) => ({ ...prev, [id]: raw }));
  };

  const clear = () => {
    setValues({ bin: "", oct: "", dec: "", hex: "", b36: "", b58: "", b64: "" });
    setActiveId(null);
    setError(null);
  };

  const rows: (BaseDef & { extra?: boolean })[] = [
    ...BASES,
    { id: "b58", label: "Base 58", base: 58, placeholder: "2q1VAr", extra: true },
    { id: "b64", label: "Base 64 (dec)", base: 64, placeholder: "NDI=", extra: true },
  ];

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Type in any field — all others update live. BigInt-safe.
        </span>
        <ClearButton onClear={clear} disabled={!Object.values(values).some((v) => v)} />
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 ${
              activeId === r.id ? "border-emerald-500/50 bg-emerald-500/5" : "bg-muted/30"
            }`}
          >
            <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
              {r.label}
            </span>
            <Input
              value={values[r.id] ?? ""}
              onChange={(e) => updateFrom(r.id, e.target.value)}
              placeholder={r.placeholder}
              className="h-8 flex-1 font-mono text-xs"
              spellCheck={false}
            />
            <CopyButton value={values[r.id] ?? ""} disabled={!values[r.id]} />
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs font-mono text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: paste a hex value like <code className="rounded bg-muted px-1">deadbeef</code> into the Hexadecimal field to see all bases update.
      </p>
    </div>
  );
}
