// ============================================================
// OPEN SOURCE — fetches Alishbah's public GitHub repos live via the
// GitHub REST API and renders them as cards. Falls back to a small
// static, known-accurate list if the fetch fails or GitHub's
// unauthenticated rate limit is hit, so the section never breaks.
// ============================================================
(function () {
  const grid = document.getElementById('repoGrid');
  if (!grid) return;

  const USERNAME = 'TheAlishbahWaheed';
  const MAX_REPOS = 6;

  const LANG_COLORS = {
    Python: '#3572A5', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
    'Jupyter Notebook': '#DA5B0B', TypeScript: '#3178c6', 'C#': '#178600',
    PHP: '#4F5D95', C: '#555555', 'C++': '#f34b7d'
  };

  const FALLBACK_REPOS = [
    { name: 'MyPortfolio', description: 'This site — a hand-built, continually iterated personal portfolio.', language: 'JavaScript', stargazers_count: 0, html_url: `https://github.com/${USERNAME}/MyPortfolio` },
    { name: 'Reflecto', description: 'Flask-based productivity and journaling platform, maintained open-source.', language: 'Python', stargazers_count: 0, html_url: `https://github.com/${USERNAME}/Reflecto` },
    { name: 'flyrank-ml-internship', description: 'ML pipelines for the FlyRank AI Fluency & Machine Learning internship capstone.', language: 'Jupyter Notebook', stargazers_count: 0, html_url: `https://github.com/${USERNAME}/flyrank-ml-internship` },
    { name: 'Resume-Analyzer', description: 'A Python/Flask tool that parses resumes and surfaces ATS-style feedback.', language: 'Python', stargazers_count: 0, html_url: `https://github.com/${USERNAME}/Resume-Analyzer` },
  ];

  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  }

  function cardHTML(repo) {
    const lang = repo.language || null;
    const dot = LANG_COLORS[lang] || 'var(--violet)';
    const updated = repo.pushed_at ? `<span>${timeAgo(repo.pushed_at)}</span>` : '';
    return `
      <article class="repo-card glass" data-reveal>
        <div class="repo-card-top">
          <h4><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h4>
          <span class="repo-star">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${repo.stargazers_count || 0}
          </span>
        </div>
        <p>${repo.description ? repo.description : 'No description provided.'}</p>
        <div class="repo-card-meta">
          ${lang ? `<span class="repo-lang"><i class="repo-lang-dot" style="background:${dot}"></i>${lang}</span>` : ''}
          ${updated}
        </div>
      </article>`;
  }

  function render(repos) {
    grid.innerHTML = repos.map(cardHTML).join('');
    const cards = grid.querySelectorAll('.repo-card');
    // Fade cards in — reveal.js already ran its querySelectorAll pass
    // before these existed, so trigger their entrance directly.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((c) => c.classList.add('is-visible'));
    } else {
      cards.forEach((c, i) => {
        setTimeout(() => c.classList.add('is-visible'), i * 90);
      });
    }
  }

  fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`)
    .then((res) => {
      if (!res.ok) throw new Error('GitHub API error');
      return res.json();
    })
    .then((repos) => {
      const cleaned = repos
        .filter((r) => !r.fork && !r.archived)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, MAX_REPOS);
      render(cleaned.length ? cleaned : FALLBACK_REPOS);
    })
    .catch(() => {
      render(FALLBACK_REPOS);
    });
})();
