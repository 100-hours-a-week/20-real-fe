'use client';

import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { FormEvent, useState } from 'react';

import { validateWikiTitle } from '@/features/wiki/lib/validateWiki';
import { useWikiSearchListInfinityQuery } from '@/features/wiki/model/useWikiSearchListInfinityQuery';
import { useToastStore } from '@/shared/model/toastStore';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { Button } from '@/shared/ui/component/Button';
import { Input } from '@/shared/ui/component/Input';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';

export function WikiSearchPage() {
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
  } = useWikiSearchListInfinityQuery({ sort: 'TITLE', keyword: searchedKeyword });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const validateMsg = validateWikiTitle(searchTerm, 'search');
    if (validateMsg) {
      showToast(validateMsg, 'error');
      return;
    }

    const params = new URLSearchParams(searchParams?.toString());
    params.set('keyword', searchTerm);
    router.push(`?${params.toString()}`);
  };

  const handleDirectWikiPage = () => {
    const validateMsg = validateWikiTitle(searchTerm);
    if (validateMsg) {
      showToast(validateMsg, 'error');
      return;
    }
    router.push(`/wiki/${encodeURIComponent(searchedKeyword)}`);
  };

  const loadingRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

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

        {/* 문서 다이렉트 링크 */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">찾는 문서가 없나요?</span>
            <Button
              variant="outline"
              onClick={handleDirectWikiPage}
              className="h-fit py-2 bg-white rounded-xl max-w-[220px] whitespace-normal break-all"
            >
              &#39;{searchedKeyword}&#39; 문서로 가기
            </Button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="space-y-3">
          {searchResults &&
            searchResults.map((item) => (
              <Link
                href={`/wiki/${encodeURIComponent(item.title)}`}
                key={item.id}
                onClick={() => {}}
                className="inline-block w-full text-left p-4 bg-white rounded-xl transition-shadow duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className=" font-medium text-gray-800 transition-colors">{item.title}</span>
                  <ArrowRight className="w-4 h-4 text-gray-800 transition-all duration-300 transform translate-x-1" />
                </div>
              </Link>
            ))}
        </div>
        <LoadingIndicator loadingRef={loadingRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
      </div>
    </div>
  );
}
