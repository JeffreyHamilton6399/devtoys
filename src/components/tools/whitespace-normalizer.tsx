"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

interface Options {
  collapseSpaces: boolean;
  trimLines: boolean;
  removeEmptyLines: boolean;
  toUnixEol: boolean;
  toWindowsEol: boolean;
  trimTrailing: boolean;
}

function normalize(text: string, opts: Options): string {
  let s = text;
  if (opts.toUnixEol) s = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (opts.toWindowsEol) s = s.replace(/\r\n|\r|\n/g, "\r\n");
  if (opts.trimTrailing) {
    const eol = opts.toWindowsEol ? "\r\n" : "\n";
    s = s.split(/\r?\n/).map((l) => l.replace(/\s+$/, "")).join(eol);
  }
  if (opts.trimLines) {
    s = s.split(/\r?\n/).map((l) => l.trim()).join(opts.toWindowsEol ? "\r\n" : "\n");
  }
  if (opts.removeEmptyLines) {
    s = s.split(/\r?\n/).filter((l) => l.trim().length > 0).join(opts.toWindowsEol ? "\r\n" : "\n");
  }
  if (opts.collapseSpaces) {
    s = s.replace(/[ \t]+/g, " ");
  }
  return s;
}

export function WhitespaceNormalizer() {
  const [input, setInput] = React.useState("");
  const [opts, setOpts] = React.useState<Options>({
    collapseSpaces: true,
    trimLines: true,
    removeEmptyLines: false,
    toUnixEol: true,
    toWindowsEol: false,
    trimTrailing: true,
  });
  const [output, setOutput] = React.useState("");

  React.useEffect(() => {
    setOutput(normalize(input, opts));
  }, [input, opts]);

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const toggle = (key: keyof Options) => (v: boolean) =>
    setOpts((p) => ({ ...p, [key]: v }));

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        {([
          ["collapseSpaces", "Collapse multiple spaces"],
          ["trimLines", "Trim each line"],
          ["removeEmptyLines", "Remove empty lines"],
          ["trimTrailing", "Trim trailing whitespace"],
          ["toUnixEol", "Unix LF line endings"],
          ["toWindowsEol", "Windows CRLF line endings"],
        ] as const).map(([key, label]) => (
          <label
            key={key}
            className={`flex cursor-pointer items-center gap-1.5 ${opts.toUnixEol && key === "toWindowsEol" ? "opacity-50" : ""} ${opts.toWindowsEol && key === "toUnixEol" ? "opacity-50" : ""}`}
          >
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={(e) => toggle(key)(e.target.checked)}
              className="size-3.5"
            />
            {label}
          </label>
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
            placeholder={"  paste   text   with   \n\n\n  messy  whitespace  \n  "}
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">Normalized</label>
            <CopyButton value={output} disabled={!output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Cleaned text will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
