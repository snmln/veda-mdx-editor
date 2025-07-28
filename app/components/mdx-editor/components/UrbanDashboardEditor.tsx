import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { UrbanDashboard } from "test01-urban";
import "../style/styles.css"

export const urbanConfig = {
  mapboxToken:
    "pk.eyJ1IjoiY292aWQtbmFzYSIsImEiOiJjbGNxaWdqdXEwNjJnM3VuNDFjM243emlsIn0.NLbvgae00NUD5K64CD6ZyA",
  mapboxStyle: "mapbox://styles/covid-nasa",
  basemapStyle: "cldu1cb8f00ds01p6gi583w1m",
  featuresApiUrl: "https://earth.gov/ghgcenter/api/features",
  dataUrl: "https://raw.githubusercontent.com/US-GHG-Center/urban_dashboard_data/main/data",
};

// Simple Shadow DOM wrapper
const ShadowWrapper = ({ children }) => {
  const hostRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current || rootRef.current) return;

    // Create shadow root
    const shadowRoot = hostRef.current.attachShadow({ mode: "open" });

    // Create container
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    shadowRoot.appendChild(container);

    // Create React root and render
    rootRef.current = createRoot(container);
    rootRef.current.render(children);

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
    };
  }, [children]);

  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
};

export const UrbanDashboardPreview = (props) => {
  return (
    <div className="fullSize" style={{ minHeight: '550px', width: '100%' }}>
      <ShadowWrapper>
        <UrbanDashboard
          defaultZoomLocation={[-98.771556, 32.967243]}
          defaultZoomLevel={4}
          config={urbanConfig}
        />
      </ShadowWrapper>
    </div>
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

      <div style={{ height: '550px', width: '100%'}}>
        <UrbanDashboardPreview props={{ ...props }} />
      </div>
    </div>
  );
};

export default UrbanDashboardWrapper;