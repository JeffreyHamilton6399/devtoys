"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton, SwapButton } from "@/components/devtoys/action-buttons";

type Mode = "escape" | "unescape";
type Format = "json" | "regex" | "html" | "sql" | "shell";

const FORMATS: { id: Format; label: string }[] = [
  { id: "json", label: "JSON string" },
  { id: "regex", label: "Regex literal" },
  { id: "html", label: "HTML" },
  { id: "sql", label: "SQL string" },
  { id: "shell", label: "Shell / Bash" },
];

// ---------- escape functions ----------
function escapeJson(s: string): string {
  // JSON.stringify wraps in quotes; slice them off for raw escaped string
  return JSON.stringify(s).slice(1, -1);
}
function unescapeJson(s: string): { ok: true; value: string } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse('"' + s + '"');
    return { ok: true, value: parsed };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON escape" };
  }
}

const REGEX_SPECIAL = /[$.*+?^()|[\]{}\\]/g;
function escapeRegex(s: string): string {
  return s.replace(REGEX_SPECIAL, "\\$&");
}
function unescapeRegex(s: string): string {
  return s.replace(/\\(.)/g, "$1");
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}
function unescapeHtml(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

const SQL_ESCAPES: Record<string, string> = {
  "'": "''",
  "\\": "\\\\",
};
function escapeSql(s: string): string {
  return s.replace(/['\\]/g, (c) => SQL_ESCAPES[c]);
}
function unescapeSql(s: string): string {
  return s.replace(/\\(.)/g, "$1").replace(/''/g, "'");
}

const SHELL_SPECIAL = /[\s"'`$\\|&;<>(){}\[!#*?~]/;
function escapeShell(s: string): string {
  // Use single-quote wrapping, escape any embedded single quotes
  return "'" + s.replace(/'/g, "'\\''") + "'";
}
function unescapeShell(s: string): string {
  // Best-effort: unwrap outer single quotes, undo '\'' sequences
  let out = s.trim();
  if (out.startsWith("'") && out.endsWith("'")) {
    out = out.slice(1, -1);
  }
  return out.replace(/'\\''/g, "'");
}

function run(input: string, mode: Mode, format: Format): { ok: true; value: string } | { ok: false; error: string } {
  if (!input) return { ok: true, value: "" };
  try {
    if (mode === "escape") {
      switch (format) {
        case "json": return { ok: true, value: escapeJson(input) };
        case "regex": return { ok: true, value: escapeRegex(input) };
        case "html": return { ok: true, value: escapeHtml(input) };
        case "sql": return { ok: true, value: escapeSql(input) };
        case "shell": return { ok: true, value: escapeShell(input) };
      }
    } else {
      switch (format) {
        case "json": return unescapeJson(input);
        case "regex": return { ok: true, value: unescapeRegex(input) };
        case "html": return { ok: true, value: unescapeHtml(input) };
        case "sql": return { ok: true, value: unescapeSql(input) };
        case "shell": return { ok: true, value: unescapeShell(input) };
      }
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
  return { ok: true, value: "" };
}

export function StringEscape() {
  const [mode, setMode] = React.useState<Mode>("escape");
  const [format, setFormat] = React.useState<Format>("json");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const r = run(input, mode, format);
    if (r.ok) {
      setOutput(r.value);
      setError(null);
    } else {
      setOutput("");
      setError(r.error);
    }
  }, [input, mode, format]);

  const swap = () => {
    if (!output) return;
    setMode((m) => (m === "escape" ? "unescape" : "escape"));
    setInput(output);
    setOutput("");
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Format picker */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FORMATS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={format === f.id ? "default" : "outline"}
            className="h-7 px-2 text-xs"
            onClick={() => setFormat(f.id)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={mode === "escape" ? "default" : "outline"}
          onClick={() => setMode("escape")}
        >
          Escape
        </Button>
        <Button
          size="sm"
          variant={mode === "unescape" ? "default" : "outline"}
          onClick={() => setMode("unescape")}
        >
          Unescape
        </Button>
        <span className="text-xs text-muted-foreground">
          {mode === "escape" ? "Raw → escaped" : "Escaped → raw"}
        </span>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "escape" ? "Raw input" : "Escaped input"}
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "escape"
                ? format === "json"
                  ? 'Tom said "hi" and left\nNew line here'
                  : "Paste raw text..."
                : "Paste escaped string..."
            }
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "escape" ? "Escaped output" : "Raw output"}
            </label>
            <div className="flex items-center gap-1">
              <SwapButton onSwap={swap} disabled={!output} />
              <CopyButton value={output} disabled={!output} />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Output will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs font-mono text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}
    </div>
  );
}
