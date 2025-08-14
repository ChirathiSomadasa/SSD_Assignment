import React, { useEffect, useState } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function User() {
    const [user, setUsers] = useState([]);
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search input
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5001/user/api/admin/register")
            .then((response) => {
                console.log(response);  // Log the response to check its structure
                const { status, data } = response.data;
                if (status === "success") {
                    setUsers(data);  // Store fetched data
                    setFilteredUserData(data); // Initialize filtered data with all users
                } else {
                    alert("Error - " + response.data.message);
                }
            })
            .catch((error) => {
                alert("Error fetching users: " + error.message);
            });
    }, [navigate]);

    // Function to handle search
    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        // Filter user data based on the search term across multiple fields
        const filteredData = user.filter((user) =>
            user.first_name.toLowerCase().includes(value) ||
            user.last_name.toLowerCase().includes(value) ||
            user.mobile_number.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value) ||
            user.city.toLowerCase().includes(value)
        );
        setFilteredUserData(filteredData);
    };

    // Function to clear search
    const clearSearch = () => {
        setSearchTerm('');
        setFilteredUserData(user); // Reset the filtered data to all users
    };

    return (
        <div className="user-list-container">
            <h1>Manage Users</h1>
            <div className='user-filter-bar'>
                <input
                    className='user-filter-search'
                    placeholder="Search user"
                    type="text"
                    value={searchTerm} // Controlled input
                    onChange={handleSearch} // Call the search function on change
                />
                <button className='user-filter-search-btn' onClick={handleSearch}>Search</button>
                <button className='user-filter-search-btn' onClick={clearSearch}>Clear Search</button>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUserData.length > 0 ? (
                        filteredUserData.map((user, index) => (
                            <tr key={index}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.mobile_number}</td>
                                <td>{user.email}</td>
                                <td>{user.city}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default User;
