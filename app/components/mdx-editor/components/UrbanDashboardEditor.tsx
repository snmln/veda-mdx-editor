import React from "react";
import { UrbanDashboard } from "test01-urban";
import { BrowserRouter } from "react-router-dom";
import "../style/styles.css";

export const urbanConfig = {
  mapboxToken:
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  mapboxStyle: "mapbox://styles/covid-nasa",
  basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
  featuresApiUrl: "https://earth.gov/ghgcenter/api/features",
  dataUrl: "https://raw.githubusercontent.com/US-GHG-Center/urban_dashboard_data/main/data",
};

export const UrbanDashboardPreview = (props) => {
    
  return (
    <BrowserRouter>
      <div className="fullSize" style={{ minHeight: '550px', width: '100%' }}>
        <UrbanDashboard
          defaultZoomLocation = {[-98.771556, 32.967243]}
          defaultZoomLevel={4}
          config={urbanConfig}
        />
      </div>
    </BrowserRouter>
  );
};

const UrbanDashboardWrapper = (props) => {
  return (
    <div
      style={{
        border: '1px solid #2ECC71',
        backgroundColor: '#E8F8F5',
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
        Urban Dashboard Preview
      </p>

       <div style={{ height: '550px', position: 'relative' }}>
        <UrbanDashboardPreview props={{ ...props }} />
      </div>
    </div>
  );
};

export default UrbanDashboardWrapper;
