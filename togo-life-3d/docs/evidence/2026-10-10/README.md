# Preuves brutes archivées

Date : 10 octobre 2026. Rapports JSON/TXT copiés sans modification et PNG/WebM natifs du jeu. Les chemins de travail originaux à l’intérieur des rapports sont conservés ; aucun résultat historique n’est réécrit.

## Provenance

| Run | Source | Contenu archivé |
|---|---|---|
| [CI9 gameplay 38024690133](https://github.com/Louistatch/louis/actions/runs/38024690133) | `6740be8f` | browser-results.json, mobile-probe.json, public-preview.json, live-chromium.json, motion-results.json ; cinq PNG dans la galerie |
| [CI9 skills/profils 38024687518](https://github.com/Louistatch/louis/actions/runs/38024687518) | `6740be8f` | performance-profiles.json, original-inspector.json, director-check.txt, director-manifest.json ; onboarding-inspector.png |
| [CI11 gameplay 38025435352](https://github.com/Louistatch/louis/actions/runs/38025435352) | `27d22e9b` | ci11/browser-results.json, ci11/mobile-probe.json, ci11/public-preview.json, ci11/live-chromium.json |
| [CI11 motion 38025435266](https://github.com/Louistatch/louis/actions/runs/38025435266) | `27d22e9b` | screencast-results.json, actual-compositor-motion.webm |
| Validation locale des cinq nouveaux skills | Pack `0a70cfc6` | skills-install-validation.json, validation de cinq SKILL.md et liens/références |
| Analyse locale des mesures CI9 | Jeu `6740be8f` | budget-review.json, budget-self-checks.json, cinq contrôles de fiabilité |

Hash du jeu dans tous les lots : `6f97f6457696e37ad504ab4c0a24cd79f59744175379ea810594ac8262d1cfbe`, 1 876 887 octets. Les changements CI11 concernent les procédures de capture, pas le jeu livré. [Rapport de validation](../../INTERFACE_VALIDATION_REPORT.md) et [galerie](../../captures/README.md).

L’inspector original produit `artifacts/original-inspector/desktop.json` et `desktop.png` : archivés comme original-inspector.json et onboarding-inspector.png. Le checker original a été exécuté dans le layout du runner, avant archivage. director-manifest.json conserve donc ses chemins d’origine ; il ne certifie pas que ces chemins relatifs existent après renommage dans cette archive.

Le profilage lit des compteurs actifs réels. L’inspector d’accueil a des champs budget nuls : son booléen withinBudget n’est pas utilisé comme preuve de budgets mesurés. budget-review.json applique séparément les budgets aux compteurs présents et laisse les timings CPU/GPU inconnus.

Les JSON ci11 documentent un vrai navigateur : 37 vérifications gameplay, 21 tactiles et probe HTTPS. public-preview.json documente uniquement HTTP/hash, son browserValidated:false est correct. Le WebM documente un flux réel lent, avec décalage images/diagnostics, pas une certification 30/60 FPS ou d’animations professionnelles.

Les artifacts GitHub volumineux (autres captures, 24 JPEG, logs et vidéos antérieures) sont accessibles depuis les runs pendant leur rétention de sept jours. Les preuves retenues ici restent versionnées. Aucune capture propriétaire de Townsmen/Lagos Life n’est intégrée au jeu ou à cette galerie.

[manifest.json](manifest.json) contient taille/SHA-256 des preuves conservées ; il exclut ce README et lui-même. Les logs locaux npm n’ont pas été copiés : l’échec npx EPERM avant téléchargement est consigné dans le registre, sans information d’authentification.
