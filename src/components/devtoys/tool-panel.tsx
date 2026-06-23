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
        <Icon className="size-4 text-muted-foreground" />
        <h1 className="text-sm font-semibold">{tool.name}</h1>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">
        <Component />
      </div>
    </div>
  );
}
