const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(max-width:768px)').matches || ('ontouchstart' in window);

/* ═══ THEME TOGGLE (in-memory only) ═══ */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
themeToggle.addEventListener('click', ()=>{
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

/* ═══ SCROLL PROGRESS ═══ */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const height = h.scrollHeight - h.clientHeight;
  progressBar.style.width = height > 0 ? (h.scrollTop/height*100)+'%' : '0%';
}
window.addEventListener('scroll', updateProgress, {passive:true});

/* ═══ CURSOR (dot + ring, no dependency) ═══ */
const cur = document.getElementById('cur');
const curLabel = document.getElementById('curLabel');
let mx=0,my=0,cx=0,cy=0;
if(!isTouch){
  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    curLabel.style.left = mx+'px';
    curLabel.style.top  = my+'px';
  });
  (function loop(){
    cx += (mx-cx)*(reduced?1:0.35);
    cy += (my-cy)*(reduced?1:0.35);
    cur.style.left = cx+'px';
    cur.style.top  = cy+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,input,textarea,.term-tab').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      cur.classList.add('hovering');
      const txt = el.getAttribute('data-cursor-text');
      if(txt){ curLabel.textContent = txt; curLabel.classList.add('show'); }
    });
    el.addEventListener('mouseleave',()=>{
      cur.classList.remove('hovering');
      curLabel.classList.remove('show');
    });
  });
} else {
  cur.style.display='none';
  curLabel.style.display='none';
}

/* ═══ MAGNETIC BUTTONS ═══ */
if(!isTouch && !reduced){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = e.clientX - (r.left + r.width/2);
      const py = e.clientY - (r.top + r.height/2);
      el.style.transform = `translate(${px*0.18}px, ${py*0.3}px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
  });
}

/* ═══ TILT CARDS ═══ */
if(!isTouch && !reduced){
  document.querySelectorAll('.tilt').forEach(el=>{
    el.addEventListener('mousemove', e=>{
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width;
      const py = (e.clientY - r.top)/r.height;
      const rx = (py - 0.5) * -6;
      const ry = (px - 0.5) * 8;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', ()=>{ el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'; });
  });
}

/* ═══ HERO PARALLAX (deco letter) ═══ */
if(!reduced){
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    parallaxEls.forEach(el=>{
      const speed = parseFloat(el.getAttribute('data-parallax'));
      el.style.transform = `translateY(${y*speed}px)`;
    });
  }, {passive:true});
}

/* ═══ SPLIT-TEXT HEADING REVEAL ═══ */
document.querySelectorAll('.s-title.split').forEach(title=>{
  const original = Array.from(title.childNodes);
  title.innerHTML = '';
  let wordIndex = 0;
  original.forEach(node=>{
    if(node.nodeType === Node.TEXT_NODE){
      node.textContent.split(/(\s+)/).forEach(chunk=>{
        if(chunk.trim() === ''){ title.appendChild(document.createTextNode(chunk)); return; }
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = chunk;
        span.style.transitionDelay = (wordIndex*70)+'ms';
        wordIndex++;
        title.appendChild(span);
      });
    } else {
      const span = document.createElement('span');
      span.className = 'word';
      span.appendChild(node.cloneNode(true));
      span.style.transitionDelay = (wordIndex*70)+'ms';
      wordIndex++;
      title.appendChild(span);
    }
  });
});

/* ═══ INTRO SEQUENCE ═══ */
const intro   = document.getElementById('intro');
const awEl    = document.getElementById('awLetters');
const fullNm  = document.getElementById('fullName');
const nav     = document.getElementById('nav');
setTimeout(()=>{
  awEl.querySelectorAll('span').forEach(s=>{
    s.style.transition='opacity .35s ease, transform .35s ease';
    s.style.opacity='0';
    s.style.transform='scale(.6)';
  });
  setTimeout(()=>{ fullNm.classList.add('show'); }, 200);
}, 1600);
setTimeout(()=>{
  intro.classList.add('exit');
  setTimeout(()=>{
    intro.classList.add('gone');
    document.body.classList.remove('locked');
    nav.classList.add('show');
    startHeroTyping();
  }, 1150);
}, 3500);

/* ═══ MOBILE NAV ═══ */
const navToggle = document.getElementById('navToggle');
const navPanel  = document.getElementById('navMobilePanel');
const navScrim  = document.getElementById('navScrim');
function closeMobileNav(){
  navToggle.classList.remove('open');
  navPanel.classList.remove('open');
  navScrim.classList.remove('open');
}
navToggle.addEventListener('click', ()=>{
  const willOpen = !navPanel.classList.contains('open');
  navToggle.classList.toggle('open', willOpen);
  navPanel.classList.toggle('open', willOpen);
  navScrim.classList.toggle('open', willOpen);
});
navScrim.addEventListener('click', closeMobileNav);
navPanel.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMobileNav));

/* ═══ SCROLL REVEAL ═══ */
const allRv = document.querySelectorAll('.rv,.rv-l,.rv-r');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('on'), i*100);
      obs.unobserve(e.target);
    }
  });
},{threshold:0.1});
allRv.forEach(el=>obs.observe(el));

const titleObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('on'); titleObs.unobserve(e.target); }
  });
},{threshold:0.4});
document.querySelectorAll('.s-title.split').forEach(t=>titleObs.observe(t));

/* ═══ NAV HIDE/SHOW + ACTIVE LINK ═══ */
let lastY=0;
const navLinkEls = document.querySelectorAll('#navLinks a');
const sections = Array.from(navLinkEls).map(a=>document.querySelector(a.getAttribute('href')));
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(y<80){ nav.style.transform='translateY(0)'; }
  else if(y>lastY+6){ nav.style.transform='translateY(-110%)'; closeMobileNav(); }
  else if(y<lastY-6){ nav.style.transform='translateY(0)'; }
  lastY=y;
  let current = sections[0];
  const probeY = y + 140;
  sections.forEach(sec=>{ if(sec && sec.offsetTop <= probeY) current = sec; });
  navLinkEls.forEach(a=>{ a.classList.toggle('active', current && a.getAttribute('href') === '#'+current.id); });
  const toTop = document.getElementById('toTop');
  toTop.classList.toggle('show', y > window.innerHeight * 0.8);
}, {passive:true});
document.getElementById('toTop').addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'});
});

/* ═══ EXPLORE TERMINAL TABS ═══ */
const termTabs = document.querySelectorAll('.term-tab');
termTabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    termTabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.term-panel').forEach(p=>p.classList.remove('active'));
    document.getElementById('panel-'+tab.dataset.panel).classList.add('active');
  });
});

/* ═══ PROJECT FILTERS ═══ */
const filterChips = document.querySelectorAll('.pf-chip');
const projectCards = document.querySelectorAll('.proj-card');
const projEmpty = document.getElementById('projEmpty');
filterChips.forEach(chip=>{
  chip.addEventListener('click', ()=>{
    filterChips.forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.getAttribute('data-filter');
    let visibleCount = 0;
    projectCards.forEach(card=>{
      const tags = (card.getAttribute('data-tags') || '').split(' ');
      const match = filter === 'all' || tags.includes(filter);
      card.classList.toggle('filtered-out', !match);
      if(match) visibleCount++;
    });
    projEmpty.classList.toggle('show', visibleCount === 0);
  });
});

/* ═══ HERO TERMINAL TYPING ═══ */
function startHeroTyping(){
  const el = document.getElementById('termTyped');
  const lines = [
    'whoami', '→ IT undergraduate · AI · cyber security · game dev',
    'status --check', '→ building, breaking, learning — on repeat'
  ];
  let li=0, ci=0, deleting=false;
  function tick(){
    const full = lines[li];
    if(!deleting){
      el.textContent = full.slice(0, ++ci);
      if(ci === full.length){ deleting=false; setTimeout(()=>{ deleting=true; tick(); }, 1400); return; }
    } else {
      el.textContent = full.slice(0, --ci);
      if(ci === 0){ deleting=false; li=(li+1)%lines.length; }
    }
    setTimeout(tick, deleting ? 22 : 42);
  }
  tick();
}

/* ═══ HERO CANVAS — drifting circuit / node field ═══ */
(function heroCanvas(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,nodes=[];
  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.min(46, Math.floor((w*h)/28000));
    nodes = Array.from({length:count}, ()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25
    }));
  }
  function isDark(){ return root.getAttribute('data-theme')==='dark'; }
  function draw(){
    ctx.clearRect(0,0,w,h);
    const lineColor = isDark() ? 'rgba(63,207,142,0.14)' : 'rgba(13,32,56,0.07)';
    const dotColor  = isDark() ? 'rgba(238,155,184,0.55)' : 'rgba(238,155,184,0.65)';
    nodes.forEach(n=>{
      n.x += n.vx; n.y += n.vy;
      if(n.x<0||n.x>w) n.vx*=-1;
      if(n.y<0||n.y>h) n.vy*=-1;
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d<130){
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    nodes.forEach(n=>{
      ctx.fillStyle = dotColor;
      ctx.beginPath(); ctx.arc(n.x,n.y,1.6,0,Math.PI*2); ctx.fill();
    });
    if(!reduced) requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();
  draw();
})();

/* ═══ CONTACT FORM — EmailJS ═══ */
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const contactForm = document.getElementById('contactForm');
const cfBtn = document.getElementById('cfBtn');
const cfStatus = document.getElementById('cfStatus');
if(window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'){
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}
contactForm.addEventListener('submit', e=>{
  e.preventDefault();
  cfStatus.className = 'cf-status';
  if(EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'){
    cfStatus.textContent = 'Email sending isn\u2019t configured yet — add your EmailJS keys in script.js.';
    cfStatus.classList.add('err');
    return;
  }
  cfBtn.disabled = true;
  cfBtn.textContent = 'Sending…';
  cfStatus.textContent = '';
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
    .then(()=>{
      cfStatus.textContent = 'Message sent — thank you! I\u2019ll get back to you soon.';
      cfStatus.classList.add('ok');
      contactForm.reset();
    })
    .catch(()=>{
      cfStatus.textContent = 'Something went wrong — please email me directly instead.';
      cfStatus.classList.add('err');
    })
    .finally(()=>{
      cfBtn.disabled = false;
      cfBtn.textContent = 'Send Message →';
    });
});

/* ═══ GAME LAB — "Byte Dash" mini game ═══
   A tiny vanilla-JS game loop standing in for the Unity/C# work:
   dodge falling bugs, collect bytes, game state managed frame by frame. */
(function byteDash(){
  const canvas = document.getElementById('gameCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('glScore');
  const bestEl  = document.getElementById('glBest');
  const stateEl = document.getElementById('glState');
  const restartBtn = document.getElementById('glRestart');

  const W = canvas.width, H = canvas.height;
  let player, drops, score, best, speed, running, spawnTimer, rafId;

  function resetState(){
    player = { x: W/2, y: H-34, w: 26, h: 26, targetX: W/2 };
    drops = [];
    score = 0;
    speed = 1.6;
    running = true;
    spawnTimer = 0;
    scoreEl.textContent = '0';
    stateEl.textContent = '← → or drag to move';
  }
  best = 0;

  function spawnDrop(){
    const isByte = Math.random() < 0.28;
    drops.push({
      x: 20 + Math.random()*(W-40),
      y: -16,
      r: isByte ? 8 : 10,
      vy: speed + Math.random()*1.2,
      byte: isByte
    });
  }

  function rectCircleHit(px,py,pw,ph,cx,cy,cr){
    const nx = Math.max(px, Math.min(cx, px+pw));
    const ny = Math.max(py, Math.min(cy, py+ph));
    return Math.hypot(cx-nx, cy-ny) < cr;
  }

  function loop(){
    ctx.clearRect(0,0,W,H);

    // subtle grid backdrop
    ctx.strokeStyle = 'rgba(238,155,184,0.06)';
    for(let gx=0; gx<W; gx+=26){ ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,H); ctx.stroke(); }

    player.x += (player.targetX - player.x) * 0.22;
    ctx.fillStyle = '#3fcf8e';
    ctx.beginPath();
    ctx.roundRect(player.x - player.w/2, player.y, player.w, player.h, 6);
    ctx.fill();

    spawnTimer++;
    const spawnRate = Math.max(24, 46 - Math.floor(score/6));
    if(spawnTimer > spawnRate){ spawnTimer = 0; spawnDrop(); }

    for(let i=drops.length-1;i>=0;i--){
      const d = drops[i];
      d.y += d.vy;
      ctx.fillStyle = d.byte ? '#ee9bb8' : '#e2665f';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();

      if(rectCircleHit(player.x-player.w/2, player.y, player.w, player.h, d.x, d.y, d.r)){
        if(d.byte){
          score += 5;
          scoreEl.textContent = score;
          drops.splice(i,1);
          continue;
        } else {
          gameOver();
          return;
        }
      }
      if(d.y - d.r > H){
        if(!d.byte){ score += 1; scoreEl.textContent = score; }
        drops.splice(i,1);
      }
    }

    speed = 1.6 + score*0.012;
    rafId = requestAnimationFrame(loop);
  }

  function gameOver(){
    running = false;
    best = Math.max(best, score);
    bestEl.textContent = best;
    stateEl.textContent = 'Hit! Press Restart ↻';
    cancelAnimationFrame(rafId);
  }

  function start(){
    resetState();
    bestEl.textContent = best;
    cancelAnimationFrame(rafId);
    loop();
  }

  // controls
  window.addEventListener('keydown', e=>{
    if(!running) return;
    if(e.key === 'ArrowLeft') player.targetX = Math.max(16, player.targetX - 34);
    if(e.key === 'ArrowRight') player.targetX = Math.min(W-16, player.targetX + 34);
  });
  function pointerMove(clientX){
    const rect = canvas.getBoundingClientRect();
    const scale = W / rect.width;
    const x = (clientX - rect.left) * scale;
    player.targetX = Math.max(16, Math.min(W-16, x));
  }
  canvas.addEventListener('mousemove', e=>{ if(running) pointerMove(e.clientX); });
  canvas.addEventListener('touchmove', e=>{ if(running){ pointerMove(e.touches[0].clientX); e.preventDefault(); } }, {passive:false});
  restartBtn.addEventListener('click', start);

  // start once the game lab section is in view
  const glObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !player){ start(); }
    });
  }, {threshold:0.3});
  glObs.observe(canvas);
})();
