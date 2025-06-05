import { Trash } from 'lucide-react';

import { PostComment } from '@/entities/post/postComment';
import { formatTime } from '@/shared/lib/times';

import { Button } from '../../../../shared/ui/component/Button';
import { SafeImage } from '../../../../shared/ui/component/SafeImage';

interface PostCommentItemProps {
  comment: PostComment;
  onDelete: (commentId: number) => void;
}

export function PostCommentItem({ comment, onDelete }: PostCommentItemProps) {
  return (
    <div className="px-4 py-3 flex items-start">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <SafeImage src={comment.profileUrl} alt={comment.nickname} width={32} height={32} />
      </div>
      <div className="ml-3 flex-1">
        <span className="font-medium text-sm pr-2 text-gray-900">{comment.nickname}</span>
        <span className="text-gray-400 text-xs">{formatTime(comment.createdAt)}</span>

        <p className="text-gray-600 text-sm mt-1">{comment.content}</p>
      </div>

      {comment.isAuthor && (
        <Button variant="ghost" size="icon" className="flex items-center" onClick={() => onDelete(comment.id)}>
          <Trash size={14} className="text-gray-400" />
        </Button>
      )}
    </div>
  );
}
