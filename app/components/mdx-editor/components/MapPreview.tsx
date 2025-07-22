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

// Mock dataset based on the NO2 dataset configuration
export const mockDatasets = [
  {
    metadata: {
      id: 'vulcan-ffco2-yeargrid-v4',
      name: 'Vulcan Fossil Fuel CO₂ Emissions',
      featured: true,
      sourceExclusive: 'Mock',
      description:
        'Since the outbreak of the novel coronavirus, atmospheric concentrations of nitrogen dioxide have changed by as much as 60% in some regions.',
      taxonomy: [
        {
          name: 'Topics',
          values: [
            { id: 'covid_19', name: 'Covid 19' },
            { id: 'agriculture', name: 'Agriculture' },
            { id: 'air_quality', name: 'Air Quality' },
          ],
        },
        {
          name: 'Sector',
          values: [{ id: 'electricity', name: 'Electricity' }],
        },
        {
          name: 'Producer',
          values: [{ id: 'nasa', name: 'NASA' }],
        },
      ],
      layers: [
        {
          id: 'vulcan-res-co2',
          stacCol: 'vulcan-ffco2-yeargrid-v4',
          name: 'Residential Fossil Fuel CO₂ Emissions',
          type: 'raster',
          description:
            'Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.',
          zoomExtent: [0, 20],
          compare: {
            datasetId: 'vulcan-ffco2-elc-res-yeargrid-v4',
            layerId: 'vulcan-elc-res-co2',
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`,
          },
          sourceParams: {
            assets: "res-co2",
            colormap_name: 'spectral_r',
            rescale: [0, 1400]
          },
          legend: {
            unit: { label: 'Molecules cm3' },
            type: 'gradient',
            min: 'Less',
            max: 'More',
            stops: [
              '#99c5e0',
              '#f9eaa9',
              '#f7765d',
              '#c13b72',
              '#461070',
              '#050308',
            ],
          },
          info: {
            source: 'NASA',
            spatialExtent: 'Global',
            temporalResolution: 'Monthly',
            unit: '10¹⁵ molecules cm⁻²',
          },
        },
      ],
    },
    slug: 'vulcan-ffco2-yeargrid-v4',
    content: '',
  },
  {
    metadata: {
      id: 'vulcan-ffco2-elc-res-yeargrid-v4',
      name: 'Vulcan Fossil Fuel CO₂ Emissions, Version 4',
      featured: true,
      sourceExclusive: 'Mock',
      description:
        'Since the outbreak of the novel coronavirus, atmospheric concentrations of nitrogen dioxide have changed by as much as 60% in some regions.',
      taxonomy: [
        {
          name: 'Topics',
          values: [
            { id: 'covid_19', name: 'Covid 19' },
            { id: 'agriculture', name: 'Agriculture' },
            { id: 'air_quality', name: 'Air Quality' },
          ],
        },
        {
          name: 'Sector',
          values: [{ id: 'electricity', name: 'Electricity' }],
        },
        {
          name: 'Producer',
          values: [{ id: 'nasa', name: 'NASA' }],
        },
      ],
      layers: [
        {
          id: 'vulcan-elc-res-co2',
          stacCol: 'vulcan-ffco2-elc-res-yeargrid-v4',
          name: 'Scope 2 Residential Fossil Fuel CO₂ Emissions',
          type: 'raster',
          description:
            'Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.',
          zoomExtent: [0, 20],
          compare: {
            datasetId: 'vulcan-ffco2-yeargrid-v4',
            layerId: 'vulcan-res-co2',
            mapLabel: ({ dateFns, datetime, compareDatetime }) =>
              `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`,
          },
          sourceParams: {
            assets: "elc-res-co2",
            colormap_name: 'spectral_r',
            rescale: [0, 500]
          },
          legend: {
            unit: { label: 'Molecules cm3' },
            type: 'gradient',
            min: 'Less',
            max: 'More',
            stops: [
              '#99c5e0',
              '#f9eaa9',
              '#f7765d',
              '#c13b72',
              '#461070',
              '#050308',
            ],
          },
          info: {
            source: 'NASA',
            spatialExtent: 'Global',
            temporalResolution: 'Monthly',
            unit: '10¹⁵ molecules cm⁻²',
          },
        },
      ],
    },
    slug: 'vulcan-ffco2-elc-res-yeargrid-v4',
    content: '',
  },
] as unknown as DatasetWithContent[];

export function ClientMapBlock(props) {

  const transformed = transformToVedaData(mockDatasets as any);
  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={mockDatasets}>
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
