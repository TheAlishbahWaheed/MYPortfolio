/* resume.js — email-gated resume delivery, using ONE shared EmailJS template
   for both the visitor's copy and your download notification.

   Every visitor who enters their email gets:
     1) an instant browser download of resume.pdf, AND
     2) an email sent to them via EmailJS.
   You also get a second email (same template, different recipient) telling
   you who downloaded it and when.

   ============================================================
   YOUR EMAILJS TEMPLATE — since one template is doing double duty, make
   sure it's set up like this in the EmailJS dashboard:

   - "To Email" field on the template → {{to_email}}   (NOT a fixed address —
     this is what lets the same template go to a visitor one time and to you
     the next)
   - Subject line → {{subject}}
   - Body → include {{to_name}} and {{message}} somewhere so both the
     resume email and the notification email read naturally
   - Attachments tab → resume.pdf uploaded there

   Heads up: because attachments are set on the template itself (not per
   send), resume.pdf will also be attached to the notification email you
   receive — that's harmless, just something to expect.
   ============================================================ */
(function () {
  "use strict";

  var EMAILJS_SERVICE_ID  = "alishbahwaheed";
  var EMAILJS_TEMPLATE_ID = "template_c2lbgmu";
  var EMAILJS_PUBLIC_KEY  = "7FtdnI3kUCzqPUfdc";

  var OWNER_EMAIL = "alishbaw026@gmail.com";
  var OWNER_NAME = "Alishbah";

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
        setTimeout(function () { showSuccess(false, email); }, 350);
        return;
      }

      // Same template, sent twice with different recipients/content:
      // once to the visitor with the resume, once to you as a heads-up.
      var sendToVisitor = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: email,
        to_name: email.split("@")[0],
        subject: "Alishbah Waheed — Resume",
        message: "Thanks for your interest! My resume is attached. Feel free to reach out anytime at " + OWNER_EMAIL + "."
      });

      var notifyOwner = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: OWNER_EMAIL,
        to_name: OWNER_NAME,
        subject: "New resume download",
        message: email + " just downloaded your resume from your portfolio at " + new Date().toLocaleString() + "."
      });

      sendToVisitor
        .then(function () {
          notifyOwner.catch(function () {});
          showSuccess(true, email);
        })
        .catch(function () {
          notifyOwner.catch(function () {});
          submitBtn.classList.remove("loading");
          statusEl.textContent = "Couldn't send the email right now — here's your download instead.";
          statusEl.className = "form-status error";
          triggerDownload();
        });
    });
  });
})();
