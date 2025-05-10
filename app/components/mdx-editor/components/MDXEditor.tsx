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
import { InsertScrollytellingButton } from '../plugins/scrollytelling/InsertScrollytellingButton';
import {
  InsertMapButton,
  InsertLineGraph,
  InsertTextBlock,
  InsertTwoColumn,
  MapText,
  TwoColumn,
  LeftColumnEditor,
  RightColumnComponent,
  InsertTwoColumnButton,
} from './ToolbarComponents';
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
      const { mdastNode } = props;
      const updateMdastNode = useMdastNodeUpdater();

      const leftChildren = mdastNode.children?.find(
        (child: any) =>
          child.type === 'mdxJsxFlowElement' && child.name === 'LeftColumn',
      );
      const rightChildren = mdastNode.children?.find(
        (child: any) =>
          child.type === 'mdxJsxFlowElement' && child.name === 'RightColumn',
      );
      //TO DO: CORRECT left and right positions

      const setInitialChildren = () => {
        const checkForColumns = (children) =>
          children.name === 'LeftColumn' || children.name === 'RightColumn';

        if (!mdastNode.children.some(checkForColumns)) {
          const currentIndex = mdastNode.children.findIndex(
            (obj) => obj.name === 'LeftColumn',
          );
          if (currentIndex != 0) {
            const [foundElement] = mdastNode.children.splice(currentIndex, 1);
            return mdastNode.children.unshift(foundElement);
          }
          return mdastNode;
        } else {
          return mdastNode.children.push(
            { type: 'mdxJsxFlowElement', name: 'LeftColumn', children: [] },
            { type: 'mdxJsxFlowElement', name: 'RightColumn', children: [] },
          );
        }
      };
      setInitialChildren();



      const columnFields = (column) => {
        return (
          <NestedLexicalEditor
            getContent={(node) => node.children}
            getUpdatedMdastNode={(mdastNode, children: any) => {
              const newLeft = {
                type: 'mdxJsxFlowElement',
                name: column,
                children: children || [],
              };

              const existingChildren =
                mdastNode.children?.filter((c: any) => c.name !== column) || [];
              const newChildren = [newLeft, ...existingChildren];
              updateMdastNode({ ...mdastNode, children: newChildren });
            }}
          />
        );
      };
      return (
        <div className='grid-container maxw-full'>
          <div className='grid-row'>
            <div className='grid-col border rounded-md p-2'>
              {columnFields('LeftColumn')}
            </div>
            <div className='grid-col border rounded-md p-2'>
              {columnFields('RightColumn')}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    name: 'LeftColumn', // Define LeftColumn
    kind: 'flow', // Or 'block' depending on desired behavior
    source: './components',
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
  },
  {
    name: 'RightColumn', // Define RightColumn
    kind: 'flow', // Or 'block'
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
    Editor: MapEditorWrapper,
  },
  {
    name: 'Block',
    kind: 'flow',
    source: './external',
    props: [{ name: 'type', type: 'string' }],
    hasChildren: true,
    Editor: GenericJsxEditor,

    // Editor: () => {
    //   return (
    //     <div className='border-05 border-primary'>
    //       <NestedLexicalEditor
    //         getContent={(node) => node.children}
    //         getUpdatedMdastNode={(mdastNode, children: any) => {
    //           return { ...mdastNode, children };
    //         }}
    //       />
    //     </div>
    //   );
    // },
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
  console.log('MDXEditorEnhanced', markdown);
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
                  {/* <InsertTwoColumn /> */}
                  <MapText />
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
