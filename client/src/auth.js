// src/auth.js
import { useCookies } from 'react-cookie';

function useAuthEmail() {
    const [cookies] = useCookies(['auth_email']);
    return cookies.auth_email || null;
}

// Get JWT Token
function useAuthToken() {
    return localStorage.getItem('token');
}

// Check if user is logged in
function useIsAuthenticated() {
    return !!localStorage.getItem('token');
}

export { useAuthEmail, useAuthToken, useIsAuthenticated };

