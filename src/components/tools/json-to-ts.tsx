"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { AlertTriangle, FileCode2 } from "lucide-react";

// ---------- JSON → TypeScript interface generator ----------
interface FieldInfo {
  name: string;
  type: string;
  optional: boolean;
}

function getTypeName(value: unknown, fieldName: string, generated: Map<string, string>): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const elemTypes = value.map((v) => getTypeName(v, fieldName, generated));
    const unique = Array.from(new Set(elemTypes));
    if (unique.length === 1) return `${unique[0]}[]`;
    return `(${unique.join(" | ")})[]`;
  }
  const t = typeof value;
  if (t === "string") return "string";
  if (t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "object" && value !== null) {
    // Generate interface name from field name
    const ifaceName = toPascalCase(singularize(fieldName));
    generateInterface(value as Record<string, unknown>, ifaceName, generated);
    return ifaceName;
  }
  return "unknown";
}

function generateInterface(
  obj: Record<string, unknown>,
  name: string,
  generated: Map<string, string>,
): void {
  if (generated.has(name)) return;

  const fields: FieldInfo[] = [];
  // Detect optional fields by comparing with sibling arrays elsewhere — for simplicity, mark all required
  for (const [key, val] of Object.entries(obj)) {
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
    let type: string;
    let optional = false;
    if (val === undefined || val === null) {
      type = "null";
      optional = true;
    } else {
      type = getTypeName(val, key, generated);
    }
    fields.push({ name: safeKey, type, optional });
  }

  const lines: string[] = [`export interface ${name} {`];
  for (const f of fields) {
    lines.push(`  ${f.name}${f.optional ? "?" : ""}: ${f.type};`);
  }
  lines.push("}");
  generated.set(name, lines.join("\n"));
}

function toPascalCase(s: string): string {
  if (!s) return "Root";
  const parts = s.replace(/[^a-zA-Z0-9]+/g, " ").trim().split(/\s+/);
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join("");
}

function singularize(s: string): string {
  if (!s) return "Item";
  if (s.endsWith("ies")) return s.slice(0, -3) + "y";
  if (s.endsWith("ses")) return s.slice(0, -2);
  if (s.endsWith("s") && !s.endsWith("ss")) return s.slice(0, -1);
  return s;
}

export function jsonToTypescript(json: string): { ok: true; output: string } | { ok: false; error: string } {
  const trimmed = json.trim();
  if (!trimmed) return { ok: false, error: "Empty input" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid JSON" };
  }

  const generated = new Map<string, string>();
  let rootType: string;

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return { ok: true, output: "export type Root = unknown[];" };
    }
    // For top-level arrays, generate RootItem interface(s) and Root = RootItem[]
    const elemTypes = parsed.map((v, i) => getTypeName(v, `RootItem${i}`, generated));
    const unique = Array.from(new Set(elemTypes));
    const rootType = unique.length === 1 ? `${unique[0]}[]` : `(${unique.join(" | ")})[]`;
    const output = [
      `export type Root = ${rootType};`,
      "",
      ...Array.from(generated.values()),
    ].join("\n\n");
    return { ok: true, output };
  }

  if (typeof parsed === "object" && parsed !== null) {
    generateInterface(parsed as Record<string, unknown>, "Root", generated);
    const output = Array.from(generated.values()).join("\n\n");
    return { ok: true, output };
  }

  // Primitive root
  return { ok: true, output: `export type Root = ${typeof parsed};` };
}

export function JsonToTs() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const generate = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    const r = jsonToTypescript(input);
    if (r.ok) {
      setOutput(r.output);
      setError(null);
    } else {
      setOutput("");
      setError(r.error);
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">JSON</label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"user":{"name":"DevToys","tags":["a","b"]},"count":12}'
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">TypeScript</label>
            <CopyButton value={output} disabled={!output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Generated TS interfaces will appear here"
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

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={generate} disabled={!input}>
          <FileCode2 className="size-3.5" />
          Generate Types
        </Button>
      </div>
    </div>
  );
}
