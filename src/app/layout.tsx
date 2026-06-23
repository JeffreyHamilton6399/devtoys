import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/devtoys/theme-provider";
import { TermsGate } from "@/components/devtoys/terms-gate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevToys — 20 dev tools. One bookmark.",
  description:
    "A clean, fast, client-side developer toolbox. 20 tools: JSON formatter, Base64, JWT decoder, regex tester, UUID generator, hash generator, color converter, Markdown preview, JSON-to-TypeScript, password generator, and more. Your data never leaves your browser.",
  keywords: [
    "DevToys",
    "developer tools",
    "JSON formatter",
    "Base64",
    "JWT decoder",
    "regex tester",
    "UUID generator",
    "hash generator",
    "color converter",
    "diff checker",
  ],
  authors: [{ name: "Jeffrey Hamilton" }],
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Sonner position="bottom-center" closeButton={false} />
          <TermsGate />
        </ThemeProvider>
      </body>
    </html>
  );
}
