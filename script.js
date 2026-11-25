/**
 * ============================================================================
 * MAHMOUD AL-GHRABLY PORTFOLIO - JAVASCRIPT
 * Vanilla ES6+ - Theme Toggle, Mobile Nav, Scroll Reveal, Form Handling
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK MODE DEFAULT)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme, default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggleBtn) {
      const isDark = theme === 'dark';
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMobileMenu() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. HEADER SCROLL EFFECT
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');

  function handleHeaderScroll() {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK ON SCROLL (SCROLL SPY)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    // Add staggered delay to grids
    const gridContainers = document.querySelectorAll('.skills-grid, .projects-grid, .services-grid, .timeline-container');
    gridContainers.forEach(container => {
      const items = container.querySelectorAll('.reveal-on-scroll');
      items.forEach((item, index) => {
        const delay = (index % 4) * 0.1;
        item.style.transitionDelay = `${delay}s`;
      });
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM VALIDATION & INTERACTIVE FEEDBACK
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Email format validator regex
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Helper to show/clear input errors
    const setFieldError = (input, hasError) => {
      const formGroup = input.closest('.form-group');
      if (formGroup) {
        if (hasError) {
          formGroup.classList.add('has-error');
        } else {
          formGroup.classList.remove('has-error');
        }
      }
    };

    // Live validation feedback on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (!input) return;
      input.addEventListener('input', () => {
        if (input === emailInput) {
          if (isValidEmail(input.value.trim())) {
            setFieldError(input, false);
          }
        } else if (input.value.trim().length > 0) {
          setFieldError(input, false);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;

      // Validate Name
      if (!nameInput.value.trim()) {
        setFieldError(nameInput, true);
        hasErrors = true;
      } else {
        setFieldError(nameInput, false);
      }

      // Validate Email
      if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
        setFieldError(emailInput, true);
        hasErrors = true;
      } else {
        setFieldError(emailInput, false);
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        setFieldError(subjectInput, true);
        hasErrors = true;
      } else {
        setFieldError(subjectInput, false);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        setFieldError(messageInput, true);
        hasErrors = true;
      } else {
        setFieldError(messageInput, false);
      }

      if (hasErrors) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please fill out all required fields correctly before submitting.';
          formFeedback.style.display = 'block';
        }
        return;
      }

      // If valid: simulate processing
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <span>Sending...</span>
          <svg class="spinner" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
        `;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;

          // Display success state
          if (formFeedback) {
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = 'Thank you! Your message has been sent successfully. Mahmoud will get back to you shortly.';
            formFeedback.style.display = 'block';
          }

          // Reset the form inputs
          contactForm.reset();

          // Auto hide feedback after 6 seconds
          setTimeout(() => {
            if (formFeedback) {
              formFeedback.style.display = 'none';
            }
          }, 6000);
        }, 800);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. CURRENT YEAR IN FOOTER
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
