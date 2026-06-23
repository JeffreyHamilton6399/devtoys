"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface Match {
  text: string;
  index: number;
  groups: string[];
}

export function RegexTester() {
  const [pattern, setPattern] = React.useState("");
  const [flags, setFlags] = React.useState({
    g: true,
    i: false,
    m: false,
    s: false,
  });
  const [testText, setTestText] = React.useState("");
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }
    let flagStr = "";
    if (flags.g) flagStr += "g";
    if (flags.i) flagStr += "i";
    if (flags.m) flagStr += "m";
    if (flags.s) flagStr += "s";

    try {
      const re = new RegExp(pattern, flagStr);
      const found: Match[] = [];
      if (flags.g) {
        let m: RegExpExecArray | null;
        let safety = 0;
        while ((m = re.exec(testText)) !== null && safety < 5000) {
          found.push({
            text: m[0],
            index: m.index,
            groups: m.slice(1).map((g) => g ?? ""),
          });
          if (m.index === re.lastIndex) re.lastIndex++;
          safety++;
        }
      } else {
        const m = re.exec(testText);
        if (m) {
          found.push({
            text: m[0],
            index: m.index,
            groups: m.slice(1).map((g) => g ?? ""),
          });
        }
      }
      setMatches(found);
      setError(null);
    } catch (e) {
      setMatches([]);
      setError(e instanceof Error ? e.message : "Invalid regex");
    }
  }, [pattern, flags, testText]);

  // Build highlighted output
  const highlighted = React.useMemo(() => {
    if (!matches.length || !testText) return null;
    const parts: { text: string; match: boolean }[] = [];
    let last = 0;
    for (const m of matches) {
      if (m.index > last) {
        parts.push({ text: testText.slice(last, m.index), match: false });
      }
      parts.push({ text: m.text, match: true });
      last = m.index + m.text.length;
    }
    if (last < testText.length) {
      parts.push({ text: testText.slice(last), match: false });
    }
    return parts;
  }, [matches, testText]);

  const flagList = (["g", "i", "m", "s"] as const).map((f) => ({
    key: f,
    label: f,
    checked: flags[f],
    onChange: (v: boolean) => setFlags((prev) => ({ ...prev, [f]: v })),
  }));

  const copyMatchesText = React.useMemo(() => {
    return matches
      .map(
        (m, i) =>
          `#${i + 1} @${m.index}: ${JSON.stringify(m.text)}${
            m.groups.length ? `  groups: ${JSON.stringify(m.groups)}` : ""
          }`,
      )
      .join("\n");
  }, [matches]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Regular expression
        </label>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border bg-muted/40 px-2 font-mono text-xs text-muted-foreground">
            /
          </div>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\b(\\w+)@(\\w+\\.\\w+)\\b"
            className="font-mono text-xs"
            spellCheck={false}
          />
          <div className="flex items-center rounded-md border bg-muted/40 px-2 font-mono text-xs text-muted-foreground">
            /{flags.g ? "g" : ""}{flags.i ? "i" : ""}{flags.m ? "m" : ""}{flags.s ? "s" : ""}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {flagList.map((f) => (
            <label
              key={f.key}
              className="flex cursor-pointer items-center gap-1.5 text-xs"
            >
              <Checkbox
                checked={f.checked}
                onCheckedChange={(v) => f.onChange(v === true)}
                className="size-3.5"
              />
              <span className="font-mono">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Test text
          </label>
          <ClearButton onClear={() => setTestText("")} disabled={!testText} />
        </div>
        <Textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Paste text to test against..."
          className="min-h-[80px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {matches.length} match{matches.length === 1 ? "" : "es"}
        </span>
        <CopyButton value={copyMatchesText} disabled={!matches.length} />
      </div>

      {highlighted && (
        <div className="rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
          <pre className="whitespace-pre-wrap break-words font-mono">
            {highlighted.map((p, i) =>
              p.match ? (
                <mark
                  key={i}
                  className="rounded bg-emerald-500/25 px-0.5 text-foreground"
                >
                  {p.text}
                </mark>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
          </pre>
        </div>
      )}

      {matches.length > 0 && (
        <div className="max-h-40 overflow-y-auto rounded-md border bg-muted/30">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur">
              <tr className="text-muted-foreground">
                <th className="px-2 py-1 font-medium">#</th>
                <th className="px-2 py-1 font-medium">Index</th>
                <th className="px-2 py-1 font-medium">Match</th>
                <th className="px-2 py-1 font-medium">Groups</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {matches.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1 text-muted-foreground">{i + 1}</td>
                  <td className="px-2 py-1 text-muted-foreground">{m.index}</td>
                  <td className="px-2 py-1 break-all">{m.text}</td>
                  <td className="px-2 py-1 break-all text-muted-foreground">
                    {m.groups.length ? m.groups.map((g) => JSON.stringify(g)).join(", ") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
