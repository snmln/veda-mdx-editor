'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { transformToVedaData } from 'app/content/utils/data';
import DataProvider from 'app/store/providers/data';
import VedaUIConfigProvider from 'app/store/providers/veda-ui-config';
import DevseedUIThemeProvider from 'app/store/providers/theme';
import { DatasetWithContent } from 'app/types/content';

const Chart = dynamic(() => import('@lib').then((mod) => mod.Chart), {
  ssr: false,
  loading: () => (
    <div className='h-[250px] flex items-center justify-center'>
      Loading chart...
    </div>
  ),
});

const nightmockDatasets = [
  {
    metadata: {
      featured: true,
      id: 'nighttime-lights',
      name: 'Nighttime Lights',
      description:
        'During the COVID-19 pandemic, researchers are using night light observations to track variations in energy use, migration, and transportation in response to social distancing and lockdown measures.',
      media: {
        src: '/images/dataset/nighttime-lights--dataset-cover.jpg',
        alt: 'Satellite image of Earth at night.',
        author: {
          name: 'NASA Earth Observatory',
          url: 'https://earthobservatory.nasa.gov/images/90008/night-light-maps-open-up-new-applications',
        },
      },
      taxonomy: [
        { name: 'Topics', values: ['Covid 19', 'Agriculture'] },
        { name: 'Sector', values: ['Electricity'] },
        { name: 'Producer', values: ['NASA'] },
        { name: 'Gas Emission', values: ['DOS'] },
      ],
      layers: [
        {
          id: 'nightlights-hd-monthly',
          stacCol: 'nightlights-hd-monthly',
          name: 'Nightlights Monthly',
          type: 'raster',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sodales semper risus, suscipit varius diam facilisis non.',
          zoomExtent: [4, 16],
          legend: {
            type: 'gradient',
            min: 'Less',
            max: 'More',
            stops: ['#08041d', '#1f0a46', '#52076c', '#f57c16', '#f7cf39'],
          },
        },
      ],
    },
  },
] as unknown as DatasetWithContent[];

export function ClientChartBlock(props) {
  const transformed = transformToVedaData(nightmockDatasets as any);

  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={nightmockDatasets}>
          <div className='relative w-full h-[250px] border rounded'>
            <Chart {...props} datasets={transformed} />
          </div>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}

export default ClientChartBlock;

// Default Chart props
export const DEFAULT_CHART_PROPS = {
  dataPath: '/charts/story/hurricane-maria-ida-chart1.csv',
  dateFormat: '%m/%Y',
  idKey: 'Zip',
  xKey: 'Month',
  yKey: 'Number of Tarps',
  yAxisLabel: 'Y TESSTSTST',
  xAxisLabel: 'x axis test',
  highlightStart: '08/2021',
  highlightEnd: '09/2021',
  highlightLabel: 'Fire Ignition',
  availableDomain: '[6/2021, 9/2022]',
  altTitle: 'test title',
  altDesc: 'test description',
  colorScheme: 'Blues',
};
export const ChartWrapper = (props) => {

  const parsedStringToArray = (propsName) => {
    return typeof props[propsName] === 'string'
      ? props[propsName].replace(/[\\[\](){}]/g, '').split(',')
      : DEFAULT_CHART_PROPS[propsName];
  };
  try {
    return (
      <ClientChartBlock
        {...props}
        colors={parsedStringToArray('availableDomain')}
        availableDomain={parsedStringToArray('availableDomain')}
      />
    );
  } catch (error) {
    console.error('Error rendering chart:', error);
    return (
      <div className='h-[400px] flex items-center justify-center bg-red-50 border border-red-300 rounded'>
        <div className='text-red-500'>Error rendering chart component</div>
      </div>
    );
  }
};
