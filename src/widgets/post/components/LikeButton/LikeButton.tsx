import { Heart } from 'lucide-react';

import { Button } from '../../../../shared/ui/component/Button';

interface LikeButtonProps {
  onClickAction: () => void;
  userLike: boolean;
  likeCount: number;
}

export function LikeButton({ onClickAction, userLike, likeCount }: LikeButtonProps) {
  return (
    <div className="px-4 mb-4 flex justify-center">
      <Button
        variant="plain"
        onClick={onClickAction}
        className={`px-6 py-2 rounded-full ${userLike ? 'bg-secondary-100 text-secondary-400' : 'bg-gray-100 text-gray-500'} transition-all`}
        aria-pressed={userLike}
        data-testid="like-button"
      >
        <Heart size={16} className={`mr-2 ${userLike ? 'fill-secondary-500 text-secondary-400' : ''}`} />
        <span className="font-medium" data-testid="like-count">
          {likeCount}
        </span>
      </Button>
    </div>
  );
}
