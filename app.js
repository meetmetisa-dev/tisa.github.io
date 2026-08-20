const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

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


// Advanced AI portfolio extension: additive and safe for the existing homepage.
(() => {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'ai-methods.css';
  document.head.appendChild(stylesheet);

  const nav = document.querySelector('.site-header nav');
  if (nav && !nav.querySelector('a[href="#advanced-ai"]')) {
    const link = document.createElement('a');
    link.href = '#advanced-ai';
    link.textContent = 'Advanced AI';
    nav.insertBefore(link, nav.querySelector('a[href="#publications"]'));
  }

  const publicationsSection = document.querySelector('#publications');
  if (publicationsSection && !document.querySelector('#advanced-ai')) {
    publicationsSection.insertAdjacentHTML('beforebegin', "\n<section id=\"advanced-ai\" class=\"advanced-ai-showcase section-pad\">\n  <p class=\"section-index\">02 / Advanced AI prototypes</p>\n  <div class=\"advanced-ai-heading\">\n    <div><h2>Coordination, distributed learning, and adaptive recovery</h2></div>\n    <div><p>Three executable portfolio prototypes extend my work in trustworthy, multimodal, and drift-aware AI. They are synthetic, reproducible demonstrations\u2014not peer-reviewed publications or production deployments.</p><a class=\"advanced-ai-link\" href=\"advanced-ai.html\">Open the complete Advanced AI portfolio \u2197</a></div>\n  </div>\n  <div class=\"advanced-ai-grid\">\n    <article style=\"--project-accent:#73d3dc\"><p class=\"advanced-ai-topic\">Multi-Agent Reinforcement Learning</p><h3>Cooperative Edge QoE Control</h3><p>Three cooperative resource agents learn a shared allocation policy under changing demand.</p><div class=\"advanced-ai-metrics\"><span><strong>0.886</strong> learned reward</span><span><strong>+22.7%</strong> vs random</span></div><a href=\"advanced-ai.html#multiagent-reinforcement-learning\">Project, code, and protocol \u2197</a></article>\n    <article style=\"--project-accent:#eab86b\"><p class=\"advanced-ai-topic\">Federated Learning</p><h3>Non-IID Multisite FedAvg</h3><p>Eight heterogeneous sites train a shared model without pooling synthetic records.</p><div class=\"advanced-ai-metrics\"><span><strong>76.2%</strong> mean accuracy</span><span><strong>73.2%</strong> worst client</span></div><a href=\"advanced-ai.html#federated-learning\">Project, code, and protocol \u2197</a></article>\n    <article style=\"--project-accent:#ef7a66\"><p class=\"advanced-ai-topic\">Deep Reinforcement Learning</p><h3>Double DQN for Drift-Aware QoE Recovery</h3><p>A neural controller selects recovery actions while accounting for intervention cost and cooldown.</p><div class=\"advanced-ai-metrics\"><span><strong>0.800</strong> mean QoE</span><span><strong>0.05%</strong> outage rate</span></div><a href=\"advanced-ai.html#deep-reinforcement-learning\">Project, code, and protocol \u2197</a></article>\n  </div>\n</section>");
  }
})();
