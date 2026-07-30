import ReactMarkdown from "react-markdown";

type MarkdownMessageProps = {
  content: string;
};

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        components={{
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0">{children}</ol>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ children }) => (
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[13px]">
            {children}
          </code>
        ),
      }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
