"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOLS } from "@/components/devtoys/tool-registry";
import { cn } from "@/lib/utils";

// The 8 new tools added in the second pass — show a small "new" dot
const NEW_IDS = new Set([
  "markdown",
  "json-ts",
  "password",
  "case",
  "html-ent",
  "base",
  "stats",
  "slug",
]);

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <nav
      aria-label="Tools"
      className="hidden w-44 shrink-0 flex-col border-r bg-muted/20 md:flex"
    >
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-0.5">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            const isActive = active === tool.id;
            const isNew = NEW_IDS.has(tool.id);
            return (
              <li key={tool.id}>
                <button
                  type="button"
                  onClick={() => onChange(tool.id)}
                  className={cn(
                    "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                    isActive
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span
                    className="w-4 shrink-0 text-center text-[10px] tabular-nums text-muted-foreground/50"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="size-3.5 shrink-0" />
                  <span className="flex-1 truncate">{tool.name}</span>
                  {isNew && (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-emerald-500"
                      title="New tool"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t p-2 text-[10px] text-muted-foreground">
        {TOOLS.length} tools · 100% client-side
      </div>
    </nav>
  );
}

export function MobileToolSelect({ active, onChange }: SidebarProps) {
  return (
    <Select value={active} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-full text-xs" aria-label="Select tool">
        <SelectValue placeholder="Select tool" />
      </SelectTrigger>
      <SelectContent>
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <SelectItem key={tool.id} value={tool.id}>
              <span className="flex items-center gap-2">
                <Icon className="size-3.5" />
                {tool.name}
                {NEW_IDS.has(tool.id) && (
                  <span className="ml-1 rounded bg-emerald-500/15 px-1 text-[9px] font-medium uppercase text-emerald-600 dark:text-emerald-400">
                    new
                  </span>
                )}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
