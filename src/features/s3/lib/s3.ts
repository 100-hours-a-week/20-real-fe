import { getPresignedUrl } from '@/features/s3/api/s3';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const uploadImageToS3 = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
): Promise<string> => {
  if (!file) throw new Error('No file provided');
  if (file.size > MAX_FILE_SIZE) throw new Error(`File exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB`);

  // Presigned URL 요청
  const { data } = await getPresignedUrl({ fileName: file.name, contentType: file.type });
  const { presignedUrl, cloudFrontUrl } = data;

  // 이미지 업로드
  await uploadToPresignedUrl(file, presignedUrl, onProgress, abortSignal);

  // cloudFront URL 반환
  return cloudFrontUrl;
};

const uploadToPresignedUrl = (
  file: File,
  url: string,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress({ progress });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`업로드 실패: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('업로드 실패'));
    xhr.onabort = () => reject(new Error('업로드 취소됨'));

    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => xhr.abort());
    }
  });
};
