import React, { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/projectService';
import './ProjectsManager.css';

const API_URL = 'http://localhost:5000'; // Match your backend URL

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: [],  // Initialize as empty array
    client: '',
    task: '',
    role: [],       // Initialize as empty array
    date: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

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
      // Split comma-separated values into array, handle empty string case
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
    setGalleryFiles([...e.target.files]);
  };
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
      // For array fields
      formData.categories.forEach(cat => data.append('categories', cat));
      formData.role.forEach(role => data.append('role', role));
      // For image
      if (formData.image) data.append('image', formData.image);
      // For gallery (if implemented)
      if (formData.gallery && formData.gallery.length > 0) {
        formData.gallery.forEach(file => data.append('gallery', file));
      }
      let response;
      if (selectedProject) {
        response = await updateProject(selectedProject._id, data);
      } else {
        response = await createProject(data);
      }
      // handle response, reset form, etc.
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
    // Validate categories
    if (!formData.categories || formData.categories.length === 0) {
      setError('At least one category is required');
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      
      // Ensure categories is always an array
      const categoriesArray = Array.isArray(formData.categories) 
        ? formData.categories 
        : [];
        
      formDataToSend.append('categories', JSON.stringify(categoriesArray));
      
      // Append other fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('client', formData.client);
      formDataToSend.append('task', formData.task);
      formDataToSend.append('date', formData.date);
      
      // Handle arrays by stringifying them
      formDataToSend.append('role', 
        JSON.stringify(
          Array.isArray(formData.role) 
            ? formData.role 
            : []
        )
      );
      
      // Append image file if exists
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      if (selectedProject) {
        await updateProject(selectedProject._id, formDataToSend);
      } else {
        await createProject(formDataToSend);
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
      categories: Array.isArray(project.categories) ? project.categories : [],
      client: project.client || '',
      task: project.task || '',
      role: Array.isArray(project.role) ? project.role : [],
      date: project.date || '',
      image: null // Can't pre-fill file input
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
          <label htmlFor="categories">Categories * (comma-separated)</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={Array.isArray(formData.categories) ? formData.categories.join(', ') : ''}
            onChange={handleInputChange}
            required
          />
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
          <label htmlFor="image">Project Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <input
  type="file"
  name="gallery"
  multiple
  accept="image/*"
  onChange={handleGalleryChange}
/>

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
            </div>
            <div className="project-actions">
              <button onClick={() => handleEdit(project)}>Edit</button>
              <button onClick={() => handleDelete(project._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsManager;