'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { FormEvent, useState } from 'react';

import { validateNoticeSearch } from '@/features/post/lib/validateNoticeSearch';
import { useNoticeListInfinityQuery } from '@/features/post/model/notices/useNoticeListInfinityQuery';
import { useToastStore } from '@/shared/model/toastStore';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { Button } from '@/shared/ui/component/Button';
import { Input } from '@/shared/ui/component/Input';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { NoticeListItem } from '@/widgets/post/components/NoticeListItem';

export function NoticeSearchPage() {
  const { showToast } = useToastStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchedKeyword = searchParams?.get('keyword') ?? '';
  const [searchTerm, setSearchTerm] = useState(searchedKeyword);

  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNoticeListInfinityQuery({ keyword: searchedKeyword });

  const loadingRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const validateMsg = validateNoticeSearch(searchTerm, 'search');
    if (validateMsg) {
      showToast(validateMsg, 'error');
      return;
    }

    const params = new URLSearchParams(searchParams?.toString());
    params.set('keyword', searchTerm);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="min-h-app bg-gray-50">
      <div className="max-w-app px-4 pt-8">
        {/* 검색 */}
        <div className="mb-8">
          <form className="relative w-full" onSubmit={handleSearch}>
            <Input
              placeholder="검색어를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-2 pr-14 py-2 text-lg rounded-xl "
            />
            <Button type="submit" size="icon" className="absolute right-2 top-1/9 rounded-lg">
              <Search className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* 검색 결과 */}
        <div className="space-y-3">
          {searchResults &&
            searchResults.map((notice) => (
              <Link key={notice.id} href={`/notices/${notice.id}`} className="virtualized-item">
                <NoticeListItem notice={notice} />
              </Link>
            ))}
        </div>
        <LoadingIndicator loadingRef={loadingRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
      </div>
    </div>
  );
}
