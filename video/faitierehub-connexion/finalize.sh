#!/usr/bin/env bash
# Assemble image + son pour v1 et v2, exporte TikTok (1080p) et Statut WhatsApp (720p), sans aucune métadonnée.
set -euo pipefail
cd "$(dirname "$0")/out"
declare -A NAME=([v1]=FaitiereHub_Connexion_Gestionnaires [v2]=FaitiereHub_Connexion_Carte_PIN)
for v in "${!NAME[@]}"; do
  [ -f "${v}_silent.mp4" ] || continue
  n=${NAME[$v]}
  ffmpeg -v error -y -i "${v}_silent.mp4" -i "${v}_audio.wav" -map 0:v -map 1:a \
    -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 -g 60 \
    -c:a aac -b:a 192k -ar 48000 -shortest -flags:v +bitexact -flags:a +bitexact -fflags +bitexact -bsf:v filter_units=remove_types=6 tmp.mp4
  ffmpeg -v error -y -i tmp.mp4 -map 0 -c copy -map_metadata -1 -fflags bitexact -flags bitexact -movflags +faststart "${n}_TikTok_1080x1920.mp4"
  ffmpeg -v error -y -i "${v}_silent.mp4" -i "${v}_audio.wav" -map 0:v -map 1:a -vf scale=720:1280:flags=lanczos \
    -c:v libx264 -preset slow -crf 21 -maxrate 3000k -bufsize 6000k -profile:v high -level 3.1 -pix_fmt yuv420p -r 30 -g 60 \
    -c:a aac -b:a 128k -ar 44100 -shortest -flags:v +bitexact -flags:a +bitexact -fflags +bitexact -bsf:v filter_units=remove_types=6 tmp.mp4
  ffmpeg -v error -y -i tmp.mp4 -map 0 -c copy -map_metadata -1 -fflags bitexact -flags bitexact -movflags +faststart "${n}_WhatsApp_720x1280.mp4"
  rm -f tmp.mp4
done
for f in FaitiereHub_Connexion_*.mp4; do
  printf '%s  %s s  %s Mo  traces:%s\n' "$f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")" \
    "$(( $(stat -c %s "$f") / 1048576 ))" "$(strings "$f" | grep -ciE 'x264|lavf|lavc' || true)"
done
