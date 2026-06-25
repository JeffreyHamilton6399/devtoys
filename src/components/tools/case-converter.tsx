"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

// ---------- case conversions ----------
function splitWords(s: string): string[] {
  // Handle camelCase, snake_case, kebab-case, PascalCase, SCREAMING_SNAKE
  // and plain space/punctuation separated
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // camelCase → camel Case
    .replace(/[_\-\.]+/g, " ") // separators → space
    .replace(/[^a-zA-Z0-9\s]/g, " ") // strip other punct
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const cases = [
  {
    id: "camel",
    label: "camelCase",
    fn: (words: string[]) =>
      words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join(""),
  },
  {
    id: "pascal",
    label: "PascalCase",
    fn: (words: string[]) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
  },
  {
    id: "snake",
    label: "snake_case",
    fn: (words: string[]) => words.map((w) => w.toLowerCase()).join("_"),
  },
  {
    id: "kebab",
    label: "kebab-case",
    fn: (words: string[]) => words.map((w) => w.toLowerCase()).join("-"),
  },
  {
    id: "screaming",
    label: "SCREAMING_SNAKE",
    fn: (words: string[]) => words.map((w) => w.toUpperCase()).join("_"),
  },
  {
    id: "dot",
    label: "dot.case",
    fn: (words: string[]) => words.map((w) => w.toLowerCase()).join("."),
  },
  {
    id: "title",
    label: "Title Case",
    fn: (words: string[]) =>
      words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
  },
  {
    id: "sentence",
    label: "Sentence case",
    fn: (words: string[]) => {
      if (!words.length) return "";
      const lower = words.map((w) => w.toLowerCase());
      lower[0] = lower[0].charAt(0).toUpperCase() + lower[0].slice(1);
      return lower.join(" ");
    },
  },
  {
    id: "lower",
    label: "lowercase",
    fn: (words: string[]) => words.join(" ").toLowerCase(),
  },
  {
    id: "upper",
    label: "UPPERCASE",
    fn: (words: string[]) => words.join(" ").toUpperCase(),
  },
];

export function CaseConverter() {
  const [input, setInput] = React.useState("");

  const words = React.useMemo(() => splitWords(input), [input]);

  const clear = () => setInput("");

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Input</label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste any text — camelCase, snake_case, kebab-case, or plain words..."
          className="min-h-[80px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Conversions</span>
        <div className="flex flex-col gap-1.5">
          {cases.map((c) => {
            const value = words.length ? c.fn(words) : "";
            return (
              <div
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-1.5"
              >
                <div className="flex min-w-0 flex-1 items-baseline gap-2">
                  <span className="w-28 shrink-0 text-xs text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="truncate font-mono text-xs">
                    {value || <span className="text-muted-foreground">—</span>}
                  </span>
                </div>
                <CopyButton value={value} disabled={!value} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
