# YPP Africa Prep · préparation BAD / Bryq 2026

[Ouvrir la plateforme](https://louistatch.github.io/louis/)

Préparation indépendante en français, non affiliée à la BAD ou à Bryq. Questions originales ; aucun test propriétaire ni garantie de sélection.

## Adaptation du 1er octobre 2026
- 50 QCM en 50 minutes, sans mathématiques, sans pause ; réponses obligatoires avant soumission manuelle.
- Mode sans retour après validation par défaut ; mode relecture facultatif pour réviser. Consignes réelles prioritaires.
- 378 questions : BAD, développement africain, jugement situationnel, raisonnement non numérique. Ateliers compréhension, logique, attention ; défi facultatif 60 secondes par item.
- Diagnostic, séances ciblées, reprise des erreurs, confiance, sprints, corrections et profil par domaine/sous-compétence.
- 21 fiches et veille sourcée, enrichie de publications de septembre. [Recherche et limites](docs/research-bryq-2026-10-01.md).
- Horloge persistante, expiration automatique, historique de 60 séances, sauvegarde locale et export/restauration JSON. Progression précédente conservée ; ancienne session 45 minutes non reprise.

L’invitation indique une fenêtre du 1er octobre à 06:00 au 8 octobre 2026 à 23:59 GMT, une caméra activée et un ordinateur recommandé. Cette application n’active ni caméra ni microphone. Pas de compte ni de collecte serveur des réponses.

La répartition pédagogique n’est pas officielle ; barème, poids et seuil inconnus. Le guide public Bryq sert à la familiarisation, tandis que le courriel BAD définit la simulation. L’interface reste en français avec lexique anglais.

## Développement
Site statique, sans dépendance : servir la racine ou ouvrir index.html. GitHub Pages publie main. Ordre : questions.js, content.js, bryq.js, mastery.js, coaching.js, app.js.

Validation : `node tests/core.cjs` et `node --check app.js`. Tests du format, score, garde de correction, échéances après rechargement, questions obligatoires, progression sans retour, sprints, données persistantes et vues. Le DOM simulé ne prouve pas le rendu visuel.

Pendant l’épreuve officielle, respecter l’interdiction d’IA, de ressources externes et d’assistance. Utilisation de cette plateforme uniquement pour la préparation.

Vérification navigateur sur la version publiée : configuration 50/50, sélection sans correction, progression sans retour et conservation de la question/du chronomètre après rechargement.

## Renforcement du niveau
168 nouveaux items (difficulté estimée éditorialement), dont 72 verbaux sur 24 passages. Le coach demande des phrases de preuve, fournit des indices facultatifs et explique les trois réponses. Matrice des confusions et ateliers par piège. Tests exigeants 50/50 et surentraînement 50/35 ; les 35 minutes ne sont pas officielles.

Le tirage exigeant privilégie les inédits, évite plusieurs items du même passage et utilise uniquement la banque nouvelle. Les scores de première exposition sont distingués des questions déjà vues. Les sessions et exports historiques restent compatibles. Les tests de logique de la banque exigeante sont validés en énumérant les affectations et ordres admissibles.

[Sources, témoignages et choix pédagogiques](docs/difficulty-and-coaching-2026-10-01.md). Courriels consultés en lecture ; aucun contenu privé, lien de test, destinataire ou identifiant Gmail n’est publié dans le dépôt.
