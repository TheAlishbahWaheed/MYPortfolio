/* contact.js — client-side validation + live email sending via EmailJS,
   reusing the SAME shared template as resume.js (see the notes there for
   how the template needs to be set up: "To Email" → {{to_email}},
   Subject → {{subject}}, body includes {{to_name}} and {{message}}). */
(function () {
  "use strict";

  var EMAILJS_SERVICE_ID  = "alishbahwaheed";
  var EMAILJS_TEMPLATE_ID = "template_c2lbgmu";
  var EMAILJS_PUBLIC_KEY  = "7FtdnI3kUCzqPUfdc";

  var DEST_EMAIL = "alishbaw026@gmail.com";
  var DEST_NAME = "Alishbah";

  function isConfigured() {
    return EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
      EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" &&
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
      var name = fields.name.value.trim();
      var email = fields.email.value.trim();
      var subject = fields.subject.value.trim();
      var message = fields.message.value.trim();

      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: DEST_EMAIL,
        to_name: DEST_NAME,
        subject: "Portfolio contact: " + subject,
        message: "From: " + name + " <" + email + ">\n\n" + message
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
