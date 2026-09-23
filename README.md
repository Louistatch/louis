# YPP Africa Prep 2026

Plateforme indépendante en français de préparation au test YPP BAD, adaptée aux communications de recrutement reçues jusqu’au 23 septembre 2026. Non affiliée à la BAD, sans garantie de sélection.

## Utiliser

Site : https://louistatch.github.io/louis/

Ouvrir `index.html` ou servir ce dossier avec un serveur statique. Aucun framework, compte, API payante ou serveur de données nécessaire. GitHub Pages publie la racine de `main`.

## Format confirmé

Selon les communications de recrutement reçues jusqu’au 23 septembre 2026 : QCM uniquement, aucune réponse rédigée, aucune composante mathématique, calculatrice non nécessaire, 45 minutes en une seule session, français ou anglais, fenêtre du 28 septembre au 5 octobre 2026. Le lien doit être communiqué avant 8 h 00 GMT le 28 septembre.

## Contenu

- 160 questions originales, équilibrées à 40 par domaine : BAD, développement africain, jugement situationnel et raisonnement analytique non numérique.
- Diagnostic de 20 questions, entraînements ciblés, reprise des erreurs et mode « fausses certitudes » pour les erreurs commises avec forte confiance.
- Examens blancs de 40 ou 60 questions en 45 minutes, plus trois sprints : verbal reasoning (9 questions/8 min), SJT (12/10 min) et mixte (12/10 min). Ces formats sont pédagogiques : la BAD confirme un QCM de 45 minutes sans composante mathématique, mais le nombre de questions, leur poids, les sous-formats et le seuil officiel ne sont pas communiqués.
- Horloge fondée sur une échéance persistante, reprise après actualisation, clôture à expiration ; les questions sans réponse comptent comme incorrectes.
- Correction complète, temps par question, niveau de confiance facultatif, détection des erreurs à forte confiance, scores par domaine et 60 dernières séances.
- 18 fiches de révision, lexique français–anglais, programme de 12 blocs, sélection d’actualités avec liens et veille mise à jour au 23 septembre 2026.
- Sauvegarde dans localStorage uniquement ; export et restauration JSON. L’ancien score v1 n’est pas migré car son calcul et ses données étaient incomplets.

## Base de conception

La plateforme s’appuie d’abord sur les sources officielles de la BAD : compétences YPP 2026, valeurs institutionnelles, processus de sélection, Stratégie décennale 2024–2033, Quatre points cardinaux, FAD-17, Perspectives économiques en Afrique 2026 et actualités récentes. Les scénarios SJT sont construits pour entraîner les comportements cohérents avec l’intégrité, le professionnalisme, la transparence, l’esprit d’équipe, l’excellence, l’orientation résultats, la communication, la négociation et la résolution de problèmes.

Le sous-format verbal « Vrai / Faux / Impossible à conclure » est un format d’entraînement générique inspiré de formats psychométriques publics. Il ne signifie pas que la BAD utilise Aon, SHL ou ce sous-format exact : aucun fournisseur ni sous-format détaillé n’est publiquement confirmé pour l’évaluation reçue par le candidat.

## Sources et limites

Les références sont définies dans `content.js` et liées depuis les fiches, les actualités et les questions institutionnelles concernées. La veille est une sélection éditoriale mise à jour au 23 septembre 2026, pas un flux automatiquement actualisé. Certaines pages officielles complètes refusaient l’accès ; les fiches concernées se limitent aux informations visibles dans les résultats des sources officielles. Les cas professionnels et raisonnements sont des exercices synthétiques. Les exercices de calcul ont été retirés après la confirmation que l’évaluation 2026 ne comporte pas de composante mathématique. Les réponses SJT sont des recommandations pédagogiques, pas un barème officiel BAD.

La banque de questions contient des notions fondamentales, des cas exigeants et des passages de raisonnement verbal ; elle ne reproduit aucun test propriétaire. Le score décrit la performance sur ces exercices uniquement. L’interface et les corrections sont en français ; le lexique aide à réviser les termes anglais.

Pendant l’évaluation officielle, n’utiliser ni cette plateforme, ni IA, ni ressource externe, ni tiers, conformément à l’invitation.

## Validation

Vérification de syntaxe JavaScript et contrôle des identifiants/options. Exécuter `node tests/core.cjs`. Tests logiques dans un environnement DOM simulé ; validation visuelle sur navigateur indisponible dans cet environnement. Les tests fonctionnels couvrent le score des questions omises, les corrections, le chronomètre après rechargement et la navigation. Aucun secret ou réponse de candidat ne doit être ajouté au dépôt public.
