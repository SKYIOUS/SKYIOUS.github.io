# SKYIOUS Backend API

This is the backend API for the SKYIOUS website, providing services for authentication, blog management, resource management, newsletter subscriptions, and contact forms.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the backend directory with the following environment variables:
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

3. Start MongoDB:
   - If you have MongoDB installed locally, start it with `mongod`
   - Or use MongoDB Atlas by updating the `MONGODB_URI` in your `.env` file

4. Run the server:
   ```
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current logged in user
- `GET /api/auth/logout` - Logout user
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password
- `GET /api/auth/github` - GitHub OAuth login
- `GET /api/auth/google` - Google OAuth login

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/pending` - Get users pending approval (Admin only)
- `GET /api/users/:id` - Get single user (Admin only)
- `PUT /api/users/:id/approval` - Approve/reject user (Admin only)
- `PUT /api/users/:id/role` - Change user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PUT /api/users/profile` - Update current user profile
- `PUT /api/users/updatepassword` - Update current user password

### Blogs

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog (Login required)
- `PUT /api/blogs/:id` - Update blog (Author or Admin only)
- `DELETE /api/blogs/:id` - Delete blog (Author or Admin only)
- `POST /api/blogs/:id/comments` - Add comment to blog (Login required)
- `PUT /api/blogs/:id/like` - Like/unlike blog (Login required)

### Newsletter

- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/unsubscribe` - Unsubscribe link for emails
- `GET /api/newsletter/subscribers` - Get all subscribers (Admin only)
- `POST /api/newsletter/send` - Send newsletter to subscribers (Admin only)

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (Admin only)
- `GET /api/contact/:id` - Get single contact submission (Admin only)
- `PUT /api/contact/:id` - Update contact submission (Admin only)
- `DELETE /api/contact/:id` - Delete contact submission (Admin only)

## Authentication

The API uses JWT (JSON Web Token) for authentication. When a user logs in, a token is returned, which should be included in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

## User Approval Process

New user registrations require admin approval before they can log in. When a user registers, their account status is set to "pending". An admin can approve or reject users through the admin dashboard. 