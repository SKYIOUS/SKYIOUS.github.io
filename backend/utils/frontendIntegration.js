/**
 * Frontend Integration Utility
 * 
 * This file contains utility functions to help integrate the frontend with the backend API.
 * It provides JavaScript code snippets that can be included in frontend HTML files to
 * interact with the API endpoints.
 */

// API base URL - to be updated in frontend
const API_BASE_URL = '/api';

/**
 * Authentication Functions
 */

// Register a new user
function registerUser(username, email, password) {
  return fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json());
}

// Login a user
function loginUser(username, password) {
  return fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success && data.token) {
      // Store the token in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  });
}

// Get current logged in user
function getCurrentUser() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return Promise.resolve(null);
  }
  
  return fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      return data.data;
    }
    return null;
  })
  .catch(() => {
    // If there's an error, clear the token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  });
}

// Logout user
function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return fetch(`${API_BASE_URL}/auth/logout`)
    .then(response => response.json());
}

/**
 * Blog Functions
 */

// Get all blogs with optional filters
function getBlogs(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return fetch(`${API_BASE_URL}/blogs${queryParams ? `?${queryParams}` : ''}`)
    .then(response => response.json())
    .then(data => data.success ? data.data : []);
}

// Get a single blog by ID
function getBlogById(id) {
  return fetch(`${API_BASE_URL}/blogs/${id}`)
    .then(response => response.json())
    .then(data => data.success ? data.data : null);
}

// Create a new blog
function createBlog(blogData) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return Promise.reject(new Error('User not authenticated'));
  }
  
  return fetch(`${API_BASE_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blogData)
  })
  .then(response => response.json());
}

// Update a blog
function updateBlog(id, blogData) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return Promise.reject(new Error('User not authenticated'));
  }
  
  return fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(blogData)
  })
  .then(response => response.json());
}

// Delete a blog
function deleteBlog(id) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return Promise.reject(new Error('User not authenticated'));
  }
  
  return fetch(`${API_BASE_URL}/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json());
}

/**
 * Newsletter Functions
 */

// Subscribe to newsletter
function subscribeToNewsletter(email, name, categories = ['general']) {
  return fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, name, categories })
  })
  .then(response => response.json());
}

// Unsubscribe from newsletter
function unsubscribeFromNewsletter(email) {
  return fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
  .then(response => response.json());
}

/**
 * Contact Form Functions
 */

// Submit contact form
function submitContactForm(name, email, subject, message) {
  return fetch(`${API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, subject, message })
  })
  .then(response => response.json());
}

/**
 * Admin Functions
 */

// Get pending users for approval
function getPendingUsers() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return Promise.reject(new Error('User not authenticated'));
  }
  
  return fetch(`${API_BASE_URL}/users/pending`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => data.success ? data.data : []);
}

// Approve or reject a user
function updateUserApproval(userId, status) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return Promise.reject(new Error('User not authenticated'));
  }
  
  return fetch(`${API_BASE_URL}/users/${userId}/approval`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
  .then(response => response.json());
}

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  submitContactForm,
  getPendingUsers,
  updateUserApproval
}; 