# Revue indépendante de la refonte UI

10 octobre 2026. Lecture réelle de `index.html`, `life.css`, `main.js`, `avatar-preview.js`, `neighborhood-map.js`, `ui-model.js`. Aucun navigateur local relancé. Les constatations ci-dessous sont statiques ; la première exécution CI doit produire les captures.

## Améliorations constatées dans le code

Le jeu possède maintenant un aperçu 3D animé utilisant le même chargeur d’avatar que le monde, un mini-plan basé sur les positions réellement jouables, des cibles locales sans téléportation, une vue quartier, des onglets de besoins/objectifs/commerce, un bilan économique et des raisons d’indisponibilité des choix. Le bilan distingue marge unitaire et dépenses globales. Les onglets disposent d’attributs ARIA et d’une navigation par flèches/Home/End. Le prénom est inséré par textContent et exclu du texte de partage.

Ces éléments répondent directement au défaut antérieur de gestion opaque. Ils ne prouvent pas encore qualité visuelle ou ergonomie en mouvement.

## Corrections prioritaires à faire par le responsable UI

- **P1, mobile paysage** : joystick et bouton Courir sont rendus visibles uniquement par `@media(max-width:600px)`. À 844×390 tactile, la règle paysage ajuste leur position sans les afficher : joueur privé de commandes tactiles. Ajouter un critère pointer coarse et vérifier que joystick/dock ne se chevauchent pas.
- **P2, objectif choisi persistant** : sélectionner une destination définit selectedTarget, qui remplace le véritable objectif dans la HUD. L’effacement se fait par transaction ou bouton dans carte. Donner un accès clair à « Suivre mon objectif » sans navigation supplémentaire ; rejoindre le lieu ne suffit pas à restituer la mission.
- **P2, contexte** : `#interactBtn` reste toujours nommé « Interagir », alors que nearText donne seulement un nom de lieu. Un verbe précis (« Acheter », « Discuter », « Livrer ») réduit l’essai-erreur, avec action exacte à choisir ensuite dans la fiche.
- **P3, réglage qualité** : libellés « Ombres et détails » / « Économie mobile » encore plus larges que le changement réel ombres/résolution. Aucun niveau de géométrie ou chargement d’assets distinct n’est activé.
- **P3, accessibilité** : caméra n’a pas d’aria-label explicite mais possède texte ; adéquat. Les canvas des plans ont une description mais aucune alternative donnant la position/distance des lieux à un lecteur d’écran. La liste de lieux et distance objectif apportent une base partielle.
- **P3, carte** : lettres/labels du plan correspondent aux lieux du monde ; format schématique explicitement indiqué. Les labels peuvent se superposer dans une zone dense ; vérifier les pixels à la taille mobile plutôt que supposer leur lisibilité.

## Validation automatisée préparée

`tests/browser.py` est portable : `--browser` optionnel, `/usr/bin/chromium` seulement s’il existe, sinon Chromium Playwright embarqué ; `--output-dir` optionnel. Les fermetures avec deux boutons utilisent `.first`, le bilan commerce est lu après clic onglet Commerce, les cibles de gestion sont limitées à celles visibles. La reprise attend la fermeture effective du démarrage async. Des captures démarrage, carte locale, commerce et vue quartier précèdent le parcours métier pour conserver des preuves même si le gameplay échoue ensuite.

Le joystick emploie désormais CDP touchStart/touchCancel : le précédent dispatch_event pointerdown ne créait pas de pointeur actif, incompatible avec setPointerCapture. Les contrôles indisponibles du kiosque sont vérifiés explicitement pour éviter une assertion qui réussirait sur une liste vide.

`scripts/ci_browser.py` sert le jeu sur un port local libre, exécute QA avec limite de 240 secondes, émet un résumé même en échec et arrête le serveur. `python3 -m py_compile` passe pour les deux scripts. Aucun résultat navigateur n’est revendiqué avant réception des artefacts CI. Les captures partielles ne doivent pas être confondues avec réussite complète du parcours.
