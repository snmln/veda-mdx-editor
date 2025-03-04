'use client';

import React from 'react';
import { ClientMapBlock } from '../components/mdx-preview-map';

export default function MapTestPage() {
  return (
    <div className="container mx-auto p-4 max-w-5xl min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Map Component Test</h1>
      <div className="border rounded-lg p-4 bg-white shadow-lg">
        <ClientMapBlock 
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
