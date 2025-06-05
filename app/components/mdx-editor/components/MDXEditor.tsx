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
  // const [editor] = useLexicalComposerContext();
  // const groupMdxWithLexical = useCallback(() => {
  //   if (!editor) {
  //     return;
  //   }

  //   editor.update(() => {
  //     const root = $getRoot();

  //     const children = root.getChildren();
  //     console.log('editor', editor);

  //     const newChildren = [];
  //     let currentBlockChildren = [];
  //     let inBlock = false;

  //     children.forEach((node) => {
  //       // Check if the node is a heading or paragraph (you'll need to inspect the node's type)
  //       const isHeadingOrParagraphNode =
  //         node.getType() === 'heading' || node.getType() === 'paragraph';
  //       if (isHeadingOrParagraphNode) {
  //         console.log('isHeadingOrParagraphNode', node.getType());
  //         currentBlockChildren.push(node);
  //         inBlock = true;
  //       } else {
  //         if (inBlock && currentBlockChildren.length > 0) {
  //           const blockNode = $createBlockNode(); // You'll need to create your custom BlockNode
  //           const proseNode = $createProseNode(); // You'll need to create your custom ProseNode
  //           currentBlockChildren.forEach((child) => proseNode.append(child));
  //           blockNode.append(proseNode);
  //           newChildren.push(blockNode);
  //           currentBlockChildren = [];
  //           inBlock = false;
  //         }
  //         newChildren.push(node);
  //       }
  //     });

  //     // Handle any remaining nodes in the last block
  //     if (inBlock && currentBlockChildren.length > 0) {
  //       const blockNode = $createBlockNode();
  //       const proseNode = $createProseNode();
  //       currentBlockChildren.forEach((child) => proseNode.append(child));
  //       blockNode.append(proseNode);
  //       newChildren.push(blockNode);
  //     }

  //     // Clear the root and append the new structure
  //     root.clear();
  //     newChildren.forEach((node) => root.append(node));
  //   });
  // }, [editor]);
  // useEffect(() => {
  //   console.log('useeffect called editorMounted', editorMounted, editor);
  //   if (editorMounted && editor) {
  //     // You might want to trigger this on a specific action (e.g., before saving)
  //     // For now, let's trigger it after the initial load
  //     groupMdxWithLexical();
  //   }
  // }, [editorMounted, editor, groupMdxWithLexical]);
  const mockProcessor = {
    parse: (markdown) => {
      // Simplified MDAST structure for demo
      const lines = markdown.split('\n').filter((line) => line.trim());
      const nodes = [];

      lines.forEach((line) => {
        if (line.startsWith('#')) {
          const level = (line.match(/^#+/) || [''])[0].length;
          nodes.push({
            type: 'heading',
            depth: level,
            children: [{ type: 'text', value: line.replace(/^#+\s*/, '') }],
          });
        } else if (line.includes('[') && line.includes('](')) {
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          const matches = [...line.matchAll(linkRegex)];
          if (matches.length > 0) {
            nodes.push({
              type: 'paragraph',
              children: matches.map((match) => ({
                type: 'link',
                url: match[2],
                children: [{ type: 'text', value: match[1] }],
              })),
            });
          }
        } else if (line.trim()) {
          nodes.push({
            type: 'paragraph',
            children: [{ type: 'text', value: line }],
          });
        }
      });

      return {
        type: 'root',
        children: nodes,
      };
    },
  };

  const mockVisit = (tree, nodeType, callback) => {
    const visit = (node) => {
      if (!nodeType || node.type === nodeType) {
        callback(node);
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };

  const editorRef = useRef(null);
  const [mdast, setMdast] = useState(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [stats, setStats] = useState({ headings: 0, links: 0, paragraphs: 0 });

  // Check if editor is ready after mount
  useEffect(() => {
    const checkEditor = () => {
      if (editorRef.current) {
        setIsEditorReady(true);
        console.log('Editor is ready:', editorRef.current);
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
      console.log('Retrieved markdown:', markdown);

      if (markdown) {
        const tree = mockProcessor.parse(markdown);
        setMdast(tree);
        console.log('reserializedMdxContent EDITOR', reserializedMdxContent(tree));
        previewMDAST(reserializedMdxContent(tree))
        // Analyze the tree
        const newStats = { headings: 0, links: 0, paragraphs: 0 };

        mockVisit(tree, null, (node) => {
          if (node.type === 'heading') newStats.headings++;
          if (node.type === 'link') newStats.links++;
          if (node.type === 'paragraph') newStats.paragraphs++;
        });

        setStats(newStats);
        console.log('MDAST:', tree);
        console.log('Stats:', newStats);
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
