// app/components/mdx-editor-enhanced.tsx

'use client';

import React from 'react';
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
  MDXEditor,
  NestedLexicalEditor,
  CodeMirrorEditor,
  useMdastNodeUpdater,
} from '@mdxeditor/editor';
import { MapIcon } from '@heroicons/react/24/outline';
import '@mdxeditor/editor/style.css';
import dynamic from 'next/dynamic';
import { BlockNode, Marker } from './components';

import { scrollytellingButtonPlugin } from '../plugins/scrollytelling/scrollytellingButtonPlugin';
import { TwoColumnEditorWrapper } from './TwoColumnEditor';
import {
  InsertMapButton,
  InsertLineGraph,
  InsertTwoColumnButton,
} from './ToolbarComponents';
import './mdxpreview.scss';

// Import our map editor with live preview component
const MapEditorWrapper = dynamic(() => import('./MapEditor'), {
  ssr: false,
  loading: () => <div className='p-4 text-center'>Loading map editor...</div>,
});
const ChartEditorWrapper = dynamic(() => import('./ChartEditor'), {
  ssr: false,
  loading: () => <div className='p-4 text-center'>Loading Chart editor...</div>,
});

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (content: string) => void;
}
const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'TwoColumn',
    kind: 'flow',
    source: './components', // Adjust the path
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
    Editor: (props) => {
      return <TwoColumnEditorWrapper props={{ ...props }} />;
    },
  },
  {
    name: 'LeftColumn',
    kind: 'flow',
    source: './components',
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
  },
  {
    name: 'RightColumn',
    kind: 'flow',
    source: './components',
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
  },
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
    Editor: (props) => {
      return (
        <>
          <MapEditorWrapper props={{ ...props }} />
        </>
      );
    },
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
      { name: 'yAxisLabel', type: 'string' },
      { name: 'xAxisLabel', type: 'string' },
      { name: 'highlightStart', type: 'string' },
      { name: 'highlightEnd', type: 'string' },
      { name: 'highlightLabel', type: 'string' },
      { name: 'availableDomain', type: 'string' },
      { name: 'altTitle', type: 'string' },
      { name: 'colorScheme', type: 'string' },
      { name: 'colors', type: 'string' },
      { name: 'altDesc', type: 'string' },
    ],
    hasChildren: false,
    Editor: (props) => {
      return (
        <>
          <ChartEditorWrapper props />
        </>
      );
    },
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
            jsxComponentModules: [
              {
                components: {
                  Marker,
                  BlockNode,
                },
              },
            ],
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
                  <InsertTwoColumnButton />
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
