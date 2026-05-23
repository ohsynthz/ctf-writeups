import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-normal prose-headings:tracking-tight prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-code:bg-secondary prose-code:px-1 prose-code:text-sm prose-pre:border prose-pre:border-border prose-pre:bg-[#050505] prose-pre:p-4 prose-pre:text-sm prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        urlTransform={(url) => url}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
