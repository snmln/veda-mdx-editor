'use client';

import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import dynamic from 'next/dynamic';
import { LexicalNode } from 'lexical';
import { TextInput, Label, Button, DatePicker } from '@trussworks/react-uswds';
import { ChartContextProvider, useChartContext } from '../utils/ChartContext';

interface FieldProps {
  label: string;
  value: string;
  hint?: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
  isDate?: boolean;
  numeric?: boolean;
}
interface ChartProps {
  dataPath: string;
  dateFormat: string;
  idKey: string;
  xKey: string;
  yKey: string;
  node?: LexicalNode & { setProps?: (props: Partial<ChartProps>) => void };
}
// Create a placeholder node type that satisfies the LexicalNode interface
const createPlaceholderNode = (): LexicalNode & {
  setProps?: (props: Partial<ChartProps>) => void;
} => {
  return {
    __type: 'placeholder',
    __key: 'placeholder',
    __parent: null,
    __prev: null,
    __next: null,
    setProps: () => console.warn('setProps called on a placeholder node'),
  } as unknown as LexicalNode & {
    setProps?: (props: Partial<ChartProps>) => void;
  };
};
const checkRequired = (isRequired, value) => {
  return isRequired && !value ? { validationStatus: 'error' } : '';
};

const MapField: React.FC<FieldProps> = ({
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
const ClientChartBlock = dynamic(
  () => import('./ChartPreview').then((mod) => mod.ClientChartBlock),
  {
    ssr: false,
    loading: () => (
      <div className='h-[180px] flex items-center justify-center bg-blue-50 border rounded'>
        <div className='text-blue-500'>Loading Chart preview...</div>
      </div>
    ),
  },
);

// Map editor component that includes both preview and editable properties
const ChartEditorWithPreview: React.FC<ChartProps> = (props) => {
  const contextValue = useChartContext();
  const [isEditing, setIsEditing] = useState(true);
  const [dataPath, setdataPath] = useState(
    props.dataPath || '/charts/story/hurricane-maria-ida-chart1.csv',
  );
  const [dateFormat, setdateFormat] = useState(props.dateFormat || '%m/%Y');
  const [idKey, setidKey] = useState(props.idKey || 'Zip');
  const [xKey, setxKey] = useState(props.xKey || 'Month');
  const [yKey, setyKey] = useState(props.yKey || 'Number of Tarps');

  // Safe update function
  const updateProps = () => {
    try {
      if (contextValue?.parentEditor && contextValue?.lexicalNode) {
        contextValue.parentEditor.update(() => {
          try {
            const node = contextValue.lexicalNode as LexicalNode & {
              setProps?: (props: Partial<ChartProps>) => void;
            };
            if (node?.setProps) {
              node.setProps({
                dataPath,
                dateFormat,
                idKey,
                xKey,
                yKey,
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
  }, [dataPath, dateFormat, idKey, xKey, yKey]);

  return (
    <div className=' border-05 border-primary rounded-lg overflow-hidden shadow-sm bg-white'>
      <div className='flex flex-col'>
        <div className='padding-2 grid-container w-full maxw-full margin-2 bg-gray-10 radius-lg'>
          {isEditing && (
            <div>
              <h3
                className={`font-medium ${isEditing ? 'text-blue-700' : 'text-gray-500'} text-sm`}
              >
                Chart Properties
              </h3>
              <div className='grid-row flex-align-end grid-gap-2'>
                <MapField
                  label='*Data Path'
                  value={dataPath}
                  onChange={setdataPath}
                  isRequired={true}
                />
                <MapField
                  label='*Date Format'
                  value={dateFormat}
                  onChange={setdateFormat}
                />
                <MapField label='*IdKey' value={idKey} onChange={setidKey} />
                <MapField label='*xKey' value={xKey} onChange={setxKey} />
                <MapField label='*yKey' value={yKey} onChange={setyKey} />
              </div>
            </div>
          )}

          <div className={`${isEditing && 'padding-top-2'}`}>
            <Button
              className='bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow flex items-center text-xs'
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Collapse Chart Editor' : 'Open Chart Editor'}
            </Button>
          </div>
        </div>

        <div className='relative'>
          <ClientChartBlock
            dataPath={dataPath}
            dateFormat={dateFormat}
            idKey={idKey}
            xKey={xKey}
            yKey={yKey}
          />
          {/* <div>CHART TEST</div> */}
        </div>
      </div>
    </div>
  );
};

// This wrapper is used when the component is used in the editor
const ChartEditorWrapper: React.FC<ChartProps> = (props) => {
  try {
    const [editor] = useLexicalComposerContext();

    return (
      <ChartContextProvider
        value={{
          parentEditor: editor,
          lexicalNode: props.node || createPlaceholderNode(),
        }}
      >
        <ChartEditorWithPreview {...props} />
      </ChartContextProvider>
    );
  } catch (error) {
    console.error('Error in ChartEditorWrapper:', error);
    return (
      <div className='p-4 bg-yellow-100 rounded border border-yellow-400'>
        <p className='text-yellow-800'>
          Chart component could not be loaded properly.
        </p>
      </div>
    );
  }
};

export default ChartEditorWrapper;
