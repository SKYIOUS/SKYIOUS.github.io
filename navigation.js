// Navigation component that ensures consistency across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // Determine active link
    let activeNavItem = '';
    if (currentPage === 'index.html' || currentPage === '') {
        activeNavItem = 'home';
    } else if (currentPage === 'projects.html' || currentPage === 'project-detail.html') {
        activeNavItem = 'projects';
    } else if (currentPage.includes('blog')) {
        activeNavItem = 'resources-blog';
    } else if (currentPage.includes('resources')) {
        activeNavItem = 'resources-blog';
    } else if (currentPage.includes('account')) {
        activeNavItem = 'account';
    }
    
    // Convert relative paths based on current directory level
    let prefix = '';
    if (currentPath.includes('/blog/') || currentPath.includes('/resources/') || currentPath.includes('/account/') || currentPath.includes('/admin/')) {
        prefix = '../';
    }
    
    // Create navigation HTML
    const navHTML = `
        <div class="logo">SKYIOUS</div>
        <ul class="nav-links">
            <li><a href="${prefix}index.html" ${activeNavItem === 'home' ? 'class="active"' : ''}>Home</a></li>
            <li><a href="${prefix}index.html#about">About</a></li>
            <li><a href="${prefix}projects.html" ${activeNavItem === 'projects' ? 'class="active"' : ''}>Projects</a></li>
            <li><a href="${prefix}index.html#features">Features</a></li>
            <li class="dropdown">
                <a href="#" ${activeNavItem === 'resources-blog' ? 'class="active"' : ''}>Resources & Blog <i class="fas fa-chevron-down"></i></a>
                <div class="dropdown-content">
                    <a href="${prefix}blog/">Blog Articles</a>
                    <a href="${prefix}resources/">Learning Resources</a>
                </div>
            </li>
            <li><a href="${prefix}index.html#contact">Contact</a></li>
        </ul>
        <div class="nav-actions">
            <div class="account-link">
                <a href="${prefix}account/login.html" id="loginLink">Login</a>
                <a href="${prefix}account/dashboard.html" id="dashboardLink" style="display: none;">My Account</a>
            </div>
            <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark/light mode">
                <i class="fas fa-moon"></i>
                <i class="fas fa-sun"></i>
            </button>
            <div class="menu-toggle">
                <i class="fas fa-bars"></i>
            </div>
        </div>
    `;
    
    // Replace navigation in all pages
    const navElement = document.querySelector('nav');
    if (navElement) {
        navElement.innerHTML = navHTML;
    }
    
    // Add dropdown functionality
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            this.querySelector('.dropdown-content').style.display = 'block';
        });
        
        dropdown.addEventListener('mouseleave', function() {
            this.querySelector('.dropdown-content').style.display = 'none';
        });
        
        // For mobile, add click event
        dropdown.querySelector('a').addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownContent = this.parentNode.querySelector('.dropdown-content');
                dropdownContent.style.display = 
                    dropdownContent.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
    
    // Set theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set up mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Update login status
    setTimeout(function() {
        if (window.Security && typeof Security.isLoggedIn === 'function') {
            if (Security.isLoggedIn()) {
                document.getElementById('loginLink').style.display = 'none';
                document.getElementById('dashboardLink').style.display = 'inline-block';
            } else {
                document.getElementById('loginLink').style.display = 'inline-block';
                document.getElementById('dashboardLink').style.display = 'none';
            }
        }
    }, 100); // Small delay to ensure Security is loaded
}); 