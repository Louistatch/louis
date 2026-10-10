# Preuves réelles du marché autonome

La livraison finale correspond à [CI6, run 38050314316](https://github.com/Louistatch/louis/actions/runs/38050314316), code `39daf3befc4fdce95134c1c197d8e591fb412da8`. Le [manifest final](ci6-manifest.json) identifie le build, le déploiement dédié, l'artefact ZIP et chaque rapport par SHA-256. [Bilan et limites](../../AUTONOMOUS_MARKET_VALIDATION_REPORT.md), [neuf captures originales](../../captures/autonomous-market/README.md).

| Preuve CI6 | Contenu |
|---|---|
| [Logs Node](ci6-node-log-excerpt.md) | Extrait exact : 90 tests réussis, zéro échec. |
| [Parcours général](ci6-browser-results.json) | 39 vérifications ; mouvement, collisions, caméra, transactions et sauvegarde. |
| [Parcours tactile](ci6-mobile-probe.json) | 25 vérifications ; véritables événements tactiles Chromium, deux orientations et panneaux défilés. |
| [Marché offline](ci6-society-results.json) | 70 vérifications ; négociation, transport, paiement client et décisions persistantes. |
| [Marché HTTPS](ci6-society-live-results.json) | Le même parcours de 70 vérifications sur le vrai lien public. |
| [HTTP et build](ci6-public-preview.json) | HTTP 200, taille et hash exacts ; ce probe ne lance pas de navigateur. |
| [Profil CPU](ci6-society-profile.json) | Domaine seul, 40 échantillons Node ; aucune performance GPU déduite. |
| [Audit PNG](ci6-create-game-assets.json) et [commandes](ci6-skills-execution.md) | Scripts open source réellement exécutés ; neuf PNG originaux validés et inspectés. |

Les fichiers CI3, CI4 et CI5 sont conservés pour suivre les échecs et corrections. CI4 a été annulé ; CI5 échoue sur une attente de client puis un remplacement des cartes pendant le défilement tactile. Leurs réussites partielles ne sont pas présentées comme des runs globalement réussis. CI6 termine intégralement après correction.

Les images mobiles viennent de Chromium émulé, sans téléphone physique. SwiftShader est un rendu logiciel ; les objectifs matériels de 30/60 FPS, la chauffe et la mémoire sur session longue restent à vérifier. Les journaux contiennent des identités fictives du jeu, aucun compte joueur réel.
