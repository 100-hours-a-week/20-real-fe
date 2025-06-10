'use client';

import dynamic from 'next/dynamic';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';

import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

import { cn } from '@/shared/lib/cn';
import { normalizeMarkdown } from '@/shared/lib/normalizeMarkdown';

const PrismLight = dynamic(async () => {
  const res = await import('react-syntax-highlighter/dist/esm/prism-light');

  const [tsx, typescript, jsx, javascript, json, bash, python, java, sql] = await Promise.all([
    import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
    import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
    import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
    import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
    import('react-syntax-highlighter/dist/esm/languages/prism/json'),
    import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
    import('react-syntax-highlighter/dist/esm/languages/prism/python'),
    import('react-syntax-highlighter/dist/esm/languages/prism/java'),
    import('react-syntax-highlighter/dist/esm/languages/prism/sql'),
  ]);

  res.default.registerLanguage('tsx', tsx.default);
  res.default.registerLanguage('ts', typescript.default);
  res.default.registerLanguage('jsx', jsx.default);
  res.default.registerLanguage('js', javascript.default);
  res.default.registerLanguage('json', json.default);
  res.default.registerLanguage('bash', bash.default);
  res.default.registerLanguage('python', python.default);
  res.default.registerLanguage('java', java.default);
  res.default.registerLanguage('sql', sql.default);

  return res;
});

interface MarkdownViewerProps {
  text: string;
  className?: string;
  useHtml?: boolean;
  useSyntaxHighlight?: boolean;
}

export function MarkdownViewer({ text, className, useHtml = false, useSyntaxHighlight = false }: MarkdownViewerProps) {
  const [rehypePlugins, setRehypePlugins] = useState<PluggableList>([]);

  useEffect(() => {
    if (!useHtml) return;
    const loadPlugins = async () => {
      const [{ default: rehypeRaw }, { default: rehypeSanitize, defaultSchema }] = await Promise.all([
        import('rehype-raw'),
        import('rehype-sanitize'),
      ]);

      setRehypePlugins([
        rehypeRaw,
        [
          rehypeSanitize,
          {
            ...defaultSchema,
            tagNames: defaultSchema.tagNames?.filter(
              (tag) => !['script', 'style', 'iframe', 'object', 'embed', 'form'].includes(tag),
            ),
          },
        ],
      ]);
    };

    loadPlugins();
  }, []);
  return (
    <div className={cn(`text-black text-sm/6 break-all`, className)}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={rehypePlugins}
        components={{
          h1: (props) => <h1 className="text-2xl font-bold mt-6 pb-2 mb-2 border-b-1 border-gray-300" {...props} />,
          h2: (props) => <h2 className="text-xl font-bold mt-5 pb-2 mb-2 border-b-1 border-gray-300" {...props} />,
          h3: (props) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
          p: (props) => <p className="text-sm leading-6 mb-2" {...props} />,
          ul: (props) => <ul className="list-disc list-outside ml-5 mb-2" {...props} />,
          ol: (props) => <ol className="list-decimal list-outside ml-5 mb-2" {...props} />,
          li: (props) => <li className="ml-2" {...props} />,
          a: (props) => (
            <a
              className="text-blue-600 underline hover:text-blue-800 break-words max-w-full inline-block mb-2"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: (props) => <strong className="font-semibold text-black mb-2" {...props} />,
          blockquote: (props) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />
          ),
          table: (props) => (
            <div className="overflow-x-auto">
              <table className="table-auto border border-gray-600 border-collapse w-full min-w-[600px]" {...props} />
            </div>
          ),
          th: (props) => <th className="border border-gray-600 px-2 py-1 bg-gray-100 text-left" {...props} />,
          td: (props) => <td className="border border-gray-600 px-2 py-1 whitespace-pre-line break-words" {...props} />,
          aside: (props) => <aside {...props} />,
          tr: (props) => <tr className="even:bg-gray-50" {...props} />,
          code: ({ children, className }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (match && useSyntaxHighlight) {
              return (
                <PrismLight language={match[1]} PreTag="div">
                  {codeString}
                </PrismLight>
              );
            }

            return (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-primary-700 mb-2">
                {codeString}
              </code>
            );
          },
        }}
      >
        {normalizeMarkdown(text)}
        {/*{text}*/}
      </Markdown>
    </div>
  );
}
