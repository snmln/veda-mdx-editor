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

import { scrollytellingButtonPlugin } from '../plugins/scrollytelling/scrollytellingButtonPlugin'
import { InsertScrollytellingButton } from '../plugins/scrollytelling/InsertScrollytellingButton'

// Import our map editor with live preview component
const MapEditorWrapper = dynamic(
  () => import('./MinimalMapEditor'),
  {
    ssr: false,
    loading: () => <div className="p-4 text-center">Loading map editor...</div>
  }
);

interface MDXEditorWrapperProps {
    markdown: string;
    onChange: (content: string) => void;
}

interface MapProps {
    center: string;
    zoom: string;
    datasetId: string;
    layerId: string;
    dateTime: string;
    compareDateTime: string;
    compareLabel: string;
}

// Default map props to ensure consistency
const DEFAULT_MAP_PROPS: MapProps = {
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
            insertJsx({
                name: 'Map',
                kind: 'text',
                props: { ...DEFAULT_MAP_PROPS }
            });
        } catch (error) {
            console.error('Error inserting Map component:', error);
            alert('Could not insert Map component. See console for details.');
        }
    };

    return (
        <Button onClick={handleClick} title="Insert Map" className="text-xs">
            <MapIcon className="w-3 h-3 mr-1" /> Map
        </Button>
    );
};

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
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
        Editor: MapEditorWrapper
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
                    scrollytellingButtonPlugin(),
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    codeBlockPlugin(),
                    frontmatterPlugin(),
                    jsxPlugin({ 
                        jsxComponentDescriptors
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
                                <InsertScrollytellingButton />
                            </>
                        )
                    }),
                ]}
                className="w-full h-full"
            />
        </div>
    );
}