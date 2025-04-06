# SKYIOUS Portfolio Website

A modern, responsive portfolio website for SKYIOUS to showcase projects and skills.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- Project showcase with filtering functionality
- Skills and expertise section
- Contact form
- Animation effects
- Social media integration

## Directory Structure

```
SKYIOUS.github.io/
├── index.html                # Main homepage
├── projects.html             # Projects listing page
├── styles.css                # Main stylesheet
├── scripts.js                # JavaScript functionality
├── assets/                   # Directory for images and other assets
│   ├── profile.jpg           # Profile image
│   ├── header-bg.jpg         # Header background
│   ├── project1.jpg          # Project images
│   ├── project2.jpg
│   └── ...
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/SKYIOUS/SKYIOUS.github.io.git
   cd SKYIOUS.github.io
   ```

2. Customize the website content:
   - Update profile information in `index.html`
   - Replace project details and images
   - Modify skills and expertise
   - Update contact information

3. Replace placeholder images:
   - Create an `assets` directory
   - Add your profile picture as `profile.jpg`
   - Add project images with appropriate names
   - Add a header background image as `header-bg.jpg`

## Deployment with GitHub Pages

This website is designed to be deployed using GitHub Pages:

1. Push all changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```

2. Configure GitHub Pages:
   - Go to your repository settings
   - Scroll down to the GitHub Pages section
   - Select the main branch as the source
   - Click Save

3. Your website will be available at `https://SKYIOUS.github.io`

## Customization

### Changing Colors

The color scheme can be easily customized by modifying the CSS variables in the `:root` selector in `styles.css`:

```css
:root {
    --primary-color: #4F46E5;
    --primary-dark: #3730A3;
    --secondary-color: #14B8A6;
    /* Other color variables */
}
```

### Adding New Projects

To add a new project to the projects page:

1. Add a new project image to the `assets` directory
2. Copy an existing project card HTML from `projects.html`
3. Update the image source, title, description, and tags
4. Add the appropriate `data-category` attribute for filtering

### Adding More Pages

To add more pages to the website:

1. Create a new HTML file based on the existing structure
2. Link to it from the navigation menu in all pages
3. Use the same CSS and JavaScript files for consistent styling and functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact SKYIOUS directly through the website contact form or via GitHub. 