import React from 'react';

import { Icon } from '@trussworks/react-uswds';

import { NestedLexicalEditor, useMdastNodeUpdater } from '@mdxeditor/editor';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import TwoColumnIcon from '../assets/TwoColumnIcon';
import {
  Button,
  usePublisher,
  insertJsx$,
  useCellValue,
  viewMode$,
} from '@mdxeditor/editor';

import { DEFAULT_CHART_PROPS } from './ChartPreview';
import { MapProps, ChartProps } from './types';
import { config } from 'process';

export const DEFAULT_MAP_PROPS: MapProps = {
  center: '[-112.0546935, 33.6055498]',
  zoom: '8.3',
  datasetId: 'vulcan-ffco2-elc-res-yeargrid-v4',
  layerId: 'vulcan-elc-res-co2',
  dateTime: '2021-01-01',
  compareDateTime: '2021-01-01',
  compareLabel: 'May 2024 VS May 2023',
  attrUrl: '',
  attrAuthor: '',
  caption: '',
};

interface TwoColumnProps {
  children: React.ReactNode;
}

export const TwoColumn: React.FC<TwoColumnProps> = ({ children }) => {
  return <div className='grid grid-cols-2 gap-4'>{children}</div>;
};

export const LeftColumnEditor: React.FC<any> = ({ mdastNode, descriptor }) => {
  const updateMdastNode = useMdastNodeUpdater();

  return (
    <div className='border rounded-md p-2'>
      <NestedLexicalEditor
        getContent={(node) => node.children}
        getUpdatedMdastNode={(node, children) => {
          updateMdastNode({ ...mdastNode, children });
        }}
      />
    </div>
  );
};

export const InsertMapButton = (props) => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'Map',
        kind: 'text',
        props: { ...DEFAULT_MAP_PROPS },
      });
    } catch (error) {
      console.error('Error inserting Map component:', error);
      alert('Could not insert Map component. See console for details.');
    }
  };

  return (
    <Button
      onClick={handleClick}
      title='Insert Map'
      className='text-sm display-flex flex-align-center padding-1'
    >
      <Icon.Map className='margin-right-05 width-3 height-3' />
      Add Map
    </Button>
  );
};

export const InsertLineGraph = (props) => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'Chart',
        kind: 'text',
        props: { ...DEFAULT_CHART_PROPS },
      });
    } catch (error) {
      console.error('Error inserting Map component:', error);
      alert('Could not insert chart component. See console for details.');
    }
  };

  return (
    <Button
      onClick={handleClick}
      title='Insert Map'
      className='text-sm display-flex flex-align-center padding-1'
    >
      <Icon.Insights className='margin-right-05 width-3 height-3' />
      line graph
    </Button>
  );
};

export const InsertSectionBreak = (props) => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'Break',
        kind: 'text',
        props: {},
      });
    } catch (error) {
      console.error('Error inserting Map component:', error);
      alert('Could not insert chart component. See console for details.');
    }
  };

  return (
    <Button
      onClick={handleClick}
      title='Insert Map'
      className='text-sm display-flex flex-align-center padding-1'
    >
      Insert Break
    </Button>
  );
};

export const InsertTwoColumnButton = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'TwoColumn',
        kind: 'flow',
        props: {},
        // The children need to be valid MDAST nodes.
        // An empty paragraph is added to each column to make them editable from the start.
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'LeftColumn',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: '' }] },
            ],
          },
          {
            type: 'mdxJsxFlowElement',
            name: 'RightColumn',
            children: [
              { type: 'paragraph', children: [{ type: 'text', value: '' }] },
            ],
          },
        ],
      });
    } catch (error) {
      console.error('Error inserting TwoColumn component:', error);
      alert('Could not insert TwoColumn component. See console for details.');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className='text-sm display-flex flex-align-center padding-1'
    >
      <div className='margin-right-05 width-3 height-3 flex-align-center display-flex'>
        <TwoColumnIcon />
      </div>
      Insert 2 Column
    </Button>
  );
};

const emitInterfaceConfig = {
  stacApiUrl:
    'https://earth.gov/ghgcenter//collections/emit-ch4plume-v1/items',
  metadataEndpoint:
    'https://earth.jpl.nasa.gov/emit-mmgis-lb/Missions/EMIT/Layers/coverage/combined_plume_metadata.json',
  coverageUrl:
    'https://earth.jpl.nasa.gov/emit-mmgis/Missions/EMIT/Layers/coverage/coverage_pub.json',
  baseStacApiUrl: 'https://earth.gov/ghgcenter/api/stac',
  mapboxToken:
    'pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA', // SENSITIVE
  mapBoxStyle: 'mapbox://styles/covid-nasa',
  basemapStyle: 'cldu1cb8f00ds01p6gi583w1m',
  geoApifyKey: 'YOUR_GEOAPIFY_KEY_HERE',
  latlonEndpoint: 'https://api.geoapify.com/v1/geocode/reverse',
  rasterApiUrl: 'https://earth.gov/ghgcenter/api/raster',
  publicUrl: '',
  defaultZoomLocation: [-98.771556, 32.967243],
  defaultZoomLevel: 4,
  defaultCollectionId: 'emit-ch4plume-v1',
  defaultStartDate: '2022-08-22',
};

const DEFAULT_EMIT_PROPS = {
  collectionId: 'emit-ch4plume-v1',
  zoomLocation: [-98.771556, 32.967243],
  zoomLevel: 4,
  config: emitInterfaceConfig,

};

export const InsertEmitInterfaceButton = (props) => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'EmitInterface',
        kind: 'text',
        props: { ...DEFAULT_EMIT_PROPS },
      });
    } catch (error) {
      console.error('Error inserting EMIT component:', error);
      alert('Could not insert EMIT component. See console for details.');
    }
  };

  return (
    <Button
      onClick={handleClick}
      title='Insert EMIT Interface'
      className='text-sm display-flex flex-align-center padding-1'
    >
      <Icon.Map className='margin-right-05 width-3 height-3' />
      Custom Interface
    </Button>
  );
};

const CLOUD_BROWSE_PROPS = {
  cloudWatchUrlBase: 'https://api.cors.lol/?url=https://data.ghg.center',
  sourceIMGUrl: 'https://api.cors.lol/?url=https://data.ghg.center',
  version: 'v3.3.3',
  excluded_prefixes: ['browseui'],
};
export const InsertBrowseInterfaceButton = (props) => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'CloudBrowse',
        kind: 'text',
        props: { ...CLOUD_BROWSE_PROPS },
      });
    } catch (error) {
      console.error('Error inserting Cloud Browse component:', error);
      alert(
        'Could not insert Cloud Browse component. See console for details.',
      );
    }
  };

  return (
    <Button
      onClick={handleClick}
      title='Insert Cloud Browse Interface'
      className='text-sm display-flex flex-align-center padding-1'
    >
      <Icon.Map className='margin-right-05 width-3 height-3' />
      Add S3 Browse
    </Button>
  );
};
