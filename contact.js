// ============================================================
// CONTACT FORM — client-side validation + submit feedback.
// Sends through EmailJS when window.EMAILJS_CONFIG (emailjs-config.js)
// has been filled in with real IDs; otherwise falls back to the
// original front-end-only demo confirmation so the form still feels
// complete before that's set up.
// ============================================================
(function () {
  function emailjsReady() {
    const cfg = window.EMAILJS_CONFIG;
    return typeof window.emailjs !== 'undefined' && cfg &&
      cfg.publicKey && !cfg.publicKey.startsWith('YOUR_') &&
      cfg.serviceId && !cfg.serviceId.startsWith('YOUR_') &&
      cfg.contactTemplateId && !cfg.contactTemplateId.startsWith('YOUR_');
  }
  if (emailjsReady()) {
    try { emailjs.init({ publicKey: window.EMAILJS_CONFIG.publicKey }); } catch (e) {}
  }
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
    const firstName = fields.name.input.value.trim().split(' ')[0];

    function showSuccess(msg) {
      status.className = 'form-status is-visible is-success';
      status.textContent = msg;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
    }
    function showError(msg) {
      status.className = 'form-status is-visible is-error';
      status.textContent = msg;
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }

    if (emailjsReady()) {
      emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.contactTemplateId, {
        from_name: fields.name.input.value.trim(),
        from_email: fields.email.input.value.trim(),
        subject: fields.subject.input.value.trim(),
        message: fields.message.input.value.trim(),
      }).then(() => {
        showSuccess(`Thanks, ${firstName} — your message is on its way. I'll get back to you soon.`);
      }).catch(() => {
        showError(`Sorry ${firstName}, that didn't send. Please email alishbaw026@gmail.com directly instead.`);
      });
    } else {
      // Demo fallback until EmailJS is configured — see emailjs-config.js
      setTimeout(() => {
        showSuccess(`Thanks, ${firstName} — your message is drafted. Email alishbaw026@gmail.com directly for the fastest reply.`);
      }, 700);
    }
  });
})();
