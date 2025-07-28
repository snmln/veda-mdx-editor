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

// Enhanced Shadow DOM wrapper with document method patching
const ShadowWrapper = ({ children, styleUris = [] }) => {
  const hostRef = useRef(null);
  const rootRef = useRef(null);
  const shadowRootRef = useRef(null);
  
  useEffect(() => {
    if (!hostRef.current) return;
    
    // Check if shadow root already exists
    if (hostRef.current.shadowRoot) return;
    
    // Create shadow root
    const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
    shadowRootRef.current = shadowRoot;
    
    // Store original methods
    const originalGetElementById = document.getElementById.bind(document);
    const originalQuerySelector = document.querySelector.bind(document);
    const originalQuerySelectorAll = document.querySelectorAll.bind(document);
    const originalGetElementsByClassName = document.getElementsByClassName.bind(document);
    const originalGetElementsByTagName = document.getElementsByTagName.bind(document);
    const originalGetElementsByName = document.getElementsByName.bind(document);
    
    // Override document methods to search shadow DOM too
    document.getElementById = function(id) {
      // First try original
      let element = originalGetElementById(id);
      if (element) return element;
      
      // Then try shadow root
      if (shadowRootRef.current) {
        element = shadowRootRef.current.getElementById(id);
        if (element) return element;
      }
      
      return null;
    };
    
    document.querySelector = function(selector) {
      // First try original
      let element = originalQuerySelector(selector);
      if (element) return element;
      
      // Then try shadow root
      if (shadowRootRef.current) {
        element = shadowRootRef.current.querySelector(selector);
        if (element) return element;
      }
      
      return null;
    };
    
    document.querySelectorAll = function(selector) {
      // Get results from main document
      const mainResults = originalQuerySelectorAll(selector);
      
      // Get results from shadow DOM
      if (shadowRootRef.current) {
        const shadowResults = shadowRootRef.current.querySelectorAll(selector);
        // Combine both NodeLists
        return [...mainResults, ...shadowResults];
      }
      
      return mainResults;
    };
    
    document.getElementsByClassName = function(names) {
      const mainResults = originalGetElementsByClassName(names);
      if (shadowRootRef.current) {
        const shadowResults = shadowRootRef.current.getElementsByClassName(names);
        return [...mainResults, ...shadowResults];
      }
      return mainResults;
    };
    
    document.getElementsByTagName = function(tagName) {
      const mainResults = originalGetElementsByTagName(tagName);
      if (shadowRootRef.current) {
        const shadowResults = shadowRootRef.current.getElementsByTagName(tagName);
        return [...mainResults, ...shadowResults];
      }
      return mainResults;
    };
    
    document.getElementsByName = function(name) {
      const mainResults = originalGetElementsByName(name);
      if (shadowRootRef.current) {
        const shadowResults = shadowRootRef.current.getElementsByName(name);
        return [...mainResults, ...shadowResults];
      }
      return mainResults;
    };
    
    // Create container
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    shadowRoot.appendChild(container);
    
    const style = document.createElement('style');
    style.textContent = `
    .card {
    padding: 5px 15px;
    margin-top: 5px;
}
    
.explore-more-card {
    display: flex;
    text-decoration: none !important;
    margin-right: 10px;
    justify-content: space-between;
}
    
/* Dataset Card Styles start Here */
.dataset-card {
    /* max-width: 329px; */
}
    
.dataset-card h2 {
    color: #082A64;
    font-size: 16px;
    margin: 0 0 8px 0;
}
    
.dataset-card p {
    color: #1E1E1E;
    font-size: 12px;
    line-height: 1.6;
    margin: 0;
}
    
.dataset-card a {
    color: #0098D7;
    text-decoration: none;
    /* font-weight: bold; */
}
    
.dataset-card a:hover {
    text-decoration: underline;
}
    
/* Population Card Styles Start Here */
.population-container {
    margin-top: 5px;
    display: flex;
    gap: 60px;
}
    
.population-item {
    display: flex;
    align-items: center;
}
    
.population-icon {
    background-color: #082A64;
    border-radius: 6px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}
    
.population-icon img {
    width: 24px;
    height: 24px;
}
    
.population-info {
    display: flex;
    flex-direction: column;
}
    
.population-label {
    color: #0098D7;
    font-size: 12px;
    margin: 0;
    line-height: 12.1px;
}
    
.population-value {
    color: #082A64;
    font-size: 16px;
    margin: 0;
    line-height: 19.36px;
}
    
/* Population Card Styles End Here */
    
/* Pie chart */
.pie-chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
    
.pie-chart {
    width: 105px;
    height: 105px;
    margin: 0 auto;
}
    
/* Colormap chart */
.colormap-chart {
    position: fixed;
    z-index: 100;
    right: 10px;
    bottom: 30px;
    width: 320px;
    
    padding: 10px;
    
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    /* max-width: 90vw; */
    
    align-items: center;
    justify-content: center;
}
.dashboard {
    display: block;
    position: static;
}
    
/* Pie chart */
.pie-chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
    
.pie-chart {
    width: 135px;
    height: 135px;
    margin: 0 auto;
}
    
    
/* Stacked line chart */
.dataset-card {
    /* overflow: auto; */
}
    
.info-sidebar-container {
    /* display: flex;
    flex-direction: column; */
}
    
.info-sidebar {
    position: fixed;
    margin-top: 10px;
    margin-left: 10px;
    /* margin-bottom: 10px; */
    /* max-width: 90vw; */
    width: 30vw;
    
    max-height: 94vh;
    border-radius: 6px;
    
    padding: 20px;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    overflow-y: auto;
    
    display: flex;
    flex-direction: column;
    gap: 20px;
}
    
.info-sidebar-full-height {
    /* height: 100%; */
}
    
.info-sidebar-full-height {
    height: 100%;
}
    
.info-border-primary {
    border: 1px solid #082A64;
}
    
.info-border-secondary {
    border: 1px solid #D0D0D0;
}
/* parent div of insights should be relative,
 else insight would be applied with repect to body */
    
.insights {
    display: block;
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 11%;
    color: white;
}
    
.insights-left {
    display: block;
    position: absolute;
    left: 1%;
    top: 0;
    bottom: 0;
}
    
.insights-bottom-left {
    position: absolute;
    z-index: 1000;
    bottom: 15%;
    left: 1%;
}
    
.insights-right {
    display: block;
    position: absolute;
    right: 1%;
}
    
.insights>div>div {
    margin-bottom: 4%;
}
    
.mapSection {
  position: relative;
  height: 100%;
  width: 100%;
}
    
.marker {
  background-image: url('/marker-gold.png'); 
  background-size: cover;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
    
.mapboxgl-ctrl button .mapboxgl-ctrl-icon {
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  font-size: 14px;
  padding-top: 20%;
  /* background-color: #082A63; */
  fill: white;
}
    
.mapboxgl-ctrl-compass {
  display: none !important;
}
    
.title-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
    
.title-card-title {
  flex-grow: 1;
  display: flex;
  justify-content: left;
  color: #082A64;
}
    
.title-card-left {
  display: flex;
  justify-content: center;
  align-items: center;
}
    
.title-card-right {
  display: flex;
  align-items: center;
  justify-content: center;
}
  `;
    shadowRoot.appendChild(style);
    
    
    // Create React root and render
    const root = createRoot(container);
    rootRef.current = root;
    root.render(children);
    
    return () => {
      // Restore original methods
      document.getElementById = originalGetElementById;
      document.querySelector = originalQuerySelector;
      document.querySelectorAll = originalQuerySelectorAll;
      document.getElementsByClassName = originalGetElementsByClassName;
      document.getElementsByTagName = originalGetElementsByTagName;
      document.getElementsByName = originalGetElementsByName;
      
      // Cleanup React root
      setTimeout(() => {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }
      }, 0);
    };
  }, []);
  
  // Update content when children change
  useEffect(() => {
    if (rootRef.current && children) {
      rootRef.current.render(children);
    }
  }, [children]);
  
  return <div ref={hostRef} style={{ width: "100%", height: "100%" }} />;
};

export const UrbanDashboardPreview = (props) => {
  const requiredStyles = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap'
  ];
  return (
    <div className="fullSize" style={{ minHeight: '550px', width: '100%' }}>
    <ShadowWrapper styleUris={requiredStyles}>
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