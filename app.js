'use strict';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
const mobileLayout = window.matchMedia('(max-width: 760px)');

function setMenu(open) {
  if (!header || !menuButton) return;
  header.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  const indicator = menuButton.querySelector('span');
  if (indicator) indicator.textContent = open ? '−' : '+';
}

// Navigation stays available if JavaScript is disabled or cannot initialize.
if (header && menuButton && navigation) {
  document.body.classList.add('js-ready');
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;
    const target = document.getElementById(link.hash.slice(1));
    if (target && mobileLayout.matches) {
      // Keep keyboard focus at the destination when the mobile menu closes.
      const addedTabIndex = !target.hasAttribute('tabindex');
      if (addedTabIndex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (addedTabIndex) {
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      }
    }
    setMenu(false);
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
const trackedSections = navLinks.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
const readingProgress = document.querySelector('.reading-progress');
let framePending = false;

function updateViewport() {
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
  if (readingProgress) {
    const scrollRange = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;
    readingProgress.style.transform = `scaleX(${progress})`;
  }
}

function scheduleViewportUpdate() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateViewport);
}

window.addEventListener('scroll', scheduleViewportUpdate, { passive: true });
window.addEventListener('resize', scheduleViewportUpdate);
window.addEventListener('load', scheduleViewportUpdate);
updateViewport();

const researchVisual = document.querySelector('.research-visual');
const explorerControls = document.querySelector('.explorer-controls');
const explorerButtons = [...document.querySelectorAll('.explorer-controls [data-explore]')];
const explorerPanels = [...document.querySelectorAll('.explorer-panel[data-panel]')];

function selectResearchDirection(direction) {
  if (!explorerPanels.some((panel) => panel.dataset.panel === direction)) return;
  explorerButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.explore === direction));
  });
  explorerPanels.forEach((panel) => { panel.hidden = panel.dataset.panel !== direction; });
  if (researchVisual) researchVisual.dataset.active = direction;
  scheduleViewportUpdate();
}

explorerButtons.forEach((button) => {
  if (!explorerPanels.some((panel) => panel.dataset.panel === button.dataset.explore)) return;
  button.hidden = false;
  button.addEventListener('click', () => selectResearchDirection(button.dataset.explore));
});
selectResearchDirection('infer');
if (explorerControls && explorerPanels.length) explorerControls.hidden = false;

const filterButtons = [...document.querySelectorAll('[data-filter]')];
const publications = [...document.querySelectorAll('.publication[data-type]')];
const publicationSearch = document.querySelector('#publication-search');
const publicationCount = document.querySelector('#publication-count');
const publicationEmpty = document.querySelector('#publication-empty');
const clearSearch = document.querySelector('#clear-search');
let selectedCategory = 'all';

// Cache source text before enhancement feedback changes any displayed text.
const publicationSearchText = new Map(publications.map((publication) => [
  publication,
  `${publication.textContent} ${publication.dataset.keywords || ''}`.toLowerCase(),
]));

function applyPublicationFilters() {
  const query = publicationSearch ? publicationSearch.value.trim().toLowerCase() : '';
  const tokens = query ? query.split(/\s+/) : [];
  let count = 0;
  publications.forEach((publication) => {
    const matchesCategory = selectedCategory === 'all' || publication.dataset.type === selectedCategory;
    const matchesQuery = tokens.every((token) => publicationSearchText.get(publication).includes(token));
    publication.hidden = !(matchesCategory && matchesQuery);
    if (!publication.hidden) count += 1;
  });
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === selectedCategory));
  });
  if (publicationCount) publicationCount.textContent = `${count} of ${publications.length} publications`;
  if (publicationEmpty) publicationEmpty.hidden = count !== 0;
  if (clearSearch) clearSearch.hidden = !publicationSearch || publicationSearch.value.length === 0;
  scheduleViewportUpdate();
}

function resetPublications() {
  selectedCategory = 'all';
  if (publicationSearch) publicationSearch.value = '';
  applyPublicationFilters();
}

filterButtons.forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', () => {
    selectedCategory = button.dataset.filter;
    applyPublicationFilters();
  });
});
if (publicationSearch) publicationSearch.addEventListener('input', applyPublicationFilters);
if (clearSearch) {
  clearSearch.addEventListener('click', () => {
    if (publicationSearch) publicationSearch.value = '';
    applyPublicationFilters();
    if (publicationSearch) publicationSearch.focus();
  });
}
document.querySelectorAll('[data-reset-publications]').forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', () => {
    resetPublications();
    if (publicationSearch) publicationSearch.focus();
  });
});
const toolbar = document.querySelector('.publication-toolbar');
if (toolbar) toolbar.hidden = false;
applyPublicationFilters();

// Deep links keep working even when search or category filters hide a paper.
function revealLinkedPublication(hash) {
  const publication = publications.find((item) => `#${item.id}` === hash);
  if (!publication || !publication.hidden) return null;
  resetPublications();
  return publication;
}
document.querySelectorAll('a[href^="#paper-"]').forEach((link) => {
  link.addEventListener('click', () => revealLinkedPublication(link.hash));
});
window.addEventListener('hashchange', () => {
  const revealed = revealLinkedPublication(window.location.hash);
  if (revealed) revealed.scrollIntoView({ block: 'start' });
});
const initiallyRevealed = revealLinkedPublication(window.location.hash);
if (initiallyRevealed) initiallyRevealed.scrollIntoView({ block: 'start' });

const copyStatus = document.querySelector('#copy-status');
let copyAttempt = 0;
let copyStatusTimer;

async function copyText(text, label, failureMessage) {
  const attempt = ++copyAttempt;
  window.clearTimeout(copyStatusTimer);
  if (copyStatus) copyStatus.textContent = `Copying ${label}…`;
  try {
    if (!text || !navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    if (copyStatus && attempt === copyAttempt) {
      copyStatus.textContent = `${label} copied to clipboard.`;
      copyStatusTimer = window.setTimeout(() => { copyStatus.textContent = ''; }, 6000);
    }
  } catch {
    if (copyStatus && attempt === copyAttempt) copyStatus.textContent = failureMessage;
  }
}

document.querySelectorAll('[data-copy-doi]').forEach((button) => {
  const doi = button.dataset.copyDoi;
  if (!doi) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    copyText(doi, 'DOI', `Copy unavailable. DOI: ${doi}`);
  });
});
const citationText = document.querySelector('#citation-text');
document.querySelectorAll('[data-copy-citation]').forEach((button) => {
  if (!citationText) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    copyText(citationText.textContent.trim(), 'Citation', 'Copy unavailable. Select the citation in the article.');
  });
});
document.querySelectorAll('.citation-details, .research-details').forEach((details) => {
  details.addEventListener('toggle', scheduleViewportUpdate);
});
