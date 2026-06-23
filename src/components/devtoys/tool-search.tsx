"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ToolSearchProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function ToolSearch({ value, onChange, className, inputRef }: ToolSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tools…  /"
        className="h-7 pl-7 pr-7 text-xs"
        spellCheck={false}
        aria-label="Search tools"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

/**
 * Fuzzy filter: matches if every char of the query appears in order in the
 * haystack (case-insensitive). Returns the matched haystack (for highlighting)
 * or null if no match.
 */
export function fuzzyMatch(haystack: string, query: string): boolean {
  if (!query) return true;
  const h = haystack.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let hi = 0; hi < h.length && qi < q.length; hi++) {
    if (h[hi] === q[qi]) qi++;
  }
  return qi === q.length;
}
