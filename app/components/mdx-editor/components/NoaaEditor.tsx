import React, { Fragment } from 'react';
import { NoaaInterface } from 'test01-noaa';
import '../style/styles.css';
const defaultConfig = {
  // API Endpoints
  mapboxToken:
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  mapboxStyle: "mapbox://styles/covid-nasa",
  basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
  featuresApiUrl: "https://earth.gov/ghgcenter/api/features/",
};

export const NoaaPreview = (props) => {
  return (
      <NoaaInterface 
      defaultZoomLevel={4} 
      config={defaultConfig} />
  );
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
