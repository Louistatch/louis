# Protocole de vérification du marché autonome

Ce document définit le parcours à exécuter. Il ne constitue pas un résultat de test. Le résultat sera le fichier JSON produit par `scripts/society_browser.py` sur la révision réellement construite, accompagné de captures du navigateur.

Le test utilise Chromium via Playwright, un contexte neuf, les touches normales de déplacement et les boutons du jeu. Les évaluations JavaScript lisent uniquement les diagnostics et le DOM. Aucune téléportation, avance artificielle du temps, injection d'argent, modification d'une sauvegarde ou affectation forcée d'un objectif de PNJ n'est autorisée.

## Parcours attendu

1. Entrer dans le quartier par le bouton de création du personnage. Vérifier la présence de la société et des huit habitants identifiables dans les diagnostics.
2. Rejoindre le marché à pied par les trottoirs. Soumettre une offre insuffisante : le fournisseur doit refuser sans déplacer d'argent ni de marchandise ; son opinion persistante doit refléter l'échange.
3. Proposer 300 F pour quatre produits. Si Ama propose un contre-prix, celui-ci doit dépasser l'offre du joueur et rester sous le prix de base. Acheter avec le devis affiché. Le débit du joueur doit égaler quantité × prix accepté, le portefeuille du fournisseur doit recevoir exactement ce montant, le stock fournisseur doit diminuer et le sac du joueur augmenter de la même quantité.
4. Selon les choix réellement disponibles, vérifier aussi une offre acceptée de 315 F pour huit produits. Aucun bouton d'achat ne doit accepter une quantité ou un montant incohérent avec le devis.
5. Transporter les produits jusqu'au comptoir, investir les 9 000 F d'ouverture, livrer le sac et fixer un prix accessible. Acheter en un clic depuis la fenêtre de gestion à distance ne compte pas comme livraison.
6. Laisser le monde actif. Observer un client choisir le comptoir, parcourir son itinéraire et y effectuer un achat. Le stock vendu, l'encaissement du joueur, le débit du client et ses provisions doivent être cohérents. Une intention de se rendre au comptoir ne compte pas comme vente.
7. Fixer 1 100 F sur place. Observer un refus motivé par ce prix et un choix de la concurrence. Exiger une arrivée et une transaction réelle à l'autre étal lorsque le système fournit cette trace ; la seule mention « concurrence » dans le texte de l'interface ne suffit pas.
8. Sauvegarder par le menu normal. Lire la sauvegarde sans la modifier, recharger la page puis reprendre. Vérifier la conservation des relations, refus, achats, devis et décisions archivés. Les compteurs de visite et les horodatages de décisions peuvent progresser pendant l'intervalle réellement joué avant l'ouverture du menu : les comparer strictement ne prouverait pas correctement une restauration. Le test contrôle les souvenirs durables de chaque acteur et la décision d'un habitant déjà installé à son travail.
9. Vérifier l'absence d'erreur JavaScript et conserver les captures du devis, du comptoir actif et du choix de la concurrence.

Les temps d'attente sont bornés. Un client qui n'arrive pas avant l'échéance, un itinéraire bloqué ou un diagnostic manquant fait échouer le parcours ; le test ne raccourcit pas un trajet par une mutation cachée.

## Exécution

Depuis `togo-life-3d/` :

```sh
node scripts/build.mjs
python3 scripts/society_browser.py --help
python3 scripts/society_browser.py --entry-file dist/TOGO_LIFE_MONTAGNE.html --output-dir artifacts/society
```

Le monofichier conserve le véritable moteur et les assets du build. L'option `--url` permet de jouer sur une URL HTTP(S) réelle ; elle ne simule pas une réponse réseau. Les scripts ne requièrent ni API payante ni serveur de jeu.

L'exécuteur doit autoriser les sockets de Chromium et disposer de Playwright/Chromium. L'environnement local de cette session peut les bloquer : un échec de lancement reste un échec de lancement, jamais une validation navigateur. Le rendu SwiftShader de CI peut prouver le parcours fonctionnel et produire des images réelles ; il ne valide pas les objectifs de fluidité sur PC ou téléphone Android.

## Preuves à conserver

- `society-results.json` : révision Git, SHA-256 du monofichier utilisé, version Chromium, assertions, étapes, trajets, diagnostics avant/après et erreurs éventuelles.
- PNG capturés par Playwright depuis ce même navigateur et cette même partie ; aucune image conceptuelle.
- Trace du job de CI et sa commande exacte, avec la révision correspondant au JSON.

Le jeu utilise une vue de 1 440 × 900 pixels pour ce parcours. Le jeu de cinq captures déclaré comprend `market-counteroffer.png` (dialogue de contre-offre), `autonomous-kiosk-sale.png` (dialogue normal ouvert immédiatement après une vente réelle à 450 F), `autonomous-price-refusal.png` (fenêtre Commerce après la transaction concurrente), `autonomous-restored-decisions.png` (même fenêtre après restauration de la sauvegarde) et `autonomous-market-active.png` (quartier actif après reprise). Dans les deux fenêtres Commerce, le test fait défiler normalement les sept cartes d'habitants jusqu'à la zone visible, vérifie leurs dimensions dans le dialogue et le texte « Dernier prix refusé : 1 100 F », puis prend la capture. Les quatre fenêtres suspendent la simulation par le comportement normal du jeu ; seule la dernière capture est une vue active sans dialogue. Ce choix évite qu'une capture lente modifie la décision que le test vient d'observer.

Les scripts et ce protocole suivent les instructions réellement lues de `webapp-testing` et `threejs-qa-release`, notamment les références `playtest-bot.md` et `evidence-manifest.md`. Le modèle de bot générique fondé sur des hooks de mutation n'est pas utilisé : ce parcours conserve exclusivement les entrées normales du joueur. Les éventuelles anciennes validations de l'interface ne remplacent pas ce parcours économique.
