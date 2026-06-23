"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { Braces, Minimize, CheckCircle2, AlertTriangle } from "lucide-react";

interface ParseResult {
  ok: boolean;
  output: string;
  error?: string;
}

function safeParse(input: string): ParseResult {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, output: "" };
  try {
    const parsed = JSON.parse(trimmed);
    return { ok: true, output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, output: "", error: msg };
  }
}

export function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [valid, setValid] = React.useState<boolean | null>(null);

  const format = () => {
    const r = safeParse(input);
    if (r.ok) {
      setOutput(r.output);
      setError(null);
      setValid(true);
    } else {
      setError(r.error ?? "Invalid JSON");
      setOutput("");
      setValid(false);
    }
  };

  const minify = () => {
    const r = safeParse(input);
    if (r.ok) {
      setOutput(JSON.stringify(JSON.parse(input.trim()), null, 0));
      setError(null);
      setValid(true);
    } else {
      setError(r.error ?? "Invalid JSON");
      setOutput("");
      setValid(false);
    }
  };

  const validate = () => {
    const r = safeParse(input);
    if (r.ok) {
      setError(null);
      setValid(true);
    } else {
      setError(r.error ?? "Invalid JSON");
      setValid(false);
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setValid(null);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Input
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"hello":"world","arr":[1,2,3]}'
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Output
            </label>
            <CopyButton value={output} disabled={!output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{error}</span>
        </div>
      )}
      {valid && !error && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5" />
          Valid JSON
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={format} disabled={!input}>
          <Braces className="size-3.5" />
          Format
        </Button>
        <Button size="sm" variant="outline" onClick={minify} disabled={!input}>
          <Minimize className="size-3.5" />
          Minify
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={validate}
          disabled={!input}
        >
          Validate
        </Button>
      </div>
    </div>
  );
}
