(function(){
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') { gsap.registerPlugin(ScrollTrigger); }

  /* ============================================================
     PRELOADER
     ============================================================ */
  function runPreloader(cb){
    var el = document.getElementById('loader');
    var countEl = document.getElementById('loaderCount');
    var barEl = document.getElementById('loaderBar');
    document.body.classList.add('no-scroll');

    if (reduceMotion){
      el.classList.add('done');
      document.body.classList.remove('no-scroll');
      cb();
      return;
    }

    var val = 0;
    var duration = 1400;
    var start = performance.now();
    function tick(now){
      var p = Math.min(1, (now - start) / duration);
      val = Math.floor(p * 100);
      countEl.textContent = val;
      barEl.style.width = (p * 100) + '%';
      if (p < 1){
        requestAnimationFrame(tick);
      } else {
        setTimeout(function(){
          el.classList.add('done');
          document.body.classList.remove('no-scroll');
          cb();
        }, 220);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ============================================================
     HERO ENTRANCE
     ============================================================ */
  function heroEntrance(){
    var lines = document.querySelectorAll('.hero-title .line span');
    if (hasGSAP){
      gsap.set(lines, { yPercent: 110 });
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to(lines, { yPercent: 0, duration: 1, stagger: 0.12 })
        .from('.status-pill', { opacity: 0, y: -10, duration: .6 }, '-=.7')
        .from('.hero-type', { opacity: 0, duration: .6 }, '-=.5')
        .from('.hero-desc', { opacity: 0, y: 14, duration: .6 }, '-=.4')
        .from('.hero-actions .btn', { opacity: 0, y: 14, duration: .5, stagger: .1 }, '-=.35')
        .from('.hero-social .icon-btn', { opacity: 0, y: 10, duration: .4, stagger: .06 }, '-=.3');
    } else {
      lines.forEach(function(s){ s.style.transform = 'translateY(0)'; });
    }
  }

  /* ============================================================
     TYPED ROTATING LINE
     ============================================================ */
  function initTyped(){
    var phrases = [
      'I build machine learning systems.',
      'I build full-stack web applications.',
      'I build interactive, AI-assisted tools.',
      'I build things that ship.'
    ];
    var target = document.getElementById('typeTarget');
    if (!target) return;
    if (reduceMotion){ target.textContent = phrases[0]; return; }

    var pi = 0, ci = 0, deleting = false;
    function step(){
      var word = phrases[pi];
      if (!deleting){
        ci++;
        target.textContent = word.slice(0, ci);
        if (ci === word.length){
          deleting = true;
          setTimeout(step, 1600);
          return;
        }
        setTimeout(step, 42);
      } else {
        ci--;
        target.textContent = word.slice(0, ci);
        if (ci === 0){
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(step, 300);
          return;
        }
        setTimeout(step, 22);
      }
    }
    step();
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  function initCursor(){
    if (!isFinePointer) return;
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    function loop(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    }
    loop();

    var hoverSelector = 'a, button, .pcard, .cert-card, input, textarea, .filter-btn';
    document.addEventListener('mouseover', function(e){
      if (e.target.closest && e.target.closest(hoverSelector)) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', function(e){
      if (e.target.closest && e.target.closest(hoverSelector)) ring.classList.remove('hovering');
    });
  }

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  function initMagnetic(){
    if (!isFinePointer || reduceMotion) return;
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * 0.28) + 'px,' + (y * 0.5) + 'px)';
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  /* ============================================================
     NAVBAR: scroll shadow + scroll-spy + mobile menu
     ============================================================ */
  function initNavbar(){
    var nav = document.getElementById('navbar');
    window.addEventListener('scroll', function(){
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    var links = document.querySelectorAll('.nav-links a');
    var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
    if ('IntersectionObserver' in window && sections.length){
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            var id = entry.target.id;
            links.forEach(function(l){
              l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
      sections.forEach(function(s){ obs.observe(s); });
    }

    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    toggle.addEventListener('click', function(){
      menu.classList.toggle('open');
      document.body.classList.toggle('no-scroll', menu.classList.contains('open'));
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ============================================================
     THEME TOGGLE
     ============================================================ */
  function initTheme(){
    var btn = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    var sunPath = 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z';
    var moonPath = 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z';
    btn.addEventListener('click', function(){
      var root = document.documentElement;
      var isLight = root.getAttribute('data-theme') === 'light';
      root.setAttribute('data-theme', isLight ? 'dark' : 'light');
      icon.innerHTML = '<path d="' + (isLight ? moonPath : sunPath) + '"/>';
    });
  }

  /* ============================================================
     SCROLL REVEALS
     ============================================================ */
  function initReveals(){
    var els = document.querySelectorAll('.reveal, .section-head, .tl-item, .pcard, .edu-row, .cert-card');
    if (hasGSAP && !reduceMotion){
      els.forEach(function(el){
        gsap.fromTo(el, { opacity: 0, y: 26 }, {
          opacity: 1, y: 0, duration: .8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
    } else {
      els.forEach(function(el){ el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }

  /* ============================================================
     NEURAL GRAPH CANVAS (hero + lab)
     ============================================================ */
  function makeGraph(canvas, opts){
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var nodes = [];
    var pulses = [];
    var mouse = { x: -9999, y: -9999 };
    var count = opts.count || 46;
    var linkDist = opts.linkDist || 150;
    var interactive = !!opts.interactive;
    var colors = opts.colors || ['139,92,246', '34,211,238'];

    function resize(){
      var rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function seed(){
      nodes = [];
      for (var i = 0; i < count; i++){
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 1
        });
      }
    }
    function spawnPulse(){
      if (nodes.length < 2) return;
      var a = nodes[Math.floor(Math.random() * nodes.length)];
      var b = nodes[Math.floor(Math.random() * nodes.length)];
      var d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > linkDist || d < 10) return;
      pulses.push({ a: a, b: b, t: 0 });
    }

    resize();
    seed();
    window.addEventListener('resize', function(){ resize(); });

    if (interactive){
      canvas.addEventListener('mousemove', function(e){
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      });
      canvas.addEventListener('mouseleave', function(){ mouse.x = -9999; mouse.y = -9999; });
    }

    var frame = 0;
    function draw(){
      frame++;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(function(n){
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (interactive){
          var dx = n.x - mouse.x, dy = n.y - mouse.y;
          var d = Math.hypot(dx, dy);
          if (d < 110){
            n.x += (dx / d) * 0.6; n.y += (dy / d) * 0.6;
          }
        }
      });

      for (var i = 0; i < nodes.length; i++){
        for (var j = i + 1; j < nodes.length; j++){
          var a = nodes[i], b = nodes[j];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist){
            var o = (1 - d / linkDist) * 0.35;
            ctx.strokeStyle = 'rgba(' + colors[0] + ',' + o + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      if (frame % 70 === 0) spawnPulse();
      pulses = pulses.filter(function(p){ return p.t < 1; });
      pulses.forEach(function(p){
        p.t += 0.012;
        var x = p.a.x + (p.b.x - p.a.x) * p.t;
        var y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.fillStyle = 'rgba(' + colors[1] + ',0.95)';
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      });

      nodes.forEach(function(n){
        ctx.fillStyle = 'rgba(244,245,247,0.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    if (reduceMotion){
      draw(); // one static-ish frame; loop still runs but motion is negligible cost
    } else {
      draw();
    }
  }

  /* ============================================================
     PROJECT FILTER
     ============================================================ */
  function initFilter(){
    var btns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.pcard');
    btns.forEach(function(btn){
      btn.addEventListener('click', function(){
        btns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        cards.forEach(function(card){
          var tags = (card.getAttribute('data-tags') || '').split(' ');
          var show = f === 'all' || tags.indexOf(f) !== -1;
          card.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ============================================================
     PROJECT TILT + SPOTLIGHT
     ============================================================ */
  function initTilt(){
    if (!isFinePointer || reduceMotion) return;
    document.querySelectorAll('.pcard').forEach(function(card){
      var inner = card.querySelector('.tilt-inner');
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = ((e.clientX - r.left) / r.width) * 100;
        var py = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', px + '%');
        card.style.setProperty('--my', py + '%');
        var rx = ((py - 50) / 50) * -5;
        var ry = ((px - 50) / 50) * 5;
        if (inner) inner.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
      });
      card.addEventListener('mouseleave', function(){
        if (inner) inner.style.transform = 'rotateX(0) rotateY(0)';
      });
    });
  }

  /* ============================================================
     TOAST
     ============================================================ */
  var toastTimer;
  function toast(msg){
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 3200);
  }

  /* ============================================================
     COMMAND PALETTE
     ============================================================ */
  function initPalette(){
    var overlay = document.getElementById('paletteOverlay');
    var input = document.getElementById('paletteInput');
    var list = document.getElementById('paletteList');
    var items = [
      { label: 'Home', href: '#hero', hint: 'section' },
      { label: 'About', href: '#about', hint: 'section' },
      { label: 'Skills', href: '#skills', hint: 'section' },
      { label: 'Experience', href: '#experience', hint: 'section' },
      { label: 'Projects', href: '#projects', hint: 'section' },
      { label: 'AI/ML Lab', href: '#lab', hint: 'section' },
      { label: 'Education', href: '#education', hint: 'section' },
      { label: 'Certifications', href: '#certifications', hint: 'section' },
      { label: 'Research', href: '#research', hint: 'section' },
      { label: 'Contact', href: '#contact', hint: 'section' },
      { label: 'GitHub profile', href: 'https://github.com/TheAlishbahWaheed', hint: 'external' },
      { label: 'LinkedIn profile', href: 'https://linkedin.com/in/alishbahwaheed', hint: 'external' },
      { label: 'Email Alishbah', href: 'mailto:alishbaw026@gmail.com', hint: 'external' }
    ];

    function render(query){
      var q = (query || '').toLowerCase();
      var filtered = items.filter(function(it){ return it.label.toLowerCase().indexOf(q) !== -1; });
      list.innerHTML = '';
      if (!filtered.length){
        list.innerHTML = '<li class="palette-empty">No matches. Try “projects” or “contact”.</li>';
        return;
      }
      filtered.forEach(function(it, i){
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = it.href;
        if (it.hint === 'external'){ a.target = '_blank'; a.rel = 'noopener'; }
        a.innerHTML = '<span>' + it.label + '</span><span>' + it.hint + '</span>';
        if (i === 0) a.classList.add('sel');
        a.addEventListener('click', function(){ closePalette(); });
        li.appendChild(a);
        list.appendChild(li);
      });
    }

    function openPalette(){
      overlay.classList.add('open');
      input.value = '';
      render('');
      setTimeout(function(){ input.focus(); }, 60);
    }
    function closePalette(){ overlay.classList.remove('open'); }

    document.getElementById('paletteBtn').addEventListener('click', openPalette);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) closePalette(); });
    input.addEventListener('input', function(){ render(input.value); });

    document.addEventListener('keydown', function(e){
      var mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'k'){ e.preventDefault(); openPalette(); }
      if (e.key === 'Escape') closePalette();
      if (e.key === 'Enter' && overlay.classList.contains('open')){
        var sel = list.querySelector('a.sel') || list.querySelector('a');
        if (sel) sel.click();
      }
    });
  }

  /* ============================================================
     CONTACT FORM -> mailto
     ============================================================ */
  function initContactForm(){
    var form = document.getElementById('contactForm');
    if (!form) return;
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var fields = [
      { input: document.getElementById('fName'), error: document.getElementById('fNameError'),
        validate: function(v){ return v.trim().length > 0 ? '' : 'Please enter your name.'; } },
      { input: document.getElementById('fEmail'), error: document.getElementById('fEmailError'),
        validate: function(v){ return emailRe.test(v.trim()) ? '' : 'Please enter a valid email address.'; } },
      { input: document.getElementById('fMsg'), error: document.getElementById('fMsgError'),
        validate: function(v){ return v.trim().length > 0 ? '' : 'Please add a short message.'; } }
    ];

    function validateField(f){
      var msg = f.validate(f.input.value);
      var wrap = f.input.closest('.form-field');
      if (wrap) wrap.classList.toggle('error', !!msg);
      if (f.error) f.error.textContent = msg;
      return !msg;
    }

    fields.forEach(function(f){
      if (!f.input) return;
      f.input.addEventListener('blur', function(){ validateField(f); });
      f.input.addEventListener('input', function(){
        var wrap = f.input.closest('.form-field');
        if (wrap && wrap.classList.contains('error')) validateField(f);
      });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var allValid = fields.reduce(function(ok, f){ return validateField(f) && ok; }, true);
      if (!allValid){
        toast('Please fix the highlighted fields');
        return;
      }
      var name = document.getElementById('fName').value.trim();
      var email = document.getElementById('fEmail').value.trim();
      var msg = document.getElementById('fMsg').value.trim();
      var subject = encodeURIComponent('Portfolio contact from ' + (name || 'a visitor'));
      var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = 'mailto:alishbaw026@gmail.com?subject=' + subject + '&body=' + body;
      toast('Opening your email client…');
    });
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function initToTop(){
    document.getElementById('toTop').addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ============================================================
     EASTER EGG — Konami code
     ============================================================ */
  function initEasterEgg(){
    var seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    var pos = 0;
    document.addEventListener('keydown', function(e){
      var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[pos]) { pos++; } else { pos = (key === seq[0]) ? 1 : 0; }
      if (pos === seq.length){
        pos = 0;
        toast('🎉 secret unlocked — thanks for actually exploring the code.');
        console.log('%cHi, fellow curious developer 👋', 'font-size:16px;color:#22D3EE;');
        console.log('%cIf you are reading this in devtools — let\'s connect: alishbaw026@gmail.com', 'color:#8B5CF6;');
      }
    });
  }

  /* ============================================================
     SCROLL PROGRESS BAR
     ============================================================ */
  function initScrollProgress(){
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update(){
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ============================================================
     LIVE GITHUB STATS BADGE
     ============================================================ */
  function initGitHubBadge(){
    var badge = document.getElementById('ghBadge');
    var label = document.getElementById('ghBadgeLabel');
    if (!badge || !label || !('fetch' in window)) return;
    fetch('https://api.github.com/users/TheAlishbahWaheed')
      .then(function(res){ if (!res.ok) throw new Error('gh api error'); return res.json(); })
      .then(function(data){
        var repos = data.public_repos;
        if (typeof repos === 'number'){
          label.textContent = repos + ' public repos on GitHub';
          badge.classList.add('live');
        }
      })
      .catch(function(){
        label.textContent = 'View repos on GitHub';
      });
  }

  /* ============================================================
     COPY EMAIL TO CLIPBOARD
     ============================================================ */
  function initCopyEmail(){
    var btn = document.getElementById('copyEmailBtn');
    if (!btn) return;
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var email = btn.getAttribute('data-email') || '';
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(email).then(function(){
          toast('Email copied to clipboard');
        }).catch(function(){
          toast('Could not copy — email is ' + email);
        });
      } else {
        toast('Email is ' + email);
      }
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function(){
    initTheme();
    initNavbar();
    initFilter();
    initTilt();
    initCursor();
    initMagnetic();
    initPalette();
    initContactForm();
    initToTop();
    initEasterEgg();
    initScrollProgress();
    initGitHubBadge();
    initCopyEmail();

    makeGraph(document.getElementById('heroCanvas'), { count: 52, linkDist: 150, interactive: true, colors: ['139,92,246','34,211,238'] });
    makeGraph(document.getElementById('labCanvas'), { count: 34, linkDist: 90, interactive: false, colors: ['34,211,238','139,92,246'] });

    runPreloader(function(){
      heroEntrance();
      initTyped();
      initReveals();
    });
  });
})();
