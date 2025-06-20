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

  const [form, setForm] = useState<FormState>(defaultForm);

  const getNotice = async () => {
    if (!id) return;
    const res = await getNoticeDetail(id);

    if (!res) {
      console.error('공지 가져오기 실패');
    }

    const notice = res.data;
    setForm({ ...notice, images: [], files: [], userName: notice.author });
  };

  const clearForm = () => {
    setForm({ ...defaultForm });
  };

  const addImages = (newImages: File[]) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10),
    }));
  };

  const addFiles = (newFiles: File[]) => {
    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles].slice(0, 10),
    }));
  };

  const removeImage = (index: number) => {
    // setImages(images.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (type === 'new') {
      createNotice({ ...form });
    } else if (type === 'edit' && id) {
      editNotice({ id: Number(id), ...form });
    }
  };

  return {
    form,
    setForm,
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
