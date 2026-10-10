# Livraison : marché autonome de Lomé

10 octobre 2026. [Jouer à TOGO LIFE](https://togo-life-preview.vercel.app). Cette tranche solo ajoute une boucle économique au quartier et au personnage de la refonte existante ; elle ne constitue pas encore un lancement commercial terminé.

## Version et vérifications

Source finale `39daf3befc4fdce95134c1c197d8e591fb412da8`, [run CI6 terminé avec succès](https://github.com/Louistatch/louis/actions/runs/38050314316), Chromium 151.0.7922.34, Playwright 1.62.0 et Node v24.21.0. Build statique de 26 fichiers (1 602 842 octets) ; monofichier de **1 949 021 octets**, SHA-256 **`998faadb1a53f2780df6f7bc2dbcc96f81a66cce49ed0c79dea8a9780f2abaea`**. L'aperçu dédié est READY ; le parcours sur le vrai lien HTTPS est terminé sans erreur navigateur ou console. Les commits de documentation suivants ne changent pas ce build.

| Vérification | Résultat vérifié | Preuve brute |
|---|---|---|
| Logique, économie, migration et rendu des identités | **90/90 PASS** | [Extrait exact des logs](evidence/autonomous-market/ci6-node-log-excerpt.md) |
| Parcours général PC et viewport mobile | **39/39 PASS** | [Rapport](evidence/autonomous-market/ci6-browser-results.json) |
| Vrais événements tactiles Chromium, portrait/paysage | **25/25 PASS** | [Rapport](evidence/autonomous-market/ci6-mobile-probe.json) |
| Marché autonome hors connexion | **70/70 PASS**, 199,56 s | [Rapport](evidence/autonomous-market/ci6-society-results.json) |
| Même parcours sur HTTPS public | **70/70 PASS**, 198,20 s | [Rapport](evidence/autonomous-market/ci6-society-live-results.json) |
| Audit raster et inspection des captures finales | **9/9 PASS**, pixels originaux conservés | [Scripts réellement exécutés](evidence/autonomous-market/ci6-skills-execution.md) |
| Matériel Android / PC GPU, objectifs 30/60 FPS | **NON VALIDÉS** | Aucun appareil physique disponible |

La régression observe un vrai client : **Yawa**, arrivée au point `(-13,25)`, paie 450 F ; son portefeuille passe de 3 000 à 2 550 F, celui du joueur de 4 600 à 5 050 F et le stock de quatre à trois. Le reçu utilise un coût de 350 F dans ce parcours sans négociation. L'attente de 65,36 secondes explique pourquoi l'ancien timeout de 60 secondes était insuffisant : les clients sont autonomes et doivent parcourir leur route.

Le parcours autonome négocie deux lots de quatre et huit produits à **315 F**, soit **3 780 F** réellement transférés à Ama. L'investissement de 9 000 F laisse 2 220 F. **Koffi** arrive au comptoir et paie **450 F** depuis son portefeuille, qui passe de 1 400 à 950 F. Le joueur a alors **2 670 F**, onze produits et un bénéfice marchandises de **135 F** après coût vendu de 315 F. À **1 100 F**, Abla refuse puis paie **600 F** au concurrent : cela ne crédite pas le joueur. Après sauvegarde/reprise, le commerce, le stock, les relations, la confiance d'Ama à 41 et les souvenirs du prix refusé sont identiques. Les reçus bruts conservent les positions, portefeuilles et stocks avant/après.

Le freinage PC mesuré laisse environ **0,245 m** de déplacement, puis moins de **0,0002 m** de dérive sur trois vrais RAF. Le probe tactile mesure **2,434 m** de marche et une variation absolue de caméra de **0,42 rad**. Les cartes restent attachées et identiques sur quatre RAF pendant **732,6 ms**. Après défilement, la croix mesure **48×48 px** ; le toucher à ses coordonnées observées ferme effectivement le dialogue, sans auto-défilement du bouton par Playwright.

## Mesures de performance

| Mesure | Résultat | Méthode / portée |
|---|---:|---|
| PC du parcours général | **3,94 FPS**, 253,50 ms/image | Moyenne glissante de RAF actifs, viewport desktop, SwiftShader |
| Viewport mobile du même parcours | **6,10 FPS**, 163,80 ms/image | Émulation Chromium, aucun téléphone physique |
| Probe tactile indépendant | **7,37 FPS**, 135,64 ms/image | Dix secondes actives après fermeture du dialogue, 390×844 CSS, DPR1,5, SwiftShader |
| Soumissions / triangles desktop | **52 / 89 258** | Snapshot renderer.info ; 27 géométries et 23 textures |
| Soumissions / triangles tactiles | **43 / 80 626** | Snapshot renderer.info ; angle différent |
| Navigation offline vers aperçu animé mobile | **3,233 s** | Depuis file:// sur le runner ; pas un téléchargement sur réseau Android |
| Domaine économique seul, CPU Node | **0,002565 ms/step médiane**, p95 **0,005433 ms/step** | 40 échantillons de 1 000 pas à 4 Hz, après 1 000 pas de chauffe ; [rapport brut](evidence/autonomous-market/ci6-society-profile.json) |

Ces échantillons ne certifient pas la fluidité commerciale. Les variations entre runs ne prouvent pas un gain du cache DOM : angles, phases, instrumentation et charge du runner diffèrent. Les FPS dans un menu suspendu ne sont pas un benchmark. Les timings CPU/GPU de rendu et une session longue de mémoire restent absents. Le benchmark Node exclut sauvegarde, UI et rendu ; il ne prédit pas les FPS.

## Captures et défauts corrigés

La [galerie des neuf captures réelles](captures/autonomous-market/README.md) et son [manifest de provenance](captures/autonomous-market/manifest.json) identifient chaque PNG par dimensions, hash et chemin dans l'artefact final `11669755000` (ZIP SHA-256 `0ea7d7a2433c96d63a11594bd2e85487175dacf2761f1f0bcd9c7a504bac35f6`). Aucun pixel original n'a été retouché. Les cinq scènes économiques proviennent du parcours HTTPS ; les quatre scènes mobiles de Chromium avec vrais événements tactiles, sans appareil Android physique.

Les échecs sont conservés : CI3 avait un arrêt évalué trop tôt ; CI4 valide le freinage puis est annulé avant le bilan complet ; CI5 échoue sur une attente client de 60 secondes et sur des cartes remplacées pendant le défilement tactile. Le freinage est vérifié jusqu'à l'arrêt, l'attente reste bornée mais permet l'arrivée réelle, et les listes DOM ne sont remplacées que lorsque leur contenu change. CI6 rejoue les parcours et passe intégralement. [CI3](evidence/autonomous-market/ci3-browser-results.json), [CI4](evidence/autonomous-market/ci4-browser-results.json), [CI5 général](evidence/autonomous-market/ci5-browser-results.json) et [CI5 tactile](evidence/autonomous-market/ci5-mobile-probe.json) restent examinables. L'en-tête sticky conserve une légère transparence à polir.

Le navigateur local est bloqué par la politique de sockets ; les vrais parcours Chromium ont donc été exécutés sur GitHub Actions. Le [probe HTTP](evidence/autonomous-market/ci6-public-preview.json) confirme HTTP 200, taille et SHA exacts. Son indicateur `browserValidated:false` décrit ce probe seul ; la validation navigateur HTTPS distincte est bien terminée. Les miroirs githack répondant 403 ne sont pas utilisés comme lien de jeu.

## Boucle effectivement implémentée

Ama conserve une caisse, un stock et une confiance finis. Une offre trop basse diminue sa confiance ; une contre-offre réserve un lot avec une expiration. Le joueur achète sur place, transporte les produits dans son sac limité, investit au comptoir, dépose les marchandises et fixe son prix. Une vente exige l'arrivée physique d'un client, son paiement intégral et une unité disponible. Le coût d'achat réel suit chaque transfert ; les dépenses, recettes, coût vendu, bénéfice marchandises et trésorerie restent distincts.

Sept clients ont des besoins, emplois, domiciles, portefeuilles, plafonds de prix et préférences différents. Un arbre de comportement réactif et des scores d'utilité déterminent les courses, le travail, le repos et les destinations. Le rendu affiche ces mêmes identités, sans deuxième simulation d'achats. Les décisions et refus persistent après reprise.

La simulation avance à 4 Hz, indépendamment de Three.js. Les chemins du graphe sont pré-calculés ; seuls les mouvements sont interpolés à l'affichage. Aucun LLM, abonnement, clé API ou service payant n'est requis pour jouer.

La sauvegarde conserve la clé historique, migre v2 vers v3 et protège le précédent état valide avec un secours local. Les versions futures et les données incohérentes sont rejetées sans mutation partielle. Les tests couvrent notamment les quotas, exceptions de stockage, migrations, routes en cours, horloge, coûts pondérés et refus négociés.

## Limites et travaux restants

- **Matériel physique non validé** : 30 FPS Android, 60 FPS PC/GPU, temps de chargement réseau sur connexion mobile, chauffe, autonomie et mémoire sur session longue. SwiftShader et l'émulation tactile ne certifient pas ces objectifs.
- **Animation et graphismes** : glTF articulé original et clips Idle/Walk/Run conservés ; finition des visages/textiles, appuis/IK et séquences animées à vitesse réelle restent à améliorer. Aucun mocap ou nouveau travail Blender n'est revendiqué.
- **Monde** : quartier artistique stylisé de Lomé, sans relevé OSM des rues et bâtiments. Huit identités prédéfinies ; pas d'évitement robuste des foules ou du trafic. L'annuaire national ne représente pas quarante destinations jouables. Deuxième environnement et validation culturelle restent à réaliser.
- **Simulation** : une marchandise, concurrent au tarif fixe, fournisseurs et salaires bornés. Santé, sécurité, crédit, fermetures commerciales, repricing concurrent, transport payant, chaînes agricoles et carrière approfondie restent absents.
- **Produit** : test utilisateurs de l'accueil, lisibilité et envie de revenir ; événements et progression plus variée ; enrichissement des cartes de partage. Aucun taux de rétention ou partage spontané n'a été mesuré.
- **Services** : solo local ; aucun multijoueur, compte serveur ou backend économique autoritaire. La séparation du domaine prépare une extension mais ne la rend pas opérationnelle.

## Préservation et traçabilité

La branche dédiée part de la refonte `feat/togo-life-interface-jeu` et ne fusionne pas automatiquement sur `main`. BAD/Bryq, les documents racine et le dossier indépendant `togo-life-3d-preview/` sont préservés. L'hébergement utilise uniquement le projet statique isolé `togo-life-preview`, avec les fichiers de secours historiques du jeu.

[Architecture et migrations](AUTONOMOUS_MARKET_ARCHITECTURE.md), [registre des skills](SKILLS_EXECUTION_REPORT.md), [provenance des sept installations](AUTONOMOUS_MARKET_SKILLS_AUDIT.md), [protocole des vrais parcours](AUTONOMOUS_MARKET_QA_PROTOCOL.md) et [évaluation critique](AUTONOMOUS_MARKET_CRITICAL_REVIEW.md) rendent les choix et limites examinables.
