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
│   └── 01_RDD.md         # 要求定義書
└── .github/               # GitHub設定
    └── agents/            # AIエージェント設定
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
- **環境変数**: ルートの `.env.local` に `GEMINI_API_KEY` を設定（オプション、アプリ起動時に読み込み）

## コーディングスタイルと命名規則

- **コンポーネント**: TypeScript + Reactフック、関数コンポーネント、`const` + アロー関数を推奨
- **フォーマット**: インデント2スペース、シングルクォート、適切な箇所で末尾カンマ
- **原則**: コンポーネントは小さく純粋に保つ、状態の直接変更を避ける
- **命名規則**:
  - コンポーネント・型: `PascalCase`
  - ヘルパー関数: `camelCase`
  - エクスポート定数: `SCREAMING_SNAKE_CASE`
  - `components/` 内のファイル: `PascalCase.tsx`
- **インポート**: パスエイリアス `@/*` (tsconfig) を使用
- **リンティング**: ESLint v9 flat config (`eslint.config.js`)、テストファイルも適切なグローバルでリント
- **型安全性**: TypeScript strict mode、jest-dom型は `tsconfig.json` で設定

## テストガイドライン

- **テストフレームワーク**: Vitest + React Testing Library (jsdom環境)
- **テスト構造**:
  - ユニットテスト: `tests/unit/` (例: `csvParser.test.ts`)
  - コンポーネントテスト: `tests/components/` (例: `BookForm.test.tsx`, `Modal.test.tsx`, `App.test.tsx`)
  - 統合テスト: `tests/integration/` (例: `csvFlow.test.tsx`, `storageFlow.test.tsx`)
- **テストコマンド**:
  - `npm test` - すべてのテストを実行
  - `npm run test:ui` - インタラクティブテストUI
  - `npm run test:coverage` - カバレッジレポートを生成
- **テスト命名**: `*.test.ts(x)` または `*.spec.ts(x)` パターンを使用
- **TDDアプローチ**: Red-Green-Refactorサイクルに従う、テストにGiven/When/Thenコメントを使用
- **テストセットアップ**: `tests/setup.ts` でjest-domマッチャーとクリーンアップを設定
- **テストレポート**: 詳細は `tests/TEST_REPORT.md` を参照
- **手動QA**: 複雑なUI操作やエッジケースについては手動QAも推奨

## コミットとプルリクエストガイドライン

- **コミットメッセージ**: 簡潔で命令形（例: `Add CSV error handling`）、関連する変更をまとめる
- **PR内容**: 短い要約、UI変更の主要なスクリーンショット/gif、明確な手動テスト手順（コマンド + 実行したシナリオ）、追跡イシューへのリンク

## 環境とデータに関する注意事項

- **データ永続化**: ユーザーデータは `localStorage` キー `my_library_books` と `my_library_activities` に永続化。変更は保存形式の後方互換性を維持する必要がある
- **CSVインポート**: `src/constants.ts` のシードデータと一致するヘッダーを期待。スキーマを変更する場合はシードとパーサーの両方を更新
- **ページネーション**: リストを調整する際は `ITEMS_PER_PAGE` ページネーション動作を維持
