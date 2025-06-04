'use client';

import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { getNoticeDetail } from '@/api/post';
import { MarkdownViewer } from '@/components/common/molecules/MarkdownViewer';

const userNames = [
  { value: 'helper.ryan(헬퍼라이언)' },
  { value: 'void.yeon(연시완)/강사' },
  { value: 'kevin.seo(서상기)/풀스택주강사' },
  { value: 'alex.lee(이창신)/인공지능주강사' },
  { value: 'daniel.jung(정주신)/클라우드주강사' },
  { value: 'tami.kim(김현)/관리자' },
  { value: 'diana.kim(김예슬)/관리자' },
];

const tags = ['공지', '풀스택 공지', '인공지능 공지', '클라우드 공지'];

const platforms = ['디스코드', '노션'];

interface AdminNoticeFormProps {
  type: 'new' | 'edit';
}

export default function AdminNoticeForm({ type }: AdminNoticeFormProps) {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState(tags[0]);
  const [platform, setPlatform] = useState(platforms[0]);
  const [userName, setUserName] = useState(userNames[0].value);
  const [originalUrl, setOriginalUrl] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [isPreview, setIsPreview] = useState(false);

  const handleSubmit = async () => {
    const notice = {
      title,
      content,
      tag,
      platform,
      userName,
      originalUrl,
      createdAt,
    };

    const formData = new FormData();
    formData.append('notice', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
    images.forEach((img) => formData.append('images', img));
    files.forEach((file) => formData.append('files', file));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/notices/tmp`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (res.ok) {
      alert('업로드 성공');
      setTitle('');
      setContent('');
      setTag(tags[0]);
      setPlatform(platforms[0]);
      setUserName(userNames[0].value);
      setOriginalUrl('');
      setCreatedAt('');
      setImages([]);
      setFiles([]);
    } else {
      alert('업로드 실패');
    }
  };

  const handleEdit = async () => {
    const notice = {
      title,
      content,
      tag,
      platform,
      userName,
      originalUrl,
      createdAt,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/notices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notice),
      credentials: 'include',
    });

    if (res.ok) {
      alert('수정 성공');
      setTitle('');
      setContent('');
      setTag(tags[0]);
      setPlatform(platforms[0]);
      setUserName(userNames[0].value);
      setOriginalUrl('');
      setCreatedAt('');
    } else {
      alert('수정 실패');
    }
  };

  const handleDelete = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/notices/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert('삭제 성공');
      router.push('/notices');
    } else {
      alert('삭제 실패');
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchData = async () => {
      if (type === 'edit' && id) {
        setLoading(true);
        try {
          const res = await getNoticeDetail(id.toString());
          if (!res) return;
          const data = res.data;
          setTitle(data.title);
          setContent(data.content);
          setTag(data.tag);
          setPlatform(data.platform);
          setUserName(data.author);
          setOriginalUrl(data.originalUrl);
          setCreatedAt(data.createdAt);
        } catch (error) {
          console.error('Failed to fetch news detail:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id, type]);

  return (
    <div className="bg-gray-50 min-h-app p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">임시 공지 {type === 'new' ? '작성' : '편집'} 페이지입니다.</h2>
      {loading && <div className="text-gray-600 text-sm">불러오는 중입니다...</div>}

      <input
        type="text"
        placeholder="제목"
        className="w-full border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex gap-2 text-sm">
        <button
          type="button"
          className={`px-3 py-1 rounded ${!isPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setIsPreview(false)}
        >
          편집
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded ${isPreview ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setIsPreview(true)}
        >
          미리보기
        </button>
      </div>

      {isPreview && <MarkdownViewer text={content} useHtml={true} useSyntaxHighlight={true} />}

      {!isPreview && (
        <textarea
          placeholder="내용"
          className="w-full border p-2 h-96"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      )}

      <input
        type="text"
        placeholder="원본 주소"
        className="w-full border p-2"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />

      <input
        type="datetime-local"
        className="w-full border p-2"
        value={createdAt}
        onChange={(e) => setCreatedAt(e.target.value)}
      />

      <select className="w-full border p-2" value={tag} onChange={(e) => setTag(e.target.value)}>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select className="w-full border p-2" value={platform} onChange={(e) => setPlatform(e.target.value)}>
        {platforms.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select className="w-full border p-2" value={userName} onChange={(e) => setUserName(e.target.value)}>
        {userNames.map((a) => (
          <option key={a.value} value={a.value}>
            {a.value}
          </option>
        ))}
      </select>

      {type === 'new' && (
        <>
          <div>
            <label className="block mb-1">사진 업로드 (최대 10장)</label>

            <div className="relative inline-block">
              <button
                type="button"
                className="border px-4 py-2 rounded-full text-sm bg-white hover:bg-gray-100"
                onClick={() => document.getElementById('image-upload-input')?.click()}
              >
                사진 선택
              </button>
              <input
                id="image-upload-input"
                type="file"
                multiple
                accept="image/*"
                className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newFiles = Array.from(files);
                    setImages((prev) => [...prev, ...newFiles].slice(0, 10));
                  }

                  e.target.value = '';
                }}
              />
            </div>

            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {images.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button onClick={() => removeImage(idx)} className="text-red-500 hover:underline">
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block mb-1">파일 업로드 (최대 10장)</label>

            <div className="relative inline-block">
              <button
                type="button"
                className="border px-4 py-2 rounded-full text-sm bg-white hover:bg-gray-100"
                onClick={() => document.getElementById('file-upload-input')?.click()}
              >
                파일 선택
              </button>
              <input
                id="file-upload-input"
                type="file"
                multiple
                className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newFiles = Array.from(files);
                    setFiles((prev) => [...prev, ...newFiles].slice(0, 10));
                  }

                  e.target.value = '';
                }}
              />
            </div>

            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {files.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(idx)} className="text-red-500 hover:underline">
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {type === 'new' && (
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {type === 'new' ? '등록하기' : '편집하기'}
        </button>
      )}

      {type === 'edit' && (
        <>
          <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            편집하기
          </button>

          <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded ml-4">
            삭제하기
          </button>
        </>
      )}
    </div>
  );
}
