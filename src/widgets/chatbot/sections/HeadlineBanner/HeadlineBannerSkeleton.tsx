import { SkeletonBox } from '../../../../shared/ui/component/SkeletonBox';

export function HeadlineBannerSkeleton() {
  return (
    <div className="bg-white mx-4 mt-4 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 px-4 flex items-center space-x-3">
        <SkeletonBox className="w-6 h-6 rounded-full flex-shrink-0" />
        <SkeletonBox className="flex-1 h-4" />
        <SkeletonBox className="w-10 h-3" />
      </div>
    </div>
  );
}
