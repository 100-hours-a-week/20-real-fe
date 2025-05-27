import { WikiDetailPage } from '@/components/wiki/pages/WikiDetailPage';

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  return <WikiDetailPage id={id} />;
}
