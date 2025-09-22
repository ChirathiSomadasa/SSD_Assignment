import React, { useEffect, useState } from 'react';
import './User.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function User() {
    const [user, setUsers] = useState([]);
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State to store the search input
    const navigate = useNavigate();
    const [cookies] = useCookies(['admin_token']); // Use cookies hook
    const adminToken = cookies.admin_token; // Get admin_token from cookies

    useEffect(() => {
        if (!adminToken) return;

        axios.get("http://localhost:5001/api/admin/register", {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
            .then((response) => {
                // console.log(response);
                const { status, users } = response.data;
                if (status === "success") {
                    setUsers(users);
                    setFilteredUserData(users);
                } else {
                    alert("Error - " + response.data.message);
                }
            })
            .catch((error) => {
                alert("Error fetching users: " + error.message);
            });
    }, [navigate, adminToken]);


    // Filter users as you type
    useEffect(() => {
        const value = searchTerm.toLowerCase();
        const filteredData = user.filter((user) =>
            (user.first_name?.toLowerCase() || '').includes(value) ||
            (user.last_name?.toLowerCase() || '').includes(value) ||
            (user.mobile_number?.toLowerCase() || '').includes(value) ||
            (user.email?.toLowerCase() || '').includes(value) ||
            (user.city?.toLowerCase() || '').includes(value)
        );
        setFilteredUserData(filteredData);
    }, [searchTerm, user]);


    // Remove user function
    const handleRemoveUser = (userId) => {
        if (!window.confirm("Are you sure you want to remove this user?")) return;
        axios.delete(`http://localhost:5001/api/admin/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
            .then((response) => {
                if (response.data.status === "success") {
                    setUsers(prev => prev.filter(u => u._id !== userId));
                } else {
                    alert("Error - " + response.data.message);
                }
            })
            .catch((error) => {
                alert("Error removing user: " + error.message);
            });
    };


    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
    };


    return (
        <div className="user-list-container">
            <h1>Manage Users</h1>
            <div className='user-filter-bar'>
                <input
                    className='user-filter-search'
                    placeholder="Search user"
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUserData.length > 0 ? (
                        filteredUserData.map((user, index) => (
                            <tr key={user._id || index}>
                                <td>{user.first_name}</td>
                                <td>{user.last_name}</td>
                                <td>{user.mobile_number}</td>
                                <td>{user.email}</td>
                                <td>{user.city}</td>
                                <td>
                                    <button
                                        className="user-remove-btn"
                                        onClick={() => handleRemoveUser(user._id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default User;
