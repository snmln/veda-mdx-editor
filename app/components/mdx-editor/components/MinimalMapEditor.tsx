// app/components/minimal-map-editor.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { MapIcon } from '@heroicons/react/24/outline';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MapContextProvider, useMapContext } from '../utils/MapContext';
import dynamic from 'next/dynamic';

// Import the actual map component for live preview
const ClientMapBlock = dynamic(
  () => import('./MDXMapPreview').then((mod) => mod.ClientMapBlock),
  {
    ssr: false,
    loading: () => (
      <div className="h-[180px] flex items-center justify-center bg-blue-50 border rounded">
        <div className="text-blue-500">Loading map preview...</div>
      </div>
    )
  }
);

// Map editor component that includes both preview and editable properties
const MapEditorWithPreview = (props: any) => {
  // Get context values - but handle the case where they might be undefined
  const contextValue = useMapContext();
  const [isEditing, setIsEditing] = useState(false);
  const [center, setCenter] = useState(props.center || '[-94.5, 41.25]');
  const [zoom, setZoom] = useState(props.zoom || '8.3');
  const [datasetId, setDatasetId] = useState(props.datasetId || 'no2');
  const [layerId, setLayerId] = useState(props.layerId || 'no2-monthly-diff');
  const [dateTime, setDateTime] = useState(props.dateTime || '2024-05-31');
  const [compareDateTime, setCompareDateTime] = useState(props.compareDateTime || '2023-05-31');
  const [compareLabel, setCompareLabel] = useState(props.compareLabel || 'May 2024 VS May 2023');

  // Parse values for the map preview
  const parsedCenter = typeof center === 'string' ? 
    (center.startsWith('[') ? JSON.parse(center) : [-94.5, 41.25]) : 
    center;
  const parsedZoom = typeof zoom === 'string' ? parseFloat(zoom) || 8.3 : zoom;

  // Safe update function
  const updateProps = () => {
    try {
      if (contextValue && contextValue.parentEditor && contextValue.lexicalNode) {
        contextValue.parentEditor.update(() => {
          try {
            if (contextValue.lexicalNode && typeof contextValue.lexicalNode.setProps === 'function') {
              contextValue.lexicalNode.setProps({
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
  }, [center, zoom, datasetId, layerId, dateTime, compareDateTime, compareLabel]);

  return (
    <div className="my-2 border rounded-lg overflow-hidden shadow-sm bg-white">
      {/* Map live preview with properties above */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`font-medium ${isEditing ? 'text-blue-700' : 'text-gray-500'} text-sm`}>
            {isEditing ? 'Map Properties' : ''}
          </h3>
          <button 
            className="bg-blue-600 hover:bg-blue-700   px-3 py-1 rounded-md shadow flex items-center text-xs"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Close Editor' : 'Edit Map'}
          </button>
        </div>
        
        {/* Properties panel with table layout for perfect alignment */}
        {isEditing && (
          <div className="bg-white p-3 border rounded-md shadow-sm mb-2">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Dataset ID:</td>
                  <td>
                    <input
                      type="text"
                      value={datasetId}
                      onChange={(e) => setDatasetId(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
                
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Layer ID:</td>
                  <td>
                    <input
                      type="text"
                      value={layerId}
                      onChange={(e) => setLayerId(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
                
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Center:</td>
                  <td>
                    <input
                      type="text"
                      value={center}
                      onChange={(e) => setCenter(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
                
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Zoom:</td>
                  <td>
                    <input
                      type="text"
                      value={zoom}
                      onChange={(e) => setZoom(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
                
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Date Time:</td>
                  <td>
                    <input
                      type="text"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
                
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Compare Date:</td>
                  <td>
                    <input
                      type="text"
                      value={compareDateTime}
                      onChange={(e) => setCompareDateTime(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
                
                <tr className="h-8">
                  <td className="text-xs font-medium text-gray-600 w-32 pr-2">Compare Label:</td>
                  <td>
                    <input
                      type="text"
                      value={compareLabel}
                      onChange={(e) => setCompareLabel(e.target.value)}
                      className="w-full px-2 py-1 border border-blue-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        <div className="relative">
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
      
      {/* Editable properties panel - only visible when editing */}
      {/* Map properties panel is now above the map */}
    </div>
  );
};

// This wrapper is used when the component is used in the editor
const MapEditorWrapper = (props: any) => {
  try {
    const [editor] = useLexicalComposerContext();
    
    // Create a safe version of props.node
    const safeNode = props.node || {
      setProps: () => console.warn('setProps called on a placeholder node')
    };
    
    return (
      <MapContextProvider
        value={{
          parentEditor: editor,
          lexicalNode: safeNode
        }}
      >
        <MapEditorWithPreview {...props} />
      </MapContextProvider>
    );
  } catch (error) {
    console.error('Error in MapEditorWrapper:', error);
    // Fallback if anything goes wrong with the context
    return (
      <div className="p-4 bg-yellow-100 rounded border border-yellow-400">
        <p className="text-yellow-800">Map component could not be loaded properly.</p>
        <ClientMapBlock
          center={[-94.5, 41.25]}
          zoom={8.3}
          datasetId="no2"
          layerId="no2-monthly-diff"
          dateTime="2024-05-31"
          compareDateTime="2023-05-31"
          compareLabel="May 2024 VS May 2023"
        />
      </div>
    );
  }
};

export default MapEditorWrapper;