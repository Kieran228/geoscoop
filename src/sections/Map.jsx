// import { MapContainer, TileLayer } from "react-leaflet";
// import 'leaflet/dist/leaflet.css';

// import { useState } from "react";

// const Map = () => {
// // Default Map location and Zoom
//   const defaultCenter = [37.7749, -122.4194];
//   const defaultZoom = 13;

//   // Clicked Location State
// //   const [clickedLocation, setClickedLocation] = useState(null);

//   return (
//     <div className="map-container">

//       <MapContainer
//         center={defaultCenter}
//         zoom={defaultZoom}
//         style={{
//           height: '100%',
//           width: '100%',
//         }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default Map;

import { useState, useEffect, useRef } from "react";
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMapEvents 
} from "react-leaflet";
import { Icon } from "leaflet";
import 'leaflet/dist/leaflet.css';
import axios from "axios";

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Location lookup component
const LocationLookup = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 1) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Using Nominatim API for geocoding (OpenStreetMap)
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&limit=5`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelectLocation = (location) => {
    onLocationSelect([parseFloat(location.lat), parseFloat(location.lon)], location.display_name);
    setSearchTerm("");
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for a location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      {isLoading && <div className="loading">Loading...</div>}
      
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelectLocation(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Map click handler component
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // Reverse geocoding to get location info
      axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => {
          onMapClick([lat, lng], response.data.display_name);
        })
        .catch(error => {
          console.error("Error fetching location info:", error);
          onMapClick([lat, lng], "Unknown location");
        });
    }
  });
  
  return null;
};

// Main Map component
const Map = () => {
  // Default Map location and Zoom
  const defaultCenter = [37.7749, -122.4194];
  const defaultZoom = 13;
  
  const [clickedLocation, setClickedLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState("");
  const mapRef = useRef(null);

  const handleMapClick = (coordinates, name) => {
    setClickedLocation(coordinates);
    setLocationInfo(name);
  };

  const handleLocationSelect = (coordinates, name) => {
    setClickedLocation(coordinates);
    setLocationInfo(name);
    
    // Pan map to selected location
    if (mapRef.current) {
      mapRef.current.setView(coordinates, 16);
    }
  };

  return (
    <div className="map-page">
      <LocationLookup onLocationSelect={handleLocationSelect} />
      
      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{
            height: '500px',
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
          }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapClickHandler onMapClick={handleMapClick} />
          
          {clickedLocation && (
            <Marker position={clickedLocation} icon={customIcon}>
              <Popup>
                <div>
                  <strong>Location Info:</strong><br />
                  {locationInfo}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      
      {clickedLocation && (
        <div className="location-info-panel">
          <h3>Selected Location</h3>
          <p>
            <strong>Coordinates:</strong> {clickedLocation[0].toFixed(6)}, {clickedLocation[1].toFixed(6)}
          </p>
          <p>
            <strong>Address:</strong> {locationInfo}
          </p>
        </div>
      )}
    </div>
  );
};

export default Map
