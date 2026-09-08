# Builds whisper.cpp (speech-to-text) and downloads its AI model.
# This stage needs real internet access to github.com and huggingface.co,
# which the deploy platform's build environment has (unlike some local
# sandboxes that block those hosts by policy).
FROM node:20-bookworm AS whisper-builder

RUN apt-get update && apt-get install -y --no-install-recommends \
      git cmake build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt
RUN git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git

RUN cmake -B whisper.cpp/build -S whisper.cpp -DCMAKE_BUILD_TYPE=Release \
    && cmake --build whisper.cpp/build -j"$(nproc)" --target whisper-cli

# "base" is a reasonable accuracy/speed tradeoff for CPU-only transcription.
RUN bash whisper.cpp/models/download-ggml-model.sh base whisper.cpp/models

# ---------------------------------------------------------------------------

FROM node:20-bookworm-slim AS app

RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg python3 python3-pip ca-certificates \
    && pip3 install --break-system-packages --no-cache-dir yt-dlp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

COPY --from=whisper-builder /opt/whisper.cpp/build/bin/whisper-cli /usr/local/bin/whisper-cli
COPY --from=whisper-builder /opt/whisper.cpp/models/ggml-base.bin /app/models/ggml-base.bin

ENV NODE_ENV=production \
    YTDLP_BIN=yt-dlp \
    FFMPEG_BIN=ffmpeg \
    FFPROBE_BIN=ffprobe \
    WHISPER_CPP_BIN=/usr/local/bin/whisper-cli \
    WHISPER_MODEL_PATH=/app/models/ggml-base.bin

EXPOSE 3000

# Deploy platforms (Railway, Render, Fly.io, ...) inject $PORT — bind to it.
CMD ["sh", "-c", "./node_modules/.bin/next start -p ${PORT:-3000}"]
