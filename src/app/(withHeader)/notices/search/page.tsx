import { Suspense } from 'react';

import { NoticeSearchPage } from '@/widgets/post/sections/NoticeSearchPage';

export default function Page() {
  return (
    <Suspense>
      <NoticeSearchPage />
    </Suspense>
  );
}
