# Marché autonome : contrat des vues et du dialogue

`src/market-view.js` transforme l’état en textes et intentions d’interface. Il ne déplace personne, ne réserve aucun lot, ne change ni confiance ni portefeuille et ne règle aucune transaction. Les actions restent soumises à `Simulation.act` et à la proximité physique vérifiée par le jeu.

## Fournisseur

`supplierView(state)` retourne `available`, `nodeId`, `lineId`, `title`, `text`, `quote`, `stock`, `wallet`, `trust`, `reason` et `choices`. Chaque choix contient `type`, `quantity`, `price`, `label`, `lineId`, `detail` et `reason`. Une raison non vide permet de désactiver le choix en expliquant le manque de place, de stock ou d’argent. Le moteur demeure la validation définitive après clic ; le texte ne constitue pas une promesse d’acceptation.

Le graphe déclaratif `SUPPLIER_DIALOGUE` contient les branches `intro`, `counter`, `accepted`, `refused`, `expired`, `outofstock` et `unavailable`. Ses transitions sont les résultats nommés du moteur : `accepted`, `counter`, `rejected`, `sold`. Chaque ligne et chaque libellé de choix possède un identifiant stable, résolu depuis une table française. Aucun `eval`, parseur d’expression, commande embarquée dans un texte ou bibliothèque narrative n’est utilisé.

Les choix de proposition sont 300 F × 4 produits, 315 F × 8 produits et 150 F × 4 produits. Ce sont des prix virtuels de jeu. La décision effective du marchand, son motif et la confiance proviennent de `society.supplier.lastDecision` et `trust`. L’interface ne prédit pas le prix de la contre-proposition et n’invente pas une réaction à la trésorerie.

Un lot réservé s’affiche seulement quand `society.ticks < quote.expiresAt`. Il devient l’unique lot d’achat présenté, au prix unitaire réellement réservé. L’interface affiche quantité, prix unitaire, total et durée restante : chaque tick de société représente 0,25 seconde de simulation. La pause arrête cette horloge. À l’expiration exacte, les achats courants de 4, 8 ou 12 produits sont à 350 F par unité. Le marchand peut encore refuser une transaction si ses préconditions ont changé.

Un clic de négociation émet `{type: 'negotiate', quantity, price}` ; l’achat émet `{type: 'buy', quantity}`. Le `price` de la vue sert à l’affichage. Le moteur doit calculer lui-même le prix d’achat depuis la réservation valide, afin qu’un prix fourni par l’interface ne puisse imposer une remise.

## Habitants

`residentView(state, id)` retourne `null` pour une identité absente. Pour un habitant existant, il expose son identité et métier, ses besoins, son budget virtuel, son prix maximal, sa préférence locale, son objectif et sa mémoire. Le dialogue reprend `memory.lastReason` ; un déplacement vers un commerce ne devient pas une vente imaginée. `memory.purchases` compte les achats effectivement enregistrés, tandis que `memory.lastChoice` et l’objectif décrivent une décision ou intention, qui peut encore être en cours.

## Résultat économique

`societyView(state)` distingue explicitement :

- Les recettes des ventes, `revenue`.
- Le coût réel des marchandises vendues, `goodsCostSold`.
- Le bénéfice réalisé des marchandises, `revenue - goodsCostSold`.
- Les coûts des marchandises transportées et en stock, `carriedCost` et `stockCost`.
- Les dépenses cumulées toutes catégories, `costs`, le portefeuille disponible et le loyer dû.

L’investissement du comptoir et les autres dépenses ne sont pas confondus avec le coût unitaire d’un produit vendu. Une base de coût absente est exposée comme inconnue (`null`), sans fabriquer un bénéfice à coût nul. Les cinq derniers transferts sont des copies de `society.trades`, sans reconstruction de ventes fictives.

## Skills appliqués et vérification

Instructions effectivement lues et utilisées : `.agents/skills/dialogue-systems/SKILL.md` et sa référence `runner.md` pour le graphe à identifiants de lignes ; `.claude/skills/frontend-design/SKILL.md`, `.claude/skills/threejs-game-ui-designer/SKILL.md` et `references/ui-patterns.md` pour des textes courts, des états explicites et des intentions branchées sur une seule source de vérité ; `.agents/skills/togo-life-economy/SKILL.md` pour la séparation achats/coûts/profit et les prix virtuels. Les versions et licences d’installation sont consignées dans `SKILLS_EXECUTION_REPORT.md`.

Commande exécutée : `node --test --test-isolation=none tests/market-view.test.mjs`. Les neuf tests passent : prix courant et prix réservé, expiration exacte, refus et confiance, préconditions d’achat, mémoire client, bénéfice réalisé, graphe sans impasse, absence de mutations et transaction exécutée avec le véritable fournisseur du moteur. `git diff --check` passe également. Les captures et essais de mise en page dans un navigateur relèvent de la validation d’intégration ; ces tests de projection ne constituent pas un essai visuel.
