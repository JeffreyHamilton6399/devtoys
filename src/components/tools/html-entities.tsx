"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton, SwapButton } from "@/components/devtoys/action-buttons";

type Mode = "encode" | "decode";

const NAMED: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#47;",
};

const NAMED_REV: Record<string, string> = Object.fromEntries(
  Object.entries(NAMED).map(([k, v]) => [v, k]),
);

// Extended entities for decode (common HTML entities)
const EXTENDED_REV: Record<string, string> = {
  "&nbsp;": " ",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&hellip;": "…",
  "&mdash;": "—",
  "&ndash;": "–",
  "&lsquo;": "'",
  "&rsquo;": "'",
  "&ldquo;": '"',
  "&rdquo;": '"',
  "&laquo;": "«",
  "&raquo;": "»",
  "&euro;": "€",
  "&pound;": "£",
  "&yen;": "¥",
  "&cent;": "¢",
  "&sect;": "§",
  "&deg;": "°",
  "&plusmn;": "±",
  "&times;": "×",
  "&divide;": "÷",
  "&micro;": "µ",
  "&para;": "¶",
  "&middot;": "·",
  "&bull;": "•",
  "&dagger;": "†",
  "&Dagger;": "‡",
  "&permil;": "‰",
  "&prime;": "′",
  "&Prime;": "″",
  "&infin;": "∞",
  "&ne;": "≠",
  "&le;": "≤",
  "&ge;": "≥",
  "&alpha;": "α",
  "&beta;": "β",
  "&gamma;": "γ",
  "&delta;": "δ",
  "&pi;": "π",
  "&Sigma;": "Σ",
  "&Omega;": "Ω",
  ...NAMED_REV,
};

function encode(text: string): string {
  return text.replace(/[&<>"'/]/g, (c) => NAMED[c] ?? c);
}

function decode(text: string): string {
  // First decode named entities (longest match first)
  const namedRegex = /&[a-zA-Z]+;/g;
  let out = text.replace(namedRegex, (m) => EXTENDED_REV[m] ?? m);
  // Then decode numeric entities (decimal & hex)
  out = out.replace(/&#(\d+);/g, (_, dec) => {
    const n = parseInt(dec, 10);
    if (isNaN(n) || n < 0 || n > 0x10ffff) return _;
    try {
      return String.fromCodePoint(n);
    } catch {
      return _;
    }
  });
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    const n = parseInt(hex, 16);
    if (isNaN(n) || n < 0 || n > 0x10ffff) return _;
    try {
      return String.fromCodePoint(n);
    } catch {
      return _;
    }
  });
  return out;
}

export function HtmlEntities() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    setOutput(mode === "encode" ? encode(input) : decode(input));
  }, [input, mode]);

  const swap = () => {
    if (!output) return;
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={mode === "encode" ? "default" : "outline"}
          onClick={() => setMode("encode")}
        >
          Encode
        </Button>
        <Button
          size="sm"
          variant={mode === "decode" ? "default" : "outline"}
          onClick={() => setMode("decode")}
        >
          Decode
        </Button>
        <span className="text-xs text-muted-foreground">
          Named + numeric entities · 30+ common entities
        </span>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Raw HTML" : "Encoded HTML"}
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? '<a href="https://example.com">Tom & Jerry</a>'
                : '&lt;a href=&quot;https://example.com&quot;&gt;Tom &amp; Jerry&lt;/a&gt;'
            }
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Encoded HTML" : "Raw HTML"}
            </label>
            <div className="flex items-center gap-1">
              <SwapButton onSwap={swap} disabled={!output} />
              <CopyButton value={output} disabled={!output} />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Output will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
