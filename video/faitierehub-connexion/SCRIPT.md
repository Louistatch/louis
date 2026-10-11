# « Lundi, 7 h 30 » — Se connecter à FaîtièreHub
Vidéo explicative 9:16 · 55 s · WhatsApp Statut + TikTok · motion design (même charte que l'explainer)

Basé sur le code réel du SaaS (`app/auth/login/page.tsx`, `components/verify/card-login-panel.tsx`) :
textes d'écran, étapes et redirections reprennent exactement ce que l'utilisateur voit.

## Idée
On ne montre pas « un formulaire ». On suit **Kossi**, gestionnaire d'une coopérative à Kara,
qui a 5 minutes avant une distribution d'intrants et doit vérifier sa liste de membres.
La connexion devient le passage entre le stress et la maîtrise : 3 gestes, 30 secondes.

Arc : **Tension → Clé → 3 gestes → Bonne porte → Filet de sécurité → Confiance → Appel**

## Script minuté

| # | Temps | Ce qu'on voit (motion) | Texte à l'écran | Voix off (facultative) | Son |
|---|---|---|---|---|---|
| 1 | 0–4 s | Horloge 7:30 qui saute. File de producteurs (silhouettes) qui s'allonge. Notification : « Distribution d'intrants · 8 h 00 ». | **Lundi, 7 h 30.** La distribution commence dans 30 min. | « Lundi, 7 h 30. La distribution commence dans trente minutes. » | Tic-tac + pulsation basse |
| 2 | 4–8 s | Kossi (illustration) regarde un cahier raturé, se tourne vers son téléphone. | Kossi doit vérifier **qui est membre**. Tout est sur FaîtièreHub. | « Kossi doit vérifier ses membres. Tout est sur FaîtièreHub. » | Tic-tac s'arrête net |
| 3 | 8–12 s | Le téléphone pivote au centre. Barre d'adresse : `faitierehub.com` tapé lettre par lettre → bouton **Se connecter** pulse puis s'enfonce. | Étape 0 : ouvrez **faitierehub.com** → *Se connecter* | « Ouvrez faitierehub.com, puis Se connecter. » | Clics clavier, *pop* |
| 4 | 12–15 s | Transition : l'écran de connexion se construit (carte blanche, icône bouclier, « Bon retour »). Bandeau vert « Le terrain nous rassemble. » glisse en haut. | **3 gestes. 30 secondes.** | « Trois gestes. Trente secondes. » | Whoosh + accord majeur |
| 5 | 15–20 s | ① Champ **Adresse email** s'illumine, le texte s'écrit `kossi@coop-kara.tg`. Petit badge : « minuscules ou majuscules, pas grave ». | ① Votre **adresse email** | « Un : votre adresse email. » | Frappe douce |
| 6 | 20–26 s | ② Champ **Mot de passe** : points ••••••••. L'icône œil s'ouvre une demi-seconde (on voit le mot de passe), se referme. | ② Votre **mot de passe** · 👁 pour vérifier ce que vous tapez | « Deux : votre mot de passe. L'œil permet de vérifier la saisie. » | *Clic* œil |
| 7 | 26–31 s | ③ Bouton **Se connecter** pressé (squash). Il affiche « Authentification… » puis « Redirection… » avec spinner. | ③ **Se connecter** | « Trois : se connecter. » | Montée courte |
| 8 | 31–37 s | La « bonne porte » : l'écran se divise en 3 portes qui s'ouvrent selon le profil — **Tableau de bord** (coopérative/faîtière), **Espace Haroo** (agronome, ouvrier, acheteur), **Espace Opérateur**. La porte de Kossi s'ouvre sur son tableau de bord : 248 membres. | FaîtièreHub vous ouvre **directement votre espace**. | « FaîtièreHub reconnaît votre profil et ouvre directement votre espace. » | Porte + accord lumineux |
| 9 | 37–43 s | Retour arrière rapide (rembobinage stylisé) : lien **Mot de passe oublié ?** s'allume → enveloppe qui s'envole → « Lien envoyé » → nouveau mot de passe → retour à la connexion. | Mot de passe oublié ? Un **lien par email**, et c'est réglé. | « Mot de passe oublié ? Un lien par email, et c'est réglé. » | Rembobinage + *swoosh* enveloppe |
| 10 | 43–48 s | Bouclier vert qui se ferme autour du téléphone. Trois puces apparaissent. | 🔒 Ne partagez jamais votre mot de passe · Un compte par personne · Déconnectez-vous sur un téléphone prêté | « Votre accès est personnel. Ne le partagez jamais. » | Son de verrou |
| 11 | 48–52 s | Retour sur le terrain : Kossi scanne une carte, ✓ « Membre vérifié ». La file avance, sourires. Horloge : 7:58. | **7 h 58.** Kossi est prêt. | « Sept heures cinquante-huit. Kossi est prêt. » | Carillon de validation |
| 12 | 52–55 s | Logo FaîtièreHub, URL, bouton jaune qui pulse. | **faitierehub.com** · *Connectez-vous. Le terrain vous attend.* | « Connectez-vous. Le terrain vous attend. » | Accord final |

## Choix motion (skill motion-design)
- Personnalité **Corporate/Premium** : une courbe signature (`expo.out` à l'entrée, `power2.in` à la sortie), 3 durées (0,35 / 0,6 / 1,0 s).
- Chaque étape = **Setup → Action → Résolution** (le champ s'allume → on tape → coche verte).
- 3 couches : primaire (le téléphone / les champs), secondaire (badges, spinner, coches), ambiante (feuilles, halo vert qui respire).
- Le doigt/curseur précède toujours l'action de 150 ms (anticipation) ; le bouton s'écrase à la pression (squash).
- Contraste émotionnel : scènes 1–2 en vert sombre désaturé + tic-tac ; à partir de la scène 4, vert vif + musique majeure.
- Texte dans la zone sûre TikTok (hors bas 380 px / droite 140 px), lisible **sans le son**.

## Rôle du skill pptx
Avant le rendu vidéo : un **storyboard PowerPoint** (1 diapo = 1 scène, maquette d'écran + texte + notes voix off)
pour validation ou partage avec l'équipe. Après validation : rendu motion en HTML/GSAP → MP4 propre, sans métadonnées.

## Variante « Épisode 2 » (membres sans compte)
Le membre producteur ne se connecte pas avec un email : il scanne sa carte, entre le **PIN à 6 chiffres** remis avec la carte
(validation automatique au 6e chiffre) ; PIN perdu → **code par SMS**, valable 10 minutes. Mérite sa propre vidéo de 30 s.

## Points à confirmer
1. Prénom/ville du personnage (Kossi, Kara) et chiffre « 248 membres ».
2. Voix off : enregistrée par vous, voix de synthèse, ou texte seul + musique ?
3. Une vidéo (gestionnaires) ou deux (gestionnaires + membres par carte) ?
4. Langue : français seul, ou version éwé / kabyè en sous-titres ?
5. Montrer l'interface réelle (captures du site) ou une interface redessinée en motion ?
