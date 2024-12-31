// file: src/views/controlpanel/UsersForm.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersForm = () => {
  const { userId } = useParams(); // If present, we're editing an existing user
  const navigate = useNavigate();

  // The user we are creating/editing
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
  });

  // The current logged-in user (so we know if they're staff/superuser)
  const [currentUser, setCurrentUser] = useState({
    is_staff: false,
    is_superuser: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch the CURRENT logged-in user to see if they're staff/superuser
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found.');
      navigate('/');
      return;
    }

    const fetchMe = async () => {
      try {
        const meResponse = await axios.get('http://127.0.0.1:8000/api/me/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(meResponse.data);
      } catch (err) {
        console.error('Error fetching current user:', err);
        // Optionally handle errors (e.g., logout or redirect)
      }
    };

    fetchMe();
  }, [navigate]);

  // 2. If we have a userId, fetch that user's data for editing
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          alert('No access token found.');
          navigate('/');
          return;
        }

        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/users/${userId}/`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const user = response.data;
          setUserData({
            username: user.username || '',
            email: user.email || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            // Password is not returned for security reasons;
            // user must re-enter it if they want to change it
            password: '',
            is_staff: user.is_staff || false,
          });
        } catch (err) {
          console.error('Error fetching user details:', err);
          setError('Failed to load user details');
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId, navigate]);

  // 3. Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 4. Submit the create or update request
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('No access token found.');
      return;
    }

    try {
      setLoading(true);

      if (userId) {
        // Editing an existing user
        const updatedData = { ...userData };
        if (!updatedData.password) {
          // If password is empty, remove it so it won't overwrite with blank
          delete updatedData.password;
        }

        await axios.put(
          `http://127.0.0.1:8000/api/users/${userId}/`,
          updatedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('User updated successfully!');
      } else {
        // Creating a new user
        if (!userData.password) {
          alert('Password is required to create a new user.');
          setLoading(false);
          return;
        }

        await axios.post('http://127.0.0.1:8000/api/users/', userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('User created successfully!');
      }

      navigate('/users'); // Return to the users list
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  // 5. Decide whether to disable the username field
  //    Condition: if we're editing (userId), and the current user is NOT staff nor superuser,
  //    then disable editing the username.
  const disableUsernameField = userId && !currentUser.is_staff && !currentUser.is_superuser;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4 fw-bold text-danger">
        {userId ? 'Edit User' : 'Create User'}
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="form-group mb-3">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
            disabled={disableUsernameField}
            // If editing, only staff/superuser can change the username
          />
        </div>

        {/* Email */}
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* First Name */}
        <div className="form-group mb-3">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Last Name */}
        <div className="form-group mb-3">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password (only required on create) */}
        <div className="form-group mb-3">
          <label htmlFor="password">
            {userId ? 'New Password (optional)' : 'Password (required)'}
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
        </div>

        {/* is_staff (checkbox) */}
        <div className="form-group mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="is_staff"
            name="is_staff"
            checked={userData.is_staff}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="is_staff">
            Is Staff?
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          {userId ? 'Update User' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default UsersForm;
