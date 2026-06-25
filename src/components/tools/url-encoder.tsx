"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import {
  ClearButton,
  SwapButton,
} from "@/components/devtoys/action-buttons";

type Mode = "encode" | "decode";

export function UrlEncoder() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!input) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
        setError(null);
      } else {
        setOutput(decodeURIComponent(input));
        setError(null);
      }
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Invalid input");
    }
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
          encodeURIComponent / decodeURIComponent
        </span>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Plain text / URL" : "Encoded URL"}
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "https://example.com/?q=hello world&lang=en"
                : "https%3A%2F%2Fexample.com%2F%3Fq%3Dhello%20world%26lang%3Den"
            }
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "encode" ? "Encoded URL" : "Decoded URL"}
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
