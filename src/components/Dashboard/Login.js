import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin@gmail.com',  // Default username
    password: 'djakshat'  // Default password
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Remove navbar scripts on mount
  useEffect(() => {
    // Remove main.js script to prevent navbar errors
    const scripts = document.querySelectorAll('script[src*="main.js"]');
    scripts.forEach(script => script.remove());

    return () => {
      // Re-add main.js script when component unmounts
      const script = document.createElement('script');
      script.src = '/assets/js/main.js';
      document.body.appendChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Making login request:', {
        url: `${api.defaults.baseURL}/auth/login`,
        data: credentials
      });

      const response = await api.post('/auth/login', credentials);
      console.log('Login successful:', response.data);
      
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard/projects');
    } catch (err) {
      console.error('Login failed:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2>Admin Login</h2>
        {error && (
          <div style={{ color: 'red', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Username</label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
      {/* <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Debug Info:</p>
        <pre>{JSON.stringify(credentials, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default Login;