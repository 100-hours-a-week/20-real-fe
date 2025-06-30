'use client';

import { CircleAlert } from 'lucide-react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Collaboration from '@tiptap/extension-collaboration';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
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
import { stringToColor } from '@/shared/lib/utils/stringToColor';
import { useToastStore } from '@/shared/model/toastStore';
import { useUserPersistStore } from '@/shared/model/userPersistStore';
import { Button } from '@/shared/ui/component/Button';
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
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToastStore();
  const { user } = useUserPersistStore();
  const [isError, setIsError] = useState(false);

  const doc = useMemo(() => new Y.Doc(), []);

  const handleImageUploadError = () => {
    showToast('이미지 업로드에 실패했습니다.', 'error');
  };

  const provider = useMemo(() => {
    return new WebsocketProvider(`${process.env.NEXT_PUBLIC_WS_ADDRESS}`, wiki.id.toString(), doc, {
      connect: false,
    });
  }, []);

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
      CollaborationCursor.configure({
        provider: provider,
        user: {
          id: user?.id,
          name: user?.nickname ?? '',
          color: stringToColor(user?.nickname ?? ''),
        },
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

  // socket 연결
  useEffect(() => {
    provider.connect();
  }, [provider]);

  provider.ws?.addEventListener('error', (err) => {
    console.error(err);
    setIsError(true);
  });

  if (isError) {
    return (
      <div className="p-6 text-center space-y-4">
        <CircleAlert className="mx-auto text-gray-500" size={40} />
        <p className="text-gray-700 font-medium">
          알 수 없는 오류가 발생했어요.
          <br />
          잠시 뒤 다시 시도해주세요.
        </p>
        <Button
          className="h-9 px-4 text-sm inline-flex items-center justify-center gap-2 rounded cursor-pointer bg-primary-500 hover:bg-primary-600 text-white"
          onClick={() => window.location.reload()}
        >
          새로고침
        </Button>
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
