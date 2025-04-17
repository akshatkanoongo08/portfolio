import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, newCategory);
        setSuccess('Category updated successfully');
      } else {
        await api.post('/categories', newCategory);
        setSuccess('Category created successfully');
      }
      
      setNewCategory({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        setSuccess('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category');
        console.error('Error deleting category:', err);
      }
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <div className="categories-manager" style={{ padding: '20px' }}>
      <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffebee', borderRadius: '4px', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', padding: '10px', background: '#e8f5e9', borderRadius: '4px', marginBottom: '10px' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>

          {editingCategory && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3>Existing Categories</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {categories.map((category) => (
          <div
            key={category._id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              background: '#fff'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0' }}>{category.name}</h4>
            {category.description && (
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{category.description}</p>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleEdit(category)}
                style={{
                  padding: '5px 10px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                style={{
                  padding: '5px 10px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesManager;