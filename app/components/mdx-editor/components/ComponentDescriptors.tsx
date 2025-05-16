import React, { useEffect, useRef, useState } from 'react';

import { JsxComponentDescriptor } from '@mdxeditor/editor';
import { TwoColumnEditorWrapper } from './TwoColumnEditor';
import MapEditorWrapper from './MapEditor';
import ChartEditorWrapper from './ChartEditor';

export const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'TwoColumn',
    kind: 'flow',
    source: './components', // Adjust the path
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
    Editor: (props) => {
      return <TwoColumnEditorWrapper props={{ ...props }} />;
    },
  },
  {
    name: 'LeftColumn',
    kind: 'flow',
    source: './components',
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
  },
  {
    name: 'RightColumn',
    kind: 'flow',
    source: './components',
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
  },
  {
    name: 'Map',
    kind: 'text',
    source: '@teamimpact/veda-ui',
    props: [
      { name: 'center', type: 'string' },
      { name: 'zoom', type: 'string' },
      { name: 'datasetId', type: 'string' },
      { name: 'layerId', type: 'string' },
      { name: 'dateTime', type: 'string' },
      { name: 'compareDateTime', type: 'string' },
      { name: 'compareLabel', type: 'string' },
    ],
    hasChildren: false,
    Editor: (props) => {
      return (
        <>
          <MapEditorWrapper props={{ ...props }} />
        </>
      );
    },
  },

  {
    name: 'Chart',
    kind: 'text',
    source: '@teamimpact/veda-ui',
    props: [
      { name: 'dataPath', type: 'string' },
      { name: 'dateFormat', type: 'string' },
      { name: 'idKey', type: 'string' },
      { name: 'xKey', type: 'string' },
      { name: 'yKey', type: 'string' },
      { name: 'yAxisLabel', type: 'string' },
      { name: 'xAxisLabel', type: 'string' },
      { name: 'highlightStart', type: 'string' },
      { name: 'highlightEnd', type: 'string' },
      { name: 'highlightLabel', type: 'string' },
      { name: 'availableDomain', type: 'string' },
      { name: 'altTitle', type: 'string' },
      { name: 'colorScheme', type: 'string' },
      { name: 'colors', type: 'string' },
      { name: 'altDesc', type: 'string' },
    ],
    hasChildren: false,
    Editor: (props) => {
      return (
        <>
          <ChartEditorWrapper props />
        </>
      );
    },
  },
];
