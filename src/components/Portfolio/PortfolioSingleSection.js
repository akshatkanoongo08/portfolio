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
        {/* Project Header */}
        <div className="row mb-5">
          <div className="col-12">
            <h1 className="display-4">{project.title}</h1>
            <div className="categories mb-4">
              {Array.isArray(project.categories) && project.categories.map((category, index) => (
                <span key={category._id || index} className="badge bg-primary me-2">
                  {category.name || category.label || category.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Project Image */}
        <div className="row mb-5">
          <div className="col-12">
          <img
  src={
    project.image && project.image.url
      ? project.image.url.startsWith('http')
        ? project.image.url
        : `http://localhost:5000${project.image.url}`
      : '/img/placeholder.jpg'
  }
  alt={project.title}
  className="img-fluid rounded shadow-lg"
  style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }}
  onError={e => {
    e.target.onerror = null;
    e.target.src = '/img/placeholder.jpg';
  }}
/>
          </div>
        </div>

        {/* Project Gallery */}
        {Array.isArray(project.gallery) && project.gallery.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <h4>Gallery</h4>
              <div className="d-flex flex-wrap gap-3">
                {project.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url && !img.url.startsWith('http') ? `http://localhost:5000${img.url}` : img.url}
                    alt={`Gallery ${idx + 1}`}
                    className="img-fluid rounded shadow"
                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="row">
          <div className="col-lg-8">
            <div className="project-description">
              <h3 className="mb-4">Project Description</h3>
              <div dangerouslySetInnerHTML={{ __html: project.description }} />
            </div>
          </div>
          <div className="col-lg-4">
            <div className="project-meta p-4 bg-light rounded">
              <h4 className="mb-4">Project Details</h4>
              <ul className="list-unstyled">
                {project.client && (
                  <li className="mb-3">
                    <strong>Client:</strong> {project.client}
                  </li>
                )}
                {project.date && (
                  <li className="mb-3">
                    <strong>Date:</strong> {new Date(project.date).toLocaleDateString()}
                  </li>
                )}
                {project.projectLink && (
                  <li className="mb-3">
                    <strong>Website:</strong>{' '}
                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                      Visit Project
                    </a>
                  </li>
                )}
                {project.pdf && project.pdf.url && (
                  <li className="mb-3">
                    <strong>Project PDF (Cloudinary):</strong>{' '}
                    <a href={project.pdf.url} target="_blank" rel="noopener noreferrer" download>
                      Download PDF
                    </a>
                  </li>
                )}
                {project.pdfUrl && (
                  <li className="mb-3">
                    <strong>Project PDF :</strong>{' '}
                    <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <Link to="/portfolio" className="btn btn-outline-primary">
                Back to Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSingleSection;
