const axios = require('axios');
const WebSocket = require('ws');
// const Farmer = require('../../models/contact');
const DiseaseReport = require("../../models/contact"); // disease location when reporting   //const Contact = require("../models/contact");



// Initialize WebSocket
const ws = new WebSocket('ws://localhost:5001');




// Helper function to convert location names to coordinates
// const getCoordinatesForLocation = async (locationName) => {
//     const apiUrl = `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json&limit=1`;
//     try {
//         const response = await axios.get(apiUrl);
//         if (response.data.length > 0) {
//             const { lat, lon } = response.data[0];
//             return { lat: parseFloat(lat), lng: parseFloat(lon) };
//         }
//         return null;
//     } catch (error) {
//         console.error(`Error fetching coordinates for ${locationName}:`, error);
//         return null;
//     }
// };

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




// Compare locations and notify farmers
const compareLocations_Notify = async (req, res) => {
    try {
        const u_location = await axios.get('http://localhost:5001/api_loc/user_locations');
        const d_location = await axios.get('http://localhost:5001/api_loc/disease_location')


        const user_fetchLocations = u_location.data;
        const userCoordinates = await Promise.all(user_fetchLocations.map(async (userLocation) => {
            const coordinates = await getCoordinatesForLocation(userLocation.city);
            if (coordinates) {
                // return { ...location, coordinates };
                return { ...userLocation, userCoordinates: coordinates };
            }
            return null;
        }));


        const disease_fetchLocations = d_location.data;
        const diseaseCoordinates = await Promise.all(disease_fetchLocations.map(async (diseaseLocation) => {
            const coordinates = await getCoordinatesForLocation(diseaseLocation.location);
            if (coordinates) {
                // return { ...location, coordinates };
                return { ...diseaseLocation, diseaseCoordinates: coordinates };
            }
            return null;
        }));

        
        diseaseCoordinates.forEach(disease => {
            userCoordinates.forEach(user => {
                if (user && disease && areLocationsClose(disease.coordinates, user.coordinates)) {
                    sendWebNotification(`Disease reported near ${disease.location}`);
                    // updateMapWithDiseaseLocation(disease.coordinates);
                }
            });
        });
        

        console.log(sendWebNotification);
        res.status(200).json({ message: 'Notifications sent and map updated.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred.' });
    }
};





// Function to check if two locations are near each other
// const areLocationsClose = (loc1, loc2, threshold = 10) => {
//     const distance = Math.sqrt(Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2));
//     return distance < threshold; // Define proximity threshold
// };


// Function to check if two locations (in array format) are near each other
const areLocationsClose = (loc1, loc2, threshold = 10) => {
    // loc1 and loc2 are arrays: [lat, lon]
    const distance = Math.sqrt(Math.pow(loc1[0] - loc2[0], 2) + Math.pow(loc1[1] - loc2[1], 2));
    return distance < threshold; // Define proximity threshold
};


const sendWebNotification = (message) => {
    ws.send(JSON.stringify({ message }));
};



module.exports = {
    compareLocations_Notify
};
