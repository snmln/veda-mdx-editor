import React, { useEffect, useRef, useState } from 'react';

import {
  DirectiveDescriptor,
  GenericDirectiveEditor,
  GenericJsxEditor,
  JsxComponentDescriptor,
} from '@mdxeditor/editor';
import { TwoColumnEditorWrapper } from './TwoColumnEditor';
import MapEditorWrapper from './MapEditor';
import ChartEditorWrapper from './ChartEditor';
import { allAvailableDatasets } from 'app/content/datasets/alldatasets';
import { availableCsvs } from 'app/content/datasets/allcsv';
import { Prose } from '@lib';
import EmitEditorWrapper from './EmitEditor';
import UrbanDashboardWrapper from './UrbanDashboardEditor';
import GoesWrapper from './GoesEditor';
import NistWrapper from './NistEditor';
import NoaaWrapper from './NoaaEditor';
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
    name: 'EmitInterface',
    kind: 'flow',
    source: 'test01-emit', // Adjust the path
    hasChildren: false,
    props: [
      { name: 'defaultCollectionId', type: 'string' },
      { name: 'defaultZoomLocation', type: 'string' },
      { name: 'defaultZoomLevel', type: 'number' },
      { name: 'config', type: 'expression' },
      { name: 'defaultStartDate', type: 'string' },
    ],
    Editor: (props) => {
      return <EmitEditorWrapper props={{ ...props }} />;
    },
  },
  {
    name: 'UrbanDashboard',
    kind: 'flow',
    source: 'test01-urban', // Adjust the path
    hasChildren: false,
    props: [
      { name: 'defaultZoomLocation', type: 'string' },
      { name: 'defaultZoomLevel', type: 'number' },
      { name: 'config', type: 'expression' },],
    Editor: (props) => {
      return <UrbanDashboardWrapper props={{ ...props }} />;
    }
  },
   {
    name: 'GoesInterface',
    kind: 'flow',
    source: 'test01-goes', // Adjust the path
    hasChildren: false,
    props: [
      { name: 'defaultZoomLocation', type: 'string' },
      { name: 'defaultZoomLevel', type: 'number' },
      { name: 'config', type: 'expression' },
      { name: 'defaultCollectionId', type: 'string' }
    ],
    Editor: (props) => {
      return <GoesWrapper props={{ ...props }} />;
    }
  },
  {
    name: 'NistInterface',
    kind: 'flow',
    source: 'test01-nist', // Adjust the path
    hasChildren: false,
    props: [
      { name: 'defaultZoomLevel', type: 'number' },
      { name: 'config', type: 'expression' },
    ],
    Editor: (props) => {
      return <NistWrapper props={{ ...props }} />;
    }
  },
    {
    name: 'NoaaInterface',
    kind: 'flow',
    source: 'test01-noaa', // Adjust the path
    hasChildren: false,
    props: [
      { name: 'defaultZoomLocation', type: 'string' },
      { name: 'defaultZoomLevel', type: 'number' },
      { name: 'config', type: 'expression' },
    ],
    Editor: (props) => {
      return <NoaaWrapper props={{ ...props }} />;
    }
  },
  {
    name: 'Block',
    kind: 'flow',
    source: './components', // Adjust the path
    hasChildren: true,
    props: [],
    Editor: GenericJsxEditor,
  },
  {
    name: 'Figure',
    kind: 'flow',
    source: './components', // Adjust the path
    hasChildren: true,
    props: [],
    Editor: GenericJsxEditor,
  },
  {
    name: 'Break',
    kind: 'flow',
    source: './components', // Adjust the path
    hasChildren: false,
    props: [],
    Editor: GenericJsxEditor,
  },
  {
    name: 'Prose',
    kind: 'flow',
    source: './components', // Adjust the path
    hasChildren: true,
    props: [{ name: 'children', type: 'object' }],
    Editor: GenericJsxEditor,
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
      <MapEditorWrapper 
        props={{ ...props }} 
        allAvailableDatasets={allAvailableDatasets}
      />
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
      <ChartEditorWrapper
        {...props}
        allAvailableDatasets={allAvailableDatasets}
        allAvailableCsvs={availableCsvs} // Add this line
      />
    </>
  );
    },
  },
];

export const CalloutDirectiveDescriptor: DirectiveDescriptor = {
  name: 'callout',
  testNode(node) {
    return node.name === 'callout';
  },
  // set some attribute names to have the editor display a property editor popup.
  attributes: [],
  // used by the generic editor to determine whether or not to render a nested editor.
  hasChildren: true,
  Editor: GenericDirectiveEditor,
};
