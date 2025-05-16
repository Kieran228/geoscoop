// src/components/MapClickHandler.jsx
import { useMapEvents } from 'react-leaflet';

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      
      try {
        // Fetch location data from the Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        // Pass the location data to the parent component
        onLocationSelect({
          coordinates: { lat, lng },
          details: data,
          display_name: data.display_name,
          address: data.address
        });
      } catch (error) {
        console.error("Error fetching location data:", error);
        // If the API fails, still provide coordinates
        onLocationSelect({
          coordinates: { lat, lng },
          error: "Could not fetch location details"
        });
      }
    }
  });

  return null;
};

export default MapClickHandler;