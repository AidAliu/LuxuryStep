import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ControlPanel = () => {
    const [data, setData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current user details
                const userResponse = await axios.get('/api/users/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (!userResponse.data.is_admin) {
                    alert('Unauthorized access.');
                    navigate('/'); // Redirect if not admin
                }

                // Fetch control panel data
                const dashboardResponse = await axios.get('/api/control-panel-data', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setData(dashboardResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/'); // Redirect on error
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Control Panel</h1>
            <ul>
                <li><a href="/payments">Manage Payments</a></li>
                <li><a href="/users">Manage Users</a></li>
                <li><a href="/orders">Manage Orders</a></li>
            </ul>

            <h2>Dashboard Overview</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ControlPanel;
