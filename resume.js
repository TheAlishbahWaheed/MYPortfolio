/* resume.js — email-gated resume delivery.
   Any visitor who enters their email gets:
     1) an instant browser download of resume.pdf,
     2) (once EmailJS is set up below) a copy emailed to them, AND
     3) you get a notification email telling you who downloaded it.

   ============================================================
   EMAILJS SETUP — do this once, it's free at https://www.emailjs.com

   1. Create an Email Service (Gmail/Outlook/etc.) → copy its "Service ID".
      The same Service ID is reused for both templates below.

   2. Create Template #1 — "Resume to visitor":
      - Set the template's "To Email" field to {{to_email}}
      - Add a {{to_name}} variable if you want to greet them by name
      - Open the template's "Attachments" tab and upload resume.pdf so
        it's attached automatically on every send
      - Copy this template's ID → EMAILJS_VISITOR_TEMPLATE_ID

   3. Create Template #2 — "New resume download" (goes to you):
      - Set the template's "To Email" field to your own address
        (alishbaw026@gmail.com) — hardcode it in the template, not here
      - Add a {{visitor_email}} variable in the body so the email tells
        you who just downloaded your resume
      - Copy this template's ID → EMAILJS_NOTIFY_TEMPLATE_ID

   4. Go to Account → API Keys → copy your "Public Key".
   5. Paste all four values into the constants below.

   Until these are filled in, the button still works — it just skips
   the email steps and downloads resume.pdf directly, so nothing
   breaks while you finish the EmailJS setup.
   ============================================================ */
(function () {
  "use strict";

  var EMAILJS_SERVICE_ID           = "YOUR_SERVICE_ID";
  var EMAILJS_VISITOR_TEMPLATE_ID  = "YOUR_VISITOR_TEMPLATE_ID";
  var EMAILJS_NOTIFY_TEMPLATE_ID   = "YOUR_NOTIFY_TEMPLATE_ID";
  var EMAILJS_PUBLIC_KEY           = "YOUR_PUBLIC_KEY";

  var RESUME_FILE = "resume.pdf";
  var RESUME_DOWNLOAD_NAME = "Alishbah-Waheed-Resume.pdf";

  function isConfigured() {
    return EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
      EMAILJS_VISITOR_TEMPLATE_ID !== "YOUR_VISITOR_TEMPLATE_ID" &&
      EMAILJS_NOTIFY_TEMPLATE_ID !== "YOUR_NOTIFY_TEMPLATE_ID" &&
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

      // Fire both emails: resume → visitor, notification → you (the owner),
      // so you know exactly who downloaded it and when.
      var sendToVisitor = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_VISITOR_TEMPLATE_ID, {
        to_email: email,
        to_name: email.split("@")[0]
      });

      var notifyOwner = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_NOTIFY_TEMPLATE_ID, {
        visitor_email: email,
        downloaded_at: new Date().toLocaleString()
      });

      sendToVisitor
        .then(function () {
          // Fire-and-forget: the owner notification shouldn't block or
          // fail the visitor's success state if it errors out.
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
