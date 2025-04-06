/**
 * Contact Form Integration
 * 
 * This file provides functionality to connect the frontend contact form
 * with the backend API. Include this script in your contact form page.
 */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Validate form data
      if (!name || !email || !subject || !message) {
        showAlert('error', 'Please fill in all required fields');
        return;
      }
      
      // Disable submit button and show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      // Submit form to API
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      })
      .then(response => response.json())
      .then(data => {
        // Reset form
        contactForm.reset();
        
        // Show success message
        if (data.success) {
          showAlert('success', data.message || 'Your message has been sent successfully!');
        } else {
          showAlert('error', data.message || 'An error occurred while sending your message');
        }
      })
      .catch(error => {
        console.error('Error submitting contact form:', error);
        showAlert('error', 'An error occurred while sending your message');
      })
      .finally(() => {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
    });
  }
  
  // Helper function to show alert
  function showAlert(type, message) {
    const alertElement = document.getElementById('contactAlert');
    
    if (!alertElement) {
      const newAlertElement = document.createElement('div');
      newAlertElement.id = 'contactAlert';
      newAlertElement.className = `alert ${type}`;
      newAlertElement.textContent = message;
      
      // Insert alert before form
      contactForm.parentNode.insertBefore(newAlertElement, contactForm);
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        newAlertElement.remove();
      }, 5000);
    } else {
      // Update existing alert
      alertElement.className = `alert ${type}`;
      alertElement.textContent = message;
      
      // Make sure it's visible
      alertElement.style.display = 'block';
      
      // Reset auto-hide timer
      clearTimeout(alertElement.hideTimeout);
      alertElement.hideTimeout = setTimeout(() => {
        alertElement.style.display = 'none';
      }, 5000);
    }
  }
});

/**
 * Example HTML for contact form:
 * 
 * <form id="contactForm">
 *   <div class="form-group">
 *     <label for="name">Name</label>
 *     <input type="text" id="name" name="name" required>
 *   </div>
 *   <div class="form-group">
 *     <label for="email">Email</label>
 *     <input type="email" id="email" name="email" required>
 *   </div>
 *   <div class="form-group">
 *     <label for="subject">Subject</label>
 *     <input type="text" id="subject" name="subject" required>
 *   </div>
 *   <div class="form-group">
 *     <label for="message">Message</label>
 *     <textarea id="message" name="message" required></textarea>
 *   </div>
 *   <button type="submit" class="btn primary-btn">Send Message</button>
 * </form>
 * 
 * <script src="/backend/public/contactForm.js"></script>
 */ 