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
// ===================================================
// Contact Form Validation & Toast Notification System
// ===================================================

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toastContainer = document.getElementById('toast-container');

// Validation rules schema
const validators = {
  name: (value) => {
    if (!value.trim()) return 'Name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Message cannot be empty.';
    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  }
};

// Validate individual field & update UI state
function validateField(field) {
  const name = field.name;
  const validator = validators[name];
  if (!validator) return true;

  const errorMessage = validator(field.value);
  const group = document.getElementById(`group-${name}`);
  const errorDisplay = document.getElementById(`error-${name}`);

  if (errorMessage) {
    group.classList.add('has-error');
    group.classList.remove('is-valid');
    errorDisplay.textContent = errorMessage;
    return false;
  } else {
    group.classList.remove('has-error');
    if (field.value.trim().length > 0) {
      group.classList.add('is-valid');
    }
    errorDisplay.textContent = '';
    return true;
  }
}

// Attach real-time input & blur events
['name', 'email', 'message'].forEach((fieldName) => {
  const field = document.getElementById(fieldName);

  field.addEventListener('input', () => {
    // Only clear errors actively while user corrects
    const group = document.getElementById(`group-${fieldName}`);
    if (group.classList.contains('has-error')) {
      validateField(field);
    }
  });

  field.addEventListener('blur', () => {
    validateField(field);
  });
});

// Reusable Toast Dispatcher
function showToast(message, type = 'success', duration = 4000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : '⚠️';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger reflow to run enter animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto-dismiss after duration
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');

    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}

// Form Submission Handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputs = [form.name, form.email, form.message];
  let isFormValid = true;

  // Validate all fields on submit
  inputs.forEach((input) => {
    const valid = validateField(input);
    if (!valid) isFormValid = false;
  });

  if (!isFormValid) {
    showToast('Please correct the errors in the form.', 'error');
    return;
  }

  // Simulate loading state
  const btnText = submitBtn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';

  try {
    // Simulate async network request
    await new Promise((resolve) => setTimeout(resolve, 1200));

    showToast('Message sent successfully! I will reply soon.', 'success');
    form.reset();

    // Reset valid state outlines
    document.querySelectorAll('.form-group').forEach((group) => {
      group.classList.remove('is-valid');
    });
  } catch (error) {
    showToast('Something went wrong. Please try again later.', 'error');
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = originalText;
  }
});
