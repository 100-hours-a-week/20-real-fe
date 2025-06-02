'use client';

import { ArrowRight, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/common/atoms/Button';
import { Input } from '@/components/common/molecules/Input';
import { useWikiSearchListInfinityQuery } from '@/queries/wiki/useWikiSearchListInfinityQuery';
import { useToastStore } from '@/stores/toastStore';
import { formatTime } from '@/utils/times';
import { validateWikiTitle } from '@/utils/validateWiki';

export function WikiMainPage() {
  const { showToast } = useToastStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: recentWikis } = useWikiSearchListInfinityQuery({ sort: 'LATEST', limit: 4 });

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const validateMsg = validateWikiTitle(searchTerm, 'search');
    if (validateMsg) {
      showToast(validateMsg, 'error');
      return;
    }

    goToWikiPage(searchTerm);
  };

  const goToWikiPage = (id: string) => {
    router.push(`/wiki/search?keyword=${id}`);
  };

  return (
    <div className="min-h-app bg-gray-50">
      <div className="max-w-app px-4 pt-8">
        {/* 검색 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">위키</h2>
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

        {/*최근 검색어*/}
        {/*<span className="inline-block font-bold text-sm mb-1">최근 검색어</span>*/}
        {/*<div className="flex flex-row mb-6 gap-4 overflow-x-auto">*/}
        {/*  {recentSearch.map((item) => (*/}
        {/*    <div key={item} className="bg-white rounded-full whitespace-nowrap shadow-md">*/}
        {/*      <span className="inline-block w-full px-4 py-3">{item}</span>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/* 최근 변경 */}
        <div>
          <h3 className="flex flex-row items-center text-lg font-semibold text-gray-800 mb-4">
            <Clock className="w-5 h-5 mr-2 text-accent-500" />
            최근 변경
          </h3>
          <div className="grid gap-4">
            {recentWikis?.map((wiki) => (
              <Link
                href={`/wiki/${encodeURIComponent(wiki.title)}`}
                key={wiki.id}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{wiki.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>{formatTime(wiki.updatedAt)}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
