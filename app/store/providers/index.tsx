import React, {ReactNode} from 'react'
import DataProvider from './data';
import { getDatasetsMetadata } from '../../blog/utils/mdx';
import DevseedUIThemeProvider from './theme';

export default function CoreVedaProvidersWrapper({
  children
}: {
  children: JSX.Element | ReactNode
}) {
  const datasets = getDatasetsMetadata();
  return (
    <DataProvider initialDatasets={datasets}>
      <DevseedUIThemeProvider>
        {children}
      </DevseedUIThemeProvider>
    </DataProvider>
  )
}