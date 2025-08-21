// src/pages/SignOut.js
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function SignOut() {
    const [cookies, setCookies] = useCookies(['auth_email']);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear JWT and email
        localStorage.removeItem('token');
        setCookies('auth_email', '', { expires: new Date(0) });
        navigate('/login');
    }, [navigate, setCookies]);

    return <p>Please wait...</p>;
}

export default SignOut;
