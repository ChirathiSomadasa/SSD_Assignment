import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './ProblemForm.css';
import { useAuthEmail, useAuthPassword } from '../../auth';

// Function to calculate distance between two coordinates using the Haversine formula
const haversineDistance = (coords1, coords2) => {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const R = 6371; // Radius of the Earth in kilometers

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

function AddProblem() {
    const navigate = useNavigate();
    const [contactData, setContactData] = useState([]);
    const [disease, setDisease] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    
    const [cityCoordinates, setCityCoordinates] = useState({});  // 
    const [matchingUsers, setMatchingUsers] = useState([]);      //

    const authEmail = useAuthEmail();
    const authPassword = useAuthPassword();

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5001/user/users");
                if (response.data.status === "success") {
                    const users = response.data.users;
                    setContactData(users);
                    
                    const coordinates = {};
                    for (const user of users) {
                        if (user.city) {
                            const coords = await getCoordinatesForLocation(user.city);
                            if (coords) {
                                coordinates[user._id] = coords;
                            }
                        }
                    }
                    setCityCoordinates(coordinates);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError("Error fetching users.");
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const checkMatchingCoordinates = async () => {
            if (location) {
                const locationCoords = await getCoordinatesForLocation(location);
                if (locationCoords) {
                    const nearbyUsers = [];
                    for (const userId in cityCoordinates) {
                        const userCoords = cityCoordinates[userId];
                        const distance = haversineDistance(userCoords, locationCoords);

                        if (distance <= 50) {
                            const matchedUser = contactData.find((user) => user._id === userId);
                            if (matchedUser) {
                                nearbyUsers.push(matchedUser);
                            }
                        }
                    }
                    setMatchingUsers(nearbyUsers);
                } else {
                    setMatchingUsers([]);
                }
            }
        };
 
        checkMatchingCoordinates();
    }, [location, cityCoordinates, contactData]);

    const saveNotifications = async (users, disease, description, category, location) => {
        try {
            await axios.post("http://localhost:5001/notification/saveNotification", {
                users,
                disease,
                description,
                category,
                location
            });
            console.log('Notifications saved successfully');
        } catch (err) {
            console.error('Error saving notifications:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/AddProblem", { disease, description, category, location });
            setSuccessMessage('Problem added successfully!');
            alert('Disease added successfully!');
    
            // Exclude the user who submitted the problem from the notifications
            const usersToNotify = matchingUsers.filter(user => user.email !== authEmail);
    
            // Trigger notification saving only for matching users other than the submitter
            if (usersToNotify.length > 0) {
                await saveNotifications(usersToNotify, disease, description, category, location);
            }

            console.log("Users :", usersToNotify);
    
            setDisease('');
            setDescription('');
            setCategory('');
            setLocation('');
            navigate('/contact');
        } catch (err) {
            setError('Error adding problem. Please try again.');
            alert('Error adding problem. Please try again.');
        }
    };
    

    if (authEmail == null || authPassword == null) {
        navigate('/login');
        return null;
     } else {
        return (
            <div className='QAddProblemForm'>
                <div className='Qaddproblem_photo'>
                    <br /><br />
                    <form className="PAproductForm" onSubmit={handleSubmit}>
                        <h2 className="PAtopic">Add Disease</h2>
                        <div className="PAform-group">
                            <label>Disease:</label>
                            <input type="text" className="PAinarea" placeholder='Enter Disease' value={disease} onChange={(e) => setDisease(e.target.value)} required />
                        </div>
                        <div className="PAform-group">
                            <label>Description:</label>
                            <textarea className="PAinarea" placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="PAform-group">
                            <label>Category:</label>
                            <select id="productCategory" className="PAinarea" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option>Select Category</option>
                                <option>Sowing Season</option>
                                <option>Growing Season</option>
                                <option>Harvesting Season</option>
                                <option>Resting Season</option>
                            </select>
                        </div>
                        <div className="PAform-group">
                            <label>Location:</label>
                            <input type="text" className="PAinarea" placeholder='Enter Location' value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        <br />
                        <button type="submit" className="PAbtn">Submit</button>
                    </form>
                    {error && <p>{error}</p>}
                    {successMessage && <p>{successMessage}</p>}

                </div>
                
                {matchingUsers.length > 0 && (
                    <div style={{ margin: '20px', paddingLeft: '10px', border: '2px solid #ccc', width: '500px', height: 'auto', overflowY: 'auto', borderRadius: '10px' }}>
                        {/* Display matching users */}
                        
                            <div className="MatchingUsers">
                                <h3>Users Within 50km</h3>
                                <ul>
                                    {matchingUsers.map((user, index) => (
                                        <li key={user._id}>
                                            {user.first_name} {user.last_name} - {user.city}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        

                        {/* Error and success messages */}
                        {error && <p>{error}</p>}
                        {successMessage && <p>{successMessage}</p>}
                    </div>
                )}
            </div>
        );
    }
}

export default AddProblem;
