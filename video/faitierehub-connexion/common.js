/* Socle commun aux deux vidéos : identité, couche ambiante, système de mouvement, minutage */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

/* Emblème FaîtiereHub redessiné en vectoriel d'après public/logo.png (anneau, rameau, trois membres, champs) */
const EMBLEM = `<defs>
 <linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd14f"/><stop offset="1" stop-color="#3f9d2f"/></linearGradient>
 <linearGradient id="fd1" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2f8f35"/><stop offset="1" stop-color="#6cc04a"/></linearGradient>
 <linearGradient id="fd2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#14612c"/><stop offset="1" stop-color="#2e9a3e"/></linearGradient></defs>
 <circle cx="50" cy="50" r="49" fill="#fff"/>
 <path d="M30 13 A40 40 0 1 1 22 82" fill="none" stroke="#0e4d2a" stroke-width="4.6" stroke-linecap="round"/>
 <path d="M30 86 C 18 74 14 56 22 34" fill="none" stroke="#2f7d32" stroke-width="2.6" stroke-linecap="round"/>
 <g fill="url(#lf)">
  <path d="M22 36 C 14 33 12 26 14 20 C 21 22 24 29 22 36Z"/><path d="M23 37 C 28 30 34 29 38 31 C 35 37 29 39 23 37Z"/>
  <path d="M18 50 C 10 47 8 40 10 34 C 17 36 20 43 18 50Z"/><path d="M20 50 C 25 43 31 42 35 44 C 32 50 26 52 20 50Z"/>
  <path d="M19 64 C 11 62 9 55 10 49 C 17 51 21 57 19 64Z"/><path d="M21 63 C 26 57 32 56 36 58 C 33 64 27 65 21 63Z"/></g>
 <circle cx="56" cy="36" r="8.2" fill="#0e4d2a"/><path d="M43 58 C 43 47 49 44 56 44 C 63 44 69 47 69 58Z" fill="#0e4d2a"/>
 <circle cx="42" cy="42" r="5.6" fill="#6cc04a"/><circle cx="70" cy="42" r="5.6" fill="#6cc04a"/>
 <path d="M33 60 C 33 52 37 49 42 49 C 46 49 49 51 50 55Z" fill="#4caf3a"/><path d="M79 60 C 79 52 75 49 70 49 C 66 49 63 51 62 55Z" fill="#4caf3a"/>
 <path d="M31 66 C 48 56 68 55 89 58 C 87 63 85 66 83 68 C 66 64 49 66 34 74Z" fill="url(#fd1)"/>
 <path d="M36 78 C 52 69 70 67 86 70 C 83 76 80 79 77 82 C 64 78 52 80 42 85Z" fill="url(#fd2)"/>
 <path d="M47 89 C 58 84 68 83 76 85 C 70 90 62 93 54 94Z" fill="#14612c"/>`;
function logo(el){ el.setAttribute('viewBox','0 0 100 100'); el.innerHTML = EMBLEM; }
const WORDMARK = (dark='') => `<span class="wm ${dark}"><b>Faîtiere</b><span>Hub</span></span>`;

/* main qui tape (doigt stylisé) */
const FINGER = `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M38 8 C 44 8 47 12 47 18 L 47 46 L 50 46 C 50 40 60 39 61 46 L 63 46 C 64 40 73 40 74 47 L 75 48 C 77 43 86 44 86 51 L 86 70 C 86 84 76 94 62 94 L 52 94 C 42 94 36 88 30 80 L 16 60 C 13 55 19 49 25 53 L 30 58 L 30 18 C 30 12 33 8 38 8 Z" fill="#7b4a2b" stroke="#3b2414" stroke-width="2.5"/><path d="M33 16 C 35 12 41 12 43 16" stroke="#c99a76" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

/* feuilles ambiantes (procédurales => rendu déterministe image par image) */
const LEAF = '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M4 36 C 4 16 16 4 36 4 C 36 24 24 36 4 36 Z" fill="#6cc04a"/><path d="M6 34 L30 10" stroke="#2f7d32" stroke-width="2"/></svg>';
const leaves = [];
function makeLeaves(){
  for (let i = 0; i < 11; i++) {
    const d = document.createElement('div'); d.className = 'leaf'; d.innerHTML = LEAF; $('#leaves').appendChild(d);
    leaves.push({el:d, x:(i*389)%1080, y:(i*577)%1920, s:.5+((i*7)%5)/6, sp:22+((i*13)%7)*6, ph:i*1.7, rot:(i*47)%360});
  }
}
let GREEN_AT = 0;  // instant où l'ambiance passe au vert
function ambient(t){
  const green = gsap.utils.clamp(0, 1, (t - GREEN_AT) / 1.2);
  leaves.forEach(L => {
    const y = ((L.y - t*L.sp) % 2100 + 2100) % 2100 - 90, x = L.x + Math.sin(t*.6+L.ph)*40;
    L.el.style.transform = `translate(${x}px,${y}px) rotate(${L.rot + Math.sin(t*.8+L.ph)*35}deg) scale(${L.s})`;
    L.el.style.opacity = (.5*green).toFixed(3);
  });
  $('#glow').style.transform = `translate(${Math.sin(t*.35)*60}px,${Math.cos(t*.27)*80}px) scale(${1+Math.sin(t*.5)*.08})`;
  $('#grain').style.transform = `translate(${(t*137)%7}px,${(t*91)%5}px)`;
  $$('.char[data-idle]').forEach((c, i) => {   // respiration des personnages (couche secondaire)
    c.style.setProperty('--br', (1 + Math.sin(t*2.2 + i)*.008).toFixed(4));
    c.firstElementChild.style.transform = `scaleY(var(--br))`;
    c.firstElementChild.style.transformOrigin = '50% 100%';
  });
}

/* système de mouvement : une courbe signature, trois durées */
const EIN = 'expo.out', EOUT = 'power2.in', POP = 'back.out(1.6)', D = {q:.35, s:.6, l:1.0};
const tl = gsap.timeline({paused:true});
const enter = (t, at, o={}) => tl.from(t, {y:o.y??60, x:o.x??0, opacity:0, scale:o.scale??.97, duration:o.d??D.s, ease:o.ease??EIN, stagger:o.st??0}, at);
const pop = (t, at, o={}) => tl.from(t, {scale:0, opacity:0, duration:o.d??.5, ease:POP, stagger:o.st??0, transformOrigin:o.origin??'50% 50%'}, at);
const fmt = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
function count(el, at, dur, to, suf=''){ const o = {v:0}; tl.to(o, {v:to, duration:dur, ease:'power2.out', onUpdate(){ el.textContent = fmt(o.v) + suf; }}, at); }
function typeText(el, text, at, cps=16){                 // frappe caractère par caractère
  const o = {n:0}; tl.to(o, {n:text.length, duration:text.length/cps, ease:'none', onUpdate(){ el.textContent = text.slice(0, Math.round(o.n)); }}, at);
  return at + text.length/cps;
}
function tap(fx, x, y, at){ tl.set(fx, {left:x, top:y}, at); tl.fromTo(fx, {scale:.3, opacity:.9}, {scale:1.6, opacity:0, duration:.5, ease:'power2.out'}, at); }
function charIn(sel, at, from='left'){ tl.from(sel, {x: from==='left' ? -420 : 420, opacity:0, duration:.9, ease:EIN}, at); }
function charOut(sel, at, to='left'){ tl.to(sel, {x: to==='left' ? -460 : 460, opacity:0, duration:.45, ease:EOUT}, at); }
function sceneBox(id, s, last){ tl.set(id, {visibility:'visible'}, s.start); if (!last) { tl.to(id, {opacity:0, duration:.35, ease:EOUT}, s.start + s.dur - .35); tl.set(id, {visibility:'hidden'}, s.start + s.dur); } }

async function boot(video, build){
  const timing = (await (await fetch('timing.json')).json())[video];
  const S = {}; timing.scenes.forEach(s => S[s.id] = s);
  $$('svg.logo').forEach(logo); makeLeaves();
  build(S, timing);
  tl.to({}, {duration:.01}, timing.total - .01);
  window.DURATION = timing.total;
  window.__seek = t => { tl.time(t, false); ambient(t); };
  await document.fonts.ready;
  await Promise.all($$('img').map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  window.__seek(+(new URLSearchParams(location.search).get('t') || 0));
  window.__ready = true;
}
/* texte changé à un instant donné (rendu image par image en avant : un appel suffit) */
function setText(sel, text, at){ tl.call(() => { $(sel).textContent = text; }, null, at); }
