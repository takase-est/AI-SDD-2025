import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookForm } from '@/components/BookForm';

describe('BookForm', () => {
  // Given: 全項目に有効な値が入力されている
  // When: フォームを送信する
  // Then: onSubmitが正しいデータで呼ばれる
  it('should submit form with all fields filled', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Fill all fields
    await user.type(screen.getByLabelText(/タイトル/i), 'Test Book');
    await user.type(screen.getByLabelText(/著者/i), 'Test Author');
    await user.type(screen.getByLabelText(/出版社/i), 'Test Publisher');
    await user.clear(screen.getByLabelText(/出版年/i));
    await user.type(screen.getByLabelText(/出版年/i), '2020');
    await user.type(screen.getByLabelText(/ISBN/i), '9781234567890');
    await user.selectOptions(screen.getByLabelText(/ステータス/i), 'read');

    // Submit form
    await user.click(screen.getByRole('button', { name: /保存する/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test Book',
      author: 'Test Author',
      publisher: 'Test Publisher',
      publishedYear: 2020,
      isbn: '9781234567890',
      status: 'read',
      isFavorite: false,
    });
  });

  // Given: 必須項目（title, author, publishedYear）のみが入力されている
  // When: フォームを送信する
  // Then: onSubmitが正しいデータで呼ばれる
  it('should submit form with required fields only', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Fill only required fields
    await user.type(screen.getByLabelText(/タイトル/i), 'Test Book');
    await user.type(screen.getByLabelText(/著者/i), 'Test Author');
    const yearInput = screen.getByLabelText(/出版年/i);
    await user.clear(yearInput);
    await user.type(yearInput, '2020');

    // Submit form
    await user.click(screen.getByRole('button', { name: /保存する/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test Book',
      author: 'Test Author',
      publisher: '',
      publishedYear: 2020,
      isbn: '',
      status: 'unread',
      isFavorite: false,
    });
  });

  // Given: タイトルが空文字列
  // When: フォームを送信しようとする
  // Then: フォーム送信が阻止される（HTML5バリデーション）
  it('should prevent submission when title is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Fill only author and year, leave title empty
    await user.type(screen.getByLabelText(/著者/i), 'Test Author');
    const yearInput = screen.getByLabelText(/出版年/i);
    await user.clear(yearInput);
    await user.type(yearInput, '2020');

    // Try to submit form
    const submitButton = screen.getByRole('button', { name: /保存する/i });
    await user.click(submitButton);

    // HTML5 validation should prevent submission
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Given: 著者が空文字列
  // When: フォームを送信しようとする
  // Then: フォーム送信が阻止される（HTML5バリデーション）
  it('should prevent submission when author is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Fill only title and year, leave author empty
    await user.type(screen.getByLabelText(/タイトル/i), 'Test Book');
    const yearInput = screen.getByLabelText(/出版年/i);
    await user.clear(yearInput);
    await user.type(yearInput, '2020');

    // Try to submit form
    const submitButton = screen.getByRole('button', { name: /保存する/i });
    await user.click(submitButton);

    // HTML5 validation should prevent submission
    expect(onSubmit).not.toHaveBeenCalled();
  });

  // Given: キャンセルボタンがクリックされる
  // When: キャンセルボタンをクリックする
  // Then: onCancelが呼ばれる
  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(<BookForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Click cancel button
    await user.click(screen.getByRole('button', { name: /キャンセル/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

