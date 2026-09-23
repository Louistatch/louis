# YPP Africa Prep 2026

Plateforme indépendante en français de préparation au test YPP BAD, adaptée aux communications de recrutement reçues jusqu’au 23 septembre 2026. Non affiliée à la BAD, sans garantie de sélection.

## Utiliser

Site : https://louistatch.github.io/louis/

Ouvrir `index.html` ou servir ce dossier avec un serveur statique. Aucun framework, compte, API payante ou serveur de données nécessaire. GitHub Pages publie la racine de `main`.

## Format confirmé

Selon les communications de recrutement reçues jusqu’au 23 septembre 2026 : QCM uniquement, aucune réponse rédigée, aucune composante mathématique, calculatrice non nécessaire, 45 minutes en une seule session, français ou anglais, fenêtre du 28 septembre au 5 octobre 2026. Le lien doit être communiqué avant 8 h 00 GMT le 28 septembre.

## Contenu

- 108 questions originales : BAD, développement africain, jugement situationnel et raisonnement analytique non numérique ; ordre des questions et réponses mélangé.
- Diagnostic de 20 questions, entraînements ciblés, reprise des erreurs.
- Examens blancs de 40 ou 60 questions en 45 minutes, équilibrés entre les quatre domaines. Ces formats sont pédagogiques : la BAD confirme un QCM de 45 minutes sans composante mathématique, mais le nombre de questions, leur poids et le seuil officiel ne sont pas communiqués.
- Horloge fondée sur une échéance persistante, reprise après actualisation, clôture à expiration ; les questions sans réponse comptent comme incorrectes.
- Correction complète, temps par question, scores par domaine et 40 dernières séances.
- 12 fiches, lexique français–anglais, programme de 12 séances, sélection d’actualités avec liens et veille mise à jour au 23 septembre 2026.
- Sauvegarde dans localStorage uniquement ; export et restauration JSON. L’ancien score v1 n’est pas migré car son calcul et ses données étaient incomplets.

## Sources et limites

Les références sont définies dans `content.js` et liées depuis les fiches, les actualités et les questions institutionnelles concernées. La veille est une sélection éditoriale mise à jour au 23 septembre 2026, pas un flux automatiquement actualisé. Certaines pages officielles complètes refusaient l’accès ; les fiches concernées se limitent aux informations visibles dans les résultats des sources officielles. Les cas professionnels et raisonnements sont des exercices synthétiques. Les exercices de calcul ont été retirés après la confirmation que l’évaluation 2026 ne comporte pas de composante mathématique. Les réponses SJT sont des recommandations pédagogiques, pas un barème officiel BAD.

La banque de questions contient des notions fondamentales et des cas plus exigeants ; elle ne reproduit pas un test propriétaire. Le score décrit la performance sur ces exercices uniquement. L’interface et les corrections sont en français ; le lexique aide à réviser les termes anglais.

Pendant l’évaluation officielle, n’utiliser ni cette plateforme, ni IA, ni ressource externe, ni tiers, conformément à l’invitation.

## Validation

Vérification de syntaxe JavaScript et contrôle des identifiants/options. Exécuter `node tests/core.cjs`. Tests logiques dans un environnement DOM simulé ; validation visuelle sur navigateur indisponible dans cet environnement. Les tests fonctionnels couvrent le score des questions omises, les corrections, le chronomètre après rechargement et la navigation. Aucun secret ou réponse de candidat ne doit être ajouté au dépôt public.
