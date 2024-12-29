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
        console.log(dashboardResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
     <div className="container">
      <h1 className="heading">Admin Control Panel</h1>
      <ul className="nav-list">
      <li className="nav-item">
  <button className="nav-button" onClick={() => window.location.href = '/payments'}>
    Manage Payments
  </button>
</li>
<li className="nav-item">
  <button className="nav-button" onClick={() => window.location.href = '/users'}>
    Manage Users
  </button>
</li>
<li className="nav-item">
  <button className="nav-button" onClick={() => window.location.href = '/orders'}>
    Manage Orders
  </button>
</li>

      </ul>
    </div>

    <div>
  <h2>Dashboard Overview</h2>
  {data.recent_payments && Array.isArray(data.recent_payments) && data.recent_payments.length > 0 ? (
    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>RECENT PAYMENTS</thead>
      <thead>
        <tr>
          {Object.keys(data.recent_payments[0]).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.recent_payments.map((payment, index) => (
          <tr key={index}>
            {Object.values(payment).map((value, i) => (
              <td key={i}>{value?.toString() || '-'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No recent payments available</p>
  )}

  <h3>Summary</h3>
  <ul>
    <li>Total Users: {data.total_users || 0}</li>
    <li>Total Orders: {data.total_orders || 0}</li>
    <li>Total Payments: {data.total_payments || 0}</li>
  </ul>
</div>

    </div>
  );
};

export default ControlPanel;
