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

interface MDXEditorWrapperProps {
  markdown: string;
  onChange: (content: string) => void;
}

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
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
];

// Available datasets and layers for the dropdown
const availableDatasets = [
  { 
    id: 'no2', 
    name: 'Nitrogen Dioxide',
    layers: [
      { id: 'no2-monthly-diff', name: 'NO2 Monthly Diff' },
      { id: 'no2-monthly', name: 'NO2 Monthly' },
      { id: 'no2-monthly-2', name: 'NO2 Monthly US' }
    ]
  },
  { 
    id: 'nighttime-lights', 
    name: 'Nighttime Lights',
    layers: [
      { id: 'nightlights-hd-monthly', name: 'Nightlights HD Monthly' }
    ]
  }
];

const InsertMapButton = () => {
  const insertJsx = usePublisher(insertJsx$);
  const [datasetId, setDatasetId] = useState('no2');
  const [layerId, setLayerId] = useState('no2-monthly-diff');
  const [availableLayers, setAvailableLayers] = useState(availableDatasets[0].layers);

  // Update available layers when dataset changes
  useEffect(() => {
    const selectedDataset = availableDatasets.find(d => d.id === datasetId);
    if (selectedDataset) {
      setAvailableLayers(selectedDataset.layers);
      setLayerId(selectedDataset.layers[0].id);
    }
  }, [datasetId]);

  const handleClick = () => {
    insertJsx({
      name: 'Map',
      kind: 'flow',
      props: {
        center: { type: 'expression', value: '[-94.5, 41.25]' },
        zoom: { type: 'expression', value: '8.3' },
        datasetId: { type: 'expression', value: `"${datasetId}"` },
        layerId: { type: 'expression', value: `"${layerId}"` },
        dateTime: { type: 'expression', value: '"2024-05-31"' },
      },
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <select 
        value={datasetId}
        onChange={(e) => setDatasetId(e.target.value)}
        className="text-sm border rounded px-2 py-1"
      >
        {availableDatasets.map(dataset => (
          <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
        ))}
      </select>
      <select 
        value={layerId}
        onChange={(e) => setLayerId(e.target.value)}
        className="text-sm border rounded px-2 py-1"
      >
        {availableLayers.map(layer => (
          <option key={layer.id} value={layer.id}>{layer.name}</option>
        ))}
      </select>
      <Button onClick={handleClick} title="Insert Map">
        <MapIcon className="w-4 h-4" /> Insert Map
      </Button>
    </div>
  );
};

const components = {
  Block,
  Figure,
  MapBlock,
  Caption,
  Map
};

export function MDXEditorEnhanced({ markdown, onChange }: MDXEditorWrapperProps) {
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
            jsxPlugin({ jsxComponentDescriptors }),
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
  );
}
