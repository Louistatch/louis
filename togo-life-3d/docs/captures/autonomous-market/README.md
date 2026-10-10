# TOGO LIFE — captures réelles du marché autonome

[Jouer](https://togo-life-preview.vercel.app) · [Run CI6](https://github.com/Louistatch/louis/actions/runs/38050314316) · [Provenance et hashes](manifest.json) · [Contrôle des images](../../evidence/autonomous-market/ci6-skills-execution.md)

Neuf captures Chromium du vrai jeu, source `39daf3befc4fdce95134c1c197d8e591fb412da8`. Les PNG originaux sont conservés sans retouche ; **aucune image conceptuelle**. Cliquez sur une image pour l'ouvrir à sa résolution native.

Les cinq vues PC proviennent du véritable aperçu HTTPS en `1440×900`. Les vues mobiles sont des émulations : portrait CSS `390×844`, paysage `844×390`, facteur de pixels de 1,5. **Aucun appareil Android physique testé.** Le rendu logiciel SwiftShader ne valide pas les objectifs matériels de 30/60 FPS ; le quartier de Lomé reste stylisé.

## PC — scénario HTTPS

| Capture | Observation |
| --- | --- |
| <a href="market-counteroffer.png"><img src="market-counteroffer.png" width="400" alt="Contre-offre au marché" /></a> | Ama propose quatre produits à **315 F**, soit **1 260 F**, avec réservation limitée. |
| <a href="autonomous-kiosk-sale.png"><img src="autonomous-kiosk-sale.png" width="400" alt="Vente réelle au comptoir" /></a> | Vente à **450 F**, stock restant **11**, bénéfice marchandises **135 F**. |
| <a href="autonomous-price-refusal.png"><img src="autonomous-price-refusal.png" width="400" alt="Décisions et prix refusé par les habitants" /></a> | Portefeuilles, plafonds par produit, souvenirs du refus à **1 100 F** et choix du commerce concurrent. |
| <a href="autonomous-restored-decisions.png"><img src="autonomous-restored-decisions.png" width="400" alt="Décisions restaurées après reprise" /></a> | Les décisions individuelles et leurs conséquences restent visibles après rechargement. |
| <a href="autonomous-market-active.png"><img src="autonomous-market-active.png" width="400" alt="Quartier actif devant le comptoir" /></a> | Vue du quartier actif, avatar, comptoir, habitants et contrôles. |

## Mobile — portrait et paysage émulés

| Capture | Observation |
| --- | --- |
| <a href="mobile-onboarding.png"><img src="mobile-onboarding.png" width="190" alt="Accueil mobile avec aperçu 3D" /></a> | Aperçu 3D, choix du personnage et entrée dans le quartier. PNG **585×1266**. |
| <a href="mobile-portrait.png"><img src="mobile-portrait.png" width="190" alt="Quartier en portrait avec joystick" /></a> | Joystick, course, objectif, carte et dock en portrait. PNG **585×1266**. |
| <a href="mobile-commerce.png"><img src="mobile-commerce.png" width="190" alt="Commerce défilé avec fermeture accessible" /></a> | Sept cartes après défilement ; fermeture et actions inférieures visibles. PNG **585×1266**. |
| <a href="mobile-landscape.png"><img src="mobile-landscape.png" width="400" alt="Quartier en paysage avec contrôles séparés" /></a> | Contrôles séparés et personnage visible en paysage. PNG **1266×585**. |

Les rapports CI6 attestent de **39 vérifications régression, 25 tactiles et deux parcours autonomes de 70 vérifications réussis**, offline et HTTPS. Les images fixes complètent ces preuves ; elles ne suffisent pas à juger une animation professionnelle.
