import React, { Fragment } from 'react';
import { GoesInterface } from 'test01-goes';
import { BrowserRouter } from 'react-router-dom';

const defaultConfig = {
  stacApiUrl: "https://earth.gov/ghgcenter/api/stac",
  rasterApiUrl: "https://earth.gov/ghgcenter/api/raster",
  cloudBrowseUrl: "https://data.ghg.center/browseui",
  mapboxToken:
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  mapboxStyle: "mapbox://styles/covid-nasa",
  basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
};

export const GoesPreview = (props) => {
  return (
    <BrowserRouter>
      <GoesInterface 
      defaultZoomLevel={4} 
      defaultZoomLocation={[-98.771556, 32.967243]} 
      defaultCollectionId='goes-ch4plume-v1'
      config={defaultConfig} />
    </BrowserRouter>
  );
};
const GoesWrapper = (props) => {
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
        GOES Interface Preview
      </p>

      <div style={{ height: '550px', position: 'relative' }}>
        <GoesPreview props={{ ...props }} />
      </div>
    </div>
  );
};

export default GoesWrapper;
