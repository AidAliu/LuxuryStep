// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to ShoeReview</h1>
      <p style={styles.subtitle}>Find the best shoes, add reviews, and manage your inventory with ease.</p>
      <div style={styles.buttonContainer}>
        <Link to="/admin" style={styles.button}>Go to Admin Dashboard</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  buttonContainer: {
    marginTop: '1rem',
  },
  button: {
    textDecoration: 'none',
    padding: '1rem 2rem',
    backgroundColor: '#1877F2',
    color: '#fff',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
};

export default Home;
