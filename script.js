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
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Instant bot detection: if honeypot has a value, silently abort
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
// ===================================================
// Formspree Submission Handler
// ===================================================
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maeyqqvr';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputs = [form.name, form.email, form.message];
  let isFormValid = true;

  // Run real-time validation across all fields
  inputs.forEach((input) => {
    const valid = validateField(input);
    if (!valid) isFormValid = false;
  });

  if (!isFormValid) {
    showToast('Please correct the errors in the form.', 'error');
    return;
  }

  // Set loading state
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

      // Reset success styling outlines
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

// ===================================================
// Timeline Tab Switching & Dynamic Re-initialization
// ===================================================
const tabButtons = document.querySelectorAll('.timeline-tabs .tab-btn');
const tabContents = document.querySelectorAll('.timeline-content');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-tab');

    // Update active tab buttons
    tabButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    // Display matching content panel
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
// ===================================================
// Command Palette (Cmd + K) Implementation
// ===================================================

const cmdBackdrop = document.getElementById('cmd-palette-backdrop');
const cmdInput = document.getElementById('cmd-input');
const cmdResults = document.getElementById('cmd-results');

// 1. Define command catalog
const commands = [
  // Navigation Section
  { id: 'about', title: 'Go to About Me', category: 'Navigation', icon: '👤', action: () => scrollToSection('#about') },
  { id: 'skills', title: 'Explore Core Skills', category: 'Navigation', icon: '⚡', action: () => scrollToSection('#skills') },
  { id: 'timeline', title: 'View Experience & Education', category: 'Navigation', icon: '💼', action: () => scrollToSection('#timeline') },
  { id: 'projects', title: 'View Featured Work', category: 'Navigation', icon: '💻', action: () => scrollToSection('#projects') },
  { id: 'contact', title: 'Get In Touch', category: 'Navigation', icon: '✉️', action: () => scrollToSection('#contact') },
  
  // Actions Section
  { 
    id: 'toggle-theme', 
    title: 'Toggle Light / Dark Theme', 
    category: 'Actions', 
    icon: '🌓', 
    shortcut: 'T',
    action: () => themeToggleBtn.click() 
  },
  { 
    id: 'copy-email', 
    title: 'Copy Email to Clipboard', 
    category: 'Actions', 
    icon: '📋', 
    action: () => {
      navigator.clipboard.writeText('aditya@example.com');
      showToast('Email copied to clipboard!', 'success');
    } 
  },
  { 
    id: 'source-code', 
    title: 'View GitHub Profile', 
    category: 'Actions', 
    icon: '↗', 
    action: () => window.open('https://github.com', '_blank') 
  }
];

let selectedIndex = 0;
let filteredCommands = [...commands];

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// 2. Render filtered command list
function renderCommands() {
  cmdResults.innerHTML = '';

  if (filteredCommands.length === 0) {
    cmdResults.innerHTML = '<div class="cmd-empty">No matching commands found.</div>';
    return;
  }

  // Group commands by category
  const grouped = filteredCommands.reduce((acc, cmd) => {
    acc[cmd.category] = acc[cmd.category] || [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  let globalIndex = 0;

  Object.keys(grouped).forEach((category) => {
    const title = document.createElement('div');
    title.className = 'cmd-group-title';
    title.textContent = category;
    cmdResults.appendChild(title);

    grouped[category].forEach((cmd) => {
      const item = document.createElement('div');
      item.className = `cmd-item ${globalIndex === selectedIndex ? 'is-selected' : ''}`;
      item.dataset.index = globalIndex;
      item.setAttribute('role', 'option');

      item.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-icon">${cmd.icon}</span>
          <span>${cmd.title}</span>
        </div>
        ${cmd.shortcut ? `<span class="cmd-item-shortcut">${cmd.shortcut}</span>` : ''}
      `;

      item.addEventListener('click', () => executeCommand(cmd));
      cmdResults.appendChild(item);
      globalIndex++;
    });
  });
}

// 3. Open & Close handlers
function openPalette() {
  cmdBackdrop.classList.add('is-open');
  cmdBackdrop.setAttribute('aria-hidden', 'false');
  cmdInput.value = '';
  filteredCommands = [...commands];
  selectedIndex = 0;
  renderCommands();
  setTimeout(() => cmdInput.focus(), 50);
}

function closePalette() {
  cmdBackdrop.classList.remove('is-open');
  cmdBackdrop.setAttribute('aria-hidden', 'true');
}

function executeCommand(cmd) {
  closePalette();
  if (cmd && typeof cmd.action === 'function') {
    cmd.action();
  }
}

// 4. Input search filter
cmdInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  filteredCommands = commands.filter((cmd) => 
    cmd.title.toLowerCase().includes(query) || 
    cmd.category.toLowerCase().includes(query)
  );
  selectedIndex = 0;
  renderCommands();
});

// 5. Global Keyboard Shortcuts & Arrow Key Navigation
window.addEventListener('keydown', (e) => {
  // Open with Cmd + K (Mac) or Ctrl + K (Windows/Linux)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdBackdrop.classList.contains('is-open')) {
      closePalette();
    } else {
      openPalette();
    }
    return;
  }

  // Only listen to palette keys when modal is open
  if (!cmdBackdrop.classList.contains('is-open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closePalette();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % filteredCommands.length;
    renderCommands();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
    renderCommands();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (filteredCommands[selectedIndex]) {
      executeCommand(filteredCommands[selectedIndex]);
    }
  }
});

// Click outside modal to close
cmdBackdrop.addEventListener('click', (e) => {
  if (e.target === cmdBackdrop) closePalette();
});
