import { useState } from 'react';

import { getNoticeDetail } from '@/features/post/api/notices';
import { useCreateNoticeMutation } from '@/features/post/model/notices/useCreateNoticeMutation';
import { useEditNoticeMutation } from '@/features/post/model/notices/useEditNoticeMutation';

export const adminNames = [
  { value: 'helper.ryan(헬퍼라이언)' },
  { value: 'void.yeon(연시완)/강사' },
  { value: 'kevin.seo(서상기)/풀스택주강사' },
  { value: 'alex.lee(이창신)/인공지능주강사' },
  { value: 'daniel.jung(정주신)/클라우드주강사' },
  { value: 'tami.kim(김현)/관리자' },
  { value: 'diana.kim(김예슬)/관리자' },
];

export const noticeTags = ['공지', '풀스택 공지', '인공지능 공지', '클라우드 공지'];

export const noticePlatform = ['디스코드', '노션'];

interface FormState {
  title: string;
  content: string;
  originalUrl: string;
  createdAt: string;
  platform: string;
  userName: string;
  tag: string;
  images: File[];
  files: File[];
}

export const useAdminNoticeForm = (type: 'new' | 'edit', id?: string) => {
  const defaultForm: FormState = {
    title: '',
    content: '',
    originalUrl: '',
    createdAt: '',
    tag: noticeTags[0],
    platform: noticePlatform[0],
    userName: adminNames[0].value,
    images: [],
    files: [],
  };
  const {
    mutate: createNotice,
    isSuccess: isCreateNoticeSuccess,
    isPending: isCreateNoticePending,
  } = useCreateNoticeMutation();
  const {
    mutate: editNotice,
    isSuccess: isEditNoticeSuccess,
    isPending: isEditNoticePending,
  } = useEditNoticeMutation();

  const [title, setTitle] = useState(defaultForm.title);
  const [content, setContent] = useState(defaultForm.content);
  const [originalUrl, setOriginalUrl] = useState(defaultForm.originalUrl);
  const [createdAt, setCreatedAt] = useState(defaultForm.createdAt);
  const [tag, setTag] = useState(defaultForm.tag);
  const [platform, setPlatform] = useState(defaultForm.platform);
  const [userName, setUserName] = useState(defaultForm.userName);
  const [images, setImages] = useState<File[]>(defaultForm.images);
  const [files, setFiles] = useState<File[]>(defaultForm.files);

  const getNotice = async () => {
    if (!id) return;
    const res = await getNoticeDetail(id);

    if (!res) {
      console.error('공지 가져오기 실패');
    }

    const notice = res.data;
    setTitle(notice.title);
    setContent(notice.content);
    setOriginalUrl(notice.originalUrl);
    setCreatedAt(notice.createdAt);
    setTag(notice.tag);
    setPlatform(notice.platform);
    setUserName(notice.author);
    setImages([]);
    setFiles([]);
  };

  const clearForm = () => {
    setTitle(defaultForm.title);
    setContent(defaultForm.content);
    setOriginalUrl(defaultForm.originalUrl);
    setCreatedAt(defaultForm.createdAt);
    setTag(defaultForm.tag);
    setPlatform(defaultForm.platform);
    setUserName(defaultForm.userName);
    setImages(defaultForm.images);
    setFiles(defaultForm.files);
  };

  const addImages = (newImages: File[]) => {
    setImages([...images, ...newImages].slice(0, 10));
  };

  const addFiles = (newFiles: File[]) => {
    setFiles([...files, ...newFiles].slice(0, 10));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const form = {
      title,
      content,
      originalUrl,
      createdAt,
      tag,
      platform,
      userName,
      images,
      files,
    };

    if (type === 'new') {
      createNotice({ ...form });
    } else if (type === 'edit' && id) {
      editNotice({ id: Number(id), ...form });
    }
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    originalUrl,
    setOriginalUrl,
    createdAt,
    setCreatedAt,
    tag,
    setTag,
    platform,
    setPlatform,
    userName,
    setUserName,
    images,
    setImages,
    files,
    setFiles,
    clearForm,
    addImages,
    addFiles,
    removeImage,
    removeFile,
    getNotice,
    handleSubmit,
    isCreateNoticeSuccess,
    isEditNoticeSuccess,
    isPending: isEditNoticePending || isCreateNoticePending,
  };
};
