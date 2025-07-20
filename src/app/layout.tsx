import type { Metadata } from 'next';
import Image from 'next/image';

import { ReactNode } from 'react';

import Providers from '@/app/providers';
import { RouteChangeLogger } from '@/app/RouteChangeLogger';
import bg from '@/assets/background.png';

import './globals.css';
import { ToastContainer } from '../shared/ui/section/ToastContainer';

export const metadata: Metadata = {
  title: '춘이네 비서실',
  description: '카카오테크 부트캠프에서 일어나는 일을 빠르게 확인',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" className={`font-pretendard`}>
      <head>
        <title>춘이네 비서실</title>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin={''}
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="flex justify-center bg-gradient-to-br min-h-screen">
        <RouteChangeLogger />
        <Background>
          <Providers>
            <div className="relative bg-white/80  shadow-soft min-h-screen max-w-app w-full">
              <ToastContainer />
              {children}
            </div>
          </Providers>
        </Background>
      </body>
    </html>
  );
}

function Background({ children }) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center overflow-hidden bg-neutral-50 relative">
      <Image
        src={bg}
        alt="전체 배경"
        fill
        className="object-cover z-0 pointer-events-none select-none"
        draggable={false}
        priority
      />
      <div className="relative z-10 mx-auto">{children}</div>
    </div>
  );
}
