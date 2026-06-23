"use client";

import * as React from "react";
import { TOOLS } from "@/components/devtoys/tool-registry";

/**
 * Global keyboard shortcuts for DevToys:
 *   - `1` through `9`: jump to tool N
 *   - `0`: jump to tool 10
 *   - `/`: focus the search/select (no-op on desktop where sidebar is visible)
 *
 * Shortcuts are ignored when the user is typing in an input, textarea, or
 * contenteditable element, unless the source element is the body.
 */
export function useToolShortcuts(
  activeId: string,
  onChange: (id: string) => void,
) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable;

      // Only react to single-digit shortcuts (with or without modifier)
      if (!/^[0-9]$/.test(e.key)) return;

      // Allow Cmd/Ctrl+digit anywhere; bare digit only when not typing
      if (!e.metaKey && !e.ctrlKey && isEditable) return;

      const idx = e.key === "0" ? 9 : parseInt(e.key, 10) - 1;
      if (idx < 0 || idx >= TOOLS.length) return;
      const tool = TOOLS[idx];
      if (!tool || tool.id === activeId) return;

      e.preventDefault();
      onChange(tool.id);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeId, onChange]);
}
