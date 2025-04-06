$(document).ready(function() {
    // Set current year in footer
    $('#currentYear').text(new Date().getFullYear());
    
    // Theme toggle functionality
    const storedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', storedTheme);
    
    // Update theme toggle button based on current theme
    updateThemeToggle();
    
    $('#themeToggle').on('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        updateThemeToggle();
    });
    
    function updateThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            $('.theme-toggle .fa-moon').hide();
            $('.theme-toggle .fa-sun').show();
        } else {
            $('.theme-toggle .fa-moon').show();
            $('.theme-toggle .fa-sun').hide();
        }
    }
    
    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.nav-links').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.nav-links, .menu-toggle').length) {
            $('.nav-links').removeClass('active');
            $('.menu-toggle i').removeClass('fa-times').addClass('fa-bars');
        }
    });
    
    // Fixed navigation on scroll
    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();
        
        if (scrollPosition > 100) {
            $('nav').addClass('scrolled');
            $('.back-to-top').addClass('visible');
        } else {
            $('nav').removeClass('scrolled');
            $('.back-to-top').removeClass('visible');
        }
    });
    
    // Back to top functionality
    $('#backToTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });
    
    // Smooth scroll for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu when clicking a navigation link
        $('.nav-links').removeClass('active');
        $('.menu-toggle i').removeClass('fa-times').addClass('fa-bars');
        
        const targetId = $(this).attr('href');
        
        // Check if the target exists on the page
        if ($(targetId).length) {
            const targetPosition = $(targetId).offset().top - 80;
            
            $('html, body').animate({
                scrollTop: targetPosition
            }, 800);
        }
    });
    
    // Add active class to navigation links on scroll
    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();
        
        // Highlight active navigation link
        $('section').each(function() {
            const sectionTop = $(this).offset().top - 120;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const sectionId = $(this).attr('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $('.nav-links a').removeClass('active');
                $(`.nav-links a[href="#${sectionId}"]`).addClass('active');
            }
        });
    });
    
    // Project filtering
    $('.filter-btn').on('click', function() {
        const filterValue = $(this).attr('data-filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filterValue === 'all') {
            $('.project-card').show();
        } else {
            $('.project-card').hide();
            $(`.project-card[data-category="${filterValue}"]`).show();
        }
    });
    
    // Custom hash function for password security
    function customHash(str) {
        let hash = 0;
        const salt = "SKYIOUS";
        const peppered = salt + str + "secure";
        
        // Iterate through each character in the string
        for (let i = 0; i < peppered.length; i++) {
            // Get character code
            const char = peppered.charCodeAt(i);
            // Update hash using a custom formula
            hash = ((hash << 5) - hash) + char;
            // Convert to 32-bit integer
            hash = hash & hash;
        }
        
        // Add additional complexity
        hash = Math.abs(hash);
        let hashStr = hash.toString(16); // Convert to hex
        
        // Ensure consistent length by padding
        while (hashStr.length < 8) {
            hashStr = '0' + hashStr;
        }
        
        // Add timestamp-based component for additional uniqueness
        const timestamp = new Date().getTime() % 1000;
        const timestampHex = timestamp.toString(16).padStart(3, '0');
        
        return hashStr + timestampHex;
    }
    
    // Check if user is logged in
    function checkAuth() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
    
    // Handle login form submission
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        
        // Default credentials (in real-world scenario, these should not be hardcoded)
        const correctUsername = 'admin';
        const correctPasswordHash = 'e5c3abb7a26';
        
        if (username === correctUsername) {
            // Hash the entered password
            const hashedPassword = customHash(password);
            console.log('Debug hash:', hashedPassword.substring(0, 10)); // Only for testing
            
            // Check if the first 10 characters match
            // (we only compare part of the hash since our hash includes a timestamp component)
            if (hashedPassword.substring(0, 10).includes(correctPasswordHash.substring(0, 8))) {
                // Set logged in state
                localStorage.setItem('isLoggedIn', 'true');
                
                // Show success message
                showLoginStatus('success', 'Login successful! Redirecting...');
                
                // Redirect to admin page
                setTimeout(function() {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                showLoginStatus('error', 'Incorrect password');
            }
        } else {
            showLoginStatus('error', 'Username not found');
        }
    });
    
    function showLoginStatus(type, message) {
        const statusElement = $('#loginStatus');
        statusElement.text(message)
            .removeClass('success error')
            .addClass(type);
    }
    
    // Logout functionality
    $('#logoutBtn').on('click', function(e) {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'false');
        window.location.href = 'login.html';
    });
    
    // Redirect to login page if not logged in and trying to access admin page
    if (window.location.pathname.includes('admin.html') && !checkAuth()) {
        window.location.href = 'login.html';
    }
    
    // Contact form submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const subject = $('#subject').val();
        const message = $('#message').val().trim();
        const subscribe = $('#subscribe').is(':checked');
        
        if (!name || !email || !message) {
            showFormStatus('error', 'Please fill in all required fields');
            return;
        }
        
        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('error', 'Please enter a valid email address');
            return;
        }
        
        // Simulate form submission (in a real application, this would be an AJAX request)
        setTimeout(function() {
            // Simulate successful form submission
            showFormStatus('success', 'Thanks for your message! I will get back to you soon.');
            
            // Reset form
            $('#contactForm')[0].reset();
            
            // Clear status message after 5 seconds
            setTimeout(function() {
                $('#formStatus').text('').removeClass('success error');
            }, 5000);
            
        }, 1000);
    });
    
    function showFormStatus(type, message) {
        const statusElement = $('#formStatus');
        statusElement.text(message)
            .removeClass('success error')
            .addClass(type);
    }
    
    // Animate elements when they come into view
    function animateOnScroll() {
        const animatedElements = $('.animate-on-scroll');
        
        animatedElements.each(function() {
            const elementPosition = $(this).offset().top;
            const windowHeight = $(window).height();
            const scrollPosition = $(window).scrollTop();
            
            if (scrollPosition + windowHeight > elementPosition + 100) {
                $(this).addClass('animate');
            }
        });
    }
    
    // Add animation classes to elements
    $('.project-card, .feature-card, .about-image, .stat-item').addClass('animate-on-scroll');
    
    // Initial animation check
    animateOnScroll();
    
    // Run animation check on scroll
    $(window).on('scroll', animateOnScroll);
    
    // Load projects from localStorage
    function loadProjects() {
        const projectsGrid = $('#projectsGrid');
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        
        // Filter to show only featured projects on homepage
        const featuredProjects = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === ''
            ? projects.filter(p => p.featured)
            : projects;
        
        if (featuredProjects.length === 0) {
            $('.empty-projects-message').show();
            return;
        }
        
        let html = '';
        
        featuredProjects.forEach(project => {
            const tagsHtml = project.tags.map(tag => `<span>${tag}</span>`).join('');
            
            html += `
                <div class="project-card" data-category="${project.category}">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}">
                    </div>
                    <div class="project-details">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                        <a href="${project.link}" class="project-link" target="_blank">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
        });
        
        projectsGrid.html(html);
        
        // Re-add animation classes
        $('.project-card').addClass('animate-on-scroll');
        animateOnScroll();
    }
    
    // Load projects on page load
    if ($('#projectsGrid').length) {
        loadProjects();
    }
    
    // Newsletter subscribe form
    $('.newsletter-form').on('submit', function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val().trim();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate subscription (in a real application, this would be an AJAX request)
        alert('Thanks for subscribing to our newsletter!');
        this.reset();
    });
}); 