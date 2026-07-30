/* contact.js — client-side validation + mailto-based submission.
   This site ships with no backend, so on successful validation we open the
   visitor's email client pre-filled with their message. Swap `sendViaMailto`
   for a fetch() call to your own form endpoint if you add one later. */
(function () {
  "use strict";

  var DEST_EMAIL = "alishbaw026@gmail.com";

  document.addEventListener("DOMContentLoaded", function () {
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

      setTimeout(function () {
        submitBtn.classList.remove("loading");
        sendViaMailto();
        statusEl.textContent = "Opening your email client to send this along — thank you!";
        statusEl.className = "form-status success";
        form.reset();
      }, 700);
    });
  });
})();
