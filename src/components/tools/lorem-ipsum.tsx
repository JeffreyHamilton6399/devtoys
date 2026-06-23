"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";

const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam " +
  "quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
  "consequat duis aute irure in reprehenderit voluptate velit esse cillum " +
  "dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non " +
  "proident sunt culpa qui officia deserunt mollit anim id est laborum"
).split(" ");

function rand(n: number) {
  return Math.floor(Math.random() * n);
}

function makeSentence(): string {
  const len = 8 + rand(8);
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    words.push(WORDS[rand(WORDS.length)]);
  }
  let s = words.join(" ");
  s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
  return s;
}

function makeParagraph(): string {
  const len = 4 + rand(4);
  return Array.from({ length: len }, makeSentence).join(" ");
}

type Unit = "paragraphs" | "sentences" | "words";

export function LoremIpsum() {
  const [unit, setUnit] = React.useState<Unit>("paragraphs");
  const [output, setOutput] = React.useState("");

  const generate = (count: number) => {
    let result = "";
    if (unit === "paragraphs") {
      result = Array.from({ length: count }, makeParagraph).join("\n\n");
    } else if (unit === "sentences") {
      result = Array.from({ length: count }, makeSentence).join(" ");
    } else {
      const arr: string[] = [];
      for (let i = 0; i < count; i++) arr.push(WORDS[rand(WORDS.length)]);
      result = arr.join(" ");
    }
    setOutput(result);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {(["paragraphs", "sentences", "words"] as Unit[]).map((u) => (
          <Button
            key={u}
            size="sm"
            variant={unit === u ? "default" : "outline"}
            onClick={() => setUnit(u)}
          >
            {u.charAt(0).toUpperCase() + u.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => generate(1)}>
          x1
        </Button>
        <Button size="sm" variant="outline" onClick={() => generate(3)}>
          x3
        </Button>
        <Button size="sm" variant="outline" onClick={() => generate(5)}>
          x5
        </Button>
        <Button size="sm" variant="outline" onClick={() => generate(10)}>
          x10
        </Button>
        <span className="text-xs text-muted-foreground">Classic lorem ipsum</span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Output
          </label>
          <CopyButton value={output} disabled={!output} />
        </div>
        <Textarea
          value={output}
          readOnly
          placeholder="Generated lorem ipsum will appear here"
          className="flex-1 resize-none bg-muted/40 text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
