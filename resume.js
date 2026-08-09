/* resume.js — email-gated resume delivery.
   Any visitor who enters their email gets:
     1) an instant browser download of resume.pdf, AND
     2) (once you finish the 3-step setup below) a copy emailed to them via EmailJS.

   ============================================================
   EMAILJS SETUP — do this once, it's free at https://www.emailjs.com

   1. Create an Email Service (Gmail/Outlook/etc.) → copy its "Service ID".
   2. Create an Email Template. Give it a variable like {{to_email}}
      (used as the recipient) and {{to_name}}. Then, in that same
      template's settings, open "Attachments" and upload resume.pdf so
      EmailJS attaches it automatically on every send — no need to
      attach it from JavaScript. Copy the template's "Template ID".
   3. Go to Account → API Keys → copy your "Public Key".
   4. Paste all three values into the constants below.

   Until you fill these in, the button still works — it just skips the
   email step and downloads resume.pdf directly, so nothing breaks
   while you set EmailJS up.
   ============================================================ */
(function () {
  "use strict";

  var EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
  var EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
  var EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

  var RESUME_FILE = "resume.pdf";
  var RESUME_DOWNLOAD_NAME = "Alishbah-Waheed-Resume.pdf";

  function isConfigured() {
    return EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
      EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" &&
      EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.emailjs && isConfigured()) {
      try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) {}
    }

    var openBtns = document.querySelectorAll("[data-resume-open]");
    var overlay = document.getElementById("resumeModalOverlay");
    if (!overlay || !openBtns.length) return;

    var closeBtn = document.getElementById("resumeModalClose");
    var doneBtn = document.getElementById("resumeModalDone");
    var form = document.getElementById("resumeForm");
    var emailInput = document.getElementById("resumeEmail");
    var statusEl = document.getElementById("resumeModalStatus");
    var submitBtn = document.getElementById("resumeSubmitBtn");
    var stepForm = document.getElementById("resumeStepForm");
    var stepSuccess = document.getElementById("resumeStepSuccess");
    var successMsg = document.getElementById("resumeSuccessMsg");
    var lastFocused = null;

    function setError(message) {
      var group = emailInput.closest(".form-group");
      var errorEl = form.querySelector('[data-error-for="resumeEmail"]');
      if (group) group.classList.toggle("error", !!message);
      if (errorEl) errorEl.textContent = message || "";
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function openModal() {
      lastFocused = document.activeElement;
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      stepForm.hidden = false;
      stepSuccess.hidden = true;
      submitBtn.classList.remove("loading");
      setError("");
      statusEl.textContent = "";
      statusEl.className = "form-status";
      setTimeout(function () { emailInput.focus(); }, 100);
    }

    function closeModal() {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      form.reset();
      setError("");
      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    function triggerDownload() {
      var a = document.createElement("a");
      a.href = RESUME_FILE;
      a.download = RESUME_DOWNLOAD_NAME;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (doneBtn) doneBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("show")) closeModal();
    });

    emailInput.addEventListener("input", function () {
      var group = emailInput.closest(".form-group");
      if (group && group.classList.contains("error")) setError("");
    });

    function showSuccess(emailed, email) {
      submitBtn.classList.remove("loading");
      triggerDownload();
      stepForm.hidden = true;
      stepSuccess.hidden = false;
      successMsg.textContent = emailed
        ? "Your download has started, and a copy is on its way to " + email + "."
        : "Your download has started!";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = emailInput.value.trim();

      if (!email) {
        setError("Please enter your email address.");
        return;
      }
      if (!isValidEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      submitBtn.classList.add("loading");
      statusEl.textContent = "";
      statusEl.className = "form-status";

      if (!window.emailjs || !isConfigured()) {
        // EmailJS isn't set up yet — download still works, see the
        // setup notes at the top of this file to enable the email step.
        setTimeout(function () { showSuccess(false, email); }, 350);
        return;
      }

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: email,
        to_name: email.split("@")[0]
      }).then(function () {
        showSuccess(true, email);
      }).catch(function () {
        submitBtn.classList.remove("loading");
        statusEl.textContent = "Couldn't send the email right now — here's your download instead.";
        statusEl.className = "form-status error";
        triggerDownload();
      });
    });
  });
})();
