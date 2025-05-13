import React from 'react';

import { Icon } from '@trussworks/react-uswds';
import Dropdown from './dropdown';
import { NestedLexicalEditor, useMdastNodeUpdater } from '@mdxeditor/editor';
import { cn } from '@/lib/utils';
import MapEditorWrapper from './MapEditor';
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

export const DEFAULT_MAP_PROPS: MapProps = {
  center: '[-94.5, 41.25]',
  zoom: '8.3',
  datasetId: 'no2',
  layerId: 'no2-monthly-diff',
  dateTime: '2024-05-31',
  compareDateTime: '2023-05-31',
  compareLabel: 'May 2024 VS May 2023',
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

export const InsertTwoColumnButton = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'TwoColumn',
        kind: 'flow',
        props: {},
        children: [
          { name: 'LeftColumn', kind: 'DefinitionContent' },
          { name: 'RightColumn', kind: 'DefinitionContent' },
        ],
      });
    } catch (error) {
      console.error('Error inserting Map component:', error);
      alert('Could not insert chart component. See console for details.');
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
