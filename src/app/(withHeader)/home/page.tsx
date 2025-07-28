import { ChevronRight, Megaphone, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import ChoonStudy from '@/assets/choon-study.png';
import { AiQuestionForm } from '@/widgets/home/sections/HomeChatbotForm';
import { NewsPanel } from '@/widgets/home/sections/NewsPanel';
import { NoticesPanel } from '@/widgets/home/sections/NoticesPanel';

export default function HomePage() {
  return (
    <div className="min-h-app bg-neutral-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 챗봇 */}
        <div className="bg-white rounded-3xl p-6 text-white relative overflow-hidden shadow-sm">
          <h1 className="text-xl font-bold text-black mb-2">춘비서에게 질문하기</h1>
          <AiQuestionForm />
        </div>

        {/* 최신 뉴스 */}
        <NewsSection />

        {/* 공지사항 */}
        <NoticeSection />

        {/* 바로가기 - 퀴즈와 위키 */}
        <div className="mt-10">
          <Link
            href={'/wiki'}
            className="block relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <h3 className="font-semibold text-xl text-gray-800">위키</h3>
            <p className="text-gray-600 font-medium text-sm mt-1">카테부 지식 저장소</p>
            <Image
              src={ChoonStudy}
              alt={'위키'}
              className="absolute right-4 top-1 w-24 h-24 group-hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function NewsSection() {
  return (
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
  );
}

function NoticeSection() {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-row gap-2 ite ms-center">
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
  );
}
