import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels: [
      'Users',
      'Orders',
      'Payments',
      'Brands',
      'Shoes',
      'Styles',
      'Reviews',
      'Order Items',
      'Wishlists',
      'Wishlist Items',
    ],
    datasets: [
      {
        label: 'Counts',
        data: [
          data.total_users || 0,
          data.total_orders || 0,
          data.total_payments || 0,
          data.total_brands || 0,
          data.total_shoes || 0,
          data.total_styles || 0,
          data.total_reviews || 0,
          data.total_order_items || 0,
          data.total_wishlists || 0,
          data.total_wishlist_items || 0,
        ],
        backgroundColor: [
          '#007bff',
          '#6610f2',
          '#6f42c1',
          '#e83e8c',
          '#dc3545',
          '#fd7e14',
          '#ffc107',
          '#28a745',
          '#20c997',
          '#17a2b8',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Dashboard Overview - Summary Chart',
      },
    },
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 fw-bold text-primary">Admin Control Panel</h1>

      <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
        <button className="btn btn-outline-primary" onClick={() => navigate('/payments')}>
          Manage Payments
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/users')}>
          Manage Users
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/shoes')}>
          Manage Shoes
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/orders')}>
          Manage Orders
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/order-items')}>
          Manage Order Items
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/brands')}>
          Manage Brands
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/reviews')}>
          Manage Reviews
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/styles')}>
          Manage Styles
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/wishlists')}>
          Manage Wishlist
        </button>
      </div>

      <div className="card shadow mb-5">
        <div className="card-body">
          <h2 className="mb-4 fw-bold text-danger">Dashboard Overview</h2>

          <div className="chart-container mb-4">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <h3 className="mt-4">Summary</h3>
          <ul className="list-group">
            <li className="list-group-item">Total Users: {data.total_users || 0}</li>
            <li className="list-group-item">Total Orders: {data.total_orders || 0}</li>
            <li className="list-group-item">Total Payments: {data.total_payments || 0}</li>
            <li className="list-group-item">Total Brands: {data.total_brands || 0}</li>
            <li className="list-group-item">Total Shoes: {data.total_shoes || 0}</li>
            <li className="list-group-item">Total Styles: {data.total_styles || 0}</li>
            <li className="list-group-item">Total Reviews: {data.total_reviews || 0}</li>
            <li className="list-group-item">Total Order Items: {data.total_order_items || 0}</li>
            <li className="list-group-item">Total Wishlists: {data.total_wishlists || 0}</li>
            <li className="list-group-item">Total Wishlist Items: {data.total_wishlist_items || 0}</li>
          </ul>

          <div className="text-center mt-4">
            <button className="btn btn-link" onClick={() => navigate('/')}>
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
