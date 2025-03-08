// app/components/custom-jsx-renderer.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Import our ClientMapBlock component
const ClientMapBlock = dynamic(
  () => import('./mdx-preview-map').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] flex items-center justify-center bg-blue-50 border rounded">
        <div className="text-blue-500">Loading map preview...</div>
      </div>
    )
  }
);

// This component will be used by the MDXEditor to render JSX components
export function CustomJsxRenderer({ node, mdxComponentsMap }) {
  // For Map components, use our custom renderer
  if (node?.name === 'Map') {
    try {
      console.log('Rendering Map in editor with props:', node.props);
      
      // Extract props from the node
      const { center, zoom, datasetId, layerId, dateTime, compareDateTime, compareLabel } = node.props;
      
      // Pass props to our ClientMapBlock component
      return (
        <ClientMapBlock 
          center={center} 
          zoom={zoom} 
          datasetId={datasetId} 
          layerId={layerId}
          dateTime={dateTime}
          compareDateTime={compareDateTime}
          compareLabel={compareLabel}
        />
      );
    } catch (error) {
      console.error('Error rendering Map in CustomJsxRenderer:', error);
      return (
        <div className="border rounded p-4 my-4 bg-red-50">
          <p className="font-bold">Map Component</p>
          <p className="text-sm text-red-500">{error?.message || 'Error rendering map'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm">View props</summary>
            <pre className="mt-2 p-2 bg-red-100 text-xs overflow-auto">
              {JSON.stringify(node.props, null, 2)}
            </pre>
          </details>
        </div>
      );
    }
  }
  
  // For other components or if node is invalid, provide a fallback
  if (!node?.name) {
    return <div className="text-red-500">Invalid JSX node</div>;
  }
  
  const Component = mdxComponentsMap?.[node.name];
  
  if (!Component) {
    return (
      <div className="border rounded p-2 my-2 bg-yellow-50">
        <p className="text-sm">Unknown component: {node.name}</p>
      </div>
    );
  }
  
  // Render the component with its props
  return <Component {...node.props} />;
}