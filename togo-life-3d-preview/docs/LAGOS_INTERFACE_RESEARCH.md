# Lagos Life — vérification de l’interface pour TOGO LIFE

Examen du 10 octobre 2026. Recherche web, consultation des pages publiques, **inspection réelle des pixels de quatre captures téléchargées**, puis comparaison au HTML/CSS de la première version TOGO LIFE publiée. Aucun compte Lagos Life créé, aucune transaction, aucun code ou asset propriétaire importé. L’inspection d’une capture n’est ni une session jouée, ni une authentification indépendante de sa date ou de son auteur.

## Provenance et niveaux de preuve

1. **Source officielle identifiée.** [Vatar / Worlds](https://vatar.com/worlds/) renvoie explicitement à [lagoslife.app](https://lagoslife.app/). Les domaines proches ne deviennent pas officiels parce qu’ils réemploient le nom. Vatar présente emplois, logement et interactions sociales, mais sa page commerciale n’est pas un test de fonctionnement.
2. **Interface publique directement accessible.** La [boutique ang’s food spot](https://lagoslife.app/c/co_bfa0bbb03bb844b58c1a) affiche une enseigne, un propriétaire, une catégorie, une note, un quartier, des marchandises à prix distincts et un bouton pour ouvrir la boutique dans le jeu. Les produits locaux rendent une économie lisible et un lieu reconnaissable. Aucun achat n’a été effectué.
3. **Capture journalistique visuellement inspectée.** L’article [NexalGaming, 5 octobre](https://nexalgaming.co/post/lagos-life-crosses-1-million-gamers-in-5-days) fournit une capture du travail d’un Marketer. Le téléchargement dans GitHub Actions puis `view_image` a permis d’examiner ses pixels. L’interface effectivement visible est décrite ci-dessous. Il s’agit toujours d’une capture tierce, pas de notre session.
4. **Captures de guides indépendants inspectées, récit non reproduit.** [Lagos Life Wiki / How to play](https://lagoslifewiki.com/how-to-play/) et [Lagos Lifestyle Wiki / Jobs](https://lagoslifestyle.wiki/money/jobs-and-salaries) déclarent des sessions datées. Les fichiers Market, Jobs et Career de guides indépendants ont été téléchargés et visualisés. La disposition visible peut être analysée ; leur provenance déclarée et les résultats de leurs joueurs restent distincts de nos observations. Les nombres et menus ne constituent pas une spécification officielle actuelle.

## Captures et démonstration trouvées

| Référence | Provenance déclarée | Résultat réel de notre accès |
|---|---|---|
| [Écran de travail](https://nexalgaming.co/cdn-cgi/image/width%3D800%2Cformat%3Dauto/cdn-cgi/imagedelivery/4-uVHHk5QQ1cIDzJPkVNLQ/screenshot-2026-10-05-084729-11f7b6e2/public) | Article NexalGaming relié au jeu officiel | Téléchargé HTTP 200, 15 988 octets ; pixels inspectés avec `view_image`. |
| [Balogun Market / HUD](https://lagoslife.today/assets/img/hero-gameplay.png) | Guide indépendant, image fournie déclarée du jeu | Téléchargé HTTP 200, 182 077 octets ; pixels inspectés avec `view_image`. |
| [Jobs app](https://lagoslifestyle.wiki/_astro/jobs-app.BVd2ZIom_1iw0kt.webp) | Guide indépendant, capture déclarée du 6 octobre | Téléchargé HTTP 200, 52 456 octets ; pixels inspectés avec `view_image`. |
| [Career tab](https://lagoslifestyle.wiki/_astro/career-panel.LQcH-Kvy_OlGJn.webp) | Guide indépendant, capture déclarée du 6 octobre | Téléchargé HTTP 200, 10 868 octets ; pixels inspectés avec `view_image`. |
| [How to Play, Part 1](https://www.youtube.com/watch?v=BWNURzm-Avc) | Vidéo liée par lagoslife.today | Accès throttled ; vidéo non regardée, aucun détail attribué à son contenu. |

Les premiers accès au moteur web échouaient ou retournaient seulement `ImageDisplayed`. Cette limite a été résolue par le téléchargement de l’[artifact GitHub Actions 11656550908](https://api.github.com/repos/Louistatch/louis/actions/artifacts/11656550908) issu du [run 38015653793](https://github.com/Louistatch/louis/actions/runs/38015653793). Le manifeste de téléchargement est daté `2026-10-10T02:06:36.738728+00:00`. Ses indicateurs `pixels_inspected:false` décrivent l’étape de téléchargement automatisée ; le présent rapport atteste l’étape suivante, effectuée réellement avec `view_image`.

| Fichier de recherche local | SHA-256 consigné dans le manifeste |
|---|---|
| `lagos-life-work.webp` | `442b303c9ec98a380e00fc7acdf37bf83db877fdf05de8f81d42c1bacad53324` |
| `lagos-life-market.png` | `026fe84cfb6194b1fa6fc2e675033d5831af78f76e7d4ce154040077b73597fd` |
| `lagos-life-jobs.webp` | `3154f0cd1c7dffd56cde970d18db77101dfc64bf6bbcac7c129f1fb5b86209cb` |
| `lagos-life-career.webp` | `60d145fa96f14b14fd87aec9701445c272c4f0835525888067f7379cf8bc287b` |

Fichiers de travail consultés dans `/workspace/research/interface-references/`. Ces images appartiennent à leurs ayants droit. Elles ne sont ni des captures TOGO LIFE, ni des assets réutilisables. Aucun fichier image Lagos Life n’est intégré au jeu ou committé dans le dépôt.

## Observations visuelles directes

**Marché.** La scène est un diorama vu d’en haut selon un angle incliné : les stands, marchandises, personnages et passages restent visibles ensemble. Le bandeau supérieur central regroupe date/heure, humeur, compteurs et portefeuille. En bas, une carte contextuelle horizontale donne le nom et le quartier du marché, un champ de conversation et des actions de stands. Un dock distinct conserve Home / Buy / Map / Phone. Les messages courts et les petites jauges sont dans le coin supérieur gauche de cette capture. L’interface laisse une large part de la scène lisible ; elle ne se résume pas à une page de boutons.

**Travail.** Le bandeau global reste compact. Le panneau d’activité rassemble métier, prochaine heure de retour au domicile, performance, attente de tâche, styles de travail et sortie avec paiement partiel. Les besoins et le portrait sont petits, en bas à gauche ; la navigation reste en bas au centre. La capture prouve que ces informations sont affichées ensemble, pas que chaque option a été testée.

**Téléphone / emplois.** La scène reste reconnaissable sous un assombrissement, derrière un téléphone central. Chaque carte d’emploi distingue intitulé, poste de départ, rémunération **par service**, contraintes temporelles et bouton d’engagement. La même disposition visuelle rend la comparaison des choix possible avant d’agir. Aucun salaire de ces images ne doit être transposé au modèle économique de TOGO LIFE.

**Carrière.** La fiche relie poste actuel, rémunération, horaires, performance et condition de prochaine promotion. Le calendrier indique les jours de travail. Le joueur peut lire la progression et la condition requise dans une même fiche. Cette capture isolée ne valide pas la promotion effective ni l’actualité de ses règles.

**Nuance de placement.** Les jauges sont en haut à gauche au marché et en bas à gauche dans les captures travail/téléphone. Nous retenons leur compacité et leur continuité, sans prétendre à une position universelle. Les vues du monde sont inclinées et élevées ; aucune conclusion sur la fluidité ou les commandes de caméra ne peut être tirée d’images fixes.

## Ce que la première interface publiée de TOGO LIFE doit corriger

Constats relevés dans `index.html` et `life.css` avant cette refonte : objectif, besoins et inventaire étaient rassemblés dans un bloc de 260 px en haut à gauche ; la scène ne possédait pas de carte locale ; la navigation mélangeait destinations, partage, son et pause ; le premier écran utilisait une grande accroche éditoriale suivie de listes déroulantes ; les actions économiques étaient une liste de boutons peu structurée. Ces constats portent sur le code initial ; la validation de la nouvelle interface est documentée séparément.

| Principe applicable | Preuve / raison | Adaptation originale et implémentable |
|---|---|---|
| État du joueur toujours lisible | Bandeau compact et jauges réellement visibles dans les quatre captures. | Bandeau budget/heure ; petite carte personnage avec les deux besoins réellement simulés ; objectif condensé ailleurs. |
| Navigation stable par intention | Dock Home / Buy / Map / Phone visible au marché et au travail. | Quartier / Ma vie / Commerce / Menu au même endroit ; partager et son dans des panneaux secondaires. Les commandes tactiles ne doivent pas couvrir ce dock. |
| Activité et lieu identifiés | Carte marché nommée, panneau de travail et fiche carrière réellement inspectés. | Carte contextuelle marché/comptoir/logement avec intitulé, rôle, état et actions locales. Le panneau montre la scène autour de lui ; le fermer ramène au quartier. |
| Conséquences économiques explicites | Cartes Jobs : paiement par service et conditions ; activité de travail avec performance et attente. | Achat : quantité/coût/place restante. Comptoir : stock/prix/marge par produit/demande/horaires. Livraison : destination/date limite/paiement après remise. Afficher la cause du blocage à côté du choix. |
| Reconnaissance culturelle utile | La boutique publique associe quartiers et nourriture locale aux actions. | Nom du quartier, marchandises et vie quotidienne togolaises dans les décisions, sans emprunter les noms de lieux nigérians. |
| Progression compréhensible | Prochain poste et condition de promotion visibles dans Career. | Objectifs livraison/comptoir/cinq ventes/logement, cochés uniquement par l’état sauvegardé ; journal d’actions réelles. Ne pas présenter un revenu garanti à la place d’un objectif. |
| Séparer exploration et annuaire futur | Les destinations annoncées ne sont pas des scènes testées. | Carte de quartier utilisable pour les lieux actuellement présents ; autres régions clairement marquées à découvrir ultérieurement. |
| Montrer les lieux et leurs connexions | Diorama de marché lisible et vue inclinée de l’intérieur dans les captures. | Ajouter une vue de quartier inclinée et une vue de personnage, avec commande explicite de bascule. Les marqueurs des destinations correspondent aux lieux accessibles, jamais à un itinéraire fictif. |

La carte locale et la bascule de caméra sont nos adaptations au quartier ouvert de TOGO LIFE : les quatre captures ne démontrent pas que Lagos Life utilise ces mêmes fonctions. La référence donne une hiérarchie de lecture et des décisions contextualisées, pas une permission de copier son identité graphique.

## Ce que cette recherche ne valide pas

Elle ne valide ni la qualité des animations, ni le fonctionnement ou la fluidité de caméra, ni le rythme des tâches, ni l’efficacité commerciale ou virale de Lagos Life. Les positions décrites sont celles des images inspectées, pas de toute configuration mobile. La page d’invitation officielle renvoie aujourd’hui un message de redirection ; l’ancienne carte publique décrite dans le rapport initial n’a pas été reproduite dans cet accès. Aucun FPS, chargement mobile ou comportement connecté n’a été mesuré. Les dates et l’authenticité historique des captures de guides indépendants ne sont pas authentifiées par les seuls téléchargements et checksums.

La direction proposée porte sur une meilleure hiérarchie des informations et des décisions jouables. Elle ne prétend pas que TOGO LIFE possède déjà les carrières, les six besoins, le téléphone social ou le multijoueur de la référence.
