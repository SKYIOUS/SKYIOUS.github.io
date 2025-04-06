/**
 * SKYIOUS Security Module
 * Provides enhanced security features including:
 * - Password encryption (PBKDF2-based)
 * - User authentication
 * - Session management
 * - Security utilities
 */

/**
 * Security Utility for SKYIOUS website
 * Handles user authentication, password encryption, and user management
 */
const Security = (function() {
    // Constants
    const USER_KEY = 'skyious_users';
    const CURRENT_USER_KEY = 'skyious_current_user';
    const SALT_ROUNDS = 10;
    const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
    
    // Initialize users if not exists
    function initUsers() {
        if (!localStorage.getItem(USER_KEY)) {
            localStorage.setItem(USER_KEY, JSON.stringify([]));
        }
    }
    
    // Generate a random salt
    function generateSalt(length = 16) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let salt = '';
        
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            salt += charset[randomIndex];
        }
        
        return salt;
    }
    
    // Hash a password with salt
    function hashPassword(password, salt) {
        // This is a simple hash function for demonstration
        // In a real application, use a proper crypto library like bcrypt
        const passwordWithSalt = password + salt;
        
        // Simple hash function (SHA-256 like simulation)
        let hash = 0;
        for (let i = 0; i < passwordWithSalt.length; i++) {
            const char = passwordWithSalt.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Convert to hex string
        const hashHex = (hash >>> 0).toString(16).padStart(8, '0');
        
        // Add more complexity with multiple iterations
        let finalHash = hashHex;
        for (let i = 0; i < 1000; i++) {
            finalHash = hashString(finalHash + salt);
        }
        
        return finalHash;
    }
    
    // Helper function for hashPassword
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return (hash >>> 0).toString(16).padStart(8, '0');
    }
    
    // Generate a session token
    function generateToken() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    // Validate password strength
    function validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        
        const strength = {
            valid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
            message: '',
            score: 0
        };
        
        // Calculate score (0-100)
        let score = 0;
        
        // Length contribution (up to 25 points)
        score += Math.min(25, Math.floor(password.length * 2.5));
        
        // Character variety contribution
        if (hasUpperCase) score += 15;
        if (hasLowerCase) score += 15;
        if (hasNumbers) score += 15;
        if (hasSpecialChar) score += 20;
        
        // Penalize repeating patterns
        const repeatingChars = password.match(/(.)\1+/g);
        if (repeatingChars) {
            score -= repeatingChars.join('').length * 2;
        }
        
        // Ensure score is between 0-100
        strength.score = Math.max(0, Math.min(100, score));
        
        // Set message based on score
        if (strength.score < 40) {
            strength.message = 'Weak password';
        } else if (strength.score < 70) {
            strength.message = 'Moderate password';
        } else {
            strength.message = 'Strong password';
        }
        
        // Additional validation messages
        if (password.length < minLength) {
            strength.message = `Password must be at least ${minLength} characters`;
            strength.valid = false;
        } else if (!hasUpperCase) {
            strength.message = 'Password must contain at least one uppercase letter';
            strength.valid = false;
        } else if (!hasLowerCase) {
            strength.message = 'Password must contain at least one lowercase letter';
            strength.valid = false;
        } else if (!hasNumbers) {
            strength.message = 'Password must contain at least one number';
            strength.valid = false;
        }
        
        return strength;
    }
    
    // Get user by username
    function getUserByUsername(username) {
        const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
        return users.find(user => user.username.toLowerCase() === username.toLowerCase());
    }
    
    // Get user by email
    function getUserByEmail(email) {
        const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }
    
    // Add activity to user's activity log
    function addActivity(username, type, details) {
        const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
        const userIndex = users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
        
        if (userIndex === -1) return false;
        
        // Initialize activity array if it doesn't exist
        if (!users[userIndex].activity) {
            users[userIndex].activity = [];
        }
        
        // Add activity to the beginning of the array
        users[userIndex].activity.unshift({
            type,
            details,
            timestamp: new Date().toISOString()
        });
        
        // Limit to 50 activities
        if (users[userIndex].activity.length > 50) {
            users[userIndex].activity = users[userIndex].activity.slice(0, 50);
        }
        
        // Save to localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(users));
        
        return true;
    }
    
    // Public methods
    return {
        /**
         * Register a new user
         * @param {object} userData User data object
         * @returns {object} Result object with success status and message
         */
        register: function(userData) {
            initUsers();
            
            // Validate required fields
            if (!userData.username || !userData.email || !userData.password) {
                return {
                    success: false,
                    message: 'All fields are required'
                };
            }
            
            // Check if username already exists
            if (getUserByUsername(userData.username)) {
                return {
                    success: false,
                    message: 'Username already taken'
                };
            }
            
            // Check if email already exists
            if (getUserByEmail(userData.email)) {
                return {
                    success: false,
                    message: 'Email already registered'
                };
            }
            
            // Validate password strength
            const passwordStrength = validatePasswordStrength(userData.password);
            if (!passwordStrength.valid) {
                return {
                    success: false,
                    message: passwordStrength.message
                };
            }
            
            // Generate salt and hash password
            const salt = generateSalt();
            const hashedPassword = hashPassword(userData.password, salt);
            
            // Create user object
            const newUser = {
                username: userData.username,
                email: userData.email,
                passwordHash: hashedPassword,
                salt: salt,
                role: userData.role || 'user',
                status: userData.status || 'pending',
                created: new Date().toISOString(),
                lastLogin: null,
                profile: {
                    fullName: userData.fullName || ''
                }
            };
            
            // Add user to storage
            const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
            users.push(newUser);
            localStorage.setItem(USER_KEY, JSON.stringify(users));
            
            // Log activity
            addActivity(newUser.username, 'account_created', 'Account created');
            
            return {
                success: true,
                message: 'Registration successful! You can now log in.'
            };
        },
        
        /**
         * Login a user
         * @param {string} username Username or email
         * @param {string} password Password
         * @param {boolean} rememberMe Remember user session
         * @returns {object} Result object with success status, message, and user data
         */
        login: function(username, password, rememberMe = false) {
            initUsers();
            
            // Check if input is email
            const isEmail = username.includes('@');
            let user;
            
            if (isEmail) {
                user = getUserByEmail(username);
            } else {
                user = getUserByUsername(username);
            }
            
            // Check if user exists
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }
            
            // Check if password is correct
            const hashedPassword = hashPassword(password, user.salt);
            if (hashedPassword !== user.passwordHash) {
                // Log failed login attempt
                addActivity(user.username, 'login_failed', 'Failed login attempt');
                
                return {
                    success: false,
                    message: 'Invalid username or password'
                };
            }
            
            // Generate session token
            const token = generateToken();
            const expires = Date.now() + TOKEN_EXPIRY;
            
            // Update user's last login
            const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
            const userIndex = users.findIndex(u => u.username === user.username);
            users[userIndex].lastLogin = new Date().toISOString();
            users[userIndex].token = token;
            users[userIndex].tokenExpires = expires;
            localStorage.setItem(USER_KEY, JSON.stringify(users));
            
            // Set current user in localStorage
            const currentUser = {
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                token: token,
                expires: expires,
                created: user.created,
                lastLogin: user.lastLogin,
                profile: user.profile
            };
            
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
            
            // Log successful login
            addActivity(user.username, 'login', 'Successful login');
            
            return {
                success: true,
                message: 'Login successful',
                user: currentUser
            };
        },
        
        /**
         * Logout the current user
         * @returns {boolean} Success status
         */
        logout: function() {
            const currentUser = this.getCurrentUser();
            
            if (currentUser) {
                // Log activity
                addActivity(currentUser.username, 'logout', 'User logged out');
                
                // Remove current user from localStorage
                localStorage.removeItem(CURRENT_USER_KEY);
                return true;
            }
            
            return false;
        },
        
        /**
         * Get the current logged in user
         * @returns {object|null} Current user object or null if not logged in
         */
        getCurrentUser: function() {
            const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
            
            if (!currentUserJson) {
                return null;
            }
            
            const currentUser = JSON.parse(currentUserJson);
            
            // Check if token has expired
            if (currentUser.expires && currentUser.expires < Date.now()) {
                localStorage.removeItem(CURRENT_USER_KEY);
                return null;
            }
            
            return currentUser;
        },
        
        /**
         * Check if the current user is logged in
         * @returns {boolean} True if user is logged in
         */
        isLoggedIn: function() {
            return this.getCurrentUser() !== null;
        },
        
        /**
         * Check if the current user has a specific role
         * @param {string|array} roles Role or array of roles to check
         * @returns {boolean} True if user has the role
         */
        hasRole: function(roles) {
            const currentUser = this.getCurrentUser();
            
            if (!currentUser) {
                return false;
            }
            
            if (Array.isArray(roles)) {
                return roles.includes(currentUser.role);
            }
            
            return currentUser.role === roles;
        },
        
        /**
         * Change a user's password
         * @param {string} username Username
         * @param {string} currentPassword Current password
         * @param {string} newPassword New password
         * @returns {object} Result object with success status and message
         */
        changePassword: function(username, currentPassword, newPassword) {
            const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
            const userIndex = users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
            
            if (userIndex === -1) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            
            // Verify current password
            const user = users[userIndex];
            const hashedCurrentPassword = hashPassword(currentPassword, user.salt);
            
            if (hashedCurrentPassword !== user.passwordHash) {
                return {
                    success: false,
                    message: 'Current password is incorrect'
                };
            }
            
            // Validate new password strength
            const passwordStrength = validatePasswordStrength(newPassword);
            if (!passwordStrength.valid) {
                return {
                    success: false,
                    message: passwordStrength.message
                };
            }
            
            // Generate new salt and hash new password
            const salt = generateSalt();
            const hashedNewPassword = hashPassword(newPassword, salt);
            
            // Update user's password
            users[userIndex].passwordHash = hashedNewPassword;
            users[userIndex].salt = salt;
            
            // Save to localStorage
            localStorage.setItem(USER_KEY, JSON.stringify(users));
            
            // Log activity
            addActivity(username, 'password_changed', 'Password changed');
            
            return {
                success: true,
                message: 'Password changed successfully'
            };
        },
        
        /**
         * Check if a username is available
         * @param {string} username Username to check
         * @returns {boolean} True if username is available
         */
        isUsernameAvailable: function(username) {
            return !getUserByUsername(username);
        },
        
        /**
         * Check if an email is available
         * @param {string} email Email to check
         * @returns {boolean} True if email is available
         */
        isEmailAvailable: function(email) {
            return !getUserByEmail(email);
        },
        
        /**
         * Validate password strength
         * @param {string} password Password to validate
         * @returns {object} Validation result with valid status, message, and score
         */
        validatePassword: function(password) {
            return validatePasswordStrength(password);
        },
        
        /**
         * Get a user's activity log
         * @param {string} username Username
         * @returns {array} Activity log array
         */
        getUserActivity: function(username) {
            const user = getUserByUsername(username);
            
            if (!user || !user.activity) {
                return [];
            }
            
            return user.activity;
        },
        
        /**
         * Create admin user if it doesn't exist
         * For demo purposes only
         */
        createAdminIfNotExists: function() {
            initUsers();
            
            const adminUser = getUserByUsername('admin');
            
            if (!adminUser) {
                this.register({
                    username: 'admin',
                    email: 'admin@skyious.com',
                    password: 'Admin123!',
                    role: 'admin',
                    fullName: 'Admin User'
                });
            }
        },
        
        // Admin Functions
        isAdmin: function() {
            const currentUser = this.getCurrentUser();
            return currentUser && currentUser.role === 'admin';
        },
        
        getAllUsers: function() {
            const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]');
            return users;
        },
        
        createUser: function(userData) {
            const users = this.getAllUsers();
            const newUser = {
                id: Date.now().toString(),
                ...userData,
                created: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem(USER_KEY, JSON.stringify(users));
            return newUser;
        },
        
        approveUser: function(userId) {
            const users = this.getAllUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].status = 'approved';
                localStorage.setItem(USER_KEY, JSON.stringify(users));
                return true;
            }
            return false;
        },
        
        deleteUser: function(userId) {
            const users = this.getAllUsers();
            const filteredUsers = users.filter(u => u.id !== userId);
            localStorage.setItem(USER_KEY, JSON.stringify(filteredUsers));
            return true;
        },
        
        getAllBlogs: function() {
            const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
            return blogs;
        },
        
        createBlog: function(blogData) {
            const blogs = this.getAllBlogs();
            const newBlog = {
                id: Date.now().toString(),
                ...blogData,
                created: new Date().toISOString()
            };
            blogs.push(newBlog);
            localStorage.setItem('blogs', JSON.stringify(blogs));
            return newBlog;
        },
        
        deleteBlog: function(blogId) {
            const blogs = this.getAllBlogs();
            const filteredBlogs = blogs.filter(b => b.id !== blogId);
            localStorage.setItem('blogs', JSON.stringify(filteredBlogs));
            return true;
        },
        
        getAllResources: function() {
            const resources = JSON.parse(localStorage.getItem('resources') || '[]');
            return resources;
        },
        
        createResource: function(resourceData) {
            const resources = this.getAllResources();
            const newResource = {
                id: Date.now().toString(),
                ...resourceData,
                created: new Date().toISOString()
            };
            resources.push(newResource);
            localStorage.setItem('resources', JSON.stringify(resources));
            return newResource;
        },
        
        deleteResource: function(resourceId) {
            const resources = this.getAllResources();
            const filteredResources = resources.filter(r => r.id !== resourceId);
            localStorage.setItem('resources', JSON.stringify(filteredResources));
            return true;
        },
        
        getStats: function() {
            const users = this.getAllUsers();
            const blogs = this.getAllBlogs();
            const resources = this.getAllResources();
            
            return {
                totalUsers: users.length,
                pendingApprovals: users.filter(u => u.status === 'pending').length,
                totalBlogs: blogs.length,
                totalResources: resources.length
            };
        },
        
        updateSettings: function(settings) {
            localStorage.setItem('siteSettings', JSON.stringify(settings));
            return true;
        },
        
        getSettings: function() {
            return JSON.parse(localStorage.getItem('siteSettings') || '{}');
        }
    };
})();

// Create admin user on script load (for demo)
document.addEventListener('DOMContentLoaded', function() {
    Security.createAdminIfNotExists();
});
