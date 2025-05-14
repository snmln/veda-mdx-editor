'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { customComponents } from './components';
import { ChartWrapper } from './ChartPreview';
import { DEFAULT_MAP_PROPS } from './ToolbarComponents';
// import '../../../styles/index.scss';
// import '@teamimpact/veda-ui/lib/main.css';
import { PageMainContent } from '@lib';
import DevseedUIThemeProvider from 'app/store/providers/theme';
import VedaUIConfigProvider from 'app/store/providers/veda-ui-config';
import DataProvider from 'app/store/providers/data';
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
  p: (props) => <p className='mb-4' {...props} />,
  ul: (props) => <ul className='list-disc ml-5 mb-4' {...props} />,
  ol: (props) => <ol className='list-decimal ml-5 mb-4' {...props} />,
  li: (props) => <li className='mb-1' {...props} />,
  Block: (props) => <div {...props} />,
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
  blockquote: (props) => (
    <blockquote className='border-l-4 border-gray-300 pl-4 italic' {...props} />
  ),
  Prose: (props) => {
    return <div {...props}></div>;
  },
};

export function SimpleMDXPreview({ source }: MDXPreviewProps) {
  // Use an empty string as a default if source is undefined
  // const datasets = getDatasetsMetadata();
  const safeSource = source || '';

  return (
    <section>
      <article className='prose'>
        <Providers datasets={mockDatasets}>
          <h1>THIS IS A TEST</h1>
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
