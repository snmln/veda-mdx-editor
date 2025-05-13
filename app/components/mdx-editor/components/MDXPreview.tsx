'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { customComponents } from './components';
import { ChartWrapper } from './ChartPreview';
import { DEFAULT_MAP_PROPS } from './ToolbarComponents';
import './mdxpreview.scss';
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

// Define all components used in MDX
const components = {
  ...customComponents,
  // Basic markdown components
  h1: (props) => <h1 className='text-2xl font-bold mt-6 mb-4' {...props} />,
  h2: (props) => <h2 className='text-xl font-bold mt-5 mb-3' {...props} />,
  h3: (props) => <h3 className='text-lg font-bold mt-4 mb-2' {...props} />,
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
  const safeSource = source || '';
  return (
    <Suspense fallback={<div className='p-4'>Loading MDX preview...</div>}>
      <MDXRemote source={safeSource} components={components} />
    </Suspense>
  );
}
