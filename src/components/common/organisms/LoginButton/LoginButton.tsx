'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { AnchorHTMLAttributes, MouseEventHandler, PropsWithChildren } from 'react';

import { useAuthRedirectStore } from '@/stores/authRedirectStore';

interface LoginButtonProps extends PropsWithChildren, AnchorHTMLAttributes<HTMLAnchorElement> {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function LoginButton({ onClick, children, ...rest }: LoginButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    const path = pathname;
    const query = searchParams.toString();
    const fullPath = query ? `${path}?${query}` : path;

    // 빈 경로가 아닐 때만 저장
    if (fullPath && fullPath !== '/login') {
      useAuthRedirectStore.getState().setRedirectPath(fullPath);
    }

    onClick?.(e);
  };

  return (
    <Link href="/login" onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
