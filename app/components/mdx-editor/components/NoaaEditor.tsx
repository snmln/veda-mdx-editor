import React, { Fragment } from 'react';
import { NoaaInterface } from 'test01-noaa';

const defaultConfig = {
  stacApiUrl: "https://earth.gov/ghgcenter/api/stac",
  rasterApiUrl: "https://earth.gov/ghgcenter/api/raster",
  cloudBrowseUrl: "https://data.ghg.center/browseui",
  publicUrl: "/",
  mapboxToken:
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  mapboxStyle: "mapbox://styles/covid-nasa",
  basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
  defaultZoomLocation: [-98.771556, 32.967243],
  defaultZoomLevel: 4,
  defaultCollectionId: "goes-ch4plume-v1",
  featuresApiUrl: "https://dev.ghg.center/api/features",
};
const defaultZoomLocation = [-98.771556, 32.967243];
const defaultZoomLevel = 4;

export const NoaaPreview = (props) => {
  return( 
        <NoaaInterface
          defaultZoomLevel={defaultZoomLevel}
          defaultZoomLocation={defaultZoomLocation}
          config={defaultConfig}
        />)
};

const NoaaWrapper = (props) => {
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
        NOAA Interface Preview
      </p>

      <div style={{ height: '550px', position: 'relative' }}>
        <NoaaPreview props={{ ...props }} />
      </div>
    </div>
  );
};

export default NoaaWrapper;
