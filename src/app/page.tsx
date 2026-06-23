"use client";

import * as React from "react";
import { Header } from "@/components/devtoys/header";
import { Footer } from "@/components/devtoys/footer";
import { Sidebar, MobileToolSelect } from "@/components/devtoys/sidebar";
import { ToolPanel } from "@/components/devtoys/tool-panel";
import { TOOLS } from "@/components/devtoys/tool-registry";

const STORAGE_KEY = "devtoys:active-tool";

export default function Home() {
  const [active, setActive] = React.useState<string>("json");
  const [mounted, setMounted] = React.useState(false);

  // Restore last active tool from localStorage
  React.useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && TOOLS.some((t) => t.id === saved)) {
        setActive(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist active tool
  const onChange = React.useCallback((id: string) => {
    setActive(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <Header />
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar active={active} onChange={onChange} />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Mobile tool selector */}
          <div className="border-b p-2 md:hidden">
            <MobileToolSelect active={active} onChange={onChange} />
          </div>
          <ToolPanel activeId={active} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
