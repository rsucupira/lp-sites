(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5511934352448';
  const UEBEY_START = 'https://rsucupira.github.io/start/';
  const UEBEY_ORIGIN = 'https://www.uebey.com';
  const INSTAGRAM_URL = 'https://www.instagram.com/uebeysites/';

  const currentParams = new URLSearchParams(window.location.search);
  const trackedKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];

  function buildStartUrl(plan) {
    const url = new URL(UEBEY_START);
    if (plan) url.searchParams.set('plan', plan);
    url.searchParams.set('utm_source', currentParams.get('utm_source') || 'lp-sites');
    url.searchParams.set('utm_medium', currentParams.get('utm_medium') || 'referral');
    url.searchParams.set('utm_campaign', currentParams.get('utm_campaign') || 'uebey-sites');
    trackedKeys.forEach(key => {
      const value = currentParams.get(key);
      if (value) url.searchParams.set(key, value);
    });
    return url.toString();
  }

  function whatsappUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  document.querySelectorAll('.start-link').forEach(link => {
    link.href = buildStartUrl(link.dataset.plan || 'start');
  });

  document.querySelectorAll('.whatsapp-link').forEach(link => {
    const message = link.dataset.message || 'Olá. Vim pela Uebey Sites e gostaria de conversar sobre um projeto.';
    link.href = whatsappUrl(message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // Link oficial do Instagram em dois pontos visíveis: menu e rodapé.
  const mainNav = document.querySelector('.main-nav');
  if (mainNav && !mainNav.querySelector('.instagram-link')) {
    const instagram = document.createElement('a');
    instagram.className = 'instagram-link';
    instagram.href = INSTAGRAM_URL;
    instagram.target = '_blank';
    instagram.rel = 'noopener noreferrer';
    instagram.setAttribute('aria-label', 'Instagram da UEBEY Sites');
    instagram.textContent = 'Instagram ↗';
    const cta = mainNav.querySelector('.nav-cta');
    mainNav.insertBefore(instagram, cta || null);
  }

  const footerLinks = document.querySelector('.footer-main > div');
  if (footerLinks && !footerLinks.querySelector('.instagram-link')) {
    const instagram = document.createElement('a');
    instagram.className = 'instagram-link';
    instagram.href = INSTAGRAM_URL;
    instagram.target = '_blank';
    instagram.rel = 'noopener noreferrer';
    instagram.textContent = 'Instagram';
    footerLinks.appendChild(instagram);
  }

  // Mantém todo o portfólio sob URLs canônicas do domínio Uebey,
  // inclusive quando a landing é carregada pelo espelho de contingência.
  document.querySelectorAll('a.project[href^="/sites/projetos/"]').forEach(link => {
    link.href = `${UEBEY_ORIGIN}${link.getAttribute('href')}`;
    link.target = '_top';
  });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();