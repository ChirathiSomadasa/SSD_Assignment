import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './NotificationBell.css';
import { MdOutlineLocationOn } from "react-icons/md";
import { useAuthEmail } from '../../auth'; // Adjust the import path as needed



const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null); // To track the selected notification for the modal
    const authEmail = useAuthEmail();
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (authEmail) {
                    const response = await axios.get(`http://localhost:5001/notification/getNotifications/${authEmail}`);
                    console.log('API Response:', response.data);
                    const filteredNotifications = response.data.filter(notification => notification.email === authEmail);
                    setNotifications(filteredNotifications);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };
    
        fetchNotifications();
    }, [authEmail]);

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/notification/deleteNotification/${id}`);
            setNotifications(notifications.filter(notification => notification._id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    

    const handleSeeMore = async (notification) => {
        try {
            // Set the selected notification for the modal
            setSelectedNotification(notification);
    
            // Delete the notification immediately
            await axios.delete(`http://localhost:5001/notification/deleteNotification/${notification._id}`);
            setNotifications(notifications.filter(n => n._id !== notification._id));
    
            // Navigate to the contact page
            navigate('/contact');
    
            // Set a timer to automatically delete the notification after 3 days (259200000 milliseconds)
            const timerId = setTimeout(async () => {
                try {
                    await axios.delete(`http://localhost:5001/notification/deleteNotification/${notification._id}`);
                    setNotifications(notifications.filter(n => n._id !== notification._id));
                } catch (error) {
                    console.error('Error automatically deleting notification:', error);
                }
            }, 259200000); // 3 days in milliseconds
    
            // Clean up the timer when the component unmounts or before setting a new timer
            return () => clearTimeout(timerId);
        } catch (error) {
            console.error('Error handling see more:', error);
        }
    };
    
    
    const closeModal = () => {
        setSelectedNotification(null); // Close the modal
    };

    return (
        <div className="notification-bell-container">
            <div className="bell-icon">
                <i className="fas fa-bell"></i>
            </div>

            <div className="notification-list-container">
                {notifications.length > 0 ? (
                    <ul className="notification-list">
                        {notifications.map((notification, index) => (
                            <li key={index} className="notification-card">
                                <div className="notification-card-content">
                                    <div className="warning-message">
                                        ⚠️ <strong>Warning:</strong> The information provided is for public awareness. Please take necessary precautions!
                                    </div>
                                    <div className='details'>
                                        <h4>Disease:</h4>
                                        <p>{notification.disease}</p>

                                        <h4>Disease category:</h4>
                                        <p>{notification.category}</p>
                                        
                                        <h4>Disease description:</h4>
                                        <p>{notification.description}</p>
                                        
                                        <h4>Location:</h4>
                                        <p className="clickable-location" onClick={() => navigate('/map', { state: { location: notification.location } })}>
                                            <MdOutlineLocationOn className="QlocationIcon" />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="underlined-text">{notification.location}</span>
                                        </p>
                                    </div>    
                                </div>
                                {/* <button
                                    className="see-more-button"
                                    onClick={() => handleSeeMore(notification)}
                                >
                                    Add Solution
                                </button> */}
                                <button
                                    className="delete-button"
                                    onClick={() => deleteNotification(notification._id)}
                                >
                                    Clear
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="notification-item">
                        <strong>No New Notifications</strong>
                    </div>
                )}
            </div>

            
        </div>
    );
};

export default NotificationBell;
