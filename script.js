// ===================================================
// 1. Theme Toggle (Dark / Light Mode)
// ===================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('.theme-icon');

// Determine initial theme: check localStorage or system preference
const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Function to update theme on <html> and sync button icon
const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.textContent = '🌙';
  }
};

// Initialize current theme
let currentTheme = getPreferredTheme();
applyTheme(currentTheme);

// Click event listener to toggle and persist setting
themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
  localStorage.setItem('theme', currentTheme);
});


// ===================================================
// 2. Typewriter Effect
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
  if (!textElement) return;
  
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    textElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    textElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let currentDelay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentRole.length) {
    currentDelay = pauseBetween;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    currentDelay = 400;
  }

  setTimeout(typeEffect, currentDelay);
}

document.addEventListener("DOMContentLoaded", typeEffect);


// ===================================================
// 3. Interactive Spotlight Card Hover Effect
// ===================================================
const spotlightCards = document.querySelectorAll('.spotlight-card');

spotlightCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


// ===================================================
// 4. Contact Form Validation & Toast Notification System
// ===================================================
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const toastContainer = document.getElementById('toast-container');
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maeyqqvr';

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
  if (!field) return;

  field.addEventListener('input', () => {
    const group = document.getElementById(`group-${fieldName}`);
    if (group && group.classList.contains('has-error')) {
      validateField(field);
    }
  });

  field.addEventListener('blur', () => {
    validateField(field);
  });
});

// Reusable Toast Dispatcher
function showToast(message, type = 'success', duration = 4000) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? '✓' : '⚠️';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');

    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}

// Form Submission Handler
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Anti-bot Honeypot Check
    if (form._gotcha && form._gotcha.value) {
      showToast('Message sent successfully! I will reply soon.', 'success');
      form.reset();
      return;
    }

    const inputs = [form.name, form.email, form.message];
    let isFormValid = true;

    inputs.forEach((input) => {
      const valid = validateField(input);
      if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
      showToast('Please correct the errors in the form.', 'error');
      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    try {
      const formData = new FormData(form);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showToast('Message sent successfully! I will reply soon.', 'success');
        form.reset();
        document.querySelectorAll('.form-group').forEach((group) => {
          group.classList.remove('is-valid');
        });
      } else {
        const data = await response.json();
        const errorMessage = data.errors
          ? data.errors.map((err) => err.message).join(', ')
          : 'Submission failed. Please try again.';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = originalText;
    }
  });
}


// ===================================================
// 5. Timeline Tab Switching
// ===================================================
const tabButtons = document.querySelectorAll('.timeline-tabs .tab-btn');
const tabContents = document.querySelectorAll('.timeline-content');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-tab');

    tabButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    tabContents.forEach((panel) => {
      if (panel.id === targetId) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('hidden', 'true');
      }
    });
  });
});
