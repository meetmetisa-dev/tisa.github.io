'use strict';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobileLayout = window.matchMedia('(max-width: 760px)');

function setMenu(open) {
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '−' : '+';
}

// Navigation stays available if JavaScript is disabled or cannot initialize.
if (header && menuButton && navigation) {
  document.body.classList.add('js-ready');
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    setMenu(false);
    // Move focus to the destination before the mobile navigation is hidden.
    const target = document.querySelector(link.hash);
    if (target && mobileLayout.matches) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  mobileLayout.addEventListener('change', () => setMenu(false));
}

const navLinks = [...document.querySelectorAll('#primary-nav a[href^="#"]')];
const trackedSections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
let framePending = false;
function updateCurrentSection() {
  framePending = false;
  let current = '';
  const offset = header ? header.offsetHeight + 90 : 170;
  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= offset) current = `#${section.id}`;
  });
  navLinks.forEach((link) => {
    if (link.hash === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => {
  if (!framePending) {
    framePending = true;
    window.requestAnimationFrame(updateCurrentSection);
  }
}, { passive: true });
window.addEventListener('resize', updateCurrentSection);
updateCurrentSection();

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const publications = [...document.querySelectorAll('.publication[data-type]')];
const publicationCount = document.querySelector('#publication-count');
function applyFilter(filter) {
  let count = 0;
  publications.forEach((publication) => {
    const visible = filter === 'all' || publication.dataset.type === filter;
    publication.hidden = !visible;
    if (visible) count += 1;
  });
  filterButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  if (publicationCount) publicationCount.textContent = `${count} ${count === 1 ? 'publication' : 'publications'}`;
}
filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter)));
const toolbar = document.querySelector('.publication-toolbar');
if (toolbar) toolbar.hidden = false;

// Research links must still work when a publication category is filtered out.
function revealLinkedPublication(hash) {
  const publication = publications.find((item) => `#${item.id}` === hash);
  if (!publication || !publication.hidden) return null;
  applyFilter('all');
  return publication;
}
document.querySelectorAll('a[href^="#paper-"]').forEach((link) => {
  link.addEventListener('click', () => revealLinkedPublication(link.hash));
});
window.addEventListener('hashchange', () => {
  const revealed = revealLinkedPublication(window.location.hash);
  if (revealed) revealed.scrollIntoView({ block: 'start' });
});
revealLinkedPublication(window.location.hash);
