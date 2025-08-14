import React, { useEffect, useState } from 'react';
import './Header.css';
import HeaderNavButton from './NavButton';
import HeaderButton from './HeaderButton';
import 'material-icons/iconfont/material-icons.css';
import Logo from '../../images/logo.png';
import ProfileVector from '../../images/default_profile_vector.webp';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthEmail } from '../../auth';

function Header() {
    const [activePage, setActivePage] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const authEmail = useAuthEmail();

    useEffect(() => {
        setActivePage(getPageId(location.pathname));

        const fetchNotifications = async () => {
            try {
                if (authEmail) {
                    const response = await axios.get(`http://localhost:5001/notification/getNotifications/${authEmail}`);
                    const fetchedNotifications = response.data;

                    // Calculate unread notifications count
                    const unreadNotifications = fetchedNotifications.filter(notification => !notification.read);
                    setNotificationCount(unreadNotifications.length);

                    // Set button color based on unread notifications
                    setHasNewNotifications(unreadNotifications.length > 0);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

       
        const intervalId = setInterval(fetchNotifications, 60000);
        return () => clearInterval(intervalId);
    }, [location.pathname],[authEmail]);

    useEffect(() => {
        if (location.pathname === "/notification") {
            markNotificationsAsRead();
        } else {
            // Reset notification state when navigating to other pages
            resetNotificationState();
        }
    }, [location.pathname])

    const markNotificationsAsRead = async () => {
        try {
            if (authEmail) {
                await axios.post(`http://localhost:5001/notification/markAsRead`, { email: authEmail });
               setNotificationCount(0); // Reset count to 0
                setHasNewNotifications(false); // Reset notification badge
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const resetNotificationState = () => {
        // Only reset the state if we are navigating away from the notification page
        setNotificationCount(0);
        setHasNewNotifications(false);
    };

    const onNotificationButtonClick = async () => {
        try {
            await markNotificationsAsRead();
            navigate("/notification");
        } catch (error) {
            console.error('Error handling notification button click:', error);
        }
    };

    function navItemClick(id) {
        navigate(id);
    }

    function onSignUpButtonClick() {
        navigate("/signup");
    }

    function onLoginButtonClick() {
        navigate("/login");
    }

    function onSignOutClick() {
        navigate("/signout");
    }

    function onProfileButtonClick() {
        navigate("/profile");
    }

    return (
        <div className="header">
            <div className="header-top">
                <div className="logo">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="header-right">
                    <div className='div-btn' id="login" onClick={onLoginButtonClick}>
                        <button className='signin-button'>Login</button>
                    </div>
                    <div className='div-btn' id="signup" onClick={onSignUpButtonClick}>
                        <button className='signup-button'>Sign Up</button>
                    </div>

                    <div className='div-btn' id="signout" onClick={onSignOutClick}>
                        <button className='signout-button'>Sign Out</button>
                    </div>

                    {/* Notification Button */}
                    <div className="notification-wrapper">
                        <HeaderButton 
                            id="notification" 
                            activeId={activePage} 
                            onClick={onNotificationButtonClick}
                            badgeActive={hasNewNotifications}  // Show badge if there are unread notifications
                        >
                            {/* Change icon color based on unread notifications */}
                            <span className={`material-icons-outlined ${hasNewNotifications ? 'notification-icon-active' : 'notification-icon'}`}>
                                notifications
                            </span>
                            {notificationCount > 0 && (
                                <span className="notification-badge"></span>
                            )}
                        </HeaderButton>
                    </div>

                    {/* Profile Button */}
                    <div className="profile" onClick={onProfileButtonClick}>
                        <div className="profile-picture">
                            <img src={ProfileVector} alt="Profile" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-nav">
                <HeaderNavButton id="" activeId={activePage} name="Home" onClick={(id) => { navItemClick(id) }} />
                <HeaderNavButton id="predictions" activeId={activePage} name="Predictions" onClick={(id) => { navItemClick(id) }} />
                <HeaderNavButton id="predictionResult" activeId={activePage} name="My Predictions" onClick={(id) => { navItemClick(id) }} />
                <HeaderNavButton id="contact" activeId={activePage} name="Farmers' Q&A" onClick={(id) => { navItemClick(id) }} />
                <HeaderNavButton id="fertilizersAndPesticides" activeId={activePage} name="Fertilizers & Pesticides" onClick={(id) => { navItemClick(id) }} />
                <HeaderNavButton id="map" activeId={activePage} name="Disease Locator" onClick={(id) => { navItemClick(id) }} />

                
            </div>
        </div>
    );
}

function getPageId(path) {
    path = path.substring(1, path.length);
    const firstIndex = path.indexOf("/");
    if (firstIndex === -1) {
        return path;
    } else {
        return path.substring(0, firstIndex);
    }
}

export default Header;
