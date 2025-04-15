// src/components/map/ZoomToPlot.jsx

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as turf from "@turf/turf";

export default function ZoomToPlot({ latestPlot }) {
  const map = useMap();

  useEffect(() => {
    if (!latestPlot || !latestPlot.coordinates || latestPlot.coordinates.length === 0) return;

    const coords = latestPlot.coordinates.map(coord => [coord.lng, coord.lat]);

    // Close the polygon if not closed
    if (coords.length > 1 && (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1])) {
      coords.push(coords[0]);
    }

    try {
      const polygon = turf.polygon([coords]);
      const bounds = turf.bbox(polygon); // [minX, minY, maxX, maxY]
      const leafletBounds = [
        [bounds[1], bounds[0]], // southwest
        [bounds[3], bounds[2]], // northeast
      ];
      console.log("📐 Zooming to plot bounds:", leafletBounds);
      console.log("📐 Zooming to plot bounds:", leafletBounds);
    setTimeout(() => {
      map.fitBounds(leafletBounds, { padding: [50, 50] });
    }, 100);
    } catch (err) {
      console.warn("⚠️ Could not compute bounds for plot:", err.message);
    }
  }, [latestPlot, map]);

  return null;
}