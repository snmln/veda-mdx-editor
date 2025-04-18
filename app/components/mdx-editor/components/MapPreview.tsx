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
    loading: () => <div className="h-[250px] flex items-center justify-center">Loading map...</div>
  }
);

// Mock dataset based on the NO2 dataset configuration
const mockDatasets = [
  {
    metadata: {
      id: 'no2',
      name: 'Nitrogen Dioxide',
      featured: true,
      sourceExclusive: 'Mock',
      description: "Since the outbreak of the novel coronavirus, atmospheric concentrations of nitrogen dioxide have changed by as much as 60% in some regions.",
      taxonomy: [
        {
          name: 'Topics',
          values: [
            { id: 'covid_19', name: 'Covid 19' },
            { id: 'agriculture', name: 'Agriculture' },
            { id: 'air_quality', name: 'Air Quality' }
          ]
        },
        {
          name: 'Sector',
          values: [{ id: 'electricity', name: 'Electricity' }]
        },
        {
          name: 'Producer',
          values: [{ id: 'nasa', name: 'NASA' }]
        }
      ],
      layers: [
        {
          id: 'no2-monthly',
          stacCol: 'no2-monthly',
          name: 'No2 PT',
          type: 'raster',
          description: 'Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.',
          zoomExtent: [0, 20],
          compare: {
            datasetId: 'nighttime-lights',
            layerId: 'nightlights-hd-monthly',
            mapLabel: ({ dateFns, datetime, compareDatetime }) => `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
          },
          legend: {
            unit: { label: 'Molecules cm3' },
            type: 'gradient',
            min: 'Less',
            max: 'More',
            stops: ['#99c5e0', '#f9eaa9', '#f7765d', '#c13b72', '#461070', '#050308']
          },
          info: {
            source: 'NASA',
            spatialExtent: 'Global',
            temporalResolution: 'Monthly',
            unit: '10¹⁵ molecules cm⁻²'
          }
        },
        {
          id: 'no2-monthly-diff',
          stacCol: 'no2-monthly-diff',
          name: 'No2 (Diff)',
          type: 'raster',
          description: 'Levels in 10¹⁵ molecules cm⁻². Shows the difference in NO₂ levels between time periods.',
          zoomExtent: [0, 20],
          compare: {
            datasetId: 'no2',
            layerId: 'no2-monthly-diff',
            mapLabel: ({ dateFns, datetime, compareDatetime }) => `${dateFns.format(datetime, "LLL yyyy")} VS ${dateFns.format(compareDatetime, "LLL yyyy")}`
          },
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
          <div className="relative w-full h-[250px] border rounded">
            <MapBlock {...props} datasets={transformed} />
          </div>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}

// Make sure ClientMapBlock is the default export for dynamic imports to work correctly
export default ClientMapBlock;