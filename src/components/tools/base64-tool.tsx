"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import {
  ClearButton,
  SwapButton,
} from "@/components/devtoys/action-buttons";
import { ArrowLeftRight } from "lucide-react";

type Mode = "encode" | "decode";

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function decodeBase64(text: string): { ok: true; value: string } | { ok: false; error: string } {
  try {
    const bin = atob(text.trim());
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Invalid Base64 input",
    };
  }
}

export function Base64Tool() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback(
    (value: string, m: Mode) => {
      if (!value) {
        setOutput("");
        setError(null);
        return;
      }
      if (m === "encode") {
        setOutput(encodeBase64(value));
        setError(null);
      } else {
        const r = decodeBase64(value);
        if (r.ok) {
          setOutput(r.value);
          setError(null);
        } else {
          setOutput("");
          setError(r.error);
        }
      }
    },
    [],
  );

  // Live update
  React.useEffect(() => {
    run(input, mode);
  }, [input, mode, run]);

  const swap = () => {
    if (!output) return;
    const nextMode = mode === "encode" ? "decode" : "encode";
    setInput(output);
    setOutput("");
    setMode(nextMode);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
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
          UTF-8 safe · TextEncoder / TextDecoder
        </span>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Plain text" : "Base64"}
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ=="
            }
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Base64" : "Plain text"}
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
        <div className="flex items-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <ArrowLeftRight className="size-3.5" />
          <span className="font-mono">{error}</span>
        </div>
      )}
    </div>
  );
}
