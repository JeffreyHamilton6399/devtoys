"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

type SortMode = "alpha-asc" | "alpha-desc" | "numeric-asc" | "numeric-desc" | "length-asc" | "length-desc" | "shuffle" | "reverse";

const OPTIONS: { id: SortMode; label: string }[] = [
  { id: "alpha-asc", label: "A → Z" },
  { id: "alpha-desc", label: "Z → A" },
  { id: "numeric-asc", label: "0 → 9" },
  { id: "numeric-desc", label: "9 → 0" },
  { id: "length-asc", label: "Shortest first" },
  { id: "length-desc", label: "Longest first" },
  { id: "reverse", label: "Reverse" },
  { id: "shuffle", label: "Shuffle" },
];

function process(input: string, mode: SortMode, dedupe: boolean, trimWhitespace: boolean, caseSensitive: boolean): string {
  if (!input) return "";
  let lines = input.split(/\r?\n/);
  if (trimWhitespace) lines = lines.map((l) => l.trim());
  if (dedupe) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  const compare = (a: string, b: string): number => {
    switch (mode) {
      case "alpha-asc":
        return caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase());
      case "alpha-desc":
        return caseSensitive ? b.localeCompare(a) : b.toLowerCase().localeCompare(a.toLowerCase());
      case "numeric-asc":
        return (parseFloat(a) || 0) - (parseFloat(b) || 0);
      case "numeric-desc":
        return (parseFloat(b) || 0) - (parseFloat(a) || 0);
      case "length-asc":
        return a.length - b.length || a.localeCompare(b);
      case "length-desc":
        return b.length - a.length || a.localeCompare(b);
      default:
        return 0;
    }
  };
  switch (mode) {
    case "reverse":
      lines = [...lines].reverse();
      break;
    case "shuffle": {
      // Fisher-Yates with crypto.getRandomValues
      for (let i = lines.length - 1; i > 0; i--) {
        const j = (() => {
          const buf = new Uint32Array(1);
          crypto.getRandomValues(buf);
          return buf[0] % (i + 1);
        })();
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
      break;
    }
    default:
      lines = [...lines].sort(compare);
  }
  return lines.join("\n");
}

export function LineSorter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [mode, setMode] = React.useState<SortMode>("alpha-asc");
  const [dedupe, setDedupe] = React.useState(true);
  const [trimWhitespace, setTrimWhitespace] = React.useState(false);
  const [caseSensitive, setCaseSensitive] = React.useState(true);

  React.useEffect(() => {
    setOutput(process(input, mode, dedupe, trimWhitespace, caseSensitive));
  }, [input, mode, dedupe, trimWhitespace, caseSensitive]);

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const inputLines = input ? input.split(/\r?\n/).length : 0;
  const outputLines = output ? output.split(/\r?\n/).length : 0;
  const removed = inputLines - outputLines;

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-1.5">
        {OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            size="sm"
            variant={mode === opt.id ? "default" : "outline"}
            className="h-7 px-2 text-xs"
            onClick={() => setMode(opt.id)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={dedupe}
            onChange={(e) => setDedupe(e.target.checked)}
            className="size-3.5"
          />
          Remove duplicates
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={trimWhitespace}
            onChange={(e) => setTrimWhitespace(e.target.checked)}
            className="size-3.5"
          />
          Trim each line
        </label>
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="size-3.5"
          />
          Case-sensitive
        </label>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Input ({inputLines} lines)
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"banana\napple\ncherry\napple\nBanana\n123\n42\napple"}
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Output ({outputLines} lines{removed > 0 && <span className="text-emerald-600 dark:text-emerald-400"> · −{removed} removed</span>})
            </label>
            <CopyButton value={output} disabled={!output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Sorted and deduplicated lines will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
