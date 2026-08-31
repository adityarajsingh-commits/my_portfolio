const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('.theme-icon');

// 1. Determine initial theme: check localStorage or system preference
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 2. Function to update theme on <html> and sync button icon
const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
  }
};

// 3. Initialize current theme
let currentTheme = getPreferredTheme();
applyTheme(currentTheme);

// 4. Click event listener to toggle and persist setting
themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
});
// ===================================================
// Typewriter Effect
// ===================================================
const roles = [
  "modern web applications.",
  "clean UI/UX architectures.",
  "responsive interfaces.",
  "high-performance frontend code."
];

const textElement = document.getElementById("typewriter-text");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 80;     // Speed per character when typing
const deletingSpeed = 40;   // Speed per character when deleting
const pauseBetween = 1800;  // Pause before deleting completed text

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove one character
    textElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    textElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  // Determine timing for next step
  let currentDelay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentRole.length) {
    // Word fully typed, pause before deleting
    currentDelay = pauseBetween;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Word fully deleted, move to the next role
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    currentDelay = 400; // Brief pause before typing next word
  }

  setTimeout(typeEffect, currentDelay);
}

// Start typing on page load
document.addEventListener("DOMContentLoaded", typeEffect);

// ===================================================
// Interactive Spotlight Card Hover Effect
// ===================================================
const spotlightCards = document.querySelectorAll('.spotlight-card');

spotlightCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // X position within the card
    const y = e.clientY - rect.top;  // Y position within the card

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
