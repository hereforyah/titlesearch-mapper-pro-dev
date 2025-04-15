// src/utils/detectCountyFromPlss.js

import plssToCountyMap from "./plssToCountyMap";

/**
 * Extracts township and range from PLSS text like: /SW,20,2S,19W
 * Then looks it up to return the most likely county
 */
export default function detectCountyFromPlss(plotText = "") {
  const plssRegex = /\/[A-Z]+,\s*\d+,\s*(\d+[NS]),\s*(\d+[EW])/i;
  const match = plotText.match(plssRegex);

  if (!match) return null;

  const township = match[1].toUpperCase();
  const range = match[2].toUpperCase();
  const key = `${township} ${range}`;

  const county = plssToCountyMap[key];
  return county || null;
}
