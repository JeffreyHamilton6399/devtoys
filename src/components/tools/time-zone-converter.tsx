"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/devtoys/copy-button";

// Major world time zones — uses IANA names from Intl.supportedValuesOf
const ZONES: { id: string; label: string }[] = [
  { id: "UTC", label: "UTC" },
  { id: "America/Los_Angeles", label: "Los Angeles · PT" },
  { id: "America/Denver", label: "Denver · MT" },
  { id: "America/Chicago", label: "Chicago · CT" },
  { id: "America/New_York", label: "New York · ET" },
  { id: "America/Sao_Paulo", label: "São Paulo" },
  { id: "America/Toronto", label: "Toronto" },
  { id: "America/Mexico_City", label: "Mexico City" },
  { id: "Europe/London", label: "London · GMT" },
  { id: "Europe/Paris", label: "Paris · CET" },
  { id: "Europe/Berlin", label: "Berlin · CET" },
  { id: "Europe/Madrid", label: "Madrid · CET" },
  { id: "Europe/Moscow", label: "Moscow · MSK" },
  { id: "Africa/Cairo", label: "Cairo" },
  { id: "Africa/Johannesburg", label: "Johannesburg" },
  { id: "Asia/Dubai", label: "Dubai · GST" },
  { id: "Asia/Kolkata", label: "India · IST" },
  { id: "Asia/Karachi", label: "Karachi · PKT" },
  { id: "Asia/Bangkok", label: "Bangkok · ICT" },
  { id: "Asia/Jakarta", label: "Jakarta · WIB" },
  { id: "Asia/Shanghai", label: "Shanghai · CST" },
  { id: "Asia/Hong_Kong", label: "Hong Kong · HKT" },
  { id: "Asia/Taipei", label: "Taipei · CST" },
  { id: "Asia/Tokyo", label: "Tokyo · JST" },
  { id: "Asia/Seoul", label: "Seoul · KST" },
  { id: "Asia/Singapore", label: "Singapore · SGT" },
  { id: "Australia/Sydney", label: "Sydney · AEDT" },
  { id: "Australia/Perth", label: "Perth · AWST" },
  { id: "Pacific/Auckland", label: "Auckland · NZDT" },
  { id: "Pacific/Honolulu", label: "Honolulu · HST" },
];

function formatInZone(date: Date, zone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: zone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "Invalid zone";
  }
}

function getOffset(date: Date, zone: string): string {
  try {
    // Use formatToParts to extract offset
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      timeZoneName: "shortOffset",
    });
    const parts = fmt.formatToParts(date);
    const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return tz;
  } catch {
    return "";
  }
}

export function TimeZoneConverter() {
  const [sourceDate, setSourceDate] = React.useState(() => {
    const d = new Date();
    // Format as yyyy-MM-ddTHH:mm for the input
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [sourceZone, setSourceZone] = React.useState("UTC");

  // Convert source-local-time-in-source-zone to a real UTC instant
  const instant = React.useMemo(() => {
    if (!sourceDate) return null;
    // Strategy: parse as if local, then adjust by the offset between local and sourceZone
    const localParsed = new Date(sourceDate);
    if (isNaN(localParsed.getTime())) return null;
    // Find the offset of sourceZone at that instant
    const sourceOffsetMin = getOffsetMinutes(localParsed, sourceZone);
    const localOffsetMin = -localParsed.getTimezoneOffset();
    const adjusted = new Date(localParsed.getTime() - (sourceOffsetMin - localOffsetMin) * 60000);
    return adjusted;
  }, [sourceDate, sourceZone]);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Date & time</Label>
          <Input
            type="datetime-local"
            value={sourceDate}
            onChange={(e) => setSourceDate(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">In time zone</Label>
          <select
            value={sourceZone}
            onChange={(e) => setSourceZone(e.target.value)}
            className="h-8 rounded-md border bg-background px-2 text-xs"
          >
            {ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {instant && (
        <div className="flex flex-col gap-1.5">
          {ZONES.filter((z) => z.id !== sourceZone).map((z) => {
            const formatted = formatInZone(instant, z.id);
            const offset = getOffset(instant, z.id);
            return (
              <div
                key={z.id}
                className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-1.5"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xs font-medium">{z.label}</span>
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {formatted}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{offset}</span>
                  <CopyButton value={`${formatted} ${offset}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getOffsetMinutes(date: Date, zone: string): number {
  // Compute the zone's UTC offset in minutes for the given instant
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(date);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;
    const asUTC = Date.UTC(
      +map.year,
      +map.month - 1,
      +map.day,
      +map.hour === 24 ? 0 : +map.hour,
      +map.minute,
      +map.second,
    );
    return Math.round((asUTC - date.getTime()) / 60000);
  } catch {
    return 0;
  }
}
