'use client';

import React, { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { ComponentType } from 'react';
import { MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import dynamic from 'next/dynamic';
import { Block, Figure, Caption } from '@lib';
import { EnhancedScrollyTellingBlock } from './mdx-components/block';
import { customComponents } from './custom-components';
import DataProvider from 'app/store/providers/data';
import VedaUIConfigProvider from 'app/store/providers/veda-ui-config';
import DevseedUIThemeProvider from 'app/store/providers/theme';
import type { DatasetWithContent } from 'app/types/content';

// Import ClientMapBlock dynamically to avoid SSR issues
const ClientMapBlock = dynamic(
  () => import('./mdx-preview-map').then((mod) => mod.ClientMapBlock),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center">Loading map...</div>
  }
);

type MDXComponents = {
  [key: string]: ComponentType<any>;
};

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
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

const components: MDXComponents = {
  // Custom components
  ...customComponents,
  Block: Block,
  Figure: Figure,
  Caption: Caption,
  Map: ClientMapBlock,
  ScrollytellingBlock: EnhancedScrollyTellingBlock,
  
  // HTML element styling
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: (props) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
  ul: (props) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700" {...props} />,
  ol: (props) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700" {...props} />,
  li: (props) => <li className="mb-1 leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-blue-50 rounded-r text-gray-700 italic" {...props} />
  ),
  code: (props) => (
    <code className="bg-gray-100 text-red-600 rounded px-2 py-1 text-sm font-mono" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-6 font-mono text-sm leading-relaxed shadow-lg" {...props} />
  ),
  strong: (props) => <strong className="font-bold text-gray-900" {...props} />,
  em: (props) => <em className="italic text-gray-900" {...props} />,
  a: (props) => (
    <a 
      className="text-blue-600 hover:text-blue-800 underline decoration-2 decoration-blue-300 hover:decoration-blue-600 transition-colors" 
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-t-2 border-gray-200" />,
  table: (props) => (
    <div className="overflow-x-auto my-6 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 border" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b" {...props} />
  ),
  td: (props) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200" {...props} />
  ),
  img: (props) => (
    <img
      className="max-w-full h-auto my-6 rounded-lg shadow-lg"
      alt={props.alt || ''}
      {...props}
    />
  ),
};

// Mock dataset for the no2-monthly-diff layer
const mockDatasets = [
  {
    metadata: {
      id: 'no2',
      name: 'Nitrogen Dioxide',
      description: 'Nitrogen dioxide data for analysis',
      taxonomy: [
        {
          name: 'Topics',
          values: [
            { id: 'air_quality', name: 'Air Quality' }
          ]
        }
      ],
      layers: [
        {
          id: 'no2-monthly-diff',
          stacCol: 'no2-monthly-diff',
          name: 'No2 (Diff)',
          type: 'raster',
          description: 'Nitrogen dioxide difference data',
          zoomExtent: [0, 20],
          compare: null,
          legend: {
            unit: { label: 'molecules/cm3' },
            type: 'gradient',
            min: '-3934857984753',
            max: '3348573489573',
            stops: ['#3A88BD', '#C9E0ED', '#E4EEF3', '#FDDCC9', '#DD7059']
          }
        },
        {
          id: 'no2-monthly',
          stacCol: 'no2-monthly',
          name: 'No2 PT',
          type: 'raster',
          description: 'Nitrogen dioxide data',
          zoomExtent: [0, 20],
          compare: null,
          legend: {
            unit: { label: 'molecules/cm3' },
            type: 'gradient',
            min: '0',
            max: '100',
            stops: ['#99c5e0', '#f9eaa9', '#f7765d', '#c13b72', '#461070', '#050308']
          }
        }
      ]
    },
    slug: 'no2',
    content: ''
  },
  {
    metadata: {
      id: 'nighttime-lights',
      name: 'Nighttime Lights',
      description: 'Nighttime lights data for analysis',
      taxonomy: [
        {
          name: 'Topics',
          values: [
            { id: 'nighttime_lights', name: 'Nighttime Lights' }
          ]
        }
      ],
      layers: [
        {
          id: 'nightlights-hd-monthly',
          stacCol: 'nightlights-hd-monthly',
          name: 'Nightlights HD Monthly',
          type: 'raster',
          description: 'Nighttime lights data',
          zoomExtent: [0, 20],
          compare: null,
          legend: {
            unit: { label: 'intensity' },
            type: 'gradient',
            min: '0',
            max: '100',
            stops: ['#000000', '#0C0C3C', '#0000FF', '#FFFF00', '#FFFFFF']
          }
        }
      ]
    },
    slug: 'nighttime-lights',
    content: ''
  }
] as unknown as DatasetWithContent[];

interface MDXPreviewProps {
  source: string;
  [key: string]: any;
}

export function MDXPreviewEnhanced({ source, ...props }: MDXPreviewProps) {
  const [content, setContent] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Use this to detect if we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !source) return;
    
    const serializeMdx = async () => {
      try {
        const serialized = await serialize(source, {
          parseFrontmatter: true,
          mdxOptions: {
            development: process.env.NODE_ENV === 'development',
            remarkPlugins: [
              remarkGfm,
              remarkBreaks
            ]
          }
        });
        setContent(serialized);
        setError(null);
      } catch (err) {
        console.error('Error serializing MDX:', err);
        setError(err instanceof Error ? err.message : 'Error processing MDX content');
        setContent(null);
      }
    };
    
    serializeMdx();
  }, [source, isClient]);

  if (!isClient) {
    return <div>Loading preview (client-side only)...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!content) {
    return <div>Processing MDX content...</div>;
  }

  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={mockDatasets as any}>
          <MDXProvider components={components}>
            <div className="mdx-content prose prose-lg max-w-none">
              <MDXRemote {...content} components={{...components, ...(props.components || {})}} />
            </div>
          </MDXProvider>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}
