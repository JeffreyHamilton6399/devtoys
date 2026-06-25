"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/devtoys/copy-button";

type Op = "add" | "diff";

function toDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DateCalculator() {
  const [op, setOp] = React.useState<Op>("add");
  const [startDate, setStartDate] = React.useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [amount, setAmount] = React.useState(30);
  const [unit, setUnit] = React.useState<"days" | "weeks" | "months" | "years">("days");
  const [endDate, setEndDate] = React.useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [result, setResult] = React.useState<string>("");

  const compute = () => {
    const start = toDate(startDate);
    if (!start) {
      setResult("Invalid start date");
      return;
    }
    if (op === "add") {
      const d = new Date(start);
      const n = amount;
      switch (unit) {
        case "days": d.setDate(d.getDate() + n); break;
        case "weeks": d.setDate(d.getDate() + n * 7); break;
        case "months": d.setMonth(d.getMonth() + n); break;
        case "years": d.setFullYear(d.getFullYear() + n); break;
      }
      const actualEnd = d;
      setResult(
        `${formatDate(start)} + ${n} ${unit} = ${formatDate(actualEnd)}` +
        ` (${Math.round((actualEnd.getTime() - start.getTime()) / 86400000)} days total)`,
      );
    } else {
      const end = toDate(endDate);
      if (!end) {
        setResult("Invalid end date");
        return;
      }
      const diffMs = end.getTime() - start.getTime();
      const totalDays = Math.round(diffMs / 86400000);
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      // Adjust if end day-of-month is before start day-of-month
      const adjustedMonths = end.getDate() < start.getDate() ? totalMonths - 1 : totalMonths;
      const years = Math.floor(adjustedMonths / 12);
      const remainingMonths = adjustedMonths % 12;
      setResult(
        `${formatDate(start)} → ${formatDate(end)}\n` +
        `${totalDays} days · ${totalWeeks} weeks · ${adjustedMonths} months (${years}y ${remainingMonths}m)`,
      );
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={op === "add" ? "default" : "outline"}
          onClick={() => setOp("add")}
        >
          Add / Subtract
        </Button>
        <Button
          size="sm"
          variant={op === "diff" ? "default" : "outline"}
          onClick={() => setOp("diff")}
        >
          Difference
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Start date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {op === "add" ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Amount (negative to subtract)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Unit</Label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as typeof unit)}
                className="h-8 rounded-md border bg-background px-2 text-xs"
              >
                <option value="days">days</option>
                <option value="weeks">weeks</option>
                <option value="months">months</option>
                <option value="years">years</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground">End date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>

      <Button size="sm" onClick={compute}>Calculate</Button>

      {result && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="mb-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Result
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-xs">{result}</pre>
          <div className="mt-2 flex justify-end">
            <CopyButton value={result} />
          </div>
        </div>
      )}
    </div>
  );
}
