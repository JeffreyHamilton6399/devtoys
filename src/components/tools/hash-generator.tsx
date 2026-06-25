"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/devtoys/copy-button";
import { ClearButton } from "@/components/devtoys/action-buttons";
import { md5 } from "@/lib/devtoys/md5";

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

async function computeHashes(text: string): Promise<Hashes> {
  const md5Val = md5(text);
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
    crypto.subtle.digest("SHA-1", data),
    crypto.subtle.digest("SHA-256", data),
    crypto.subtle.digest("SHA-512", data),
  ]);
  return {
    md5: md5Val,
    sha1: bufToHex(sha1Buf),
    sha256: bufToHex(sha256Buf),
    sha512: bufToHex(sha512Buf),
  };
}

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) {
    s += bytes[i].toString(16).padStart(2, "0");
  }
  return s;
}

export function HashGenerator() {
  const [input, setInput] = React.useState("");
  const [hashes, setHashes] = React.useState<Hashes | null>(null);

  React.useEffect(() => {
    if (!input) {
      setHashes(null);
      return;
    }
    let cancelled = false;
    const id = setTimeout(async () => {
      const h = await computeHashes(input);
      if (!cancelled) setHashes(h);
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [input]);

  const clear = () => {
    setInput("");
    setHashes(null);
  };

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Input text
          </label>
          <ClearButton onClear={clear} disabled={!input} />
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste anything..."
          className="min-h-[80px] resize-none bg-muted/40 font-mono text-xs leading-relaxed"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">
          SHA family via Web Crypto API · MD5 via local impl. All client-side.
        </p>
      </div>

      {hashes && (
        <div className="flex flex-col gap-2">
          <HashRow label="MD5" value={hashes.md5} />
          <HashRow label="SHA-1" value={hashes.sha1} />
          <HashRow label="SHA-256" value={hashes.sha256} />
          <HashRow label="SHA-512" value={hashes.sha512} />
        </div>
      )}
    </div>
  );
}

function HashRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold">{label}</span>
        <CopyButton value={value} />
      </div>
      <p className="break-all font-mono text-xs leading-relaxed text-muted-foreground">
        {value}
      </p>
    </div>
  );
}
