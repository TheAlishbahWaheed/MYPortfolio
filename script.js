const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(max-width:768px)').matches || ('ontouchstart' in window);

/* ═══════════════════════════════════
   THEME TOGGLE (in-memory only — no
   localStorage per this environment;
   add it yourself once self-hosted if
   you want the choice to persist)
═══════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
themeToggle.addEventListener('click', ()=>{
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

/* ═══════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════ */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const height = h.scrollHeight - h.clientHeight;
  progressBar.style.width = height > 0 ? (scrolled/height*100)+'%' : '0%';
}
window.addEventListener('scroll', updateProgress, {passive:true});

/* ═══════════════════════════════════
   CAT CURSOR (desktop only, buttery lerp)
═══════════════════════════════════ */
const cur = document.getElementById('cur');
const curLabel = document.getElementById('curLabel');
let mx=0, my=0, cx=0, cy=0;
let pawTimer=0;

if(!isTouch){
  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    curLabel.style.left = mx+'px';
    curLabel.style.top  = my+'px';
    if(!reduced){
      clearTimeout(pawTimer);
      pawTimer = setTimeout(()=>{ spawnPaw(mx, my); }, 120);
    }
  });
  function spawnPaw(x, y){
    const dot = document.createElement('div');
    dot.className='paw-dot';
    dot.style.left = (x + (Math.random()*10-5)) + 'px';
    dot.style.top  = (y + (Math.random()*10-5)) + 'px';
    document.body.appendChild(dot);
    setTimeout(()=>dot.remove(), 800);
  }
  (function cursorLoop(){
    cx += (mx-cx)*(reduced?1:0.35);
    cy += (my-cy)*(reduced?1:0.35);
    cur.style.left = cx+'px';
    cur.style.top  = cy+'px';
    requestAnimationFrame(cursorLoop);
  })();
  document.querySelectorAll('a,button').forEach(el=>{
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

/* ═══════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   TILT CARDS
═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   HERO PARALLAX
═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   SPLIT-TEXT HEADING REVEAL
═══════════════════════════════════ */
// Split-text using actual child nodes (preserves <em> markup)
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

/* ═══════════════════════════════════
   INTRO SEQUENCE
═══════════════════════════════════ */
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
  }, 1150);
}, 3500);

/* ═══════════════════════════════════
   MOBILE NAV
═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   SCROLL REVEAL (cards + split headings)
═══════════════════════════════════ */
const allRv = document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s');
const obs = new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('on'), i*110);
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

/* ═══════════════════════════════════
   NAV HIDE/SHOW + ACTIVE LINK ON SCROLL
═══════════════════════════════════ */
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
  sections.forEach(sec=>{
    if(sec && sec.offsetTop <= probeY) current = sec;
  });
  navLinkEls.forEach(a=>{
    a.classList.toggle('active', current && a.getAttribute('href') === '#'+current.id);
  });

  const toTop = document.getElementById('toTop');
  toTop.classList.toggle('show', y > window.innerHeight * 0.8);
}, {passive:true});

document.getElementById('toTop').addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior: reduced ? 'auto' : 'smooth'});
});

/* ═══════════════════════════════════
   PROJECT FILTERS
═══════════════════════════════════ */
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

/* ═══════════════════════════════════
   CONTACT FORM — EmailJS
   Replace the placeholders below with
   your own EmailJS service/template/
   public key (emailjs.com) to make this
   form actually send messages.
═══════════════════════════════════ */
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
