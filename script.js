/**
 * ZIO AFRICA — Landing page interactions
 */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navBackdrop = document.getElementById('navBackdrop');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  // Header scroll state
  const onScrollHeader = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  // Mobile nav
  const closeNav = () => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    navBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  };
  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    navBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  navToggle?.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
  });
  navBackdrop?.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));
  navMenu?.querySelector('.nav-cta')?.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', (e) => {
    if (!navMenu?.classList.contains('open')) return;
    if (navMenu.contains(e.target) || navToggle?.contains(e.target)) return;
    closeNav();
  });

  // Smooth anchor offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 88;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced ? 'auto' : 'smooth' });
      history.pushState(null, '', href);
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // Active nav link
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const setActive = () => {
    const pos = window.scrollY + window.innerHeight * 0.35;
    let current = 'hero';
    sections.forEach(sec => { if (sec.offsetTop <= pos) current = sec.id; });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Contact form (mailto fallback)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const business = (data.get('business') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in your name, email, and message.';
      status.classList.add('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.classList.add('error');
      return;
    }
    const subject = encodeURIComponent(`New Project Inquiry from ${name}${business ? ' — ' + business : ''}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBusiness: ${business || '—'}\n\nMessage:\n${message}`);
    window.location.href = `mailto:zioafricaagency@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = 'Thank you — your email client should open with your inquiry.';
    form.reset();
  });
})();
