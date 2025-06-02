import { WikiDetailPage } from '@/components/wiki/pages/WikiDetailPage';

interface PageParams {
  params: Promise<{ title: string }>;
}

export default async function Page({ params }: PageParams) {
  const { title } = await params;

  return <WikiDetailPage title={decodeURIComponent(title)} />;
}
