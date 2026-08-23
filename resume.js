// ============================================================
// RESUME MODAL — collects an email, then triggers the real
// resume.pdf download and shows a lightweight success state.
// No data leaves the browser; this is a front-end-only flow.
// ============================================================
(function () {
  const openBtn = document.getElementById('resumeOpenBtn');
  const modal = document.getElementById('resumeModal');
  const closeBtn = document.getElementById('resumeModalClose');
  const closeBtn2 = document.getElementById('resumeCloseBtn');
  const form = document.getElementById('resumeForm');
  const success = document.getElementById('resumeSuccess');
  const emailField = document.getElementById('fieldResumeEmail');
  const emailInput = document.getElementById('resumeEmail');
  const sendBtn = document.getElementById('resumeSendBtn');
  const downloadLink = document.getElementById('resumeDownloadLink');

  if (!modal) return;

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    form.classList.remove('is-hidden');
    success.classList.remove('is-visible');
    emailField.classList.remove('has-error');
    emailInput.value = '';
    setTimeout(() => emailInput.focus(), 300);

    if (typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const inner = form.querySelectorAll('.resume-icon, h3, p, .field, button');
      gsap.fromTo(inner, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05, delay: 0.12, overwrite: true });
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn && openBtn.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);
  closeBtn2 && closeBtn2.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  sendBtn && sendBtn.addEventListener('click', () => {
    const val = emailInput.value;
    if (!isValidEmail(val)) {
      emailField.classList.add('has-error');
      emailInput.focus();
      return;
    }
    emailField.classList.remove('has-error');

    sendBtn.textContent = 'Preparing download…';
    sendBtn.disabled = true;

    setTimeout(() => {
      downloadLink && downloadLink.click();
      form.classList.add('is-hidden');
      success.classList.add('is-visible');
      sendBtn.textContent = 'Send & Download';
      sendBtn.disabled = false;

      if (typeof window.gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(success.querySelectorAll('.check, h3, p, button'),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06, overwrite: true });
        gsap.fromTo(success.querySelector('.check'), { scale: 0.5, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2.2)' });
      }
    }, 500);
  });
})();
