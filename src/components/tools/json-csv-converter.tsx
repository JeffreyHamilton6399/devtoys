"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton, SwapButton } from "@/components/devtoys/action-buttons";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

type Mode = "json-to-csv" | "csv-to-json";

// ---------- JSON → CSV ----------
function jsonToCsv(jsonStr: string): { ok: true; csv: string } | { ok: false; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }
  if (!Array.isArray(data)) {
    return { ok: false, error: "Top-level JSON must be an array of objects." };
  }
  if (data.length === 0) {
    return { ok: true, csv: "" };
  }
  // Collect all unique keys across all objects, preserving first-seen order
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const row of data) {
    if (typeof row !== "object" || row === null || Array.isArray(row)) {
      return { ok: false, error: "Each array element must be an object." };
    }
    for (const k of Object.keys(row as Record<string, unknown>)) {
      if (!seen.has(k)) {
        seen.add(k);
        keys.push(k);
      }
    }
  }
  const escapeCell = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    let s: string;
    if (typeof v === "object") s = JSON.stringify(v);
    else s = String(v);
    if (/[",\n\r]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [keys.map(escapeCell).join(",")];
  for (const row of data) {
    const r = row as Record<string, unknown>;
    lines.push(keys.map((k) => escapeCell(r[k])).join(","));
  }
  return { ok: true, csv: lines.join("\n") };
}

// ---------- CSV → JSON ----------
function csvToJson(csv: string): { ok: true; json: string } | { ok: false; error: string } {
  if (!csv.trim()) return { ok: true, json: "[]" };
  try {
    const rows = parseCsv(csv);
    if (rows.length === 0) return { ok: true, json: "[]" };
    const [header, ...body] = rows;
    const result = body.map((row) => {
      const obj: Record<string, string> = {};
      header.forEach((key, i) => {
        obj[key] = row[i] ?? "";
      });
      return obj;
    });
    return { ok: true, json: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid CSV" };
  }
}

// Minimal RFC-4180-ish CSV parser supporting quoted cells and escaped quotes
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(cell);
      cell = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i++;
      continue;
    }
    cell += c;
    i++;
  }
  // Last cell/row
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 0 && !(r.length === 1 && r[0] === ""));
}

export function JsonCsvConverter() {
  const [mode, setMode] = React.useState<Mode>("json-to-csv");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    const r = mode === "json-to-csv" ? jsonToCsv(input) : csvToJson(input);
    if (r.ok) {
      setOutput(mode === "json-to-csv" ? r.csv : r.json);
      setError(null);
    } else {
      setOutput("");
      setError(r.error);
    }
  }, [input, mode]);

  const swap = () => {
    if (!output) return;
    setMode((m) => (m === "json-to-csv" ? "csv-to-json" : "json-to-csv"));
    setInput(output);
    setOutput("");
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const sampleJson = `[
  { "name": "Alice", "age": 30, "role": "admin" },
  { "name": "Bob", "age": 25, "role": "user" },
  { "name": "Carol, Jr.", "age": 41, "role": "user" }
]`;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={mode === "json-to-csv" ? "default" : "outline"}
          onClick={() => setMode("json-to-csv")}
        >
          JSON → CSV
        </Button>
        <Button
          size="sm"
          variant={mode === "csv-to-json" ? "default" : "outline"}
          onClick={() => setMode("csv-to-json")}
        >
          CSV → JSON
        </Button>
        <span className="text-xs text-muted-foreground">
          RFC-4180 quoted fields supported
        </span>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "json-to-csv" ? "JSON (array of objects)" : "CSV"}
            </label>
            <div className="flex items-center gap-1">
              {mode === "json-to-csv" && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setInput(sampleJson)}
                  className="h-7 text-xs"
                >
                  Sample
                </Button>
              )}
              <ClearButton onClear={clear} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "json-to-csv"
                ? '[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]'
                : "name,age\nAlice,30\nBob,25"
            }
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              {mode === "json-to-csv" ? "CSV" : "JSON"}
            </label>
            <div className="flex items-center gap-1">
              <SwapButton onSwap={swap} disabled={!output} />
              <CopyButton value={output} disabled={!output} />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Converted output will appear here"
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{error}</span>
        </div>
      )}
    </div>
  );
}
