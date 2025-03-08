// app/editor/page.tsx
'use client';

import React, { useState, useCallback, Suspense, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import dynamic from 'next/dynamic';
import { MDXProvider } from '@mdx-js/react';
import { customComponents } from '../components/custom-components';

const MDXEditorWrapper = dynamic(
  () => import('../components/mdx-editor-enhanced').then((mod) => mod.MDXEditorEnhanced),
  {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center">Loading editor...</div>
  }
);

// Use the simple preview component that works
const SimpleMDXPreview = dynamic( 
  () => import('../components/simple-mdx-preview').then((mod) => mod.SimpleMDXPreview),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8">Loading preview...</div>
  }
);

const initialContent = `# Welcome to the MDX Editor

This is a live editor where you can write and preview MDX content.

## Features

-   Live preview
-   Markdown formatting
-   Code blocks
-   Insert custom Map components

Try editing this content!

 
`;

// Flag to control localStorage usage
const USE_LOCAL_STORAGE = false; // You can set to false to disable localStorage

const STORAGE_KEY = 'mdx-editor-content';

export default function EditorPage() {
  const [mdxContent, setMdxContent] = useState(initialContent);

  // Load from localStorage on component mount if enabled
  useEffect(() => {
    if (USE_LOCAL_STORAGE && typeof window !== 'undefined') {
      const storedContent = localStorage.getItem(STORAGE_KEY);
      if (storedContent) {
        setMdxContent(storedContent);
      }
    }
  }, []);

  const handleContentChange = useCallback((content: string) => {
    setMdxContent(content);
    
    // Only save to localStorage if enabled
    if (USE_LOCAL_STORAGE && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, content);
    }
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-gray-50">
      {!USE_LOCAL_STORAGE && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="font-bold">Note:</p>
          <p>localStorage is currently disabled. Your changes will not be saved between page refreshes.</p>
        </div>
      )}

      <Tab.Group>
        <Tab.List className="flex space-x-4 mb-4">
          <Tab className={({ selected }) =>
            `px-4 py-2 rounded-lg ${selected ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`
          }>
            Editor
          </Tab>
          <Tab className={({ selected }) =>
            `px-4 py-2 rounded-lg ${selected ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
                <SimpleMDXPreview source={mdxContent} />
              </Suspense>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}