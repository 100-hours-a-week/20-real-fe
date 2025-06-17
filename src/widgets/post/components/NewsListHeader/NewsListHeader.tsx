import { ReactNode } from 'react';

interface NewsListHeaderProps {
  icon?: ReactNode;
  title: string;
}

export function NewsListHeader({ icon, title }: NewsListHeaderProps) {
  return (
    <div className="pt-4">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
    </div>
  );
}
