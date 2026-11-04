# BELLE ÉTOILE ✦ — Le chemin vers nous

Une petite aventure romantique en **3D WebGL**, adaptée au mobile, avec une **constellation de 9 moments** (une introduction et huit étapes) et une question finale ouverte.

## Ouvrir l'expérience

Une fois GitHub Pages à jour : **https://louistatch.github.io/louis/belle-etoile/**

Le projet vit uniquement dans le sous-dossier `belle-etoile/`. Il ne modifie **aucun fichier** de la plateforme YPP à la racine du dépôt.

## Lancer localement

Aucun installateur nécessaire. Depuis la racine du dépôt :

```sh
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/belle-etoile/`.

Une connexion Internet est nécessaire pour récupérer **Three.js** et éventuellement les polices Google. Si WebGL2 ou Three.js n'est pas disponible, l'expérience reste accessible en mode visuel léger avec la navigation, la carte et les choix.

## Fonctionnalités livrées

- Scène 3D réelle (Three.js) avec îlots, géométries procédurales, ciel étoilé, lumière douce, constellation et caméra animée.
- Neuf moments scénarisés : introduction, message, livre, jardin, pont, horizon, boussole, futur, question.
- Navigation mobile tactile, boutons précédent/suivant, carte mentale revisitable, gestes de balayage.
- Petites interactions de lecture avec les intentions et valeurs.
- **Trois réponses finales de même dignité** : Oui / En parler / Non.
- Réponse conservée **uniquement dans la session courante** ; aucune collecte de réponse ni analytics.
- Ambiance sonore générative facultative, **désactivée par défaut**.
- Fallback léger sans WebGL2 ni dépendance chargée ; réduction d'animations respectée.
- Données de scène et textes éditables dans le tableau `story` de `index.html`.

## Personnaliser

Dans `index.html`, modifier les textes du tableau `story`. Chaque scène a un `tag`, un `title`, un `text`, un `type` et parfois `extras`. Pour modifier le dernier message ou le clin d'œil *« Mme TATCHIDA »*, chercher ces expressions dans le code.

Le parcours et l'acceptation **ne valent pas consentement au mariage**. Le projet 2027 est présenté comme une possibilité réciproque, jamais comme une décision prise à l'avance.

## Confidentialité

Ce dépôt `Louistatch/louis` est **public**. Ne pas y transférer d'export WhatsApp, numéro de téléphone, capture privée, photo identifiable sans consentement, ni détails sensibles. Les textes présents sont volontairement génériques ; le site n'enregistre ni réponses, ni géolocalisation.

Les métadonnées `noindex` demandent aux moteurs de recherche de ne pas indexer la page, **mais ne la rendent pas privée**. Pour un lien réellement privé, héberger depuis un dépôt privé derrière une authentification.

## Limites et contrôle qualité

- Syntaxe du script JavaScript vérifiée après publication dans GitHub.
- **Pas de test visuel instrumenté sur un Android réel** à ce stade : tester la lisibilité et les performances sur le téléphone cible.
- Le style 3D est **cinématique semi-réaliste / procédural**, et non un monde urbain photoréaliste avec personnages GLB.
- Le mode visuel complet requiert un navigateur WebGL2 et l'accès au CDN Three.js.
- Aucun domaine ni hébergement privé supplémentaire n'a été configuré.

Pour une évolution plus ambitieuse vers React Three Fiber, GLB optimisés et scènes plus réalistes, voir [CLAUDE.md](./CLAUDE.md).

## Chanson de fond (YouTube)

La vidéo demandée est intégrée via le **lecteur officiel YouTube** : [voir la chanson](https://youtu.be/PSZTZwoIJEc).

- La lecture est demandée quand la visiteuse touche « C'est parti ! » ou entre pour la première fois dans une scène depuis la carte.
- Elle est configurée pour **recommencer en boucle** (`loop=1`, `playlist=PSZTZwoIJEc`).
- Le bouton **♪ Stop** arrête la vidéo, le bouton **♪ Chanson** la relance.
- Sur certains Android, YouTube peut **bloquer le démarrage avec le son** : toucher ▶ sur la vidéo visible si nécessaire.
- Le lecteur vidéo YouTube doit être visible (minimum 200 × 200 px) ; il ne s'agit pas d'un MP3 copié ni d'un iframe caché. La disponibilité et l'intégration dépendent des droits et restrictions de la vidéo.
- Le chargement YouTube ne commence qu'à la première demande de lecture. La plateforme YouTube peut traiter certaines données lors de la lecture, même en mode `youtube-nocookie.com` ; aucune réponse au parcours n'est transmise à YouTube par le projet.
