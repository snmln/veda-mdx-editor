import React from 'react';

import { Button, usePublisher, insertJsx$ } from '@mdxeditor/editor';
import { Icon } from '@trussworks/react-uswds';

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

const DEFAULT_CHART_PROPS: ChartProps = {
  dataPath: '/charts/story/hurricane-maria-ida-chart1.csv',
  dateFormat: '%m/%Y',
  idKey: 'Zip',
  xKey: 'Month',
  yKey: 'Number of Tarps',
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

export const InsertLineGraph = () => {
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
