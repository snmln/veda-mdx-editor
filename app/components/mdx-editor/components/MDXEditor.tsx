// app/components/mdx-editor-enhanced.tsx

'use client';

import React from 'react';
import { MDXEditor } from '@mdxeditor/editor';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  toolbarPlugin,
  frontmatterPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  CodeToggle,
  jsxPlugin,
  GenericJsxEditor,
  JsxComponentDescriptor,
  Button,
  InsertImage,
  imagePlugin,
  usePublisher,
  insertJsx$,
  ListsToggle,
} from '@mdxeditor/editor';
import { MapIcon } from '@heroicons/react/24/outline';
import '@mdxeditor/editor/style.css';
import dynamic from 'next/dynamic';

import { scrollytellingButtonPlugin } from '../plugins/scrollytelling/scrollytellingButtonPlugin';
import { InsertScrollytellingButton } from '../plugins/scrollytelling/InsertScrollytellingButton';
import {
  InsertMapButton,
  InsertLineGraph,
  InsertTextBlock,
} from './ToolbarComponents';
// Import our map editor with live preview component
const MapEditorWrapper = dynamic(() => import('./MapEditor'), {
  ssr: false,
  loading: () => <div className='p-4 text-center'>Loading map editor...</div>,
});

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (content: string) => void;
}

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'Map',
    kind: 'text',
    source: '@teamimpact/veda-ui',
    props: [
      { name: 'center', type: 'string' },
      { name: 'zoom', type: 'string' },
      { name: 'datasetId', type: 'string' },
      { name: 'layerId', type: 'string' },
      { name: 'dateTime', type: 'string' },
      { name: 'compareDateTime', type: 'string' },
      { name: 'compareLabel', type: 'string' },
    ],
    hasChildren: false,
    Editor: MapEditorWrapper,
  },
  {
    name: 'Block',
    kind: 'text',
    source: './external',
    props: [{ name: 'type', type: 'string' }],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Prose',
    kind: 'text',
    source: './external',
    props: [{ name: 'type', type: 'string' }],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Chart',
    kind: 'text',
    source: '@teamimpact/veda-ui',
    props: [
      { name: 'dataPath', type: 'string' },
      { name: 'dateFormat', type: 'string' },
      { name: 'idKey', type: 'string' },
      { name: 'xKey', type: 'string' },
      { name: 'yKey', type: 'string' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
];


export function MDXEditorEnhanced({
  markdown,
  onChange,
}: MDXEditorWrapperProps) {
  return (
    <div className='h-[600px] border rounded-lg overflow-hidden'>
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        contentEditableClassName='prose prose-lg max-w-none min-h-[500px] outline-none px-4 py-2'
        plugins={[
          scrollytellingButtonPlugin(),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          codeBlockPlugin(),
          frontmatterPlugin(),
          imagePlugin(),
          jsxPlugin({
            jsxComponentDescriptors,
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <div className='grid-column'>
                <div className='grid-row border-bottom-1px padding-y-1'>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                  <BlockTypeSelect />
                  <CreateLink />
                  <CodeToggle />
                  <InsertImage />
                </div>
                <div className='grid-row padding-y-1'>
                  <InsertMapButton />
                  <InsertLineGraph />
                  <InsertTextBlock />
                </div>
              </div>
            ),
          }),
        ]}
        className='w-full h-full'
      />
    </div>
  );
}

