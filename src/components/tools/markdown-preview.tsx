"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ClearButton } from "@/components/devtoys/action-buttons";
import ReactMarkdown from "react-markdown";

export function MarkdownPreview() {
  const [input, setInput] = React.useState("");

  const clear = () => setInput("");

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="grid flex-1 grid-rows-2 gap-2 overflow-hidden md:grid-cols-2 md:grid-rows-1">
        <div className="flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Markdown
            </label>
            <ClearButton onClear={clear} disabled={!input} />
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"# Hello DevToys\n\n- list item\n- **bold** and *italic*\n\n```js\nconst x = 42;\n```"}
            className="flex-1 resize-none bg-muted/40 font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-1.5 overflow-hidden">
          <label className="text-xs font-medium text-muted-foreground">
            Preview
          </label>
          <div className="flex-1 overflow-auto rounded-md border bg-background p-3">
            {input.trim() ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-2 mt-3 text-base font-bold first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-2 mt-3 text-sm font-bold first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-1 mt-2 text-sm font-semibold first:mt-0">{children}</h3>
                    ),
                    p: ({ children }) => <p className="mb-2 text-sm">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc pl-5 text-sm">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal pl-5 text-sm">{children}</ol>
                    ),
                    li: ({ children }) => <li className="text-sm">{children}</li>,
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 underline dark:text-emerald-400"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children, className }) => {
                      const isBlock = className?.includes("language-");
                      if (isBlock) {
                        return (
                          <code className="block rounded bg-muted/60 p-2 font-mono text-xs">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="rounded bg-muted/60 px-1 py-0.5 font-mono text-xs">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => <pre className="mb-2">{children}</pre>,
                    blockquote: ({ children }) => (
                      <blockquote className="mb-2 border-l-2 border-muted-foreground/30 pl-3 italic text-muted-foreground">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <table className="mb-2 w-full border-collapse text-xs">{children}</table>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border bg-muted/40 px-2 py-1 text-left font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-2 py-1">{children}</td>
                    ),
                    hr: () => <hr className="my-3 border-border" />,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                  }}
                >
                  {input}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Rendered HTML will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
