# データベースセットアップガイド

## 1. 必要なパッケージのインストール

```bash
# Prismaとデータベース関連パッケージのインストール
npm install mysql2 prisma @prisma/client
npm install --save-dev ts-node typescript @types/node
```

## 2. Prismaの初期化とスキーマ設定

```bash
# Prismaの初期化
npx prisma init
```

`prisma/schema.prisma`ファイルを以下のように設定：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
  directUrl = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  username      String    @unique
  password_hash String
  is_root       Boolean   @default(false)
  sessions      Session[]

  @@map("users")
}

model Session {
  id           String    @id @default(uuid())
  user_id      String
  start_time   DateTime  @default(now())
  total_tokens Int       @default(0)
  messages     Message[]
  user         User      @relation(fields: [user_id], references: [id])

  @@map("sessions")
}

model Message {
  id         String   @id @default(uuid())
  session_id String
  role       String   @db.VarChar(50)
  content    String   @db.Text
  timestamp  DateTime @default(now())
  session    Session  @relation(fields: [session_id], references: [id])

  @@map("messages")
}
```

## 3. 環境変数の設定

`.env`ファイルに以下を追加：

```env
DATABASE_URL="mysql://[username]:[password]@[host]:3306/[database]?sslaccept=strict&ssl=true"

# 例：
DATABASE_URL="mysql://qedxroot:your_password@qedx-sql.mysql.database.azure.com:3306/qedx_ai?sslaccept=strict&ssl=true"
```

## 4. データベースマイグレーション

```bash
# マイグレーションの実行
npx prisma migrate dev --name init

# Prismaクライアントの生成
npx prisma generate
```

## 5. 接続テストスクリプトの作成

`scripts/test-connection.ts`を作成：

```typescript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: {
        rejectUnauthorized: true
      }
    });

    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('Connection successful:', rows);
    await connection.end();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
```

## 6. 接続テストの実行

`package.json`にテストスクリプトを追加：

```json
{
  "scripts": {
    "test:db": "ts-node scripts/test-connection.ts"
  }
}
```

テストの実行：

```bash
npm run test:db
```

## 7. トラブルシューティング

### 一般的なエラーと解決方法

1. **接続エラー**
   - ファイアウォール設定の確認
   - データベースホスト名とポートの確認
   - ユーザー名とパスワードの確認

2. **SSL関連のエラー**
   - SSL証明書の配置確認
   - SSL設定のパラメータ確認

3. **権限エラー**
   - データベースユーザーの権限設定確認
   - データベースの存在確認

### 便利なPrismaコマンド

```bash
# データベーススキーマの確認
npx prisma db pull

# Prisma Studioの起動（GUIツール）
npx prisma studio

# マイグレーション履歴の確認
npx prisma migrate status
```

## 8. セキュリティ注意事項

- 本番環境の認証情報は必ず環境変数で管理
- `.env`ファイルはGitにコミットしない
- SSL/TLS接続を必ず使用
- データベースのバックアップを定期的に実施

## 9. 次のステップ

- ユーザー認証システムの実装
- セッション管理の実装
- メッセージングシステムの実装 