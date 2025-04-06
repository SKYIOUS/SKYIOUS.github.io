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
    
    // Testimonials slider
    const testimonialSlider = $('.testimonials-slider');
    const testimonialItems = $('.testimonial-container');
    const indicators = $('.indicator');
    let currentSlide = 0;
    const totalSlides = testimonialItems.length;
    
    // Set initial active slide
    updateSlider();
    
    // Next button
    $('.testimonial-control.next').on('click', function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });
    
    // Previous button
    $('.testimonial-control.prev').on('click', function() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });
    
    // Indicator clicks
    indicators.each(function(index) {
        $(this).on('click', function() {
            currentSlide = index;
            updateSlider();
        });
    });
    
    // Auto slide every 5 seconds
    let autoSlide = setInterval(function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);
    
    // Pause auto slide on hover
    testimonialSlider.hover(
        function() { clearInterval(autoSlide); },
        function() { 
            autoSlide = setInterval(function() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }, 5000);
        }
    );
    
    function updateSlider() {
        testimonialItems.css('transform', `translateX(-${currentSlide * 100}%)`);
        indicators.removeClass('active');
        indicators.eq(currentSlide).addClass('active');
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
    $('.project-card, .skill-item, .about-image, .stat-item, .testimonial').addClass('animate-on-scroll');
    
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