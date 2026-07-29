/* ─── CAT CURSOR (desktop only) ─── */
const isTouch = window.matchMedia('(max-width:768px)').matches || ('ontouchstart' in window);
const cur = document.getElementById('cur');
let mx=0, my=0;
let pawTimer=0;

if(!isTouch){
  document.addEventListener('mousemove', e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.left = mx+'px';
    cur.style.top  = my+'px';
    clearTimeout(pawTimer);
    
    pawTimer = setTimeout(()=>{ spawnPaw(mx, my); }, 120);
  });

  function spawnPaw(x, y){
    const dot = document.createElement('div');
    dot.className='paw-dot';
    dot.style.left = (x + (Math.random()*10-5)) + 'px';
    dot.style.top  = (y + (Math.random()*10-5)) + 'px';
    document.body.appendChild(dot);
    setTimeout(()=>dot.remove(), 800);
  }

  document.querySelectorAll('a,button').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cur.classList.add('hovering'); });
    el.addEventListener('mouseleave',()=>{ cur.classList.remove('hovering'); });
  });
} else {
  cur.style.display='none';
}

/* ─── INTRO SEQUENCE ─── */
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
  setTimeout(()=>{
    fullNm.classList.add('show');
  }, 200);
}, 1600);

setTimeout(()=>{
  intro.classList.add('exit');
  setTimeout(()=>{
    intro.classList.add('gone');
    document.body.classList.remove('locked');
    nav.classList.add('show');
  }, 1150);
}, 3500);

/* ─── MOBILE NAV ─── */
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

/* ─── SCROLL REVEAL ─── */
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

/* ─── NAV HIDE / SHOW ON SCROLL ─── */
let lastY=0;
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(y<80){ nav.style.transform='translateY(0)'; }
  else if(y>lastY+6){ nav.style.transform='translateY(-110%)'; closeMobileNav(); }
  else if(y<lastY-6){ nav.style.transform='translateY(0)'; }
  lastY=y;
});
