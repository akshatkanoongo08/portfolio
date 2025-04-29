import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>Dashboard</h2>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/dashboard/projects">Projects</Link>
          </li>
          <li>
            <Link to="/dashboard/categories">Categories</Link>
          </li>
          <li>
            <Link to="/dashboard/enquiries">Enquiries</Link>
          </li>
          <li>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;