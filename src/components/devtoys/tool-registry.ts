import * as React from "react";
import {
  Braces,
  Binary,
  Link as LinkIcon,
  Key,
  Regex,
  Fingerprint,
  Clock,
  Hash,
  Palette,
  Type,
  Calendar,
  GitCompare,
  FileText,
  FileCode2,
  Lock,
  CaseSensitive,
  Code,
  Calculator,
  AlignLeft,
  AtSign,
  Globe,
  Server,
  Quote,
  Image as ImageIcon,
  Table,
  ListOrdered,
  Binary as BinaryIcon,
  Languages,
  Pilcrow,
  Eraser,
  FlipHorizontal2,
  Ruler,
  CalendarClock,
  ShieldCheck,
  FileSearch,
  Hourglass,
  KeyRound,
  Network,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

import { JsonFormatter } from "@/components/tools/json-formatter";
import { Base64Tool } from "@/components/tools/base64-tool";
import { UrlEncoder } from "@/components/tools/url-encoder";
import { JwtDecoder } from "@/components/tools/jwt-decoder";
import { RegexTester } from "@/components/tools/regex-tester";
import { UuidGenerator } from "@/components/tools/uuid-generator";
import { TimestampConverter } from "@/components/tools/timestamp-converter";
import { HashGenerator } from "@/components/tools/hash-generator";
import { ColorConverter } from "@/components/tools/color-converter";
import { LoremIpsum } from "@/components/tools/lorem-ipsum";
import { CronParser } from "@/components/tools/cron-parser";
import { DiffChecker } from "@/components/tools/diff-checker";
import { MarkdownPreview } from "@/components/tools/markdown-preview";
import { JsonToTs } from "@/components/tools/json-to-ts";
import { PasswordGenerator } from "@/components/tools/password-generator";
import { CaseConverter } from "@/components/tools/case-converter";
import { HtmlEntities } from "@/components/tools/html-entities";
import { BaseConverter } from "@/components/tools/base-converter";
import { TextStats } from "@/components/tools/text-stats";
import { SlugGenerator } from "@/components/tools/slug-generator";
import { UrlParser } from "@/components/tools/url-parser";
import { HttpStatusCodes } from "@/components/tools/http-status-codes";
import { StringEscape } from "@/components/tools/string-escape";
import { ImageToBase64 } from "@/components/tools/image-to-base64";
import { JsonCsvConverter } from "@/components/tools/json-csv-converter";
import { LineSorter } from "@/components/tools/line-sorter";
import { HexAscii } from "@/components/tools/hex-ascii";
import { UnicodeInspector } from "@/components/tools/unicode-inspector";
import { TabSpaces } from "@/components/tools/tab-spaces";
import { WhitespaceNormalizer } from "@/components/tools/whitespace-normalizer";
import { StringReverser } from "@/components/tools/string-reverser";
import { CssUnitConverter } from "@/components/tools/css-unit-converter";
import { DateCalculator } from "@/components/tools/date-calculator";
import { UnixPermissions } from "@/components/tools/unix-permissions";
import { MimeTypes } from "@/components/tools/mime-types";
import { TimeZoneConverter } from "@/components/tools/time-zone-converter";
import { CaesarCipher } from "@/components/tools/caesar-cipher";
import { PassphraseGenerator } from "@/components/tools/passphrase-generator";
import { SubnetCalculator } from "@/components/tools/subnet-calculator";
import { HashIdentifier } from "@/components/tools/hash-identifier";

export interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  component: React.ComponentType;
}

export const TOOLS: Tool[] = [
  // Original 12
  { id: "json", name: "JSON", icon: Braces, description: "Format, minify, and validate JSON", component: JsonFormatter },
  { id: "base64", name: "Base64", icon: Binary, description: "Encode and decode Base64 (UTF-8 safe)", component: Base64Tool },
  { id: "url", name: "URL", icon: LinkIcon, description: "URL-encode and URL-decode text", component: UrlEncoder },
  { id: "jwt", name: "JWT", icon: Key, description: "Decode JWT header, payload, and signature", component: JwtDecoder },
  { id: "regex", name: "Regex", icon: Regex, description: "Test regex with flags and capture groups", component: RegexTester },
  { id: "uuid", name: "UUID", icon: Fingerprint, description: "Generate v4 UUIDs with crypto.randomUUID", component: UuidGenerator },
  { id: "timestamp", name: "Timestamp", icon: Clock, description: "Convert Unix timestamps to human dates", component: TimestampConverter },
  { id: "hash", name: "Hash", icon: Hash, description: "Compute MD5, SHA-1, SHA-256, SHA-512", component: HashGenerator },
  { id: "color", name: "Color", icon: Palette, description: "Convert between HEX, RGB, and HSL", component: ColorConverter },
  { id: "lorem", name: "Lorem", icon: Type, description: "Generate placeholder lorem ipsum text", component: LoremIpsum },
  { id: "cron", name: "Cron", icon: Calendar, description: "Parse cron expressions into schedules", component: CronParser },
  { id: "diff", name: "Diff", icon: GitCompare, description: "Compare two texts line by line", component: DiffChecker },
  // Second batch (8)
  { id: "markdown", name: "Markdown", icon: FileText, description: "Render Markdown into live HTML", component: MarkdownPreview },
  { id: "json-ts", name: "JSON→TS", icon: FileCode2, description: "Generate TypeScript interfaces from JSON", component: JsonToTs },
  { id: "password", name: "Password", icon: Lock, description: "Generate cryptographically secure passwords", component: PasswordGenerator },
  { id: "case", name: "Case", icon: CaseSensitive, description: "Convert text between 10 case styles", component: CaseConverter },
  { id: "html-ent", name: "HTML Entity", icon: Code, description: "Encode and decode HTML entities", component: HtmlEntities },
  { id: "base", name: "Base", icon: Calculator, description: "Convert numbers between bases (bin/hex/b58)", component: BaseConverter },
  { id: "stats", name: "Text Stats", icon: AlignLeft, description: "Count words, characters, sentences, and more", component: TextStats },
  { id: "slug", name: "Slug", icon: AtSign, description: "Generate URL-safe slugs from any text", component: SlugGenerator },
  // Third batch (3)
  { id: "url-parse", name: "URL Parser", icon: Globe, description: "Break a URL into its component parts", component: UrlParser },
  { id: "http", name: "HTTP Codes", icon: Server, description: "Searchable HTTP status code reference", component: HttpStatusCodes },
  { id: "escape", name: "Escape", icon: Quote, description: "Escape and unescape strings for 5 formats", component: StringEscape },
  // Fourth batch (3)
  { id: "img-base64", name: "Image→B64", icon: ImageIcon, description: "Drop, paste, or upload an image — get a data URI", component: ImageToBase64 },
  { id: "json-csv", name: "JSON↔CSV", icon: Table, description: "Convert an array of objects between JSON and CSV", component: JsonCsvConverter },
  { id: "line-sort", name: "Line Sort", icon: ListOrdered, description: "Sort, deduplicate, reverse, or shuffle lines", component: LineSorter },
  // Fifth batch (14)
  { id: "hex-ascii", name: "HEX↔ASCII", icon: BinaryIcon, description: "Convert hex bytes to ASCII text and back", component: HexAscii },
  { id: "unicode", name: "Unicode", icon: Languages, description: "Inspect a character's codepoint, UTF-8, UTF-16, HTML entity", component: UnicodeInspector },
  { id: "tab-spaces", name: "Tab↔Spaces", icon: Pilcrow, description: "Convert tabs to spaces and back, configurable width", component: TabSpaces },
  { id: "whitespace", name: "Whitespace", icon: Eraser, description: "Collapse spaces, trim lines, normalize line endings", component: WhitespaceNormalizer },
  { id: "reverse", name: "Reverse", icon: FlipHorizontal2, description: "Reverse text by characters, words, or lines", component: StringReverser },
  { id: "css-unit", name: "CSS Units", icon: Ruler, description: "Convert px ↔ rem ↔ em ↔ pt ↔ vw with base size", component: CssUnitConverter },
  { id: "date-calc", name: "Date Calc", icon: CalendarClock, description: "Add/subtract days, calculate date differences", component: DateCalculator },
  { id: "chmod", name: "chmod", icon: ShieldCheck, description: "Convert Unix permissions: numeric ↔ symbolic", component: UnixPermissions },
  { id: "mime", name: "MIME Types", icon: FileSearch, description: "Searchable file extension → MIME type reference", component: MimeTypes },
  { id: "timezone", name: "Time Zone", icon: Hourglass, description: "Convert a time across major world time zones", component: TimeZoneConverter },
  { id: "caesar", name: "Caesar/ROT13", icon: KeyRound, description: "Caesar cipher with adjustable shift, including ROT13", component: CaesarCipher },
  { id: "passphrase", name: "Passphrase", icon: KeyRound, description: "Generate memorable Diceware-style word passphrases", component: PassphraseGenerator },
  { id: "subnet", name: "Subnet", icon: Network, description: "IPv4 CIDR calculator: network, broadcast, host range", component: SubnetCalculator },
  { id: "hash-id", name: "Hash ID", icon: ScanSearch, description: "Identify a hash's likely algorithm by length and charset", component: HashIdentifier },
];

export const TOOLS_BY_ID: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
);
