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

export interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType;
}

export const TOOLS: Tool[] = [
  // Original 12
  { id: "json", name: "JSON", icon: Braces, component: JsonFormatter },
  { id: "base64", name: "Base64", icon: Binary, component: Base64Tool },
  { id: "url", name: "URL", icon: LinkIcon, component: UrlEncoder },
  { id: "jwt", name: "JWT", icon: Key, component: JwtDecoder },
  { id: "regex", name: "Regex", icon: Regex, component: RegexTester },
  { id: "uuid", name: "UUID", icon: Fingerprint, component: UuidGenerator },
  { id: "timestamp", name: "Timestamp", icon: Clock, component: TimestampConverter },
  { id: "hash", name: "Hash", icon: Hash, component: HashGenerator },
  { id: "color", name: "Color", icon: Palette, component: ColorConverter },
  { id: "lorem", name: "Lorem", icon: Type, component: LoremIpsum },
  { id: "cron", name: "Cron", icon: Calendar, component: CronParser },
  { id: "diff", name: "Diff", icon: GitCompare, component: DiffChecker },
  // New 8
  { id: "markdown", name: "Markdown", icon: FileText, component: MarkdownPreview },
  { id: "json-ts", name: "JSON→TS", icon: FileCode2, component: JsonToTs },
  { id: "password", name: "Password", icon: Lock, component: PasswordGenerator },
  { id: "case", name: "Case", icon: CaseSensitive, component: CaseConverter },
  { id: "html-ent", name: "HTML Entity", icon: Code, component: HtmlEntities },
  { id: "base", name: "Base", icon: Calculator, component: BaseConverter },
  { id: "stats", name: "Text Stats", icon: AlignLeft, component: TextStats },
  { id: "slug", name: "Slug", icon: AtSign, component: SlugGenerator },
];

export const TOOLS_BY_ID: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
);
