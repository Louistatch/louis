# Instrumentation de validation de l’interface

`tests/browser.py` a été enrichi le 10 octobre 2026. Validation réalisée à ce stade : compilation Python uniquement (`python3 -m py_compile tests/browser.py`). Des exécutions Chromium ont ensuite été lancées sur GitHub. Le résultat courant est consigné séparément ; les checks ci-dessous décrivent le protocole et ne constituent pas une déclaration de réussite.

- Aperçu avatar visible avant le démarrage, choix de tenue/peau réellement conservé dans le domaine.
- Mini-plan visible, carte locale et destination `[data-target]` : sélection sans téléportation du personnage.
- Panneau `#life` : besoins, stock et bilan ; orientation depuis gestion sans transaction à distance.
- Bouton `#cameraBtn` : état accessible `aria-pressed`, bascule aller/retour sans déplacer l’avatar.
- Déplacement, course, arrêt, trajet physique marché/comptoir, achat, investissement, dépôt et ventes restent exercés par clavier réel, sans hook de mutation de position.
- Motif visible pour chaque bouton désactivé des choix ; les raisons doivent être contenues dans `small`, `.reason` ou `[data-reason]`.
- Pause et reprise, sauvegarde apparence/commerce, absence d’erreurs JS, captures PC/mobile si l’exécution atteint ces étapes.
- À 390×844 : boutons nav/context/course au moins 48×48 CSS px, absence de HUD au centre du monde, joystick et annulation, absence de débordement horizontal.

Contrat UI : aperçu `canvas` ou `[data-avatar-preview]` dans `#start` ; mini-plan `#minimap`, `#miniMap` ou `[data-minimap]` ; ouverture carte `#quartierBtn` ou `#mapBtn` ; dialogues `#map` et `#life`, fermetures `[data-close]` ; libellés besoins/bilan lisibles.

Limites : l’absence de HUD sur un point central ne démontre pas l’absence de tout chevauchement. Le profil mobile Playwright n’est pas un appareil Android réel. Les événements de joystick synthétiques vérifient les handlers, pas tous les comportements physiques du tactile ni une session multitouch complète. Le trajet clavier suppose la caméra initiale yaw 0,2 et doit rester ainsi après retour du mode quartier. Les captures ne deviennent des preuves que lorsqu’elles sont écrites par une exécution navigateur réussie.
