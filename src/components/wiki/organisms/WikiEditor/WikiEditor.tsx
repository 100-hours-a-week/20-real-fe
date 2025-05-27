'use client';

import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

import * as React from 'react';
import { useMemo, useState } from 'react';
import Collaboration from '@tiptap/extension-collaboration';
import { Image } from '@tiptap/extension-image';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

import { Button } from '@/components/common/atoms/Button';
import { Link } from '@/components/tiptap-editor/tiptap-extension/link-extension';
import { Selection } from '@/components/tiptap-editor/tiptap-extension/selection-extension';
import { ImageUploadNode } from '@/components/tiptap-editor/tiptap-node/image-upload-node/image-upload-node-extension';
import { Toolbar } from '@/components/tiptap-editor/tiptap-ui-primitive/toolbar';
import { MainToolbarContent } from '@/components/wiki/organisms/WikiToolbar';
import { handleImageUpload, MAX_FILE_SIZE } from '@/utils/tiptap';

import '@/components/tiptap-editor/tiptap-node/code-block-node/code-block-node.scss';
import '@/components/tiptap-editor/tiptap-node/list-node/list-node.scss';
import '@/components/tiptap-editor/tiptap-node/image-node/image-node.scss';
import '@/components/tiptap-editor/tiptap-node/paragraph-node/paragraph-node.scss';
import '@/components/wiki/organisms/WikiEditor/WikiEditor.scss';

export function WikiEditor({ title }: { title: string }) {
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const doc = useMemo(() => new Y.Doc(), []);
  useMemo(() => new WebsocketProvider('ws://localhost:1234', title, doc), [doc, title]);

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

  const [base64Update, setBase64Update] = useState<string>('');
  // const [htmlContent, setHtmlContent] = useState<string>('')

  return (
    <EditorContext.Provider value={{ editor }}>
      <Button
        onClick={() => {
          const update = Y.encodeStateAsUpdate(doc); // Uint8Array
          const encoded = Buffer.from(update).toString('base64'); // Base64
          setBase64Update(encoded);
          console.log('📦 Encoded:', encoded);
          const yText = doc.getText('default');
          console.log(yText);
          // const htmlText = editor?.getHTML();
          // console.log(htmlText);
          // setHtmlContent(htmlText ?? "")
        }}
      >
        저장
      </Button>
      <Button
        onClick={() => {
          if (!base64Update) return alert('저장된 Base64가 없습니다.');
          const update = Buffer.from(base64Update, 'base64'); // Uint8Array
          console.log('📦 Decoded:', update);
          console.log(Y.decodeUpdate(update));
          Y.transact(doc, () => {
            Y.applyUpdate(doc, update);
          });
          console.log('✅ Applied update to Y.Doc');
          // editor?.commands.setContent(htmlContent);
        }}
      >
        쓰기
      </Button>
      <Button
        onClick={() => {
          console.log(editor?.getHTML());
        }}
      >
        텍스트 있나요?
      </Button>
      <Toolbar ref={toolbarRef}>
        <MainToolbarContent />
      </Toolbar>

      <div className="content-wrapper">
        <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
      </div>
    </EditorContext.Provider>
  );
}
