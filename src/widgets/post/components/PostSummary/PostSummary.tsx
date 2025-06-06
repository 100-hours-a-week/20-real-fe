import { MarkdownViewer } from '../../../../shared/ui/section/MarkdownViewer';

interface PostSummaryProps {
  summary: string;
}

export function PostSummary({ summary }: PostSummaryProps) {
  return (
    <div className="mx-4 mb-4 bg-gray-50 rounded-xl p-4">
      <div className="flex items-start">
        <div className="mr-3 text-amber-500 mt-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        </div>
        <div className="flex-1 text-sm text-gray-700">
          <MarkdownViewer text={summary} />
        </div>
      </div>
    </div>
  );
}
