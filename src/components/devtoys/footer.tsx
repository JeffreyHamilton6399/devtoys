export function Footer() {
  return (
    <footer className="flex h-8 shrink-0 items-center justify-between border-t px-3 text-[11px] text-muted-foreground">
      <span>V1 · Jeffrey Hamilton</span>
      <span className="hidden sm:inline">
        100% client-side · No tracking · No accounts
      </span>
      <span>
        <a
          href="https://github.com/JeffreyHamilton6399"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
      </span>
    </footer>
  );
}
