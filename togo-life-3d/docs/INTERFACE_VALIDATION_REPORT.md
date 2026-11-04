# Validation réelle de TOGO LIFE — 10 octobre 2026

[Jouer](https://togo-life-preview.vercel.app) · [Captures réelles](captures/README.md) · [Preuves brutes](evidence/2026-10-10/README.md)

La tranche solo est jouable et vérifiée sur Chromium. Les objectifs de performance matérielle et la qualité d’un simulateur commercial fini restent non validés.

## Versions et procédures

Dernier parcours complet : [CI11, run 38025435352](https://github.com/Louistatch/louis/actions/runs/38025435352), source `27d22e9bc55217f1c3e533dc76f0b47c4b167b60`. Première validation des corrections visuelles finales : [CI9, run 38024690133](https://github.com/Louistatch/louis/actions/runs/38024690133), source `6740be8f053944bf027c4497c96786e13d0dc762`. Le contenu du jeu est identique ; seules les procédures QA ont changé ensuite.

Monofichier public : **1 876 887 octets**, SHA-256 `6f97f6457696e37ad504ab4c0a24cd79f59744175379ea810594ac8262d1cfbe`. HTTP en CI11 confirme ce hash ; Chromium HTTPS rend réellement ce fichier et entre dans le jeu.

Environnement : Ubuntu GitHub Actions, Playwright Python 1.62.0, Chromium 151.0.7922.34, ANGLE/Vulkan **SwiftShader logiciel**, sans GPU matériel ni téléphone physique. Inputs clavier/boutons/touch CDP réels, diagnostics en lecture seule. Aucun setter de position ni téléportation ne remplace le trajet économique.

## Résultats fonctionnels

| Vérification | Résultat | Preuve et portée |
|---|---|---|
| Logique Node | **31 tests réussis** | Étape Logic tests and static build, CI9 et CI11 : économie, collisions, skin, carte et UI. |
| Parcours Chromium | **37 assertions**, zéro erreur JS rapportée | [JSON CI11](evidence/2026-10-10/ci11/browser-results.json) : personnalisation, marche/course/arrêt, caméra, PNJ, façade bloquante, achat/transport/dépôt/ventes, pause, reprise et partage. |
| Tactile indépendant | **21 assertions** | [JSON CI11](evidence/2026-10-10/ci11/mobile-probe.json) : 390×844 et 844×390, cibles ≥48 px, boutons/labels dans dock, absence de débordement, joystick, touchCancel et caméra. |
| Aperçu HTTPS | **Pass**, quatre captures, aucune erreur rapportée | [JSON CI11](evidence/2026-10-10/ci11/live-chromium.json) : accueil, monde, quartier, commerce. Ce probe ne rejoue pas les 37 assertions économiques. |
| Identité du build public | **HTTP 200**, HTML, hash exact | [JSON CI11](evidence/2026-10-10/ci11/public-preview.json). Miroirs githack 403 ; lien livré Vercel. |
| Inspector original QA | **Canvas non vide**, zéro erreur console/page | [Audit CI9](https://github.com/Louistatch/louis/actions/runs/38024687518), [JSON](evidence/2026-10-10/original-inspector.json), [PNG](captures/2026-10-10/onboarding-inspector.png). Capture d’accueil, pas validation du gameplay actif. |
| Checker original director | **Quatre artifacts reconnus** | [Sortie originale](evidence/2026-10-10/director-check.txt) : présence des preuves, pas score graphique premium. |
| Firefox | **Échec WebGL en CI** | Un job tolérant cet échec n’est pas une validation Firefox ; autres environnements à tester. |

Trajet constaté : achat de quatre produits pour 1 400 F, déplacement physique jusqu’au comptoir, investissement 9 000 F, dépôt et vente à 550 F. État final CI11 : **5 150 F, trois produits en stock, une vente**. Prix/demandes différents également testés en logique. Transactions éloignées refusées ; rechargement conservant apparence/commerce.

Le probe tactile observe déplacement, arrêt après annulation et **0,42 rad** de rotation caméra après glissement dans le monde. Ces handlers fonctionnent en émulation ; aucun Android physique n’est certifié.

## Locomotion enregistrée

[Motion fonctionnelle CI9](evidence/2026-10-10/motion-results.json) observe Walk, Run, demi-tour, arrêt Idle et déplacements réels. Sa vidéo de quatre screenshots n’est pas présentée comme preuve de fluidité.

[Motion CDP CI11, run 38025435266](https://github.com/Louistatch/louis/actions/runs/38025435266) : **24 JPEG réels sur 13,082 s**, directement reçus de Page.screencastFrame et encodés en [WebM VFR](evidence/2026-10-10/actual-compositor-motion.webm). [Rapport original](evidence/2026-10-10/screencast-results.json). Deux images de réchauffement avant idle/walk/run/turn/stop : 5/4/4/5/4 images dans les fenêtres respectives, états attendus observés séparément, zéro erreur. L’essai CI10 était partiel faute d’images dans les premières phases ; il n’est pas compté comme réussite.

**Limite essentielle :** diagnostics et JPEG présenté ne sont pas synchronisés. Inspection réelle des images 0000, 0007, 0008, 0012, 0014, 0016, 0019 et 0023 : PNJ/taxis se déplacent, puis joueur en pose articulée et décor déplacé ; plusieurs images reçues pendant walk/run montrent encore une pose proche d’Idle, et une image reçue pendant stop montre une pose de déplacement. Les labels d’inputs ne prouvent pas cinq poses correspondantes. PASS concerne la couverture du flux et les états indépendants. **1,76 image reçue/s**, écart maximal **1,492 s** : aucune fluidité professionnelle déduite, aucun remplacement du FPS RAF, aucune interpolation ou image synthétique.

## Performance mesurée

| Échantillon actif | FPS | Intervalle moyen |
|---|---:|---:|
| CI11 parcours PC | 6,04 | 165,55 ms |
| CI11 mobile du parcours | 10,42 | 95,93 ms |
| CI11 mobile indépendant après 10 s | 10,49 | 95,37 ms |
| CI11 HTTPS, échantillon court | 7,19 | 139,13 ms |
| CI9 parcours PC, même contenu | 4,16 | 240,64 ms |
| CI9 mobile indépendant, même contenu | 6,25 | 159,99 ms |

Moyenne glissante de jusqu’à 180 intervalles RAF actifs, 0 < dt < 2 s. Variations entre runs **non attribuées à une optimisation** : même contenu, charge du runner/échantillons variables. Panneaux ouverts exclus. Cibles PC60/Android30 non validées.

[Profils CI9](evidence/2026-10-10/performance-profiles.json) : vrais boutons de qualité, caméra/joueur fixes, dix secondes actives par profil.

| Profil | Framebuffer | FPS | Intervalle | Calls / triangles / textures |
|---|---|---:|---:|---|
| Équilibré | 1280×800 | 4,62 | 216,30 ms | 58 / 89 752 / 18 |
| Économe | 960×600 | 3,82 | 261,83 ms | 51 / 89 256 / 17 |
| Élevé | 1440×900 | 3,83 | 261,10 ms | 51 / 89 256 / 18 |

Ces échantillons séquentiels avec PNJ évoluant ne prouvent pas un classement ni un gain du mode économe. Le [nouvel analyseur performance-optimization](evidence/2026-10-10/budget-review.json) vérifie les compteurs connus sous 150 calls/300 000 triangles/40 textures. Goulot CPU/GPU **inconnu**, timings séparés absents. Champs budget nuls de l’inspector original non comptés comme mesures.

Parcours CI11 : 52 calls, 89 258 triangles, 27 géométries, 23 textures, compteurs instantanés sans validation de fuite mémoire longue. Chargement dans les procédures CI11 : offline 0,773 s, accueil HTTPS 0,986 s ; aucun percentile ni réseau cellulaire validé.

## Revue des pixels

[Six PNG natifs CI9](captures/README.md), même contenu que CI11/public, réellement inspectés, sans retouche ni concept. Dock paysage corrigé : quatre boutons/labels contenus, action à droite libérant les pieds. Les 21 checks tactiles vérifient ces limites. Ombres proches améliorées par cadrage suivant le joueur ; accueil glTF personnalisable, coût 9 000 F clair, repère VOUS en vue élevée.

Restent visibles : HUD portrait dense en haut, grande notification temporaire, ombres crénelées à 512 px, visages/textiles et bâtiments simples. Identité togolaise surtout noms/drapeau/marché/motos/taxis, sans reconstitution cartographique ni revue culturelle terrain. Appuis/IK et fluidité sur matériel restent à travailler.

## Évaluation critique

Notes éditoriales, pas scores joueurs ni benchmark joué contre Lagos Life. Références : [Townsmen 5](TOWNSMEN_INTERFACE_RESEARCH.md), [interface Lagos Life](LAGOS_INTERFACE_RESEARCH.md), [recherche produit](LAGOS_LIFE_RESEARCH.md).

| Critère | /10 | Preuve / limite |
|---|---:|---|
| Immédiatement captivant | 6 | Avatar rapide, objectif proche, monde sans compte ; engagement non mesuré, FPS CI faible. |
| Reconnaissance du Togo | 4 | Noms, drapeau, taxis/motos/marché ; quartier fictif, enseignes génériques, pas de terrain réel. |
| Personnage convaincant | 6 | Skin continu, 22 os, personnalisation persistée ; face/matières/diversité limitées. |
| Animations professionnelles | 4 | États/déplacements et poses articulées observés ; image/état retardés, absence d’IK/mocap ou validation fluide matérielle. |
| Monde vivant | 6 | Huit PNJ, destinations, taxis observés ; routines/évitement/social simples. |
| Profondeur du gameplay | 5 | Stock, transport, prix/demande/coûts, sauvegarde ; un quartier, peu de métiers. |
| Expérience racontable | 5 | Chaîne achat/livraison/vente ; pas de preuve d’émergence sociale ou retours spontanés. |
| Mérite d’être partagé | 5 | Carte sans prénom, jeu réel capturé ; conversion/attrait non mesurés. |
| Évolution commerciale | 5 | Modules sans API payante ; contenu, performances, rétention/backend à développer. |
| Amélioration du prototype | 8 | Skin continu, carte/vue quartier, commerce structuré, parcours/tactile vérifiés ; pas comparaison exhaustive historique. |

## Livraison et reste à développer

Livré : tranche solo Lomé stylisée, avatar articulé, caméra, collisions cinématiques, PNJ, trafic simplifié, marché/comptoir/logement, sauvegarde, clavier/tactile, aperçu HTTPS, captures/vidéo et skills installés. Branche dédiée/PR ; aucun fichier BAD/Bryq modifié par cette refonte, aucune fusion automatique.

Restent : Android physique/GPU PC, profiling CPU/GPU/thermique et longue session/mémoire, Firefox, appuis/IK et finition humaine/architecture, navigation/collisions PNJ/traffic robuste, dialogues branchés, métiers/carrière/véhicules possédés, géographie administrative actuelle/OSM, deuxième ville distincte, chargement progressif des villes, backend/multijoueur/événements. L’annuaire de 40 entrées ne représente pas 40 scènes jouables. Rapier non installé. Le nouveau pack AI/procgen/dialogue est installé et utilisé en audit ; ces fonctionnalités n’ont pas été ajoutées au runtime.

[CI8 historique](INTERFACE_VALIDATION_CI8.md) conserve les défauts avant correction. [Registre des skills](SKILLS_EXECUTION_REPORT.md) : installations, applications, scripts exécutés et limites.
