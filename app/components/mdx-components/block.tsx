'use client'

import { Block, Prose, Figure, Caption, Image, MapBlock, CompareImage } from "@developmentseed/veda-ui"; // This returns undefined
import { useDataStore } from "app/store/providers/data";
import React, { Children } from 'react'

function EnhancedBlock(props) {
  
  const childrenAsArray = Children.toArray(props.children);
  console.log('children array')
  console.log(childrenAsArray)

  const childrenComponents: string[] = childrenAsArray.map(
    // @ts-expect-error type may not exist depending on the node, but the error
    // will be caught and this won't break.
    (e) => {
      console.log(e.type)
      console.log(e.name)
      return e.type?.displayName ?? 'undefined'
    }
  );

  const childrenNames = childrenComponents.reduce(
    (acc, curr) => acc + curr,
    ''
  );
  console.log(childrenNames)
  
  return (
    <Block {...props} />
  );
}

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
  EnhancedBlock,
  Prose,
  Image,
  EnhancedMapBlock,
  Caption,
  Figure,
  CompareImage,
}