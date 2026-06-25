"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function CopyButton({
  value,
  label = "Copy",
  className,
  disabled,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const onCopy = React.useCallback(async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // ignore
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1200);
  }, [value]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={onCopy}
      disabled={disabled || !value}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}
