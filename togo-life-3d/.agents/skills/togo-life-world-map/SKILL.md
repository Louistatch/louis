---
name: togo-life-world-map
description: Étendre TOGO LIFE de Lomé aux régions, villes et préfectures du Togo avec OpenStreetMap, génération de quartiers 3D, navigation et données géographiques vérifiables sans inventer de routes.
---

# Monde togolais extensible

L'existant est un quartier stylisé de Lomé dans `src/world.js`; `src/geography.js` contient une liste historique de 5 régions et 40 entrées qui **n'est pas une couverture OSM géométrique**. Ne pas promettre des scènes distinctes tant qu'elles ne sont pas réalisées.

## Stratégie open source
1. Sourcer frontières et noms dans données administratives maintenues, avec date/version/licence ; vérifier les changements récents de préfectures.
2. Utiliser des extraits OSM géographiquement bornés pour voirie, POI, bâtiments quand la couverture est disponible ; conserver attribution et respecter usage/cache/limites des serveurs OSM. OSM2World peut inspirer l'extrusion, pas garantir un import natif Three.js.
3. Transformer coordonnées (lat/lon) vers repère local cohérent (ENU/Web Mercator contrôlé), avec tests de projection, axes, zoom et distances. Routes jouables ≠ distances à vol d'oiseau.
4. Introduire progressivement des **chunks** 3D avec cache, streaming, niveaux de détail et budgets GPU. Ne pas charger toutes les villes dans une scène.
5. Créer une identité régionale par climat, architecture, activités, marché et infrastructures documentés ; signaler les créations artistiques.
6. Commencer par deux quartiers réellement différents avec déplacement entre eux, puis généraliser sans casser la sauvegarde.

## Vérification
Confirmer l'origine, licence et précision des données, l'attribution ODbL le cas échéant, un rendu clair en PC et tactile, chargement progressif, collisions, et absence d'itinéraire inventé.
