# Townsmen 5 : référence d'interface vérifiée

Recherche réalisée le 10 octobre 2026 pour répondre au rejet de l'interface TOGO LIFE publiée. Ce document sépare les sources consultées, les limites de consultation et nos décisions de conception. Il ne constitue pas un test joué de Townsmen 5.

## Édition exacte

La référence étudiée est **Townsmen 5 sur téléphones Java**, développé par HandyGames et publié par Disney Mobile Studios, testé par Pocket Gamer le 28 janvier 2008. Le [test daté de Pocket Gamer](https://www.pocketgamer.com/townsmen-5/review/) et la [fiche de Pocket Gamer France](https://www.pocketgamer.fr/games/004458/townsmen-5/screenshots/) permettent d'identifier cette édition.

Townsmen sur Android/iOS (2012), Townsmen: A Kingdom Rebuilt et Townsmen VR sont d'autres éditions. Leurs images dominent les résultats de recherche mais ne prouvent rien sur l'interface de Townsmen 5. Les guides du premier Townsmen de 2004/2005 ne sont pas non plus des manuels de Townsmen 5.

## Ce qui est réellement consulté

| Source | Consultation effectuée | Ce que cela permet d'affirmer |
| --- | --- | --- |
| [Pocket Gamer, test du 28 janvier 2008](https://www.pocketgamer.com/townsmen-5/review/) | Texte intégral accessible via outil web | Le critique décrit des objectifs successifs, une économie où ressources et trésorerie limitent les décisions, la vente de surplus et l'accélération du temps. Ce sont des observations du critique, pas notre propre session de jeu. |
| [Pocket Gamer, annonce du 16 janvier 2008](https://www.pocketgamer.com/townsmen-5/townsmen-5-heads-for-mobile/) | Texte accessible | L'article annonce des évolutions de l'interface, une accélération du temps et une sauvegarde automatique. Le statut d'annonce est conservé ; l'autosauvegarde n'a pas été testée ici. |
| [Galerie Pocket Gamer France](https://www.pocketgamer.fr/games/004458/townsmen-5/screenshots/) | Page accessible, neuf images annoncées | L'extraction donne un placeholder et ne restitue pas les neuf captures. Aucune description précise de ces images n'est revendiquée. |
| [Image liée au test Pocket Gamer](https://media.pocketgamer.com/artwork/na-elxy/townsmen1.gif) | Tentative d'ouverture | Échec : format GIF non pris en charge par l'outil web. Aucun pixel inspecté. |
| [Fiche PHONEKY de Townsmen 5, version 176 × 208](https://mobile.phoneky.com/games/?id=j4j17017) | Page et liens de deux JPEG ouverts | Source de distribution non officielle. Les liens de prévisualisation sont accessibles via clic dans l'outil, qui retourne uniquement un marqueur d'image dans notre interface de travail. Leur disposition n'a donc pas été inspectée visuellement. Aucun exécutable téléchargé ou installé. |

Liens des prévisualisations associées à cette fiche : [JPEG 1](https://downloadwap.com/thumbs4/games/preview/176x208/Games/2/1284172173-1.jpg), [JPEG 2](https://downloadwap.com/thumbs4/games/preview/2020d/img/2/459405_townsmen_5_2.jpg). Ils restent des références tierces, pas des assets autorisés pour TOGO LIFE.

Les recherches de démonstrations n'ont pas fourni une séquence de Townsmen 5 effectivement visionnée. Des résultats intitulés « Townsmen Ep 5 » désignent l'épisode 5 d'une série de vidéos d'un autre Townsmen ; ils ont été écartés. La tentative de récupération locale d'un JPEG a échoué parce que le proxy réseau configuré n'était pas joignable. Il ne faut pas présenter cette recherche comme une analyse complète des pixels ou des contrôles de Townsmen 5.

## Enseignements étayés et adaptations originales

Le test de l'édition exacte rapporte une campagne qui introduit progressivement les interdépendances économiques, plutôt qu'une exposition initiale de toutes les règles. Pour TOGO LIFE, notre adaptation est un premier objectif concret et court, avec une destination identifiable et une récompense visible. Cette décision est une interprétation de conception, pas une copie de disposition graphique.

La trésorerie et les stocks déterminent le résultat dans le jeu décrit. Dans TOGO LIFE, une fiche de marché doit réunir quantité achetée, coût total et place disponible dans le sac. Une fiche de commerce doit afficher stock, prix, revenu réalisé et les conditions qui empêchent une vente. Le joueur doit pouvoir comparer les choix avant de les confirmer.

L'interface doit permettre de surveiller une simulation tout en regardant son monde. Nous retenons une bande de ressources compacte et des fiches ouvertes seulement au lieu concerné. Nous ne prétendons pas que leurs emplacements ou leur dessin reproduisent le HUD exact de Townsmen 5.

L'accélération du temps est pertinente pour un jeu de gestion où le joueur attend une production. TOGO LIFE étant aussi un déplacement à la troisième personne, nous ne la reprenons pas automatiquement : elle peut modifier les échéances, les besoins et les collisions. Une éventuelle commande devra être spécifiée et testée avant d'être affichée.

## Défauts observables dans les fichiers actuels de TOGO LIFE

Inspection de `index.html` et `life.css` avant refonte :

- Le premier écran utilise une grande accroche en Georgia et un formulaire de présentation. Le quartier est derrière une boîte modale avec flou ; l'entrée ressemble davantage à une présentation de produit qu'à un écran de jeu.
- Le bloc d'objectif combine texte d'introduction, besoins et inventaire sur une surface fixe de 260 px. Sur mobile, il reste un bloc de 210 px tandis que d'autres commandes occupent simultanément le bas de l'écran.
- Les actions de navigation sont quatre boutons textuels parallèles. « Destinations » ouvre un répertoire national tandis que seule une scène de Lomé est jouable. La fonction d'orientation immédiate dans ce quartier n'est pas assurée par ce répertoire.
- Le HTML ne présente aucune vue de repérage du quartier ni aucun accès permanent à une synthèse structurée du commerce. La monnaie est visible, mais la profondeur économique est surtout découverte dans les boutons d'interaction.

Ces constats viennent du code, sans capture ni validation de rendu navigateur.

## Cahier d'application pour la refonte

1. Mettre le quartier au premier plan ; réduire l'écran d'entrée à l'apparence du personnage et une décision de départ réelle.
2. Garder monnaie, heure et besoins dans des groupes compacts et stables ; réserver le centre aux mouvements et à la prochaine interaction.
3. Fournir un repérage local fondé sur les positions réelles des lieux implémentés, avec distinction entre destination locale et répertoire national.
4. Afficher une fiche contextuelle du lieu sélectionné avec titre fonctionnel, état réel, coûts, capacités et résultat attendu.
5. Montrer un objectif immédiat et sa progression réelle ; ouvrir les informations secondaires à la demande.
6. Vérifier les valeurs longues, les contrastes, les zones tactiles d'au moins 44 px et les changements de sauvegarde, pause et orientation dans le navigateur dès que l'environnement le permet.

Ce cahier utilise également les skills locaux `frontend-design`, `threejs-game-ui-designer` et sa référence `ui-patterns.md`, lus pendant cette recherche. Aucun asset, code, texte de scénario ou identité graphique propriétaire de Townsmen n'est réutilisé. La refonte doit être une interface de simulation de vie togolaise, pas une imitation médiévale.
