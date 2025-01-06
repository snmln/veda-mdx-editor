'use client';

import { useDataStore } from 'app/store/providers/data';
import { MapBlock, ScrollytellingBlock } from '@lib';
import React from 'react';

export function EnhancedMapBlock(props) {
  const { datasets } = useDataStore();

  const transformed = datasets?.map((dataset) => ({
    content: dataset.content,
    slug: dataset.slug,
    data: dataset.metadata,
  }));

  return <MapBlock {...props} datasets={transformed} />;
};

export function EnhancedScrollyTellingBlock(props) {
  const { datasets } = useDataStore();
  const transformed = {};
  datasets?.map((dataset) => {
    const id = dataset.metadata.id;
    transformed[id] = {
      content: dataset.content,
      slug: dataset.slug,
      data: dataset.metadata,
    };
  });

  return <ScrollytellingBlock {...props} datasets={transformed} />;
}

