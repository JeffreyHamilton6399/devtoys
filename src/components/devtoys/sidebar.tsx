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
      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        <ul className="space-y-px">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            const isActive = active === tool.id;
            const hotkey = i < 10 ? String((i + 1) % 10) : null;
            return (
              <li key={tool.id}>
                <button
                  type="button"
                  onClick={() => onChange(tool.id)}
                  className={cn(
                    "group relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-all duration-100",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {/* Left accent bar for active item */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500"
                      aria-hidden
                    />
                  )}
                  <Icon
                    className={cn(
                      "size-3.5 shrink-0 transition-colors",
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground/70 group-hover:text-foreground",
                    )}
                  />
                  <span className="flex-1 truncate">{tool.name}</span>
                  {hotkey && (
                    <kbd
                      className={cn(
                        "shrink-0 rounded px-1 text-[9px] font-mono tabular-nums transition-opacity",
                        isActive
                          ? "bg-background/60 text-foreground/70 opacity-100"
                          : "opacity-0 group-hover:opacity-60",
                      )}
                    >
                      {hotkey}
                    </kbd>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="border-t px-2 py-1.5 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{TOOLS.length} tools</span>
          <span className="font-mono">⌘1-0</span>
        </div>
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
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <SelectItem key={tool.id} value={tool.id}>
              <span className="flex items-center gap-2">
                <Icon className="size-3.5" />
                {tool.name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
