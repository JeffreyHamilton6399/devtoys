"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ClearButton } from "@/components/devtoys/action-buttons";

interface Stats {
  chars: number;
  charsNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  longestWord: string;
  avgWordLength: number;
  readingTimeMin: number;
  speakingTimeMin: number;
}

function compute(input: string): Stats {
  const trimmed = input.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) ?? (trimmed ? [trimmed] : [])).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((s) => s.trim()).length : 0;
  const lines = input ? input.split("\n").length : 0;
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const avgLen = words.length
    ? words.reduce((s, w) => s + w.length, 0) / words.length
    : 0;
  return {
    chars: input.length,
    charsNoSpaces: input.replace(/\s/g, "").length,
    words: words.length,
    sentences,
    paragraphs,
    lines,
    longestWord: longest,
    avgWordLength: Math.round(avgLen * 10) / 10,
    readingTimeMin: Math.max(words.length ? 1 : 0, Math.round(words.length / 200)),
    speakingTimeMin: Math.max(words.length ? 1 : 0, Math.round(words.length / 130)),
  };
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border bg-muted/30 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

export function TextStats() {
  const [input, setInput] = React.useState("");
  const stats = React.useMemo(() => compute(input), [input]);

  const clear = () => setInput("");

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Text</label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste any text — essays, code, articles, README files..."
          className="min-h-[120px] flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <StatCard label="Characters" value={stats.chars} />
        <StatCard label="No spaces" value={stats.charsNoSpaces} />
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard
          label="Reading time"
          value={`${stats.readingTimeMin}m`}
          sub="200 wpm"
        />
        <StatCard
          label="Speaking time"
          value={`${stats.speakingTimeMin}m`}
          sub="130 wpm"
        />
        <StatCard
          label="Avg word length"
          value={stats.avgWordLength}
          sub="chars"
        />
      </div>

      {stats.longestWord && (
        <div className="rounded-md border bg-muted/30 px-3 py-2 text-xs">
          <span className="text-muted-foreground">Longest word: </span>
          <span className="font-mono">{stats.longestWord}</span>
          <span className="text-muted-foreground"> ({stats.longestWord.length} chars)</span>
        </div>
      )}
    </div>
  );
}
