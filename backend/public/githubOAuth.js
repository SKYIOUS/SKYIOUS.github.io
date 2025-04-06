/**
 * GitHub OAuth Integration
 * 
 * This file provides functionality to connect the frontend "Login with GitHub" 
 * button with the backend API OAuth flow.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Find GitHub login buttons
  const githubButtons = document.querySelectorAll('.github-login-btn');
  
  if (githubButtons.length > 0) {
    githubButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Redirect to GitHub OAuth endpoint
        window.location.href = '/api/auth/github';
      });
    });
  }
  
  // Check if we have a token from the OAuth callback
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Store token in local storage
    localStorage.setItem('token', token);
    
    // Fetch user data
    fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Redirect to dashboard
        window.location.href = data.data.role === 'admin' 
          ? '/admin/dashboard.html' 
          : '/account/dashboard.html';
      } else {
        // Error fetching user data
        console.error('Error fetching user data:', data.message);
        localStorage.removeItem('token');
        
        // Show error message if we have an alert element
        const loginAlert = document.getElementById('loginAlert');
        if (loginAlert && typeof showAlert === 'function') {
          showAlert('error', 'Authentication failed. Please try again.');
        }
      }
    })
    .catch(error => {
      console.error('Error authenticating with GitHub:', error);
      localStorage.removeItem('token');
      
      // Show error message if we have an alert element
      const loginAlert = document.getElementById('loginAlert');
      if (loginAlert && typeof showAlert === 'function') {
        showAlert('error', 'Authentication failed. Please try again.');
      }
    });
    
    // Clean up the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // Check for pending status from GitHub
  const message = urlParams.get('message');
  if (message === 'github_pending') {
    // Show pending approval message
    const loginAlert = document.getElementById('loginAlert');
    if (loginAlert && typeof showAlert === 'function') {
      showAlert('info', 'Your GitHub account registration is pending admin approval. Please try again later.');
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
}); 