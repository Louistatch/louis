# Refonte de l’interface — 10 octobre 2026

Le joueur a rejeté le premier HUD publié et demandé une comparaison à Townsmen 5 et Lagos Life. Les recherches précisent les éditions, les liens officiels et les limites d’accès aux captures. Nous adaptons les principes de gestion et d’activité vérifiables, sans reproduire leurs assets ou prétendre avoir joué ces jeux.

## Direction appliquée

Le monde reste à la troisième personne, avec une seconde caméra surélevée jouable. Le budget, le jour et les besoins restent compacts. Le centre sert aux déplacements. Le plan local utilise les positions du monde réellement implémenté ; choisir un lieu change le repère, jamais la position ou l’argent du joueur.

Palette : panneau bleu ardoise #192c32, surface de formulaire #10272d, texte #f1f5f1, activité verte #79c29e, objectif doré #f2cc78, alerte #ed947f. La typographie sans empattement (Trebuchet MS, Arial de secours) conserve des chiffres tabulaires pour les valeurs. Icônes SVG originales. Les couleurs du drapeau identifient le jeu sans importer une identité graphique tierce.

Le grand écran de présentation devient une création de personnage avec aperçu glTF animé, choix visibles et objectif concret. Les informations secondaires se consultent dans « Ma vie » : besoins, journal, étapes et bilan du comptoir. Le tableau commercial montre la marge par produit, la demande, les recettes, toutes les dépenses et le budget après loyer dû ; aucune valeur n’est présentée comme un bénéfice net.

Les fiches de marché/comptoir/logement relient les actions à leur coût, capacité et résultat. Une action refusée explique pourquoi. Les transactions restent effectuées par la simulation au lieu physique correspondant. Les besoins sont nommés « Énergie » et « Satiété » pour correspondre au sens des jauges.

## États couverts par le code

Création / reprise, aperçu indisponible sans bloquer l’entrée, quartier, objectif choisi ou automatique, plan local / annuaire national, personnage / objectifs / commerce, fiches de lieux et habitants, pause / qualité / son / commandes, partage, WebGL indisponible. PC : ZQSD/WASD, Maj, E, M, J, C ; mobile : joystick, course et rotation sur le monde. Les annulations et fermetures remettent les contrôles à zéro.

Tous les fichiers de la plateforme d’examen BAD/Bryq restent inchangés. Un nouveau workflow autonome ne teste que TOGO LIFE ; il n’a que l’autorisation GitHub contents: read et ne déploie rien.

## Validation

Les projections UI et le plan ont des tests Node : cohérence avec les refus réels de Simulation, limites de demande/horaires, cible réelle, absence de mutation et sélection indépendante du DPR. Le parcours Playwright inclut les nouvelles vues et conserve le trajet physique des transactions. Les captures et chiffres de performance ne sont acceptés qu’après exécution effective de Chromium.

Une réussite de logique ne valide ni les pixels, ni l’ergonomie, ni la cible de 30 FPS sur Android réel. Le compte rendu navigateur sera publié séparément avec le contexte de mesure.
