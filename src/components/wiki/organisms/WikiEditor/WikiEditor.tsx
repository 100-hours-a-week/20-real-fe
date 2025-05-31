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
import { WikiDetail } from '@/types/wiki/wikiDetail';
import { handleImageUpload, MAX_FILE_SIZE } from '@/utils/tiptap';

import '@/components/tiptap-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-editor/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-editor/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-editor/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/components/wiki/organisms/WikiEditor/WikiEditor.scss';

interface WikiEditorProps {
  wiki: WikiDetail;
}

export function WikiEditor({ wiki }: WikiEditorProps) {
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
  });

  const providerRef = useRef<WebsocketProvider | null>(null);

  // socket 연결
  useEffect(() => {
    if (!editor) return;
    const provider = new WebsocketProvider('ws://localhost:3002', wiki.id.toString(), doc, { connect: false });

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
