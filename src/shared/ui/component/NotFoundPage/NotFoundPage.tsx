import { Home } from 'lucide-react';
import Link from 'next/link';

export function NotFoundPage() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="relative mb-6">
            <div className="text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
              404
            </div>
            <div className="absolute -bottom-2 w-full">
              <div className="h-1 mx-auto bg-gradient-to-r from-primary-500 to-accent-500 rounded-full w-1/2 opacity-50"></div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않거나, 경로가 잘못되었습니다.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/public"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
