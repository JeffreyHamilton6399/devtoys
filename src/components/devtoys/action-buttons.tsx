"use client";

import { ArrowDownUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
  label?: string;
}

export function SwapButton({
  onSwap,
  disabled,
  label = "Swap",
}: SwapButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onSwap}
      disabled={disabled}
    >
      <ArrowDownUp className="size-3.5" />
      {label}
    </Button>
  );
}

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
}

export function ClearButton({
  onClear,
  disabled,
  label = "Clear",
}: ClearButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClear}
      disabled={disabled}
    >
      <Trash2 className="size-3.5" />
      {label}
    </Button>
  );
}
