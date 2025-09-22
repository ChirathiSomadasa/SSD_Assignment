import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AdminSignOut() {
    useEffect(() => {
        localStorage.removeItem('admin_token'); // or whatever key you use
        localStorage.clear();

        navigate('/admin/login');
    }, []);

    const navigate = useNavigate();
    return <p>Signing out...</p>;
}

export default AdminSignOut;