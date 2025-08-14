import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

import DiseaseLocationsList from './DiseaseLocationsList';


// Fix for missing marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;



L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});



// Custom component to add heat layer
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const heat = L.heatLayer(points, {
        radius: 20,   // Adjust the radius for the heatmap spots
        // blur: 0,
        maxZoom: 0,
        gradient: {
          // 0.1: 'blue',
          0.4: 'green',
          0.5: 'yellow',
          1: 'red'
        }
      }).addTo(map);

      return () => {
        map.removeLayer(heat);  // Clean up the layer on unmount or change
      };
    }
  }, [map, points]);

  return null;
}



// DB location visualized in Map
function Map() {
  const position = [7.945, 80.821]; // Approximate center of Sri Lanka
  // const position = [7.2906, 80.6337]; // Centered on Kandy, Sri Lanka

  const [locations, setLocations] = useState([]);


  // Helper function to fetch coordinates for a location name
  const getCoordinatesForLocation = async (locationName) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${locationName}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };


  // Fetch disease locations from the backend and convert names to coordinates
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/disease_loc'); // Adjust the API endpoint if needed
        const fetchedLocations = response.data;

        // Convert each location name to coordinates
        const locationsWithCoordinates = await Promise.all(fetchedLocations.map(async (location) => {
          const coordinates = await getCoordinatesForLocation(location.location);
          if (coordinates) {
            // return { ...location, coordinates };
            return { ...location, coordinates}; // Add intensity for the heatmap //  , intensity: location.intensity || 0.5 
          }
          return null;
        }));

        // Filter out any locations that couldn't be geocoded
        setLocations(locationsWithCoordinates.filter(loc => loc !== null));
        console.log('Fetched and geocoded locations:', locationsWithCoordinates);
      } catch (err) {
        console.error('Error fetching disease locations:', err);
      }
    };

    fetchLocations();
  }, []); // Empty dependency array ensures this runs once when the component mounts


  const heatmapPoints = locations.map(location => [...location.coordinates]);  //, location.intensity


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', padding: '50px 40px 40px 40px' }}>
      <MapContainer center={position} zoom={8} style={{ height: '730px', width: '800px', border: '2px solid #ccc', borderRadius: '10px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Add markers dynamically based on fetched data */}
        {locations.map((location, index) => (
          <Marker key={index} position={location.coordinates}>
            <Popup>
              {location.location} <br/>
              {location.disease} - {location.category}
            </Popup>
          </Marker>
        ))}


        {/* Add Heatmap Layer */}
        <HeatmapLayer points={heatmapPoints} />

      </MapContainer>

      <div style={{ marginLeft: '20px', border: '2px solid #ccc', width: '500px', height: '730px', overflowY: 'auto', borderRadius: '10px' }}>
        <DiseaseLocationsList />
      </div>

    </div>
  );
}

export default Map;
