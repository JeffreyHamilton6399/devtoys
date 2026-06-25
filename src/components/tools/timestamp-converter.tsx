"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { Clock } from "lucide-react";

function relativeTime(ts: number): string {
  const now = Date.now();
  const diff = ts - now;
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const year = 365 * day;

  const fmt = (n: number, unit: string) =>
    `${n} ${unit}${n === 1 ? "" : "s"} ${diff >= 0 ? "from now" : "ago"}`;

  if (abs < minute) return diff >= 0 ? "in a few seconds" : "a few seconds ago";
  if (abs < hour) return fmt(Math.round(abs / minute), "minute");
  if (abs < day) return fmt(Math.round(abs / hour), "hour");
  if (abs < year) return fmt(Math.round(abs / day), "day");
  return fmt(Math.round(abs / year), "year");
}

export function TimestampConverter() {
  const [input, setInput] = React.useState("");
  const [outUnix, setOutUnix] = React.useState<number | null>(null);
  const [outDate, setOutDate] = React.useState<Date | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const tryParse = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setOutUnix(null);
      setOutDate(null);
      setError(null);
      return;
    }
    // Try Unix timestamp (seconds or ms)
    if (/^-?\d+$/.test(trimmed)) {
      const n = Number(trimmed);
      const ms = trimmed.length <= 10 ? n * 1000 : n;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) {
        setOutDate(d);
        setOutUnix(Math.floor(d.getTime() / 1000));
        setError(null);
        return;
      }
    }
    // Try ISO / locale date
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      setOutDate(d);
      setOutUnix(Math.floor(d.getTime() / 1000));
      setError(null);
      return;
    }
    setOutUnix(null);
    setOutDate(null);
    setError("Could not parse input. Use a Unix timestamp (seconds or ms) or a date string.");
  };

  React.useEffect(() => {
    tryParse(input);
  }, [input]);

  const setNow = () => {
    const n = Math.floor(Date.now() / 1000);
    setInput(String(n));
  };

  const formatted = React.useMemo(() => {
    if (!outDate) return null;
    return {
      iso: outDate.toISOString(),
      local: outDate.toLocaleString(),
      utc: outDate.toUTCString(),
      relative: relativeTime(outDate.getTime()),
      unix: outUnix!,
      unixMs: outDate.getTime(),
    };
  }, [outDate, outUnix]);

  const copyText = React.useMemo(() => {
    if (!formatted) return "";
    return [
      `Unix (s):     ${formatted.unix}`,
      `Unix (ms):    ${formatted.unixMs}`,
      `ISO 8601:     ${formatted.iso}`,
      `Local:        ${formatted.local}`,
      `UTC:          ${formatted.utc}`,
      `Relative:     ${formatted.relative}`,
    ].join("\n");
  }, [formatted]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Unix timestamp or human date
          </label>
          <Button size="sm" variant="ghost" onClick={setNow}>
            <Clock className="size-3.5" />
            Now
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1693526400  or  2024-09-01T00:00:00Z"
          className="min-h-[64px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">
          Auto-detects: Unix seconds, Unix ms, ISO 8601, or locale date.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs font-mono text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {formatted && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Result
            </span>
            <CopyButton value={copyText} />
          </div>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <Row label="Unix (s)" value={String(formatted.unix)} mono />
            <Row label="Unix (ms)" value={String(formatted.unixMs)} mono />
            <Row label="ISO 8601" value={formatted.iso} mono />
            <Row label="Local" value={formatted.local} />
            <Row label="UTC" value={formatted.utc} />
            <Row
              label="Relative"
              value={formatted.relative}
              badge
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  badge,
}: {
  label: string;
  value: string;
  mono?: boolean;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-1.5">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span
        className={`truncate text-right ${mono ? "font-mono" : ""} ${
          badge ? "rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
