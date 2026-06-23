// Minimal but useful cron expression parser.
// Supports 5-field standard cron: minute hour day-of-month month day-of-week.
// Supports: *, comma lists, ranges (1-5), step values (*/5, 1-10/2), named months/days.

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const DAY_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

export interface CronParseResult {
  ok: boolean;
  error?: string;
  description?: string;
  nextRuns?: Date[];
}

function parseField(
  field: string,
  min: number,
  max: number,
  names?: Record<string, number>,
): Set<number> | { error: string } {
  const result = new Set<number>();
  if (!field) return { error: "Empty field" };
  if (field === "*") {
    for (let i = min; i <= max; i++) result.add(i);
    return result;
  }
  for (const part of field.split(",")) {
    const stepMatch = part.match(/^(.+?)\/(\d+)$/);
    let range = part;
    let step = 1;
    if (stepMatch) {
      range = stepMatch[1];
      step = parseInt(stepMatch[2], 10);
      if (!step || step < 1) return { error: `Invalid step in "${part}"` };
    }
    let start: number;
    let end: number;
    if (range === "*") {
      start = min;
      end = max;
    } else if (range.includes("-")) {
      const [a, b] = range.split("-");
      start = parseToken(a, names);
      end = parseToken(b, names);
      if (isNaN(start) || isNaN(end)) return { error: `Invalid range "${range}"` };
    } else {
      start = parseToken(range, names);
      if (isNaN(start)) return { error: `Invalid value "${range}"` };
      end = stepMatch ? max : start;
    }
    if (start < min || end > max || start > end) {
      return { error: `Value out of range in "${part}" (allowed ${min}-${max})` };
    }
    for (let v = start; v <= end; v += step) result.add(v);
  }
  return result;
}

function parseToken(tok: string, names?: Record<string, number>): number {
  const t = tok.trim().toLowerCase();
  if (names && names[t] !== undefined) return names[t];
  const n = parseInt(t, 10);
  return isNaN(n) ? NaN : n;
}

function describe(set: Set<number>, singular: string, plural: string, min: number, max: number): string {
  if (set.size === max - min + 1) return `every ${plural}`;
  const arr = Array.from(set).sort((a, b) => a - b);
  if (arr.length === 1) return `${singular} ${arr[0]}`;
  return `${plural} ${arr.join(", ")}`;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const DAY_NAMES_FULL = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];
const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function parseCron(expr: string): CronParseResult {
  const trimmed = expr.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    return { ok: false, error: "Expected 5 fields: minute hour day-of-month month day-of-week" };
  }
  const [minF, hourF, domF, monF, dowF] = parts;

  const minute = parseField(minF, 0, 59);
  if (minute instanceof Error || !("size" in minute)) {
    return { ok: false, error: `Minute: ${(minute as any).error}` };
  }
  const hour = parseField(hourF, 0, 23);
  if (!("size" in hour)) return { ok: false, error: `Hour: ${(hour as any).error}` };
  const dom = parseField(domF, 1, 31);
  if (!("size" in dom)) return { ok: false, error: `Day of month: ${(dom as any).error}` };
  const mon = parseField(monF, 1, 12, MONTH_NAMES);
  if (!("size" in mon)) return { ok: false, error: `Month: ${(mon as any).error}` };
  const dow = parseField(dowF, 0, 6, DAY_NAMES);
  if (!("size" in dow)) return { ok: false, error: `Day of week: ${(dow as any).error}` };

  // Build description
  const minDesc = describe(minute as Set<number>, "minute", "minutes", 0, 59);
  const hourDesc = describe(hour as Set<number>, "hour", "hours", 0, 23);
  const domDesc = describe(dom as Set<number>, "day", "days", 1, 31);
  const monDesc = describe(mon as Set<number>, "month", "months", 1, 12);
  const dowDesc = describeSetDow(dow as Set<number>);

  const timeText = timeDesc(minute as Set<number>, hour as Set<number>);
  const prefix = /^(every|hourly)/.test(timeText) ? "" : "At ";
  let description = `${prefix}${timeText}`;
  if ((dow as Set<number>).size !== 7) description += `, ${dowDesc}`;
  if ((dom as Set<number>).size !== 31) description += `, on ${domDesc}`;
  if ((mon as Set<number>).size !== 12) description += `, in ${monDesc}`;

  // Next 5 runs
  const nextRuns = computeNextRuns(
    minute as Set<number>,
    hour as Set<number>,
    dom as Set<number>,
    mon as Set<number>,
    dow as Set<number>,
    5,
  );

  return { ok: true, description, nextRuns };
}

function describeSetDow(set: Set<number>): string {
  if (set.size === 7) return "every day";
  const arr = Array.from(set).sort((a, b) => a - b);
  return arr.map((d) => DAY_NAMES_FULL[d]).join(", ");
}

function timeDesc(minute: Set<number>, hour: Set<number>): string {
  if (minute.size === 60 && hour.size === 24) return "every minute";
  const arr = Array.from(minute).sort((a, b) => a - b);
  const minStr = arr.map((m) => String(m).padStart(2, "0")).join(",");
  if (minute.size === 60) {
    return `every minute past ${Array.from(hour).sort((a, b) => a - b).map((h) => formatHour(h)).join(", ")}`;
  }
  if (hour.size === 24) {
    if (arr.length === 1 && arr[0] === 0) return "hourly";
    return `every hour at minute ${arr.join(", ")}`;
  }
  const hours = Array.from(hour).sort((a, b) => a - b);
  return hours.map((h) => formatTime(h, minStr)).join(", ");
}

function formatHour(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${String(hr).padStart(2, "0")} ${period}`;
}

function formatTime(h: number, minStr: string): string {
  const period = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${String(hr).padStart(2, "0")}:${minStr} ${period}`;
}

function computeNextRuns(
  minute: Set<number>,
  hour: Set<number>,
  dom: Set<number>,
  mon: Set<number>,
  dow: Set<number>,
  count: number,
): Date[] {
  const results: Date[] = [];
  const now = new Date();
  const cur = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes() + 1,
    0,
    0,
  );
  let safety = 0;
  while (results.length < count && safety < 500000) {
    safety++;
    if (!mon.has(cur.getMonth() + 1)) {
      cur.setMonth(cur.getMonth() + 1, 1);
      cur.setHours(0, 0, 0, 0);
      continue;
    }
    if (!dom.has(cur.getDate()) || !dow.has(cur.getDay())) {
      cur.setDate(cur.getDate() + 1);
      cur.setHours(0, 0, 0, 0);
      continue;
    }
    if (!hour.has(cur.getHours())) {
      cur.setHours(cur.getHours() + 1, 0, 0, 0);
      continue;
    }
    if (!minute.has(cur.getMinutes())) {
      cur.setMinutes(cur.getMinutes() + 1, 0, 0);
      continue;
    }
    results.push(new Date(cur));
    cur.setMinutes(cur.getMinutes() + 1, 0, 0);
  }
  return results;
}

export const CRON_PRESETS: { label: string; expr: string }[] = [
  { label: "Every minute", expr: "* * * * *" },
  { label: "Every 5 minutes", expr: "*/5 * * * *" },
  { label: "Every 15 minutes", expr: "*/15 * * * *" },
  { label: "Hourly", expr: "0 * * * *" },
  { label: "Daily at midnight", expr: "0 0 * * *" },
  { label: "Daily at 9 AM", expr: "0 9 * * *" },
  { label: "Weekdays 9 AM", expr: "0 9 * * 1-5" },
  { label: "Weekly (Sun midnight)", expr: "0 0 * * 0" },
  { label: "Monthly (1st, 0:00)", expr: "0 0 1 * *" },
  { label: "Yearly (Jan 1, 0:00)", expr: "0 0 1 1 *" },
];
