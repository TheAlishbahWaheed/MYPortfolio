// ============================================================
// PROJECTS — category filters + project detail modal
// ============================================================
(function () {
  const filters = document.querySelectorAll('.proj-filter');
  const cards = document.querySelectorAll('.proj-card');
  const empty = document.getElementById('projEmpty');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.getAttribute('data-filter');
      let visibleCount = 0;

      cards.forEach((card) => {
        const cats = (card.getAttribute('data-category') || '').split(' ');
        const match = filter === 'all' || cats.includes(filter);
        card.classList.toggle('is-hidden', !match);
        if (match) visibleCount++;
      });

      empty && empty.classList.toggle('is-visible', visibleCount === 0);
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
