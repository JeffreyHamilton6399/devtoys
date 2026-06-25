"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

type Mode = "chars" | "words" | "lines";

const MODES: { id: Mode; label: string }[] = [
  { id: "chars", label: "By characters" },
  { id: "words", label: "By words" },
  { id: "lines", label: "By lines" },
];

function reverse(text: string, mode: Mode): string {
  if (!text) return "";
  switch (mode) {
    case "chars":
      // Use spread to handle surrogate pairs and combining marks reasonably
      return Array.from(text).reverse().join("");
    case "words":
      return text.split(/(\s+)/).reverse().join("");
    case "lines":
      return text.split(/\r?\n/).reverse().join("\n");
  }
}

export function StringReverser() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("chars");
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    setOutput(reverse(input, mode));
  }, [input, mode]);

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {MODES.map((m) => (
          <Button
            key={m.id}
            size="sm"
            variant={mode === m.id ? "default" : "outline"}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">Input</label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type text to reverse…"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">Reversed</label>
            <CopyButton value={output} disabled={!output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Reversed text will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
