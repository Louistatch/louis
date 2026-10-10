# Lomé : boucle économique autonome

Cette tranche améliore le jeu Three.js existant. Aucun nouveau moteur, téléchargement npm, service payant, serveur économique ou appel LLM n'est nécessaire.

## Audit des branches

La branche `feat/togo-life-autonomous-market` part du contenu de `feat/togo-life-interface-jeu` (PR #6, commit distant `3a711fd564c6816f43ac6380299c69ef79e62e3b`). Son arbre correspond exactement au commit local de départ `f18e19a85a04389a36a2a73d18bec4fb993e52a9`. La refonte graphique, le personnage glTF et les contrôles existants sont conservés.

La PR #8 `feat/codex-togo-life-studio`, commit `308e9dfbed69e6efa62aaaac68031147a7b6c6ca`, contient les cinq skills locaux du studio : copiés et vérifiés individuellement, sans fusion de branche. `main` au moment de l'audit est `f4fbdb43d6dd1c243f6386b0713ec9340c02141b` ; la PR #7 a modifié le dossier indépendant `togo-life-3d-preview/`. Cette copie et la plateforme BAD/Bryq restent hors du périmètre. La nouvelle PR vise la branche de refonte #6 pour séparer les changements économiques des changements graphiques.

## Autorité et contrats

- `simulation.js` reçoit les intentions du joueur après vérification du lieu, met à jour son budget, les contrats, les besoins, le logement et l'inventaire. L'économie avance par pas fixes de 250 ms, indépendants du rendu.
- `society.js` conserve huit identités stables : Ama et sept clients. Les profils ont des métiers, budgets, seuils de prix, préférences locales, domiciles, besoins alimentaires et d'énergie différents. Les données n'importent jamais Three.js.
- Un arbre de comportement réactif donne priorité à la fatigue, aux courses à rapporter et à la faim. Les autres destinations sont choisies par scores d'utilité normalisés, avec un bonus de continuité. Les routes et le statut `Running` restent sérialisables. Les chemins sur le graphe de trottoirs sont calculés une fois ; les décisions utilisent le pas de simulation, pas le nombre d'images.
- `npcs.js` affiche ces mêmes agents et interpole leurs déplacements sur 250 ms. Il ne décide pas de leurs achats, revenus ou destinations. Les interactions utilisent la position économique réelle, distincte de la position interpolée.
- `market-view.js` et `ui-model.js` produisent des vues sans effet de bord. Les conversations ont des identifiants de ligne et des branches déclarées. Ouvrir un menu ne débite jamais de monnaie. Les diagnostics QA sont accessibles uniquement avec `?qa=1` et ne fournissent aucun bouton de mutation.

## Transactions et conséquences

Ama dispose d'un stock fini et d'un portefeuille virtuel. Le tarif sans réservation reste 350 F. Un lot de quatre proposé à 300 F reçoit une contre-offre de 315 F ; un lot de huit proposé à 315 F est accepté. Une proposition trop basse est refusée et diminue sa confiance. Le volume et la confiance influencent son seuil de négociation. Une réservation expire après 60 secondes de simulation, et un achat consomme la réservation. Les menus arrêtent le temps.

L'achat vérifie quantité, capacité, stock et fonds avant toute mutation. L'argent payé passe au fournisseur ; les produits passent au sac. Le joueur doit se rendre au comptoir pour l'ouvrir à 9 000 F, déposer les marchandises et choisir un prix entre 350 et 1 200 F.

Les clients comparent besoins, prix, budget, relations, préférence et concurrent à 600 F. Ils empruntent réellement les trottoirs. Une vente exige une arrivée à moins de 55 cm du comptoir, du stock et un paiement intégral. Un prix à 1 100 F dépasse tous les seuils initiaux : aucune vente locale ; certains clients achètent chez le concurrent. Leur refus, achats et décisions restent dans la sauvegarde. Un salaire virtuel exige une arrivée au travail, un jour non encore rémunéré et une caisse d'employeur suffisante.

Les transactions conservent le budget avant/après, les stocks avant/après et la position physique de l'acheteur dans un journal borné à seize reçus. Le coût des marchandises suit le prix réellement payé, puis le coût moyen pondéré du stock. Le bénéfice réalisé vaut recettes moins coût des produits vendus ; il est distinct de la trésorerie, des produits invendus, de l'ouverture et des dépenses de logement. Tous les cinq produits vendus augmentent la réputation locale ; les conversations établissent des relations mémorisées.

## Sauvegardes

Le contenu passe à la version 3, en gardant la clé historique `togo-life:montagne:v2`. La version 2 conserve le joueur, le commerce, les inventaires, contrats, journal, position et apparence. Son coût historique connu de 350 F permet de migrer les bases de coût ; une société nouvelle est initialisée à son jour et son heure. Les versions inconnues et les données mal formées sont rejetées atomiquement.

`save-store.js` sauvegarde un secours valide avant de remplacer la valeur primaire. Une exception de stockage ou de quota ne détruit pas le précédent primaire. Une lecture peut récupérer le secours sans effacer un primaire corrompu ou futur. Une négociation refusée est sauvegardée aussi : sa conséquence sur la confiance est réelle.

## Limites de cette livraison

Quartier artistique stylisé de Lomé, sans relevé OSM de ses bâtiments. La géographie administrative existante est conservée ; aucune nouvelle ville n'est chargée. La santé, la sécurité, le crédit, les fermetures commerciales, les coûts de transport et les chaînes agricoles ne sont pas encore simulés. Le concurrent possède ici un tarif fixe ; seule la décision des clients change. Le réapprovisionnement et les salaires sont finis. Les identités et emplois sont prédéfinis ; ce n'est pas une simulation démographique complète.

Le jeu reste solo avec stockage local modifiable par son propriétaire. L'indépendance du rendu prépare un futur serveur, mais aucun multijoueur ou service autoritaire distant n'est implémenté. Les animations glTF et le rendu existants sont réutilisés ; l'interpolation des agents améliore leurs déplacements sans constituer une nouvelle production de mocap ou une validation sur appareil physique.
