'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { MDXProvider } from '@mdx-js/react';
import { MDXPreview } from '../components/mdx-preview';

// Define your custom components here 

import { customComponents } from '../components/custom-components';

// Create a components object to pass to MDXProvider
const components = {
  ...customComponents,
  // Include any other components you're using in your MDX content
};

const MDXEditorWrapper = dynamic(
  () => import('../components/mdx-editor').then((mod) => mod.MDXEditorWrapper),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">Loading editor...</div>
  }
);



const initialContent = `# Welcome to the MDX Editor

This is a live editor where you can write and preview MDX content.

## Features
- Live preview
- Markdown formatting
- Code blocks

Try editing this content!
`;

export default function EditorPage() {
  const [mdxContent, setMdxContent] = useState(initialContent);
  const handleContentChange = useCallback((content: string) => {
    setMdxContent(content);
  }, []);

  //return (<MapBlock center={[-94.5, 41.25]} zoom={8.3} datasetId={"tornadoes-2024-paths"} layerId={"tornadoes-2024-paths"} dateTime={"2024-05-31"} />)
  //return (<Map center={[-94.5, 41.25]} zoom={8.3} datasetId="no2" layerId="no2-monthly-diff" dateTime="2024-05-31" />)
  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-gray-50">
      <MDXProvider components={components}>
        <Tab.Group>
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
                  markdown={mdxContent}
                  onChange={handleContentChange}
                />
              </Suspense>
            </Tab.Panel>
            <Tab.Panel>
              <div className="prose max-w-none p-4">
                <MDXPreview source={mdxContent} />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </MDXProvider>
    </div>
  );
}
