import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const PortfolioSingleSection = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="section-padding">Loading...</div>;
  }

  if (error || !project) {
    return (
      <div className="section-padding">
        <div className="container">
          <div className="alert alert-danger">{error || 'Project not found'}</div>
          <Link to="/portfolio" className="btn btn-primary">Back to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">

        {/* Title */}
        <div className="mb-4">
          <h1 className="display-4 fw-bold text-black">{project.title}</h1>
        </div>

        {/* Categories */}
        <div className="mb-4">
          {Array.isArray(project.categories) && project.categories.map((category, index) => (
            <span key={category._id || index} className="badge bg-light border me-2 text-black p-2">
              {category.name || category.label || category.value}
            </span>
          ))}
        </div>

        {/* Description and Project Meta */}
        <div className="row mb-5">
          <div className="col-lg-8 mb-4 mb-lg-0">
            <div
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
          <div className="col-lg-4">
          <div className="row">
  {/* Client */}
  {project.client && (
    <div className="col-md-6 mb-3">
      <strong>Client</strong>
      <div className="text-muted">{project.client}</div>
    </div>
  )}

  {/* Date */}
  {project.date && (
    <div className="col-md-6 mb-3">
      <strong>Date</strong>
      <div className="text-muted">{new Date(project.date).toLocaleDateString()}</div>
    </div>
  )}
  {/* Task */}
{project.task && (
  <div className="col-md-6 mb-3">
    <strong>Task</strong>
    <div className="text-muted">{project.task}</div>
  </div>
)}

{/* Role */}
{project.role && (
  <div className="col-md-6 mb-3">
    <strong>Role</strong>
    <div className="text-muted">{project.role}</div>
  </div>
)}


  {/* Website */}
  {project.projectLink && (
    <div className="col-md-6 mb-3">
      <a
        href={project.projectLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-dark text-decoration-none d-inline-flex align-items-center link-hover"
      >
        <strong className="me-2">Website</strong>
        <span className="text-secondary">→</span>
      </a>
    </div>
  )}

  {/* Project PDF */}
  {(project.pdf?.url || project.pdfUrl) && (
    <div className="col-md-6 mb-3">
      <a
        href={project.pdf?.url || project.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-dark text-decoration-none d-inline-flex align-items-center link-hover"
        download
      >
        <strong className="me-2">Project PDF</strong>
        <span className="text-secondary">→</span>
      </a>
    </div>
  )}
</div>



          </div>
        </div>

        {/* Main Image */}
        <div className="mb-5">
          <img
            src={
              project.image?.url
                ? project.image.url.startsWith('http')
                  ? project.image.url
                  : `${process.env.REACT_APP_API_URL}${project.image.url}`
                : '/img/placeholder.jpg'
            }
            alt={project.title}
            className="img-fluid rounded shadow-lg"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = '/img/placeholder.jpg';
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          />
        </div>

        {/* Gallery Images Vertically One Below Another */}
        {Array.isArray(project.gallery) && project.gallery.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              {project.gallery.map((img, idx) => (
                <div key={idx} className="mb-4">
                  <img
                    src={
                      img.url && !img.url.startsWith('http')
                        ? `${process.env.REACT_APP_API_URL}${img.url}`
                        : img.url
                    }
                    alt={`Gallery ${idx + 1}`}
                    className="img-fluid rounded shadow"
                    style={{ width: '100%', height: '600px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = '/img/placeholder.jpg';
                    }}
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="row">
          <div className="col-12">
            <Link to="/portfolio" className="btn btn-outline-primary btn-lg shadow-sm">
              Back to Portfolio
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PortfolioSingleSection;
