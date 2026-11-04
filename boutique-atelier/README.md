# ATELIER : boutique et administration

## Ouvrir
Boutique : https://louistatch.github.io/louis/boutique-atelier/
Administration : https://louistatch.github.io/louis/boutique-atelier/admin.html

## État
L'interface admin est implémentée : authentification Supabase, produits, images, variantes/stocks, brouillon/publication/archivage, aperçu, paramètres de marque et WhatsApp. Son activation réelle nécessite un projet Supabase choisi et configuré; `backend-config.js` reste vide tant que ce projet n'est pas confirmé. Aucun compte ou mot de passe de démonstration n'accorde l'administration.

Le catalogue affiche les vrais produits publiés quand le backend est connecté. Sans configuration, il reste explicitement en mode démonstration avec trois maquettes. Les paiements ne sont pas connectés; WhatsApp ouvre une demande à confirmer, sans réservation de stock.

## Lancement local
`python -m http.server 8080 --directory .`, puis ouvrir http://localhost:8080.
Aucune dépendance JavaScript externe, aucun paquet à installer pour le site.

## Activation
Lire `dist/ADMIN_GUIDE.md` (ou `ADMIN_GUIDE.md` dans le dossier GitHub publié). Le schéma est dans `backend/setup.sql`. RLS protège produits, variantes, paramètres et stockage. La clé publique seule ne permet aucune écriture. Les administrateurs sont attribués côté serveur, jamais par inscription libre.

Les mots de passe et clés serveur ne vont pas dans ce dépôt. Le projet Supabase ne doit pas être choisi implicitement parmi d'autres applications existantes.

## Vrais médias
Import photos JPG/PNG/WebP/AVIF, compression WebP, galerie réelle. Option vidéo MP4/WebM de rotation ou atlas WebP profil→face. Pas de dos inventé et pas de génération IA automatique. Les maquettes 3D restent limitées au mode démonstration.

## Vérification
- `node tests/api.test.mjs` : huit contrôles du client HTTP, accès admin, liens médias et sauvegarde atomique (HTTP simulé).
- `python tests/browser_check.py` : parcours boutique/admin dans Chromium installé, sur ordinateur et viewport mobile, backend HTTP simulé. Prérequis déjà disponibles dans l'environnement de travail : Playwright et Pillow. Les captures et le rapport restent dans `qa/` hors des fichiers publics.
- Contrôles de syntaxe Node des modules.

Tests réels Supabase requis après activation : visiteur refusé en écriture, non-admin refusé, brouillon non lisible au public, upload autorisé uniquement au propriétaire, publication visible sur un autre appareil, retrait de publication et conflits de modifications.

Le code ajouté dans Louistatch/louis est limité au dossier boutique-atelier; aucun fichier YPP n'est écrasé. La version HTML autonome et l'archive seront mises à jour pour rester des copies de démonstration, sans accès administrateur hors HTTP(S).
