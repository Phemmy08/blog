/* ═══════════════════════════════════════════════
   about.js — ALL JavaScript for the About page
   Fully standalone. No other JS file needed.
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initMilestoneCounter();
    initCardTilt();
    initVisualParallax();
});

/* ══════════════════════════════════════════════
   NAVBAR — scroll shrink + hamburger drawer
══════════════════════════════════════════════ */
function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    // Shrink navbar on scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Toggle mobile drawer
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close drawer on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close drawer when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
   .reveal elements fade up when they enter view
══════════════════════════════════════════════ */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Stagger siblings inside the same parent
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
            const delay    = siblings.indexOf(entry.target) * 120;

            setTimeout(() => entry.target.classList.add('visible'), delay);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   MILESTONE YEAR COUNTER
   Counts up 4-digit years when they scroll in
══════════════════════════════════════════════ */
function initMilestoneCounter() {
    const years = document.querySelectorAll('.m-year');
    if (!years.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el  = entry.target;
            const raw = el.textContent.trim();

            // Only animate pure 4-digit years
            if (!/^\d{4}$/.test(raw)) { observer.unobserve(el); return; }

            const target   = parseInt(raw, 10);
            const start    = target - 80;
            const duration = 900;
            let startTime  = null;

            const step = (ts) => {
                if (!startTime) startTime = ts;
                const progress = Math.min((ts - startTime) / duration, 1);
                const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                el.textContent = Math.round(start + (target - start) * eased);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = raw; // restore exact original
            };

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    years.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   PURPOSE CARD TILT
   Subtle 3-D tilt effect on mouse move
══════════════════════════════════════════════ */
function initCardTilt() {
    document.querySelectorAll('.p-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect    = card.getBoundingClientRect();
            const cx      = rect.width  / 2;
            const cy      = rect.height / 2;
            const rotateX = ((e.clientY - rect.top  - cy) / cy) * -4;
            const rotateY = ((e.clientX - rect.left - cx) / cx) *  4;
            card.style.transform =
                `translateX(4px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

/* ══════════════════════════════════════════════
   VISUAL IMAGE PARALLAX
   History image moves slightly on scroll
══════════════════════════════════════════════ */
function initVisualParallax() {
    const img = document.querySelector('.visual-img');
    if (!img) return;

    window.addEventListener('scroll', () => {
        const rect     = img.getBoundingClientRect();
        const winH     = window.innerHeight;
        const progress = (winH - rect.top) / (winH + rect.height);
        const offset   = (progress - 0.5) * 30; // ±15px
        img.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    }, { passive: true });
}