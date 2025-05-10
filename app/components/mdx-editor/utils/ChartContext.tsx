'use client';

import React, { createContext, useContext } from 'react';
import { LexicalEditor, LexicalNode } from 'lexical';

interface ChartContextValue {
  parentEditor: LexicalEditor;
  lexicalNode: LexicalNode;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export const ChartContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ChartContextValue;
}) => {
  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
};

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChartContext must be used within a ChartContextProvider');
  }
  return context;
};