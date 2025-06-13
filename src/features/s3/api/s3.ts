import { PresignedUrl } from '@/entities/common/presignedUrl';
import { fetcher } from '@/shared/lib/utils/fetcher';

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
