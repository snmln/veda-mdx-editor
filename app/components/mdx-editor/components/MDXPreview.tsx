'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { customComponents } from './components';
import { ChartWrapper } from './ChartPreview';
import { DEFAULT_MAP_PROPS } from './ToolbarComponents';
import { highlight } from 'sugar-high';
import Link from 'next/link';

import {
  Block,
  Prose,
  Caption,
  Chapter,
  Figure,
  Image,
  LegacyGlobalStyles,
} from '@lib';
import { mockDatasets } from './MapPreview';
import Providers from 'app/(datasets)/providers';
// Correctly import the default export from mdx-preview-map with error handling

const ClientMapBlock = dynamic(() => import('./MapPreview'), {
  ssr: false,
  loading: () => (
    <div className='h-[250px] flex items-center justify-center bg-blue-50 border rounded'>
      <div className='text-blue-500'>Loading map preview...</div>
    </div>
  ),
});

const MapWrapper = (props) => {
  try {
    // Handle center prop safely
    let center;
    try {
      center =
        typeof props.center === 'string' && props.center.startsWith('[')
          ? JSON.parse(props.center)
          : props.center || DEFAULT_MAP_PROPS.center;
    } catch (error) {
      console.warn('Error parsing center coordinates, using default:', error);
      center = DEFAULT_MAP_PROPS.center;
    }

    // Handle zoom prop safely
    let zoom;
    try {
      zoom =
        typeof props.zoom === 'string'
          ? parseFloat(props.zoom) || DEFAULT_MAP_PROPS.zoom
          : props.zoom || DEFAULT_MAP_PROPS.zoom;
    } catch (error) {
      console.warn('Error parsing zoom level, using default:', error);
      zoom = DEFAULT_MAP_PROPS.zoom;
    }

    return (
      <ClientMapBlock
        center={center}
        zoom={zoom}
        datasetId={props.datasetId}
        layerId={props.layerId}
        dateTime={props.dateTime}
        compareDateTime={props.compareDateTime}
        compareLabel={props.compareLabel}
      />
    );
  } catch (error) {
    console.error('Error rendering map:', error);
    return (
      <div className='h-[400px] flex items-center justify-center bg-red-50 border border-red-300 rounded'>
        <div className='text-red-500'>Error rendering map component</div>
      </div>
    );
  }
};
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

interface MDXPreviewProps {
  source: string;
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
// Define all components used in MDX
const components = {
  ...customComponents,
  // Basic markdown components
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  code: Code,
  Table,
  Block: Block,
  Prose: Prose,
  Caption: Caption,
  Figure: Figure,
  Image: Image,
  Link: Link,
  Chapter: Chapter,
  TwoColumn: (props) => {
    return (
      <div className='grid-container maxw-full'>
        <div className='grid-row grid-gap-lg'>{props.children}</div>
      </div>
    );
  },
  LeftColumn: (props) => {
    return <div className='grid-col-6 '>{props.children}</div>;
  },
  RightColumn: (props) => {
    return <div className='grid-col-6  '>{props.children}</div>;
  },

  Map: MapWrapper,
  Chart: ChartWrapper,
};

export function SimpleMDXPreview({ source }: MDXPreviewProps) {
  // Use an empty string as a default if source is undefined
  // const datasets = getDatasetsMetadata();
  const safeSource = source || '';

  return (
    <section>
      <article className='prose'>
        <Providers datasets={mockDatasets}>
          <LegacyGlobalStyles />

          <Suspense
            fallback={<div className='p-4'>Loading MDX preview...</div>}
          >
            <MDXRemote source={safeSource} components={components} />
          </Suspense>
        </Providers>
      </article>
    </section>
  );
}
