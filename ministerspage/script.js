/* ═══════════════════════════════════════════════
   ministers.js — ALL JavaScript for the Ministers page
   Fully standalone. No other JS file needed.
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCards();
    initFilters();
    initSearch();
});

/* ══════════════════════════════════════════════
   NAVBAR — scroll shrink + hamburger drawer
══════════════════════════════════════════════ */
function initNavbar() {
    const navbar    = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ══════════════════════════════════════════════
   CARDS — staggered entrance animation
══════════════════════════════════════════════ */
function initCards() {
    const cards = document.querySelectorAll('.minister-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (!entry.isIntersecting) return;
            // Stagger by card index
            const idx = [...cards].indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 80);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}

/* ══════════════════════════════════════════════
   FILTERS — filter by data-title attribute
══════════════════════════════════════════════ */
function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards   = document.querySelectorAll('.minister-card');

    // Inject results count element above the grid
    const grid = document.querySelector('.ministers-grid');
    const countEl = document.createElement('p');
    countEl.className = 'results-count';
    grid.parentElement.insertBefore(countEl, grid);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            applyFilters(filter, getSearchQuery());
        });
    });

    // Initial count
    updateCount(cards.length, cards.length, countEl);
}

/* ══════════════════════════════════════════════
   SEARCH — live filter by name / title / church
══════════════════════════════════════════════ */
function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', () => {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        applyFilters(activeFilter, input.value.trim().toLowerCase());
    });
}

function getSearchQuery() {
    return document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
}

/* ══════════════════════════════════════════════
   APPLY FILTERS — combines category + search
══════════════════════════════════════════════ */
function applyFilters(category, query) {
    const cards    = document.querySelectorAll('.minister-card');
    const noResults = document.getElementById('noResults');
    const countEl  = document.querySelector('.results-count');
    let visible    = 0;

    cards.forEach(card => {
        const cardTitle  = (card.dataset.title || '').toLowerCase();
        const nameEl     = card.querySelector('h3');
        const titleEl    = card.querySelector('.title');
        const churchEl   = card.querySelector('.church');

        const name   = nameEl?.textContent.toLowerCase()   || '';
        const title  = titleEl?.textContent.toLowerCase()  || '';
        const church = churchEl?.textContent.toLowerCase() || '';

        const matchesCategory = category === 'all' || cardTitle === category;
        const matchesSearch   = !query ||
            name.includes(query) ||
            title.includes(query) ||
            church.includes(query);

        if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
            // Re-trigger entrance animation
            card.classList.remove('visible');
            void card.offsetWidth; // reflow
            setTimeout(() => card.classList.add('visible'), visible * 60);
            visible++;
        } else {
            card.classList.add('hidden');
        }
    });

    // No results message
    if (noResults) {
        noResults.classList.toggle('visible', visible === 0);
    }

    // Results count
    if (countEl) {
        updateCount(visible, cards.length, countEl);
    }
}

/* ══════════════════════════════════════════════
   UPDATE COUNT LABEL
══════════════════════════════════════════════ */
function updateCount(shown, total, el) {
    if (shown === total) {
        el.innerHTML = `Showing <span>all ${total}</span> ministers`;
    } else {
        el.innerHTML = `Showing <span>${shown}</span> of <span>${total}</span> ministers`;
    }
}