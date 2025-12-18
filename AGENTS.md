# リポジトリガイドライン

## プロジェクト概要

CYSHELFは、サイバーパンク風のUIを持つ蔵書管理システムです。React + TypeScript + Viteで構築されたフロントエンド専用アプリケーションで、ブラウザのlocalStorageにデータを永続化します。

**主要機能:**
- 書籍の登録・削除・管理
- 検索・ソート機能
- お気に入り登録
- 読書状況管理（未読/読書中/読了）
- CSVインポート/エクスポート
- アクティビティログ

## 技術スタック

- **フロントエンドフレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 6
- **スタイリング**: Tailwind CSS
- **テストフレームワーク**: Vitest + React Testing Library (jsdom環境)
- **リンティング**: ESLint v9 (flat config)
- **型安全性**: TypeScript strict mode

## プロジェクト構造

### ディレクトリ構造

```
/
├── src/                    # ソースコード
│   ├── components/         # Reactコンポーネント
│   │   ├── BookForm.tsx   # 書籍登録フォーム
│   │   ├── Modal.tsx      # モーダルコンポーネント
│   │   └── Icons.tsx      # アイコンコンポーネント
│   ├── utils/             # ユーティリティ関数
│   │   └── csvParser.ts   # CSVパーサー
│   ├── App.tsx            # メインアプリケーション
│   ├── index.tsx          # エントリーポイント（マウント）
│   ├── constants.ts        # 共有定数・シードデータ
│   ├── types.ts           # 型定義
│   └── metadata.json      # メタデータ
├── tests/                 # テスト
│   ├── unit/              # ユニットテスト
│   ├── components/        # コンポーネントテスト
│   ├── integration/       # 統合テスト
│   ├── setup.ts           # テストセットアップ
│   └── TEST_REPORT.md     # テストレポート
├── docs/                  # ドキュメント
│   ├── 01_RDD.md         # 要求定義書
│   └── dev/              # 開発者向けドキュメント
│       ├── CODING_STANDARDS.md  # コーディング規約
│       └── GITHUB.md     # GitHub運用ガイド
└── .github/               # GitHub設定
    ├── agents/            # AIエージェント設定
    └── prompts/           # エージェントプロンプト
```

### 主要ファイル

- **`package.json`**: 依存関係とnpmスクリプト
- **`vite.config.ts`**: Viteビルド設定（パスエイリアス `@/*` → `./src/*`）
- **`tsconfig.json`**: TypeScript設定（strict mode、jest-dom型定義）
- **`eslint.config.js`**: ESLint v9 flat config
- **`vitest.config.ts`**: Vitest設定（jsdom環境、カバレッジ）
- **`index.html`**: 静的HTMLテンプレート
- **`src/index.tsx`**: アプリケーションエントリーポイント
- **`src/App.tsx`**: メインアプリケーションコンポーネント（localStorage永続化）

## セットアップ、ビルド、開発コマンド

- **依存関係インストール**: `npm install`（ルートから実行）
- **開発サーバー起動**: `npm run dev`（Vite開発サーバー、ホットリロード）
- **本番ビルド**: `npm run build`
- **ビルドプレビュー**: `npm run preview`
- **テスト実行**: `npm test`（全テスト実行）
- **テストUI**: `npm run test:ui`（インタラクティブUI）
- **カバレッジ**: `npm run test:coverage`（カバレッジレポート生成）
- **リント**: `npm run lint`
- **リント自動修正**: `npm run lint:fix`
- **環境変数**: このフロントエンドはクライアントバンドルに機密情報を含めない設計です。機密キーはサーバー側で管理してください。
  - ローカル開発で外部サービスと連携する必要がある場合は、テスト用の非機密トークンを使うか、安全なモックエンドポイントを利用してください。

## コーディングスタイルと命名規則

- **命名規則**: コンポーネント・型は`PascalCase`、ヘルパー関数は`camelCase`、エクスポート定数は`SCREAMING_SNAKE_CASE`
- **コード品質ツール**: ESLint v9 flat config、TypeScript strict mode
- **詳細**: コーディング規約の詳細は [docs/dev/CODING_STANDARDS.md](docs/dev/CODING_STANDARDS.md) を参照

## テストガイドライン

- **テストフレームワーク**: Vitest + React Testing Library (jsdom環境)
- **テスト構造**: ユニットテスト（`tests/unit/`）、コンポーネントテスト（`tests/components/`）、統合テスト（`tests/integration/`）
- **テストコマンド**: `npm test`（全テスト実行）、`npm run test:ui`（インタラクティブUI）、`npm run test:coverage`（カバレッジ）
- **TDDアプローチ**: Red-Green-Refactorサイクルに従う
- **詳細**: テストレポートと詳細は [tests/TEST_REPORT.md](tests/TEST_REPORT.md) を参照

## コミットとプルリクエストガイドライン

- **コミットメッセージ**: 簡潔で命令形（例: `CSVエラーハンドリングを追加`）、関連する変更をまとめる。日本語で記載
- **PR内容**: 短い要約、UI変更の主要なスクリーンショット/gif、明確な手動テスト手順（コマンド + 実行したシナリオ）、追跡イシューへのリンク
- **テンプレート**: Issue/PR作成時は`.github`配下のテンプレートを使用
- **GitHub CLI**: `gh`コマンドのインストールを推奨（Issue/PRの作成・管理が効率的）
- **詳細**: GitHub運用の詳細は開発者向けドキュメント [docs/dev/GITHUB.md](docs/dev/GITHUB.md) を参照

## 環境とデータに関する注意事項

- **データ永続化**: ユーザーデータは `localStorage` キー `my_library_books` と `my_library_activities` に永続化。変更は保存形式の後方互換性を維持する必要がある
- **CSVインポート**: `src/constants.ts` のシードデータと一致するヘッダーを期待。スキーマを変更する場合はシードとパーサーの両方を更新
- **ページネーション**: リストを調整する際は `ITEMS_PER_PAGE` ページネーション動作を維持
