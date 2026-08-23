// ============================================================
// NAV — blur-on-scroll, active-section sliding pill, mobile menu
// ============================================================
(function () {
  const nav = document.getElementById('siteNav');
  const navLinks = document.getElementById('navLinks');
  const navPill = document.getElementById('navPill');
  const burger = document.getElementById('navBurger');
  const scrim = document.getElementById('navScrim');
  const links = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = links
    .map((a) => document.getElementById(a.getAttribute('data-nav')))
    .filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function movePill(link) {
    if (!navPill || !link || window.innerWidth <= 900) return;
    navPill.style.width = link.offsetWidth + 'px';
    navPill.style.transform = `translateX(${link.offsetLeft - 6}px)`;
    navPill.style.opacity = '1';
  }

  let activeLink = null;
  function setActive(id) {
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('data-nav') === id));
    const link = links.find((a) => a.getAttribute('data-nav') === id);
    if (link) { activeLink = link; movePill(link); }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));

  window.addEventListener('resize', () => activeLink && movePill(activeLink));

  // mobile menu toggle
  function closeMenu() {
    navLinks && navLinks.classList.remove('is-open');
    burger && burger.classList.remove('is-open');
    burger && burger.setAttribute('aria-expanded', 'false');
    scrim && scrim.classList.remove('is-open');
  }
  function openMenu() {
    navLinks && navLinks.classList.add('is-open');
    burger && burger.classList.add('is-open');
    burger && burger.setAttribute('aria-expanded', 'true');
    scrim && scrim.classList.add('is-open');

    if (typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && navLinks) {
      gsap.fromTo(navLinks.querySelectorAll('a'),
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', stagger: 0.045, delay: 0.08, overwrite: true });
    }
  }
  burger && burger.addEventListener('click', () => {
    navLinks && navLinks.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  scrim && scrim.addEventListener('click', closeMenu);
  links.forEach((a) => a.addEventListener('click', closeMenu));

  // set initial active state
  setActive('hero');
})();
