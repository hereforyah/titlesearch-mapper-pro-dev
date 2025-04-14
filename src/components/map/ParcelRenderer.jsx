import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useParcelContext } from '../../context/ParcelContext';
import { calculateParcelsBounds } from '../../utils/parcelUtils';

const ParcelRenderer = () => {
  const map = useMap();
  const { parcels, activeParcelId } = useParcelContext();
  
  // Effect to render parcels when they change
  useEffect(() => {
    if (!map || parcels.length === 0) return;
    
    // Calculate bounds to fit all parcels
    const bounds = calculateParcelsBounds(parcels);
    if (bounds) {
      const leafletBounds = L.latLngBounds(
        [bounds.southwest.lat, bounds.southwest.lng],
        [bounds.northeast.lat, bounds.northeast.lng]
      );
      
      // Add padding
      map.fitBounds(leafletBounds, {
        padding: [50, 50],
        maxZoom: 18
      });
    }
  }, [map, parcels.length]);
  
  // Effect to highlight active parcel
  useEffect(() => {
    if (!map || !activeParcelId) return;
    
    const activeParcel = parcels.find(p => p.id === activeParcelId);
    if (activeParcel && activeParcel.coordinates.length > 0) {
      // Calculate center of parcel
      const sumLat = activeParcel.coordinates.reduce((sum, coord) => sum + coord.lat, 0);
      const sumLng = activeParcel.coordinates.reduce((sum, coord) => sum + coord.lng, 0);
      const center = [
        sumLat / activeParcel.coordinates.length,
        sumLng / activeParcel.coordinates.length
      ];
      
      // Pan to center of active parcel
      map.panTo(center);
    }
  }, [map, activeParcelId, parcels]);
  
  return null; // This is a utility component, no rendering needed
};

export default ParcelRenderer;
