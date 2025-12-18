# コーディング規約

このドキュメントは、CYSHELFプロジェクトのコーディングスタイルと命名規則を定義します。

## コンポーネント

- TypeScript + Reactフックを使用
- 関数コンポーネントを推奨
- `const` + アロー関数を推奨
- コンポーネントは小さく純粋に保つ
- 状態の直接変更を避ける

## フォーマット

- インデント: 2スペース
- クォート: シングルクォート
- 末尾カンマ: 適切な箇所で使用

## 命名規則

### コンポーネント・型
- `PascalCase`を使用
- 例: `BookForm`, `Modal`, `BookType`

### ヘルパー関数
- `camelCase`を使用
- 例: `parseCSV`, `generateId`

### エクスポート定数
- `SCREAMING_SNAKE_CASE`を使用
- 例: `ITEMS_PER_PAGE`, `DEFAULT_CONFIG`

### ファイル名
- `components/` 内のファイル: `PascalCase.tsx`
- 例: `BookForm.tsx`, `Modal.tsx`

## インポート

- パスエイリアス `@/*` (tsconfig) を使用
- 例: `import { Book } from '@/types';`

## リンティング

- ESLint v9 flat config (`eslint.config.js`)
- テストファイルも適切なグローバルでリント

## 型安全性

- TypeScript strict modeを有効化
- jest-dom型は `tsconfig.json` で設定

