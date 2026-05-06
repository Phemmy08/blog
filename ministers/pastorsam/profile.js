/* ═══════════════════════════════════════════════
   C&S Ministers — profile.js
   Works alongside js/script.js (handles navbar)
   ═══════════════════════════════════════════════ */


/* ══════════════════════════════════════════════
   LEFT COLUMN — slides in from left on load
══════════════════════════════════════════════ */
function initLeftReveal() {
    const left = document.querySelector('.pg-left');
    if (!left) return;

    left.style.opacity = '0';
    left.style.transform = 'translateX(-28px)';
    left.style.transition = 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s';

    // Small timeout so transition registers after paint
    setTimeout(() => {
        left.style.opacity = '1';
        left.style.transform = 'translateX(0)';
    }, 80);
}


/* ══════════════════════════════════════════════
   DETAILS LIST — rows stagger in on scroll
══════════════════════════════════════════════ */
function initDetailsStagger() {
    const items = document.querySelectorAll('.pg-details-list li');
    if (!items.length) return;

    items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                items.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    const card = document.querySelector('.pg-details-card');
    if (card) observer.observe(card);
}


/* ══════════════════════════════════════════════
   SCRIPTURE STRIP — fades up on scroll
══════════════════════════════════════════════ */
function initScriptureReveal() {
    const strip = document.querySelector('.pg-scripture');
    if (!strip) return;

    strip.style.opacity = '0';
    strip.style.transform = 'translateY(20px)';
    strip.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                strip.style.opacity = '1';
                strip.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    observer.observe(strip);
}


/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    initLeftReveal();
    initDetailsStagger();
    initScriptureReveal();
});