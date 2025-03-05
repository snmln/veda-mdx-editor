'use client';

import React, { useEffect, useRef, useState } from 'react';
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

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (content: string) => void;
}

// Create a context to share the editor reference
const EditorContext = React.createContext<MDXEditorMethods | null>(null);

const InsertMapButton = () => {
  const editor = React.useContext(EditorContext);

  const handleClick = () => {
    // Insert the Map component as raw markdown
    const mapCode = `
<Map 
  center={[-94.5, 41.25]} 
  zoom={8.3} 
  datasetId="no2" 
  layerId="no2-monthly-diff" 
  dateTime="2024-05-31" 
  compareDateTime="2023-05-31" 
  compareLabel="May 2024 VS May 2023" 
/>
`;
    
    if (editor) {
      // Insert the map code at the current cursor position
      const editorInstance = editor as any;
      if (editorInstance && editorInstance.setMarkdown) {
        // Get current content
        const currentContent = editorInstance.getMarkdown();
        // Append the map code
        editorInstance.setMarkdown(currentContent + mapCode);
      }
    }
  };

  return (
    <Button onClick={handleClick} title="Insert Map">
      <MapIcon className="w-4 h-4" /> Insert Map
    </Button>
  );
};

const components = {
  Block,
  Figure,
  MapBlock,
  Caption,
  Map
};

export function MDXEditorSimple({ markdown, onChange }: MDXEditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [editorInstance, setEditorInstance] = useState<MDXEditorMethods | null>(null);

  useEffect(() => {
    // Force re-render of editor when component mounts
    if (editorRef.current) {
      const editor = editorRef.current as any;
      editor.setMarkdown(markdown);
      setEditorInstance(editorRef.current);
    }
  }, [markdown]);

  return (
    <EditorContext.Provider value={editorInstance}>
      <MDXProvider components={components}>
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <MDXEditor
            ref={editorRef}
            markdown={markdown}
            onChange={(content) => {
              console.log("MDX Content:", content);
              onChange(content);
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
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <BlockTypeSelect />
                    <CreateLink />
                    <CodeToggle />
                    <InsertMapButton />
                  </>
                )
              })
            ]}
            className="w-full h-full"
          />
        </div>
      </MDXProvider>
    </EditorContext.Provider>
  );
}
