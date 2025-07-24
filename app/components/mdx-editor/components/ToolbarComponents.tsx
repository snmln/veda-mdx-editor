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

export const DEFAULT_MAP_PROPS: MapProps = {
  center: '[-94.5, 41.25]',
  zoom: '8.3',
  datasetId: 'vulcan-ffco2-yeargrid-v4',
  layerId: 'vulcan-total-co2',
  dateTime: '2020-12-31',
  compareDateTime: '2015-12-31',
  compareLabel: '2020 VS 2015',
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
            children: [{ type: 'paragraph', children: [{ type: 'text', value: '' }] }],
          },
          {
            type: 'mdxJsxFlowElement',
            name: 'RightColumn',
            children: [{ type: 'paragraph', children: [{ type: 'text', value: '' }] }],
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
