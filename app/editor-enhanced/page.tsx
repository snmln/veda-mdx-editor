'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { MDXProvider } from '@mdx-js/react';

// Define your custom components here 
import { customComponents } from '../components/custom-components';

// Create a components object to pass to MDXProvider
const components = {
  ...customComponents,
  // Include any other components you're using in your MDX content
};

// Dynamically import both the editor and preview components
const MDXEditorWrapper = dynamic(
  () => import('../components/mdx-editor-enhanced').then((mod) => mod.MDXEditorEnhanced),
  { 
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">Loading editor...</div>
  }
);

// Dynamically import the MDXPreview component to avoid server-side rendering issues
const MDXPreview = dynamic(
  () => import('../components/mdx-preview-enhanced').then((mod) => mod.MDXPreviewEnhanced),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8">Loading preview...</div>
  }
);

const initialContent = `# Welcome to the Enhanced MDX Editor

This is a live editor where you can write and preview MDX content with Map components.

## Features
- Live preview
- Markdown formatting
- Map components with dataset selection
- Client-side rendering of Map components

Try inserting a Map component using the toolbar!
`;

export default function EditorEnhancedPage() {
  const [mdxContent, setMdxContent] = useState(initialContent);
  const handleContentChange = useCallback((content: string) => {
    setMdxContent(content);
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Enhanced MDX Editor with Map Support</h1>
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
