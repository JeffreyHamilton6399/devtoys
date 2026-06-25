"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { AlertTriangle } from "lucide-react";

function base64UrlDecode(str: string): string {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function toHex(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface Decoded {
  header: string;
  payload: string;
  signatureHex: string;
  exp?: number;
  expired?: boolean;
}

export function JwtDecoder() {
  const [input, setInput] = React.useState("");
  const [decoded, setDecoded] = React.useState<Decoded | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = input.trim();
    if (!token) {
      setDecoded(null);
      setError(null);
      return;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      setDecoded(null);
      setError("Invalid JWT: expected 3 parts separated by dots (header.payload.signature)");
      return;
    }
    try {
      const header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      const payload = JSON.stringify(JSON.parse(base64UrlDecode(parts[1])), null, 2);
      const signatureHex = toHex(parts[2]);
      let exp: number | undefined;
      let expired: boolean | undefined;
      try {
        const p = JSON.parse(base64UrlDecode(parts[1]));
        if (typeof p.exp === "number") {
          exp = p.exp;
          expired = Date.now() >= exp * 1000;
        }
      } catch {
        // ignore
      }
      setDecoded({ header, payload, signatureHex, exp, expired });
      setError(null);
    } catch (e) {
      setDecoded(null);
      setError(e instanceof Error ? e.message : "Failed to decode JWT");
    }
  }, [input]);

  const clear = () => {
    setInput("");
    setDecoded(null);
    setError(null);
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            JWT token
          </label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldlRveXMiLCJpYXQiOjE1MTYyMzkwMjJ9.signature"
          className="min-h-[72px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{error}</span>
        </div>
      )}

      {decoded && (
        <div className="flex flex-col gap-2">
          {decoded.expired !== undefined && (
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
                decoded.expired
                  ? "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                  : "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              <AlertTriangle className="size-3.5" />
              {decoded.expired
                ? `Token expired ${new Date(decoded.exp! * 1000).toLocaleString()}`
                : `Token valid until ${new Date(decoded.exp! * 1000).toLocaleString()}`}
            </div>
          )}

          <Panel
            label="Header"
            color="border-rose-500/30 bg-rose-500/5"
            labelColor="text-rose-600 dark:text-rose-400"
            value={decoded.header}
          />
          <Panel
            label="Payload"
            color="border-violet-500/30 bg-violet-500/5"
            labelColor="text-violet-600 dark:text-violet-400"
            value={decoded.payload}
          />
          <Panel
            label="Signature (hex)"
            color="border-sky-500/30 bg-sky-500/5"
            labelColor="text-sky-600 dark:text-sky-400"
            value={decoded.signatureHex}
            mono
          />
        </div>
      )}
    </div>
  );
}

function Panel({
  label,
  value,
  color,
  labelColor,
  mono,
}: {
  label: string;
  value: string;
  color: string;
  labelColor: string;
  mono?: boolean;
}) {
  return (
    <div className={`rounded-md border ${color} p-2`}>
      <div className="mb-1 flex items-center justify-between">
        <span className={`text-xs font-semibold ${labelColor}`}>{label}</span>
        <CopyButton value={value} />
      </div>
      <pre
        className={`max-h-40 overflow-auto whitespace-pre-wrap break-all text-xs ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </pre>
    </div>
  );
}
