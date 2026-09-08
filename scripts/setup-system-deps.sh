#!/usr/bin/env bash
# Installs the system-level dependencies StřihAI needs on a Debian/Ubuntu
# server: ffmpeg (cutting + burning captions) and yt-dlp (downloading video).
set -euo pipefail

echo "== Instaluji ffmpeg =="
apt-get update
apt-get install -y ffmpeg

echo "== Instaluji yt-dlp =="
pip3 install --break-system-packages --upgrade yt-dlp

echo "Hotovo. Dál spusť: npm run setup:whisper"
