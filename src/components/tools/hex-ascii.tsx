"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton, SwapButton } from "@/components/devtoys/action-buttons";

type Mode = "encode" | "decode";

function toHex(text: string, separator: string): string {
  const bytes = new TextEncoder().encode(text);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(separator);
}

function fromHex(input: string): { ok: true; value: string } | { ok: false; error: string } {
  const cleaned = input.replace(/[^0-9a-fA-F]/g, "");
  if (cleaned.length % 2 !== 0) {
    return { ok: false, error: "Hex string has an odd number of digits" };
  }
  if (!cleaned) return { ok: true, value: "" };
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.slice(i, i + 2), 16);
  }
  try {
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid UTF-8 sequence" };
  }
}

export function HexAscii() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [separator, setSeparator] = React.useState(" ");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }
    if (mode === "encode") {
      setOutput(toHex(input, separator));
      setError(null);
    } else {
      const r = fromHex(input);
      if (r.ok) {
        setOutput(r.value);
        setError(null);
      } else {
        setOutput("");
        setError(r.error);
      }
    }
  }, [input, mode, separator]);

  const swap = () => {
    if (!output) return;
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setInput(output);
    setOutput("");
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={mode === "encode" ? "default" : "outline"}
          onClick={() => setMode("encode")}
        >
          ASCII → HEX
        </Button>
        <Button
          size="sm"
          variant={mode === "decode" ? "default" : "outline"}
          onClick={() => setMode("decode")}
        >
          HEX → ASCII
        </Button>
        {mode === "encode" && (
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Separator
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="h-7 rounded-md border bg-background px-1 text-xs"
            >
              <option value=" ">space</option>
              <option value="">none</option>
              <option value="-">-</option>
              <option value=":">:</option>
              <option value="\n">newline</option>
            </select>
          </label>
        )}
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Text" : "Hex"}
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Hello, DevToys!" : "48 65 6c 6c 6f 2c 20 44 65 76 54 6f 79 73 21"}
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Hex" : "Text"}
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

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs font-mono text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}
    </div>
  );
}
