'use client';

import React, { useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { MDXEditor } from '@mdxeditor/editor';
import { Block, Figure, Caption, MapBlock } from '@lib';
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
  NestedLexicalEditor,
  Button,
  usePublisher,
  insertJsx$,
  type MDXEditorMethods
} from '@mdxeditor/editor';
import { MapIcon } from '@heroicons/react/24/outline';
import { MDXProvider } from '@mdx-js/react';
import '@mdxeditor/editor/style.css';
 
import mdxPreviewComponents from './mdx-preview-components';
const { Map } = mdxPreviewComponents;


import {
 
  MdxJsxTextElement
} from 'mdast-util-mdx-jsx'

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (content: string) => void;
}

interface InsertMapButtonProps {
  editorRef: React.RefObject<MDXEditorMethods>;
}

const components = {
  Block,
  Figure,
  MapBlock,
  Caption,
  Map
};
/*
const InsertMapButton = ({ editorRef }: InsertMapButtonProps) => {
  const handleClick = () => {
    if (editorRef.current) {
      // Using simple markdown syntax
      const mapMarkdown = `
<MapBlock 
  center={[-94.5, 41.25]}
  zoom={8.3}
  datasetId="tornadoes-2024-paths"
  layerId="tornadoes-2024-paths"
  dateTime="2024-05-31"
/>

`;
      
      // Get current cursor position
      const currentContent = editorRef.current.getMarkdown();
      const cursorPosition = currentContent.length;
      
      // Insert at cursor position
      const newContent = currentContent.slice(0, cursorPosition) + mapMarkdown + currentContent.slice(cursorPosition);
      editorRef.current.setMarkdown(newContent);
      
      console.log('Map markdown inserted:', mapMarkdown);
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Insert Map"
      className="text-gray-600 hover:bg-gray-100 p-2 rounded"
    >
      <MapIcon className="w-4 h-4" />
    </button>
  );
};
*/

const InsertMapButton = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    insertJsx({
      name: 'Map',
      kind: 'flow',
      props: {
        center: { type: 'expression', value: '[-94.5, 41.25]' },
        zoom: { type: 'expression', value: '8.3' },
        datasetId: { type: 'expression', value: '"no2"' },
        layerId: { type: 'expression', value: '"no2-monthly-diff"' },
        dateTime: { type: 'expression', value: '"2024-05-31"' },
      },
    });
  };

  return (
    <Button onClick={handleClick} title="Insert Map">
      <MapIcon className="w-1 h-1" /> Insert Map
    </Button>
  );
};

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'MyLeaf',
    kind: 'text', // 'text' for inline, 'flow' for block
    // the source field is used to construct the import statement at the top of the markdown document.
    // it won't be actually sourced.
    source: './external',
    // Used to construct the property popover of the generic editor
    props: [
      { name: 'foo', type: 'string' },
      { name: 'bar', type: 'string' },
      { name: 'onClick', type: 'expression' }
    ],
    // whether the component has children or not
    hasChildren: true,
    Editor: GenericJsxEditor
  },
  {
    name: 'Marker',
    kind: 'text',
    source: './external',
    props: [{ name: 'type', type: 'string' }],
    hasChildren: false,
    Editor: () => {
      return (
        <div style={{ border: '1px solid red', padding: 8, margin: 8, display: 'inline-block' }}>
          <NestedLexicalEditor<MdxJsxTextElement>
            getContent={(node) => node.children}
            getUpdatedMdastNode={(mdastNode, children: any) => {
              return { ...mdastNode, children }
            }}
          />
        </div>
      )
    }
  },
  {
    name: 'BlockNode',
    kind: 'flow',
    source: './external',
    props: [],
    hasChildren: true,
    Editor: GenericJsxEditor
  },
  {
    name: 'Map',
    kind: 'flow',
    source: '@teamimpact/veda-ui', // Correct library name for the import
    props: [
      { name: 'center', type: 'expression' },
      { name: 'zoom', type: 'expression' },
      { name: 'datasetId', type: 'expression' },
      { name: 'layerId', type: 'expression' },
      { name: 'dateTime', type: 'expression' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor
  },
]

const InsertMyLeaf = () => {
  const insertJsx = usePublisher(insertJsx$)
  return (
    <Button
      onClick={() =>
        insertJsx({
          name: 'MyLeaf',
          kind: 'text',
          props: { foo: 'foo-value', bar: 'bar-value', onClick: { type: 'expression', value: '() => console.log("Clicked")' } }
        })
      }
    >
      Leaf
    </Button>
  )
}

export function MDXEditorWrapper({ markdown, onChange }: MDXEditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    // Force re-render of editor when component mounts
    if (editorRef.current) {
      const editor = editorRef.current as any;
      editor.setMarkdown(markdown);
    }
  }, [markdown]);

  return (
    <MDXProvider components={components}>
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <MDXEditor
          ref={editorRef}
          markdown={markdown}
          onChange={(content) => {
            console.log("MDX Content:", content); // Log the content
            onChange(content); // Call the original onChange
          }}
          contentEditableClassName="prose prose-lg max-w-none min-h-[500px] outline-none px-4 py-2"
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            codeBlockPlugin(),
            frontmatterPlugin(),
            jsxPlugin({ jsxComponentDescriptors }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <BlockTypeSelect />
                  <CreateLink />
                  <CodeToggle />
                
                  <InsertMyLeaf />
                  <InsertMapButton />
                </>
              )
            })
          ]}
          className="w-full h-full"
        />
      </div>
    </MDXProvider>
  );
}
