// import { useState } from "react";
// import { useMapEvents } from "react-leaflet";

// const LocationMarker = () => {
//   const [position, setPosition] = useState(null);
//   const map = useMapEvents({
//     click() {
//       map.locate();
//     },
//     locationfound(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//     },
//   });

//   return position === null ? null : (
//     <Marker position={position}>
//       <Popup>You are here</Popup>
//     </Marker>
//   );
// };

// export default LocationMarker

// components/LocationMarker.jsx
import { useState } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })     

  return position === null ? null : (
    <Marker position={position}>
      <Popup>This is your current Location.</Popup>
    </Marker>
  );
};

export default LocationMarker;