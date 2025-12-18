# テストディレクトリ構造

このディレクトリには、プロジェクトのすべてのテストファイルが含まれています。

## ディレクトリ構成

```
tests/
├── unit/              # ユニットテスト（ユーティリティ関数、ロジックなど）
├── components/        # コンポーネントテスト（React Testing Library）
├── integration/      # 統合テスト（複数のモジュールを組み合わせたテスト）
└── setup.ts          # テスト環境のセットアップ
```

## テストファイルの命名規則

- ユニットテスト: `*.test.ts`
- コンポーネントテスト: `*.test.tsx`
- 統合テスト: `*.test.ts` または `*.spec.ts`

## 実行方法

```bash
# ウォッチモードで実行
npm run test

# UIモードで実行
npm run test:ui

# 一度だけ実行
npm run test:run

# カバレッジ付きで実行
npm run test:coverage
```

## テストの書き方

### ユニットテストの例

```typescript
// tests/unit/csvParser.test.ts
import { describe, it, expect } from 'vitest';
import { parseCSV } from '@/utils/csvParser';

describe('parseCSV', () => {
  it('should parse valid CSV', () => {
    const csv = 'title,author\nBook1,Author1';
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
  });
});
```

### コンポーネントテストの例

```typescript
// tests/components/BookForm.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookForm } from '@/components/BookForm';

describe('BookForm', () => {
  it('should render form fields', () => {
    render(<BookForm onSubmit={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText(/タイトル/i)).toBeInTheDocument();
  });
});
```

