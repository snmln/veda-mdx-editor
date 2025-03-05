import React from 'react';
import dynamic from 'next/dynamic';

// Import the ClientMapBlock component with dynamic import to avoid SSR
const ClientMapBlockNoSSR = dynamic(
  () => import('../components/mdx-preview-map').then((mod) => mod.ClientMapBlock),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] flex items-center justify-center">Loading map component...</div>
  }
);

export default function MapTestPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Map Component Test</h1>
      <div className="border rounded-lg p-4 bg-white shadow-lg">
        <ClientMapBlockNoSSR 
          center={[-94.5, 41.25]}
          zoom={8.3}
          datasetId="no2"
          layerId="no2-monthly-diff"
          dateTime="2024-05-31"
        />
      </div>
    </div>
  );
}
