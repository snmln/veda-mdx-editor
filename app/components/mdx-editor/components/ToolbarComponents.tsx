import React from 'react';

import {
  Button,
  usePublisher,
  insertJsx$,
  useCellValue,
  viewMode$,
} from '@mdxeditor/editor';
import { Icon } from '@trussworks/react-uswds';
import Dropdown from './dropdown';
import { NestedLexicalEditor, useMdastNodeUpdater } from '@mdxeditor/editor';
import { cn } from '@/lib/utils';
import MapEditorWrapper from './MapEditor';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface MapProps {
  center: string;
  zoom: string;
  datasetId: string;
  layerId: string;
  dateTime: string;
  compareDateTime: string;
  compareLabel: string;
}
interface ChartProps {
  dataPath: string;
  dateFormat: string;
  idKey: string;
  xKey: string;
  yKey: string;
}

const DEFAULT_MAP_PROPS: MapProps = {
  center: '[-94.5, 41.25]',
  zoom: '8.3',
  datasetId: 'no2',
  layerId: 'no2-monthly-diff',
  dateTime: '2024-05-31',
  compareDateTime: '2023-05-31',
  compareLabel: 'May 2024 VS May 2023',
};

export const InsertMapButton = () => {
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

export const InsertTextBlock = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'Prose',
        kind: 'text',
        props: [],
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
      text section
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
        props: { ...DEFAULT_CHART_PROPS }
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

export const InsertTwoColumn = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'Chart',
        kind: 'text',
        props: [],
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
      {/* <svg
        width='28'
        height='18'
        viewBox='0 0 28 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='margin-right-05 width-3 height-3'
      >
        <path d='M0 0H13V18H0V0Z' fill='black' />
        <path d='M27.7391 14V17.5H16V14H27.7391Z' fill='black' />
        <path d='M27.7391 0V3.5H16V0H27.7391Z' fill='black' />
        <path d='M27.7391 7.5V11H16V7.5H27.7391Z' fill='black' />
      </svg>
      Add 2 Column
      <Icon.ArrowDropDown /> */}
      <Dropdown
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
        ]}
        onSelect={(value: string) => {
          console.log('Selected value:', value);
        }}
      />
    </Button>
  );
};

export const MapText = () => {
  const insertJsx = usePublisher(insertJsx$);

  const handleClick = () => {
    try {
      insertJsx({
        name: 'Block',
        kind: 'flow',
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
      map and text
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
          { name: 'LeftColumn', kind: 'BlockContent' },
          { name: 'RightColumn', kind: 'flow' },
        ],
      });
    } catch (error) {
      console.error('Error inserting Map component:', error);
      alert('Could not insert chart component. See console for details.');
    }
  };

  return <Button onClick={handleClick}>Insert 2-Column</Button>;
};
