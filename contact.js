/* contact.js — client-side validation + live email sending via EmailJS.

   ============================================================
   EMAILJS SETUP — reuses the same free EmailJS account as resume.js.

   1. Use the same EMAILJS_SERVICE_ID you set up in resume.js.
   2. Create Template #3 — "New contact message":
      - Set the template's "To Email" field to your own address
        (alishbaw026@gmail.com) — hardcode it in the template
      - Add variables for {{from_name}}, {{from_email}}, {{subject}},
        {{message}} so the email shows what the visitor wrote
      - Copy this template's ID → EMAILJS_CONTACT_TEMPLATE_ID
   3. Paste your EMAILJS_PUBLIC_KEY (same one as resume.js) below.

   Until these are filled in, the form still works — it falls back to
   opening the visitor's email client with a pre-filled message, same
   as before, so nothing breaks while you finish the EmailJS setup.
   ============================================================ */
(function () {
  "use strict";

  var EMAILJS_SERVICE_ID          = "YOUR_SERVICE_ID";
  var EMAILJS_CONTACT_TEMPLATE_ID = "YOUR_CONTACT_TEMPLATE_ID";
  var EMAILJS_PUBLIC_KEY          = "YOUR_PUBLIC_KEY";
  var DEST_EMAIL = "alishbaw026@gmail.com";

  function isConfigured() {
    return EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
      EMAILJS_CONTACT_TEMPLATE_ID !== "YOUR_CONTACT_TEMPLATE_ID" &&
      EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (window.emailjs && isConfigured()) {
      try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (e) {}
    }

    var form = document.getElementById("contactForm");
    if (!form) return;

    var statusEl = document.getElementById("formStatus");
    var submitBtn = form.querySelector(".form-submit");

    var fields = {
      name: document.getElementById("cName"),
      email: document.getElementById("cEmail"),
      subject: document.getElementById("cSubject"),
      message: document.getElementById("cMessage")
    };

    function setError(fieldEl, message) {
      var group = fieldEl.closest(".form-group");
      var errorEl = form.querySelector('[data-error-for="' + fieldEl.id + '"]');
      if (group) group.classList.toggle("error", !!message);
      if (errorEl) errorEl.textContent = message || "";
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      var valid = true;

      if (!fields.name.value.trim()) {
        setError(fields.name, "Please enter your name.");
        valid = false;
      } else {
        setError(fields.name, "");
      }

      if (!fields.email.value.trim()) {
        setError(fields.email, "Please enter your email.");
        valid = false;
      } else if (!isValidEmail(fields.email.value.trim())) {
        setError(fields.email, "Please enter a valid email address.");
        valid = false;
      } else {
        setError(fields.email, "");
      }

      if (!fields.subject.value.trim()) {
        setError(fields.subject, "Please add a subject.");
        valid = false;
      } else {
        setError(fields.subject, "");
      }

      if (!fields.message.value.trim()) {
        setError(fields.message, "Please write a short message.");
        valid = false;
      } else if (fields.message.value.trim().length < 10) {
        setError(fields.message, "Message seems short — add a bit more detail.");
        valid = false;
      } else {
        setError(fields.message, "");
      }

      return valid;
    }

    function sendViaMailto() {
      var subject = encodeURIComponent(fields.subject.value.trim());
      var body = encodeURIComponent(
        "Name: " + fields.name.value.trim() +
        "\nEmail: " + fields.email.value.trim() +
        "\n\n" + fields.message.value.trim()
      );
      window.location.href = "mailto:" + DEST_EMAIL + "?subject=" + subject + "&body=" + body;
    }

    function sendViaEmailJs() {
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, {
        from_name: fields.name.value.trim(),
        from_email: fields.email.value.trim(),
        subject: fields.subject.value.trim(),
        message: fields.message.value.trim()
      });
    }

    // Clear individual errors as the visitor fixes them
    Object.keys(fields).forEach(function (key) {
      fields[key].addEventListener("input", function () {
        var group = fields[key].closest(".form-group");
        if (group && group.classList.contains("error")) {
          setError(fields[key], "");
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validate()) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.className = "form-status error";
        return;
      }

      submitBtn.classList.add("loading");
      statusEl.textContent = "";
      statusEl.className = "form-status";

      if (window.emailjs && isConfigured()) {
        sendViaEmailJs()
          .then(function () {
            submitBtn.classList.remove("loading");
            statusEl.textContent = "Message sent — thank you! I'll get back to you soon.";
            statusEl.className = "form-status success";
            form.reset();
          })
          .catch(function () {
            submitBtn.classList.remove("loading");
            statusEl.textContent = "Couldn't send that automatically — opening your email client instead.";
            statusEl.className = "form-status error";
            sendViaMailto();
          });
      } else {
        // EmailJS isn't set up yet — fall back to mailto, same as before.
        setTimeout(function () {
          submitBtn.classList.remove("loading");
          sendViaMailto();
          statusEl.textContent = "Opening your email client to send this along — thank you!";
          statusEl.className = "form-status success";
          form.reset();
        }, 700);
      }
    });
  });
})();
