# Simulation immersive et renforcement — 1er octobre 2026

## Informations vérifiées

Les messages de coordination du 30 septembre et du 1er octobre ainsi que l’invitation Bryq du 1er octobre ont été consultés en lecture. Ils confirment : 50 QCM, 50 minutes, toutes les réponses requises, aucune composante mathématique, aucune pause, caméra activée, ordinateur recommandé, français ou anglais et clôture le 8 octobre à 23 h 59 GMT. La coordination précise le 1er octobre qu’une invitation dans une langue inadaptée doit être signalée par courriel.

L’invitation Bryq apporte un point supplémentaire : après l’évaluation, « See Results » conduit au questionnaire démographique obligatoire, sans montrer le score. La nationalité doit correspondre à la candidature. Les deux soumissions sont nécessaires. Aucun courriel privé, destinataire, identifiant de messagerie ou lien personnel d’évaluation n’est inclus dans ce dépôt.

Le [guide Bryq](https://www.bryq.com/candidates) présente plusieurs familles d’évaluations, la progression sans retour après validation et l’avancement automatique de certains items chronométrés. Il ne donne pas la configuration complète choisie pour le YPP. Le [guide général Talents](https://www.bryq.com/talents) décrit un format psychométrique différent ; ses durées et sa composante numérique ne remplacent pas les consignes spécifiques reçues.

## Difficultés tirées des récits publics

- [Récit Bryq, Reddit, février 2025](https://www.reddit.com/r/recruitinghell/comments/1igxdr3/whoever_the_hell_thinks_bryq_assesssments_are/) : pression ressentie pour lire et traiter les questions dans un autre recrutement.
- [Récit de test verbal, Civil Service](https://www.reddit.com/r/TheCivilService/comments/1bvnkys/verbal_reasoning_test_never_have_i_felt_so_stupid/) : confusion entre réponse fausse et information non déterminable, malgré une préparation initialement rassurante. Ce test n’est pas un test Bryq.
- [Avis personnel Bryq, Trustpilot, mai 2024](https://uk.trustpilot.com/review/www.bryq.com) : difficulté de lecture et manque de temps ressentis par un candidat non anglophone. Ce n’est pas une étude représentative.

Ces récits servent à choisir des exercices de lecture précise et de décision sous pression. Ils n’établissent ni les questions du YPP 2026, ni son barème, ni un temps par item. Les conseils contradictoires des commentaires ne deviennent pas des règles de réponse.

## Changements livrés

La banque contient désormais 486 questions, dont 108 cas ajoutés : 48 items verbaux répartis sur 16 passages, 12 logiques, 12 d’attention avec tableaux, 12 SJT, 12 BAD et 12 développement. Les passages demandent de distinguer périmètre, conditions, exceptions, chronologie, conformité et attribution. Chacune des trois catégories verbales possède 16 clés dans ce nouvel ensemble. Ce choix d’équilibre est pédagogique ; il ne prédit pas les fréquences officielles.

Chaque item possède une justification pour chaque réponse. Les 16 réponses verbales indéterminables donnent deux situations compatibles avec le passage et aboutissant à des vérités différentes. Le laboratoire commence par trois contrastes courts, puis propose la lecture dense avec preuves, des séances sur l’information manquante et une reprise de la confusion la plus fréquente avec des cas de contraste. Un niveau 5 décrit une complexité éditoriale ; aucune calibration sur des candidats réels n’est revendiquée.

Le mode immersif suit préparation → 50 QCM → soumission → « Voir les résultats » → questionnaire fictif → confirmation. Les champs du questionnaire et l’écran sont inventés pour apprendre le geste de clôture. Aucun renseignement démographique réel n’est demandé. Le bilan d’entraînement est retenu jusqu’à la confirmation. L’état de clôture survit au rechargement et à l’export/restauration.

Le format standard conserve 50 minutes. Le profil verbal renforcé change volontairement la composition des 50 questions. Les 35 minutes et les défis de 30, 45 ou 60 secondes par question sont exclusivement du surentraînement. Aucun délai par question n’est annoncé pour la BAD. Les simulations imposent une réponse avant validation, empêchent les retours et cachent les corrections jusqu’au bilan.

La nouveauté est mesurée aussi au niveau du passage ou de la famille de cas. Une affirmation jamais tentée sur un passage connu reste une question nouvelle, mais n’est pas une famille inédite. Les séances anciennes gardent leurs scores ; l’indicateur de famille n’est pas rétroactivement inventé. Le bilan distingue erreurs rapides, réponses correctes au-delà d’un repère de temps et première/seconde moitié, sans interpréter automatiquement un écart comme de la fatigue.

La caméra peut être vérifiée facultativement par un aperçu local, sans audio, capture, enregistrement ou transmission. Elle est arrêtée au lancement ou à la sortie du mode. Ce contrôle ne garantit pas le fonctionnement de la caméra sur Bryq. Les changements d’onglet sont comptés localement pendant la simulation immersive, sans surveillance ou jugement d’intégrité officiel.

## Sources institutionnelles ajoutées

[Garanties BAD](https://www.afdb.org/en/projects-and-operations/financial-products/african-development-bank/guarantees), [opérations non souveraines et additionnalité](https://www.afdb.org/en/private-sector/how-work-us), [sauvegardes actualisées](https://www.afdb.org/en/news-and-events/press-releases/african-development-bank-groups-updated-integrated-safeguards-system-iss-becomes-effective-71539). Leurs résultats officiels ont été retrouvés ; certaines pages intégrales BAD restent inaccessibles. Les exercices retiennent les distinctions visibles et des scénarios synthétiques, sans inventer de chiffres institutionnels.

## Validation

`node tests/core.cjs` vérifie l’intégrité de la banque, les tirages, la conservation des scores et échéances, les preuves, les champs du parcours fictif, l’impossibilité d’afficher le bilan avant clôture, la mesure de nouveauté par famille et la récupération des délais par item après suspension. Pour chacun des 12 cas logiques, toutes les affectations booléennes admissibles sont examinées ; une seule option est nécessaire dans tous les modèles.

Après publication, le parcours a été vérifié dans un navigateur sur ordinateur : contrastes Vrai/Faux/Impossible, exercice dense avec phrases de preuve et deux scénarios, préparation obligatoire, 50 réponses sans retour ni correction immédiate, conservation du temps et de la réponse après rechargement, soumission sans score, récupération de l’étape de clôture après rechargement, rejet d’une nationalité fictive incohérente, confirmation et ouverture du bilan. Les réponses choisies pendant cette vérification servent uniquement à tester le fonctionnement. Aucun problème propre au site n’a été relevé dans les journaux consultés. Le rendu mobile et l’accès réel à la caméra restent à vérifier.

Cet outil prépare à un processus connu ; il ne reproduit pas les questions propriétaires, ne connaît pas le score Bryq et ne peut garantir un classement ou une sélection.
