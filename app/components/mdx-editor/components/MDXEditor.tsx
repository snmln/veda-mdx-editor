'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  directivesPlugin,
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
import { reserializedMdxContent } from '../utils/reserializeMDast';

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
  InsertSectionBreak,
} from './ToolbarComponents';
import { $wrapNodes } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';
import {
  jsxComponentDescriptors,
  CalloutDirectiveDescriptor,
} from './ComponentDescriptors';
import { nodeGroupingPlugin } from '../plugins/mdxGrouping';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createBlockNode, $createProseNode } from '../plugins/utils';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';

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

export function MDXEditorEnhanced({
  markdown,
  onChange,
  editorMounted,
  previewMDAST,
}: any) {
  const editorRef = useRef(null);
  const [mdast, setMdast] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Check if editor is ready after mount
  useEffect(() => {
    const checkEditor = () => {
      if (editorRef.current) {
        setIsEditorReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkEditor, 100);
      }
    };

    checkEditor();
  }, []);

  const analyzeMdast = () => {
    if (!editorRef.current) {
      alert('Editor ref is null - editor not yet initialized');
      return;
    }

    try {
      const markdown = editorRef.current.getMarkdown();

      if (markdown) {
        const tree = fromMarkdown(markdown, {
          extensions: [mdxJsx()],
          mdastExtensions: [mdxJsxFromMarkdown()],
        });
        //mdxJsxFromMarkdown converts all contents of TwoCOlumn to 'code' blocks
        //Below re parses it and converts back to accepted MDX values.
        visit(tree, 'mdxJsxFlowElement', (node) => {
          if (['RightColumn', 'LeftColumn'].includes(node.name)) {
            const innerMarkdown = node.children[0].value;
            const parsed = fromMarkdown(innerMarkdown, {
              extensions: [mdxJsx()],
              mdastExtensions: [mdxJsxFromMarkdown()],
            }).children;

            node.children = parsed;
          }
        });
        setMdast(tree);

        previewMDAST(reserializedMdxContent(tree));
      } else {
        alert('No markdown content found');
      }
    } catch (error) {
      console.error('Error analyzing MDAST:', error);
      alert('Error analyzing MDAST: ' + error.message);
    }
  };

  return (
    <div className='h-[600px] border rounded-lg overflow-hidden'>
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={(e) => {
          analyzeMdast();
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
          directivesPlugin({
            directiveDescriptors: [CalloutDirectiveDescriptor],
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

                  <InsertSectionBreak />
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
