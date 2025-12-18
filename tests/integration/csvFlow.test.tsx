import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '@/App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  },
});

// Mock FileReader
global.FileReader = class FileReader {
  result: string | null = null;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  
  readAsText(_file: Blob) {
    // Simulate async read
    setTimeout(() => {
      if (this.onload) {
        this.result = 'title,author,publisher,publishedYear,isbn,status,isFavorite\nTest Book,Test Author,Test Publisher,2024,9781234567890,read,true';
        this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
      }
    }, 10);
  }
} as typeof FileReader;

// Mock alert
global.alert = vi.fn();

describe('CSV Import/Export Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Given: 有効なCSVファイルがある
  // When: CSVファイルをインポートする
  // Then: 書籍が追加され、追加件数とスキップ件数が表示される
  it('should import CSV file and show added/skipped counts', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/ダッシュボード/i)).toBeInTheDocument();
    });

    // Create a mock CSV file
    const csvContent = 'title,author,publisher,publishedYear,isbn,status,isFavorite\nTest Book,Test Author,Test Publisher,2024,9781234567890,read,true';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

    // Find file input (hidden)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    // Simulate file selection
    await user.upload(fileInput, file);

    // Wait for import to complete
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    }, { timeout: 2000 });

    // Verify book was added
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  // Given: 書籍が登録されている
  // When: CSVエクスポートを実行する
  // Then: CSVファイルがダウンロードされる
  it('should export books to CSV file', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/ダッシュボード/i)).toBeInTheDocument();
    });

    // Add a book first
    const addButton = screen.getByRole('button', { name: /本を追加/i });
    await user.click(addButton);
    await user.type(screen.getByLabelText(/タイトル/i), 'Export Test Book');
    await user.type(screen.getByLabelText(/著者/i), 'Export Author');
    const yearInput = screen.getByLabelText(/出版年/i);
    await user.clear(yearInput);
    await user.type(yearInput, '2024');
    await user.click(screen.getByRole('button', { name: /保存する/i }));

    await waitFor(() => {
      expect(screen.getByText('Export Test Book')).toBeInTheDocument();
    });

    // Mock URL.createObjectURL and URL.revokeObjectURL
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    // Find export button by text "CSV保存"
    const exportButton = screen.getByRole('button', { name: /CSV保存/i });
    await user.click(exportButton);

    // Verify export was triggered (createObjectURL should be called)
    // Note: This might be called synchronously, so we check immediately
    expect(createObjectURLSpy).toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });
});

