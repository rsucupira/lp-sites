(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5511934352448';
  const encodeMessage = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const normalizeIdentity = value => String(value || '')
    .replace(/Rodrigo Sucupira Andrade de Carvalho Lima/g, 'Rodrigo de Carvalho')
    .replace(/Rodrigo Sucupira/g, 'Rodrigo de Carvalho')
    .replace(/Rodrigo Carvalho/g, 'Rodrigo de Carvalho');

  const applyPublicIdentity = () => {
    document.title = normalizeIdentity(document.title);
    document.querySelectorAll('meta[content]').forEach(meta => {
      meta.setAttribute('content', normalizeIdentity(meta.getAttribute('content')));
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => {
      const updated = normalizeIdentity(node.nodeValue);
      if (updated !== node.nodeValue) node.nodeValue = updated;
    });

    document.querySelectorAll('a[href]').forEach(link => {
      try {
        const url = new URL(link.href, window.location.href);
        const isRodrigoGithub = url.hostname.toLowerCase() === 'github.com'
          && /^\/rsucupira(?:\/|$)/i.test(url.pathname);
        if (isRodrigoGithub) link.remove();
      } catch (_) {
        // Ignora URLs inválidas ou manipuladas por scripts externos.
      }
    });
  };

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

  const portfolioGrid = document.querySelector('.portfolio-grid');
  if (portfolioGrid && !portfolioGrid.querySelector('[data-project="carlos-magico"]')) {
    const magicStyles = document.createElement('style');
    magicStyles.textContent = `
      .preview-magico{position:relative;overflow:hidden;background:radial-gradient(circle at 72% 22%,rgba(188,121,255,.42),transparent 25%),linear-gradient(145deg,#050507,#15101f 58%,#2a143d);color:#fff}
      .preview-magico:after{content:"";position:absolute;inset:auto -12% -46% 18%;height:78%;border-radius:50%;background:radial-gradient(circle,rgba(220,174,255,.28),transparent 68%);filter:blur(8px)}
      .preview-magico .magic-symbol{position:absolute;right:10%;top:29%;z-index:1;width:84px;height:84px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.36);border-radius:50%;font-size:42px;text-shadow:0 0 24px rgba(228,189,255,.9);box-shadow:0 0 36px rgba(160,82,220,.28),inset 0 0 24px rgba(255,255,255,.08)}
      .preview-magico .preview-copy{position:relative;z-index:2}
    `;
    document.head.appendChild(magicStyles);

    portfolioGrid.insertAdjacentHTML('beforeend', `
      <article class="project-card reveal" data-category="profissional empresa" data-project="carlos-magico">
        <a class="project-preview preview-magico" href="https://rsucupira.github.io/lp-magico/" target="_blank" rel="noopener noreferrer">
          <div class="mini-browser"><i></i><i></i><i></i><span>mágica para eventos</span></div>
          <div class="magic-symbol" aria-hidden="true">✦</div>
          <div class="preview-copy"><small>Experiência ao vivo</small><strong>Carlos Batista — Mágico</strong><span>eventos · reação · encantamento</span></div>
        </a>
        <div class="project-content">
          <div class="project-meta"><span>Entretenimento</span><span>LP promocional</span></div>
          <h3>Carlos Batista — Mágico</h3>
          <p>Landing page de alto impacto para divulgar apresentações em eventos. Foram estruturados vídeo de destaque, benefícios, prova visual, chamada para reserva e contato direto, com estética escura e foco em conversão.</p>
          <a class="project-link" href="https://rsucupira.github.io/lp-magico/" target="_blank" rel="noopener noreferrer">Abrir projeto <span>↗</span></a>
        </div>
      </article>`);
  }

  const projectCount = document.querySelector('.hero-proof strong');
  if (projectCount && /projetos?/i.test(projectCount.textContent)) {
    projectCount.textContent = '9 projetos';
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

  applyPublicIdentity();
})();