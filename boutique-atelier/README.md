# ATELIER — Démonstration de boutique

## Lancer
Depuis ce dossier : `python -m http.server 8080 --directory .`, puis ouvrir http://localhost:8080.
Aucun paquet à installer. Le site est composé de HTML, CSS et JavaScript natif.

## Fonctionnement
Trois vêtements fictifs sur un portant. Vraie géométrie extrudée en 3D, projection en perspective et faces ombrées, calculées sur Canvas. Ce n'est pas une photo écrasée par CSS. Survol réversible, navigation clavier, swipe et centrage mobile, manipulation de la vue détail. Aucun dos réel n'est inventé : les modèles sont des maquettes fictives. La préférence de mouvement réduit est respectée.
Catalogue filtré, variantes de tailles, stock fictif, panier et modifications, formulaire, récapitulatif non envoyé/non payé, copie et lien WhatsApp si un numéro réel est configuré. Aucun SMS ni paiement automatique. Cliquer WhatsApp ouvre une conversation et ne prouve pas l'envoi.
Les données restent dans localStorage sur l'appareil. L'administration locale n'est pas sécurisée et ne doit pas être utilisée pour une vraie boutique. Aucun stock n'est réservé lors d'une demande. La boutique doit confirmer disponibilité et livraison.

## À fournir avant ouverture des ventes
- Nom de marque, logo et textes légaux/conditions, politique livraison, remboursement et confidentialité.
- Trois premiers produits : références, descriptions vérifiées, vrais prix, taille/couleur/stock, guide de mesures.
- Photos produit autorisées. Pour les rotations photographiques : atlas WebP transparent de ~30 images profil→face, métadonnées de grille et point de suspension commun. Pour un vrai 360° : fichiers GLB/GLTF optimisés et textures autorisées. Le moteur de la démo doit alors être adapté à ces médias ; il ne prétend pas les importer automatiquement.
- Numéro WhatsApp professionnel avec indicatif, lieu de retrait et zones/tarifs de livraison.
- Backend commandes/stocks partagé, authentification de l'administration, contrôle des accès et sauvegardes. Ne jamais exposer des secrets dans le navigateur.
- Compte marchand et intégration FedaPay ou prestataire réellement disponible au Togo : paiement serveur, notifications signées et rapprochement. Statuts distincts : demande créée, commande reçue, paiement confirmé. Aucun paiement n'est connecté à cette démo.

## Vérifications
`node --check dist/app.js` valide la syntaxe JavaScript. Les interactions doivent également être testées sur téléphones physiques avant ouverture. Polices Google optionnelles, avec repli système ; aucune dépendance JavaScript externe. Les médias produits sont dessinés localement sans téléchargement.
