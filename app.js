const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const setMenu = (isOpen) => {
  header.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
};
menuButton?.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('menu-open')) {
    setMenu(false);
    menuButton.focus();
  }
});

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const navLinks = [...document.querySelectorAll('#primary-nav a')];
const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const navObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => {
    link.toggleAttribute('aria-current', link.hash === `#${visible.target.id}`);
  });
}, { rootMargin: '-30% 0px -55% 0px', threshold: [0.05, 0.2, 0.5] });
sections.forEach((section) => navObserver.observe(section));

const filterButtons = document.querySelectorAll('[data-filter]');
const publications = document.querySelectorAll('.publication-list article');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.classList.toggle('active', selected);
      candidate.setAttribute('aria-pressed', String(selected));
    });
    publications.forEach((publication) => {
      publication.classList.toggle('hidden', filter !== 'all' && publication.dataset.type !== filter);
    });
  });
});