"use client";

import * as React from "react";
import { TOOLS_BY_ID } from "@/components/devtoys/tool-registry";

interface ToolPanelProps {
  activeId: string;
}

export function ToolPanel({ activeId }: ToolPanelProps) {
  const tool = TOOLS_BY_ID[activeId] ?? TOOLS_BY_ID["json"];
  const Component = tool.component;
  const Icon = tool.icon;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b px-3">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        <h1 className="text-sm font-semibold">{tool.name}</h1>
        {tool.description && (
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
            · {tool.description}
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">
        <Component />
      </div>
    </div>
  );
}
