#!/usr/bin/env bash
# Assemble vidéo + audio et exporte des fichiers sans aucune métadonnée
# (pas d'encodeur, d'appareil, de date, d'historique d'édition ni de SEI x264).
set -euo pipefail
cd "$(dirname "$0")/out"

CLEAN=(-map_metadata -1 -map_chapters -1 -fflags +bitexact -flags:v +bitexact -flags:a +bitexact
       -metadata:s:v handler_name= -metadata:s:v encoder= -metadata:s:a handler_name= -metadata:s:v language=und -metadata:s:a language=und
       -bsf:v filter_units=remove_types=6 -movflags +faststart)

# TikTok : 1080x1920, H.264 High, 30 i/s, AAC 48 kHz
ffmpeg -v error -y -i video_silent.mp4 -i audio.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.1 -pix_fmt yuv420p -r 30 -g 60 \
  -c:a aac -b:a 192k -ar 48000 -shortest "${CLEAN[@]}" FaitiereHub_TikTok_1080x1920.mp4

# Statut WhatsApp : 720x1280, débit maîtrisé (WhatsApp recompresse moins un fichier déjà léger)
ffmpeg -v error -y -i video_silent.mp4 -i audio.wav -map 0:v -map 1:a \
  -vf scale=720:1280:flags=lanczos -c:v libx264 -preset slow -crf 21 -maxrate 3000k -bufsize 6000k \
  -profile:v high -level 3.1 -pix_fmt yuv420p -r 30 -g 60 \
  -c:a aac -b:a 128k -ar 44100 -shortest "${CLEAN[@]}" FaitiereHub_WhatsApp_720x1280.mp4

# Remux final : retire le dernier tag "encoder" ajouté par l'encodeur
for f in FaitiereHub_*.mp4; do
  ffmpeg -v error -y -i "$f" -map 0 -c copy -map_metadata -1 -fflags bitexact -flags bitexact -movflags +faststart "tmp_$f" && mv "tmp_$f" "$f"
done

for f in FaitiereHub_*.mp4; do
  echo "== $f"; ffprobe -v error -show_entries format=duration,size:format_tags:stream_tags -of compact "$f"
done
