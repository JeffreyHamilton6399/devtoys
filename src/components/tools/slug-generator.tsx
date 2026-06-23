"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { Label } from "@/components/ui/label";

function slugify(text: string, separator: string, lower: boolean): string {
  let s = text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // strip diacritics
  if (lower) s = s.toLowerCase();
  s = s.replace(/[^a-zA-Z0-9\s-_]/g, ""); // strip non-alphanumerics (keep spaces, dashes, underscores)
  s = s.replace(/[\s_]+/g, separator); // spaces + underscores → separator
  s = s.replace(new RegExp(`\\${separator}+`, "g"), separator); // collapse repeated
  s = s.replace(new RegExp(`^\\${separator}+|\\${separator}+$`, "g"), ""); // trim
  return s;
}

export function SlugGenerator() {
  const [input, setInput] = React.useState("");
  const [separator, setSeparator] = React.useState("-");
  const [lower, setLower] = React.useState(true);

  const output = React.useMemo(
    () => slugify(input, separator, lower),
    [input, separator, lower],
  );

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
          placeholder="Hello World! This is a Test — café, naïve, über cool"
          className="min-h-[80px] resize-none bg-muted/40 text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Label className="text-xs text-muted-foreground">Separator</Label>
          <Input
            value={separator}
            onChange={(e) => setSeparator(e.target.value.slice(0, 1) || "-")}
            className="h-7 w-12 font-mono text-xs"
            maxLength={1}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={lower}
            onChange={(e) => setLower(e.target.checked)}
            className="size-3.5"
          />
          Lowercase
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Slug</label>
          <CopyButton value={output} disabled={!output} />
        </div>
        <Input
          value={output}
          readOnly
          placeholder="hello-world-this-is-a-test-cafe-naive-uber-cool"
          className="font-mono text-xs"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Unicode-aware: strips diacritics (café → cafe, naïve → naive, über → uber), removes special chars, collapses repeated separators.
      </p>
    </div>
  );
}
