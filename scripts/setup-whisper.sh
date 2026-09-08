#!/usr/bin/env bash
# Builds whisper.cpp and downloads a ggml speech-to-text model.
#
# Needs outbound internet access to github.com (clone + build) and to
# huggingface.co (model download) — both must be reachable from wherever
# you run this script.
#
# Usage: ./scripts/setup-whisper.sh [model]
#   model — one of whisper.cpp's ggml model names (default: base).
#           See https://github.com/ggml-org/whisper.cpp/blob/master/models/README.md
set -euo pipefail

MODEL="${1:-base}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR_DIR="$ROOT_DIR/vendor/whisper.cpp"
MODELS_DIR="$ROOT_DIR/models"

mkdir -p "$MODELS_DIR"

if [ ! -d "$VENDOR_DIR" ]; then
  echo "== Klonuji whisper.cpp =="
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git "$VENDOR_DIR"
fi

echo "== Kompiluji whisper-cli =="
cmake -B "$VENDOR_DIR/build" -S "$VENDOR_DIR" -DCMAKE_BUILD_TYPE=Release
cmake --build "$VENDOR_DIR/build" -j"$(nproc)" --target whisper-cli

echo "== Stahuji model '$MODEL' =="
bash "$VENDOR_DIR/models/download-ggml-model.sh" "$MODEL" "$MODELS_DIR"

BIN_PATH="$VENDOR_DIR/build/bin/whisper-cli"
MODEL_PATH="$MODELS_DIR/ggml-$MODEL.bin"

cat <<EOF

Hotovo! Do .env (nebo prostředí serveru) přidej:

  WHISPER_CPP_BIN=$BIN_PATH
  WHISPER_MODEL_PATH=$MODEL_PATH

EOF
