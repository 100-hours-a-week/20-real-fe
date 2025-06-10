import { ArrowUp, MessageCircle } from 'lucide-react';

import { ChangeEvent, FormEvent } from 'react';

import { Button } from '../../../../shared/ui/component/Button';
import { Input } from '../../../../shared/ui/component/Input';

interface PostCommentFormProps {
  comment: string;
  setComment: (e: ChangeEvent<HTMLInputElement>) => void;
  commentCount: number;
  onSubmitComment: (e: FormEvent) => void;
}

export function PostCommentForm({ comment, setComment, commentCount, onSubmitComment }: PostCommentFormProps) {
  return (
    <div className="px-4 py-3 border-t border-gray-100 flex flex-col justify-between items-start gap-3">
      <div className="flex items-center text-gray-500">
        <MessageCircle size={16} className="mr-1" />
        <span className="text-sm font-medium" data-testid="post-comment-count">
          댓글 {commentCount}
        </span>
      </div>

      <form onSubmit={onSubmitComment} className="flex w-full gap-3 justify-center items-center">
        <Input className="flex-1 rounded-xl" data-testid="post-comment-input" value={comment} onChange={setComment} />

        <Button variant="outline" size="icon" className="shrink-0" type="submit" data-testid="post-comment-button">
          <ArrowUp size={18} />
        </Button>
      </form>
    </div>
  );
}
