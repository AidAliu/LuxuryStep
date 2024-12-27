// file: src/pages/ControlPanel.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ControlPanel = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('No access token found.');
        navigate('/');
        return;
      }

      try {
        // Check staff status
        const userResponse = await axios.get('http://127.0.0.1:8000/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.data.is_staff) {
          alert('Unauthorized access.');
          navigate('/');
          return;
        }

        // Fetch admin data
        const dashboardResponse = await axios.get('http://127.0.0.1:8000/api/control-panel-data/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(dashboardResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
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
