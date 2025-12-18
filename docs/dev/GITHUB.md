# GitHub運用ガイド

## 概要

このリポジトリでは、Conventional Commits形式のGitHub Labelを使用して、IssueやPull Requestを分類・管理しています。また、ブランチ命名規則を定めることで、ブランチの目的を明確にし、一貫性を保っています。

## ラベル一覧

### 変更の種類（Type）

- **`feat`** - 新機能（緑系: `#0e8a16`）
  - 新しい機能や機能拡張を実装する場合に使用
  - 例: 新しいAPI エンドポイントの追加、新しいUI コンポーネントの実装

- **`fix`** - バグ修正（赤系: `#d73a4a`）
  - バグや不具合の修正に使用
  - 例: クラッシュの修正、誤った動作の是正

- **`docs`** - ドキュメントのみの変更（青系: `#0075ca`）
  - コードに影響しないドキュメントの追加・修正に使用
  - 例: README の更新、コメントの追加、API ドキュメントの改善

- **`style`** - コードの動作に影響しない変更（グレー系: `#c5def5`）
  - フォーマット、空白、セミコロンなど、ロジックに影響しない変更
  - 例: コードフォーマットの統一、インデントの修正

- **`refactor`** - バグ修正や機能追加を伴わないコードの変更（紫系: `#a2eeef`）
  - コードの内部構造を改善する変更
  - 例: 関数の分割、変数名の改善、アーキテクチャの見直し

- **`perf`** - パフォーマンス改善（オレンジ系: `#fbca04`）
  - 実行速度やメモリ使用量の改善に使用
  - 例: アルゴリズムの最適化、キャッシュの導入

- **`test`** - テストの追加・修正（緑系: `#0e8a16`）
  - テストコードの追加や修正に使用
  - 例: ユニットテストの追加、E2E テストの改善

- **`build`** - ビルドシステムや外部依存関係の変更（茶系: `#d876e3`）
  - ビルド設定や依存パッケージの変更に使用
  - 例: package.json の更新、webpack 設定の変更

- **`ci`** - CI/CD設定やスクリプトの変更（青系: `#1d76db`）
  - 継続的インテグレーション・デプロイの設定変更に使用
  - 例: GitHub Actions の追加・修正、デプロイスクリプトの更新

- **`chore`** - その他の変更（グレー系: `#ffffff`）
  - 上記のいずれにも該当しない変更に使用
  - 例: .gitignore の更新、設定ファイルの微調整

- **`revert`** - 以前のコミットの取り消し（グレー系: `#ffffff`）
  - 過去のコミットやマージを取り消す場合に使用
  - 例: 問題のあるマージの revert

### 作業項目（Task）

- **`task`** - 開発タスクや改善タスク（青系: `#1d76db`）
  - Task Issueに関連するPRで使用
  - 実際の変更内容に応じて`feat`、`fix`、`refactor`などと併用可能
  - 例: Issue #123 の実装タスク

## 使い方

### Issueでの使用

Issue を作成する際、適切なラベルを付与してください。

**例:**
- バグ報告の Issue → `fix` ラベル
- 機能要望の Issue → `feat` ラベル
- ドキュメント改善の Issue → `docs` ラベル
- Task Issue → `task` ラベル

### Pull Requestでの使用

PR を作成する際、変更内容に応じたラベルを付与してください。

**例:**
- 新機能を実装した PR → `feat` ラベル
- バグを修正した PR → `fix` ラベル
- リファクタリングした PR → `refactor` ラベル

### ラベルの併用

複数のラベルを併用することで、より詳細な分類が可能です。

**推奨される併用パターン:**

1. **Task Issue 関連の PR**
   - `task` + `feat`: Task Issue で新機能を実装した場合
   - `task` + `fix`: Task Issue でバグ修正を行った場合
   - `task` + `refactor`: Task Issue でリファクタリングを行った場合

2. **複数の変更を含む PR**
   - `feat` + `docs`: 新機能の実装とドキュメントの追加
   - `fix` + `test`: バグ修正とテストの追加
   - `refactor` + `perf`: リファクタリングとパフォーマンス改善

**注意:** 基本的には1つのPRで1つの目的を達成することを推奨します。複数のラベルが必要な場合は、PRを分割できないか検討してください。

## ラベルの管理

### 新規ラベルの追加

新規ラベルを追加する場合は、`gh label create` コマンドを使用してください：

```bash
gh label create <ラベル名> --description "<説明>" --color <色コード>
```

**例:**
```bash
gh label create feat --description "新機能" --color "0e8a16"
```

### 既存ラベルの更新

既存ラベルの説明や色を変更する場合は、`gh label edit` コマンドを使用してください：

```bash
gh label edit <ラベル名> --description "<説明>" --color <色コード>
```

**例:**
```bash
gh label edit feat --description "新機能の追加" --color "0e8a16"
```

### ラベルの確認

特定のラベルの詳細を確認する場合は、`gh label view` コマンドを使用してください：

```bash
gh label view <ラベル名>
```

すべてのラベルの一覧を確認する場合は：

```bash
gh label list
```

### 不要なラベルの削除

不要なラベルを削除する場合は、`gh label delete` コマンドを使用してください：

```bash
gh label delete <ラベル名>
```

**注意:** 削除前に、そのラベルが使用されているIssueやPRがないか確認してください。

## ベストプラクティス

### 1. ラベルは早めに付与する

Issue や PR を作成したら、すぐに適切なラベルを付与しましょう。後から付与すると忘れがちです。

### 2. 一貫性を保つ

チーム全体で同じ基準でラベルを使用するように心がけましょう。以下の方針を推奨します:
- **ラベル名はConventional Commitsに準拠**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `task` などを主要カテゴリとして使用してください。
- **重複ラベルの統合**: `documentation` → `docs`, `bug` → `fix`, `enhancement` → `feat` のように古いラベルは統合してください。
- **言語の一貫性**: ラベル名は英語（短いキーワード）で統一し、説明はプロジェクトの主要言語（英語/日本語）で統一してください。

### 3. Task Issue の DoD を確認

Task Issue に関連する PR を作成する場合は、Issue に記載されている完了条件・受け入れ基準（DoD）をすべて満たしていることを確認してください。

### 4. PR テンプレートを活用

PR テンプレートには Conventional Commits 形式のチェックリストが含まれています。適切な項目にチェックを入れて、対応するラベルを付与してください。

### 5. 複雑な変更は分割

1つの PR で複数の種類の変更を行う場合、可能であれば複数の PR に分割することを検討してください。レビューがしやすくなります。

## ブランチ命名規則

### 基本形式

ブランチ名は以下の形式に従ってください：

```
<type>/<description>
```

- **`<type>`**: Conventional Commits形式のタイプ（例: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`など）
- **`<description>`**: 簡潔な説明（ハイフン区切り、小文字推奨）

### 使用可能なタイプ

ラベル一覧の「変更の種類（Type）」セクションを参照してください：
- `feat` - 新機能
- `fix` - バグ修正
- `docs` - ドキュメントのみの変更
- `style` - コードの動作に影響しない変更
- `refactor` - リファクタリング
- `perf` - パフォーマンス改善
- `test` - テストの追加・修正
- `build` - ビルドシステムや外部依存関係の変更
- `ci` - CI/CD設定やスクリプトの変更
- `chore` - その他の変更
- `revert` - 以前のコミットの取り消し

### 命名例

**基本的な形式:**
- `feat/add-csv-import` - CSVインポート機能の追加
- `fix/modal-close-bug` - モーダルクローズのバグ修正
- `docs/update-github-guide` - GitHub運用ガイドの更新
- `refactor/extract-utils` - ユーティリティ関数の抽出
- `test/add-component-tests` - コンポーネントテストの追加

**Issue番号を含める場合:**
```
<type>/<issue-number>-<description>
```

- `feat/123-add-csv-import` - Issue #123 に関連するCSVインポート機能の追加
- `fix/456-modal-close-bug` - Issue #456 に関連するモーダルクローズのバグ修正

### 命名規則のチェックポイント

1. **タイプの一貫性**: ラベルと同じタイプを使用する
2. **説明の明確性**: ブランチの目的が一目で分かる説明を付ける
3. **命名の簡潔性**: 長すぎる説明は避け、必要最小限の情報を含める
4. **大文字小文字**: 小文字とハイフンを使用（例: `add-csv-import`、`update-readme`）

### ベストプラクティス

- **1つのブランチで1つの目的**: 1つのブランチで複数の種類の変更を行わない
- **Issue番号の活用**: 関連するIssueがある場合は、Issue番号を含めることで追跡しやすくなる
- **マージ後の削除**: マージが完了したブランチは削除する

## 参考資料

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Labels Guide](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [GitHub CLI Labels](https://cli.github.com/manual/gh_label)

## 質問・改善提案

このドキュメントに関する質問や改善提案がある場合は、Issue を作成してください（`docs` ラベルを付与）。
