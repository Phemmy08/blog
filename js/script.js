// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Initialize filter buttons
    initializeFilterButtons();
});

// Filter Ministers by Title
function filterMinisters(title) {
    const cards = document.querySelectorAll('.minister-card');
    const buttons = document.querySelectorAll('.filter-buttons button');
    
    // Update active button
    buttons.forEach(button => {
        if (button.textContent.toLowerCase() === title) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Filter cards
    cards.forEach(card => {
        const ministerTitle = card.getAttribute('data-title').toLowerCase();
        if (title === 'all' || ministerTitle === title.toLowerCase()) {
            card.style.display = 'block';
            // Add fade-in animation
            card.style.animation = 'fadeIn 0.5s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize filter buttons
function initializeFilterButtons() {
    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const title = this.textContent.toLowerCase();
            filterMinisters(title);
        });
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Add CSS animation for fade-in effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 