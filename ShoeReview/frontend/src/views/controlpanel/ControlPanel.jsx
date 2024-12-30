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
    <div className="container py-4">
      <h1 className="text-center mb-4 fw-bold text-danger">Admin Control Panel</h1>

      {}
      <div className="d-flex justify-content-center mb-4" style={{ height: '15vh', marginLeft: '360px'}}>
        <button
          className="btn btn-primary mx-2"
          style={{ margin: '0 10px' }}
          onClick={() => navigate('/payments')}
        >
          Manage Payments
        </button>
        <button
          className="btn btn-primary mx-2"
          style={{ margin: '0 10px' }}
          onClick={() => (window.location.href = '/users')}
        >
          Manage Users
        </button>
        <button
          className="btn btn-primary mx-2"
          style={{ margin: '0 10px' }}
          onClick={() => (window.location.href = '/orders')}
        >
          Manage Orders
        </button>
      </div>

      <div className="mt-4">
        <h2 className="mb-4 fw-bold text-danger">Dashboard Overview</h2>
        {data.recent_payments && Array.isArray(data.recent_payments) && data.recent_payments.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
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
          </div>
        ) : (
          <p>No recent payments available</p>
        )}

        <h3 className="mt-4">Summary</h3>
        <ul className="list-group">
          <li className="list-group-item">Total Users: {data.total_users || 0}</li>
          <li className="list-group-item">Total Orders: {data.total_orders || 0}</li>
          <li className="list-group-item">Total Payments: {data.total_payments || 0}</li>
        </ul>

        <div className="text-center mt-4">
          <button className="btn btn-link" onClick={() => navigate('/')}>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
