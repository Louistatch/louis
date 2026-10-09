# TOGO LIFE 3D — simulateur de vie togolais (MVP)

Jeu de simulation solo en 3D, jouable sur navigateur. Personnage jouable, animation de marche, caméra suiveuse, villes générées, circulation automobile, PNJ animés, métiers, marchés, finance et microentreprise, besoins vitaux et trajets nationaux.

**Le jeu n'utilise aucun fichier distant ni aucune librairie propriétaire.** Le rendu principal est construit en WebGL, standard ouvert ; une projection 3D via Canvas 2D est disponible si WebGL n'est pas disponible. Les modèles 3D sont créés de façon procédurale. Le code du jeu est sous licence MIT. Le projet peut ensuite migrer vers Three.js (MIT) ou Godot (MIT) si le besoin de simulation s'étend.

## Jouer sur GitHub Pages

Lancer le jeu depuis **https://louistatch.github.io/louis/togo-life-3d/**, sans modifier la plateforme BAD/Bryq située à la racine du dépôt `louis`.

## Jouer immédiatement

- Ouvrir **TOGO_LIFE_3D.html** (fichier autonome livré à la racine du ZIP) dans Chrome ou Firefox avec WebGL activé. Internet et serveur ne sont pas nécessaires.
- Sinon, depuis le dossier des sources : `python -m http.server 8000`, puis ouvrir `http://localhost:8000`.
- Ordinateur : **ZQSD/WASD/flèches** pour marcher, **E** pour interagir, **Shift** pour courir, **glisser la souris** pour faire tourner la caméra.
- Mobile : **joystick tactile**, **ACTION**, **COURIR**, bouton **Explorer le Togo**.
- **Finir la journée** accélère le temps. Partie de 14 jours, avec un loyer exigible à chaque septième jour du jeu.
- Le navigateur peut garder la progression localement via `localStorage`. Aucune donnée n'est transmise à un serveur.

## Géographie

5 régions (Maritime, Plateaux, Centrale, Kara, Savanes) et 40 préfectures sélectionnables.

- Contours simplifiés des régions : [geoBoundaries](https://github.com/wmgeolab/geoBoundaries), représentation dérivée de [robit-man/tiny-atlas](https://github.com/robit-man/tiny-atlas/blob/master/elevation_model/geojson/ADM1/TGO.geojson), attribution ODbL 1.0 selon métadonnées de l'ADM1.
- Préfectures et centres géographiques : [open-admin-data/togo-administrative-divisions](https://github.com/open-admin-data/togo-administrative-divisions), **CC BY 4.0** ; noms localisés pour l'affichage, données du dépôt public.
- **Important :** les quartiers 3D sont **fictifs et stylisés**. Ce ne sont pas des restitutions cartographiques 3D authentiques de chaque préfecture. Les distances sont à vol d'oiseau et les frais de voyage sont fictifs. La cartographie de terrain et le réseau routier nécessiteront OpenStreetMap, avec vérification de sa licence ODbL, pour les versions ultérieures.

## Gameplay

- Niveaux : 25 000 F fictifs au départ, formation, contrats numériques, vente au marché, microcrédit avec dette, boutique ouverte pour 28 000 F fictifs.
- Besoins : énergie, alimentation, moral ; revenus et coût de la vie fictifs modulés par région.
- Simulation : cycles de jours, événements, revenus passifs du commerce, dépenses/loyer, score de fin de saison.
- Interactions : proximité spatiale de bâtiments et PNJ. Animations procédurales de marche, voitures et caméra amortie.

## Structure

- `index.html` : interface et modales.
- `style.css` : design responsive / HUD mobile.
- `game.js` : moteur WebGL et secours Canvas, scènes, personnages, carte, contrôles, économie.
- `.claude/skills/togo-life-3d/SKILL.md` : skill de développement Claude spécialisé pour continuer ce projet.
- `AGENTS.md` : rôles et standards de l'équipe IA.
- `docs/OPEN_SOURCE.md` : composants, sources et licences.
- `TOGO_LIFE_3D.html` : distribution monofichier.

## Skills GitHub étudiés et appliqués

- [alton47/threejs-skills](https://github.com/alton47/threejs-skills) — `threejs-core`, `threejs-animation`, `threejs-camera`, `threejs-performance` (licence MIT). Ils guident la structure des scènes, les animations procédurales, les réglages de caméra et la stratégie de performance. **Le MVP implémente son propre moteur WebGL**, il ne charge pas encore la librairie Three.js ; il ne faut pas présenter ces skills comme des packages installés à l'exécution.
- [anthropics/skills/frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) — principes d'interface distinctive.
- [anthropics/skills/webapp-testing](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) — procédure de QA avec Playwright.

Pour installer les skills 3D dans une configuration Claude/Codex compatible : `npx skills add https://github.com/alton47/threejs-skills`. Installation non réalisée dans le compte du joueur.

## Validation

Test sous Chromium automatisé : chargement, 40 préfectures, marche clavier, interaction marché, ouverture d'un kiosque, voyage Lomé → Kara, passage des 14 jours, rendu mobile et absence d'erreurs JavaScript. Le navigateur d'essai ne fournissait pas de contexte WebGL matériel ; le mode Canvas 2D de secours a été rendu et testé graphiquement. Tester la branche GPU WebGL directement sur les appareils cibles reste nécessaire avant tout lancement public.

## Ce qui reste avant un produit commercial

Multijoueur et comptes sécurisés, monde persistant hébergé, carte de rues réelles, avatars 3D animés par squelettes, moteurs physiques, trafic routier réaliste, comportement intelligent des habitants, son 3D, accessibilité, gestion du consentement et infrastructure scalable. Les gains dans le jeu n'ont aucune valeur monétaire.