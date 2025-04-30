'use client';

import React, { useEffect, useState } from 'react';
import { MapIcon } from '@heroicons/react/24/outline';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MapContextProvider, useMapContext } from '../utils/MapContext';
import dynamic from 'next/dynamic';
import { LexicalNode } from 'lexical';
import {
  TextInput,
  Label,
  Button,
  DatePicker,
  Icon,
} from '@trussworks/react-uswds';

interface MapProps {
  center: string;
  zoom: string;
  datasetId: string;
  layerId: string;
  dateTime: string;
  compareDateTime: string;
  compareLabel: string;
  node?: LexicalNode & { setProps?: (props: Partial<MapProps>) => void };
}

interface MapFieldProps {
  label: string;
  value: string;
  hint?: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  isDate?: boolean;
  numeric?: boolean;
}

// Create a placeholder node type that satisfies the LexicalNode interface
const createPlaceholderNode = (): LexicalNode & {
  setProps?: (props: Partial<MapProps>) => void;
} => {
  return {
    __type: 'placeholder',
    __key: 'placeholder',
    __parent: null,
    __prev: null,
    __next: null,
    setProps: () => console.warn('setProps called on a placeholder node'),
  } as unknown as LexicalNode & {
    setProps?: (props: Partial<MapProps>) => void;
  };
};
const checkRequired = (isRequired, value) => {
  return isRequired && !value ? { validationStatus: 'error' } : '';
};

const MapField: React.FC<MapFieldProps> = ({
  label,
  hint,
  value,
  onChange,
  isRequired,
  isDate,
  numeric,
}) => (
  <div>
    <Label
      htmlFor='input-type-text'
      className='margin-top-2
'
    >
      {label}
    </Label>
    <span className='usa-hint'>{hint}</span>
    {isDate && isDate != undefined ? (
      <DatePicker
        defaultValue={value}
        onChange={(e) => onChange(e)}
        {...checkRequired(isRequired, value)}
      />
    ) : (
      <TextInput
        id='input-type-text'
        name='input-type-text'
        type={numeric ? 'number' : 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='width-15'
        {...checkRequired(isRequired, value)}
      />
    )}
  </div>
);

// Import the actual map component for live preview
const ClientMapBlock = dynamic(
  () => import('./MapPreview').then((mod) => mod.ClientMapBlock),
  {
    ssr: false,
    loading: () => (
      <div className='h-[180px] flex items-center justify-center bg-blue-50 border rounded'>
        <div className='text-blue-500'>Loading map preview...</div>
      </div>
    ),
  },
);

// Map editor component that includes both preview and editable properties
const MapEditorWithPreview: React.FC<MapProps> = (props) => {
  const contextValue = useMapContext();
  const [isEditing, setIsEditing] = useState(true);
  const [center, setCenter] = useState(props.center || '[-94.5, 41.25]');
  const [zoom, setZoom] = useState(props.zoom || '8.3');
  const [datasetId, setDatasetId] = useState(props.datasetId || 'no2');
  const [layerId, setLayerId] = useState(props.layerId || 'no2-monthly-diff');
  const [dateTime, setDateTime] = useState(props.dateTime || '2024-05-31');
  const [compareDateTime, setCompareDateTime] = useState(
    props.compareDateTime || '2023-05-31',
  );
  const [compareLabel, setCompareLabel] = useState(
    props.compareLabel || 'May 2024 VS May 2023',
  );
  // Parse values for the map preview
  const parsedCenter =
    typeof center === 'string'
      ? center.startsWith('[')
        ? JSON.parse(center)
        : [-94.5, 41.25]
      : center;
  const parsedZoom = typeof zoom === 'string' ? parseFloat(zoom) || 8.3 : zoom;

  // Safe update function
  const updateProps = () => {
    try {
      if (contextValue?.parentEditor && contextValue?.lexicalNode) {
        contextValue.parentEditor.update(() => {
          try {
            const node = contextValue.lexicalNode as LexicalNode & {
              setProps?: (props: Partial<MapProps>) => void;
            };
            if (node?.setProps) {
              node.setProps({
                center,
                zoom,
                datasetId,
                layerId,
                dateTime,
                compareDateTime,
                compareLabel,
              });
            }
          } catch (error) {
            console.error('Error updating lexical node props:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error in updateProps function:', error);
    }
  };

  // Update lexical node when any property changes
  useEffect(() => {
    updateProps();
  }, [
    center,
    zoom,
    datasetId,
    layerId,
    dateTime,
    compareDateTime,
    compareLabel,
  ]);

  return (
    <div className=' border-05 border-primary rounded-lg overflow-hidden shadow-sm bg-white'>
      <div className='flex flex-col'>
        <div className='padding-2 grid-container w-full maxw-full margin-2 bg-gray-10 radius-lg'>
          {isEditing && (
            <div>
              <h3
                className={`font-medium ${isEditing ? 'text-blue-700' : 'text-gray-500'} text-sm`}
              >
                Map Properties
              </h3>
              <div className='grid-row flex-align-end grid-gap-2'>
                <MapField
                  label='*Dataset ID'
                  value={datasetId}
                  onChange={setDatasetId}
                  isRequired={true}
                />
                <MapField
                  label='*Layer ID'
                  value={layerId}
                  onChange={setLayerId}
                />
                <MapField label='*Center' value={center} onChange={setCenter} />
                <MapField
                  label='*Zoom'
                  value={zoom}
                  onChange={setZoom}
                  numeric={true}
                />
                <MapField
                  label='*Date Time'
                  value={dateTime}
                  onChange={setDateTime}
                  isDate={true}
                />
              </div>{' '}
              <h4>Map Comparison</h4>
              <div className='grid-row flex-align-end grid-gap-2'>
                <MapField
                  label='Compare Label'
                  value={compareLabel}
                  onChange={setCompareLabel}
                />
                <MapField
                  label='Compare Date'
                  value={compareDateTime}
                  onChange={setCompareDateTime}
                  isDate={true}
                />
              </div>
            </div>
          )}

          <div className={`${isEditing && 'padding-top-2'}`}>
            <Button
              className='bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow flex items-center text-xs'
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Collapse Map Editor' : 'Open Map Editor'}
            </Button>
          </div>
        </div>

        <div className='relative'>
          <ClientMapBlock
            center={parsedCenter}
            zoom={parsedZoom}
            datasetId={datasetId}
            layerId={layerId}
            dateTime={dateTime}
            compareDateTime={compareDateTime}
            compareLabel={compareLabel}
          />
        </div>
      </div>
    </div>
  );
};

// This wrapper is used when the component is used in the editor
const MapEditorWrapper: React.FC<MapProps> = (props) => {
  try {
    const [editor] = useLexicalComposerContext();

    return (
      <MapContextProvider
        value={{
          parentEditor: editor,
          lexicalNode: props.node || createPlaceholderNode(),
        }}
      >
        <MapEditorWithPreview {...props} />
      </MapContextProvider>
    );
  } catch (error) {
    console.error('Error in MapEditorWrapper:', error);
    return (
      <div className='p-4 bg-yellow-100 rounded border border-yellow-400'>
        <p className='text-yellow-800'>
          Map component could not be loaded properly.
        </p>
        {/* <ClientMapBlock
          center={[-94.5, 41.25]}
          zoom={8.3}
          datasetId="no2"
          layerId="no2-monthly-diff"
          dateTime="2024-05-31"
          compareDateTime="2023-05-31"
          compareLabel="May 2024 VS May 2023"
        /> */}
      </div>
    );
  }
};

export default MapEditorWrapper;
