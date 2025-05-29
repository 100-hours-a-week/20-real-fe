'use client';

import { ChevronRight, Megaphone, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react';

import ChoonQuiz from '@/assets/choon-quiz.png';
import ChoonStudy from '@/assets/choon-study.png';
import { Button } from '@/components/common/atoms/Button';
import { Input } from '@/components/common/molecules/Input';
import { NewsPanel } from '@/components/home/organisms/NewsPanel';
import { useToastStore } from '@/stores/toastStore';

import { NoticesPanel } from '../../organisms/NoticesPanel';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { showToast } = useToastStore();
  const router = useRouter();

  const handleAIQuestion = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chatbot?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 챗봇 */}
        <div className="bg-white rounded-3xl p-6 text-white relative overflow-hidden shadow-sm">
          <h1 className="text-xl font-bold text-black mb-2">춘비서에게 질문하기</h1>

          <form className="mt-6 relative" onSubmit={handleAIQuestion}>
            <Input
              placeholder="휴가 신청하는 법을 알려줘"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-4 rounded-2xl shadow-sm z-10"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* 바로가기 - 퀴즈와 위키 */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div
            onClick={() => showToast('준비 중인 기능이에요')}
            className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <h3 className="font-semibold text-xl text-gray-800">
              오늘의
              <br />
              퀴즈
            </h3>
            <Image
              src={ChoonQuiz}
              alt={'오늘의 퀴즈'}
              className="absolute right-0 bottom-0 w-24 h-24 group-hover:scale-110 transition-transform duration-200"
            />
          </div>

          <Link
            href={'/wiki'}
            className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <h3 className="font-semibold text-xl text-gray-800">위키</h3>
            <Image
              src={ChoonStudy}
              alt={'위키'}
              className="absolute right-0 bottom-0 w-24 h-24 group-hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* 최신 뉴스 */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Newspaper size={20} />
              <h2 className="text-lg font-bold text-gray-900">최신 뉴스</h2>
            </div>
            <Link href="/news" className="text-gray-500 text-sm flex items-center">
              더보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <NewsPanel />
        </div>

        {/* 공지사항 */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-row gap-2 items-center">
              <Megaphone size={20} />
              <h2 className="text-lg font-bold text-gray-900">공지사항</h2>
            </div>
            <Link href="/notices" className="text-gray-500 text-sm flex items-center">
              더보기
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <NoticesPanel />
        </div>
      </div>
    </div>
  );
}
