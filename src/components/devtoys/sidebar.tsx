"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOLS, type Tool } from "@/components/devtoys/tool-registry";
import { ToolSearch, fuzzyMatch } from "@/components/devtoys/tool-search";
import { cn } from "@/lib/utils";

interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
}

export function Sidebar({ active, onChange }: SidebarProps) {
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  // `/` to focus search, Esc to clear + blur
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable;
      if (e.key === "/" && !isEditable) {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      } else if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return TOOLS;
    return TOOLS.filter((t) =>
      fuzzyMatch(`${t.name} ${t.description}`, query),
    );
  }, [query]);

  // When the user presses Enter in search, jump to the first match
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      onChange(filtered[0].id);
      setQuery("");
      searchRef.current?.blur();
    }
  };

  return (
    <nav
      aria-label="Tools"
      className="hidden w-44 shrink-0 flex-col border-r bg-muted/20 md:flex"
    >
      <div className="border-b p-2">
        <ToolSearch
          ref={searchRef}
          value={query}
          onChange={setQuery}
          onKeyDown={onSearchKeyDown}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        {filtered.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No tools match &quot;{query}&quot;
          </p>
        ) : (
          <ul className="space-y-px">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              const isActive = active === tool.id;
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
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="border-t px-2 py-1.5 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{TOOLS.length} tools</span>
          <span className="font-mono">/ to search</span>
        </div>
      </div>
    </nav>
  );
}

export function MobileToolSelect({ active, onChange }: SidebarProps) {
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(() => {
    if (!query.trim()) return TOOLS;
    return TOOLS.filter((t) =>
      fuzzyMatch(`${t.name} ${t.description}`, query),
    );
  }, [query]);

  return (
    <div className="flex items-center gap-2">
      <ToolSearch value={query} onChange={setQuery} className="flex-1" />
      <Select value={active} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-32 text-xs" aria-label="Select tool">
          <SelectValue placeholder="Browse" />
        </SelectTrigger>
        <SelectContent>
          {filtered.map((tool) => {
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
    </div>
  );
}
