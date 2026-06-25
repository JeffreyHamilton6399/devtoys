"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { KeyRound, RefreshCw, Layers } from "lucide-react";
import { WORDLIST } from "@/lib/devtoys/wordlist";

function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

interface Options {
  count: number;
  separator: string;
  capitalize: boolean;
  number: boolean;
  numberAtEnd: boolean;
}

function generate(opts: Options): string {
  const words: string[] = [];
  for (let i = 0; i < opts.count; i++) {
    let w = WORDLIST[secureRandomInt(WORDLIST.length)];
    if (opts.capitalize) w = w.charAt(0).toUpperCase() + w.slice(1);
    words.push(w);
  }
  let result = words.join(opts.separator);
  if (opts.number) {
    const n = secureRandomInt(10000);
    result = opts.numberAtEnd
      ? `${result}${opts.separator}${String(n).padStart(4, "0")}`
      : `${String(n).padStart(4, "0")}${opts.separator}${result}`;
  }
  return result;
}

function entropyBits(count: number, withNumber: boolean): number {
  const wordBits = Math.log2(WORDLIST.length) * count;
  const numBits = withNumber ? Math.log2(10000) : 0;
  return Math.round(wordBits + numBits);
}

export function PassphraseGenerator() {
  const [opts, setOpts] = React.useState<Options>({
    count: 4,
    separator: "-",
    capitalize: true,
    number: false,
    numberAtEnd: true,
  });
  const [current, setCurrent] = React.useState("");
  const [batch, setBatch] = React.useState("");

  const gen = React.useCallback(() => {
    setCurrent(generate(opts));
  }, [opts]);

  React.useEffect(() => {
    gen();
  }, [gen]);

  const genBatch = (n: number) => {
    setBatch(Array.from({ length: n }, () => generate(opts)).join("\n"));
  };

  const bits = entropyBits(opts.count, opts.number);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      {/* Current passphrase */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Passphrase</label>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={gen}>
              <RefreshCw className="size-3.5" />
              Regenerate
            </Button>
            <CopyButton value={current} disabled={!current} />
          </div>
        </div>
        <Input
          value={current}
          readOnly
          className="font-mono text-sm"
          placeholder="Click regenerate"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>~{bits} bits of entropy · {WORDLIST.length} word list</span>
          <span className="font-mono">{current.length} chars</span>
        </div>
      </div>

      {/* Word count */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Words</Label>
          <span className="font-mono text-xs text-muted-foreground">{opts.count}</span>
        </div>
        <Slider
          value={[opts.count]}
          onValueChange={(v) => setOpts((p) => ({ ...p, count: v[0] }))}
          min={3}
          max={10}
          step={1}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Separator</Label>
          <Input
            value={opts.separator}
            onChange={(e) => setOpts((p) => ({ ...p, separator: e.target.value.slice(0, 3) }))}
            className="h-8 text-xs font-mono"
            maxLength={3}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Add number</Label>
          <select
            value={opts.number ? (opts.numberAtEnd ? "end" : "start") : "none"}
            onChange={(e) =>
              setOpts((p) => ({
                ...p,
                number: e.target.value !== "none",
                numberAtEnd: e.target.value === "end",
              }))
            }
            className="h-8 rounded-md border bg-background px-2 text-xs"
          >
            <option value="none">None</option>
            <option value="end">At end</option>
            <option value="start">At start</option>
          </select>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={opts.capitalize}
          onChange={(e) => setOpts((p) => ({ ...p, capitalize: e.target.checked }))}
          className="size-3.5"
        />
        Capitalize each word
      </label>

      {/* Batch */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Batch generate</label>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => genBatch(10)}>
              <Layers className="size-3.5" />
              x10
            </Button>
            <Button size="sm" variant="outline" onClick={() => genBatch(50)}>
              <Layers className="size-3.5" />
              x50
            </Button>
          </div>
        </div>
        <Textarea
          value={batch}
          readOnly
          placeholder="Click x10 / x50 to batch generate"
          className="min-h-[80px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        {batch && (
          <div className="flex justify-end">
            <CopyButton value={batch} />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        <KeyRound className="mr-1 inline size-3" />
        Uses crypto.getRandomValues — cryptographically secure. Wordlist has {WORDLIST.length} common English words.
      </p>
    </div>
  );
}
