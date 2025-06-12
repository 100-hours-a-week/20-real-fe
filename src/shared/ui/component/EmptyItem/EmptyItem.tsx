import Image from 'next/image';

import { HTMLAttributes } from 'react';

import ChoonSad from '@/assets/choon-sad.png';

interface EmptyItemProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function EmptyItem({ message, ...rest }: EmptyItemProps) {
  return (
    <div {...rest} className="flex flex-col items-center justify-center py-10 text-center text-gray-500 space-y-2">
      <Image src={ChoonSad} alt="비어 있음" width={100} height={100} />
      <p className="text-base font-semibold">표시할 항목이 없습니다.</p>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
}
