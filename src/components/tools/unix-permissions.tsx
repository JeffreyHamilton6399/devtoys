"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";

interface PermBits {
  read: boolean;
  write: boolean;
  execute: boolean;
}

interface PermSet {
  user: PermBits;
  group: PermBits;
  other: PermBits;
  special: { setuid: boolean; setgid: boolean; sticky: boolean };
}

const EMPTY: PermSet = {
  user: { read: false, write: false, execute: false },
  group: { read: false, write: false, execute: false },
  other: { read: false, write: false, execute: false },
  special: { setuid: false, setgid: false, sticky: false },
};

function permSetToBits(p: PermSet): number {
  const u = (p.user.read ? 4 : 0) + (p.user.write ? 2 : 0) + (p.user.execute ? 1 : 0);
  const g = (p.group.read ? 4 : 0) + (p.group.write ? 2 : 0) + (p.group.execute ? 1 : 0);
  const o = (p.other.read ? 4 : 0) + (p.other.write ? 2 : 0) + (p.other.execute ? 1 : 0);
  const s = (p.special.setuid ? 4 : 0) + (p.special.setgid ? 2 : 0) + (p.special.sticky ? 1 : 0);
  return s * 512 + u * 64 + g * 8 + o;
}

function bitsToPermSet(n: number): PermSet {
  const special = {
    setuid: !!(n & 0o4000),
    setgid: !!(n & 0o2000),
    sticky: !!(n & 0o1000),
  };
  const rest = n & 0o777;
  const u = (rest >> 6) & 7;
  const g = (rest >> 3) & 7;
  const o = rest & 7;
  return {
    user: { read: !!(u & 4), write: !!(u & 2), execute: !!(u & 1) },
    group: { read: !!(g & 4), write: !!(g & 2), execute: !!(g & 1) },
    other: { read: !!(o & 4), write: !!(o & 2), execute: !!(o & 1) },
    special,
  };
}

function toSymbolic(p: PermSet): string {
  const part = (b: PermBits) =>
    `${b.read ? "r" : "-"}${b.write ? "w" : "-"}${b.execute ? "x" : "-"}`;
  const u = part(p.user).replace("x", p.special.setuid ? "s" : "x");
  const g = part(p.group).replace("x", p.special.setgid ? "s" : "x");
  const o = part(p.other).replace("x", p.special.sticky ? "t" : "x");
  // For special bits: if execute is off, special becomes uppercase (S, T) — convention
  const uOut = !p.user.execute && p.special.setuid ? u.replace("x", "S").replace("s", "S") : u;
  const gOut = !p.group.execute && p.special.setgid ? g.replace("x", "S").replace("s", "S") : g;
  const oOut = !p.other.execute && p.special.sticky ? o.replace("x", "T").replace("t", "T") : o;
  return uOut + gOut + oOut;
}

function describe(n: number): string[] {
  const lines: string[] = [];
  if (n & 0o4000) lines.push("setuid — runs as the file owner");
  if (n & 0o2000) lines.push("setgid — runs as the file group");
  if (n & 0o1000) lines.push("sticky — only owner can delete files in directory");
  const rest = n & 0o777;
  const u = (rest >> 6) & 7;
  const g = (rest >> 3) & 7;
  const o = rest & 7;
  const desc = (n: number, who: string) => {
    const parts: string[] = [];
    if (n & 4) parts.push("read");
    if (n & 2) parts.push("write");
    if (n & 1) parts.push("execute");
    return `${who}: ${parts.join(", ") || "no permissions"}`;
  };
  lines.push(desc(u, "user"));
  lines.push(desc(g, "group"));
  lines.push(desc(o, "other"));
  return lines;
}

export function UnixPermissions() {
  const [perm, setPerm] = React.useState<PermSet>({
    ...EMPTY,
    user: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    other: { read: true, write: false, execute: false },
  });

  const numeric = permSetToBits(perm);
  const numericStr = `0${numeric.toString(8).padStart(3, "0")}`;
  const symbolic = toSymbolic(perm);
  const descriptions = describe(numeric);

  const [textValue, setTextValue] = React.useState("");
  const [textError, setTextError] = React.useState<string | null>(null);

  const parseText = (raw: string) => {
    setTextValue(raw);
    const trimmed = raw.trim();
    if (!trimmed) {
      setTextError(null);
      return;
    }
    // Try numeric (e.g. "755", "0755", "0o755")
    const numericMatch = trimmed.match(/^(0o)?([0-7]{3,4})$/);
    if (numericMatch) {
      const n = parseInt(numericMatch[2], 8);
      setPerm(bitsToPermSet(n));
      setTextError(null);
      return;
    }
    // Try symbolic (e.g. "rwxr-xr-x", 9 chars)
    if (/^([r-][w-][xsStT-]){3}$/.test(trimmed)) {
      // Parse symbolic manually
      const newPerm: PermSet = JSON.parse(JSON.stringify(EMPTY));
      const parseTriplet = (s: string, who: "user" | "group" | "other"): PermBits => {
        return {
          read: s[0] === "r",
          write: s[1] === "w",
          execute: s[2] === "x" || s[2] === "s" || s[2] === "t",
        };
      };
      newPerm.user = parseTriplet(trimmed.slice(0, 3), "user");
      newPerm.group = parseTriplet(trimmed.slice(3, 6), "group");
      newPerm.other = parseTriplet(trimmed.slice(6, 9), "other");
      newPerm.special.setuid = trimmed[2] === "s" || trimmed[2] === "S";
      newPerm.special.setgid = trimmed[5] === "s" || trimmed[5] === "S";
      newPerm.special.sticky = trimmed[8] === "t" || trimmed[8] === "T";
      setPerm(newPerm);
      setTextError(null);
      return;
    }
    setTextError("Unrecognized format. Use numeric (755) or symbolic (rwxr-xr-x).");
  };

  const togglePerm = (who: "user" | "group" | "other", bit: keyof PermBits) => {
    setPerm((p) => ({ ...p, [who]: { ...p[who], [bit]: !p[who][bit] } }));
  };

  const toggleSpecial = (bit: keyof PermSet["special"]) => {
    setPerm((p) => ({ ...p, special: { ...p.special, [bit]: !p.special[bit] } }));
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      {/* Numeric and symbolic display */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border bg-muted/30 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Numeric</span>
            <CopyButton value={numericStr} />
          </div>
          <code className="font-mono text-base font-semibold">{numericStr}</code>
        </div>
        <div className="rounded-md border bg-muted/30 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Symbolic</span>
            <CopyButton value={symbolic} />
          </div>
          <code className="font-mono text-base font-semibold">{symbolic}</code>
        </div>
      </div>

      {/* Text input */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">
          Paste any permission (755, 0o644, rwxr-xr-x)
        </label>
        <Input
          value={textValue}
          onChange={(e) => parseText(e.target.value)}
          placeholder="755 or rwxr-xr-x"
          className="h-8 font-mono text-xs"
          spellCheck={false}
        />
        {textError && (
          <span className="text-xs text-rose-600 dark:text-rose-400">{textError}</span>
        )}
      </div>

      {/* Permission checkboxes */}
      <div className="overflow-hidden rounded-md border">
        <table className="w-full text-xs">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-2 py-1.5 text-left font-medium text-muted-foreground">Entity</th>
              <th className="px-2 py-1.5 text-center font-medium text-muted-foreground">Read</th>
              <th className="px-2 py-1.5 text-center font-medium text-muted-foreground">Write</th>
              <th className="px-2 py-1.5 text-center font-medium text-muted-foreground">Execute</th>
            </tr>
          </thead>
          <tbody>
            {(["user", "group", "other"] as const).map((who) => (
              <tr key={who} className="border-t">
                <td className="px-2 py-1.5 font-medium capitalize">{who}</td>
                {(["read", "write", "execute"] as const).map((bit) => (
                  <td key={bit} className="px-2 py-1.5 text-center">
                    <input
                      type="checkbox"
                      checked={perm[who][bit]}
                      onChange={() => togglePerm(who, bit)}
                      className="size-3.5"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Special bits */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Special bits</span>
        {([
          ["setuid", "setuid — run as owner"],
          ["setgid", "setgid — run as group"],
          ["sticky", "sticky — restricted deletion"],
        ] as const).map(([bit, label]) => (
          <label key={bit} className="flex cursor-pointer items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={perm.special[bit]}
              onChange={() => toggleSpecial(bit)}
              className="size-3.5"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Description */}
      <div className="rounded-md border bg-muted/30 p-2">
        <div className="mb-1 text-xs font-medium text-muted-foreground">Meaning</div>
        <ul className="space-y-0.5 text-xs">
          {descriptions.map((d, i) => (
            <li key={i}>· {d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
