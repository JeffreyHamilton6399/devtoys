"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/devtoys/logo";
import { SettingsDropdown } from "@/components/devtoys/settings-dropdown";
import { Heart } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b px-3">
      <div className="flex items-center gap-2">
        <Logo className="size-6" />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-tight">DevToys</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            · 40 dev tools. One bookmark.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="h-7 gap-1.5 rounded-full px-3 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
        >
          <a
            href="https://buymeacoffee.com/jeffreyscof"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Heart className="size-3.5 fill-current" />
            Donate
          </a>
        </Button>
        <SettingsDropdown />
      </div>
    </header>
  );
}
