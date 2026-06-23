"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";
import { AlertTriangle } from "lucide-react";

function ipToInt(ip: string): number | null {
  const parts = ip.split(".").map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

function intToIp(n: number): string {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff,
  ].join(".");
}

function binaryStr(n: number): string {
  return n.toString(2).padStart(32, "0");
}

interface SubnetInfo {
  ip: string;
  cidr: number;
  network: string;
  broadcast: string;
  mask: string;
  wildcard: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipBinary: string;
  maskBinary: string;
}

function calculate(ip: string, cidr: number): SubnetInfo | null {
  const ipInt = ipToInt(ip);
  if (ipInt === null) return null;
  if (cidr < 0 || cidr > 32) return null;

  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const wildcard = (~mask) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const totalHosts = cidr >= 32 ? 1 : Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 32 ? 0 : cidr === 31 ? 2 : totalHosts - 2;
  const firstHost = cidr >= 31 ? network : network + 1;
  const lastHost = cidr >= 31 ? broadcast : broadcast - 1;

  // Class
  const first = (ipInt >>> 24) & 0xff;
  let ipClass: string;
  if (first < 128) ipClass = "A";
  else if (first < 192) ipClass = "B";
  else if (first < 224) ipClass = "C";
  else if (first < 240) ipClass = "D (multicast)";
  else ipClass = "E (reserved)";

  return {
    ip,
    cidr,
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    mask: intToIp(mask),
    wildcard: intToIp(wildcard),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    totalHosts,
    usableHosts,
    ipClass,
    ipBinary: binaryStr(ipInt),
    maskBinary: binaryStr(mask),
  };
}

export function SubnetCalculator() {
  const [input, setInput] = React.useState("192.168.1.42/24");
  const [info, setInfo] = React.useState<SubnetInfo | null>(() => calculate("192.168.1.42", 24));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setInfo(null);
      setError(null);
      return;
    }
    const match = trimmed.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
    if (!match) {
      setInfo(null);
      setError("Use CIDR notation: A.B.C.D/N (e.g. 192.168.1.0/24)");
      return;
    }
    const result = calculate(match[1], parseInt(match[2], 10));
    if (!result) {
      setInfo(null);
      setError("Invalid IP address or CIDR");
      return;
    }
    setInfo(result);
    setError(null);
  }, [input]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">CIDR notation</label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.0/24"
          className="font-mono text-sm"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">
          Format: <code className="rounded bg-muted px-1">IP/prefix</code> · try 10.0.0.1/8, 172.16.5.10/12, 192.168.1.42/26
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          <span className="font-mono">{error}</span>
        </div>
      )}

      {info && (
        <div className="flex flex-col gap-2">
          <Row label="IP address" value={info.ip} />
          <Row label="CIDR" value={`/${info.cidr}`} />
          <Row label="Network address" value={info.network} />
          <Row label="Broadcast address" value={info.broadcast} />
          <Row label="Subnet mask" value={info.mask} />
          <Row label="Wildcard mask" value={info.wildcard} />
          <Row label="First host" value={info.firstHost} />
          <Row label="Last host" value={info.lastHost} />
          <Row label="Total addresses" value={info.totalHosts.toLocaleString()} />
          <Row label="Usable hosts" value={info.usableHosts.toLocaleString()} />
          <Row label="IP class" value={info.ipClass} />

          <div className="rounded-md border bg-muted/30 p-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">IP binary</span>
              <CopyButton value={info.ipBinary} />
            </div>
            <code className="block break-all font-mono text-xs">{info.ipBinary.match(/.{8}/g)?.join(" ")}</code>
          </div>
          <div className="rounded-md border bg-muted/30 p-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Mask binary</span>
              <CopyButton value={info.maskBinary} />
            </div>
            <code className="block break-all font-mono text-xs">{info.maskBinary.match(/.{8}/g)?.join(" ")}</code>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-1.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-right font-mono text-xs">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
