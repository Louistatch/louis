# YPP Africa Prep · préparation BAD / Bryq 2026

[Ouvrir la plateforme](https://louistatch.github.io/louis/)

Préparation indépendante en français, non affiliée à la BAD ou à Bryq. Questions originales ; aucun test propriétaire ni garantie de sélection.

## Adaptation du 1er octobre 2026
- 50 QCM en 50 minutes, sans mathématiques, sans pause ; réponses obligatoires avant soumission manuelle.
- Mode sans retour après validation par défaut ; mode relecture facultatif pour réviser. Consignes réelles prioritaires.
- 486 questions : BAD, développement africain, jugement situationnel, raisonnement non numérique. Ateliers compréhension, logique, attention ; défi facultatif 60 secondes par item.
- Diagnostic, séances ciblées, reprise des erreurs, confiance, sprints, corrections et profil par domaine/sous-compétence.
- 21 fiches et veille sourcée, enrichie de publications de septembre. [Recherche et limites](docs/research-bryq-2026-10-01.md).
- Horloge persistante, expiration automatique, historique de 60 séances, sauvegarde locale et export/restauration JSON. Progression précédente conservée ; ancienne session 45 minutes non reprise.

L’invitation indique une fenêtre du 1er octobre à 06:00 au 8 octobre 2026 à 23:59 GMT, une caméra activée et un ordinateur recommandé. L’aperçu de caméra est facultatif, local, sans audio, enregistrement ni transmission ; il s’arrête au lancement de l’entraînement. Pas de compte ni de collecte serveur des réponses.

La répartition pédagogique n’est pas officielle ; barème, poids et seuil inconnus. Le guide public Bryq sert à la familiarisation, tandis que le courriel BAD définit la simulation. L’interface reste en français avec lexique anglais.

## Développement
Site statique, sans dépendance : servir la racine ou ouvrir index.html. GitHub Pages publie main. Ordre : questions.js, content.js, bryq.js, mastery.js, expert-bank.js, coaching.js, simulation.js, app.js.

Validation : `node tests/core.cjs` et `node --check app.js`. Tests du format, score, garde de correction, échéances après rechargement, questions obligatoires, progression sans retour, sprints, données persistantes et vues. Le DOM simulé ne prouve pas le rendu visuel.

Pendant l’épreuve officielle, respecter l’interdiction d’IA, de ressources externes et d’assistance. Utilisation de cette plateforme uniquement pour la préparation.

Cette version publiée a été vérifiée dans un navigateur sur ordinateur : laboratoire Vrai/Faux/Impossible, phrases de preuve et deux scénarios, préparation obligatoire, 50 questions sans retour ni correction immédiate, conservation de la réponse et du chronomètre après rechargement, soumission sans affichage du score, questionnaire fictif et confirmation avant le bilan. Le rendu mobile et l’accès réel à la caméra restent à vérifier. Aucun problème propre au site n’a été relevé dans les journaux consultés.

## Renforcement du niveau
168 nouveaux items (difficulté estimée éditorialement), dont 72 verbaux sur 24 passages. Le coach demande des phrases de preuve, fournit des indices facultatifs et explique les trois réponses. Matrice des confusions et ateliers par piège. Tests exigeants 50/50 et surentraînement 50/35 ; les 35 minutes ne sont pas officielles.

Le tirage exigeant privilégie les inédits, évite plusieurs items du même passage et utilise uniquement la banque nouvelle. Les scores de première exposition sont distingués des questions déjà vues. Les sessions et exports historiques restent compatibles. Les tests de logique de la banque exigeante sont validés en énumérant les affectations et ordres admissibles.

[Sources, témoignages et choix pédagogiques](docs/difficulty-and-coaching-2026-10-01.md). Courriels consultés en lecture ; seuls les éléments utiles au format de préparation sont résumés. Aucun courriel brut, lien personnel de test, destinataire ou identifiant Gmail n’est inclus dans le dépôt.

## Simulation immersive et apprentissage approfondi

108 cas supplémentaires : 48 verbaux sur 16 passages plus denses, 12 logiques, 12 tableaux de précision, 12 SJT, 12 BAD et 12 développement. Banque totale : 486. Les réponses indéterminables présentent deux scénarios compatibles, et chaque option est expliquée.

Le laboratoire propose des contrastes Vrai/Faux/Impossible, la sélection de preuves, une reprise de la confusion la plus fréquente et des défis de 30/45/60 secondes (réglages pédagogiques). Le mode immersif suit tout le parcours confirmé : 50 QCM → soumission → « Voir les résultats » → questionnaire fictif → confirmation. Le bilan d’entraînement n’apparaît qu’après la clôture. Le profil renforcé verbal et les 35 minutes restent du surentraînement volontaire.

La nouveauté est aussi suivie par famille de passage, afin de distinguer un énoncé nouveau d’un contexte déjà connu. Le bilan ajoute erreurs rapides, réponses lentes et comparaison descriptive des deux moitiés, sans prédiction de rang. Les anciens scores, les échéances et l’export/restauration restent compatibles.

[Consignes vérifiées, sources, limites et validation](docs/immersive-training-2026-10-01.md).
