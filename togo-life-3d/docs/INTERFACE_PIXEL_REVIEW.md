# Revue des captures réelles de l’interface PC

10 octobre 2026. Inspection visuelle effective des quatre PNG `probe-chromium-start`, `active`, `overview` et `commerce` dans `/workspace/research/qa-ui-5/`. Ces images proviennent du probe Chromium exécutant le véritable monofichier du jeu, à 1440×900. Elles ne sont pas des concepts. Le rapport Chromium du probe est réussi ; cela valide ces étapes de rendu et d’ouverture de panneaux, pas tout le parcours métier de `tests/browser.py`.

## Ce que les pixels établissent

**Accueil** : le formulaire et le CTA vert ressortent clairement. Aperçu du personnage, choix tenue/peau, budget et destination tiennent dans la fenêtre sans débordement visible. L’état focus du prénom est perceptible. Le monde reste identifiable derrière le dialogue. L’avatar est cependant une figurine constituée de volumes arrondis séparés : torse blanc en deux lobes, épaules sphériques, mains/faciès sommaires. Cette qualité du modèle tire fortement la perception du produit vers un prototype. Le panneau ne peut pas compenser ce défaut.

**Jeu actif** : argent, heure, besoins, objectif, mini-plan, vue caméra et dock possèdent des zones distinctes. Aucun panneau n’occulte le personnage central sur cette capture. La commande contextuelle « Discuter » est claire. Le marché, motos, trottoir et taxi existent réellement dans le rendu. Deux personnages se superposent près du joueur : une tête et un torse jaunes sont visibles derrière l’avatar, avec des membres confondus. Ce chevauchement au premier point d’arrivée dégrade immédiatement la crédibilité sociale. La grande enseigne du marché encombre visuellement l’arrière-plan de l’identité en haut gauche ; texte de marque et décor rivalisent.

**Vue quartier** : la bascule donne réellement une vue élevée différente, sans retirer les outils UI. Le joueur devient très petit et n’est pas signalé par un contour ou chevron facilement repérable. Une large route presque noire prend environ un tiers de la largeur ; les grands toits opaques réduisent encore la zone informative. Cette vue donne du recul mais n’est pas encore une bonne vue de gestion spatiale. Les zones de marché et taxis sont reconnaissables ; leur lien avec l’objectif doit être renforcé.

**Commerce** : les trois onglets, intitulés et valeurs sont lisibles. Le panneau expose stock, prix, marge, demande, ventes, recettes, dépenses et budget, avec l’explication des limites de marge. Les huit lignes restent toutes visibles ; le CTA et retour le sont aussi. Le compte est « À ouvrir » et pourtant prix/marge/demande sont présentés sans distinction visuelle comme paramètres actifs. La phrase « Me rendre au comptoir » ressemble à une commande de déplacement automatique, alors que le code sélectionne seulement un repère. Le panneau est propre mais demande encore trop de lecture pour la toute première décision.

## Corrections à prioriser

1. **Séparer le spawn joueur des trajectoires PNJ**, avec distance minimale et réaction locale, puis refaire une capture active après quelques secondes. Le chevauchement observé est un problème concret, pas une hypothèse.
2. **Remplacer l’avatar figurine**, déjà signalé au responsable personnage. Vérifier également les habitants après remplacement : le rendu actif montre des modèles de qualité/proportions hétérogènes.
3. **Commerce non ouvert : afficher d’abord la décision** « Ouverture 9 000 F · stock non inclus », puis les paramètres prévus en rubrique secondaire. Après ouverture, stock et ventes passent en priorité. Changer le CTA en « Repérer le comptoir » ou préciser qu’il faut marcher.
4. **Vue quartier : marquer clairement le joueur et la destination**, sans introduire construction/téléportation inexistantes. Une légère réduction du recul ou un cadrage joueur+destination pourrait être plus utile que la route centrale.
5. **Mini-plan : grossir la cible prioritaire et ajouter une légende compacte**. Sur la capture PC, ses lettres et points occupent quelques pixels : il sert de repère global, pas d’identification fiable de chaque lieu.
6. **Renforcer la lisibilité des aides secondaires** : texte de commandes, sous-titres et inventaire sont petits sur un rendu 1440×900 ; la preuve montre surtout un contraste faible des aides placées directement sur trottoir. Les aides essentielles doivent rester accessibles depuis Menu.

## Limites de la validation

Ces captures n’établissent ni mouvement fluide, ni réussite des transactions, ni collisions, ni mémoire stable. La mesure d’environ 2,8 FPS rapportée sur rendu logiciel headless décrit cet environnement ; elle ne valide ni objectif PC60 ni Android30 et ne représente pas automatiquement un appareil matériel réel. Aucun screenshot mobile n’est disponible dans ce lot : ergonomie et tactile Android restent à tester.

Firefox n’est **pas** validé : son probe rapporte un échec WebGL. Un job marqué réussi grâce à continue-on-error ne change pas le résultat du probe. L’apparition de quatre images Chromium constitue enfin une preuve de rendu réel ; elle ne permet pas de dire que la suite complète ou le produit commercial est prêt.
