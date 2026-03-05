// Typing Animation
const textArray = [
  "IT & AI Student",
  "Tech Practitioner and Learner",
  "Aspiring AI Researcher",
  "Cloud and Web Explorer"
];

const typingElement = document.getElementById("typing");
let textIndex = 0;
let charIndex = 0;
let typingDelay = 100;
let erasingDelay = 50;
let newTextDelay = 1500; // Delay before erasing
let betweenTextsDelay = 500; // Delay between texts

function type() {
  if (charIndex < textArray[textIndex].length) {
    typingElement.textContent += textArray[textIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    // Wait before erasing
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    typingElement.textContent = textArray[textIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    // Move to next text
    textIndex = (textIndex + 1) % textArray.length;
    setTimeout(type, betweenTextsDelay);
  }
}

// Initialize typing animation when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (textArray.length) setTimeout(type, betweenTextsDelay);
});

// Scroll Reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});
const contactForm = document.getElementById("contact-form");
const formMsg = document.getElementById("form-msg");

contactForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const templateParams = {
    from_name: document.getElementById("name").value,
    from_email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  emailjs.send("alishbahwaheed", "template_c2lbgmu", templateParams)
    .then(function(response) {
      formMsg.style.display = "block";
      contactForm.reset();
    }, function(error) {
      alert("Something went wrong. Please try again.");
      console.log(error);
    });
});

document.querySelectorAll(".hidden").forEach(el => observer.observe(el));