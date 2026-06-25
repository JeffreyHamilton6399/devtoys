"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { AlertTriangle, Check } from "lucide-react";

interface HashInfo {
  name: string;
  length: number;
  charset: "hex" | "base64" | "other";
  notes: string;
}

// Lengths and expected charsets for common hash algorithms
const HASH_DATABASE: HashInfo[] = [
  { name: "MD5", length: 32, charset: "hex", notes: "128-bit. Broken for security; OK for checksums." },
  { name: "MD4", length: 32, charset: "hex", notes: "128-bit. Cryptographically broken." },
  { name: "NTLM", length: 32, charset: "hex", notes: "MD4 of UTF-16LE password. Windows auth." },
  { name: "SHA-1", length: 40, charset: "hex", notes: "160-bit. Deprecated for security." },
  { name: "SHA-256", length: 64, charset: "hex", notes: "256-bit. Common in modern systems." },
  { name: "SHA-224", length: 56, charset: "hex", notes: "224-bit SHA-2 variant." },
  { name: "SHA-384", length: 96, charset: "hex", notes: "384-bit SHA-2 variant." },
  { name: "SHA-512", length: 128, charset: "hex", notes: "512-bit. Common in modern systems." },
  { name: "SHA-512/224", length: 56, charset: "hex", notes: "Truncated SHA-512." },
  { name: "SHA-512/256", length: 64, charset: "hex", notes: "Truncated SHA-512." },
  { name: "SHA3-224", length: 56, charset: "hex", notes: "Keccak-224." },
  { name: "SHA3-256", length: 64, charset: "hex", notes: "Keccak-256." },
  { name: "SHA3-384", length: 96, charset: "hex", notes: "Keccak-384." },
  { name: "SHA3-512", length: 128, charset: "hex", notes: "Keccak-512." },
  { name: "RIPEMD-128", length: 32, charset: "hex", notes: "128-bit. Broken for security." },
  { name: "RIPEMD-160", length: 40, charset: "hex", notes: "160-bit. Used in Bitcoin addresses." },
  { name: "RIPEMD-256", length: 64, charset: "hex", notes: "256-bit. Rare." },
  { name: "RIPEMD-320", length: 80, charset: "hex", notes: "320-bit. Rare." },
  { name: "BLAKE2s-256", length: 64, charset: "hex", notes: "BLAKE2s variant." },
  { name: "BLAKE2b-512", length: 128, charset: "hex", notes: "BLAKE2b variant." },
  { name: "Whirlpool", length: 128, charset: "hex", notes: "512-bit. Rare." },
  { name: "CRC32", length: 8, charset: "hex", notes: "32-bit checksum, not a hash." },
  { name: "Adler-32", length: 8, charset: "hex", notes: "32-bit checksum." },
  { name: "MySQL 3.x", length: 16, charset: "hex", notes: "Legacy MySQL password hash." },
  { name: "MySQL 4.x / 5.x", length: 40, charset: "hex", notes: "SHA-1(SHA-1(password))." },
  { name: "MongoDB (MD5)", length: 32, charset: "hex", notes: "MD5 of password + salt." },
];

interface MatchResult {
  info: HashInfo;
  confidence: "high" | "medium" | "low";
}

function identifyHash(raw: string): MatchResult[] {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return [];

  // Detect charset
  const isHex = /^[0-9a-f]+$/.test(trimmed);
  const isBase64 = /^[a-zA-Z0-9+/]+={0,2}$/.test(trimmed);
  if (!isHex && !isBase64) return [];

  const length = trimmed.length;
  const results: MatchResult[] = [];

  for (const info of HASH_DATABASE) {
    if (info.length === length && (isHex || info.charset === "hex")) {
      // Exact length + charset match
      results.push({ info, confidence: "high" });
    }
  }

  // If nothing matched exactly, try base64-decoded byte length
  if (results.length === 0 && isBase64) {
    try {
      const decoded = atob(trimmed);
      const byteLen = decoded.length;
      for (const info of HASH_DATABASE) {
        if (info.length / 2 === byteLen) {
          results.push({ info, confidence: "medium" });
        }
      }
    } catch {
      // ignore
    }
  }

  return results;
}

const CONFIDENCE_COLORS = {
  high: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  medium: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  low: "border-muted bg-muted/30 text-muted-foreground",
};

export function HashIdentifier() {
  const [input, setInput] = React.useState("");
  const [matches, setMatches] = React.useState<MatchResult[]>([]);
  const [isLikelyHash, setIsLikelyHash] = React.useState(true);

  React.useEffect(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setMatches([]);
      setIsLikelyHash(true);
      return;
    }
    const m = identifyHash(trimmed);
    setMatches(m);
    const isHex = /^[0-9a-f]+$/i.test(trimmed);
    setIsLikelyHash(isHex || /^[a-zA-Z0-9+/]+={0,2}$/.test(trimmed));
  }, [input]);

  const clear = () => {
    setInput("");
    setMatches([]);
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Hash</label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a hash: 5d41402abc4b2a76b9719d911017c592"
          className="min-h-[64px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">
          Identifies by length and charset. Doesn&apos;t verify the hash is correct — just suggests likely algorithms.
        </p>
      </div>

      {input.trim() && !isLikelyHash && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span>Input doesn&apos;t look like a hex or Base64 hash.</span>
        </div>
      )}

      {matches.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium text-muted-foreground">
            {matches.length} possible match{matches.length === 1 ? "" : "es"}
          </div>
          {matches.map((m, i) => (
            <div
              key={i}
              className={`rounded-md border p-2 ${CONFIDENCE_COLORS[m.confidence]}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Check className="size-3.5" />
                  <span className="text-sm font-semibold">{m.info.name}</span>
                  <span className="text-[10px] uppercase opacity-70">{m.confidence}</span>
                </div>
                <span className="font-mono text-xs opacity-70">{m.info.length} chars</span>
              </div>
              <p className="mt-1 text-xs opacity-80">{m.info.notes}</p>
            </div>
          ))}
        </div>
      )}

      {input.trim() && isLikelyHash && matches.length === 0 && (
        <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          No known hash algorithms match length {input.trim().length}.
        </div>
      )}
    </div>
  );
}
