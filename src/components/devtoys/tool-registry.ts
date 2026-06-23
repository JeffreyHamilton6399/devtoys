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

export interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType;
}

export const TOOLS: Tool[] = [
  { id: "json", name: "JSON", icon: Braces, component: JsonFormatter },
  { id: "base64", name: "Base64", icon: Binary, component: Base64Tool },
  { id: "url", name: "URL", icon: LinkIcon, component: UrlEncoder },
  { id: "jwt", name: "JWT", icon: Key, component: JwtDecoder },
  { id: "regex", name: "Regex", icon: Regex, component: RegexTester },
  {
    id: "uuid",
    name: "UUID",
    icon: Fingerprint,
    component: UuidGenerator,
  },
  {
    id: "timestamp",
    name: "Timestamp",
    icon: Clock,
    component: TimestampConverter,
  },
  { id: "hash", name: "Hash", icon: Hash, component: HashGenerator },
  { id: "color", name: "Color", icon: Palette, component: ColorConverter },
  {
    id: "lorem",
    name: "Lorem",
    icon: Type,
    component: LoremIpsum,
  },
  { id: "cron", name: "Cron", icon: Calendar, component: CronParser },
  {
    id: "diff",
    name: "Diff",
    icon: GitCompare,
    component: DiffChecker,
  },
];

export const TOOLS_BY_ID: Record<string, Tool> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
);
