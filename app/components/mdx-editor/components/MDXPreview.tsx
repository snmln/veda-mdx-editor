'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { customComponents } from './components';
import { ChartWrapper } from './ChartPreview';

// Correctly import the default export from mdx-preview-map with error handling

const ClientMapBlock = dynamic(() => import('./MapPreview'), {
  ssr: false,
  loading: () => (
    <div className='h-[250px] flex items-center justify-center bg-blue-50 border rounded'>
      <div className='text-blue-500'>Loading map preview...</div>
    </div>
  ),
});

// Default map props
const DEFAULT_MAP_PROPS = {
  center: [-94.5, 41.25],
  zoom: 8.3,
  datasetId: 'no2',
  layerId: 'no2-monthly-diff',
  dateTime: '2024-05-31',
  compareDateTime: '2023-05-31',
  compareLabel: 'May 2024 VS May 2023',
};

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
        datasetId={props.datasetId || DEFAULT_MAP_PROPS.datasetId}
        layerId={props.layerId || DEFAULT_MAP_PROPS.layerId}
        dateTime={props.dateTime || DEFAULT_MAP_PROPS.dateTime}
        compareDateTime={
          props.compareDateTime || DEFAULT_MAP_PROPS.compareDateTime
        }
        compareLabel={props.compareLabel || DEFAULT_MAP_PROPS.compareLabel}
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
  blockquote: (props) => (
    <blockquote className='border-l-4 border-gray-300 pl-4 italic' {...props} />
  ),
  Map: (props) => MapWrapper(props),
  Block: (props) => <div type='full' {...props}></div>,
  Prose: (props) => <div {...props}></div>,
  Chart: ChartWrapper,
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
