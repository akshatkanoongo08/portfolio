import React, { useState, useEffect, useRef } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/projectService';
import './ProjectsManager.css';

const API_URL = 'http://localhost:5000'; // Match your backend URL

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  const [galleryFiles, setGalleryFiles] = useState([]);
  const galleryInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],  // Initialize as empty array
    client: '',
    task: '',
    role: [],       // Initialize as empty array
    date: '',
    image: null,
    projectLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
    fetchCategories(); // 👈 fetch this too
  }, []);
  
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setAllCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };  

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categories' || name === 'role') {
      const arrayValue = value.trim() ? value.split(',').map(item => item.trim()) : [];
      setFormData(prev => ({
        ...prev,
        [name]: arrayValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };
  const handleGalleryChange = (e) => {
    const newFiles = Array.from(e.target.files);
    // Avoid duplicates by name+lastModified
    const existingKeys = new Set(galleryFiles.map(f => f.name + f.lastModified));
    const uniqueNewFiles = newFiles.filter(f => !existingKeys.has(f.name + f.lastModified));
    setGalleryFiles(prev => [...prev, ...uniqueNewFiles]);
    // Reset file input so user can re-select same file
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  // Remove a file from galleryFiles by index
  const handleRemoveGalleryFile = (removeIdx) => {
    setGalleryFiles(prev => prev.filter((_, idx) => idx !== removeIdx));
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('client', formData.client);
      data.append('task', formData.task);
      data.append('date', formData.date);
      data.append('projectLink', formData.projectLink);
      // For array fields
      formData.categories.forEach(cat => data.append('categories', cat));
      formData.role.forEach(role => data.append('role', role));
      // For image
      if (formData.image) data.append('image', formData.image);
      // For gallery (multiple files)
      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach(file => data.append('gallery', file));
      }
      // Debug: log FormData contents
      for (let pair of data.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      let response;
      if (selectedProject) {
        response = await updateProject(selectedProject._id, data);
      } else {
        response = await createProject(data);
      }
      fetchProjects();
      resetForm();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      categories: Array.isArray(project.categories) ? project.categories.map(cat => cat._id) : [],
      client: project.client || '',
      task: project.task || '',
      role: Array.isArray(project.role) ? project.role : [],
      date: project.date || '',
      image: null, // Can't pre-fill file input
      projectLink: project.projectLink || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setLoading(true);
        await deleteProject(id);
        fetchProjects();
        setError(null);
      } catch (err) {
        setError('Failed to delete project');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      title: '',
      description: '',
      categories: [],
      client: '',
      task: '',
      role: [],
      date: '',
      image: null
    });
  };

  return (
    <div className="projects-manager">
      <h2>{selectedProject ? 'Edit Project' : 'Create New Project'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categories">Categories *</label>
          <select
          id="categories"
          name="categories"
          multiple
          value={formData.categories}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            setFormData(prev => ({ ...prev, categories: selected }));
          }}
        >
          {allCategories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.label}
            </option>
          ))}
        </select>

        </div>

        <div className="form-group">
          <label htmlFor="client">Client</label>
          <input
            type="text"
            id="client"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="task">Task</label>
          <input
            type="text"
            id="task"
            name="task"
            value={formData.task}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role (comma-separated)</label>
          <input
            type="text"
            id="role"
            name="role"
            value={Array.isArray(formData.role) ? formData.role.join(', ') : ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectLink">Project Link</label>
          <input
            type="url"
            id="projectLink"
            name="projectLink"
            value={formData.projectLink}
            onChange={handleInputChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Project Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <div className="form-group">
          <label htmlFor="gallery">Gallery Images</label>
          <input
            type="file"
            id="gallery"
            name="gallery"
            multiple
            accept="image/*"
            onChange={handleGalleryChange}
            ref={galleryInputRef}
          />
          <small>Select one or more images.</small>
          {galleryFiles.length > 0 && (
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              {galleryFiles.map((file, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {file.name}
                  <button type="button" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => handleRemoveGalleryFile(idx)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (selectedProject ? 'Update Project' : 'Create Project')}
          </button>
          {selectedProject && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="projects-list">
        <h3>Existing Projects</h3>
        {projects.map(project => (
          <div key={project._id} className="project-item">
            <div className="project-info">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              {/* IMAGE DISPLAY */}
              {project.image && project.image.url && (
                <img
                  src={project.image.url.startsWith('http')
                    ? project.image.url
                    : `http://localhost:5000${project.image.url}`}
                  alt={project.title}
                  style={{ maxWidth: 200, maxHeight: 200, display: 'block', marginTop: 8 }}
                />
              )}
              {/* GALLERY DISPLAY */}
              <div style={{ marginTop: 12 }}>
                <strong>Gallery:</strong>
                {project.gallery && project.gallery.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {project.gallery.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url.startsWith('http')
                          ? img.url
                          : `http://localhost:5000${img.url}`}
                        alt={`Gallery ${idx + 1}`}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                      />
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#aaa', marginLeft: 8 }}>No gallery images</span>
                )}
              </div>
            </div>
            <div className="project-actions">
              <button onClick={() => handleEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project._id)}>Delete</button>
              {project.projectLink && (
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginLeft: 8,
                    color: '#007bff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Project Link
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;