# Validation intermédiaire vérifiée — CI8

Date : 10 octobre 2026. [Run GitHub Actions 38023920158](https://github.com/Louistatch/louis/actions/runs/38023920158). Code source validé : `b1db3bbb75741522642dfc963b8d98eddfe371a4` ; SHA d’exécution du rapport principal : `c275bd113bf84ffc4f35bfd9807e3740177ac5dd`. Les corrections CSS/ombres préparées après ce lot ne sont **pas** validées par ces résultats.

Rapports JSON effectivement lus : `qa-ui-8/full/browser-results.json`, `public-preview.json`, `live-chromium.json`, `motion/motion-results.json`, et `qa-ui-8/mobile/mobile-probe.json`, sous `/workspace/research/`. Captures PC du probe, quatre captures HTTPS `live-chromium-*` et trois captures mobiles réellement inspectées avec `view_image`. Aucun visuel conceptuel n’est utilisé comme preuve.

## Résultats et portée

| Validation | Résultat constaté | Portée exacte |
|---|---|---|
| Parcours complet Chromium | **37 assertions réussies**, zéro erreur JS rapportée | Monofichier réel via `file://`, personnalisations, marche/course/arrêt, achat 1 400 F, trajet physique et dépôt au kiosque, ventes, façade bloquante, PNJ, pause, reprise apparence/commerce, partage, contrôles mobiles et paysage. Aucun hook de mutation de position utilisé. |
| Probe tactile indépendant | **19 assertions réussies**, pas 20 | Viewports 390×844 et 844×390, DPR 1,5, CDP touch ; commandes visibles dans viewport, cibles ≥48 px, joystick et caméra, annulation, absence de débordement horizontal. Le JSON contient exactement 19 checks. |
| Aperçu public HTTPS | **Pass**, quatre captures réelles et zéro erreur rapportée | [togo-life-preview.vercel.app](https://togo-life-preview.vercel.app), accueil, entrée monde, vue quartier et commerce. Cela complète la validation monofichier ; ce probe HTTPS ne rejoue pas les 37 assertions économiques. |
| Identité du fichier public | **HTTP 200**, MIME HTML, **1 874 536 octets**, hash exact | SHA-256 `52cb89c1cc2d7c0e82ba326f38f2cd91c15c1fe73239a686dba8759f283f09ab`, identique au build attendu. Les deux miroirs githack testés retournent 403. |
| Séquence locomotion | **Partial**, vidéo et frames réelles | Les inputs walk/run/turn/stop sont présents, mais animations observées seulement Idle et Walk. La frame input run est Idle. Aucune frame Run : ne pas dire que la vidéo valide une séquence complète. |
| Firefox | **Échec WebGL** | Document neutre rendu, puis jeu 3D indisponible. Un job continue-on-error ne transforme pas ce résultat en réussite Firefox. |

`public-preview.json` indique `browserValidated:false` parce qu’il documente le contrôle HTTP/hash, pas un navigateur. Le succès navigateur public provient séparément de `live-chromium.json`. Le hash identique relie la preuve publique au fichier validé, sans transformer les deux procédures en un unique test.

Le tactile indépendant mesure un déplacement réel de **2,3756 m**, un arrêt Idle après touchCancel et une variation de yaw de **0,42 rad** après glissement. Cela valide les handlers et leur effet sur le monde émulé. Aucun téléphone Android physique n’a été testé.

La vidéo motion utilise des captures du jeu et des durées monotoniques pour un encodage VFR, sans interpolation de fluidité. Sa durée consignée est **28,887 s** ; les cinq frames ne prouvent pas des animations professionnelles en continu. Le check `run state` des 37 assertions réussit séparément : le défaut de couverture vidéo ne doit ni effacer ce check ni être caché.

## Performance réellement mesurée

| Échantillon | FPS moyens | Intervalle image moyen |
|---|---:|---:|
| Parcours PC complet, actif | 3,90 | 256,13 ms |
| Viewport mobile du parcours complet | 5,37 | 186,37 ms |
| Probe mobile indépendant, actif | 5,59 | 178,78 ms |
| HTTPS, état actif | 4,24 | 236,02 ms |

Méthode : moyenne glissante jusqu’à 180 intervalles requestAnimationFrame actifs, `0 < dt < 2 s`, rendu logiciel headless sur runner CI. Le FPS zéro dans l’état final du probe HTTPS correspond au panneau ouvert, pas à une mesure de gameplay actif. Ces valeurs sont faibles et interdisent d’annoncer les cibles PC60/Android30 atteintes. Elles ne prédisent pas directement une machine avec GPU matériel ou un Android réel.

Le rapport complet consigne 52 draw calls, 89 258 triangles, 27 géométries et 23 textures. Ce sont des compteurs instantanés ; pas une démonstration d’absence de fuite mémoire. Chargement complet offline mesuré 3,578 s ; accueil HTTPS 3,627 s, dans leurs procédures respectives. Aucun percentile, réseau mobile ou budget de téléchargement n’a été validé.

## Jugement des pixels

L’accueil PC et portrait mobile montre l’avatar continu, le formulaire et le CTA entier sans débordement visible. Les boutons tactiles, joystick et course sont distincts du dock. Le commerce non ouvert affiche d’abord le coût 9 000 F et « Repérer mon comptoir », avec paramètres non actifs masqués. Le joueur est identifiable en vue élevée grâce au repère VOUS. Les captures actuelles ne montrent plus le chevauchement initial joueur/PNJ au spawn.

Défauts observés : le texte Menu dépasse le fond du dock en paysage ; le contexte recouvre la zone des pieds du joueur dans cette orientation, où le cumul HUD/objectif/plan laisse une fenêtre de jeu étroite. Une notification temporaire occupe une grande surface en portrait. Les ombres présentent des marches, bandes et carrés visibles au sol et sur les vêtements. Visage, matières textiles et bâtiments restent simples ; la qualité visuelle n’est pas celle d’un simulateur commercial fini. Les corrections de dock/ombres annoncées doivent être jugées sur les **nouvelles** captures et checks, pas créditées à ce lot.

## Évaluation critique des dix critères

Notes de revue, datées du 10 octobre 2026, basées sur preuves ci-dessus et fonctionnalités implémentées. Ce ne sont ni des scores joueurs, ni un benchmark joué contre Lagos Life. Les références séparées sont [Townsmen 5](TOWNSMEN_INTERFACE_RESEARCH.md), [interface Lagos Life](LAGOS_INTERFACE_RESEARCH.md) et [recherche produit Lagos Life](LAGOS_LIFE_RESEARCH.md) ; aucune audience, rétention ou supériorité concurrentielle n’est déduite de captures.

| Critère demandé | /10 | Justification observable |
|---|---:|---|
| Immédiatement captivant | 6 | Entrée sans compte, aperçu et objectif proche, quartier réel visible ; rythme/engagement joueurs non mesurés, FPS logiciel faible. |
| Reconnaissance du Togo | 4 | Drapeau, Lomé, taxis, motos et marché ; quartier fictif stylisé, enseignes génériques, aucun relevé géographique ou validation culturelle terrain. |
| Personnage convaincant | 6 | Corps continu et vêtement lisible, personnalisation persistée ; visage et matières sommaires, diversité limitée. |
| Animations professionnelles | 3 | Idle/Walk/Run et arrêt vérifiés par état et déplacement ; vidéo partielle sans Run, aucune validation experte des appuis/IK ou fluidité matérielle. |
| Monde vivant | 6 | PNJ marchent et atteignent destinations, taxis circulent ; évitement doux, routines simplifiées, faible densité et social limité. |
| Profondeur du gameplay | 5 | Achat/transport/stock/prix/demande/coûts réels, sauvegarde et logement ; un quartier et peu de métiers, pas de système national ou carrière riche. |
| Expérience racontable à un ami | 5 | Achat puis livraison de stock et premières ventes constituent un récit simple ; pas de preuve d’émergence sociale ou de retours joueurs spontanés. |
| Mérite d’être partagé | 5 | Carte de résultats sans prénom et rendu réel présentable ; intérêt du partage et conversion non testés, visuel encore limité. |
| Évolution commerciale possible | 5 | Modules communs et activité sans API payante ; performance matérielle, contenu, rétention, backend/multijoueur et économie commerciale non validés. |
| Supérieur au prototype précédent | 8 | Comparaison inspectée : avatar segmenté remplacé, mini-plan et vue quartier, commerce structuré, tactile et trajet économique testés. Progrès démontré sur ces aspects ; pas une mesure exhaustive de toutes versions historiques. |

## Statut de livraison intermédiaire

Tranche jouable solo vérifiée sur Chromium : **oui**, avec preuve HTTP publique et parcours métier complet du monofichier. Simulateur commercial prêt : **non**. Multijoueur, autres villes jouables, Android physique, compatibilité 3D Firefox et objectifs de performance : **non validés ou non livrés**. La prochaine validation doit conserver ces preuves historiques, rattacher les nouveaux résultats au nouveau SHA et confirmer les corrections visuelles sans reprendre les anciens scores comme un résultat final.
