import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-6">
          <div className="flex items-center justify-center text-7xl text-red-500">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <div className="absolute -bottom-2 w-full">
            <div className="h-1 mx-auto bg-red-400 rounded-full w-1/2 opacity-50"></div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">알 수 없는 오류가 발생했어요</h1>
        <p className="text-gray-600 mb-8">문제가 지속되면 고객센터나 관리자에게 문의해주세요.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <span className="mr-2">🏠</span>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
