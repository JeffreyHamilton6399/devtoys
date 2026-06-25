"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { diffLines, diffWords } from "diff";

type DiffMode = "line" | "word";

export function DiffChecker() {
  const [original, setOriginal] = React.useState("");
  const [changed, setChanged] = React.useState("");
  const [mode, setMode] = React.useState<DiffMode>("line");

  const parts = React.useMemo(() => {
    if (!original && !changed) return [];
    return mode === "line"
      ? diffLines(original, changed)
      : diffWords(original, changed);
  }, [original, changed, mode]);

  const stats = React.useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const p of parts) {
      const lines = p.value.split("\n");
      // Ignore trailing empty line from split
      const count = lines[lines.length - 1] === "" ? lines.length - 1 : lines.length;
      if (p.added) added += mode === "line" ? count : p.value.length;
      else if (p.removed) removed += mode === "line" ? count : p.value.length;
    }
    if (mode === "word") {
      added = parts.filter((p) => p.added).reduce((s, p) => s + p.value.split(/\s+/).filter(Boolean).length, 0);
      removed = parts.filter((p) => p.removed).reduce((s, p) => s + p.value.split(/\s+/).filter(Boolean).length, 0);
    }
    return { added, removed };
  }, [parts, mode]);

  const copyDiff = React.useMemo(() => {
    return parts
      .map((p) => {
        const prefix = p.added ? "+ " : p.removed ? "- " : "  ";
        return p.value
          .split("\n")
          .map((l) => (l === "" ? "" : prefix + l))
          .join("\n");
      })
      .join("\n")
      .trimEnd();
  }, [parts]);

  const clear = () => {
    setOriginal("");
    setChanged("");
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode("line")}
          className={`rounded-md px-2 py-1 text-xs ${
            mode === "line"
              ? "bg-primary text-primary-foreground"
              : "border bg-background"
          }`}
        >
          Line diff
        </button>
        <button
          onClick={() => setMode("word")}
          className={`rounded-md px-2 py-1 text-xs ${
            mode === "word"
              ? "bg-primary text-primary-foreground"
              : "border bg-background"
          }`}
        >
          Word diff
        </button>
        {(stats.added > 0 || stats.removed > 0) && (
          <span className="text-xs text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-400">
              +{stats.added} {mode === "line" ? "lines" : "words"} added
            </span>
            {" · "}
            <span className="text-rose-600 dark:text-rose-400">
              −{stats.removed} {mode === "line" ? "lines" : "words"} removed
            </span>
          </span>
        )}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-2">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Original
            </label>
            <ClearButton onClear={clear} disabled={!original && !changed} />
          </div>
          <Textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Original text..."
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Changed
            </label>
          </div>
          <Textarea
            value={changed}
            onChange={(e) => setChanged(e.target.value)}
            placeholder="Changed text..."
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 overflow-hidden" style={{ flex: "1 1 0", minHeight: "80px" }}>
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">Diff</label>
          <CopyButton value={copyDiff} disabled={!parts.length} />
        </div>
        <div className="flex-1 overflow-auto rounded-md border bg-muted/20 p-2">
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed">
            {parts.length === 0 ? (
              <span className="text-muted-foreground">Differences will appear here...</span>
            ) : (
              mode === "line" ? (
                parts.map((p, i) => {
                  const lines = p.value.split("\n");
                  // Drop trailing empty line
                  if (lines[lines.length - 1] === "") lines.pop();
                  return lines.map((l, j) => (
                    <span
                      key={`${i}-${j}`}
                      className={
                        p.added
                          ? "block bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : p.removed
                          ? "block bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "block"
                      }
                    >
                      {p.added ? "+ " : p.removed ? "− " : "  "}
                      {l || "\u00A0"}
                    </span>
                  ));
                })
              ) : (
                parts.map((p, i) => (
                  <span
                    key={i}
                    className={
                      p.added
                        ? "bg-emerald-500/25 text-emerald-700 dark:text-emerald-300"
                        : p.removed
                        ? "bg-rose-500/25 text-rose-700 dark:text-rose-300 line-through"
                        : ""
                    }
                  >
                    {p.value}
                  </span>
                ))
              )
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
