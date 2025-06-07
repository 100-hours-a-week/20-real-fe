'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react';

import { Button } from '../../../../shared/ui/component/Button';
import { Input } from '../../../../shared/ui/component/Input';

export function AiQuestionForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleAIQuestion = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/chatbot?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
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
  );
}
