/**
 * Utility functions for parsing metes and bounds descriptions
 * Enhanced to support various formats, curves, and closure detection
 */
import * as turf from '@turf/turf';

/**
 * Parse a metes and bounds description into an array of coordinates
 * @param {string} description - The metes and bounds description
 * @param {Object} startPoint - Optional starting point {lat: number, lng: number}
 * @returns {Object} - Parsed result with coordinates, validity, area, perimeter, and errors
 */

console.log("🚀 Running parseMetesAndBounds...");


export const parseMetesAndBounds = (description, startPoint = { lat: 0, lng: 0 }) => {
  try {
    // Check for PLSS notation at the beginning
    const plssData = extractPLSSData(description);
    
    // Normalize the description
    const normalizedDescription = normalizeDescription(description);
    
    console.log("🧼 Normalized description:", normalizedDescription);

    // Extract individual calls
    const { calls, errors: parseErrors } = extractCalls(normalizedDescription);

    console.log("📜 Extracted Calls:", calls);
    console.log("🐞 Parse Errors:", parseErrors);

    
    if (calls.length === 0) {
      return {
        coordinates: [],
        isValid: false,
        area: 0,
        perimeter: 0,
        errors: [...parseErrors, 'No valid metes and bounds calls found in the description']
      };
    }
    
    // Calculate coordinates
    const { coordinates, segments } = calculateCoordinates(calls, startPoint);
    console.log("📍 Calculated coordinates:", coordinates);

    
    // Validate the parcel and check for closure
    const validation = validateParcel(coordinates);
    
    // Calculate area and perimeter
    const area = calculateArea(coordinates);
    const perimeter = calculatePerimeter(coordinates);
    
    // Generate closing suggestion if needed
    let closingSuggestion = null;
    if (!validation.isClosed && coordinates.length > 1) {
      closingSuggestion = generateClosingSuggestion(coordinates[0], coordinates[coordinates.length - 1]);
    }
    
    return {
      coordinates,
      segments,
      isValid: validation.isValid,
      isClosed: validation.isClosed,
      area,
      perimeter,
      errors: [...parseErrors, ...validation.errors],
      closingSuggestion,
      plssData
    };
  } catch (error) {
    console.error("Error parsing metes and bounds:", error);
    return {
      coordinates: [],
      segments: [],
      isValid: false,
      isClosed: false,
      area: 0,
      perimeter: 0,
      errors: [error.message],
      closingSuggestion: null,
      plssData: null
    };
  }
};

/**
 * Extract PLSS (Public Land Survey System) data from description
 * Format: /SW,20,2S,19W
 * @param {string} description - The raw description
 * @returns {Object|null} - PLSS data or null if not found
 */
const extractPLSSData = (description) => {
  // Regular expression to match PLSS format
  const plssRegex = /^\s*\/([NESW]{1,2}),(\d+),(\d+[NESW]),(\d+[NESW])/i;
  const match = description.match(plssRegex);
  
  if (match) {
    return {
      aliquot: match[1].toUpperCase(),
      section: parseInt(match[2], 10),
      township: match[3].toUpperCase(),
      range: match[4].toUpperCase(),
      raw: match[0]
    };
  }
  
  return null;
};

/**
 * Normalize a metes and bounds description
 * @param {string} description - The raw description
 * @returns {string} - Normalized description
 */
const normalizeDescription = (description) => {
  // Remove PLSS notation if present
  let normalized = description.replace(/^\s*\/[NESW]{1,2},\d+,\d+[NESW],\d+[NESW]/i, '');
  
  // Remove extra whitespace
  normalized = normalized.trim().replace(/[ \t]+/g, ' ');
  
  // Convert to lowercase for case-insensitive processing
  normalized = normalized.toLowerCase();
  
  // Replace common abbreviations and ensure spacing
  normalized = normalized
    .replace(/([ns])(\d+)/gi, '$1 $2')
    .replace(/([ew])(\d+)/gi, '$1 $2')
    .replace(/([ns])([ew])/gi, '$1 $2')
    .replace(/([ew])([ns])/gi, '$1 $2')
    .replace(/(\d+)([nsew])/gi, '$1 $2');
    
  return normalized;
};

/**
 * Extract individual calls from a normalized description
 * @param {string} description - Normalized description
 * @returns {Object} - Object containing array of parsed calls and any errors
 */
const extractCalls = (description) => {
  const calls = [];
  const errors = [];
  const lines = description.split(/[;\n]/).filter(line => line.trim());

  console.log("🧾 Raw line count:", lines.length);
  console.log("🔍 Raw lines:", lines);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    try {
      // Check if line contains curve description
      if (line.includes('curve')) {
        const curveCall = parseCurveCall(line);
        if (curveCall) {
          calls.push(curveCall);
          continue;
        }
      }
      
      // Try to parse as standard bearing and distance
      const bearingCall = parseBearingCall(line);
      if (bearingCall) {
        calls.push(bearingCall);
        continue;
      }
      
      // If we get here, the line couldn't be parsed
      errors.push(`Line ${i + 1}: "${line}" could not be parsed as a valid call`);
    } catch (error) {
      errors.push(`Error parsing line ${i + 1}: ${error.message}`);
    }
  }
  
  return { calls, errors };
};

/**
 * Parse a curve description
 * @param {string} line - Line containing curve description
 * @returns {Object|null} - Parsed curve call or null if invalid
 */
const parseCurveCall = (line) => {
  // Regular expression to match curve format
  // curve left radius 606.00 arc 226.59 delta 21.2524 chord N33.4731W 225.27
  const curveRegex = /curve\s+(left|right)\s+radius\s+([\d.]+)\s+arc\s+([\d.]+)\s+delta\s+([\d.]+)\s+chord\s+([nsew])\s*([\d.]+)\s*([nsew])\s*([\d.]+)/i;
  
  const match = line.match(curveRegex);
  if (!match) return null;
  
  return {
    type: 'curve',
    direction: match[1].toLowerCase(),
    radius: parseFloat(match[2]),
    arc: parseFloat(match[3]),
    delta: parseFloat(match[4]),
    chordDirection: {
      start: match[5].toLowerCase(),
      angle: parseFloat(match[6]),
      end: match[7].toLowerCase()
    },
    chordLength: parseFloat(match[8])
  };
};

/**
 * Parse a standard bearing and distance call
 * @param {string} line - Line containing bearing and distance
 * @returns {Object|null} - Parsed bearing call or null if invalid
 */
const parseBearingCall = (line) => {
  // Try different formats
  
  // Format: N45.30.20E 150.5 (degrees.minutes.seconds)
  const dmsRegex = /([nsew])\s*([\d.]+)\.(\d+)\.(\d+)\s*([nsew])\s*([\d.]+)/i;
  let match = line.match(dmsRegex);
  if (match) {
    return {
      type: 'bearing',
      direction: {
        start: match[1].toLowerCase(),
        end: match[5].toLowerCase()
      },
      angle: {
        degrees: parseFloat(match[2]),
        minutes: parseFloat(match[3]),
        seconds: parseFloat(match[4])
      },
      distance: parseFloat(match[6])
    };
  }
  
  // Format: N45.30E 150.5 (degrees.minutes)
  const dmRegex = /([nsew])\s*([\d.]+)\.(\d+)\s*([nsew])\s*([\d.]+)/i;
  match = line.match(dmRegex);
  if (match) {
    return {
      type: 'bearing',
      direction: {
        start: match[1].toLowerCase(),
        end: match[4].toLowerCase()
      },
      angle: {
        degrees: parseFloat(match[2]),
        minutes: parseFloat(match[3]),
        seconds: 0
      },
      distance: parseFloat(match[5])
    };
  }
  
  // Format: N45E 150.5 (degrees only)
  const degRegex = /([nsew])\s*([\d.]+)\s*([nsew])\s*([\d.]+)/i;
  match = line.match(degRegex);
  if (match) {
    return {
      type: 'bearing',
      direction: {
        start: match[1].toLowerCase(),
        end: match[3].toLowerCase()
      },
      angle: {
        degrees: parseFloat(match[2]),
        minutes: 0,
        seconds: 0
      },
      distance: parseFloat(match[4])
    };
  }
  
  // Format: N 45 E 150.5 (with spaces)
  const spacedRegex = /([nsew])\s+(\d+)\s+([nsew])\s+([\d.]+)/i;
  match = line.match(spacedRegex);
  if (match) {
    return {
      type: 'bearing',
      direction: {
        start: match[1].toLowerCase(),
        end: match[3].toLowerCase()
      },
      angle: {
        degrees: parseFloat(match[2]),
        minutes: 0,
        seconds: 0
      },
      distance: parseFloat(match[4])
    };
  }
  
  return null;
};

/**
 * Convert degrees, minutes, seconds to decimal degrees
 * @param {Object} angle - Angle in DMS format
 * @returns {number} - Decimal degrees
 */
const dmsToDecimal = (angle) => {
  const { degrees, minutes, seconds } = angle;
  return degrees + (minutes / 60) + (seconds / 3600);
};

/**
 * Calculate bearing in degrees from cardinal directions and angle
 * @param {Object} direction - Direction with start and end cardinal points
 * @param {number} decimalAngle - Angle in decimal degrees
 * @returns {number} - Bearing in degrees (0-360)
 */
const calculateBearing = (direction, decimalAngle) => {
  const { start, end } = direction;
  
  if (start === 'n' && end === 'e') {
    return decimalAngle;
  } else if (start === 's' && end === 'e') {
    return 180 - decimalAngle;
  } else if (start === 's' && end === 'w') {
    return 180 + decimalAngle;
  } else if (start === 'n' && end === 'w') {
    return 360 - decimalAngle;
  } else if (start === 'e' && end === 'n') {
    return 90 - decimalAngle;
  } else if (start === 'e' && end === 's') {
    return 90 + decimalAngle;
  } else if (start === 'w' && end === 's') {
    return 270 - decimalAngle;
  } else if (start === 'w' && end === 'n') {
    return 270 + decimalAngle;
  }
  
  // Default case
  return decimalAngle;
};

/**
 * Calculate coordinates from parsed calls using Turf.js for accuracy
 * @param {Array} calls - Array of parsed calls
 * @param {Object} startPoint - Starting point {lat: number, lng: number}
 * @returns {Object} - Object containing array of coordinates and segments
 */
const calculateCoordinates = (calls, startPoint) => {
  const coordinates = [{ ...startPoint }];
  const segments = [];
  let currentPoint = { ...startPoint };
  
  console.log("🧪 Creating start point with lat/lng:", currentPoint.lat, currentPoint.lng);

  // Convert to GeoJSON point for Turf.js
  let currentGeoPoint = turf.point([currentPoint.lng, currentPoint.lat]);
  
  calls.forEach((call, index) => {
    if (call.type === 'bearing') {
      const { direction, angle, distance } = call;
      
      // Convert angle to decimal
      const decimalAngle = dmsToDecimal(angle);
      
      // Determine the bearing based on the directions
      const bearing = calculateBearing(direction, decimalAngle);
      
      // Calculate new point using Turf.js for accuracy
      // distance is in feet, convert to kilometers for Turf
      const distanceKm = distance * 0.0003048; // feet to kilometers
      const destination = turf.destination(currentGeoPoint, distanceKm, bearing);
      
      // Extract coordinates
      const [newLng, newLat] = destination.geometry.coordinates;
      currentPoint = { lat: newLat, lng: newLng };
      currentGeoPoint = destination;
      
      coordinates.push({ ...currentPoint });
      
      // Add segment info
      segments.push({
        type: 'LineString',
        index,
        start: coordinates[coordinates.length - 2],
        end: currentPoint,
        bearing,
        distance,
        properties: {
          type: 'bearing',
          bearing: bearing,
          distance: distance,
          description: `${direction.start.toUpperCase()}${decimalAngle}${direction.end.toUpperCase()} ${distance}'`
        }
      });
    } else if (call.type === 'curve') {
      const { direction, radius, arc, delta, chordDirection, chordLength } = call;
      
      // Calculate the bearing of the chord
      const chordDecimalAngle = dmsToDecimal({
        degrees: chordDirection.angle,
        minutes: 0,
        seconds: 0
      });
      
      const chordBearing = calculateBearing({
        start: chordDirection.start,
        end: chordDirection.end
      }, chordDecimalAngle);
      
      // Calculate center of the curve
      // For a curve, we need to find the center point based on the radius and direction
      const isClockwise = direction === 'right';
      const radiusKm = radius * 0.0003048; // feet to kilometers
      
      // Calculate perpendicular bearing to chord
      const perpendicularBearing = (chordBearing + (isClockwise ? 90 : -90)) % 360;
      
      // Calculate distance from chord to center
      // Using the formula: distance = radius * sin(delta/2) / sin(90)
      const deltaRad = (delta * Math.PI) / 180;
      const distanceToCenter = radius * Math.sin(deltaRad / 2);
      const distanceToCenterKm = distanceToCenter * 0.0003048; // feet to kilometers
      
      // Find midpoint of chord
      const chordDistanceKm = chordLength * 0.0003048 / 2; // half chord length in km
      const chordMidpoint = turf.destination(currentGeoPoint, chordDistanceKm, chordBearing);
      
      // Find center point
      const centerPoint = turf.destination(chordMidpoint, distanceToCenterKm, perpendicularBearing);
      
      // Calculate start and end bearings for the arc
      const bearingToStart = turf.bearing(centerPoint, currentGeoPoint);
      
      // Calculate the end point of the arc
      const arcAngleRad = (delta * Math.PI) / 180;
      const endBearing = bearingToStart + (isClockwise ? arcAngleRad : -arcAngleRad) * (180 / Math.PI);
      
      // Calculate the end point
      const endPoint = turf.destination(centerPoint, radiusKm, endBearing);
      const [newLng, newLat] = endPoint.geometry.coordinates;
      currentPoint = { lat: newLat, lng: newLng };
      currentGeoPoint = endPoint;
      
      coordinates.push({ ...currentPoint });
      
      // Generate points along the curve for visualization
      const curvePoints = [];
      const steps = Math.max(10, Math.ceil(delta / 2)); // More points for larger curves
      
      for (let i = 0; i <= steps; i++) {
        const stepBearing = bearingToStart + (isClockwise ? 1 : -1) * (i / steps) * arcAngleRad * (180 / Math.PI);
        const stepPoint = turf.destination(centerPoint, radiusKm, stepBearing);
        const [stepLng, stepLat] = stepPoint.geometry.coordinates;
        curvePoints.push({ lat: stepLat, lng: stepLng });
      }
      
      // Add segment info
      segments.push({
        type: 'Curve',
        index,
        start: coordinates[coordinates.length - 2],
        end: currentPoint,
        center: { 
          lat: centerPoint.geometry.coordinates[1], 
          lng: centerPoint.geometry.coordinates[0] 
        },
        radius,
        delta,
        direction,
        points: curvePoints,
        properties: {
          type: 'curve',
          direction: direction,
          radius: radius,
          arc: arc,
          delta: delta,
          description: `curve ${direction} radius ${radius}' arc ${arc}' delta ${delta}°`
        }
      });
    }
  });
  
  return { coordinates, segments };
};

/**
 * Validate a parcel
 * @param {Array} coordinates - Array of coordinates
 * @returns {Object} - Validation result with isValid flag, isClosed flag, and errors
 */
const validateParcel = (coordinates) => {
  const errors = [];
  let isClosed = false;
  
  // Check if we have enough points
  if (coordinates.length < 3) {
    errors.push('Not enough points to form a valid parcel. At least 3 points are required.');
    return { isValid: false, isClosed, errors };
  }
  
  // Check if parcel is closed (first and last points are close enough)
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  
  // Use Turf.js to calculate distance between first and last points
  const firstPoint = turf.point([first.lng, first.lat]);
  const lastPoint = turf.point([last.lng, last.lat]);
  const distanceKm = turf.distance(firstPoint, lastPoint);
  
  // Convert to feet for comparison
  const distanceFeet = distanceKm * 3280.84;
  
  // Tolerance of 1 foot
  const tolerance = 1;
  isClosed = distanceFeet < tolerance;
  
  if (!isClosed) {
    errors.push('Parcel is not closed. The last point does not connect to the starting point.');
  }
  
  // Check for self-intersections (simplified check)
  // A complete check would require more complex algorithms
  
  return {
    isValid: errors.length === 0,
    isClosed,
    errors
  };
};

/**
 * Generate a closing suggestion for an open parcel
 * @param {Object} startPoint - Starting point {lat: number, lng: number}
 * @param {Object} endPoint - Ending point {lat: number, lng: number}
 * @returns {Object} - Closing suggestion with bearing and distance
 */
const generateClosingSuggestion = (startPoint, endPoint) => {
  // Use Turf.js to calculate bearing and distance
  const start = turf.point([startPoint.lng, startPoint.lat]);
  const end = turf.point([endPoint.lng, endPoint.lat]);
  
  const bearing = turf.bearing(end, start);
  const distanceKm = turf.distance(end, start);
  const distanceFeet = distanceKm * 3280.84;
  
  // Convert bearing to cardinal format
  const cardinalBearing = bearingToCardinal(bearing);
  
  return {
    bearing,
    cardinalBearing,
    distance: distanceFeet,
    description: `${cardinalBearing} ${distanceFeet.toFixed(2)}'`
  };
};

/**
 * Convert decimal bearing to cardinal format (e.g., N45.30E)
 * @param {number} bearing - Bearing in degrees (0-360)
 * @returns {string} - Cardinal bearing
 */
const bearingToCardinal = (bearing) => {
  // Normalize bearing to 0-360
  let normalizedBearing = (bearing + 360) % 360;
  
  let cardinal = '';
  let angle = 0;
  
  if (normalizedBearing >= 0 && normalizedBearing < 90) {
    cardinal = 'N';
    angle = normalizedBearing;
    cardinal += angle.toFixed(4) + 'E';
  } else if (normalizedBearing >= 90 && normalizedBearing < 180) {
    cardinal = 'S';
    angle = 180 - normalizedBearing;
    cardinal += angle.toFixed(4) + 'E';
  } else if (normalizedBearing >= 180 && normalizedBearing < 270) {
    cardinal = 'S';
    angle = normalizedBearing - 180;
    cardinal += angle.toFixed(4) + 'W';
  } else {
    cardinal = 'N';
    angle = 360 - normalizedBearing;
    cardinal += angle.toFixed(4) + 'W';
  }
  
  return cardinal;
};

/**
 * Calculate the area of a parcel using Turf.js
 * @param {Array} coordinates - Array of coordinates
 * @returns {number} - Area in square feet
 */
const calculateArea = (coordinates) => {
  if (coordinates.length < 3) return 0;
  
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
};

/**
 * Calculate the perimeter of a parcel using Turf.js
 * @param {Array} coordinates - Array of coordinates
 * @returns {number} - Perimeter in feet
 */
const calculatePerimeter = (coordinates) => {
  if (coordinates.length < 2) return 0;
  
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
};

/**
 * Extract metes and bounds from a paragraph of text
 * @param {string} text - The text to parse
 * @returns {string} - Extracted metes and bounds description
 */
export const extractMetesAndBoundsFromText = (text) => {
  // This is a simplified extraction that looks for patterns
  // A more robust solution would use NLP techniques
  
  // Look for common starting phrases
  const startPhrases = [
    'BEGINNING AT',
    'COMMENCING AT',
    'STARTING AT',
    'POINT OF BEGINNING'
  ];
  
  let extractedText = text;
  
  // Try to find a starting point
  for (const phrase of startPhrases) {
    const index = text.toUpperCase().indexOf(phrase);
    if (index !== -1) {
      extractedText = text.substring(index);
      break;
    }
  }
  
  // Try to find an ending point
  const endPhrases = [
    'POINT OF BEGINNING',
    'PLACE OF BEGINNING',
    'CONTAINING',
    'SUBJECT TO'
  ];
  
  for (const phrase of endPhrases) {
    const index = extractedText.toUpperCase().indexOf(phrase);
    if (index !== -1 && index > 0) {
      extractedText = extractedText.substring(0, index + phrase.length);
      break;
    }
  }
  
  return extractedText;
};
