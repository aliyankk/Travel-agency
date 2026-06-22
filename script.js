/* ============================================================
   script.js - ExploreX Travel Agency (Ultimate Luxury Edition)
   Vanilla JS: loader, counter, navbar, scroll, slider, etc.
   ============================================================ */

(function() {
  'use strict';

  // ---------- LOADING SCREEN ----------
  window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 800);
    }
    initCounters();
    initScrollReveal();
    initParallaxHero();
    initStatsAnimation();
  });

  // ---------- PARALLAX HERO ----------
  function initParallaxHero() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        if (scrolled < hero.offsetHeight) {
          hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
        }
      });
    }
  }

  // ---------- STATS ANIMATION ----------
  function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(30px)';
      setTimeout(() => {
        stat.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
      }, 300 + (index * 150));
    });
  }

  // ---------- COUNTER ANIMATION ----------
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (!isNaN(target) && !el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCounter(el, target);
          }
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el, target) {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let count = 0;
    
    const timer = setInterval(() => {
      count++;
      current += increment;
      if (count >= steps) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, duration / steps);
  }

  // ---------- STICKY NAVBAR ----------
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ---------- BACK TO TOP BUTTON ----------
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backBtn.style.display = 'flex';
        backBtn.style.opacity = '1';
      } else {
        backBtn.style.opacity = '0';
        setTimeout(() => {
          if (window.scrollY <= 500) {
            backBtn.style.display = 'none';
          }
        }, 300);
      }
    });
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- SMOOTH SCROLL FOR NAV LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        
        const navCollapse = document.getElementById('navMenu');
        if (navCollapse && navCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      }
    });
  });

  // ---------- SCROLL REVEAL (Intersection Observer) ----------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ---------- FORM VALIDATION (Contact) ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const feedback = document.getElementById('formFeedback');
      const name = this.querySelector('input[placeholder="Full Name"]');
      const email = this.querySelector('input[placeholder="Email Address"]');
      const phone = this.querySelector('input[placeholder="Phone Number"]');
      const msg = this.querySelector('textarea');

      if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
        feedback.innerHTML = '<div class="alert alert-danger rounded-4">Please fill in all required fields.</div>';
        return;
      }
      if (!email.value.includes('@') || !email.value.includes('.')) {
        feedback.innerHTML = '<div class="alert alert-danger rounded-4">Please enter a valid email address.</div>';
        return;
      }
      
      feedback.innerHTML = `
        <div class="alert alert-success rounded-4">
          <i class="fas fa-check-circle me-2"></i> 
          Thank you! Our luxury travel concierge will reach out within 24 hours.
        </div>
      `;
      this.reset();
      
      setTimeout(() => {
        feedback.innerHTML = '';
      }, 5000);
    });
  }

  // ---------- GALLERY LIGHTBOX ----------
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', function() {
      const src = this.getAttribute('src');
      const modal = document.getElementById('galleryModal');
      if (modal) {
        const modalBody = modal.querySelector('.modal-body .row');
        if (modalBody) {
          const imgs = modalBody.querySelectorAll('img');
          if (imgs.length) {
            imgs.forEach((i, idx) => {
              if (idx === 0) i.src = src;
            });
          }
        }
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      }
    });
  });

  // ---------- ACTIVE NAV LINK ON SCROLL ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current || 
          (current === '' && link.getAttribute('href') === '#home')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  window.addEventListener('load', highlightNav);

  // ---------- SMOOTH CARD REVEAL ON SCROLL ----------
  document.querySelectorAll('.destination-card, .package-card, .service-item, .team-card').forEach((el, index) => {
    el.style.transitionDelay = (index * 0.05) + 's';
  });

  // ---------- TESTIMONIAL AUTO-PLAY ----------
  const testimonialCarousel = document.querySelector('#testimonialCarousel');
  if (testimonialCarousel) {
    const carousel = new bootstrap.Carousel(testimonialCarousel, {
      interval: 5000,
      pause: 'hover',
      wrap: true
    });
  }

  // ---------- COUNTER WITH COMMA FORMATTING ----------
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // ---------- SMOOTH SCROLL FOR ALL INTERNAL LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  console.log('✨ ExploreX Luxury Travel — loaded successfully.');
})();