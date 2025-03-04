'use client';

import React from 'react';
import Link from 'next/link';
import { highlight } from 'sugar-high';
import { customComponents } from './custom-components';
import dynamic from 'next/dynamic';

// Import MDX components with dynamic import to avoid server-side rendering issues
const MDXRemote = dynamic(() => 
  import('next-mdx-remote').then((mod) => mod.MDXRemote),
  { ssr: false }
);

function Table({ data }: { data: any }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function Code({ children, ...props }: { children: any }) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }: { children: JSX.Element }) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const baseComponents = {
  ...customComponents,
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  code: Code,
  Table,
  Link: Link,
};

// A simplified MDX preview component that doesn't rely on file system operations
export function MDXPreview({ source, ...props }: { source: string, [key: string]: any }) {
  const [compiledSource, setCompiledSource] = React.useState<any>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [components, setComponents] = React.useState(baseComponents);

  // Use this to detect if we're on the client
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Load dynamic components when on client
  React.useEffect(() => {
    if (!isClient) return;
    
    // Load dynamic components
    import('./mdx-preview-components')
      .then((mod) => {
        setComponents(prev => ({
          ...prev,
          ...mod.default
        }));
      })
      .catch(err => {
        console.error("Failed to load dynamic components:", err);
      });
  }, [isClient]);

  // Process MDX content when on client
  React.useEffect(() => {
    if (!isClient || !source) return;
    
    // Use a simple approach for now - just display the markdown as text
    // This avoids the JSX transformation issues
    const processMarkdown = async () => {
      try {
        // Dynamically import the serialize function
        const { serialize } = await import('next-mdx-remote/serialize');
        const serialized = await serialize(source);
        setCompiledSource(serialized);
      } catch (error) {
        console.error("Error processing MDX:", error);
      }
    };
    
    processMarkdown();
  }, [source, isClient]);

  if (!isClient) {
    return <div>Loading preview (client-side only)...</div>;
  }

  if (!compiledSource) {
    return <div>Processing MDX content...</div>;
  }

  // Use dynamic import for MDXRemote
  return (
    <div className="mdx-preview">
      <React.Suspense fallback={<div>Rendering MDX...</div>}>
        {typeof MDXRemote === 'function' ? (
          <MDXRemote
            {...compiledSource}
            components={{
              ...components,
              ...(props.components || {})
            }}
          />
        ) : (
          <div>Loading MDX renderer...</div>
        )}
      </React.Suspense>
    </div>
  );
}
