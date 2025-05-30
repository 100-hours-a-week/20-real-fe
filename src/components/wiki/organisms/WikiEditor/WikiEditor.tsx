'use client';

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

import { Link } from '@/components/tiptap-editor/tiptap-extension/link-extension';
import { Selection } from '@/components/tiptap-editor/tiptap-extension/selection-extension';
import { ImageUploadNode } from '@/components/tiptap-editor/tiptap-node/image-upload-node/image-upload-node-extension';
import { Toolbar } from '@/components/tiptap-editor/tiptap-ui-primitive/toolbar';
import { MainToolbarContent } from '@/components/wiki/organisms/WikiToolbar';
import { useUpdateWikiMutation } from '@/queries/wiki/useUpdateWikiMutation';
import { handleImageUpload, MAX_FILE_SIZE } from '@/utils/tiptap';

import '@/components/tiptap-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-editor/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-editor/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-editor/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/components/wiki/organisms/WikiEditor/WikiEditor.scss';

interface WikiEditorProps {
  wikiId: number;
  initialContent?: string;
}

export function WikiEditor({ wikiId, initialContent }: WikiEditorProps) {
  const { mutate: updateWiki } = useUpdateWikiMutation();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const doc = useMemo(() => new Y.Doc(), []);

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
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
      Link.configure({
        openOnClick: true,
      }),
    ],
    // content: initialContent,
  });

  const providerRef = useRef<WebsocketProvider | null>(null);

  // socket 연결
  useEffect(() => {
    const provider = new WebsocketProvider('ws://localhost:3002', wikiId.toString(), doc, { connect: false });
    provider.connect();
    providerRef.current = provider;

    // unmount 시 연결 해제
    return () => {
      providerRef.current?.disconnect();
      providerRef.current?.destroy();
      providerRef.current = null;
    };
  }, []);

  // 위키 수정 배치 작업
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editor) return;

      updateWiki({
        id: wikiId,
        html: editor.getHTML(),
        ydoc: Y.encodeStateAsUpdate(doc),
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialContent) {
      console.log(initialContent);
    }
  }, []);

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
