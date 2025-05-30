import { Suspense } from 'react';

import { WikiSearchPage } from '@/components/wiki/pages/WikiSearchPage/WikiSearchPage';

export default function Page() {
  return (
    <Suspense>
      <WikiSearchPage />
    </Suspense>
  )
}
