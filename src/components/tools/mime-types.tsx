"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";

interface MimeEntry {
  ext: string;
  mime: string;
  desc: string;
}

const MIME_TYPES: MimeEntry[] = [
  // Text / web
  { ext: "html", mime: "text/html", desc: "HTML document" },
  { ext: "htm", mime: "text/html", desc: "HTML document" },
  { ext: "css", mime: "text/css", desc: "CSS stylesheet" },
  { ext: "js", mime: "text/javascript", desc: "JavaScript" },
  { ext: "mjs", mime: "text/javascript", desc: "JavaScript module" },
  { ext: "ts", mime: "text/typescript", desc: "TypeScript" },
  { ext: "tsx", mime: "text/typescript", desc: "TypeScript + JSX" },
  { ext: "jsx", mime: "text/jsx", desc: "JavaScript + JSX" },
  { ext: "json", mime: "application/json", desc: "JSON" },
  { ext: "xml", mime: "application/xml", desc: "XML" },
  { ext: "txt", mime: "text/plain", desc: "Plain text" },
  { ext: "md", mime: "text/markdown", desc: "Markdown" },
  { ext: "csv", mime: "text/csv", desc: "Comma-separated values" },
  { ext: "tsv", mime: "text/tab-separated-values", desc: "Tab-separated values" },
  { ext: "yaml", mime: "text/yaml", desc: "YAML" },
  { ext: "yml", mime: "text/yaml", desc: "YAML" },
  { ext: "toml", mime: "text/plain", desc: "TOML (no official MIME)" },
  { ext: "ini", mime: "text/plain", desc: "INI config" },

  // Images
  { ext: "png", mime: "image/png", desc: "PNG image" },
  { ext: "jpg", mime: "image/jpeg", desc: "JPEG image" },
  { ext: "jpeg", mime: "image/jpeg", desc: "JPEG image" },
  { ext: "gif", mime: "image/gif", desc: "GIF image" },
  { ext: "webp", mime: "image/webp", desc: "WebP image" },
  { ext: "avif", mime: "image/avif", desc: "AVIF image" },
  { ext: "svg", mime: "image/svg+xml", desc: "SVG image" },
  { ext: "bmp", mime: "image/bmp", desc: "Bitmap image" },
  { ext: "ico", mime: "image/x-icon", desc: "Icon" },
  { ext: "tiff", mime: "image/tiff", desc: "TIFF image" },
  { ext: "heic", mime: "image/heic", desc: "HEIC image (Apple)" },

  // Audio
  { ext: "mp3", mime: "audio/mpeg", desc: "MP3 audio" },
  { ext: "wav", mime: "audio/wav", desc: "WAV audio" },
  { ext: "ogg", mime: "audio/ogg", desc: "Ogg audio" },
  { ext: "flac", mime: "audio/flac", desc: "FLAC audio" },
  { ext: "aac", mime: "audio/aac", desc: "AAC audio" },
  { ext: "m4a", mime: "audio/mp4", desc: "M4A audio" },
  { ext: "opus", mime: "audio/opus", desc: "Opus audio" },

  // Video
  { ext: "mp4", mime: "video/mp4", desc: "MP4 video" },
  { ext: "webm", mime: "video/webm", desc: "WebM video" },
  { ext: "avi", mime: "video/x-msvideo", desc: "AVI video" },
  { ext: "mov", mime: "video/quicktime", desc: "QuickTime video" },
  { ext: "mkv", mime: "video/x-matroska", desc: "Matroska video" },
  { ext: "mpeg", mime: "video/mpeg", desc: "MPEG video" },
  { ext: "mpg", mime: "video/mpeg", desc: "MPEG video" },

  // Fonts
  { ext: "woff", mime: "font/woff", desc: "WOFF font" },
  { ext: "woff2", mime: "font/woff2", desc: "WOFF2 font" },
  { ext: "ttf", mime: "font/ttf", desc: "TrueType font" },
  { ext: "otf", mime: "font/otf", desc: "OpenType font" },
  { ext: "eot", mime: "application/vnd.ms-fontobject", desc: "Embedded OpenType" },

  // Documents
  { ext: "pdf", mime: "application/pdf", desc: "PDF document" },
  { ext: "doc", mime: "application/msword", desc: "Word (legacy)" },
  { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", desc: "Word (OOXML)" },
  { ext: "xls", mime: "application/vnd.ms-excel", desc: "Excel (legacy)" },
  { ext: "xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", desc: "Excel (OOXML)" },
  { ext: "ppt", mime: "application/vnd.ms-powerpoint", desc: "PowerPoint (legacy)" },
  { ext: "pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", desc: "PowerPoint (OOXML)" },
  { ext: "odt", mime: "application/vnd.oasis.opendocument.text", desc: "OpenDocument text" },
  { ext: "ods", mime: "application/vnd.oasis.opendocument.spreadsheet", desc: "OpenDocument spreadsheet" },
  { ext: "odp", mime: "application/vnd.oasis.opendocument.presentation", desc: "OpenDocument presentation" },
  { ext: "rtf", mime: "application/rtf", desc: "Rich Text Format" },

  // Archives
  { ext: "zip", mime: "application/zip", desc: "ZIP archive" },
  { ext: "gz", mime: "application/gzip", desc: "Gzip archive" },
  { ext: "tar", mime: "application/x-tar", desc: "Tar archive" },
  { ext: "tar.gz", mime: "application/gzip", desc: "Tar+gzip archive" },
  { ext: "tgz", mime: "application/gzip", desc: "Tar+gzip archive" },
  { ext: "rar", mime: "application/vnd.rar", desc: "RAR archive" },
  { ext: "7z", mime: "application/x-7z-compressed", desc: "7-Zip archive" },
  { ext: "bz", mime: "application/x-bzip", desc: "Bzip archive" },
  { ext: "bz2", mime: "application/x-bzip2", desc: "Bzip2 archive" },
  { ext: "xz", mime: "application/x-xz", desc: "XZ archive" },

  // Code / binary
  { ext: "wasm", mime: "application/wasm", desc: "WebAssembly binary" },
  { ext: "py", mime: "text/x-python", desc: "Python source" },
  { ext: "rb", mime: "text/x-ruby", desc: "Ruby source" },
  { ext: "php", mime: "application/x-httpd-php", desc: "PHP source" },
  { ext: "java", mime: "text/x-java-source", desc: "Java source" },
  { ext: "c", mime: "text/x-csrc", desc: "C source" },
  { ext: "cpp", mime: "text/x-c++src", desc: "C++ source" },
  { ext: "h", mime: "text/x-chdr", desc: "C header" },
  { ext: "rs", mime: "text/rust", desc: "Rust source" },
  { ext: "go", mime: "text/x-go", desc: "Go source" },
  { ext: "swift", mime: "text/x-swift", desc: "Swift source" },
  { ext: "kt", mime: "text/x-kotlin", desc: "Kotlin source" },
  { ext: "sh", mime: "application/x-sh", desc: "Shell script" },
  { ext: "bash", mime: "application/x-sh", desc: "Bash script" },
  { ext: "ps1", mime: "application/x-powershell", desc: "PowerShell script" },
  { ext: "sql", mime: "application/sql", desc: "SQL script" },

  // Other
  { ext: "bin", mime: "application/octet-stream", desc: "Generic binary" },
  { ext: "exe", mime: "application/x-msdownload", desc: "Windows executable" },
  { ext: "dll", mime: "application/x-msdownload", desc: "Windows library" },
  { ext: "so", mime: "application/x-sharedlib", desc: "Shared library (Unix)" },
  { ext: "dylib", mime: "application/x-sharedlib", desc: "Shared library (macOS)" },
  { ext: "jar", mime: "application/java-archive", desc: "Java archive" },
  { ext: "class", mime: "application/java-vm", desc: "Java class file" },
  { ext: "deb", mime: "application/vnd.debian.binary-package", desc: "Debian package" },
  { ext: "rpm", mime: "application/x-rpm", desc: "RPM package" },
  { ext: "dmg", mime: "application/x-apple-diskimage", desc: "macOS disk image" },
  { ext: "iso", mime: "application/x-iso9660-image", desc: "ISO disc image" },
  { ext: "torrent", mime: "application/x-bittorrent", desc: "BitTorrent file" },
  { ext: "ics", mime: "text/calendar", desc: "iCalendar" },
  { ext: "vcf", mime: "text/vcard", desc: "vCard contact" },
  { ext: "epub", mime: "application/epub+zip", desc: "EPUB ebook" },
  { ext: "mobi", mime: "application/x-mobipocket-ebook", desc: "Mobipocket ebook" },
];

export function MimeTypes() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MIME_TYPES;
    return MIME_TYPES.filter(
      (m) =>
        m.ext.includes(q) ||
        m.mime.toLowerCase().includes(q) ||
        m.desc.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by extension, MIME, or description…"
        className="h-8 text-xs"
        spellCheck={false}
      />

      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/20">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr className="text-muted-foreground">
              <th className="w-20 px-2 py-1.5 font-medium">Ext</th>
              <th className="px-2 py-1.5 font-medium">MIME type</th>
              <th className="hidden px-2 py-1.5 font-medium sm:table-cell">Description</th>
              <th className="w-10 px-2 py-1.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                  No MIME types match &quot;{query}&quot;
                </td>
              </tr>
            ) : (
              filtered.map((m, i) => (
                <tr key={i} className="border-t hover:bg-muted/40">
                  <td className="px-2 py-1.5">
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-emerald-700 dark:text-emerald-400">
                      .{m.ext}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 font-mono">{m.mime}</td>
                  <td className="hidden px-2 py-1.5 text-muted-foreground sm:table-cell">{m.desc}</td>
                  <td className="px-2 py-1.5 text-right">
                    <CopyButton value={m.mime} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} of {MIME_TYPES.length} types shown
      </p>
    </div>
  );
}
