// app/components/mdx-editor-enhanced.tsx

'use client';

import React from 'react';
import { MDXEditor } from '@mdxeditor/editor';
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
    usePublisher,
    insertJsx$,
} from '@mdxeditor/editor';
import { MapIcon } from '@heroicons/react/24/outline';
import '@mdxeditor/editor/style.css';
import dynamic from 'next/dynamic';

// Import our map editor with live preview component
const MapEditorWrapper = dynamic(
  () => import('./minimal-map-editor'),
  {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading map editor...</div>
  }
);

interface MDXEditorWrapperProps {
    markdown: string;
    onChange: (content: string) => void;
}

// Default map props to ensure consistency
const DEFAULT_MAP_PROPS = {
    center: '[-94.5, 41.25]',
    zoom: '8.3',
    datasetId: 'no2',
    layerId: 'no2-monthly-diff',
    dateTime: '2024-05-31',
    compareDateTime: '2023-05-31',
    compareLabel: 'May 2024 VS May 2023',
};

const InsertMapButton = () => {
    const insertJsx = usePublisher(insertJsx$);

    const handleClick = () => {
        try {
            // Insert with default props
            insertJsx({
                name: 'Map',
                kind: 'text',
                props: { ...DEFAULT_MAP_PROPS }
            });
        } catch (error) {
            console.error('Error inserting Map component:', error);
            // Provide user feedback
            alert('Could not insert Map component. See console for details.');
        }
    };

    return (
        <Button onClick={handleClick} title="Insert Map">
            <MapIcon className="w-4 h-4" /> Insert Map
        </Button>
    );
};

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    {
        name: 'Map',
        kind: 'text',
        source: '@teamimpact/veda-ui',
        props: [
            { name: 'center', type: 'string', defaultValue: DEFAULT_MAP_PROPS.center },
            { name: 'zoom', type: 'string', defaultValue: DEFAULT_MAP_PROPS.zoom },
            { name: 'datasetId', type: 'string', defaultValue: DEFAULT_MAP_PROPS.datasetId },
            { name: 'layerId', type: 'string', defaultValue: DEFAULT_MAP_PROPS.layerId },
            { name: 'dateTime', type: 'string', defaultValue: DEFAULT_MAP_PROPS.dateTime },
            { name: 'compareDateTime', type: 'string', defaultValue: DEFAULT_MAP_PROPS.compareDateTime },
            { name: 'compareLabel', type: 'string', defaultValue: DEFAULT_MAP_PROPS.compareLabel },
        ],
        hasChildren: false,
        Editor: MapEditorWrapper,
        // This component will be rendered in preview mode
        render: (props) => {
            return (
                <div className="border border-blue-200 rounded p-2 bg-blue-50 text-sm text-blue-700">
                    Map component: {props.datasetId || DEFAULT_MAP_PROPS.datasetId}/{props.layerId || DEFAULT_MAP_PROPS.layerId}
                </div>
            );
        }
    }
];

export function MDXEditorEnhanced({ markdown, onChange }: MDXEditorWrapperProps) {
    return (
        <div className="h-[600px] border rounded-lg overflow-hidden">
            <MDXEditor
                markdown={markdown}
                onChange={onChange}
                contentEditableClassName="prose prose-lg max-w-none min-h-[500px] outline-none px-4 py-2"
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    codeBlockPlugin(),
                    frontmatterPlugin(),
                    jsxPlugin({ 
                        jsxComponentDescriptors,
                        // Add error handling for JSX rendering
                        onError: (error) => {
                            console.error('JSX Plugin Error:', error);
                        }
                    }),
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
                    }),
                ]}
                className="w-full h-full"
            />
        </div>
    );
}