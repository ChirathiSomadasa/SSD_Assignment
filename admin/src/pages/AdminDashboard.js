import React from 'react';
import './AdminDashboard.css'; // Import CSS for styling

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Welcome to RiceSmart Admin Dashboard</h1>
      <p>Use the sidebar to manage users, diseases, solutions, fertilizers, and predictions.</p>
      {/* Add dashboard widgets, stats, or quick links here */}
    </div>
  );
}

export default AdminDashboard;