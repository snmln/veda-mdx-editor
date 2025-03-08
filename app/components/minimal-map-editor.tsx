// app/components/minimal-map-editor.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { MapIcon } from '@heroicons/react/24/outline';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MapContextProvider, useMapContext } from './MapContext';
import dynamic from 'next/dynamic';

// Import the actual map component for live preview
const ClientMapBlock = dynamic(
  () => import('./mdx-preview-map'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] flex items-center justify-center bg-blue-50 border rounded">
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
    <div className="my-4 border rounded-lg overflow-hidden">
      {/* Map live preview */}
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
        
        {/* Edit button overlay */}
        <button 
          className="absolute bottom-3 right-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow flex items-center text-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Close' : 'Edit Properties'}
        </button>
      </div>
      
      {/* Editable properties panel - only visible when editing */}
      {isEditing && (
        <div className="bg-gray-50 p-4 border-t">
          <h3 className="font-medium text-gray-700 mb-3">Map Properties</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dataset ID</label>
              <input
                type="text"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layer ID</label>
              <input
                type="text"
                value={layerId}
                onChange={(e) => setLayerId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
              <input
                type="text"
                value={center}
                onChange={(e) => setCenter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zoom</label>
              <input
                type="text"
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Time</label>
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Date Time</label>
              <input
                type="text"
                value={compareDateTime}
                onChange={(e) => setCompareDateTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Label</label>
              <input
                type="text"
                value={compareLabel}
                onChange={(e) => setCompareLabel(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      )}
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