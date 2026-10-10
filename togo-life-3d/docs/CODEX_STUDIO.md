# Codex Game Studio — TOGO LIFE, dans `Louistatch/louis`

**Périmètre :** `togo-life-3d/`, sans toucher à la plateforme BAD/Bryq du dépôt racine. Le jeu existant fonctionne sur **Three.js et JavaScript (ES modules)**, rendu navigateur/GitHub Pages. Une réécriture Godot n'est pas nécessaire pour installer Codex.

## Ce qui est effectivement intégré au dépôt
- `AGENTS.md` : contrat de collaboration et d'acceptation pour Codex.
- `.agents/skills/togo-life-studio/SKILL.md` : direction et orchestration du jeu.
- `.agents/skills/togo-life-economy/SKILL.md` : économie virtuelle de stratégie.
- `.agents/skills/togo-life-npc-ai/SKILL.md` : habitants autonomes, mémoire et routines.
- `.agents/skills/togo-life-world-map/SKILL.md` : extension progressive au Togo, données sourcées.
- `.agents/skills/togo-life-quality/SKILL.md` : tests de comportement et de rendu réels.
- `scripts/sync-codex-skills.mjs` : copie **locale, sans écrasement** des skills Three.js déjà approuvés dans `.claude/skills/`.

Ce sont des **instructions Codex**, pas des modules de gameplay nouvellement intégrés. Les anciens skills restent dans `.claude/skills/`. L'installation de packs extérieurs via npx n'est **pas** réalisée par un commit Git.

## Installation depuis Codex local / terminal
```bash
git clone https://github.com/Louistatch/louis.git
cd louis/togo-life-3d

# Prévisualiser la copie des skills Three.js déjà présents
node scripts/sync-codex-skills.mjs --dry-run
# Copier dans .agents/skills sans supprimer ni remplacer aucun dossier
node scripts/sync-codex-skills.mjs

# Optionnel : découvrir les skills communautaires avant d'en ajouter
npx skills add gamedev-skills/awesome-gamedev-agent-skills --list
# Optionnel et après examen des licences/scripts ; choisir les skills utiles, pas un remplacement du jeu :
npx skills add gamedev-skills/awesome-gamedev-agent-skills -a codex
```

Lancer `codex` **depuis `louis/togo-life-3d`**. Vérifier `/skills` ou solliciter `$togo-life-studio`. Les commandes `npx` exigent Node/npm, réseau et autorisation explicite de l'exécution. Ne pas installer globalement sans besoin.

## Premier prompt Codex
> Utilise $togo-life-studio, $togo-life-economy, $togo-life-npc-ai, $togo-life-world-map et $togo-life-quality. Analyse le jeu Three.js existant dans togo-life-3d sans réécriture Godot. Étudie l'état du travail d'interface dans togo-life-3d-preview/ et les PR ouvertes avant toute fusion. Développe une tranche jouable à Lomé : un personnage achète réellement au marché, transporte, tient son commerce, négocie avec un PNJ autonome et observe les conséquences sur prix, revenus et réputation. Préserve BAD/Bryq et les sauvegardes ; ajoute les tests, exécute le build et, si possible, les tests navigateur avec captures réelles. Fournis un rapport précis PASS / FAIL / BLOCKED. Ensuite seulement, prépare l'extension géographique nationale par chunks OSM sourcés.

## Vérifications
```bash
npm test
npm run build
python3 -m http.server 8000
# Autre terminal si Chromium/Playwright disponible :
python3 tests/browser.py --url http://127.0.0.1:8000/dist/
```

## Limites connues
Lomé est un quartier 3D stylisé ; les 5 régions/40 entrées ne sont pas des villes 3D distinctes. Les huit PNJ d'origine ont des horaires et trajets simples, pas encore un modèle de société complet. Les PR du jeu et de sa prévisualisation peuvent diverger : vérifier les branches avant de copier du code. L'installation de skills ne prouve ni un nouveau gameplay ni la compatibilité Android.
