# LIVE228 Clash Android

Application Android compagnon pour lancer LIVE228 Clash depuis un téléphone Android sans PC.

## Fonctionnement

- L'APK ouvre le jeu local sur `http://127.0.0.1:2280/`.
- Le moteur TikTok tourne dans Termux avec le projet LIVE228 v0.2.
- Le bouton TikTok ouvre l'application TikTok.
- Pour diffuser le jeu depuis le même téléphone, utiliser le mode jeu/partage d'écran de TikTok LIVE lorsque cette option est disponible sur le compte.

## Démarrer le moteur

```bash
cd ~/live228-clash-v02-termux
./start-termux.sh
```

Puis ouvrir l'APK LIVE228 Clash.

> Le connecteur TikTok utilisé par le moteur est non officiel et peut cesser de fonctionner si TikTok modifie son service WebCast.
