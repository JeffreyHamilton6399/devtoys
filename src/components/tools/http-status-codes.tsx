"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/devtoys/copy-button";

interface StatusCode {
  code: number;
  label: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  description: string;
}

// Full IANA HTTP status code registry (commonly-used subset, 60+ codes)
const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, label: "Continue", category: "1xx", description: "Initial part of a request received; client should proceed with the rest." },
  { code: 101, label: "Switching Protocols", category: "1xx", description: "Server is switching protocols per the Upgrade header (e.g. to WebSocket)." },
  { code: 102, label: "Processing", category: "1xx", description: "Server received the request but is still processing it (WebDAV)." },
  { code: 103, label: "Early Hints", category: "1xx", description: "Server hints the client about resources that may be needed (preload)." },

  // 2xx Success
  { code: 200, label: "OK", category: "2xx", description: "Standard success response for GET, PUT, PATCH, or DELETE." },
  { code: 201, label: "Created", category: "2xx", description: "Request succeeded and a new resource was created (POST)." },
  { code: 202, label: "Accepted", category: "2xx", description: "Request accepted for processing but not yet completed (async)." },
  { code: 203, label: "Non-Authoritative Information", category: "2xx", description: "Returned metadata is from a local or third-party copy, not the origin." },
  { code: 204, label: "No Content", category: "2xx", description: "Success, no body to return (e.g. DELETE succeeded)." },
  { code: 205, label: "Reset Content", category: "2xx", description: "Success; client should reset the document view (clear form)." },
  { code: 206, label: "Partial Content", category: "2xx", description: "Server is delivering only part of the resource (Range request)." },
  { code: 207, label: "Multi-Status", category: "2xx", description: "XML body contains status codes for multiple independent operations (WebDAV)." },
  { code: 208, label: "Already Reported", category: "2xx", description: "Members of a DAV binding already enumerated in a previous reply." },
  { code: 226, label: "IM Used", category: "2xx", description: "Server fulfilled a GET with instance manipulation (delta encoding)." },

  // 3xx Redirection
  { code: 300, label: "Multiple Choices", category: "3xx", description: "Resource has multiple representations; client picks one." },
  { code: 301, label: "Moved Permanently", category: "3xx", description: "Resource has a new permanent URL. SEO link equity transfers." },
  { code: 302, label: "Found", category: "3xx", description: "Resource temporarily under a different URL. (Formerly 'Moved Temporarily'.)" },
  { code: 303, label: "See Other", category: "3xx", description: "Response to GET should be retrieved via a different URL (POST→GET redirect)." },
  { code: 304, label: "Not Modified", category: "3xx", description: "Cached version is still valid; no body sent. Conditional request." },
  { code: 305, label: "Use Proxy", category: "3xx", description: "Deprecated. Must access the resource via a proxy." },
  { code: 307, label: "Temporary Redirect", category: "3xx", description: "Same as 302 but preserves the original HTTP method." },
  { code: 308, label: "Permanent Redirect", category: "3xx", description: "Same as 301 but preserves the original HTTP method." },

  // 4xx Client Errors
  { code: 400, label: "Bad Request", category: "4xx", description: "Malformed syntax. Client should not repeat without modification." },
  { code: 401, label: "Unauthorized", category: "4xx", description: "Authentication required and missing/failed. Send WWW-Authenticate header." },
  { code: 402, label: "Payment Required", category: "4xx", description: "Reserved for future use — payment system required." },
  { code: 403, label: "Forbidden", category: "4xx", description: "Server understood but refuses to authorize. Auth won't help." },
  { code: 404, label: "Not Found", category: "4xx", description: "Resource does not exist on this server." },
  { code: 405, label: "Method Not Allowed", category: "4xx", description: "HTTP method not supported for this URL (e.g. POST to a GET-only route)." },
  { code: 406, label: "Not Acceptable", category: "4xx", description: "Resource can't generate a response matching the Accept headers." },
  { code: 407, label: "Proxy Authentication Required", category: "4xx", description: "Client must authenticate with the proxy first." },
  { code: 408, label: "Request Timeout", category: "4xx", description: "Server gave up waiting for the client's request." },
  { code: 409, label: "Conflict", category: "4xx", description: "Request conflicts with the current state of the resource (e.g. edit conflict)." },
  { code: 410, label: "Gone", category: "4xx", description: "Resource was permanently removed — unlike 404, this is intentional." },
  { code: 411, label: "Length Required", category: "4xx", description: "Server requires a Content-Length header." },
  { code: 412, label: "Precondition Failed", category: "4xx", description: "If-Match / If-Unmodified-Since condition evaluated to false." },
  { code: 413, label: "Payload Too Large", category: "4xx", description: "Request body exceeds the server's limit." },
  { code: 414, label: "URI Too Long", category: "4xx", description: "URL exceeds the server's length limit (e.g. GET with too many params)." },
  { code: 415, label: "Unsupported Media Type", category: "4xx", description: "Content-Type not supported by the server." },
  { code: 416, label: "Range Not Satisfiable", category: "4xx", description: "Range header can't be fulfilled for this resource." },
  { code: 417, label: "Expectation Failed", category: "4xx", description: "Expect header can't be met by the server." },
  { code: 418, label: "I'm a Teapot", category: "4xx", description: "RFC 2324 joke. Cannot brew coffee with a teapot." },
  { code: 421, label: "Misdirected Request", category: "4xx", description: "Request sent to a server that can't produce a response (HTTP/2)." },
  { code: 422, label: "Unprocessable Entity", category: "4xx", description: "Well-formed but semantically invalid (validation error in REST APIs)." },
  { code: 423, label: "Locked", category: "4xx", description: "Resource is locked (WebDAV)." },
  { code: 424, label: "Failed Dependency", category: "4xx", description: "Request failed because a dependent request failed (WebDAV)." },
  { code: 425, label: "Too Early", category: "4xx", description: "Server refuses to process to prevent replay attacks." },
  { code: 426, label: "Upgrade Required", category: "4xx", description: "Client must upgrade to a different protocol (e.g. TLS)." },
  { code: 428, label: "Precondition Required", category: "4xx", description: "Server requires conditional headers (If-Match, etc.)." },
  { code: 429, label: "Too Many Requests", category: "4xx", description: "Rate limit exceeded. Send Retry-After header." },
  { code: 431, label: "Request Header Fields Too Large", category: "4xx", description: "Headers too large; client should reduce them." },
  { code: 451, label: "Unavailable For Legal Reasons", category: "4xx", description: "Resource censored for legal reasons (govt takedown, GDPR, etc.)." },

  // 5xx Server Errors
  { code: 500, label: "Internal Server Error", category: "5xx", description: "Generic server-side failure. Check server logs." },
  { code: 501, label: "Not Implemented", category: "5xx", description: "Server doesn't support the HTTP method used." },
  { code: 502, label: "Bad Gateway", category: "5xx", description: "Upstream server returned an invalid response (proxy/gateway issue)." },
  { code: 503, label: "Service Unavailable", category: "5xx", description: "Server temporarily overloaded or down for maintenance. Send Retry-After." },
  { code: 504, label: "Gateway Timeout", category: "5xx", description: "Upstream server didn't respond in time." },
  { code: 505, label: "HTTP Version Not Supported", category: "5xx", description: "Server doesn't support the HTTP protocol version in the request." },
  { code: 506, label: "Variant Also Negotiates", category: "5xx", description: "Transparent content negotiation configuration error." },
  { code: 507, label: "Insufficient Storage", category: "5xx", description: "Server can't store the representation (WebDAV)." },
  { code: 508, label: "Loop Detected", category: "5xx", description: "Server detected an infinite loop while processing (WebDAV)." },
  { code: 510, label: "Not Extended", category: "5xx", description: "Further extensions to the request are required." },
  { code: 511, label: "Network Authentication Required", category: "5xx", description: "Client must authenticate to gain network access (captive portals)." },
];

const CATEGORY_COLORS: Record<StatusCode["category"], { bg: string; text: string; label: string }> = {
  "1xx": { bg: "bg-sky-500/15", text: "text-sky-700 dark:text-sky-300", label: "Informational" },
  "2xx": { bg: "bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300", label: "Success" },
  "3xx": { bg: "bg-amber-500/15", text: "text-amber-700 dark:text-amber-300", label: "Redirection" },
  "4xx": { bg: "bg-orange-500/15", text: "text-orange-700 dark:text-orange-300", label: "Client Error" },
  "5xx": { bg: "bg-rose-500/15", text: "text-rose-700 dark:text-rose-300", label: "Server Error" },
};

export function HttpStatusCodes() {
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<StatusCode["category"] | "all">("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return STATUS_CODES.filter((sc) => {
      if (activeCategory !== "all" && sc.category !== activeCategory) return false;
      if (!q) return true;
      return (
        String(sc.code).includes(q) ||
        sc.label.toLowerCase().includes(q) ||
        sc.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by code, name, or description (e.g. 'rate', '404', 'gateway')..."
        className="h-8 text-xs"
        spellCheck={false}
      />

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-md px-2 py-1 text-xs transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "border bg-background hover:bg-accent"
          }`}
        >
          All ({STATUS_CODES.length})
        </button>
        {(["1xx", "2xx", "3xx", "4xx", "5xx"] as const).map((cat) => {
          const count = STATUS_CODES.filter((s) => s.category === cat).length;
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : `border ${color.bg} ${color.text} hover:opacity-80`
              }`}
            >
              {cat} {color.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/20">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
            <tr className="text-muted-foreground">
              <th className="w-14 px-2 py-1.5 font-medium">Code</th>
              <th className="w-32 px-2 py-1.5 font-medium">Label</th>
              <th className="px-2 py-1.5 font-medium">Description</th>
              <th className="w-10 px-2 py-1.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">
                  No status codes match "{query}"
                </td>
              </tr>
            ) : (
              filtered.map((sc) => {
                const color = CATEGORY_COLORS[sc.category];
                return (
                  <tr key={sc.code} className="border-t hover:bg-muted/40">
                    <td className="px-2 py-1.5">
                      <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 font-mono font-semibold ${color.bg} ${color.text}`}>
                        {sc.code}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 font-medium">{sc.label}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">{sc.description}</td>
                    <td className="px-2 py-1.5 text-right">
                      <CopyButton value={String(sc.code)} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} of {STATUS_CODES.length} codes shown · Click any copy icon to copy the numeric code.
      </p>
    </div>
  );
}
