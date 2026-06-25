"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton, SwapButton } from "@/components/devtoys/action-buttons";

type Mode = "tabs-to-spaces" | "spaces-to-tabs";

function convert(text: string, mode: Mode, width: number): string {
  if (mode === "tabs-to-spaces") {
    return text.replace(/\t/g, " ".repeat(width));
  }
  // Spaces to tabs: convert runs of `width` spaces at line starts (and after tabs) to tabs
  // Simple approach: replace any run of N*width spaces with N tabs
  const tab = "\t";
  return text.replace(/( +)/g, (match) => {
    // Snap to multiple of width, but keep remainder as spaces
    const full = Math.floor(match.length / width);
    const rem = match.length % width;
    return tab.repeat(full) + " ".repeat(rem);
  });
}

export function TabSpaces() {
  const [mode, setMode] = React.useState<Mode>("tabs-to-spaces");
  const [input, setInput] = React.useState("");
  const [width, setWidth] = React.useState(2);
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    setOutput(convert(input, mode, width));
  }, [input, mode, width]);

  const swap = () => {
    if (!output) return;
    setMode((m) => (m === "tabs-to-spaces" ? "spaces-to-tabs" : "tabs-to-spaces"));
    setInput(output);
    setOutput("");
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={mode === "tabs-to-spaces" ? "default" : "outline"}
          onClick={() => setMode("tabs-to-spaces")}
        >
          Tabs → Spaces
        </Button>
        <Button
          size="sm"
          variant={mode === "spaces-to-tabs" ? "default" : "outline"}
          onClick={() => setMode("spaces-to-tabs")}
        >
          Spaces → Tabs
        </Button>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Tab width</Label>
          <Input
            type="number"
            min={1}
            max={16}
            value={width}
            onChange={(e) => setWidth(Math.max(1, Math.min(16, Number(e.target.value) || 1)))}
            className="h-7 w-16 text-xs"
          />
        </div>
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
            placeholder={"\tindent\n\t\tmore indent"}
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">Output</label>
            <div className="flex items-center gap-1">
              <SwapButton onSwap={swap} disabled={!output} />
              <CopyButton value={output} disabled={!output} />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Converted text will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
