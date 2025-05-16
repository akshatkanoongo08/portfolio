import React, { useState } from 'react';
import MagneticButton from '../Miscellaneous/MagneticButton';

const Form = () => {
  const contactInfo = {
    title: 'Schedule a call with us to see if we can help',
    description: 'Whether you’re looking to start a new project or simply want to chat, feel free to reach out to me!',
    phone: '+91-78913 31221',
    email: 'himanshu@revtidigital.com',
    address: 'F-21, Tonk Phatak, Jaipur, Raj 302015',
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    interest: '',
    budget: '',
    timeline: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          website: '',
          interest: '',
          budget: '',
          timeline: '',
          message: '',
        });
      } else {
        alert('Failed to send message.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section className="contact-area primary-bg">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-12 col-lg-4 order-last order-md-first">
            <div className="contact-info">
              <h3>{contactInfo.title}</h3>
              <p>{contactInfo.description}</p>

              <div className="content contact-form">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <i className="icon icon-phone"></i>
                    <a className="content" href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                  </li>
                  <li className="list-group-item">
                    <i className="icon icon-envelope-open"></i>
                    <a className="content" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                  </li>
                  <li className="list-group-item">
                    <i className="icon icon-location-pin"></i>
                    <a className="content" href="/#">{contactInfo.address}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7 order-first order-md-last mt-sm-4 mt-lg-0">
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="name">Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <label htmlFor="phone">Phone</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
                <label htmlFor="companyName">Company Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="url"
                  className="form-control"
                  id="website"
                  placeholder="Company Website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
                <label htmlFor="website">Company Website</label>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="interest" className="form-label">I'm interested in:</label>
                <textarea
                  className="form-control"
                  id="interest"
                  placeholder="Describe what you're interested in..."
                  value={formData.interest}
                  onChange={handleInputChange}
                  rows={2}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="budget" className="form-label">My budget is:</label>
                <textarea
                  className="form-control"
                  id="budget"
                  placeholder="Describe your budget or expectations..."
                  value={formData.budget}
                  onChange={handleInputChange}
                  rows={2}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="timeline"
                  placeholder="Timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                />
                <label htmlFor="timeline">What is your timeline?</label>
              </div>
              <div className="form-floating mb-4">
                <textarea
                  className="form-control"
                  id="message"
                  placeholder="Leave a comment here"
                  style={{ height: '100px' }}
                  value={formData.message}
                  onChange={handleInputChange}
                />
                <label htmlFor="message">Message</label>
              </div>
                <button type="submit" className="btn magnetic-button btn-outline">
                  Submit Message
                </button>
            </form>
            <p className="form-message"></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Form;
