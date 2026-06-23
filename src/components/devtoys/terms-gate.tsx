"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "devtoys:terms-accepted";

export function TermsGate() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const accepted = localStorage.getItem(STORAGE_KEY);
      if (!accepted) setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Terms &amp; Privacy</DialogTitle>
          <DialogDescription className="text-left">
            DevToys is a 100% client-side developer toolbox. All processing
            happens in your browser. No data ever leaves your device, no
            analytics, no tracking, no accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            By continuing you agree that all input you paste into DevToys is
            processed locally and is never transmitted to any server.
          </p>
          <p>
            Settings (theme, last active tool) are stored in localStorage on
            your device only.
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={accept} size="sm" className="w-full">
            I agree — Continue
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            This gate is non-dismissable. Close the tab to decline.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
