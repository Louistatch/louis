// Storyboard PowerPoint des deux vidéos : node storyboard.js  (images : out/frames/<v>_<s>.jpg)
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const { applyTheme } = require(process.env.PPTX_SKILL + '/scripts/apply_theme.js');

const THEME = { name: 'FaitiereHub', headFontFace: 'Arial', bodyFontFace: 'Calibri',
  colors: { dk1: '10251A', lt1: 'FFFFFF', dk2: '0B3219', lt2: 'F3F6F1', accent1: '178A3A', accent2: 'F2B631',
            accent3: '7FD14B', accent4: '0F5C27', accent5: 'F08A3A', accent6: '6B7F72', hlink: '178A3A', folHlink: '0F5C27' } };
const timing = JSON.parse(fs.readFileSync('timing.json'));
const lines = JSON.parse(fs.readFileSync('vo_lines.json'));
const board = JSON.parse(fs.readFileSync('storyboard.json'));

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = 'FaîtiereHub — Storyboard vidéos de connexion';
const C = pres.SchemeColor;

pres.defineSlideMaster({ title: 'TITRE', background: { color: C.text2 },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: .6, y: 1.55, w: 8.8, h: 1.2, fontSize: 40, bold: true, color: C.background1, valign: 'bottom' }, text: '' } },
            { placeholder: { options: { name: 'body', type: 'body', x: .6, y: 2.85, w: 8.8, h: .9, fontSize: 18, color: C.accent3, valign: 'top' }, text: '' } }] });
pres.defineSlideMaster({ title: 'SCENE', background: { color: C.background1 },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: 3.75, y: .38, w: 5.75, h: .6, fontSize: 28, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } },
            { text: { text: 'FaîtiereHub · Storyboard', options: { x: 3.75, y: 5.2, w: 4, h: .3, fontSize: 10, color: C.accent6, margin: 0 } } }],
  slideNumber: { x: 9.0, y: 5.2, w: .5, h: .3, fontSize: 10, color: C.accent6 } });
pres.defineSlideMaster({ title: 'CONTENU', background: { color: C.background1 },
  objects: [{ placeholder: { options: { name: 'title', type: 'title', x: .6, y: .38, w: 8.8, h: .7, fontSize: 30, bold: true, color: C.text2, valign: 'middle', margin: 0 }, text: '' } }],
  slideNumber: { x: 9.0, y: 5.2, w: .5, h: .3, fontSize: 10, color: C.accent6 } });

const fmtT = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// Couverture
pres.addSection({ title: 'Ouverture' });
let s = pres.addSlide({ masterName: 'TITRE', sectionTitle: 'Ouverture' });
s.addText('Se connecter à FaîtiereHub', { placeholder: 'title' });
s.addText('Storyboard de deux vidéos motion design · WhatsApp Statut et TikTok · 9:16', { placeholder: 'body' });

// Vue d'ensemble : deux cartes chiffrées
s = pres.addSlide({ masterName: 'CONTENU', sectionTitle: 'Ouverture' });
s.addText('Deux vidéos, deux publics', { placeholder: 'title' });
[['v1', 'Gestionnaires', 'Email + mot de passe, redirection vers le bon espace, mot de passe oublié', 'Kossi'],
 ['v2', 'Membres producteurs', 'Carte + PIN à 6 chiffres, code SMS de secours, sans compte', 'Afi']].forEach(([v, who, what, hero], i) => {
  const x = .6 + i * 4.5;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.35, w: 4.2, h: 3.55, rectRadius: .12, fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `carte-${v}` });
  s.addText(`${Math.round(timing[v].total)} s`, { x: x + .3, y: 1.55, w: 3.6, h: .95, fontSize: 54, bold: true, color: C.accent1, fontFace: 'Arial', margin: 0, isTextBox: true });
  s.addText(`${timing[v].scenes.length} scènes · ${who}`, { x: x + .3, y: 2.5, w: 3.6, h: .4, fontSize: 16, bold: true, color: C.text2, margin: 0, isTextBox: true });
  s.addText(what, { x: x + .3, y: 2.95, w: 3.6, h: .9, fontSize: 14, color: C.text1, margin: 0, valign: 'top', isTextBox: true });
  s.addText(`Personnage : ${hero}`, { x: x + .3, y: 4.25, w: 3.6, h: .4, fontSize: 13, italic: true, color: C.accent6, margin: 0, isTextBox: true });
});

for (const v of ['v1', 'v2']) {
  const sec = v === 'v1' ? 'Vidéo 1 — Gestionnaires' : 'Vidéo 2 — Membres';
  pres.addSection({ title: sec });
  s = pres.addSlide({ masterName: 'TITRE', sectionTitle: sec });
  s.addText(board[v].title, { placeholder: 'title' });
  s.addText(`${Math.round(timing[v].total)} secondes · ${timing[v].scenes.length} scènes · voix de synthèse française`, { placeholder: 'body' });
  timing[v].scenes.forEach((sc, i) => {
    const [titre, ecran, son] = board[v].scenes[sc.id];
    const vo = lines[v].find(l => l[0] === sc.id)[1];
    const sl = pres.addSlide({ masterName: 'SCENE', sectionTitle: sec });
    sl.addText(`${i + 1}. ${titre}`, { placeholder: 'title' });
    const img = `out/frames/${v}_${sc.id}.jpg`;
    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: .55, y: .3, w: 2.85, h: 5.0, rectRadius: .1, fill: { color: C.text2 }, line: { color: C.text2 },
      shadow: { type: 'outer', color: '000000', opacity: .25, blur: 8, offset: 3, angle: 90 }, objectName: 'cadre' });
    if (fs.existsSync(img)) sl.addImage({ path: img, x: .64, y: .39, w: 2.67, h: 4.82, altText: `Image clé de la scène ${i + 1} : ${titre}`, objectName: 'image-cle' });
    sl.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.75, y: 1.08, w: 1.9, h: .36, rectRadius: .18, fill: { color: C.accent2 }, line: { color: C.accent2 }, objectName: 'minutage' });
    sl.addText(`${fmtT(sc.start)} → ${fmtT(sc.start + sc.dur)}`, { x: 3.75, y: 1.08, w: 1.9, h: .36, fontSize: 13, bold: true, color: C.text2, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    const block = (label, text, y, h, opts = {}) => {
      sl.addText(label.toUpperCase(), { x: 3.75, y, w: 5.75, h: .28, fontSize: 11, bold: true, color: C.accent1, charSpacing: 2, margin: 0, isTextBox: true });
      sl.addText(text, { x: 3.75, y: y + .3, w: 5.75, h, fontSize: 15, color: C.text1, margin: 0, valign: 'top', isTextBox: true, ...opts });
    };
    block('Voix off', `« ${vo} »`, 1.7, .85, { italic: true });
    block('À l’écran et mouvement', ecran, 2.95, 1.2);
    block('Son', son, 4.45, .4);
    sl.addNotes(`Voix off : ${vo}`);
  });
}

// Production
pres.addSection({ title: 'Production' });
s = pres.addSlide({ masterName: 'CONTENU', sectionTitle: 'Production' });
s.addText('Fabrication et diffusion', { placeholder: 'title' });
[['Format', '1080×1920 (TikTok) et 720×1280 (Statut WhatsApp), 30 i/s, sous 60 s'],
 ['Voix', 'Synthèse neuronale française (Piper, voix « siwis »), générée en local'],
 ['Musique', 'Composition originale générée par code, sans droits tiers'],
 ['Métadonnées', 'Aucune : ni appareil, ni encodeur, ni historique d’édition'],
 ['Interface', 'Redessinée d’après le code du site (textes et étapes réels)']].forEach(([k, val], i) => {
  const y = 1.3 + i * .76;
  s.addShape(pres.shapes.OVAL, { x: .6, y: y + .05, w: .42, h: .42, fill: { color: C.accent1 }, line: { color: C.accent1 }, objectName: `puce-${i}` });
  s.addText(String(i + 1), { x: .6, y: y + .05, w: .42, h: .42, fontSize: 14, bold: true, color: C.background1, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addText([{ text: k + ' — ', options: { bold: true, color: C.text2 } }, { text: val, options: { color: C.text1 } }], { x: 1.2, y, w: 8.2, h: .52, fontSize: 15, valign: 'middle', margin: 0, isTextBox: true });
});

(async () => {
  await pres.writeFile({ fileName: 'out/FaitiereHub_Storyboard_Connexion.pptx' });
  await applyTheme('out/FaitiereHub_Storyboard_Connexion.pptx', THEME);
  console.log('ok');
})();
