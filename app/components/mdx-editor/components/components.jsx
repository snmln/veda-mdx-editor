'use client';

import React from 'react';

export const MyLeaf = ({ foo, bar, onClick, children }) => {
  return (
    <span className="bg-yellow-100 px-2 py-1 rounded" onClick={typeof onClick === 'function' ? onClick : () => {}}>
      {foo && <span className="text-blue-500 mr-1">{foo}:</span>}
      {bar && <span className="text-green-500 mr-1">{bar}:</span>}
      {children}
    </span>
  );
};

export const Marker = ({ type, children }) => (
  <span className="border border-red-500 p-1 rounded inline-block">
    {type && <span className="text-xs text-red-500 mr-1">{type}:</span>}
    {children}
  </span>
);

export const BlockNode = ({ children }) => (
  <div className="border-l-4 border-blue-500 pl-4 my-4">{children}</div>
);

// Export a components object for convenience
export const customComponents = {
  MyLeaf,
  Marker,
  BlockNode,
};