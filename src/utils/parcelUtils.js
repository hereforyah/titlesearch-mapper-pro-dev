/**
 * Utility functions for parcel operations
 */
import * as turf from '@turf/turf';

/**
 * Check if two parcels intersect
 * @param {Array} parcel1 - Array of coordinates for first parcel
 * @param {Array} parcel2 - Array of coordinates for second parcel
 * @returns {Object} - Intersection result with intersects flag and points
 */
export const checkParcelIntersection = (parcel1, parcel2) => {
  const intersectionPoints = [];
  
  // Check each line segment of parcel1 against each line segment of parcel2
  for (let i = 0; i < parcel1.length - 1; i++) {
    const line1Start = parcel1[i];
    const line1End = parcel1[i + 1];
    
    for (let j = 0; j < parcel2.length - 1; j++) {
      const line2Start = parcel2[j];
      const line2End = parcel2[j + 1];
      
      const intersection = lineIntersection(
        line1Start, line1End, line2Start, line2End
      );
      
      if (intersection) {
        intersectionPoints.push(intersection);
      }
    }
  }
  
  return {
    intersects: intersectionPoints.length > 0,
    points: intersectionPoints
  };
};

/**
 * Check if two line segments intersect
 * @param {Object} line1Start - Start point of first line {lat, lng}
 * @param {Object} line1End - End point of first line {lat, lng}
 * @param {Object} line2Start - Start point of second line {lat, lng}
 * @param {Object} line2End - End point of second line {lat, lng}
 * @returns {Object|null} - Intersection point or null if no intersection
 */
const lineIntersection = (line1Start, line1End, line2Start, line2End) => {
  // Line 1 represented as a1x + b1y = c1
  const a1 = line1End.lat - line1Start.lat;
  const b1 = line1Start.lng - line1End.lng;
  const c1 = a1 * line1Start.lng + b1 * line1Start.lat;
  
  // Line 2 represented as a2x + b2y = c2
  const a2 = line2End.lat - line2Start.lat;
  const b2 = line2Start.lng - line2End.lng;
  const c2 = a2 * line2Start.lng + b2 * line2Start.lat;
  
  const determinant = a1 * b2 - a2 * b1;
  
  // If lines are parallel, no intersection
  if (determinant === 0) {
    return null;
  }
  
  // Calculate intersection point
  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;
  
  // Check if intersection point is on both line segments
  const onLine1 = isPointOnLineSegment(line1Start, line1End, { lat: y, lng: x });
  const onLine2 = isPointOnLineSegment(line2Start, line2End, { lat: y, lng: x });
  
  if (onLine1 && onLine2) {
    return { lat: y, lng: x };
  }
  
  return null;
};

/**
 * Check if a point is on a line segment
 * @param {Object} lineStart - Start point of line {lat, lng}
 * @param {Object} lineEnd - End point of line {lat, lng}
 * @param {Object} point - Point to check {lat, lng}
 * @returns {boolean} - True if point is on line segment
 */
const isPointOnLineSegment = (lineStart, lineEnd, point) => {
  // Check if point is within the bounding box of the line segment
  const withinBoundingBox = 
    point.lng >= Math.min(lineStart.lng, lineEnd.lng) &&
    point.lng <= Math.max(lineStart.lng, lineEnd.lng) &&
    point.lat >= Math.min(lineStart.lat, lineEnd.lat) &&
    point.lat <= Math.max(lineStart.lat, lineEnd.lat);
    
  return withinBoundingBox;
};

/**
 * Generate a unique ID for a parcel
 * @returns {string} - Unique ID
 */
export const generateParcelId = () => {
  return 'parcel_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
};

/**
 * Create a new parcel object
 * @param {string} name - Parcel name
 * @param {string} description - Metes and bounds description
 * @param {Array} coordinates - Array of coordinates
 * @param {Object} additionalData - Additional parcel data (segments, closure, etc.)
 * @param {Object} style - Visual styling options
 * @returns {Object} - Parcel object
 */
export const createParcel = (name, description, coordinates, additionalData = {}, style = {}) => {
  return {
    id: generateParcelId(),
    name: name || 'Unnamed Parcel',
    description: description || '',
    coordinates: coordinates || [],
    segments: additionalData.segments || [],
    isClosed: additionalData.isClosed !== undefined ? additionalData.isClosed : true,
    closingSuggestion: additionalData.closingSuggestion || null,
    plssData: additionalData.plssData || null,
    area: additionalData.area || calculateArea(coordinates),
    perimeter: additionalData.perimeter || calculatePerimeter(coordinates),
    style: {
      color: style.color || getRandomColor(),
      weight: style.weight || 2,
      opacity: style.opacity || 1,
      fillColor: style.fillColor || style.color || getRandomColor(),
      fillOpacity: style.fillOpacity || 0.2
    },
    metadata: {
      createdAt: Date.now(),
      source: 'manual',
      notes: '',
      tags: []
    }
  };
};

/**
 * Calculate the area of a parcel using Turf.js
 * @param {Array} coordinates - Array of coordinates
 * @returns {number} - Area in square feet
 */
const calculateArea = (coordinates) => {
  if (!coordinates || coordinates.length < 3) return 0;
  
  try {
    // Convert coordinates to GeoJSON format for Turf.js
    const points = coordinates.map(coord => [coord.lng, coord.lat]);
    // Close the polygon if not already closed
    if (points[0][0] !== points[points.length - 1][0] || 
        points[0][1] !== points[points.length - 1][1]) {
      points.push(points[0]);
    }
    
    const polygon = turf.polygon([points]);
    
    // Calculate area in square kilometers
    const areaKm2 = turf.area(polygon);
    
    // Convert to square feet
    return areaKm2 * 10.7639 * 1000; // 1 km² = 10,763,910.4 ft²
  } catch (error) {
    console.error('Error calculating area:', error);
    return 0;
  }
};

/**
 * Calculate the perimeter of a parcel using Turf.js
 * @param {Array} coordinates - Array of coordinates
 * @returns {number} - Perimeter in feet
 */
const calculatePerimeter = (coordinates) => {
  if (!coordinates || coordinates.length < 2) return 0;
  
  try {
    // Convert coordinates to GeoJSON format for Turf.js
    const points = coordinates.map(coord => [coord.lng, coord.lat]);
    // Close the polygon if not already closed
    if (points[0][0] !== points[points.length - 1][0] || 
        points[0][1] !== points[points.length - 1][1]) {
      points.push(points[0]);
    }
    
    const line = turf.lineString(points);
    
    // Calculate length in kilometers
    const lengthKm = turf.length(line);
    
    // Convert to feet
    return lengthKm * 3280.84; // 1 km = 3,280.84 ft
  } catch (error) {
    console.error('Error calculating perimeter:', error);
    return 0;
  }
};

/**
 * Generate a random color for parcel styling
 * @returns {string} - Hex color code
 */
const getRandomColor = () => {
  const colors = [
    '#3388ff', // Blue
    '#33a02c', // Green
    '#e31a1c', // Red
    '#ff7f00', // Orange
    '#6a3d9a', // Purple
    '#b15928', // Brown
    '#a6cee3', // Light Blue
    '#b2df8a', // Light Green
    '#fb9a99', // Light Red
    '#fdbf6f'  // Light Orange
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Serialize parcel data for storage
 * @param {Array} parcels - Array of parcel objects
 * @returns {string} - JSON string
 */
export const serializeParcels = (parcels) => {
  return JSON.stringify(parcels);
};

/**
 * Deserialize parcel data from storage
 * @param {string} data - JSON string
 * @returns {Array} - Array of parcel objects
 */
export const deserializeParcels = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error deserializing parcels:', error);
    return [];
  }
};

/**
 * Calculate the bounds that contain all parcels
 * @param {Array} parcels - Array of parcel objects
 * @returns {Object} - Bounds object with southwest and northeast corners
 */
export const calculateParcelsBounds = (parcels) => {
  if (!parcels || parcels.length === 0) {
    return null;
  }
  
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  
  parcels.forEach(parcel => {
    parcel.coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    });
  });
  
  return {
    southwest: { lat: minLat, lng: minLng },
    northeast: { lat: maxLat, lng: maxLng }
  };
};
