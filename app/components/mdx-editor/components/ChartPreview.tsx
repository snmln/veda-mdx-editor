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
    <div className=' flex items-center justify-center'>Loading chart...</div>
  ),
});

export function ClientChartBlock(props: { allAvailableDatasets?: DatasetWithContent[] }) {
const datasetsToUse = props.allAvailableDatasets || [];
const transformed = transformToVedaData(datasetsToUse as any);

  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={datasetsToUse}>
          <div className='relative w-full h-[250px]'>
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
    if (typeof props[propsName] === 'string') {
      const stringToArray = props[propsName]
        .replace(/[\\[\](){}]/g, '')
        .split(',');
      const trimmedArray = stringToArray.map((s) => s.trim());
      return trimmedArray;
    }
    return DEFAULT_CHART_PROPS[propsName];
  };

  try {
    return (
      <ClientChartBlock
        {...props}
        colors={parsedStringToArray('colors')}
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
