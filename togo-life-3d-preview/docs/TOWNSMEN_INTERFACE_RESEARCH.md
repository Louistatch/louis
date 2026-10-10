# Townsmen 5 : référence d'interface vérifiée

Recherche réalisée le 10 octobre 2026 pour répondre au rejet de l'interface TOGO LIFE publiée. **Trois captures de l'édition exacte ont maintenant été inspectées visuellement** après récupération par le runner GitHub QA. Ce document sépare cette observation des comptes rendus de presse et de nos décisions de conception. Il ne constitue pas un test joué de Townsmen 5.

## Édition exacte

La référence étudiée est **Townsmen 5 sur téléphones Java**, développé par HandyGames et publié par Disney Mobile Studios, testé par Pocket Gamer le 28 janvier 2008. Le [test daté de Pocket Gamer](https://www.pocketgamer.com/townsmen-5/review/) et la [fiche de Pocket Gamer France](https://www.pocketgamer.fr/games/004458/townsmen-5/screenshots/) permettent d'identifier cette édition.

Townsmen sur Android/iOS (2012), Townsmen: A Kingdom Rebuilt et Townsmen VR sont d'autres éditions. Leurs images dominent les résultats de recherche mais ne prouvent rien sur l'interface de Townsmen 5. Les guides du premier Townsmen de 2004/2005 ne sont pas non plus des manuels de Townsmen 5.

## Ce qui est réellement consulté

| Source | Consultation effectuée | Ce que cela permet d'affirmer |
| --- | --- | --- |
| [Pocket Gamer, test du 28 janvier 2008](https://www.pocketgamer.com/townsmen-5/review/) | Texte intégral accessible via outil web | Le critique décrit des objectifs successifs, une économie où ressources et trésorerie limitent les décisions, la vente de surplus et l'accélération du temps. Ce sont des observations du critique, pas notre propre session de jeu. |
| [Pocket Gamer, annonce du 16 janvier 2008](https://www.pocketgamer.com/townsmen-5/townsmen-5-heads-for-mobile/) | Texte accessible | L'article annonce des évolutions de l'interface, une accélération du temps et une sauvegarde automatique. Le statut d'annonce est conservé ; l'autosauvegarde n'a pas été testée ici. |
| [Galerie Pocket Gamer France](https://www.pocketgamer.fr/games/004458/townsmen-5/screenshots/) | Page accessible, neuf images annoncées | L'extraction donne un placeholder et ne restitue pas les neuf captures. Aucune description précise de ces images n'est revendiquée. |
| [Image liée au test Pocket Gamer](https://media.pocketgamer.com/artwork/na-elxy/townsmen1.gif) | Ouverture web initialement impossible ; récupération HTTP puis inspection locale de la première frame | Image de 240 × 320 pixels effectivement vue avec `view_image`. Seule cette frame est décrite ; aucune séquence animée ni partie jouée. |
| [Fiche PHONEKY de Townsmen 5](https://mobile.phoneky.com/games/?id=j4j17017) | Page consultée ; deux JPEG récupérés par QA puis inspectés localement | Images de 176 × 208 et 240 × 320 pixels effectivement vues. Source de distribution non officielle. Aucun exécutable du jeu téléchargé ou installé. |

Liens des prévisualisations associées à cette fiche : [JPEG 1](https://downloadwap.com/thumbs4/games/preview/176x208/Games/2/1284172173-1.jpg), [JPEG 2](https://downloadwap.com/thumbs4/games/preview/2020d/img/2/459405_townsmen_5_2.jpg). Ils restent des références tierces, pas des assets autorisés pour TOGO LIFE.

### Blocage initial, puis inspection réussie

L'outil web ne restituait initialement que des marqueurs d'images et refusait le GIF. Le proxy du shell local était également inaccessible. Ces limites concernaient la première phase de recherche ; elles ne décrivent plus le résultat final de consultation des trois images ci-dessus.

Le script `scripts/capture-reference-images.py` a ensuite récupéré les références sur le [runner GitHub QA, exécution 38015653793](https://github.com/Louistatch/louis/actions/runs/38015653793). L'artefact 11656550908 a été téléchargé dans l'espace de recherche local. Les trois fichiers Townsmen ont été vus avec `view_image`, en résolution originale. Le GIF a été ouvert sur sa première frame convertie en PNG pour l'inspection ; l'original est conservé hors des assets du jeu.

Les valeurs ci-dessous proviennent du manifeste de téléchargement, créé le 10 octobre 2026 à 02:06:36 UTC. Les tailles et SHA-256 ont ensuite été recalculés localement et correspondent au manifeste. Son champ `pixels_inspected: false` décrit le téléchargement automatique ; nous le conservons intact et documentons séparément l'inspection visuelle effectivement réalisée par les agents.

| Référence | HTTP / MIME | Octets | Dimensions | SHA-256 vérifié |
| --- | --- | ---: | --- | --- |
| `townsmen-5-01.jpg` | 200 / image/jpeg | 47 481 | 176 × 208 | `ff2dcbadfcb2b8411960ae9fcee50a3b999719144fbe28e352daed80e8617bed` |
| `townsmen-5-02.jpg` | 200 / image/jpeg | 37 422 | 240 × 320 | `fc0194409d5f461d9b9c3d26ae709602d4c4a089437cfe8d3f63cfa45598d6a4` |
| `townsmen-5-pocketgamer.gif` | 200 / image/gif | 61 440 | 240 × 320 | `d39b9416aabcf4a1c21e4ee7a035e5b3661a091da8dd82895b13774275f13591` |

Ces fichiers propriétaires restent hors du dépôt, hors de `assets/` et hors du déploiement TOGO LIFE. Ils servent uniquement à l'étude. Le téléchargement et les checksums ne valident pas l'intégrité économique du jeu, la date de chaque capture tierce ou une licence de réutilisation.

### Ce qui est directement observé dans les pixels

- Les trois captures donnent presque toute la surface au monde isométrique : bâtiments, chemins, rivière, arbres, habitants et activités remplissent la scène. Le jeu reste visible sans grand panneau d'introduction ou tableau de gestion permanent.
- Une bande très fine en haut regroupe petites icônes et valeurs de ressources. Les valeurs ordinaires sont jaunes ; certaines quantités sont rouges dans les deuxième et troisième captures. Les ressources sont distinguées visuellement avant toute fiche détaillée. Leur nom et leurs seuils précis ne sont pas déduits des seuls pixels.
- Une grande réserve numérique occupe le coin supérieur droit. Des cadres dorés suivent l'empreinte isométrique d'un emplacement ou d'un bâtiment sélectionné. La sélection se lit dans le monde lui-même.
- Les commandes périphériques sont petites, avec un bouton de menu en bas à gauche et des marques de commande aux coins. Il n'y a ni rangée de grandes cartes éditoriales, ni paragraphe explicatif couvrant le centre.

Une horloge n'est pas identifiable avec certitude dans ces captures et n'est donc pas attribuée à Townsmen 5. Les interactions, menus ouverts, animations et réponse des commandes n'ont pas été testés. Aucun passage d'une démonstration vidéo n'a été effectivement visionné. Les résultats « Townsmen Ep 5 » renvoyant à un autre jeu ont été écartés.

## Enseignements étayés et adaptations originales

Le test de l'édition exacte rapporte une campagne qui introduit progressivement les interdépendances économiques, plutôt qu'une exposition initiale de toutes les règles. Pour TOGO LIFE, notre adaptation est un premier objectif concret et court, avec une destination identifiable et une récompense visible. Cette décision est une interprétation de conception, pas une copie de disposition graphique.

La trésorerie et les stocks déterminent le résultat dans le jeu décrit. Dans TOGO LIFE, une fiche de marché doit réunir quantité achetée, coût total et place disponible dans le sac. Une fiche de commerce doit afficher stock, prix, revenu réalisé et les conditions qui empêchent une vente. Le joueur doit pouvoir comparer les choix avant de les confirmer.

Les pixels inspectés confirment une interface qui permet de surveiller une simulation tout en regardant son monde. Nous retenons une bande de ressources compacte et des fiches ouvertes seulement au lieu concerné. La sélection visible dans le monde complète le repère sur la carte. Nous ne reproduisons ni les icônes, ni le cadre isométrique, ni les tailles minuscules imposées par les téléphones Java.

L'accélération du temps est pertinente pour un jeu de gestion où le joueur attend une production. TOGO LIFE étant aussi un déplacement à la troisième personne, nous ne la reprenons pas automatiquement : elle peut modifier les échéances, les besoins et les collisions. Une éventuelle commande devra être spécifiée et testée avant d'être affichée.

## Défauts du HUD publié avant cette refonte

Inspection de `index.html` et `life.css` avant refonte :

- Le premier écran utilise une grande accroche en Georgia et un formulaire de présentation. Le quartier est derrière une boîte modale avec flou ; l'entrée ressemble davantage à une présentation de produit qu'à un écran de jeu.
- Le bloc d'objectif combine texte d'introduction, besoins et inventaire sur une surface fixe de 260 px. Sur mobile, il reste un bloc de 210 px tandis que d'autres commandes occupent simultanément le bas de l'écran.
- Les actions de navigation sont quatre boutons textuels parallèles. « Destinations » ouvre un répertoire national tandis que seule une scène de Lomé est jouable. La fonction d'orientation immédiate dans ce quartier n'est pas assurée par ce répertoire.
- Le HTML ne présente aucune vue de repérage du quartier ni aucun accès permanent à une synthèse structurée du commerce. La monnaie est visible, mais la profondeur économique est surtout découverte dans les boutons d'interaction.

Ces constats initiaux viennent du code de la version rejetée, sans validation de pixels de cette version. La nouvelle interface possède désormais aperçu du personnage, mini-plan, plan local, onglets de gestion et caméra surélevée ; les défauts listés ici ne sont pas présentés comme inchangés après ces modifications.

## Cahier d'application pour la refonte

1. Mettre le quartier au premier plan ; réduire l'écran d'entrée à l'apparence du personnage et une décision de départ réelle.
2. Garder monnaie, heure et besoins dans des groupes compacts et stables ; réserver le centre aux mouvements et à la prochaine interaction.
3. Fournir un repérage local fondé sur les positions réelles des lieux implémentés, avec distinction entre destination locale et répertoire national.
4. Afficher une fiche contextuelle du lieu sélectionné avec titre fonctionnel, état réel, coûts, capacités et résultat attendu.
5. Montrer un objectif immédiat et sa progression réelle ; ouvrir les informations secondaires à la demande.
6. Vérifier les valeurs longues, les contrastes, les zones tactiles d'au moins 44 px et les changements de sauvegarde, pause et orientation dans le navigateur.

### Ajustements prioritaires révélés par l'inspection réelle

La vue surélevée et le plan local de la refonte sont cohérents avec le repérage spatial visible dans Townsmen 5. Il reste à vérifier que l'objectif et les besoins ne reconstituent pas un grand panneau permanent sur téléphone. Les fiches de gestion doivent rester ouvertes à la demande ; ni la mini-carte ni le dock ne doivent masquer l'action proche du joueur.

Un besoin bas ou un manque de place dans le sac doit être identifiable au premier coup d'œil, puis expliqué par un texte accessible. Le signal rouge observé dans les ressources de Townsmen constitue une référence de hiérarchie ; pour TOGO LIFE, une valeur, un libellé et une action utile doivent compléter la couleur. Les coûts bloquants restent affichés dans les boutons concernés plutôt que renvoyés à un message tardif.

Le lieu choisi doit aussi être reconnaissable dans la scène, par un repère original lisible à son entrée. Un cadre doré autour d'une empreinte de bâtiment serait inadapté à notre caméra troisième personne et ne doit pas être copié. Il faut vérifier la visibilité du repère existant dans les deux vues et aux différentes heures.

Enfin, la qualité perçue de Townsmen vient aussi de la **densité du monde visible**, pas seulement de ses boutons. Les captures montrent un réseau continu de lieux et d'activités, là où des espaces vides affaibliraient notre quartier. Le cadrage de la vue du quartier et le peuplement de ses trajets doivent être évalués sur nos captures réelles. Ajouter davantage de panneaux à l'interface ne résoudrait pas ce problème de scène.

Ce cahier utilise également les skills locaux `frontend-design`, `threejs-game-ui-designer` et sa référence `ui-patterns.md`, lus pendant cette recherche. Aucun asset, code, texte de scénario ou identité graphique propriétaire de Townsmen n'est réutilisé. La refonte doit être une interface de simulation de vie togolaise, pas une imitation médiévale.
