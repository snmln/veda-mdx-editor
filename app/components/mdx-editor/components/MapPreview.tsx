'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { transformToVedaData } from 'app/content/utils/data';
import DataProvider from 'app/store/providers/data';
import VedaUIConfigProvider from 'app/store/providers/veda-ui-config';
import DevseedUIThemeProvider from 'app/store/providers/theme';
import type { DatasetWithContent } from 'app/types/content';

// Import MapBlock dynamically to avoid SSR issues
const MapBlock = dynamic(() => import('@lib').then((mod) => mod.MapBlock), {
  ssr: false,
  loading: () => (
    <div className='h-[250px] flex items-center justify-center'>
      Loading map...
    </div>
  ),
});

interface MapPreviewProps {
  allAvailableDatasets?: DatasetWithContent[];
  [key: string]: any;
}

export function ClientMapBlock(props: MapPreviewProps) {
const datasetsToUse = props.allAvailableDatasets || [];
if (datasetsToUse.length === 0) {
    return (
      <div className='relative w-full h-[250px] flex items-center justify-center bg-gray-100'>
        <p className='text-gray-600'>No datasets available</p>
      </div>
    );
  }

const transformed = transformToVedaData(datasetsToUse as any);
  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={datasetsToUse}>
          <div className='relative w-full h-[250px]'>
            <MapBlock {...props} datasets={transformed} />
          </div>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}

// Make sure ClientMapBlock is the default export for dynamic imports to work correctly
export default ClientMapBlock;
