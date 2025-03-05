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

  const handleClick = () => {
    // Insert a default Map component with no2-monthly-diff dataset/layer
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
      <MapIcon className="w-4 h-4" /> Insert Map
    </Button>
  );
};

// Custom editor for Map component that shows dataset/layer selection in the settings panel
const MapComponentEditor = (props: any) => {
  // Use GenericJsxEditor for the base functionality
  const GenericEditor = GenericJsxEditor;
  
  // Extract the node and onChange from props
  const { onChange, jsxComponentDescriptor, initialValue } = props;
  
  const [datasetId, setDatasetId] = useState(
    initialValue?.props?.datasetId?.value?.replace(/"/g, '') || 'no2'
  );
  const [layerId, setLayerId] = useState(
    initialValue?.props?.layerId?.value?.replace(/"/g, '') || 'no2-monthly-diff'
  );
  const [availableLayers, setAvailableLayers] = useState(
    availableDatasets.find(d => d.id === datasetId)?.layers || []
  );

  // Update available layers when dataset changes
  useEffect(() => {
    const selectedDataset = availableDatasets.find(d => d.id === datasetId);
    if (selectedDataset) {
      setAvailableLayers(selectedDataset.layers);
      if (!selectedDataset.layers.find(l => l.id === layerId)) {
        setLayerId(selectedDataset.layers[0].id);
      }
    }
  }, [datasetId, layerId]);

  // Handle dataset or layer change
  const handleDatasetChange = (e) => {
    setDatasetId(e.target.value);
    
    // Update the JSX component props
    if (onChange && initialValue) {
      const newProps = {
        ...initialValue.props,
        datasetId: { type: 'expression', value: `"${e.target.value}"` },
      };
      onChange({ ...initialValue, props: newProps });
    }
  };
  
  const handleLayerChange = (e) => {
    setLayerId(e.target.value);
    
    // Update the JSX component props
    if (onChange && initialValue) {
      const newProps = {
        ...initialValue.props,
        layerId: { type: 'expression', value: `"${e.target.value}"` },
      };
      onChange({ ...initialValue, props: newProps });
    }
  };

  return (
    <div>
      {/* Render the original editor */}
      <GenericEditor {...props} />
      
      {/* Add our custom dataset/layer selectors */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="font-bold mb-2">Map Settings</h3>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Dataset</label>
          <select 
            value={datasetId}
            onChange={handleDatasetChange}
            className="w-full text-sm border rounded px-2 py-1"
          >
            {availableDatasets.map(dataset => (
              <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Layer</label>
          <select 
            value={layerId}
            onChange={handleLayerChange}
            className="w-full text-sm border rounded px-2 py-1"
          >
            {availableLayers.map(layer => (
              <option key={layer.id} value={layer.id}>{layer.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

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
    Editor: MapComponentEditor // Use our custom editor instead of GenericJsxEditor
  },
];

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
