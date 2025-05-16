import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';

import { useState } from "react";

const Map = () => {
// Default Map location and Zoom
  const defaultCenter = [37.7749, -122.4194];
  const defaultZoom = 13;

  // Clicked Location State
//   const [clickedLocation, setClickedLocation] = useState(null);

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{
          height: '100%',
          width: '100%',
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

      </MapContainer>
    </div>
  );
};

export default Map;
