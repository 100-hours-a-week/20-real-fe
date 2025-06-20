import { Pencil, Trash } from 'lucide-react';

import { PostPlatform } from '@/entities/post/postPlatform';
import { formatTime, isRecent } from '@/shared/lib/utils/times';
import { Button } from '@/shared/ui/component/Button';

interface PostHeaderProps {
  tags?: string[];
  title: string;
  author?: string | null;
  viewCount?: number | null;
  createdAt: string;
  platform?: PostPlatform | null;
  originalUrl?: string | null;
  showAdminButton?: boolean;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
}

export function PostHeader({
  tags = [],
  showAdminButton = false,
  title,
  author,
  viewCount,
  createdAt,
  originalUrl,
  platform,
  onClickEdit,
  onClickDelete,
}: PostHeaderProps) {
  const displayTags = isRecent(createdAt) ? ['최신', ...tags] : tags;

  return (
    <>
      <div className="flex flex-row items-center">
        {displayTags.length > 0 && (
          <div className="flex flex-row px-4 pt-4 pb-2 gap-2 flex-1">
            {displayTags?.slice(0, 6).map((tag) => (
              <div
                key={tag}
                className={`inline-block ${tag === '최신' ? 'bg-primary-50 text-primary-500' : 'bg-neutral-100 text-neutral-600'}  rounded-full px-3 py-1 text-xs font-semibold`}
                data-testid={`post-header-tag`}
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        {showAdminButton && (
          <div className="px-4 pt-2 ">
            <Button variant="plain" size="icon" onClick={onClickEdit}>
              <Pencil size={18} className="text-gray-500" />
            </Button>

            <Button variant="plain" size="icon" onClick={onClickDelete}>
              <Trash size={18} className="text-gray-500" />
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 pb-2">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm text-gray-500">
            {author && (
              <>
                <span className="font-medium text-primary-500">{author}</span>
                <span className="mx-1">•</span>
              </>
            )}
            {viewCount && (
              <>
                <span className="font-medium text-primary-500">조회수 {viewCount}</span>
                <span className="mx-1">•</span>
              </>
            )}
            <span>{formatTime(createdAt)}</span>
          </div>
          {originalUrl && platform && (
            <Button variant="plain" size="sm" className="flex items-center bg-indigo-50 rounded-full">
              <a href={originalUrl} target="_blank" className="text-xs font-medium text-primary-500 flex items-center">
                {platform}
              </a>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
