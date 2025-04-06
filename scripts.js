$(document).ready(function() {
    // Set current year in footer
    $('#currentYear').text(new Date().getFullYear());
    
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
    
    // Smooth scroll for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu when clicking a navigation link
        $('.nav-links').removeClass('active');
        $('.menu-toggle i').removeClass('fa-times').addClass('fa-bars');
        
        const targetId = $(this).attr('href');
        const targetPosition = $(targetId).offset().top;
        
        $('html, body').animate({
            scrollTop: targetPosition - 50
        }, 800);
    });
    
    // Add active class to navigation links on scroll
    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();
        
        // Add shadow to navigation on scroll
        if (scrollPosition > 10) {
            $('nav').addClass('shadow');
        } else {
            $('nav').removeClass('shadow');
        }
        
        // Highlight active navigation link
        $('section').each(function() {
            const sectionTop = $(this).offset().top - 100;
            const sectionBottom = sectionTop + $(this).outerHeight();
            const sectionId = $(this).attr('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $('.nav-links a').removeClass('active');
                $(`.nav-links a[href="#${sectionId}"]`).addClass('active');
            }
        });
    });
    
    // Contact form submission
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation using regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Form submission feedback
        // In a real application, this would be an AJAX request to a backend service
        alert('Thanks for your message! I will get back to you soon.');
        
        // Reset form
        this.reset();
    });
    
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
    $('.project-card, .skill-item, .about-image').addClass('animate-on-scroll');
    
    // Initial animation check
    animateOnScroll();
    
    // Run animation check on scroll
    $(window).on('scroll', animateOnScroll);
    
    // Project filter functionality (for projects page)
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
}); 