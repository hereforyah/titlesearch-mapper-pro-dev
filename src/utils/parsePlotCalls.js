// src/utils/parsePlotCalls.js

export function parsePlotCalls(input) {
    const lines = input.split("\n").map(line => line.trim()).filter(Boolean);
  
    const parsedCalls = lines.map(line => {
      // Example parser, extend later!
      const directionDistanceMatch = line.match(/^([NSEW\d\.\-/]+)\s+([\d\.]+)$/i);
      const plssMatch = line.match(/^\/([A-Z]+),(\d+),(\d+[NS]),(\d+[EW])$/i);
  
      if (plssMatch) {
        const [, direction, section, township, range] = plssMatch;
        return { type: "PLSS", direction, section, township, range };
      }
  
      if (directionDistanceMatch) {
        const [, bearing, distance] = directionDistanceMatch;
        return { type: "BearingDistance", bearing, distance: parseFloat(distance) };
      }
  
      return { type: "Unknown", raw: line };
    });
  
    return parsedCalls;
  }
  