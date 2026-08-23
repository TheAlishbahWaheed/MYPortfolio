// ============================================================
// PROJECTS — category filters + project detail modal
// ============================================================
(function () {
  const filters = document.querySelectorAll('.proj-filter');
  const cards = document.querySelectorAll('.proj-card');
  const empty = document.getElementById('projEmpty');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && !reduceMotion;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter');

      const toShow = [];
      const toHide = [];
      cards.forEach((card) => {
        const cats = (card.getAttribute('data-category') || '').split(' ');
        const match = filter === 'all' || cats.includes(filter);
        (match ? toShow : toHide).push(card);
      });

      const finish = () => {
        empty && empty.classList.toggle('is-visible', toShow.length === 0);
      };

      if (hasGSAP) {
        // fade + settle the outgoing cards, then reveal the incoming set
        // with a light stagger — reads as a deliberate re-layout, not a snap.
        const tl = gsap.timeline({ onComplete: finish });
        if (toHide.length) {
          tl.to(toHide, {
            opacity: 0, y: -10, scale: 0.96, duration: 0.28, ease: 'power2.in', stagger: 0.02,
            onComplete: () => toHide.forEach((c) => c.classList.add('is-hidden'))
          });
        }
        tl.call(() => {
          toShow.forEach((c) => c.classList.remove('is-hidden'));
          gsap.set(toShow, { opacity: 0, y: 16, scale: 0.97 });
        });
        tl.to(toShow, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05 }, toHide.length ? '-=0.05' : 0);
      } else {
        toHide.forEach((c) => c.classList.add('is-hidden'));
        toShow.forEach((c) => c.classList.remove('is-hidden'));
        finish();
      }
    });
  });

  // ---- modal ----
  const modal = document.getElementById('projModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalDetails = document.getElementById('modalDetails');
  const modalRepo = document.getElementById('modalRepo');
  const modalLive = document.getElementById('modalLive');

  function openModal(card) {
    if (!modal) return;
    modalTitle.textContent = card.getAttribute('data-title') || '';
    modalDesc.textContent = card.getAttribute('data-desc') || '';

    const tags = (card.getAttribute('data-tags') || '').split(',').filter(Boolean);
    modalTags.innerHTML = tags.map((t) => `<span>${t.trim()}</span>`).join('');

    const details = (card.getAttribute('data-details') || '').split('|').filter(Boolean);
    modalDetails.innerHTML = details.map((d) => `<li>${d.trim()}</li>`).join('');

    const repo = card.getAttribute('data-repo');
    const live = card.getAttribute('data-live');
    if (repo) { modalRepo.href = repo; modalRepo.style.display = 'inline-flex'; } else { modalRepo.style.display = 'none'; }
    if (live) { modalLive.href = live; modalLive.style.display = 'inline-flex'; } else { modalLive.style.display = 'none'; }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // stagger the modal's content in on top of the CSS box scale/fade,
    // so it reads as a considered reveal rather than an instant swap
    if (typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const inner = [modalTitle, modalTags, modalDesc, modalDetails.querySelectorAll('li'), modal.querySelector('.modal-actions')]
        .flatMap((n) => (n instanceof NodeList ? Array.from(n) : n ? [n] : []));
      gsap.fromTo(inner, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.045, delay: 0.1, overwrite: true });
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let repo/live links behave normally
      openModal(card);
    });
    card.querySelector('.proj-more-btn') && card.querySelector('.proj-more-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(card);
    });
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  modal && modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();
