import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ReactNode } from 'react';

import Providers from '@/app/providers';
import { RouteChangeLogger } from '@/app/RouteChangeLogger';

import './globals.css';
import { ToastContainer } from '../shared/ui/section/ToastContainer';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-pretendard',
});

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
    <html lang="ko" className={`${pretendard.className}`}>
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

function Background({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center overflow-hidden bg-neutral-50">
      <div className="fixed top-10 left-10 h-64 w-64 rounded-full bg-secondary-50 opacity-40 blur-xl" />
      <div className="fixed bottom-20 right-20 h-80 w-80 rounded-full bg-primary-50 opacity-30 blur-xl" />

      <div className="relative z-10 mx-auto">{children}</div>
    </div>
  );
}
