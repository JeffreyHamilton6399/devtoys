"use client";

import * as React from "react";
import { TOOLS_BY_ID } from "@/components/devtoys/tool-registry";

interface ToolPanelProps {
  activeId: string;
}

const DESCRIPTIONS: Record<string, string> = {
  json: "Format, minify, and validate JSON",
  base64: "Encode and decode Base64 (UTF-8 safe)",
  url: "URL-encode and URL-decode text",
  jwt: "Decode JWT header, payload, and signature",
  regex: "Test regex with flags and capture groups",
  uuid: "Generate v4 UUIDs with crypto.randomUUID",
  timestamp: "Convert Unix timestamps to human dates",
  hash: "Compute MD5, SHA-1, SHA-256, SHA-512",
  color: "Convert between HEX, RGB, and HSL",
  lorem: "Generate placeholder lorem ipsum text",
  cron: "Parse cron expressions into schedules",
  diff: "Compare two texts line by line",
  markdown: "Render Markdown into live HTML",
  "json-ts": "Generate TypeScript interfaces from JSON",
  password: "Generate cryptographically secure passwords",
  case: "Convert text between 10 case styles",
  "html-ent": "Encode and decode HTML entities",
  base: "Convert numbers between bases (bin/hex/b58)",
  stats: "Count words, characters, sentences, and more",
  slug: "Generate URL-safe slugs from any text",
  "url-parse": "Break a URL into its component parts",
  http: "Searchable HTTP status code reference",
  escape: "Escape and unescape strings for 5 formats",
  "img-base64": "Drop, paste, or upload an image — get a data URI",
  "json-csv": "Convert an array of objects between JSON and CSV",
  "line-sort": "Sort, deduplicate, reverse, or shuffle lines",
};

export function ToolPanel({ activeId }: ToolPanelProps) {
  const tool = TOOLS_BY_ID[activeId] ?? TOOLS_BY_ID["json"];
  const Component = tool.component;
  const Icon = tool.icon;
  const description = DESCRIPTIONS[tool.id] ?? "";

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b px-3">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-400" />
        <h1 className="text-sm font-semibold">{tool.name}</h1>
        {description && (
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
            · {description}
          </span>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-3">
        <Component />
      </div>
    </div>
  );
}
