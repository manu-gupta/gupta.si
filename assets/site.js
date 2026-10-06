(() => {
    const b = document.querySelector('.menu-toggle'),
        m = document.querySelector('.mobile-menu');
    if (!b || !m) return;
    b.onclick = () => {
        const o = m.classList.toggle('open');
        b.setAttribute('aria-expanded', o);
        m.setAttribute('aria-hidden', !o);
        document.body.style.overflow = o ? 'hidden' : ''
    };
    m.querySelectorAll('a').forEach(a => a.onclick = () => {
        m.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
        m.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''
    })
})();
