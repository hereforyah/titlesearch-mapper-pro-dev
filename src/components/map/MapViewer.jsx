import React from "react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import ZoomToCounty from "./ZoomToCounty";
import ZoomToPlot from "./ZoomToPlot";

const colors = ["#1d4ed8", "#059669", "#f59e0b", "#dc2626", "#7c3aed"];

export default function MapViewer({ selectedCounty, plots = [] }) {
  const latestPlot = plots.length > 0 ? plots[plots.length - 1] : null;

  return (
    <MapContainer
      center={[28.1, -82.3]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🧭 Only one zoom logic should run */}
      {latestPlot?.coordinates?.length > 0 ? (
        <ZoomToPlot latestPlot={latestPlot} />
      ) : (
        selectedCounty && <ZoomToCounty selectedCounty={selectedCounty} />
      )}

      {/* 🔷 Draw Plots */}
      {plots.map((plot, index) => {
        if (!plot.coordinates || plot.coordinates.length === 0) return null;

        return (
          <Polygon
            key={index}
            positions={plot.coordinates.map((c) => [c.lat, c.lng])}
            pathOptions={{ color: colors[index % colors.length], weight: 3 }}
          >
            <Tooltip sticky>
              <span>Plot {index + 1}</span>
            </Tooltip>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}
