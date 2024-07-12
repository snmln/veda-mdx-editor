import React, {ReactNode} from 'react'
import DataProvider from './data';
import { getDatasets } from '../../blog/utils/mdx';
import DevseedUIThemeProvider from './theme';

export function CoreVedaProvidersWrapper({
  children
}: {
  children: JSX.Element | ReactNode
}) {
  return (
    <DataProvider initialDatasets={getDatasets()}>
      <DevseedUIThemeProvider>
        {children}
      </DevseedUIThemeProvider>
    </DataProvider>
  )
}