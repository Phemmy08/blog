/* ═══════════════════════════════════════════════
   C&S Ministers — Main Script
   ═══════════════════════════════════════════════ */

/* ══ CONFIG: Add your actual image paths here ══
   The collage has 7 cells. Each cell cycles through
   ALL images below in a staggered rotation.
   ════════════════════════════════════════════════ */
const COLLAGE_IMAGES = [
    'images/1.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/6.jpg',
    'images/7.jpg',
    'images/8.jpg',
    'images/9.jpg',
    'images/10.jpg',
    'images/11.jpg',
    'images/12.jpg',
    'images/13.jpg',
    'images/pst-sam-makanju.jpg',

];

/* ══ Shuffle helper ══ */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ══════════════════════════════════════════════
   COLLAGE INITIALISER
══════════════════════════════════════════════ */
function initCollage() {
    const cells = document.querySelectorAll('.collage-cell');
    if (!cells.length) return;

    const images = shuffle(COLLAGE_IMAGES);
    const total  = images.length;

    // Assign initial background images — spread evenly across cells
    cells.forEach((cell, i) => {
        cell.style.backgroundImage = `url('${images[i % total]}')`;
    });

    // Rotate each cell independently with a staggered delay
    cells.forEach((cell, cellIndex) => {
        // Each cell starts from a different image in the pool
        let pointer = (cellIndex + 1) % total;

        const rotate = () => {
            // 1. Fade out
            cell.classList.add('fading');

            setTimeout(() => {
                // 2. Swap image while invisible
                cell.style.backgroundImage = `url('${images[pointer]}')`;
                pointer = (pointer + 1) % total;

                // 3. Fade back in
                cell.classList.remove('fading');
            }, 800); // matches CSS transition duration
        };

        // Stagger the start time per cell so they don't all change at once
        const staggerDelay = cellIndex * 700;   // 700 ms between each cell's first change
        const interval     = 4000;              // each cell changes every 4 s

        setTimeout(() => {
            rotate();                            // first rotation
            setInterval(rotate, interval);       // then repeat
        }, 2000 + staggerDelay);                 // 2 s initial delay + stagger
    });
}


/* ══════════════════════════════════════════════
   NAVBAR — Scroll shrink + hamburger
══════════════════════════════════════════════ */
function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    // Scroll shrink effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Hamburger toggle
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}


/* ══════════════════════════════════════════════
   FILTER MINISTERS
══════════════════════════════════════════════ */
function filterMinisters(title) {
    const cards   = document.querySelectorAll('.minister-card');
    const buttons = document.querySelectorAll('.filter-buttons button');

    // Active button state
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === title);
    });

    // Show / hide cards
    cards.forEach(card => {
        const cardTitle = card.dataset.title.toLowerCase();
        const show      = title === 'all' || cardTitle === title;

        if (show) {
            card.style.display = 'block';
            card.style.animation = 'none';
            // Trigger reflow for animation restart
            void card.offsetWidth;
            card.style.animation = 'fadeUp 0.45s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}


/* ══════════════════════════════════════════════
   SMOOTH SCROLL (anchor links)
══════════════════════════════════════════════ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Close mobile menu if open
            document.getElementById('navLinks')?.classList.remove('active');
            document.getElementById('hamburger')?.classList.remove('active');
        });
    });
}


/* ══════════════════════════════════════════════
   SCROLL-REVEAL (cards & sections)
══════════════════════════════════════════════ */
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.minister-card, .mission-inner, .section-header').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Inject reveal CSS once
    if (!document.getElementById('reveal-styles')) {
        const style = document.createElement('style');
        style.id    = 'reveal-styles';
        style.textContent = `
            .reveal {
                opacity: 0;
                transform: translateY(28px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .reveal.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}


/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCollage();
    initSmoothScroll();
    initScrollReveal();

    // Expose filterMinisters globally for inline onclick
    window.filterMinisters = filterMinisters;
});