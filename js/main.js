/* ============================================
   VALÚ Baby — Main JavaScript
   Interactions, Scroll Animations, UI Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navigation Scroll Effect ----------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load
  }

  // ---------- Mobile Nav Toggle ----------
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ---------- Scroll Reveal Animations ----------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ---------- Size Selector (Product Page) ----------
  const sizeButtons = document.querySelectorAll('.size-selector__btn');
  if (sizeButtons.length > 0) {
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  }

  // ---------- Product Info Accordion ----------
  const infoHeaders = document.querySelectorAll('.product-info__header');
  if (infoHeaders.length > 0) {
    infoHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.product-info__item').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.product-info__header').setAttribute('aria-expanded', 'false');
        });

        // Open clicked if it was closed
        if (!isOpen) {
          item.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ---------- Gallery Thumbnails (Product Page) ----------
  const thumbs = document.querySelectorAll('.product-gallery__thumb');
  const mainImage = document.getElementById('mainImage');
  if (thumbs.length > 0 && mainImage) {
    const images = [
      'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=1200&q=85',
      'https://images.unsplash.com/photo-1519238400177-d740f7d28e61?w=1200&q=85',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=85',
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1200&q=85'
    ];

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const img = mainImage.querySelector('img');
        if (img) {
          img.src = images[index];
        }
      });
    });
  }

  // ---------- Add to Bag Button ----------
  const addToBag = document.getElementById('addToBag');
  if (addToBag) {
    addToBag.addEventListener('click', () => {
      const selectedSize = document.querySelector('.size-selector__btn.selected');
      const size = selectedSize ? selectedSize.dataset.size : 'N/A';

      // Button animation
      addToBag.textContent = '✓ Added to Bag';
      addToBag.style.backgroundColor = 'var(--near-black)';

      setTimeout(() => {
        addToBag.textContent = 'Add to Bag';
        addToBag.style.backgroundColor = '';
      }, 2000);
    });
  }

  // ---------- Join the List Button ----------
  const joinListBtn = document.getElementById('joinListBtn');
  if (joinListBtn) {
    joinListBtn.addEventListener('click', (e) => {
      e.preventDefault();
      joinListBtn.textContent = '✓ You\'re on the List';
      joinListBtn.style.backgroundColor = '#fff';
      joinListBtn.style.color = 'var(--near-black)';

      setTimeout(() => {
        joinListBtn.textContent = 'Join the List';
        joinListBtn.style.backgroundColor = '';
        joinListBtn.style.color = '';
      }, 3000);
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
