import React, { useEffect, useState } from 'react';
import './EnquiriesManager.css';

const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete enquiry');
      setEnquiries((prev) => prev.filter((enq) => enq._id !== id));
    } catch (err) {
      alert('Error deleting enquiry: ' + err.message);
    }
  };


  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`);
        if (!response.ok) throw new Error('Failed to fetch enquiries');
        const data = await response.json();
        setEnquiries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  if (loading) return <div>Loading enquiries...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="enquiries-manager">
      <h2>Contact Form Enquiries</h2>
      {enquiries.length === 0 ? (
        <p>No enquiries found.</p>
      ) : (
        <div className="enquiries-table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Website</th>
              <th>Interest</th>
              <th>Budget</th>
              <th>Timeline</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td>{enquiry.name}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.phone}</td>
                <td>{enquiry.companyName}</td>
                <td>{enquiry.website}</td>
                <td>{enquiry.interest}</td>
                <td>{enquiry.budget}</td>
                <td>{enquiry.timeline}</td>
                <td>{enquiry.message}</td>
                <td>{new Date(enquiry.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(enquiry._id)}
                    style={{ color: '#fff', background: '#e74c3c', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default EnquiriesManager;
