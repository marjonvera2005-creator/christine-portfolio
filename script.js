// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.innerHTML = open ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
});

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  hamburger.innerHTML = '<i class="fas fa-bars"></i>';
}

navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Light / dark mode
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function savedTheme() {
  try { return localStorage.getItem('theme'); } catch (e) { return null; }
}

function renderToggle() {
  const dark = root.dataset.theme === 'dark';
  themeToggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

function setTheme(theme, origin) {
  const apply = () => {
    root.dataset.theme = theme;
    renderToggle();
  };

  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !origin) {
    apply();
    return;
  }

  // Grow the new theme out of the toggle button in a circle
  const rect = origin.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.startViewTransition(apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 600, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
    );
  });
}

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch (e) {}
  setTheme(next, themeToggle);
});

// Follow the system setting until the visitor picks a theme themselves
systemDark.addEventListener('change', e => {
  if (!savedTheme()) setTheme(e.matches ? 'dark' : 'light');
});

renderToggle();

// Typing effect
const roles = ['UI/UX Designer', 'Web Developer', 'CS Student'];
const typed = document.getElementById('typed');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let roleIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = roles[roleIndex];
  typed.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1600);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 300);
  }
}

if (reduceMotion) typed.textContent = roles[0];
else type();

// Scroll reveal (staggered within each row)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
    const delay = Math.max(0, siblings.indexOf(entry.target)) * 90;
    entry.target.style.transitionDelay = `${delay}ms`;
    entry.target.classList.add('visible');
    // Hand control back to each card's own hover styles once revealed
    entry.target.addEventListener('transitionend', () => {
      entry.target.style.transitionDelay = '';
      entry.target.classList.remove('reveal', 'visible');
    }, { once: true });
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Tech stack marquee: repeat the icons so the short list fills the row and the loop is seamless
const marqueeTrack = document.getElementById('marqueeTrack');
const marqueeItems = [...marqueeTrack.children];
for (let i = 0; i < 3; i++) {
  marqueeItems.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.appendChild(clone);
  });
}

// Page-style transition: fade out, jump to the section, then fade its content back in
const ENTER_TARGETS = '.eyebrow, .hero-text, .hero-photo-wrap, .section-title, .section-sub, .about-photo-wrap, .about-text, .marquee, .services-grid > *, .projects-grid > *, .cert-grid > *, .contact-box';

// Let the CSS load-in animation finish before nav transitions take over the hero
setTimeout(() => document.body.classList.add('loaded'), 1400);

function playEnter(section) {
  section.querySelectorAll(ENTER_TARGETS).forEach((el, i) => {
    revealObserver.unobserve(el);
    el.classList.remove('reveal', 'visible');
    el.style.transitionDelay = '';
    el.style.animation = 'none';
    void el.offsetWidth; // restart the animation
    el.style.animation = `pageIn 0.8s ease ${i * 90}ms both`;
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  });
}

document.querySelectorAll('a[href^="#"]:not([data-drawer-open])').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    history.replaceState(null, '', link.hash);

    if (reduceMotion) {
      target.scrollIntoView();
      return;
    }

    document.body.classList.add('page-leave');
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      document.body.classList.remove('page-leave');
      playEnter(target);
    }, 250);
  });
});

// Contact drawer
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');
let lastFocus = null;
drawer.inert = true;

function openDrawer(e) {
  e.preventDefault();
  closeMenu();
  lastFocus = document.activeElement;
  drawer.inert = false;
  drawer.setAttribute('aria-hidden', false);
  document.body.classList.add('drawer-open');
  setTimeout(() => drawerClose.focus(), 50);
}

function closeDrawer() {
  if (!document.body.classList.contains('drawer-open')) return;
  document.body.classList.remove('drawer-open');
  drawer.setAttribute('aria-hidden', true);
  drawer.inert = true;
  if (lastFocus) lastFocus.focus();
}

document.querySelectorAll('[data-drawer-open]').forEach(btn => btn.addEventListener('click', openDrawer));
drawerClose.addEventListener('click', closeDrawer);
document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);

// Active nav link while scrolling
const sections = document.querySelectorAll('main section[id]');
const linkFor = id => navLinks.querySelector(`a[href="#${id}"]`);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const link = linkFor(entry.target.id);
    if (link && entry.isIntersecting) {
      navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Project details pop-up ("View Details")
const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');
let modalReturnFocus = null;
modal.inert = true;

function openDetails(id, trigger) {
  const template = document.getElementById(`details-${id}`);
  if (!template) return;

  modalContent.replaceChildren(template.content.cloneNode(true));
  modalContent.querySelector('.md-title').id = 'modalTitle';
  makeZoomable(modalContent.querySelector('.md-main'));
  modal.querySelector('.modal-box').scrollTop = 0;

  modalReturnFocus = trigger;
  modal.inert = false;
  modal.setAttribute('aria-hidden', false);
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  setTimeout(() => modal.querySelector('.modal-close').focus(), 50);
}

function closeDetails() {
  if (!modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', true);
  modal.inert = true;
  document.body.classList.remove('modal-open');
  if (modalReturnFocus) modalReturnFocus.focus();
}

document.querySelectorAll('[data-details]').forEach(btn => {
  btn.addEventListener('click', () => openDetails(btn.dataset.details, btn));
});

modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeDetails));

// Screenshot switcher inside the pop-up
modalContent.addEventListener('click', e => {
  const thumb = e.target.closest('.md-thumb');
  if (!thumb) return;
  const main = modalContent.querySelector('.md-main');
  const img = thumb.querySelector('img');
  main.src = img.src;
  main.alt = img.alt;
  const caption = modalContent.querySelector('.md-caption');
  if (caption) caption.innerHTML = thumb.dataset.caption;
  main.style.animation = 'none';
  void main.offsetWidth; // replay the fade
  main.style.animation = '';
  modalContent.querySelectorAll('.md-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
});

// Lightbox for certificates and the big screenshot in the pop-up
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.createElement('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
let lightboxReturnFocus = null;
lightboxImg.alt = '';
lightbox.append(lightboxImg);
lightbox.inert = true;

// Images that open in the lightbox can also be opened from the keyboard
function makeZoomable(img) {
  if (!img) return;
  img.tabIndex = 0;
  img.setAttribute('role', 'button');
}

document.querySelectorAll('[data-lightbox]').forEach(makeZoomable);

document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-lightbox], .md-main')) {
    e.preventDefault();
    e.target.click();
  }
});

document.addEventListener('click', e => {
  const img = e.target.closest('[data-lightbox], .md-main');
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxReturnFocus = img;
  lightbox.inert = false;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', false);
  lightboxClose.focus();
});

function closeLightbox() {
  if (!lightbox.classList.contains('open')) return false;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', true);
  lightbox.inert = true;
  if (lightboxReturnFocus) lightboxReturnFocus.focus();
  return true;
}

lightbox.addEventListener('click', e => {
  if (e.target !== lightboxImg) closeLightbox();
});

// Escape closes the top-most layer only
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (closeLightbox()) return;
  if (modal.classList.contains('open')) return closeDetails();
  closeDrawer();
});

document.getElementById('year').textContent = new Date().getFullYear();
