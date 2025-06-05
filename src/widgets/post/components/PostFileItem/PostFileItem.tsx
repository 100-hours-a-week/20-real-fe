import { Paperclip } from 'lucide-react';

import { NoticeFile } from '@/entities/post/noticeFile';

interface PostFileItemProps {
  file: NoticeFile;
}

export function PostFileItem({ file }: PostFileItemProps) {
  return (
    <a
      href={file.fileUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col mb-4 w-full max-w-app bg-gray-50 rounded-lg p-3"
    >
      <div className="flex items-center text-gray-600 text-sm">
        <Paperclip size={16} className="mr-2 text-gray-500" />
        <span>
          {file.fileName}.{file.fileType}
        </span>
      </div>
    </a>
  );
}
