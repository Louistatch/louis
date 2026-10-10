# Lagos Life — vérification de l’interface pour TOGO LIFE

Examen du 10 octobre 2026. Recherche web et consultation des pages publiques, puis comparaison au HTML/CSS de TOGO LIFE publié. Aucun compte Lagos Life créé, aucune transaction, aucun code ou asset propriétaire importé. Le mot « observé » ci-dessous concerne les textes effectivement accessibles ; il ne signifie pas une session de jeu exécutée.

## Provenance et niveaux de preuve

1. **Source officielle identifiée.** [Vatar / Worlds](https://vatar.com/worlds/) renvoie explicitement à [lagoslife.app](https://lagoslife.app/). Les domaines proches ne deviennent pas officiels parce qu’ils réemploient le nom. Vatar présente emplois, logement et interactions sociales, mais sa page commerciale n’est pas un test de fonctionnement.
2. **Interface publique directement accessible.** La [boutique ang’s food spot](https://lagoslife.app/c/co_bfa0bbb03bb844b58c1a) affiche une enseigne, un propriétaire, une catégorie, une note, un quartier, des marchandises à prix distincts et un bouton pour ouvrir la boutique dans le jeu. Les produits locaux rendent une économie lisible et un lieu reconnaissable. Aucun achat n’a été effectué.
3. **Capture journalistique indexée, pixels non inspectés.** L’article [NexalGaming, 5 octobre](https://nexalgaming.co/post/lagos-life-crosses-1-million-gamers-in-5-days) fournit une capture du travail d’un Marketer. La description image du moteur de recherche mentionne jour/heure, humeur, argent, activité, performance, prochaine tâche, choix de travail et sortie avec paiement partiel. Elle mentionne la navigation Home / Map / Phone. L’ouverture directe du fichier image échoue dans l’outil ; ces détails restent une description indexée de la capture, pas notre observation visuelle indépendante.
4. **Guides de joueurs indépendants.** [Lagos Life Wiki / How to play](https://lagoslifewiki.com/how-to-play/) et [Lagos Lifestyle Wiki / Jobs](https://lagoslifestyle.wiki/money/jobs-and-salaries) déclarent des sessions et captures datées. Ils décrivent la personnalisation, les besoins, les emplois depuis le téléphone, la rémunération par service et des critères de progression. Nous n’avons pas reproduit leurs sessions. Les nombres, menus et positions peuvent changer ; ne pas les traiter comme une spécification officielle actuelle.

## Captures et démonstration trouvées

| Référence | Provenance déclarée | Résultat réel de notre accès |
|---|---|---|
| [Écran de travail](https://nexalgaming.co/cdn-cgi/image/width%3D800%2Cformat%3Dauto/cdn-cgi/imagedelivery/4-uVHHk5QQ1cIDzJPkVNLQ/screenshot-2026-10-05-084729-11f7b6e2/public) | Article NexalGaming relié au jeu officiel | URL extraite ; description indexée obtenue ; ouverture image en erreur. |
| [Balogun Market / HUD](https://lagoslife.today/assets/img/hero-gameplay.png) | Guide indépendant, image fournie déclarée du jeu | URL extraite ; outil retourne seulement un marqueur ImageDisplayed, sans pixels exploitables. |
| [Jobs app](https://lagoslifestyle.wiki/_astro/jobs-app.BVd2ZIom_1iw0kt.webp) | Guide indépendant, capture déclarée du 6 octobre | URL extraite ; même limite de restitution image. |
| [Career tab](https://lagoslifestyle.wiki/_astro/career-panel.LQcH-Kvy_OlGJn.webp) | Guide indépendant, capture déclarée du 6 octobre | URL extraite ; même limite de restitution image. |
| [How to Play, Part 1](https://www.youtube.com/watch?v=BWNURzm-Avc) | Vidéo liée par lagoslife.today | Accès throttled ; vidéo non regardée, aucun détail attribué à son contenu. |

Ces images appartiennent à leurs ayants droit. Ce sont des références à consulter, pas des ressources graphiques réutilisables dans TOGO LIFE. Aucun fichier de capture de Lagos Life n’a été intégré au jeu.

## Ce que l’interface publiée de TOGO LIFE doit corriger

Constats tirés de `index.html` et `life.css` : objectif, besoins et inventaire sont rassemblés dans un bloc de 260 px en haut à gauche ; la scène ne possède pas de carte locale ; la navigation mélange destinations, partage, son et pause ; le premier écran est une grande accroche éditoriale suivie de listes déroulantes ; les actions économiques sont une liste de boutons peu structurée. Ces constats portent sur le code et n’inventent pas un contrôle visuel en navigateur.

| Principe applicable | Preuve / raison | Adaptation originale et implémentable |
|---|---|---|
| État du joueur toujours lisible | Horloge, budget et besoins sont décrits dans les captures et guides. | Bandeau compact budget/heure ; carte personnage avec deux besoins réels et réputation ; aucune jauge factice. |
| Navigation stable par intention | Home / Map / Phone est décrit dans la capture de travail. | Accès Quartier / Ma vie / Commerce / Menu ; placer son et partage dans les panneaux secondaires. |
| Activité et lieu identifiés | La boutique publique distingue enseigne, quartier et marchandises ; la capture décrite identifie le poste courant. | Titre du marché/comptoir/logement, rôle de l’activité, coût ou gain, stock et conditions au même endroit. |
| Conséquences économiques explicites | Prix publics ; guide de travail mentionnant paiement par service et conditions. | Montant avant validation, achat limitant sac/stock, livraison payée à destination, marge et demande au comptoir. Ne pas recopier les chiffres ou les textes de Lagos. |
| Reconnaissance culturelle utile | La boutique publique associe quartiers et nourriture locale aux actions. | Nom du quartier, marchandises et vie quotidienne togolaises dans les décisions, sans emprunter les noms de lieux nigérians. |
| Progression compréhensible | Guides de joueurs décrivant carrière, heures et performance. | Objectif suivant compact lié à l’état réel : livraison, ouvrir le comptoir, vendre, aménager le logement. |
| Séparer exploration et annuaire futur | Les destinations annoncées ne sont pas des scènes testées. | Carte de quartier utilisable pour les lieux actuellement présents ; autres régions clairement marquées à découvrir ultérieurement. |

## Ce que cette recherche ne valide pas

Elle ne valide ni la qualité des animations, ni la caméra, ni la disposition exacte de toutes les jauges, ni le rythme des tâches, ni l’efficacité commerciale ou virale de Lagos Life. La page d’invitation officielle renvoie aujourd’hui un message de redirection ; l’ancienne carte publique décrite dans le rapport initial n’a pas été reproduite dans cet accès. Aucun FPS, chargement mobile ou comportement connecté n’a été mesuré. Les captures candidates doivent être inspectées visuellement lorsque l’environnement le permet avant de prétendre à une comparaison graphique complète.

La direction proposée porte sur une meilleure hiérarchie des informations et des décisions jouables. Elle ne prétend pas que TOGO LIFE possède déjà les carrières, les six besoins, le téléphone social ou le multijoueur de la référence.
