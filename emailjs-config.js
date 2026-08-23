// ============================================================
// EMAILJS CONFIG — fill these in with your own free EmailJS account
// (https://www.emailjs.com) and both the contact form and the resume
// modal will send real email. Until you do, contact.js and resume.js
// automatically fall back to their original front-end-only demo
// behaviour, so nothing breaks in the meantime.
//
// Setup (~5 minutes):
// 1. Create a free account at emailjs.com.
// 2. Add an Email Service (e.g. Gmail) → copy its "Service ID" below.
// 3. Create a template for the contact form with variables
//    {{from_name}}, {{from_email}}, {{subject}}, {{message}} →
//    copy its "Template ID" into CONTACT_TEMPLATE_ID.
// 4. Create a second template for resume requests with a variable
//    {{visitor_email}}, and in that template's settings attach your
//    resume.pdf as a static attachment → copy its "Template ID" into
//    RESUME_TEMPLATE_ID. (This is what actually gets the PDF into the
//    visitor's inbox — EmailJS attaches whatever file you upload in
//    the template dashboard on every send.)
// 5. Copy your account's "Public Key" from Account → API Keys below.
// ============================================================
window.EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  contactTemplateId: 'YOUR_CONTACT_TEMPLATE_ID',
  resumeTemplateId: 'YOUR_RESUME_TEMPLATE_ID',
};
