"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";

function shift(text: string, n: number): string {
  // Only shift ASCII letters; leave everything else alone
  return text.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + n) % 26 + 26) % 26 + base);
  });
}

export function CaesarCipher() {
  const [input, setInput] = React.useState("");
  const [shiftN, setShiftN] = React.useState(13);

  const output = React.useMemo(() => shift(input, shiftN), [input, shiftN]);
  // The "decode" shift is the inverse
  const decodeShift = (26 - (shiftN % 26)) % 26;

  const clear = () => setInput("");

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Shift (encode)
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{shiftN}</span>
            <button
              onClick={() => setShiftN(13)}
              className="rounded border bg-background px-1.5 py-0.5 text-[10px] hover:bg-accent"
            >
              ROT13
            </button>
          </div>
        </div>
        <Slider
          value={[shiftN]}
          onValueChange={(v) => setShiftN(v[0])}
          min={0}
          max={25}
          step={1}
        />
        <p className="text-xs text-muted-foreground">
          To decode, use shift <span className="font-mono">{decodeShift}</span> (or just apply the same shift again for ROT13).
        </p>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">Plain text</label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hello, World!"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">Cipher text</label>
            <CopyButton value={output} disabled={!output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Uryyb, Jbeyq!"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
