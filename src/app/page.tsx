'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (hasVisited) {
      router.replace('/home');
    } else {
      localStorage.setItem('hasVisited', 'true');
      router.replace('/landing');
    }
  }, []);

  return null;
}
