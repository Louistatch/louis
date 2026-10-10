---
name: togo-life-economy
description: Construire et équilibrer les systèmes économiques de TOGO LIFE : commerces, stock, emplois, marchés, prix, choix stratégiques, besoins, risque et progression en FCFA virtuels.
---

# Économie jouable et vérifiable

## Source de vérité
`src/simulation.js` expose `Simulation`, `createState` et `ECONOMY`. Pas de modification de monnaie depuis les composants Three.js/UI. Les actions d'achat/investissement/dépôt exigent déjà une proximité physique : la préserver.

## Missions
- Ajouter des **arbitrages** : prix vs demande, capital vs stock, délais de livraison, loyer, réputation, crédit virtuel sous conditions, coût de transport, spécialisation par métier.
- Faire dépendre les événements économiques de l'offre, de la demande, du stock et des actions. Définir des coefficients transparents et testables, pas de récompenses aléatoires illimitées.
- Simuler progressivement des chaînes économiques togolaises (marché local, transformation, transport, agriculture) en distinguant **données fictives du jeu** et **prix réels sourcés**.
- Toute action a préconditions, débit/crédit, journal, statut d'échec explicite. Ne jamais payer deux fois sur double-clic.
- Limiter temporellement contrats et revenu passif. Préserver les sauvegardes `version:2` ou écrire une migration et des tests de reprise.

## Tests nécessaires
`tests/simulation.test.mjs` : fonds insuffisants, quantité négative/nulle, capacité maximum, distance au marché, livraison unique, contrat expiré, évolution des ventes selon prix, pause, sauvegarde malformée. Pour chaque nouveau système tester les frontières et le cas exploitation.

## Interface
Les choix se voient dans le monde : ruche de clients aux heures de pointe, stands approvisionnés, conséquence dans le portefeuille et le quartier. Pas de finances réelles ni Mobile Money actif.
