'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { transformToVedaData } from 'app/content/utils/data';
import DataProvider from 'app/store/providers/data';
import VedaUIConfigProvider from 'app/store/providers/veda-ui-config';
import DevseedUIThemeProvider from 'app/store/providers/theme';
import type { DatasetWithContent } from 'app/types/content';

// Import MapBlock dynamically to avoid SSR issues
const MapBlock = dynamic(
  () => import('@lib').then((mod) => mod.MapBlock),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center">Loading map...</div>
  }
);

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
        }
      ]
    },
    slug: 'no2',
    content: ''
  }
] as unknown as DatasetWithContent[];

export function ClientMapBlock(props) {
  const transformed = transformToVedaData(mockDatasets as any);
  
  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={mockDatasets}>
          <div className="relative w-full h-[400px] border rounded">
            <MapBlock {...props} datasets={transformed} />
          </div>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}
