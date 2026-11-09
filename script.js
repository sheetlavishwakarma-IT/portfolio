// scroll progress bar
const bar = document.getElementById('progress');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
});

// active nav link
const links = document.querySelectorAll('.nav nav a');
const watch = ['home', 'about', 'services', 'projects', 'experience', 'contact'];
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { threshold: 0.4 });
watch.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });

// falling leaves (only while the work section is on screen)
const work = document.getElementById('services');
let leavesOn = false;
new IntersectionObserver(([e]) => { leavesOn = e.isIntersecting; }, { threshold: 0.1 }).observe(work);
setInterval(() => {
  if (!leavesOn) return;
  const l = document.createElement('div');
  l.className = 'leaf';
  l.style.left = Math.random() * 100 + 'vw';
  l.style.animationDuration = 5 + Math.random() * 5 + 's';
  l.style.opacity = 0.5 + Math.random() * 0.5;
  document.body.appendChild(l);
  setTimeout(() => l.remove(), 10000);
}, 600);

// ===== ANIMATIONS =====
document.documentElement.classList.add('js');

// scroll reveal with stagger for repeated items
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.big, .glass, .about-photo, .statement h2, .statement p, .rows li, .proj, .item, .bigname, .links a').forEach((el, i) => {
  el.classList.add('rv');
  if (el.matches('.rows li, .item, .links a')) {
    const sibs = [...el.parentNode.children];
    el.style.animationDelay = sibs.indexOf(el) * 0.08 + 's';
  }
  reveal.observe(el);
});

// hero text parallax on scroll
const heroTitle = document.querySelector('.hero h1');
addEventListener('scroll', () => {
  if (scrollY < innerHeight) heroTitle.style.transform = `translateY(${scrollY * 0.25}px)`;
});

// mouse: cursor glow + floating cards/orbs drift
const glow = document.createElement('div');
glow.className = 'glow';
document.body.appendChild(glow);
const drifters = document.querySelectorAll('.float-card, .orb');
addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
  drifters.forEach((el, i) => {
    const d = (i % 3 + 1) * 14;
    el.style.translate = `${-x * d}px ${-y * d}px`;
  });
});

// ===== PHOTO CHECK: hide "Photo 1" label only when the image really loads =====
document.querySelectorAll('.cutout, .shot').forEach(el => {
  const m = el.getAttribute('style') && el.getAttribute('style').match(/url\(['"]?([^'")]+)['"]?\)/);
  if (!m) return;
  const img = new Image();
  img.onload = () => el.classList.add('has-img');
  img.src = m[1];
});

// ===== ENTER GATE + MUSIC =====
const SONG_START = 0;     // seconds: song ka jo hissa pehle chalana hai (beat drop), e.g. 20
const MAX_VOLUME = 0.7;   // 0 se 1 ke beech
const gate = document.getElementById('gate');
const bgm = document.getElementById('bgm');
const muteBtn = document.getElementById('mute');

document.getElementById('enterBtn').addEventListener('click', () => {
  gate.classList.add('out');
  document.body.classList.remove('locked');
  setTimeout(() => gate.remove(), 900);

  bgm.volume = 0;
  bgm.currentTime = SONG_START;
  bgm.play().catch(() => {});          // agar audio/song.mp3 nahi mila to site phir bhi chalegi
  let v = 0;
  const fade = setInterval(() => {
    v = Math.min(v + 0.05, MAX_VOLUME);
    bgm.volume = v;
    if (v >= MAX_VOLUME) clearInterval(fade);
  }, 150);
});

muteBtn.addEventListener('click', () => {
  bgm.muted = !bgm.muted;
  muteBtn.textContent = bgm.muted ? '🔇' : '🔊';
});
