'use client';

import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import dynamic from 'next/dynamic';
import { LexicalNode } from 'lexical';
import { Button } from '@trussworks/react-uswds';
import { ChartContextProvider, useChartContext } from '../utils/ChartContext';

import { DEFAULT_CHART_PROPS } from './ChartPreview';
import { InputField } from '../utils/CreateInterface';
import { ChartProps } from './types';
import { useMdastNodeUpdater } from '@mdxeditor/editor';

export interface EditorChartProps extends ChartProps {
  node?: LexicalNode & { setProps?: (props: Partial<ChartProps>) => void };
}

// Create a placeholder node type that satisfies the LexicalNode interface
const createPlaceholderNode = (): LexicalNode & {
  setProps?: (props: Partial<EditorChartProps>) => void;
} => {
  return {
    __type: 'placeholder',
    __key: 'placeholder',
    __parent: null,
    __prev: null,
    __next: null,
    setProps: () => console.warn('setProps called on a placeholder node'),
  } as unknown as LexicalNode & {
    setProps?: (props: Partial<EditorChartProps>) => void;
  };
};

const interfaceList = [
  { fieldName: 'Data Path', propName: 'dataPath', isRequired: true },
  {
    fieldName: 'Date Format',
    propName: 'dateFormat',
    isRequired: true,
    validateAgainst: 'highlightEnd, highlightStart',
  },
  { fieldName: 'IdKey', propName: 'idKey', isRequired: true },
  { fieldName: 'xKey', propName: 'xKey', isRequired: true },
  { fieldName: 'yKey', propName: 'yKey', isRequired: true },
  { fieldName: 'Alternative title', propName: 'altTitle' },
  { fieldName: 'Alternative Description', propName: 'altDesc' },
  { fieldName: 'Colors', propName: 'colors', placeHolder: '#FFFFFF, #000000' },
  { fieldName: 'Colors Scheme', propName: 'colorScheme', type: 'select' },
  { fieldName: 'X Axis Label', propName: 'xAxisLabel' },
  { fieldName: 'Y Axis Label', propName: 'yAxisLabel' },
  {
    fieldName: 'Highlight Start',
    propName: 'highlightStart',
    validateAgainst: 'dateFormat',
  },
  {
    fieldName: 'Highlight End',
    propName: 'highlightEnd',
    validateAgainst: 'dateFormat',
  },
  { fieldName: 'Highlight Label', propName: 'highlightLabel' },
  {
    fieldName: 'Available Domain',
    propName: 'availableDomain',
    placeHolder: '[6/2021, 9/2022]',
  },
  { fieldName: 'Author Attribution', propName: 'attrAuthor' },
  { fieldName: 'Attribution Url', propName: 'attrUrl' },
  {
    fieldName: 'Caption',
    propName: 'caption',
    type: 'area',
    customClass: 'flex flex-fill',
  },
];

// Import the actual map component for live preview
const ClientChartBlock = dynamic(
  () => import('./ChartPreview').then((mod) => mod.ClientChartBlock),
  {
    ssr: false,
    loading: () => (
      <div className='h-[180px] flex items-center justify-center bg-blue-50 '>
        <div className='text-blue-500'>Loading Chart preview...</div>
      </div>
    ),
  },
);

// Map editor component that includes both preview and editable properties
const ChartEditorWithPreview: React.FC<any> = (props) => {
  const { allAvailableDatasets, allAvailableCsvs } = props; // Add allAvailableCsvs
  const updateMdastNode = useMdastNodeUpdater();

  const { mdastNode } = props;

  const contextValue = useChartContext();
  const [isEditing, setIsEditing] = useState(true);

  const initialChartProps = () => {
    const { dataPath, dateFormat, idKey, xKey, yKey } = props;
    if (dataPath && dateFormat && idKey && xKey && yKey) {
      return { ...props };
    }
    return { ...DEFAULT_CHART_PROPS };
  };
  const [chartProps, setChartProps] = useState(initialChartProps());
  const [draftInputs, setDraftInputs] = useState({
    draftDateFormat: chartProps.dateFormat,
    draftHighlightEnd: chartProps.highlightEnd,
    draftHighlightStart: chartProps.highlightStart,
  });
  const [inputErrors, setInputErrors] = useState({
    highlightStart: false,
    highlightEnd: false,
  });
  const updateProps = () => {
    try {
      if (contextValue?.parentEditor && contextValue?.lexicalNode) {
        contextValue.parentEditor.update(() => {
          try {
            const node = contextValue.lexicalNode as LexicalNode & {
              setProps?: (props: Partial<EditorChartProps>) => void;
            };
            if (node?.setProps) {
              node.setProps({
                ...chartProps,
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

    const alignProps = Object.entries(chartProps).map(([key, value]) => ({
      type: 'mdxJsxAttribute',
      name: key,
      value: value,
    }));
    updateMdastNode({ ...mdastNode, attributes: alignProps });
  }, [chartProps]);

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

              <div className='grid-row flex-align-start grid-gap-2'>
               {interfaceList.map((input) => {
                const { propName } = input;

                return InputField({
                    ...input,
                    value: chartProps[propName],
                    onChange: setChartProps,
                    componentProps: chartProps,
                    draftInputs,
                    setDraftInputs,
                    inputErrors,
                    setInputErrors,
                  });
                })}
              </div>
            </div>
          )}

          <div className={`${isEditing && 'padding-top-2'}`}>
            <Button
              type='button'
              className='bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md shadow flex items-center text-xs'
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Collapse Chart Editor' : 'Open Chart Editor'}
            </Button>
          </div>
        </div>

        <div className='relative'>
          <div>
            <ClientChartBlock {...chartProps} allAvailableDatasets={allAvailableDatasets} />
          </div>
          <div>
            <figcaption className='text-gray-30 flex'>
              <span className=''>
                <p className='display-inline'>{chartProps.caption}</p>
              </span>
            </figcaption>
          </div>
        </div>
      </div>
    </div>
  );
};

// This wrapper is used when the component is used in the editor
const ChartEditorWrapper: React.FC<any> = (props) => {
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
