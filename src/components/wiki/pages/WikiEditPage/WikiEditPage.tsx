import { WikiEditor } from '@/components/wiki/organisms/WikiEditor';

interface WikiEditPageProps {
  id: string;
}

export function WikiEditPage(props: WikiEditPageProps) {
  const { id } = props;
  return (
    <div>
      <h2 className="text-2xl font-bold mx-4 mt-8 mb-3">{id}번 위키</h2>
      <hr className="text-neutral-300" />
      <WikiEditor title={'test'} />
    </div>
  );
}
