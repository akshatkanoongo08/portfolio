import api from './api';

// Add a new category
export const addCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

// Delete a category
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};