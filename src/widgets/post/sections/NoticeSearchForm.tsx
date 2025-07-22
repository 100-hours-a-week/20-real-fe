'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react';

import { validateNoticeSearch } from '@/features/post/lib/validateNoticeSearch';
import { useToastStore } from '@/shared/model/toastStore';
import { Button } from '@/shared/ui/component/Button';
import { Input } from '@/shared/ui/component/Input';

export default function NoticeSearchForm() {
  const { showToast } = useToastStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    const validateMsg = validateNoticeSearch(searchTerm, 'search');
    if (validateMsg) {
      showToast(validateMsg, 'error');
      return;
    }

    goToWikiPage(searchTerm);
  };

  const goToWikiPage = (id: string) => {
    router.push(`/notices/search?keyword=${id}`);
  };
  return (
    <div>
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
  );
}
