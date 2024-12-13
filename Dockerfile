# Dockerfile for Next.js development environment
# Node.js LTSバージョンをベースイメージとして使用
# debian-slimはDebian系の軽量イメージ
FROM node:20-slim

# 作業ディレクトリの設定
WORKDIR /app


# システムの依存関係をインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# npmの設定を最適化
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-timeout 600000 && \
    npm config set registry https://registry.npmjs.org/



# パッケージファイルのコピー
COPY package*.json ./


# 依存関係のインストール
RUN npm install

# プロジェクトファイルのコピー
COPY . .



# MySQL関連の設定
# SSL証明書のコピー
ARG CERT_PATH=""
RUN if [ -n "$CERT_PATH" ] && [ -f "$CERT_PATH" ]; then \
    mkdir -p /app/certs && \
    cp "$CERT_PATH" /app/certs/DigiCertGlobalRootCA.crt.pem; \
fi


# 開発サーバーのポート
EXPOSE 3000

# # 開発サーバーの起動
# CMD ["npm", "run", "dev"]

# ビルド（Next.jsの場合）
RUN npm run build

# デフォルトのコマンド
CMD ["npm", "start"]