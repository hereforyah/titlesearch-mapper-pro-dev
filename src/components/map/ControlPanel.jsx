import React from 'react';
import { useMap } from 'react-leaflet';
import { useAppSettings } from '../../context/AppSettingsContext';

const ControlPanel = () => {
  const map = useMap();
  const { mapSettings, updateMapSettings } = useAppSettings();
  
  // Handle base layer change
  const handleBaseLayerChange = (e) => {
    const baseLayer = e.target.value;
    updateMapSettings({ baseLayer });
    
    // In a real implementation, we would switch the actual tile layer here
    // This is a simplified version
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  // Handle reset view
  const handleResetView = () => {
    map.setView([40.7128, -74.0060], 13); // Default to NYC
  };
  
  return (
    <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md z-[1000]">
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <button 
            className="btn btn-secondary w-10 h-10 flex items-center justify-center"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button 
            className="btn btn-secondary w-10 h-10 flex items-center justify-center"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            -
          </button>
        </div>
        
        <button 
          className="btn btn-secondary"
          onClick={handleResetView}
          title="Reset View"
        >
          Reset
        </button>
        
        <select 
          className="form-input"
          value={mapSettings.baseLayer}
          onChange={handleBaseLayerChange}
          title="Change Base Map"
        >
          <option value="OpenStreetMap">OpenStreetMap</option>
          <option value="Satellite">Satellite</option>
          <option value="Terrain">Terrain</option>
        </select>
      </div>
    </div>
  );
};

export default ControlPanel;
