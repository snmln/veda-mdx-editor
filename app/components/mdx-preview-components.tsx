'use client';

import React from 'react';
import { Block, Prose, Caption, Chapter, Figure, Image, CompareImage, Chart } from '@lib';
import { EnhancedMapBlock, EnhancedScrollyTellingBlock } from './mdx-components/block';

// Export components that might use browser APIs
const components = {
  Block,
  Prose,
  Caption,
  Figure,
  Image,
  Map: EnhancedMapBlock,
  CompareImage,
  ScrollytellingBlock: EnhancedScrollyTellingBlock,
  Chapter,
  Chart,
};

export default components;
