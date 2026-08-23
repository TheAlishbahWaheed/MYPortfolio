// ============================================================
// CONTACT FORM — client-side validation + submit feedback.
// This is a front-end-only demo: no backend is wired up, so
// submissions aren't actually delivered anywhere yet.
// ============================================================
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const fields = {
    name: { input: document.getElementById('cName'), wrap: document.getElementById('fieldName'), validate: (v) => v.trim().length > 1 },
    email: { input: document.getElementById('cEmail'), wrap: document.getElementById('fieldEmail'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    subject: { input: document.getElementById('cSubject'), wrap: document.getElementById('fieldSubject'), validate: (v) => v.trim().length > 2 },
    message: { input: document.getElementById('cMessage'), wrap: document.getElementById('fieldMessage'), validate: (v) => v.trim().length > 9 }
  };

  Object.values(fields).forEach(({ input, wrap, validate }) => {
    input.addEventListener('input', () => {
      if (validate(input.value)) wrap.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    Object.values(fields).forEach(({ input, wrap, validate }) => {
      const valid = validate(input.value);
      wrap.classList.toggle('has-error', !valid);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      status.className = 'form-status is-visible is-error';
      status.textContent = 'Please fill in every field before sending.';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      status.className = 'form-status is-visible is-success';
      status.textContent = `Thanks, ${fields.name.input.value.trim().split(' ')[0]} — your message is drafted. Email alishbaw026@gmail.com directly for the fastest reply.`;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
    }, 700);
  });
})();
