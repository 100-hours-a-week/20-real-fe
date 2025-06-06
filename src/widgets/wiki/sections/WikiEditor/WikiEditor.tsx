'use client';

import { CircleAlert } from 'lucide-react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import Collaboration from '@tiptap/extension-collaboration';
import { Image } from '@tiptap/extension-image';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { WikiDetail } from '@/entities/wiki/wikiDetail';
import { MAX_FILE_SIZE, uploadImageToS3 } from '@/features/s3/lib/s3';
import { useUpdateWikiMutation } from '@/features/wiki/model/useUpdateWikiMutation';
import { useToastStore } from '@/shared/model/toastStore';
import { LoginButton } from '@/shared/ui/section/LoginButton';
import { Link } from '@/widgets/tiptap-editor/tiptap-extension/link-extension';
import { Selection } from '@/widgets/tiptap-editor/tiptap-extension/selection-extension';
import { ImageUploadNode } from '@/widgets/tiptap-editor/tiptap-node/image-upload-node/image-upload-node-extension';
import { Toolbar } from '@/widgets/tiptap-editor/tiptap-ui-primitive/toolbar';
import { MainToolbarContent } from '@/widgets/wiki/sections/WikiToolbar';

import '@/widgets/tiptap-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/widgets/tiptap-editor/tiptap-node/list-node/list-node.scss';
import '@/widgets/tiptap-editor/tiptap-node/image-node/image-node.scss';
import '@/widgets/tiptap-editor/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/widgets/wiki/sections/WikiEditor/WikiEditor.scss';

interface WikiEditorProps {
  wiki: WikiDetail;
}

export function WikiEditor({ wiki }: WikiEditorProps) {
  const { mutate: updateWiki, error } = useUpdateWikiMutation();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToastStore();

  const doc = useMemo(() => new Y.Doc(), []);

  const handleImageUploadError = () => {
    showToast('이미지 업로드에 실패했습니다.', 'error');
  };

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image,
      Typography,
      Collaboration.configure({
        document: doc,
      }),

      Selection,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: uploadImageToS3,
        onError: handleImageUploadError,
      }),
      Link.configure({
        openOnClick: true,
      }),
    ],
  });

  const providerRef = useRef<WebsocketProvider | null>(null);

  // socket 연결
  useEffect(() => {
    if (!editor) return;
    const provider = new WebsocketProvider(`${process.env.NEXT_PUBLIC_WS_ADDRESS}`, wiki.id.toString(), doc, {
      connect: false,
    });

    provider.on('sync', (isSynced: boolean) => {
      if (!isSynced) return;

      const isEmpty = editor?.getText().trim().length === 0;

      if (isEmpty) {
        // if (wiki.ydoc) {
        //   Y.applyUpdate(doc, Uint8Array.from(atob(wiki.ydoc), c => c.charCodeAt(0)));
        // }
        if (wiki.html) {
          editor?.commands.setContent(wiki.html);
        }
      }
    });

    provider.connect();
    providerRef.current = provider;

    // unmount 시 연결 해제
    return () => {
      providerRef.current?.disconnect();
      providerRef.current?.destroy();
      providerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // 위키 수정 배치 작업
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editor) return;

      updateWiki({
        id: wiki.id,
        html: editor.getHTML(),
        ydoc: btoa(String.fromCharCode(...Y.encodeStateAsUpdate(doc))),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, updateWiki, doc, wiki.id]);

  if (error?.code === 'UNAUTHORIZED' || error?.code === 'TOKEN_EXPIRED') {
    return (
      <div className="p-6 text-center space-y-4">
        <CircleAlert className="mx-auto text-gray-500" size={40} />
        <p className="text-gray-700 font-medium">로그인 후 이용 가능해요.</p>
        <LoginButton className="h-9 px-4 text-sm inline-flex items-center justify-center gap-2 rounded cursor-pointer bg-primary-500 hover:bg-primary-600 text-white">
          로그인 하러 가기
        </LoginButton>
      </div>
    );
  }

  if (error?.code === 'FORBIDDEN') {
    return (
      <div className="p-6 text-center space-y-4">
        <CircleAlert className="mx-auto text-gray-500" size={40} />
        <p className="text-gray-700 font-medium">인증 받은 사용자만 확인할 수 있어요.</p>
      </div>
    );
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar ref={toolbarRef}>
        <MainToolbarContent />
      </Toolbar>

      <div className="content-wrapper">
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
      </div>
    </EditorContext.Provider>
  );
}
