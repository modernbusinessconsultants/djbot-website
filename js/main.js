document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. Mobile Navigation Toggle
  // ============================================
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });

    // Close menu when a nav link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // ============================================
  // 2. Sticky Header on Scroll
  // ============================================
  const header = document.querySelector('#header');

  const handleStickyHeader = () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleStickyHeader);
  handleStickyHeader(); // Run on load in case page is already scrolled

  // ============================================
  // 3. Active Nav Link Highlighting
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ============================================
  // 4. Scroll Animations (Fade In)
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ============================================
  // 5. Back to Top Button
  // ============================================
  const backToTop = document.querySelector('.back-to-top');

  const handleBackToTopVisibility = () => {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleBackToTopVisibility);

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 6. Smooth Scroll for Anchor Links
  // ============================================
  const HEADER_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const topPosition = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });

      // Close mobile nav if open
      if (navToggle && mobileNav) {
        navToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('nav-open');
      }
    });
  });

  // ============================================
  // 7. Contact Form Handling (Formspree)
  // ============================================
  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      // Clear any prior status message
      const priorStatus = contactForm.parentNode.querySelector('.form-success-message, .form-error-message');
      if (priorStatus) priorStatus.remove();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const showStatus = (className, text, autoHideMs) => {
        const el = document.createElement('div');
        el.className = className;
        el.textContent = text;
        contactForm.parentNode.insertBefore(el, contactForm.nextSibling);
        if (autoHideMs) {
          setTimeout(() => { if (el.parentNode) el.remove(); }, autoHideMs);
        }
      };

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showStatus('form-success-message', "Thanks for reaching out! We'll get back to you soon.", 5000);
          contactForm.reset();
        } else {
          const result = await response.json().catch(() => ({}));
          const message = Array.isArray(result.errors) && result.errors.length
            ? result.errors.map(err => err.message).join(', ')
            : 'Something went wrong. Please try again or reach us on Instagram.';
          showStatus('form-error-message', message, 6000);
        }
      } catch (err) {
        showStatus('form-error-message', 'Network error. Please check your connection and try again.', 6000);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // ============================================
  // 8. Equalizer Animation Enhancement
  // ============================================
  const eqBars = document.querySelectorAll('.eq-bar');

  eqBars.forEach(bar => {
    const randomDuration = (Math.random() * 0.7 + 0.8).toFixed(2); // 0.8s to 1.5s
    const randomDelay = (Math.random() * 0.5).toFixed(2);           // 0s to 0.5s
    bar.style.animationDuration = `${randomDuration}s`;
    bar.style.animationDelay = `${randomDelay}s`;
  });

  // ============================================
  // 9. Parallax / Subtle Hero Fade Effect
  // ============================================
  const heroContent = document.querySelector('.hero-content');
  let ticking = false;

  const handleHeroParallax = () => {
    if (!heroContent) return;
    const scrollY = window.scrollY;
    const heroHeight = heroContent.parentElement
      ? heroContent.parentElement.offsetHeight
      : 600;

    // Fade out hero content as user scrolls down
    const opacity = Math.max(0, 1 - scrollY / (heroHeight * 0.6));
    heroContent.style.opacity = opacity;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleHeroParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

});
