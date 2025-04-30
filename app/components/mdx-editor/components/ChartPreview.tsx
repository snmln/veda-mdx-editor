'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { transformToVedaData } from 'app/content/utils/data';
import DataProvider from 'app/store/providers/data';
import VedaUIConfigProvider from 'app/store/providers/veda-ui-config';
import DevseedUIThemeProvider from 'app/store/providers/theme';

// Import MapBlock dynamically to avoid SSR issues
const Chart = dynamic(
  () => import('@lib').then((mod) => mod.Chart),
  {
    ssr: false,
    loading: () => <div className="h-[250px] flex items-center justify-center">Loading chart...</div>
  }
);

export function ClientMapBlock(props) {
  const transformed = transformToVedaData(mockDatasets as any);

  return (
    <DevseedUIThemeProvider>
      <VedaUIConfigProvider>
        <DataProvider initialDatasets={mockDatasets}>
          <div className="relative w-full h-[250px] border rounded">
            <Chart {...props} datasets={transformed} />
          </div>
        </DataProvider>
      </VedaUIConfigProvider>
    </DevseedUIThemeProvider>
  );
}

// Make sure ClientMapBlock is the default export for dynamic imports to work correctly
export default ClientMapBlock;