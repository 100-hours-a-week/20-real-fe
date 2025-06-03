import { fetcher } from '@/api/fetcher';
import { PresignedUrl } from '@/types/common/presignedUrl';

interface getPresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export const getPresignedUrl = async ({ fileName, contentType }: getPresignedUrlRequest) => {
  return await fetcher<PresignedUrl>(`/v1/presigned`, {
    method: 'POST',
    body: JSON.stringify({ fileName, contentType }),
  });
};
