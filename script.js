(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5511934352448';
  const encodeMessage = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll('.whatsapp-link').forEach(link => {
    const message = link.dataset.message || 'Olá, Rodrigo. Gostaria de conversar sobre a criação de um site.';
    link.href = encodeMessage(message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
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

  const filterButtons = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        card.hidden = filter !== 'todos' && !categories.includes(filter);
      });
    });
  });

  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(quoteForm);
      const tipo = data.get('tipo');
      const objetivo = data.get('objetivo');
      const detalhes = String(data.get('detalhes') || '').trim();
      const message = [
        'Olá, Rodrigo. Vim pela página de Sites & Landing Pages.',
        `Tipo de projeto: ${tipo}.`,
        `Objetivo principal: ${objetivo}.`,
        detalhes ? `Resumo: ${detalhes}` : 'Ainda preciso organizar melhor os detalhes.'
      ].join('\n');
      window.open(encodeMessage(message), '_blank', 'noopener,noreferrer');
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
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
