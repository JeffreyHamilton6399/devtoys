"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";

interface CharInfo {
  char: string;
  codepoint: number;
  hex: string;
  utf8: string;
  utf16: string;
  htmlEntity: string;
  url: string;
  name: string;
}

// Tiny built-in name lookup for common special chars
const NAMES: Record<string, string> = {
  " ": "SPACE",
  "\t": "HORIZONTAL TAB",
  "\n": "LINE FEED",
  "\r": "CARRIAGE RETURN",
  "!": "EXCLAMATION MARK",
  '"': "QUOTATION MARK",
  "#": "NUMBER SIGN",
  "$": "DOLLAR SIGN",
  "%": "PERCENT SIGN",
  "&": "AMPERSAND",
  "'": "APOSTROPHE",
  "(": "LEFT PARENTHESIS",
  ")": "RIGHT PARENTHESIS",
  "*": "ASTERISK",
  "+": "PLUS SIGN",
  ",": "COMMA",
  "-": "HYPHEN-MINUS",
  ".": "FULL STOP",
  "/": "SOLIDUS",
  ":": "COLON",
  ";": "SEMICOLON",
  "<": "LESS-THAN SIGN",
  "=": "EQUALS SIGN",
  ">": "GREATER-THAN SIGN",
  "?": "QUESTION MARK",
  "@": "COMMERCIAL AT",
  "[": "LEFT SQUARE BRACKET",
  "\\": "REVERSE SOLIDUS",
  "]": "RIGHT SQUARE BRACKET",
  "^": "CIRCUMFLEX ACCENT",
  "_": "LOW LINE",
  "`": "GRAVE ACCENT",
  "{": "LEFT CURLY BRACKET",
  "|": "VERTICAL LINE",
  "}": "RIGHT CURLY BRACKET",
  "~": "TILDE",
  "©": "COPYRIGHT SIGN",
  "®": "REGISTERED SIGN",
  "™": "TRADE MARK SIGN",
  "€": "EURO SIGN",
  "£": "POUND SIGN",
  "¥": "YEN SIGN",
  "¢": "CENT SIGN",
  "°": "DEGREE SIGN",
  "±": "PLUS-MINUS SIGN",
  "×": "MULTIPLICATION SIGN",
  "÷": "DIVISION SIGN",
  "→": "RIGHTWARDS ARROW",
  "←": "LEFTWARDS ARROW",
  "↑": "UPWARDS ARROW",
  "↓": "DOWNWARDS ARROW",
  "•": "BULLET",
  "…": "HORIZONTAL ELLIPSIS",
  "—": "EM DASH",
  "–": "EN DASH",
  " " : "SPACE",
};

function inspectChar(c: string): CharInfo | null {
  if (!c) return null;
  const codepoint = c.codePointAt(0);
  if (codepoint === undefined) return null;
  const bytes = new TextEncoder().encode(c);
  const utf8 = Array.from(bytes).map((b) => `0x${b.toString(16).padStart(2, "0")}`).join(" ");
  // UTF-16 code units
  const utf16Units: number[] = [];
  for (let i = 0; i < c.length; i++) {
    utf16Units.push(c.charCodeAt(i));
  }
  const utf16 = utf16Units.map((u) => `0x${u.toString(16).padStart(4, "0")}`).join(" ");
  const htmlEntity = `&#${codepoint};`;
  const url = encodeURIComponent(c);
  const name = NAMES[c] ?? "";
  return {
    char: c,
    codepoint,
    hex: `U+${codepoint.toString(16).toUpperCase().padStart(4, "0")}`,
    utf8,
    utf16,
    htmlEntity,
    url,
    name,
  };
}

export function UnicodeInspector() {
  const [input, setInput] = React.useState("A");
  const charInfo = React.useMemo(() => {
    // Take first codepoint (which may be 1 or 2 UTF-16 units)
    if (!input) return null;
    const firstChar = Array.from(input)[0];
    return inspectChar(firstChar);
  }, [input]);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Character (inspects first one)
        </label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a character…"
          className="font-mono text-sm"
          maxLength={10}
        />
      </div>

      {charInfo && (
        <div className="flex flex-col gap-3">
          {/* Big preview */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border bg-muted/30 py-6">
            <div className="text-6xl leading-none">{charInfo.char}</div>
            <div className="font-mono text-xs text-muted-foreground">{charInfo.hex}</div>
            {charInfo.name && (
              <div className="text-xs font-medium">{charInfo.name}</div>
            )}
          </div>

          {/* Details */}
          <Row label="Character" value={charInfo.char} mono />
          <Row label="Codepoint" value={String(charInfo.codepoint)} mono />
          <Row label="Hex (U+)" value={charInfo.hex} mono />
          <Row label="UTF-8 bytes" value={charInfo.utf8} mono />
          <Row label="UTF-16 units" value={charInfo.utf16} mono />
          <Row label="HTML entity" value={charInfo.htmlEntity} mono />
          <Row label="URL encoded" value={charInfo.url} mono />
          <Row label="JS escape" value={`\\u{${charInfo.codepoint.toString(16)}}`} mono />
          <Row label="CSS escape" value={`\\${charInfo.codepoint.toString(16).toUpperCase()}`} mono />
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-1.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span className={`truncate text-right text-xs ${mono ? "font-mono" : ""}`}>{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
