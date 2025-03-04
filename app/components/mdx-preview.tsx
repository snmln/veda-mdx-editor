'use client';

import React from 'react';
import Link from 'next/link';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { highlight } from 'sugar-high';
import { customComponents } from './custom-components';

// We'll handle dynamic imports in the component itself

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

// Client-side only version of MDX component that doesn't use file system operations
export function MDXPreview({ source, ...props }: { source: string, [key: string]: any }) {
  const [mdxSource, setMdxSource] = React.useState<any>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [dynamicComponents, setDynamicComponents] = React.useState<any>({});

  // Use this to detect if we're on the client
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Load MDX content
  React.useEffect(() => {
    async function prepareMDX() {
      if (!source || !isClient) return;
      
      try {
        const serialized = await serialize(source);
        setMdxSource(serialized);
      } catch (error) {
        console.error("Error serializing MDX:", error);
      }
    }
    
    prepareMDX();
  }, [source, isClient]);

  // Load dynamic components
  React.useEffect(() => {
    if (!isClient) return;
    
    // Dynamically import components that might use browser APIs
    import('./mdx-preview-components')
      .then((module) => {
        setDynamicComponents(module.default);
      })
      .catch((error) => {
        console.error("Error loading dynamic components:", error);
      });
  }, [isClient]);

  // Show loading state if not on client yet or MDX is still being processed
  if (!isClient || !mdxSource) {
    return <div>Loading preview...</div>;
  }

  return (
    <React.Suspense fallback={<div>Loading components...</div>}>
      <MDXRemote
        {...mdxSource}
        components={{ 
          ...baseComponents, 
          ...dynamicComponents,
          ...(props.components || {}) 
        }}
      />
    </React.Suspense>
  );
}
