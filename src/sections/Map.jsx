// src/sections/Map.jsx (updating the display part)
{selectedLocation ? (
  <div className="space-y-4">
    <div>
      <p className="font-medium">Coordinates:</p>
      <p className="text-gray-700">Latitude: {selectedLocation.coordinates.lat.toFixed(6)}</p>
      <p className="text-gray-700">Longitude: {selectedLocation.coordinates.lng.toFixed(6)}</p>
    </div>
    
    {selectedLocation.error ? (
      <p className="text-red-500">{selectedLocation.error}</p>
    ) : (
      <>
        {selectedLocation.display_name && (
          <div>
            <p className="font-medium">Location:</p>
            <p className="text-gray-700">{selectedLocation.display_name}</p>
          </div>
        )}
        
        {selectedLocation.address && (
          <div>
            <p className="font-medium">Address Details:</p>
            <div className="space-y-1">
              {Object.entries(selectedLocation.address).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">{key}:</span>
                  <span className="text-sm text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}
  </div>
) : (
  <p className="text-gray-500 italic">Click on the map to see information about a location</p>
)}