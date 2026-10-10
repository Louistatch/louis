# Revue critique du marché autonome — 10 octobre 2026

La première boucle économique demandée est réellement jouable : négocier, acheter, transporter, ouvrir un comptoir, déposer le stock, fixer un prix, recevoir un client et conserver une réaction à ce prix après rechargement. Cette tranche constitue une amélioration vérifiable du jeu existant. Elle n’atteint pas encore la finition visuelle, la fluidité matérielle ou la diversité de contenu d’un simulateur commercial terminé.

## Périmètre de l’observation

Cette revue est fondée sur les cinq PNG réels et les rapports du [run marché CI3](https://github.com/Louistatch/louis/actions/runs/38029106766), source `f5d80c1dbb0ce31900c575b73df0bea0611f2bea`, puis sur quatre PNG HTTPS ouverts dans le [run CI5](https://github.com/Louistatch/louis/actions/runs/38049623991), source `01a79b84c7139c1e81e835d02942327a0ca4354a`. Les images ont été examinées depuis `/tmp/togo-market-ci3/society-live/` et `/tmp/togo-market-ci5/society-live/` ; aucune image générée ou retouchée ne sert de preuve. Le moteur, les vues et la sauvegarde ont également été relus dans `src/`.

Le [parcours économique HTTPS CI3](evidence/autonomous-market/ci3-society-live-results.json) réussit **66 assertions sur 66**, sans erreur JavaScript rapportée, sur Chromium 151.0.7922.34, à 1 440 × 900 pixels. Il utilise le clavier, les boutons normaux et les diagnostics en lecture seule. Le fichier public testé fait 1 947 762 octets, SHA-256 `ef3e140b594218f253adebcc959c11fd902d6bf5b5a2a8523dfaba4f02eb1cc8`.

Ce succès ne doit pas masquer le [parcours général offline CI3](evidence/autonomous-market/ci3-browser-results.json) : **14 des 15 premières assertions réussissent, puis l’arrêt progressif mesuré après 500 ms échoue**. Le script s’arrête là ; ses vérifications ultérieures ne sont pas comptées comme réussies. Ce rapport ne prouve pas un défaut permanent de déplacement, mais exige une reprise de la vérification temporelle avant de déclarer la régression générale entièrement verte.

Reprise effectivement vérifiée ensuite : le [rapport général CI4](evidence/autonomous-market/ci4-browser-results.json), source `ea764f5fc14c5aad48e1d15d1b5cd54a45bd7cd4`, réussit **38 assertions sur 38**, sans erreur rapportée. Après relâchement, le joueur parcourt encore **0,24525 m**, atteint Idle, puis dérive seulement de **0,00014 m** sur les trois images RAF observées. La validation attend et observe l’arrêt réel. Le run global CI4 a été annulé pour lancer le nouveau correctif d’en-tête et son parcours QA ; cette annulation ne transforme pas son rapport de régression réussi en échec, mais le workflow entier n’est pas annoncé comme réussi.

CI5 confirme le scénario économique et la correction visuelle sur desktop : [offline **70/70 PASS**](evidence/autonomous-market/ci5-society-results.json) et [HTTPS **70/70 PASS**](evidence/autonomous-market/ci5-society-live-results.json), sans erreurs JavaScript rapportées. Le [fichier public vérifié](evidence/autonomous-market/ci5-public-preview.json) fait **1 948 461 octets**, SHA-256 `d7cd43a23c6c2d68fe495875f1c1fcc707e6685f33a1111be7d7798d88bb5571`, identique au build offline.

Deux échecs CI5 restent explicites : le [parcours général](evidence/autonomous-market/ci5-browser-results.json) réussit 21 assertions puis s’arrête sur un timeout de 60 s ; le [probe mobile](evidence/autonomous-market/ci5-mobile-probe.json) réussit 12 assertions puis échoue au défilement avec **« Element is not attached to the DOM »**. Ces parcours incomplets ne sont pas des validations complètes. Le problème mobile révèle un remplacement de nœuds d’interface pendant l’interaction ; à l’issue de CI5, une correction de stabilité des listes était en préparation pour CI6, où elle est désormais vérifiée. Les succès économiques ne couvrent pas cet échec tactile.

Le rendu est logiciel **ANGLE/Vulkan SwiftShader**. Le parcours économique CI3 dure 201,618 secondes. Des snapshots actifs rapportent environ 2,33 FPS lors de la première vente, 2,62 FPS lors de l’achat concurrent et 3,55 FPS après reprise. Le parcours HTTPS CI5 dure 145,799 secondes, avec des snapshots correspondants à **2,95**, **3,54** et **4,41 FPS**. Ce sont des échantillons du runner logiciel, pas un benchmark d’appareil réel ni une preuve de gain attribuable à une optimisation. Aucun Android physique ni PC à 60 FPS n’est validé par ces preuves. Les fenêtres de dialogue suspendent normalement le jeu : leur FPS nul ne mesure pas la fluidité active.

Les notes ci-dessous sont un jugement éditorial sur cette version observée. Aucun panel utilisateur, taux de retour, partage spontané ou test comparatif joué contre Lagos Life n’a été réalisé. Les études de [Lagos Life](LAGOS_INTERFACE_RESEARCH.md) et [Townsmen 5](TOWNSMEN_INTERFACE_RESEARCH.md) servent de références documentaires ; elles ne permettent pas de revendiquer une supériorité commerciale sur ces jeux.

## Reprise des contrôles tactiles et généraux — CI6

[CI6](https://github.com/Louistatch/louis/actions/runs/38050314316), source `39daf3befc4fdce95134c1c197d8e591fb412da8`, apporte **39/39 assertions générales PASS** et **25/25 assertions tactiles PASS**. Les [rapports bruts](evidence/autonomous-market/ci6-mobile-probe.json) identifient le monofichier `998faadb1a53f2780df6f7bc2dbcc96f81a66cce49ed0c79dea8a9780f2abaea`. La reconstruction périodique des listes est corrigée dans `main.js` : mêmes nœuds conservés sur quatre RAF et 732,6 ms ; défilement puis toucher réel de la croix 48×48 fonctionnent. Le [parcours général](evidence/autonomous-market/ci6-browser-results.json) choisit 450 F sur place puis observe Yawa : client à `(-13,25)`, paiement 450 F, stock 4→3, sans vente forcée. Cette amélioration est vérifiée ; elle ne transforme pas les captures en preuve d'appuis ou de fluidité matérielle.

La [capture tactile Commerce](captures/autonomous-market/mobile-commerce.png) et le [paysage](captures/autonomous-market/mobile-landscape.png) ont été ouverts. Les cartes et les contrôles sont lisibles. Le fond translucide de l'en-tête laisse encore deviner du texte derrière le titre : finition visuelle mineure restante, sans empêcher la cible de fermeture. Mesure indépendante : **7,37 FPS SwiftShader**, aucun Android physique. CI6 est intégralement SUCCESS : **90 tests Node, 39 vérifications générales, 25 tactiles, 70 autonomes offline et 70 sur le vrai lien HTTPS**. Les neuf images finales ont été inspectées et contrôlées ; [galerie et provenance](captures/autonomous-market/README.md), [rapport de livraison](AUTONOMOUS_MARKET_VALIDATION_REPORT.md). Les notes restent inchangées ; ces contrôles ne remplacent pas un panel de joueurs. Les paragraphes CI3/CI4/CI5 ci-dessous décrivent leurs états historiques ; les blocages de défilement et de fermeture sont corrigés et vérifiés dans CI6.

## Dix critères

| Critère | /10 | Preuve observable et limite |
|---|---:|---|
| Le jeu est-il immédiatement captivant ? | **6** | L’avatar entre dans un quartier sans compte, le repère mène au marché et une contre-offre se matérialise en argent et en stock. Le dialogue explique prix unitaire, quantité et total. La lenteur du runner, les longs panneaux et l’absence d’observation de débutants empêchent de certifier une accroche immédiate. |
| Le joueur reconnaît-il réellement le Togo ? | **4** | Drapeau, Lomé, noms d’habitants, enseignes, marché, motos et taxis jaunes apportent des repères visibles. Les bâtiments et positions sont une interprétation artistique, sans données OSM ni repère urbain authentifié. Pas de revue culturelle avec des habitants du Togo ; le décor pourrait encore évoquer plusieurs villes de la région. |
| Le personnage est-il convaincant ? | **5** | La capture active montre une silhouette adulte articulée, habillée, avec un corps continu ; le glTF comporte un squelette réel et la personnalisation existe. Visage, mains, textiles et variété des silhouettes restent simples. Les huit identités économiques ne correspondent pas à huit personnages artistiquement distincts. |
| Les animations sont-elles professionnelles ? | **4** | Idle/Walk/Run, transitions et adaptation à la vitesse sont implémentés ; les habitants changent effectivement de position. CI4 valide également le freinage et l’arrêt après l’échec temporel CI3. Le rig et les clips proviennent d’une animation procédurale, sans mocap ni IK de contact. Ces cinq captures fixes ne permettent pas de juger la fluidité, les appuis ou le glissement des pieds. |
| Le monde paraît-il vivant ? | **6** | Koffi arrive réellement au comptoir, Abla rejoint un autre étal, plusieurs voisins travaillent ou rentrent avec leurs provisions ; les véhicules apparaissent dans les vues. Les décisions sont liées aux besoins, budgets et préférences et persistent. Le quartier reste peu peuplé, avec huit acteurs prédéfinis ; interactions sociales, circulation et réactions physiques sont limitées. |
| Le gameplay possède-t-il une véritable profondeur ? | **6** | Refus à 150 F, contre-offre à 315 F, achat par lot, capacité du sac, investissement 9 000 F, coûts pondérés, vente et concurrence produisent des conséquences distinctes. Le prix à 1 100 F conduit à un refus et à un achat concurrent. Une marchandise, des offres prédéfinies et un concurrent au tarif fixe limitent encore la stratégie ; crédit, chaînes agricoles, coûts de transport et entreprises concurrentes adaptatives sont absents. |
| Un joueur peut-il raconter son expérience à un ami ? | **6** | Le parcours vérifié fournit un récit concret : Ama refuse une offre, accepte un prix négocié, Koffi devient un client, puis Abla choisit le concurrent après une hausse de prix. Ce changement survit à la sauvegarde. Le récit vient ici d’un test automatisé ; aucun joueur n’a encore raconté spontanément sa partie. |
| Le jeu mérite-t-il d’être partagé ? | **5** | Les captures représentent un jeu réel et une décision compréhensible ; une carte de progrès et les chemins de téléchargement/partage existent dans le code. La carte montre surtout des compteurs, sans raconter le conflit commercial ou une scène personnelle. Le nouveau parcours ne teste ni envoi social effectif ni attrait auprès d’amis. |
| Peut-il évoluer commercialement ? | **5** | Le domaine économique est indépendant de Three.js, déterministe, testé et sérialisable ; les transactions et coûts sont explicites, sans API payante obligatoire. Une base de développement existe. La production commerciale exige encore contenu, validation matérielle, ergonomie mobile actuelle, stabilité longue durée, expérience utilisateur et politique de sauvegarde/serveur adaptée. Le stockage local reste modifiable ; aucun multijoueur ni modèle de revenus réels n’est opérationnel. |
| Le résultat améliore-t-il objectivement le prototype précédent ? | **8** | Pour cette boucle précise, la vente périodique de l’ancien `simulation.js` est remplacée par un acheteur identifié qui choisit, se déplace et paie depuis son portefeuille. Le reçu prouve position, argent et stock ; le refus et les souvenirs sont restaurés. C’est un progrès fonctionnel important. Le rendu et l’avatar sont largement ceux de la refonte précédente : cette note ne revendique pas une nouvelle qualité graphique globale ou un benchmark exhaustif avant/après. |

## Preuves économiques qui justifient les notes

- L’offre de quatre produits à 150 F ne déplace ni argent ni marchandises. La confiance d’Ama passe de **40 à 37**.
- L’offre de quatre produits à 300 F reçoit une contre-proposition de **315 F**. L’achat débite exactement **1 260 F** : le portefeuille du joueur passe de 15 000 à 13 740 F, et la caisse du fournisseur reçoit le montant correspondant.
- Le lot de huit à 315 F est accepté et débité **2 520 F**. Le joueur transporte alors douze produits, acquis pour **3 780 F**. L’ouverture à 9 000 F laisse **2 220 F** avant la première vente.
- Koffi arrive au point du comptoir `(-13, 25)`. Son achat à **450 F** ramène son portefeuille de 1 400 à 950 F ; le joueur passe de 2 220 à 2 670 F et le stock de douze à onze. Le coût vendu est **315 F**, donc le bénéfice marchandises réellement réalisé est **135 F**. Il n’est pas confondu avec les dépenses d’ouverture ou la trésorerie.
- Après le prix à **1 100 F**, Abla refuse et arrive chez le concurrent `(-15, 0)`. Elle paie **600 F**, reçoit un produit et fait baisser le stock concurrent de 48 à 47. Cet achat ne crédite pas le joueur.
- Après reprise, relations, achats, prix refusés, reçus, possession du comptoir et stock sont conservés. L’interface affiche encore « Dernier prix refusé : 1 100 F », y compris pour des voisins dont l’activité courante a changé.

## Lecture des pixels et correction prioritaire

Le dialogue de contre-offre est lisible : coût réservé, stock, confiance, place du sac et prix total sont séparés. Les achats à distance ne sont pas disponibles dans la fenêtre de gestion. La capture du comptoir montre clairement la différence entre recettes de 450 F et bénéfice de 135 F. Les fenêtres de refus et de restauration présentent les sept décisions, ce qui rend la conséquence visible hors des diagnostics.

Un défaut concret apparaît dans ces deux captures : après défilement de la longue fenêtre Commerce, **le titre, les onglets et la croix de fermeture sortent de l’écran**. La dernière carte reste visible mais le retour demande un nouveau défilement ou Échap sur PC. Aucun blocage tactile n’est établi par CI3 ; le risque ergonomique est néanmoins concret.

Correction appliquée après cette observation, uniquement dans `life.css` : en-tête de Ma vie compact et sticky, fond `var(--panel)`, titre à 18 px, fermeture conservée à **48 × 48 px**, inset de défilement de 24 px sur desktop et de 20 px jusqu’à 600 px de largeur. Les contrôles de jeu et le canvas ne sont pas déplacés. `git diff --check` et le build statique passent.

**L’effet desktop est désormais confirmé dans CI5**, sur les captures de refus et de restauration réellement ouvertes : titre « Ma vie à Lomé », nom et croix restent visibles après défilement. Les diagnostics de mise en page HTTPS donnent en-tête `y=19..84`, bouton de fermeture `y=27..75`, dimensions `48×48`, centre ciblant réellement un descendant du bouton. La première carte commence à `y=332,3125`, donc en dessous de l’en-tête. Les mêmes contrôles réussissent dans le parcours offline. Cette preuve porte sur ces états desktop ; **à l’issue de CI5, le tap mobile après défilement n’était pas encore validé**, puisque le probe échouait avant sa fin. Ce toucher est maintenant vérifié dans CI6.

Autres observations concrètes à traiter ensuite :

- Le cadre actif est proche de la façade, avec une enseigne très dominante ; les matériaux du sol, les ombres et les personnages restent visuellement simples. Une revue de plusieurs angles et de scènes animées est nécessaire avant une qualification de finition professionnelle.
- Les détails d’une carte d’habitant sont petits et la fenêtre rassemble finance et sept personnes dans une seule longue colonne. La version suivante doit valider la lecture sur écran étroit, sans réduire la taille des cibles tactiles.
- « Budget » peut mêler argent disponible et plafond acceptable par produit. CI3 montre ainsi un habitant avec 3 000 F refusant 1 100 F. **L’ajout est visible dans CI5** : Kodjo a 1 350 F mais un plafond de 450 F par produit ; Abla a 2 400 F et un plafond de 700 F ; Yawa a 2 550 F et un plafond de 1 000 F. Le plafond explique leur refus à 1 100 F sans laisser croire qu’ils n’ont pas cet argent. La lecture de ce détail sur écran étroit reste à valider.
- Le défilement tactile du panneau doit conserver ses nœuds et son accès à la fermeture. L’échec DOM détaché CI5 a justifié de stabiliser la mise à jour des listes, puis de rejouer le même parcours mobile. CI6 confirme la conservation des nœuds et le défilement réel après cette correction.
- Le HUD tronque normalement le texte long d’objectif sur deux lignes. Le journal donne la consigne complète, mais il faut observer si un nouveau joueur trouve cette information et comprend achat, ouverture et dépôt.

## Traçabilité des images inspectées

Ces hashes identifient les pixels **CI3** utilisés pour cette revue. La [galerie de livraison](captures/autonomous-market/market-counteroffer.png) peut être actualisée après un autre run ; sa révision ne doit pas être attribuée rétroactivement à CI3.

| Image CI3 | SHA-256 |
|---|---|
| `market-counteroffer.png` | `31d44ca06493fdbcae5386a70d79e4b4d38352376dbf3743fed697b0f6129b6c` |
| `autonomous-kiosk-sale.png` | `1d297dcc51164bb3f1a85af0e45dee7599403aca483fc7078bc58d6534fe3cb7` |
| `autonomous-price-refusal.png` | `2e619d87ad58322a8022ac21c0f2c15bb9e712c783297526190e054f589e1bcb` |
| `autonomous-restored-decisions.png` | `ba17e572740f9ccf067863fedde1adcf26082601d51b6e1cd677b07035de86a2` |
| `autonomous-market-active.png` | `ff7da2dd21d65ea30cd89e389cf9f00868d50bda697b996805581b95429bda26` |

Quatre images **HTTPS CI5** ont ensuite été ouvertes pour constater le correctif. La provenance reste distincte de CI3 et des futurs pixels CI6 de la galerie finale.

| Image HTTPS CI5 | SHA-256 |
|---|---|
| `market-counteroffer.png` | `2338b8cd2881da488bc1541d2cda20aaa1a934a68397928b45ce8e26d6afb9dc` |
| `autonomous-price-refusal.png` | `950fc061374239c13d26c800f94e703ce5bab73d75cce8b3765b85abfe19f5a1` |
| `autonomous-restored-decisions.png` | `35b7a54dd8b9a6ad10573619ae381f1963819acefbaa314b20e3923eff480cf4` |
| `autonomous-market-active.png` | `3dcc66be47c01d04ce79c6e0233a8d152985dea2292fd226d7d87e8b9c467b78` |

## Limites avant une diffusion commerciale

La tranche économique est prête à être examinée et jouée comme développement solo. Un lancement commercial complet reste prématuré : tests PC/GPU et Android physiques, performance CPU/GPU et thermique, sessions longues/mémoire, animations avec contacts crédibles, variété de personnages et décors, validation culturelle, géographie réelle attribuée, deuxième environnement, métier/progression plus riches et tests utilisateurs d’engagement restent à réaliser. Le mouvement, l'arrêt et les nouveaux panneaux tactiles sont vérifiés dans Chromium CI6 ; cette preuve ne remplace pas un appareil réel.

La santé, la sécurité, le crédit, les ambitions de carrière, la fermeture ou le repricing autonomes des commerçants, les chaînes agricoles et la simulation nationale ne sont pas livrés. L’annuaire national n’est pas un ensemble de villes jouables. Le profiling Node du domaine économique ne mesure ni rendu, GPU, ergonomie mobile ni FPS matériel. La consolidation CI6 ci-dessus actualise les correctifs et régressions sans effacer les résultats CI3, CI4 et CI5.
