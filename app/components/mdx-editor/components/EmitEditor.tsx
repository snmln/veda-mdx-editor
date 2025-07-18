import React, { Fragment } from 'react';
import { EmitInterface } from 'test01-emit';
import { BrowserRouter } from 'react-router-dom';

const EmitEditorWrapper = () => {

  const config = {
    mapboxToken:
      'pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA',
    geoApifyKey: 'YOUR_FALLBACK_GEOAPIFY_KEY',
    mapboxStyle: 'mapbox://styles/covid-nasa',
    basemapStyle: 'cldu1cb8f00ds01p6gi583w1m',
    defaultCollectionId: 'emit-ch4plume-v1',
    stacApiUrl:
      'https://earth.gov/ghgcenter/api/stac/collections/emit-ch4plume-v1/items',
    metadataEndpoint:
      'https://earth.jpl.nasa.gov/emit-mmgis-lb/Missions/EMIT/Layers/coverage/combined_plume_metadata.json',
    coverageUrl:
      'https://earth.jpl.nasa.gov/emit-mmgis/Missions/EMIT/Layers/coverage/coverage_pub.json',
    baseStacApiUrl: 'https://earth.gov/ghgcenter/api/stac/',
    rasterApiUrl: 'https://earth.gov/ghgcenter/api/raster',
    latlonEndpoint: 'https://api.geoapify.com/v1/geocode/reverse',
    publicUrl: '',
    defaultZoomLocation: [-98.771556, 32.967243],
    defaultZoomLevel: 4,
    defaultStartDate: '2022-08-22',
  };

  return (
    <div
      style={{
        border: '1px solid #2ECC71',
        padding: '10px',
        margin: '5px',
        backgroundColor: '#E8F8F5',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '550px',
      }}
    >
      <p
        style={{
          margin: '0 0 10px 0',
          fontWeight: 'bold',
          fontSize: '0.9em',
          color: '#1E8449',
          textAlign: 'center',
        }}
      >
        EMIT Interface Preview
      </p>

      <div style={{ height: '550px', position: 'relative' }}>
        <BrowserRouter>
          <EmitInterface
            defaultCollectionId='emit-ch4plume-v1'
            defaultZoomLocation={[-98.771556, 32.967243]}
            defaultZoomLevel={4}
            config={config}
            defaultStartDate={'1/1/2020'}
          />
        </BrowserRouter>
      </div>
    </div>
  );
};

export default EmitEditorWrapper;
