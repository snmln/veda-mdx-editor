'use client';

import React, { useCallback, useEffect } from 'react';
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
  InsertImage,
  imagePlugin,
  ListsToggle,
  MDXEditor,
  NestedLexicalEditor,
  CodeMirrorEditor,
  useMdastNodeUpdater,
  rootEditor$,
  addImportVisitor$,
  realmPlugin,
  Cell,
  Signal,
  useCellValues,
  markdown$,
} from '@mdxeditor/editor';
import {
  $getRoot,
  $getSelection,
  LexicalEditor,
  $isRangeSelection,
  $isParagraphNode,
  $isElementNode,
  $isTextNode,
  ElementNode,
  TextNode,
  LexicalNode,
  $createParagraphNode,
  $createTextNode,
} from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
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
import { $wrapNodes } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';
import { jsxComponentDescriptors } from './ComponentDescriptors';
import { nodeGroupingPlugin } from '../plugins/mdxGrouping';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createBlockNode, $createProseNode } from '../plugins/utils';

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (content: string) => void;
}

const initialConfig = {
  namespace: 'MyEditor', // Unique namespace for this editor instance
  onError: (error) => {
    console.error('Lexical editor error:', error);
  },
  // ... other Lexical configuration options if needed
};

export function MDXEditorEnhanced({ markdown, onChange, editorMounted }: any) {
  const [editor] = useLexicalComposerContext();
  const groupMdxWithLexical = useCallback(() => {
    console.log('groupMdxWithLexical was reacehd');

    if (!editor) {
      return;
    }

    editor.update(() => {
      const root = $getRoot();

      const children = root.getChildren();
      console.log('children', children);

      const newChildren = [];
      let currentBlockChildren = [];
      let inBlock = false;

      children.forEach((node) => {
        // Check if the node is a heading or paragraph (you'll need to inspect the node's type)
        const isHeadingOrParagraphNode =
          node.getType() === 'heading' || node.getType() === 'paragraph';
        if (isHeadingOrParagraphNode) {
          currentBlockChildren.push(node);
          inBlock = true;
        } else {
          if (inBlock && currentBlockChildren.length > 0) {
            const blockNode = $createBlockNode(); // You'll need to create your custom BlockNode
            const proseNode = $createProseNode(); // You'll need to create your custom ProseNode
            currentBlockChildren.forEach((child) => proseNode.append(child));
            blockNode.append(proseNode);
            newChildren.push(blockNode);
            currentBlockChildren = [];
            inBlock = false;
          }
          newChildren.push(node);
        }
      });

      // Handle any remaining nodes in the last block
      if (inBlock && currentBlockChildren.length > 0) {
        const blockNode = $createBlockNode();
        const proseNode = $createProseNode();
        currentBlockChildren.forEach((child) => proseNode.append(child));
        blockNode.append(proseNode);
        newChildren.push(blockNode);
      }

      // Clear the root and append the new structure
      root.clear();
      newChildren.forEach((node) => root.append(node));
    });
  }, [editor]);
  useEffect(() => {
    console.log('useeffect called editorMounted', editorMounted, editor);
    if (editorMounted && editor) {
      // You might want to trigger this on a specific action (e.g., before saving)
      // For now, let's trigger it after the initial load
      groupMdxWithLexical();
    }
  }, [editorMounted, editor, groupMdxWithLexical]);
  return (
    <div className='h-[600px] border rounded-lg overflow-hidden'>
      <MDXEditor
        markdown={markdown}
        onChange={(e) => {
          groupMdxWithLexical();
          return onChange(e);
        }}
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
          markdownShortcutPlugin(),
          nodeGroupingPlugin(),
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
