# Audit de l’interface — 10 octobre 2026

Périmètre : `index.html`, `life.css`, `src/main.js`, instructions `AGENTS.md`. Lecture du code actuel, aucune modification UI. L’interface a été rejetée par l’utilisateur ; ce document examine des causes vérifiables dans sa structure, sans prétendre avoir vu son rendu actuel.

## Diagnostic

L’interface présente un paysage 3D entouré de panneaux et boutons fixes. Elle permet de déclencher des transactions mais ne rend pas leur gestion lisible. Le joueur doit lire une carte d’objectif, puis découvrir des commandes dans une modale ; sa progression ne possède aucun écran de bilan. La richesse du décor ne résout pas ce problème de prise de décision.

| Problème concret | Preuve dans le code | Correction utile |
|---|---|---|
| Début sans représentation de son personnage | Le dialogue start propose prénom et deux listes sans aperçu | Aperçu d’avatar vivant à côté des choix ; prénom facultatif ; CTA unique clair et reprise prioritaire si sauvegarde |
| Hiérarchie HUD faible | Identité, porte-monnaie, objectif complet, quatre boutons nav, contexte, astuces et note monde restent superposés | Statut compact en haut, objectif rétractable, un outil de gestion, une interaction principale près du pouce |
| Orientation difficile | Marqueur 3D au sol sans distance, direction hors champ ou plan local | Mini-plan du quartier construit à partir des coordonnées existantes et objectif « Marché · 18 m » ; indication directionnelle |
| Gestion opaque | Prix, revenus et stock sont répartis entre HUD et modale kiosque | Fiche commerce : achat unitaire, vente unitaire, marge, stock, ventes, recettes et dépenses ; aucune prévision inventée |
| Boutons gris incompréhensibles | choice() applique disabled sans justification | Une raison visible : « Sac plein », « Il manque 1 200 F », « Déjà ouvert » ; montant manquant calculé |
| Besoins sémantiquement ambigus | meter food augmente après un repas, mais label « Faim » | « Satiété » ou inverser une jauge « Faim » ; valeurs/status textuels en plus de la couleur |
| Dialogue social peu social | Action PNJ fournit conseil identique, travail décrit dans texte générique | Nom + métier + phrase courte contextualisée ; option unique honnête « Demander conseil » tant que seul ce comportement existe |
| Carte sans gameplay | Bouton Destinations ouvre un répertoire national non jouable | Carte de quartier opérationnelle ; répertoire national placé dans une rubrique secondaire « Découvrir le Togo » |
| Objectif persistant peu précis | Textes décrivent secteur nord/sud sans distance ; objectif revient au marché même après premières réussites | Étapes explicites avec progrès et choix suivant : réapprovisionner/aménager ; lien de ciblage volontaire |
| Feed de résultats absent | events est un tableau domaine ; aucun journal consultable | Journal local chronologique des actions et ventes, limité et regroupé pour éviter spam |
| Paramètre trompeur | « Ombres & détails » / « Économie mobile » ; qualité change ombres et pixel ratio seulement | « Ombres activées » et résolution clairement indiquée ; ne pas promettre réduction de détails non implémentée |

## Rapport aux références demandées

« Townsmen gestion » sert ici d’intention utilisateur : rendre les chaînes, ressources et conséquences compréhensibles. Aucune version de Townsmen n’a été inspectée dans cette mission, donc aucune prétention à reproduire son interface ou ses mécaniques exactes. Application originale : une fiche de commerce avec coûts/marges/stock, un journal, des objectifs tangibles et un plan local. Éviter d’ajouter un bouton construction qui ne pourrait rien construire.

La recherche conservée dans `LAGOS_LIFE_RESEARCH.md` établit des lieux nommés, pages publiques de boutiques avec prix et informations d’entreprise. Elle ne valide pas une session multijoueur, ni la HUD 3D ou le contrôle tactile. L’enseignement justifié est de rendre les lieux et habitants identifiables et les entreprises racontables. Ne pas présenter un chat, des amis en ligne, un fil communautaire ou une invitation multijoueur comme disponibles ici : le jeu est solo local.

## Organisation cible concrète

1. **Quartier** : monde visible, statut compact (argent, heure), objectif repliable avec destination/distance, commande contextuelle nommée (« Acheter au marché », « Parler à Ama »). Le nom de l’action importe davantage que « Interagir » partout.
2. **Ma vie** : panneau ouvrable de bilan, sac, commerce, logement et journal ; afficher uniquement systèmes présents. Sur desktop, panneau latéral ; sur mobile, feuille à hauteur limitée ou dialogue scrollable avec retour toujours accessible.
3. **Lieux** : petit plan du quartier, sélectionner une destination cible ; l’encyclopédie des régions n’est pas une carte de déplacement.

Première minute : personnaliser avec aperçu → voir le quartier → comprendre une cible proche → premier choix de contrat ou commerce avec coût clair → rejoindre le lieu → résultat visible → prochaine décision. Réussite, bénéfice et progression doivent précéder le bouton Partager dans la hiérarchie.

## Commandes recommandées

| Usage | PC | Mobile |
|---|---|---|
| Déplacer | WASD/ZQSD et flèches conservés | Joystick gauche ; annulation explicite au relâchement et à pointercancel |
| Courir | Maj maintenue | Bouton maintien ou bascule clairement marquée, test multitouch simultané |
| Caméra | Glisser bouton principal, remettre derrière avatar avec touche dédiée | Glisser zone libre droite ; bouton recentrer accessible ; ne pas exiger un mouvement sous les panneaux |
| Action | E contextuel, libellé précis | Bouton principal ≥48 px et cible identifiée, sans raccourci clavier affiché |
| Gestion | B / bouton « Ma vie » | Bouton secondaire unique ; groupe séparé de Courir/Action |
| Carte | M / bouton | Mini-plan ou bouton Lieux, ouvrir une destination sans promettre transport |
| Pause/retour | Échap cohérent et focus restauré | Bouton menu ; retour depuis feuilles sans zone piégée |

Les nouveaux raccourcis sont des recommandations à implémenter, pas des commandes existantes. Rendre touches remappables peut attendre, mais documenter les commandes réellement livrées est immédiat. Pour paysage mobile à faible hauteur, replier objectif et nav ; le CSS courant ne possède pas de règle spécifique à cette situation. Les insets safe-area ne couvrent que certaines commandes : vérifier contexte et barre outils sur appareil à encoche.

## Faisabilité navigateur dans cet environnement

Chromium `/usr/bin/chromium` et Python Playwright sont installés. Deux essais réels headless minimaux avec les flags ordinaires de cette infrastructure ont échoué avant création de page : `FATAL:content/browser/sandbox_host_linux.cc:41 ... shutdown: Operation not permitted (1)`. Ces essais n’ont demandé aucune permission et n’ont pas modifié le rapport navigateur existant. Le précédent `artifacts/browser-results.json` documente le même blocage.

Aucun outil navigateur distant adapté n’est exposé dans les outils disponibles examinés. La validation visuelle n’est donc pas réalisable actuellement par cette voie. Installer davantage de paquets UI ne résoudrait pas cette interdiction système ; ne pas produire des captures reconstruites ou prétendre validation Android. `tests/browser.py` reste une base à exécuter sur un environnement compatible.

À vérifier dès accès navigateur : 390×844 portrait, 844×390 paysage, 1440×900 PC ; zones masquées, dialogues longs, clavier virtuel prénom, perte capture, déplacement + caméra + course simultanés, focus clavier, retour dialogues, no overflow, stabilité sauvegarde et passage fallback. Un profil mobile émulé mesure une ergonomie de viewport, pas les FPS d’un vrai Android de gamme moyenne.
