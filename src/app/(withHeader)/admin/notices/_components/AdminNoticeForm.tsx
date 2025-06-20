'use client';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import {
  adminNames,
  noticePlatform,
  noticeTags,
  useAdminNoticeForm,
} from '@/features/post/model/hooks/useAdminNoticeForm';
import { useToastStore } from '@/shared/model/toastStore';
import { MarkdownViewer } from '@/shared/ui/section/MarkdownViewer';

interface AdminNoticeFormProps {
  type: 'new' | 'edit';
}

export default function AdminNoticeForm({ type }: AdminNoticeFormProps) {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { showToast } = useToastStore();

  const [isPreview, setIsPreview] = useState(false);

  const {
    form,
    setForm,
    clearForm,
    addImages,
    addFiles,
    removeFile,
    getNotice,
    removeImage,
    handleSubmit,
    isCreateNoticeSuccess,
    isEditNoticeSuccess,
    isPending,
  } = useAdminNoticeForm(type);

  useEffect(() => {
    clearForm();

    if (type === 'new' && isCreateNoticeSuccess) {
      showToast('작성 성공', 'success');
    } else if (type === 'edit' && isEditNoticeSuccess) {
      router.back();
    }
  }, [isCreateNoticeSuccess, isEditNoticeSuccess]);

  useEffect(() => {
    if (type === 'edit' && id) {
      getNotice();
    }
  }, [getNotice, id, type]);

  return (
    <div className="bg-white min-h-screen max-w-2xl mx-auto px-6 py-10 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">공지 {type === 'new' ? '작성' : '편집'}</h2>

      {isPending && <p className="text-sm text-gray-500">불러오는 중입니다...</p>}

      <input
        type="text"
        placeholder="제목을 입력하세요"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring focus:border-blue-400"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <div className="flex gap-2">
        <button
          type="button"
          className={`px-4 py-1.5 text-sm rounded-lg ${
            !isPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setIsPreview(false)}
        >
          편집
        </button>
        <button
          type="button"
          className={`px-4 py-1.5 text-sm rounded-lg ${
            isPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={() => setIsPreview(true)}
        >
          미리보기
        </button>
      </div>

      {isPreview ? (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <MarkdownViewer text={form.content} useHtml useSyntaxHighlight />
        </div>
      ) : (
        <textarea
          placeholder="공지 내용을 입력하세요"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 h-72 text-base resize-none focus:outline-none focus:ring focus:border-blue-400"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
      )}

      <input
        type="text"
        placeholder="원본 링크 (선택)"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
        value={form.originalUrl}
        onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
      />

      <input
        type="datetime-local"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
        value={form.createdAt}
        onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
        >
          {noticeTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
          value={form.platform}
          onChange={(e) => setForm({ ...form, platform: e.target.value })}
        >
          {noticePlatform.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
        value={form.userName}
        onChange={(e) => setForm({ ...form, userName: e.target.value })}
      >
        {adminNames.map((u) => (
          <option key={u.value} value={u.value}>
            {u.value}
          </option>
        ))}
      </select>

      {type === 'new' && (
        <>
          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 mr-4">이미지 업로드 (최대 10장)</label>
            <div className="relative inline-block">
              <button
                type="button"
                className="border border-gray-300 px-4 py-1 rounded-lg text-sm bg-white hover:bg-gray-100"
                onClick={() => document.getElementById('image-upload-input')?.click()}
              >
                이미지 선택
              </button>
              <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newFiles = Array.from(files);
                    addImages(newFiles);
                  }
                  e.target.value = '';
                }}
              />
            </div>
            <ul className="text-sm text-gray-600">
              {form.images.map((file, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button onClick={() => removeImage(idx)} className="text-red-500 hover:underline text-xs">
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 파일 업로드 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 mr-4">파일 업로드 (최대 10개)</label>
            <div className="relative inline-block">
              <button
                type="button"
                className="border border-gray-300 px-4 py-1 rounded-lg text-sm bg-white hover:bg-gray-100"
                onClick={() => document.getElementById('file-upload-input')?.click()}
              >
                파일 선택
              </button>
              <input
                id="file-upload-input"
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newFiles = Array.from(files);
                    addFiles(newFiles);
                  }
                  e.target.value = '';
                }}
              />
            </div>
            <ul className="text-sm text-gray-600">
              {form.files.map((file, idx) => (
                <li key={idx} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-500 hover:underline text-xs">
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="pt-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {type === 'new' ? '등록하기' : '편집하기'}
        </button>
      </div>
    </div>
  );
}
