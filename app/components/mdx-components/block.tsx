'use client';

import React from 'react';
import { useDataStore } from 'app/store/providers/data';
import { MapBlock, ScrollytellingBlock } from '@lib';
import { transformToVedaData } from '@helpers/data';

export function EnhancedMapBlock(props) {
  const { datasets } = useDataStore();
  const transformed = transformToVedaData(datasets);
  return <MapBlock {...props} datasets={transformed} />;
};

export function EnhancedScrollyTellingBlock(props) {
  const { datasets } = useDataStore();
  const transformed = transformToVedaData(datasets);
  return <ScrollytellingBlock {...props} datasets={transformed} />;
}

