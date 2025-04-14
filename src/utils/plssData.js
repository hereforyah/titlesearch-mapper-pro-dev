/**
 * PLSS (Public Land Survey System) data for Florida counties
 * This file provides mapping between PLSS references and geographic coordinates
 */

// Sample PLSS data for Florida counties
// In a production environment, this would be a comprehensive database
// Format: /SW,20,2S,19W -> Section 20, Township 2 South, Range 19 West, Southwest quarter
const plssData = {
  // Alachua County
  alachua: {
    // Section, Township, Range mapping to coordinates
    // Format: "S-T-R-Aliquot": {lat, lng}
    "20-2S-19W-SW": { lat: 29.7938, lng: -82.4944 },
    "15-3S-20W-NE": { lat: 29.7825, lng: -82.5123 },
    // Additional mappings would be added here
  },
  
  // Bay County
  bay: {
    "10-3S-15W-NW": { lat: 30.2690, lng: -85.6251 },
    "22-4S-14W-SE": { lat: 30.2510, lng: -85.5980 },
    // Additional mappings would be added here
  },
  
  // Brevard County
  brevard: {
    "5-24S-36E-NE": { lat: 28.2639, lng: -80.7214 },
    "12-25S-35E-SW": { lat: 28.2420, lng: -80.7350 },
    // Additional mappings would be added here
  },
  
  // Default fallback coordinates for each county
  // These are used when a specific PLSS reference isn't found
  countyDefaults: {
    alachua: { lat: 29.7938, lng: -82.4944 },
    baker: { lat: 30.3293, lng: -82.3018 },
    bay: { lat: 30.2690, lng: -85.6251 },
    bradford: { lat: 29.9724, lng: -82.1697 },
    brevard: { lat: 28.2639, lng: -80.7214 },
    broward: { lat: 26.1901, lng: -80.3659 },
    calhoun: { lat: 30.4033, lng: -85.1894 },
    charlotte: { lat: 26.9661, lng: -82.0784 },
    citrus: { lat: 28.8849, lng: -82.5186 },
    clay: { lat: 29.9944, lng: -81.7787 },
    collier: { lat: 26.1124, lng: -81.4051 },
    columbia: { lat: 30.2233, lng: -82.6179 },
    desoto: { lat: 27.1888, lng: -81.8273 },
    dixie: { lat: 29.6000, lng: -83.1568 },
    duval: { lat: 30.3501, lng: -81.6035 },
    escambia: { lat: 30.6389, lng: -87.3414 },
    flagler: { lat: 29.4086, lng: -81.2519 },
    franklin: { lat: 29.8336, lng: -84.8568 },
    gadsden: { lat: 30.5563, lng: -84.6479 },
    gilchrist: { lat: 29.7219, lng: -82.7973 },
    glades: { lat: 26.9847, lng: -81.1859 },
    gulf: { lat: 29.9324, lng: -85.2427 },
    hamilton: { lat: 30.4913, lng: -82.9479 },
    hardee: { lat: 27.4502, lng: -81.8224 },
    hendry: { lat: 26.5537, lng: -81.3765 },
    hernando: { lat: 28.5579, lng: -82.4753 },
    highlands: { lat: 27.3400, lng: -81.3400 },
    hillsborough: { lat: 27.9904, lng: -82.3018 },
    holmes: { lat: 30.8741, lng: -85.8077 },
    indianriver: { lat: 27.6948, lng: -80.5438 },
    jackson: { lat: 30.7151, lng: -85.2128 },
    jefferson: { lat: 30.4312, lng: -83.8897 },
    lafayette: { lat: 30.0241, lng: -83.2013 },
    lake: { lat: 28.7028, lng: -81.7787 },
    lee: { lat: 26.5537, lng: -81.8273 },
    leon: { lat: 30.4906, lng: -84.1857 },
    levy: { lat: 29.3179, lng: -82.7973 },
    liberty: { lat: 30.2339, lng: -84.8824 },
    madison: { lat: 30.4680, lng: -83.4701 },
    manatee: { lat: 27.4799, lng: -82.3452 },
    marion: { lat: 29.2788, lng: -82.1278 },
    martin: { lat: 27.0805, lng: -80.4104 },
    'miami-dade': { lat: 25.5516, lng: -80.6327 },
    monroe: { lat: 24.5557, lng: -81.7826 },
    nassau: { lat: 30.6190, lng: -81.7659 },
    okaloosa: { lat: 30.5773, lng: -86.6611 },
    okeechobee: { lat: 27.3462, lng: -80.8987 },
    orange: { lat: 28.4845, lng: -81.2518 },
    osceola: { lat: 28.0619, lng: -81.0818 },
    palmbeach: { lat: 26.6515, lng: -80.2767 },
    pasco: { lat: 28.3232, lng: -82.4319 },
    pinellas: { lat: 27.8764, lng: -82.7779 },
    polk: { lat: 27.9661, lng: -81.6900 },
    putnam: { lat: 29.6265, lng: -81.7787 },
    stjohns: { lat: 29.9719, lng: -81.4279 },
    stlucie: { lat: 27.3724, lng: -80.4420 },
    santarosa: { lat: 30.7690, lng: -86.9824 },
    sarasota: { lat: 27.1900, lng: -82.3452 },
    seminole: { lat: 28.7132, lng: -81.2078 },
    sumter: { lat: 28.7132, lng: -82.0784 },
    suwannee: { lat: 30.1926, lng: -82.9979 },
    taylor: { lat: 30.0993, lng: -83.6774 },
    union: { lat: 30.0354, lng: -82.3690 },
    volusia: { lat: 29.0280, lng: -81.0755 },
    wakulla: { lat: 30.0993, lng: -84.3866 },
    walton: { lat: 30.5644, lng: -86.1893 },
    washington: { lat: 30.5773, lng: -85.6613 }
  }
};

/**
 * Get coordinates for a PLSS reference in a specific county
 * @param {string} county - County name
 * @param {Object} plssReference - PLSS reference object
 * @returns {Object} - Coordinates {lat, lng}
 */
export const getCoordinatesFromPLSS = (county, plssReference) => {
  if (!county || !plssReference) {
    return null;
  }
  
  const countyData = plssData[county.toLowerCase()];
  if (!countyData) {
    // If county not found, use default Florida coordinates
    return plssData.countyDefaults.leon; // Default to Leon County (Tallahassee)
  }
  
  // Format the PLSS key
  const { section, township, range, aliquot } = plssReference;
  const plssKey = `${section}-${township}-${range}-${aliquot}`;
  
  // Look up the coordinates
  if (countyData[plssKey]) {
    return countyData[plssKey];
  }
  
  // If specific PLSS reference not found, use county default
  return plssData.countyDefaults[county.toLowerCase()];
};

/**
 * Parse a PLSS string into its components
 * @param {string} plssString - PLSS string in format /SW,20,2S,19W
 * @returns {Object|null} - Parsed PLSS object or null if invalid
 */
export const parsePLSSString = (plssString) => {
  if (!plssString) return null;
  
  // Regular expression to match PLSS format
  const plssRegex = /^\s*\/([NESW]{1,2}),(\d+),(\d+[NESW]),(\d+[NESW])/i;
  const match = plssString.match(plssRegex);
  
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

export default plssData;
