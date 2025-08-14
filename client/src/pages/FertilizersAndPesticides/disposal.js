import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import houseImage from '../../images/fertilizers/house.png'; 
import currentLocationImage from '../../images/fertilizers/man.png'; 
import './Disposal.css';

// Define the house icon
const houseIcon = new L.Icon({
  iconUrl: houseImage, 
  iconSize: [70, 70], 
  iconAnchor: [15, 30], 
  popupAnchor: [0, -30] 
});

// Define the red marker icon for cities
const cityIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [0, -30] 
});

// Define the icon for the current location
const userIcon = new L.Icon({
  iconUrl: currentLocationImage, 
  iconSize: [50, 50], 
  iconAnchor: [25, 50], 
  popupAnchor: [0, -50] 
});

// Markers for Kurunegala
const kurunegalaMarkers = [
  { name: 'Malkaduwawa', coords: [7.4851, 80.3608] },
  { name: 'Mallawapitiya', coords: [7.4981, 80.3622] },
  { name: 'Gettwana', coords: [7.4934, 80.3752] },
  { name: 'Wariyapola', coords: [7.4781, 80.3092] },
  { name: 'Narammala', coords: [7.4081, 80.3385] },
  { name: 'Kuliyapitiya', coords: [7.4809, 80.3631] },
  { name: 'Mawathagama', coords: [7.5367, 80.4234] },
];

// Markers for Kandy
const kandyMarkers = [
  { name: 'Kandy Lake', coords: [7.2906, 80.6337] },
  { name: 'Temple of the Tooth', coords: [7.2931, 80.6329] },
  { name: 'Kandy City', coords: [7.2902, 80.6323] },
  { name: 'Gampola', coords: [7.1847, 80.3945] },
  { name: 'Katugasthota', coords: [7.2960, 80.5885] },
  { name: 'Akurana', coords: [7.2813, 80.5784] },
  { name: 'Peradeniya', coords: [7.2664, 80.5881] },
];

// Markers for Anuradhapura
const anuradhapuraMarkers = [
  { name: 'Kekirawa', coords: [8.3865, 80.6308] },
  { name: 'Medawachchiya', coords: [8.3311, 80.5911] },
  { name: 'Tambuttegama', coords: [8.2376, 80.6220] },
  { name: 'Eppawala', coords: [8.2971, 80.6848] },
];

// Markers for Colombo
const colomboMarkers = [
  { name: 'Maharagama', coords: [6.8950, 79.9736] },
  { name: 'Nugegoda', coords: [6.9272, 79.9753] },
  { name: 'Piliyandala', coords: [6.8871, 79.9756] },
  { name: 'Dehiwala', coords: [6.8655, 79.9764] },
  { name: 'Boralesgamuwa', coords: [6.8670, 79.9864] },
];

// Markers for Hambantota
const hambantotaMarkers = [
  { name: 'Tangalla', coords: [6.0282, 80.7906] },
  { name: 'Beliatta', coords: [6.0240, 80.8725] },
  { name: 'Tissamaharamaya', coords: [6.2964, 81.2285] },
  { name: 'Ambalantota', coords: [6.0146, 81.0415] },
];

// Markers for Ampara
const amparaMarkers = [
  { name: 'Akkarapattu', coords: [7.2530, 81.6708] },
  { name: 'Kalmunai', coords: [7.4230, 81.8172] },
  { name: 'Sainthamaruthu', coords: [7.4083, 81.8235] },
];

// Markers for Gampaha
const gampahaMarkers = [
  { name: 'Negombo', coords: [7.2114, 79.8398] },
  { name: 'Kadawatha', coords: [6.9807, 79.9745] },
  { name: 'Kiribathgoda', coords: [7.0256, 79.9738] },
  { name: 'Wattala', coords: [6.9821, 79.9660] },
];

// Markers for Polonnaruwa
const polonnaruwaMarkers = [
  { name: 'Medirigiriya', coords: [7.9633, 81.0800] },
  { name: 'Higurakgoda', coords: [7.8377, 81.1054] },
  { name: 'Kaduruwela', coords: [7.9432, 81.0380] },
];


function Disposal() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearestMarker, setNearestMarker] = useState(null);
  const [distance, setDistance] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showCurrentLocation, setShowCurrentLocation] = useState(false); // New state for current location visibility

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query) {
      alert('Please enter a province or a city.');
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`);
      const data = await response.json();

      if (data.length === 0) {
        alert('No locations found. Please try different inputs.');
      } else {
        setLocations(data.map(item => ({
          name: item.display_name,
          coords: [item.lat, item.lon],
          province: item.address ? item.address.state || item.address.province || '' : '',
        })));
        setShowMarkers(true); // Show markers when search is successful
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation([latitude, longitude]);
        setShowCurrentLocation(true); // Show current location marker when button is clicked
      });
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation && selectedLocation) {
      let relevantMarkers = [];
  
      // Determine relevant markers based on selected location
      if (selectedLocation.name.toLowerCase().includes('kurunegala')) {
        relevantMarkers = kurunegalaMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('kandy')) {
        relevantMarkers = kandyMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('anuradhapura')) {
        relevantMarkers = anuradhapuraMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('colombo')) {
        relevantMarkers = colomboMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('hambantota')) {
        relevantMarkers = hambantotaMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('ampara')) {
        relevantMarkers = amparaMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('gampaha')) {
        relevantMarkers = gampahaMarkers;
      } else if (selectedLocation.name.toLowerCase().includes('polonnaruwa')) {
        relevantMarkers = polonnaruwaMarkers;
      }
  
      if (relevantMarkers.length > 0) {
        const nearest = relevantMarkers.reduce((prev, curr) => {
          const prevDistance = calculateDistance(currentLocation, prev.coords);
          const currDistance = calculateDistance(currentLocation, curr.coords);
          return currDistance < prevDistance ? curr : prev;
        });
        setNearestMarker(nearest);
        setDistance(calculateDistance(currentLocation, nearest.coords));
      }
    }
  }, [currentLocation, selectedLocation]);
  

  const calculateDistance = (coords1, coords2) => {
    const R = 6371e3; // metres
    const φ1 = coords1[0] * Math.PI / 180; // φ in radians
    const φ2 = coords2[0] * Math.PI / 180; // φ in radians
    const Δφ = (coords2[0] - coords1[0]) * Math.PI / 180;
    const Δλ = (coords2[1] - coords1[1]) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  };

  return (
    <div className='Disposal-container'>
       <div className="info-message">
  <p><strong>Did you know?</strong> The National Environmental Act mandates responsible waste management. Violations can result in fines, legal action, or even closure of operations.</p>
</div>
      <h1 className="d-topic">Your Guide to Nearby Waste Disposal Facilities</h1>
      <div className="disposal-description">
      <p>Discover the most convenient disposal sites near you with our interactive map. Simply enter your city or province, and we'll help you locate the closest waste disposal facilities. Our platform ensures you have easy access to safe and responsible disposal options. Take a step towards a cleaner environment today!</p>
     

      </div>
      
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Enter province or city" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
        />
        <button className='disposal-submit' type="submit">Search</button>
      </form>

      <div className="button-container1">
        {locations.map((location, index) => (
          <button key={index} onClick={() => handleLocationSelect(location)}>
            {location.name}
          </button>
        ))}
      </div>

      <MapContainer center={[7.2906, 80.6328]} zoom={8} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

// Kurunegala markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('kurunegala') && (
  kurunegalaMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Kandy markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('kandy') && (
  kandyMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Anuradhapura markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('anuradhapura') && (
  anuradhapuraMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Colombo markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('colombo') && (
  colomboMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Hambantota markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('hambantota') && (
  hambantotaMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Ampara markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('ampara') && (
  amparaMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Gampaha markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('gampaha') && (
  gampahaMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}

// Polonnaruwa markers
{showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('polonnaruwa') && (
  polonnaruwaMarkers.map((marker) => (
    <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
      <Popup>{marker.name}</Popup>
    </Marker>
  ))
)}


        {showMarkers && selectedLocation && selectedLocation.name.toLowerCase().includes('kandy') && (
          kandyMarkers.map((marker) => (
            <Marker key={marker.name} position={marker.coords} icon={houseIcon}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))
        )}

        {showCurrentLocation && currentLocation && (
          <Marker position={currentLocation} icon={userIcon}>
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
        

        {showCurrentLocation && currentLocation && nearestMarker && (
          <Polyline positions={[currentLocation, nearestMarker.coords]} color="blue" />
        )}
      </MapContainer>
      
      <div>
        <h3 className="current-location" onClick={getCurrentLocation}>Location Details</h3>
        {currentLocation && nearestMarker && (
          <div>
            <p>Nearest Location: {nearestMarker.name}</p>
            <p>Distance: {(distance / 1000).toFixed(2)} km</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Disposal;
