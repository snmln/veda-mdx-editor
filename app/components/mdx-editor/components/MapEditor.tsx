'use client';
import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MapContextProvider, useMapContext } from '../utils/MapContext';
import dynamic from 'next/dynamic';
import { LexicalNode } from 'lexical';
import { TextInput, Label, Button, DatePicker } from '@trussworks/react-uswds';
import { MapProps } from './types';
import { useMdastNodeUpdater } from '@mdxeditor/editor';
import { DEFAULT_MAP_PROPS } from './ToolbarComponents';
import { InputField } from '../utils/CreateInterface';
import { ClientMapBlock } from './MapPreview';
interface EditorMapProps extends MapProps {
  node?: LexicalNode & { setProps?: (props: Partial<MapProps>) => void };
}

// Create a placeholder node type that satisfies the LexicalNode interface
const createPlaceholderNode = (): LexicalNode & {
  setProps?: (props: Partial<EditorMapProps>) => void;
} => {
  return {
    __type: 'placeholder',
    __key: 'placeholder',
    __parent: null,
    __prev: null,
    __next: null,
    setProps: () => console.warn('setProps called on a placeholder node'),
  } as unknown as LexicalNode & {
    setProps?: (props: Partial<EditorMapProps>) => void;
  };
};

// Map editor component that includes both preview and editable properties
const MapEditorWithPreview: React.FC<any> = (props) => {
  const contextValue = useMapContext();
  const [isEditing, setIsEditing] = useState(true);
  const initialMapProps = () => {
    const generatedProps = props.props.mdastNode.attributes.reduce(
      (acc, item) => {
        acc[item.name] = item.value;
        return acc;
      },
      {},
    );

    if (
      generatedProps.center &&
      generatedProps.layerId &&
      generatedProps.zoom &&
      generatedProps.datasetId &&
      generatedProps.dateTime
    ) {
      return { ...generatedProps };
    }
    return { ...DEFAULT_MAP_PROPS };
  };
  const [mapProps, setMapProps] = useState(initialMapProps());
  const [draftInputs, setDraftInputs] = useState({
    defaultDateFormat: '%Y-%m-%d',
    dateTime: mapProps.dateTime,
    compareDateTime: mapProps.compareDateTime,
    center: mapProps.center,
  });
  const [inputErrors, setInputErrors] = useState({
    dateTime: false,
    compareDateTime: false,
    center: false,
  });
  const {
    center,
    layerId,
    zoom,
    datasetId,
    dateTime,
    compareDateTime,
    compareLabel,
    attrAuthor,
    attrUrl,
    caption,
  } = mapProps;

  // Parse values for the map preview
  const parsedCenter =
    typeof center === 'string'
      ? center.startsWith('[')
        ? JSON.parse(center)
        : [-94.5, 41.25]
      : center;

  const parsedZoom = typeof zoom === 'string' ? parseFloat(zoom) || 8.3 : zoom;

  const updateMdastNode = useMdastNodeUpdater();
  const { mdastNode } = props;

  const stateToNode = [
    {
      type: 'mdxJsxAttribute',
      name: 'center',
      value: center,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'zoom',
      value: zoom,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'datasetId',
      value: datasetId,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'layerId',
      value: layerId,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'dateTime',
      value: dateTime,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'compareDateTime',
      value: compareDateTime,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'compareLabel',
      value: compareLabel,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'attrUrl',
      value: attrUrl,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'attrAuthor',
      value: attrAuthor,
    },
    {
      type: 'mdxJsxAttribute',
      name: 'caption',
      value: caption,
    },
  ];
  const updateProps = () => {
    try {
      if (contextValue?.parentEditor && contextValue?.lexicalNode) {
        contextValue.parentEditor.update(() => {
          try {
            const node = contextValue.lexicalNode as LexicalNode & {
              setProps?: (props: Partial<EditorMapProps>) => void;
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
    console.log('mdastNode', mdastNode);
    updateProps();
    updateMdastNode({ ...mdastNode, attributes: stateToNode });
  }, [mapProps]);
  const firstInterface = [
    { fieldName: '*Dataset ID', propName: 'datasetId', isRequired: true },
    { fieldName: '*Layer ID', propName: 'layerId', isRequired: true },
    {
      fieldName: '*Center',
      propName: 'center',
      isRequired: true,
      validateAgainst: 'centerFormat',
    },
    { fieldName: '*Zoom', propName: 'zoom', isRequired: true },
    {
      fieldName: '*Date Time',
      propName: 'dateTime',
      isRequired: true,
      validateAgainst: 'defaultDateFormat',
    },
  ];
  const comparisonInterface = [
    { fieldName: 'Compare Label', propName: 'compareLabel' },
    {
      fieldName: 'Compare Date',
      propName: 'compareDateTime',
      validateAgainst: 'defaultDateFormat',
    },
  ];

  const captionInterface = [
    { fieldName: 'Author Attribution', propName: 'attrAuthor' },
    { fieldName: 'Attribution Url', propName: 'attrUrl' },
    {
      fieldName: 'Caption',
      propName: 'caption',
      type: 'area',
      customClass: 'flex flex-fill',
    },
  ];

  return (
    <>
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
                  {firstInterface.map((field) => {
                    const { propName, fieldName, type, customClass } = field;

                    return InputField({
                      ...field,
                      fieldName,
                      value: mapProps[propName],
                      onChange: setMapProps,
                      type: type,
                      componentProps: mapProps,
                      propName: propName,
                      customClass: customClass,
                      draftInputs,
                      inputErrors,
                      setInputErrors,
                      setDraftInputs,
                    });
                  })}
                </div>
                <h4>Map Comparison</h4>
                <div className='grid-row flex-align-end grid-gap-2'>
                  {comparisonInterface.map((field) => {
                    const { propName, fieldName, type, customClass } = field;

                    return InputField({
                      ...field,
                      fieldName,
                      value: mapProps[propName],
                      onChange: setMapProps,
                      type: type,
                      componentProps: mapProps,
                      propName,
                      customClass: customClass,
                      draftInputs,
                      setDraftInputs,
                      inputErrors,
                      setInputErrors,
                    });
                  })}
                </div>
                <div className='grid-row flex-align-start grid-gap-2'>
                  {captionInterface.map((field) => {
                    const { propName, fieldName, type, customClass } = field;

                    return InputField({
                      ...field,
                      fieldName,
                      value: mapProps[propName],
                      onChange: setMapProps,
                      type: type,
                      componentProps: mapProps,
                      propName: propName,
                      customClass: customClass,
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
                {isEditing ? 'Collapse Map Editor' : 'Open Map Editor'}
              </Button>
            </div>
          </div>

          <div className='relative'>
            <ClientMapBlock
              {...mapProps}
              center={parsedCenter}
              zoom={parsedZoom}
            />
          </div>
          <div>
            <figcaption className='text-gray-30 flex padding-top-2'>
              <span className=''>
                <p className='display-inline'>{mapProps.caption}</p>
              </span>
            </figcaption>
          </div>
        </div>
      </div>
    </>
  );
};

// This wrapper is used when the component is used in the editor
const MapEditorWrapper: React.FC<EditorMapProps> = (props) => {
  try {
    const [editor] = useLexicalComposerContext();

    return (
      <>
        <MapContextProvider
          value={{
            parentEditor: editor,
            lexicalNode: props.node || createPlaceholderNode(),
          }}
        >
          <MapEditorWithPreview {...props} />
        </MapContextProvider>
      </>
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
