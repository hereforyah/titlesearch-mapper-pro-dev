import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppSettings } from '../../context/AppSettingsContext';
import ParcelLayer from './ParcelLayer';
import ControlPanel from './ControlPanel';
import OverlayManager from './OverlayManager';
import ParcelRenderer from './ParcelRenderer';
import ExportPanel from '../features/ExportPanel';
import MultiParcelOverlay from '../features/MultiParcelOverlay';
import IntersectionManager from '../features/IntersectionManager';

// Fix for Leaflet marker icons in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapViewer = () => {
  const { mapSettings } = useAppSettings();
  const mapRef = React.useRef(null);
  
  // Default center and zoom if not provided in settings
  const center = mapSettings.center || [40.7128, -74.0060]; // Default to NYC
  const zoom = mapSettings.zoom || 13;
  
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ParcelLayer />
        <ControlPanel />
        <ParcelRenderer />
        <IntersectionManager />
      </MapContainer>
      <OverlayManager mapRef={mapRef} />
      <ExportPanel mapRef={mapRef} />
      <MultiParcelOverlay mapRef={mapRef} />
    </div>
  );
};

export default MapViewer;
