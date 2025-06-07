import { Suspense } from 'react';

import { WikiSearchPage } from '@/widgets/wiki/sections/WikiSearchPage';

export default function Page() {
  return (
    <Suspense>
      <WikiSearchPage />
    </Suspense>
  );
}
