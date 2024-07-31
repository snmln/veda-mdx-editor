'use client'

import { Block, Prose, Figure, Caption, Image, MapBlock, CompareImage } from "@developmentseed/veda-ui"; // This returns undefined
import { useDataStore } from "app/store/providers/data";
import React from 'react'

function EnhancedMapBlock(props) {
  const { datasets } = useDataStore();

  const transformed = datasets?.map((dataset) => ({
    content: dataset.content,
    slug: dataset.slug,
    data: dataset.metadata,
  }));

  return (
    <MapBlock {...props} datasets={transformed}/>
  );
}

export {
  Block,
  Prose,
  Image,
  EnhancedMapBlock,
  Caption,
  Figure,
  CompareImage,
}