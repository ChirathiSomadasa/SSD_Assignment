import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DiseaseLocationsList.css'; // Import the CSS file


const DiseaseLocationsList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch disease locations from the backend
    useEffect(() => {
        const fetchLocations = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/disease_locations'); // Adjust the API endpoint if needed

            setLocations(response.data);  // Store fetched locations
            setLoading(false);
            console.log(setLocations);

        } catch (err) {
            console.error(err);
            setError(`Error fetching locations: ${err.message}`); // Display specific error message
            setLoading(false);
        }
        };

        fetchLocations();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (

        <div className="disease-locations-container">
            <h2>Disease Locations</h2>
            <ul className="disease-locations-list">
                {locations.map((location, index) => (
                    <li key={index} className="disease-location-item">
                        <strong className="disease-location-label">Disease :</strong> {location.disease}<br />
                        <strong className="disease-location-label">Category :</strong> {location.category}<br />
                        <strong className="disease-location-label">Location :</strong> {location.location}
                    </li>
                ))}
            </ul>
        </div>
        
    );
};

export default DiseaseLocationsList;
