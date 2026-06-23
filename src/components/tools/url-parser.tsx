"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { AlertTriangle } from "lucide-react";

interface ParsedUrl {
  href: string;
  protocol: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: [string, string][];
}

function parse(raw: string): ParsedUrl | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // URL() requires a protocol; auto-prepend // if missing
  let candidate = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate) && !candidate.startsWith("//")) {
    candidate = "https://" + candidate;
  }
  try {
    const u = new URL(candidate);
    const params: [string, string][] = [];
    u.searchParams.forEach((v, k) => params.push([k, v]));
    return {
      href: u.href,
      protocol: u.protocol,
      username: u.username,
      password: u.password,
      host: u.host,
      hostname: u.hostname,
      port: u.port,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      params,
    };
  } catch {
    return null;
  }
}

export function UrlParser() {
  const [input, setInput] = React.useState("");
  const [parsed, setParsed] = React.useState<ParsedUrl | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!input.trim()) {
      setParsed(null);
      setError(null);
      return;
    }
    const p = parse(input);
    if (p) {
      setParsed(p);
      setError(null);
    } else {
      setParsed(null);
      setError("Could not parse URL. Make sure it includes a host (e.g. example.com).");
    }
  }, [input]);

  const clear = () => {
    setInput("");
    setParsed(null);
    setError(null);
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">URL</label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://user:pass@example.com:8080/path/to/page?q=hello&lang=en&sort=desc#section-1"
          className="min-h-[64px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{error}</span>
        </div>
      )}

      {parsed && (
        <div className="flex flex-col gap-2">
          <Field label="Protocol" value={parsed.protocol} />
          <Field label="Origin" value={parsed.origin} />
          <Field label="Username" value={parsed.username || "—"} mono={!parsed.username} />
          <Field label="Password" value={parsed.password ? "••••••" : "—"} mono={!parsed.password} />
          <Field label="Host" value={parsed.host} />
          <Field label="Hostname" value={parsed.hostname} />
          <Field label="Port" value={parsed.port || "—"} mono={!parsed.port} />
          <Field label="Pathname" value={parsed.pathname || "/"} />
          <Field label="Hash" value={parsed.hash || "—"} mono={!parsed.hash} />

          {/* Query params */}
          <div className="rounded-md border bg-muted/30 p-2">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Query params {parsed.params.length ? `(${parsed.params.length})` : ""}
              </span>
            </div>
            {parsed.params.length === 0 ? (
              <p className="text-xs text-muted-foreground">No query parameters.</p>
            ) : (
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-2 py-1 font-medium text-muted-foreground">Key</th>
                      <th className="px-2 py-1 font-medium text-muted-foreground">Value</th>
                      <th className="w-10 px-2 py-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.params.map(([k, v], i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1 font-mono text-emerald-700 dark:text-emerald-400">{k}</td>
                        <td className="break-all px-2 py-1 font-mono">{v}</td>
                        <td className="px-2 py-1 text-right">
                          <CopyButton value={v} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Field label="Full URL" value={parsed.href} />
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-1.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span className={`truncate text-right text-xs ${mono ? "font-mono" : "font-mono"} ${value === "—" ? "text-muted-foreground" : ""}`}>
          {value}
        </span>
        {value !== "—" && <CopyButton value={value} />}
      </div>
    </div>
  );
}
