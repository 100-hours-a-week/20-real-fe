import { WikiEditPage } from '@/components/wiki/pages/WikiEditPage';

interface PageParams {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  return <WikiEditPage id={id} />;
}
