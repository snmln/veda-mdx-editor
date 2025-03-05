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
      kind: 'text', // Changed to 'text' like MyLeaf
      props: {
        center: { type: 'expression', value: '[-94.5, 41.25]' },
        zoom: { type: 'expression', value: '8.3' },
        datasetId: { type: 'expression', value: '"no2"' },
        layerId: { type: 'expression', value: '"no2-monthly-diff"' },
        dateTime: { type: 'expression', value: '"2024-05-31"' },
        compareDateTime: { type: 'expression', value: '"2023-05-31"' },
        compareLabel: { type: 'expression', value: '"May 2024 VS May 2023"' },
      }
      // Removed children property to match MyLeaf
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
  const [compareDateTime, setCompareDateTime] = useState(
    initialValue?.props?.compareDateTime?.value?.replace(/"/g, '') || '2023-05-31'
  );
  const [compareLabel, setCompareLabel] = useState(
    initialValue?.props?.compareLabel?.value?.replace(/"/g, '') || 'May 2024 VS May 2023'
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
  
  const handleCompareDateTimeChange = (e) => {
    setCompareDateTime(e.target.value);
    
    // Update the JSX component props
    if (onChange && initialValue) {
      const newProps = {
        ...initialValue.props,
        compareDateTime: { type: 'expression', value: `"${e.target.value}"` },
      };
      onChange({ ...initialValue, props: newProps });
    }
  };
  
  const handleCompareLabelChange = (e) => {
    setCompareLabel(e.target.value);
    
    // Update the JSX component props
    if (onChange && initialValue) {
      const newProps = {
        ...initialValue.props,
        compareLabel: { type: 'expression', value: `"${e.target.value}"` },
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
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Compare Date (YYYY-MM-DD)</label>
          <input 
            type="text"
            value={compareDateTime}
            onChange={handleCompareDateTimeChange}
            placeholder="2023-05-31"
            className="w-full text-sm border rounded px-2 py-1"
          />
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Compare Label</label>
          <input 
            type="text"
            value={compareLabel}
            onChange={handleCompareLabelChange}
            placeholder="May 2024 VS May 2023"
            className="w-full text-sm border rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
};

// Enhanced Map component for the editor that includes both the map preview and configuration
const EnhancedMapComponent = (props) => {
  // Extract values from props
  const center = props.center?.value?.replace(/['"]/g, '') || '[-94.5, 41.25]';
  const zoom = props.zoom?.value?.replace(/['"]/g, '') || '8.3';
  const datasetId = props.datasetId?.value?.replace(/['"]/g, '') || 'no2';
  const layerId = props.layerId?.value?.replace(/['"]/g, '') || 'no2-monthly-diff';
  const dateTime = props.dateTime?.value?.replace(/['"]/g, '') || '2024-05-31';
  const compareDateTime = props.compareDateTime?.value?.replace(/['"]/g, '') || '2023-05-31';
  const compareLabel = props.compareLabel?.value?.replace(/['"]/g, '') || 'May 2024 VS May 2023';

  // Parse center as JSON if it's a string
  const parsedCenter = typeof center === 'string' ? 
    (center.startsWith('[') ? JSON.parse(center) : center) : 
    center;

  // Parse zoom as number if it's a string
  const parsedZoom = typeof zoom === 'string' ? 
    (isNaN(parseFloat(zoom)) ? 8.3 : parseFloat(zoom)) : 
    zoom;

  return (
    <div className="my-4 border rounded-lg overflow-hidden">
      {/* Map preview */}
      <div className="h-[300px] relative">
        <Map 
          center={parsedCenter}
          zoom={parsedZoom}
          datasetId={datasetId}
          layerId={layerId}
          dateTime={dateTime}
          compareDateTime={compareDateTime}
          compareLabel={compareLabel}
        />
      </div>
      
      {/* Map info banner */}
      <div className="bg-blue-50 p-2 border-t border-blue-200 flex items-center">
        <MapIcon className="w-5 h-5 text-blue-500 mr-2" />
        <span className="text-sm text-blue-700">
          <strong>Map:</strong> {datasetId}/{layerId}
        </span>
      </div>
    </div>
  );
};

// Create a custom JSX component descriptor for the Map component
const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'Map',
    kind: 'text', // Changed to 'text' like MyLeaf
    source: '@teamimpact/veda-ui', // Correct library name for the import
    props: [
      { name: 'center', type: 'expression' },
      { name: 'zoom', type: 'expression' },
      { name: 'datasetId', type: 'expression' },
      { name: 'layerId', type: 'expression' },
      { name: 'dateTime', type: 'expression' },
      { name: 'compareDateTime', type: 'expression' },
      { name: 'compareLabel', type: 'expression' },
    ],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
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
];

const components = {
  Block,
  Figure,
  MapBlock,
  Caption,
  Map: EnhancedMapComponent // Use our enhanced map component in the editor
};

// Helper function to preserve Map components in markdown
const preserveMapComponents = (markdown: string): string => {
  // This regex matches Map JSX components with their attributes
  const mapRegex = /<map([^>]*)><br><\/map>/g;
  
  // Replace each Map component with a special marker that includes the attributes
  return markdown.replace(mapRegex, (match, attributes) => {
    // Clean up the attributes
    const cleanAttributes = attributes
      .replace(/center="\[object Object\]"/g, 'center="[-94.5, 41.25]"')
      .replace(/zoom="\[object Object\]"/g, 'zoom="8.3"')
      .replace(/datasetid="\[object Object\]"/g, 'datasetId="no2"')
      .replace(/layerid="\[object Object\]"/g, 'layerId="no2-monthly-diff"')
      .replace(/datetime="\[object Object\]"/g, 'dateTime="2024-05-31"')
      .replace(/comparedatetime="\[object Object\]"/g, 'compareDateTime="2023-05-31"')
      .replace(/comparelabel="\[object Object\]"/g, 'compareLabel="May 2024 VS May 2023"');
    
    // Return a special JSX component that will be properly handled by the editor
    return `<Map${cleanAttributes}></Map>`;
  });
};

export function MDXEditorEnhanced({ markdown, onChange }: MDXEditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [key, setKey] = useState(0); // Add a key to force re-render
  const [internalMarkdown, setInternalMarkdown] = useState(markdown);
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  // Update internal markdown when prop changes
  useEffect(() => {
    // If we're switching tabs and the markdown has changed, it might contain broken Map components
    if (isTabSwitching && markdown !== lastSavedContent) {
      const fixedMarkdown = preserveMapComponents(markdown);
      setInternalMarkdown(fixedMarkdown);
      setIsTabSwitching(false);
    } else {
      setInternalMarkdown(markdown);
    }
    
    // Save the last markdown we received from props
    setLastSavedContent(markdown);
  }, [markdown, isTabSwitching, lastSavedContent]);

  // Detect tab switching
  useEffect(() => {
    // This will run when the component is mounted or re-rendered with a new key
    setIsTabSwitching(key > 0);
  }, [key]);

  // Force re-render when switching back to the editor tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && editorRef.current) {
        try {
          // When the tab becomes visible again, force a re-render
          setKey(prevKey => prevKey + 1);
          setIsTabSwitching(true);
        } catch (error) {
          console.error("Error handling visibility change:", error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <MDXProvider components={components}>
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <MDXEditor
          key={key} // Add key to force re-render
          ref={editorRef}
          markdown={internalMarkdown}
          onChange={(content) => {
            console.log("MDX Content:", content);
            setInternalMarkdown(content);
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
                  <InsertMyLeaf />
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
