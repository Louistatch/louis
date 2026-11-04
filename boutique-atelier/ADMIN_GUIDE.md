# Gérer les vrais vêtements dans ATELIER

## Adresse
Ouvrir `admin.html` depuis le lien Administration dans le pied de page de la boutique.

## Première activation (une seule fois)
L'interface et son code sont construits. La connexion ne fonctionne qu'après raccordement à un projet Supabase : le fichier backend-config.js est volontairement vide jusqu'à ce choix. Aucun mot de passe n'est inclus dans le site.

1. Choisir un projet Supabase dédié à la boutique. Un coût éventuel doit être accepté avant création. Aucun projet FaîtièreHub ou portfolio n'est modifié automatiquement.
2. Appliquer `backend/setup.sql` dans ce projet (ou via une migration contrôlée). Ce script crée uniquement les objets ATELIER : produits, variantes, administrateurs, paramètres et bucket privé.
3. Dans Supabase > Authentication > URL Configuration, configurer le Site URL et les redirections autorisées vers l'adresse exacte de `admin.html`. Sur GitHub Pages : `https://louistatch.github.io/louis/boutique-atelier/admin.html`.
4. Créer le compte du propriétaire dans Authentication > Users avec son adresse vérifiée et son mot de passe. Le mot de passe doit être choisi dans l'interface sécurisée Supabase, jamais envoyé dans le chat ou ajouté au code.
5. Autoriser uniquement ce compte en insérant SON UUID dans `atelier_admins`. Ne pas autoriser tous les utilisateurs. La fin de `setup.sql` décrit cette commande. Un compte authentifié sans ce rôle reste refusé.
6. Renseigner seulement l'URL du projet et sa clé publique publishable/anon dans `backend-config.js`, puis publier ce fichier. Aucune clé `service_role`, `sb_secret_...` ou clé privée n'est autorisée dans ce dépôt public.
7. Vérifier connexion réelle, import photo, brouillon invisible au public, publication, modification du stock, dépublication et refus d'un autre compte avant ouverture.

La session admin reste en mémoire de l'onglet. Recharger la page demande une nouvelle connexion. Les brouillons ne sont lisibles que par l'administrateur, via les règles de la base et du stockage, et non par un simple contrôle visuel du navigateur.

## Ajouter un vêtement
- Se connecter, puis choisir Ajouter un vêtement.
- Renseigner nom, catégorie, description et prix en FCFA.
- Choisir les photos sur le téléphone ou l'ordinateur. La première image est la photo principale; retirer une photo avec Retirer.
- Renseigner tailles et couleurs séparées par des virgules; Mettre à jour les variantes; saisir le stock de chaque combinaison.
- Choisir Brouillon pour préparer le produit ou Publié pour le rendre visible.
- Enregistrer. Après succès, actualiser la boutique sur un autre appareil pour vérifier le produit.

Les photos JPG, PNG, WebP ou AVIF sont limitées à 8 Mo à l'import et converties en WebP de 1 800 pixels maximum pour économiser les données. Pas de fichier SVG ou HTML accepté. Les fichiers sont conservés dans le stockage du projet, pas dans le téléphone du propriétaire uniquement.

## Rotation
Une photo simple est affichée comme une photo. Il n'y a aucune génération automatique de côtés ou de dos.

Deux médias facultatifs sont acceptés :
- Vidéo MP4/WebM, 25 Mo maximum : filmer le vêtement qui passe du profil à la face, caméra fixe. La boutique parcourt cette vidéo au survol/glissement. Elle ne retire pas automatiquement le fond.
- Planche WebP transparente, 15 Mo maximum : grille de 2 à 90 images du profil à la face, cadrage identique. Saisir colonnes, lignes et nombre d'images. La boutique affiche les images dans l'ordre et inverse le mouvement à la sortie du survol.

Le média doit être préparé avant import. Pas de génération IA payante ni de traitement vidéo automatique branché.

## Stocks, retrait et commandes
Modifier un produit pour changer ses stocks. Choisir Archivé pour le retirer de la boutique sans supprimer son historique. Un contrôle de version refuse l'écrasement silencieux d'une modification faite depuis un autre onglet.

Le récapitulatif de commande et WhatsApp ne constituent ni un paiement ni une réservation de stock. Les coordonnées du client ne sont pas enregistrées automatiquement dans cette version. Confirmer la disponibilité et la vente, puis ajuster le stock dans l'administration.

## Ma boutique
Renseigner le nom de marque et le numéro WhatsApp professionnel avec indicatif, sans espaces. Ces réglages sont enregistrés en ligne et publics.

## Confidentialité et limites
- Le bucket est privé; les liens médias sont temporaires. Les médias d'un produit publié sont accessibles aux visiteurs, les brouillons seulement aux admins.
- Les retraits de publication ne révoquent pas immédiatement un lien déjà signé : il expire après 15 minutes. Une photo déjà téléchargée ne peut pas être récupérée chez un visiteur.
- Les fichiers retirés d'une fiche ne sont pas automatiquement supprimés du stockage. Nettoyer les fichiers inutilisés après sauvegarde et contrôle des références pour éviter une suppression accidentelle.
- Les tests navigateur à serveur simulé ne prouvent pas les droits du projet réel. Les tests RLS et d'import réel doivent être exécutés après activation.
- YPP et les autres applications de `Louistatch/louis` restent intacts; seuls les fichiers de `boutique-atelier/` sont remplacés.
