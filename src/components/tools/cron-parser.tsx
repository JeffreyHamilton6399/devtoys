"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/devtoys/copy-button";
import { parseCron, CRON_PRESETS } from "@/lib/devtoys/cron-parser";
import { AlertTriangle } from "lucide-react";

export function CronParser() {
  const [input, setInput] = React.useState("0 9 * * 1-5");
  const [result, setResult] = React.useState<ReturnType<typeof parseCron>>(() =>
    parseCron("0 9 * * 1-5"),
  );

  React.useEffect(() => {
    setResult(parseCron(input));
  }, [input]);

  const copyNextRuns = React.useMemo(() => {
    if (!result.ok || !result.nextRuns) return "";
    return result.nextRuns.map((d) => d.toLocaleString()).join("\n");
  }, [result]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Cron expression
        </label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="*/5 * * * *"
          className="font-mono text-sm"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">
          5-field cron: minute hour day-of-month month day-of-week
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {CRON_PRESETS.map((p) => (
          <Button
            key={p.expr}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() => setInput(p.expr)}
            title={p.expr}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {!result.ok && result.error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{result.error}</span>
        </div>
      )}

      {result.ok && (
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
            <div className="mb-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Schedule
            </div>
            <p className="text-sm">{result.description}</p>
          </div>

          <div className="rounded-md border bg-muted/30 p-2">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Next 5 executions
              </span>
              <CopyButton value={copyNextRuns} disabled={!copyNextRuns} />
            </div>
            <ol className="space-y-1 text-xs">
              {result.nextRuns?.map((d, i) => (
                <li key={i} className="flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span>{d.toLocaleString()}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
