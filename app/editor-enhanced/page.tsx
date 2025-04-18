'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { MDXProvider } from '@mdx-js/react';

// Import customComponents (Make sure this path is *exactly* correct)
import { customComponents } from '../components/mdx-editor/components/components';

// Create a components object to pass to MDXProvider
const components = {
  ...customComponents,
  // Include any other components you're using in your MDX content
};

// Dynamically import the editor and preview components
const MDXEditorWrapper = dynamic(
  () => import('../components/mdx-editor/components/MDXEditor').then((mod) => mod.MDXEditorEnhanced),
  {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">Loading editor...</div>
  }
);

const MDXPreview = dynamic(
  () => import('../components/mdx-editor/components/MDXPreview').then((mod) => mod.SimpleMDXPreview),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8">Loading preview...</div>
  }
);

// No need for MDXEditorSimple anymore

const initialContent = `# Welcome to the MDX Editor

This is a live editor where you can write and preview MDX content.

## Features
- Live preview
- Markdown formatting
- Code blocks

Try editing this content!
<Map center="[-94.5, 41.25]" zoom="8.3" datasetId="no2" layerId="no2-monthly-diff" dateTime="2024-05-31" compareDateTime="2023-05-31" compareLabel="May 2024 VS May 2023"></Map>
`; // Initial content WITH a Map component

export default function EditorPage() {
  const [mdxContent, setMdxContent] = useState(initialContent);
  const [selectedTab, setSelectedTab] = useState(0);
  const [editorKey, setEditorKey] = useState(0); // Key for forcing re-render

  const handleContentChange = useCallback((content: string) => {
    setMdxContent(content);
  }, []);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    if (index === 0) {
      // Increment the key ONLY when switching back to the editor
      setEditorKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-gray-50">
      <MDXProvider components={components}>
        <Tab.Group selectedIndex={selectedTab} onChange={handleTabChange}>
          <Tab.List className="flex space-x-4 mb-4">
            <Tab className={({ selected }) =>
              `px-4 py-2 rounded-lg ${
                selected ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`
            }>
              Editor
            </Tab>
            <Tab className={({ selected }) =>
              `px-4 py-2 rounded-lg ${
                selected ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`
            }>
              Preview
            </Tab>
          </Tab.List>

          <Tab.Panels className="border rounded-lg p-4 bg-white shadow-lg">
            <Tab.Panel>
              <Suspense fallback={<div>Loading editor...</div>}>
                <MDXEditorWrapper
                  key={editorKey}  {/* Force re-mount on tab switch */}
                  markdown={mdxContent}
                  onChange={handleContentChange}
                />
              </Suspense>
            </Tab.Panel>
            <Tab.Panel>
              <div className="prose max-w-none p-4">
                <Suspense fallback={<div>Loading MDX preview...</div>}>
                  <MDXPreview source={mdxContent} />
                </Suspense>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </MDXProvider>
    </div>
  );
}