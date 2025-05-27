import Link from 'next/link';

interface WikiDetailPageProps {
  id: string;
}

export function WikiDetailPage({ id }: WikiDetailPageProps) {
  return (
    <>
      <div>{decodeURIComponent(id)} 위키 문서</div>
      <Link href={`/wiki/${id}/edit`}>문서 편집</Link>
    </>
  );
}
