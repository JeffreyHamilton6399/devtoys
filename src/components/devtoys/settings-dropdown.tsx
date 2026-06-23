"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Sun, Moon, Github, Shield, FileText } from "lucide-react";

export function SettingsDropdown() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [termsOpen, setTermsOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 rounded-full">
            <Settings className="size-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Settings
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <>
                <Sun className="size-4" /> Light mode
              </>
            ) : (
              <>
                <Moon className="size-4" /> Dark mode
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPrivacyOpen(true)}>
            <Shield className="size-4" /> Privacy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTermsOpen(true)}>
            <FileText className="size-4" /> Terms
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href="https://github.com/JeffreyHamilton6399"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <Github className="size-4" /> GitHub
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy</DialogTitle>
            <DialogDescription>
              100% client-side. Your data never leaves your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              DevToys runs entirely in your browser. Every tool — JSON
              formatter, Base64, JWT decoder, hash generator, all of them —
              processes your input locally with JavaScript. No data is ever
              transmitted to any server.
            </p>
            <p>
              There is no analytics, no tracking, no telemetry, no accounts.
              We do not set cookies.
            </p>
            <p>
              The only thing stored is your settings (theme, last active tool,
              terms acceptance) in your browser&apos;s localStorage on your own
              device.
            </p>
            <p className="font-medium text-foreground">
              15 dev tools. One bookmark. Your data never leaves your browser.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Terms</DialogTitle>
            <DialogDescription>
              Use DevToys freely. No warranty, no liability.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              DevToys is provided &quot;as is&quot;, without warranty of any
              kind. Use it at your own risk.
            </p>
            <p>
              By using DevToys you agree that the author is not liable for any
              damages arising from its use. All processing happens in your
              browser — the author cannot see, store, or recover any data you
              paste into the tools.
            </p>
            <p>
              DevToys is free and open source. Fork it, modify it, self-host
              it.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
