document.addEventListener('DOMContentLoaded', function() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  
  if (newsletterForms.length > 0) {
    newsletterForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const emailInput = form.querySelector('input[type="email"]');
        const nameInput = form.querySelector('input[name="name"]');
        
        if (!emailInput) {
          console.error('Email input not found in newsletter form');
          return;
        }
        
        const email = emailInput.value;
        const name = nameInput ? nameInput.value : '';
        
        // Validate email
        if (!email || !validateEmail(email)) {
          showAlert(form, 'error', 'Please enter a valid email address');
          return;
        }
        
        // Disable submit button and show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        
        // Submit form to API
        fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, name })
        })
        .then(response => response.json())
        .then(data => {
          // Reset form
          form.reset();
          
          // Show success message
          if (data.success) {
            showAlert(form, 'success', data.message || 'Successfully subscribed to the newsletter!');
          } else {
            showAlert(form, 'error', data.message || 'An error occurred during subscription');
          }
        })
        .catch(error => {
          console.error('Error subscribing to newsletter:', error);
          showAlert(form, 'error', 'An error occurred during subscription');
        })
        .finally(() => {
          // Re-enable submit button
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        });
      });
    });
  }
  
  // Validate email format
  function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Helper function to show alert
  function showAlert(form, type, message) {
    let alertElement = form.nextElementSibling;
    
    if (!alertElement || !alertElement.classList.contains('newsletter-alert')) {
      alertElement = document.createElement('div');
      alertElement.className = `newsletter-alert ${type}`;
      
      // Insert alert after form
      form.parentNode.insertBefore(alertElement, form.nextSibling);
    } else {
      // Update existing alert
      alertElement.className = `newsletter-alert ${type}`;
    }
    
    alertElement.textContent = message;
    alertElement.style.display = 'block';
    
    // Auto-hide alert after 5 seconds
    clearTimeout(alertElement.hideTimeout);
    alertElement.hideTimeout = setTimeout(() => {
      alertElement.style.display = 'none';
    }, 5000);
  }
}); 