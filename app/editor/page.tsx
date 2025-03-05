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

const initialContent = `# Welcome to the MDX Editor

This is a live editor where you can write and preview MDX content.

## Features
- Live preview
- Markdown formatting
- Code blocks

Try editing this content!
`;

export default function EditorPage() {
  // Clear any existing localStorage data on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mdxEditorContent');
    }
  }, []);

  // Use state to store MDX content without localStorage
  const [mdxContent, setMdxContent] = useState(initialContent);
  
  const handleContentChange = useCallback((content: string) => {
    setMdxContent(content);
    // No longer saving to localStorage
  }, []);

  // Add state to track the current tab
  const [selectedTab, setSelectedTab] = useState(0);
  const [editorKey, setEditorKey] = useState(0);
  const [preservedContent, setPreservedContent] = useState(mdxContent);

  // Handle tab change
  const handleTabChange = (index) => {
    // If switching to preview tab, preserve the current content
    if (index === 1 && selectedTab === 0) {
      setPreservedContent(mdxContent);
    }
    
    // If switching back to the editor tab, increment the key to force re-render
    // and ensure we use the preserved content
    if (index === 0 && selectedTab !== 0) {
      // We don't need to update mdxContent here as it will be handled by the editor's onChange
      setEditorKey(prev => prev + 1);
    }
    
    setSelectedTab(index);
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
                  key={editorKey} // Add key to force re-render
                  markdown={selectedTab === 0 && editorKey > 0 ? preservedContent : mdxContent}
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
