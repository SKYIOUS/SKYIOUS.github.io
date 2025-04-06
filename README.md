# SKYIOUS Portfolio Website

A modern, responsive portfolio website for SKYIOUS to showcase projects and skills.

## Features

- Responsive design that works on all devices
- Modern and clean user interface
- Project showcase with filtering functionality
- Blog platform with comments and likes
- Resources and tutorials section
- User registration and login with admin approval
- GitHub and Google OAuth integration
- Newsletter subscription system
- Contact form with email notifications
- Admin dashboard for content management
- Dark/light theme toggling
- Animation effects
- Social media integration

## Directory Structure

```
SKYIOUS.github.io/
├── index.html                # Main homepage
├── projects.html             # Projects listing page
├── styles.css                # Main stylesheet
├── scripts.js                # JavaScript functionality
├── navigation.js             # Navigation functionality
├── security.js               # User authentication and security functions
├── backend/                  # Backend server for API functionality
│   ├── server.js             # Main server file
│   ├── models/               # Database models
│   ├── controllers/          # API controllers
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── config/               # Configuration files
│   └── public/               # Frontend integration scripts
├── account/                  # User account pages
├── admin/                    # Admin dashboard pages
├── blog/                     # Blog pages
├── resources/                # Resources and tutorials
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

## Backend Setup

The website includes a backend API server for handling dynamic functionality:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following environment variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skyious
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   EMAIL_FROM=your_email@gmail.com
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

4. Start MongoDB:
   - If you have MongoDB installed locally, start it with `mongod`
   - Or use MongoDB Atlas by updating the `MONGODB_URI` in your `.env` file

5. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## Deployment with GitHub Pages

The frontend of this website is designed to be deployed using GitHub Pages:

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

## Deployment with Backend

For deployment with the backend functionality:

1. Deploy the frontend to GitHub Pages as described above

2. Deploy the backend to a hosting service like Heroku, Render, or DigitalOcean:
   - Create an account on your chosen hosting platform
   - Set up a new project/app
   - Connect to your GitHub repository
   - Configure environment variables
   - Deploy the backend subdirectory

3. Update the API base URL in the frontend:
   - Edit the API_BASE_URL variable in security.js to point to your deployed backend
   - For example: `const API_BASE_URL = 'https://your-backend-domain.com/api';`

4. For detailed deployment instructions specific to each platform, refer to:
   - [Heroku Deployment Guide](https://devcenter.heroku.com/articles/deploying-nodejs)
   - [Render Deployment Guide](https://render.com/docs/deploy-node-express-app)
   - [DigitalOcean App Platform Guide](https://www.digitalocean.com/docs/app-platform/)

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