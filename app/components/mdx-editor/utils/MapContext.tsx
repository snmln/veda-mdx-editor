'use client';

import React, { createContext, useContext } from 'react';
import { LexicalEditor, LexicalNode } from 'lexical';

interface MapContextValue {
  parentEditor: LexicalEditor;
  lexicalNode: LexicalNode;
}

const MapContext = createContext<MapContextValue | null>(null);

export const MapContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: MapContextValue;
}) => {
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within a MapContextProvider');
  }
  return context;
};
