# CYSHELF - 蔵書管理システム

サイバーパンク風のUIを持つ蔵書管理システムです。

## 機能

- 📚 書籍の登録・削除・管理
- 🔍 検索・ソート機能
- ⭐ お気に入り登録
- 📊 読書状況管理（未読/読書中/読了）
- 📥 CSVインポート/エクスポート
- 📝 アクティビティログ

## 技術スタック

- React 19 + TypeScript
- Vite 6
- Tailwind CSS

## セットアップ

**前提条件:** Node.js

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 環境変数の設定（オプション）:
   `.env.local` ファイルを作成し、`GEMINI_API_KEY` を設定してください。

3. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

4. ビルド:
   ```bash
   npm run build
   ```

5. プレビュー:
   ```bash
   npm run preview
   ```

## プロジェクト構造

```
/
├── src/              # ソースコード
│   ├── components/   # Reactコンポーネント
│   ├── utils/        # ユーティリティ関数
│   ├── App.tsx       # メインアプリケーション
│   └── index.tsx     # エントリーポイント
├── docs/             # ドキュメント
├── package.json      # 依存関係とスクリプト
├── vite.config.ts    # Vite設定
└── tsconfig.json     # TypeScript設定
```

## データ保存

データはブラウザの `localStorage` に保存されます。定期的にCSVエクスポートでバックアップを取ることを推奨します。

