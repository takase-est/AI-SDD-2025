import { describe, it, expect } from 'vitest';
import { parseCSV, generateCSV } from '@/utils/csvParser';
import type { Book } from '@/types';

describe('csvParser', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV with headers', () => {
      const csv = `title,author,publisher,publishedYear,isbn,status,isFavorite
Book1,Author1,Publisher1,2020,9781234567890,read,true`;
      
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Book1',
        author: 'Author1',
        publisher: 'Publisher1',
        publishedYear: 2020,
        isbn: '9781234567890',
        status: 'read',
        isFavorite: true,
      });
      expect(result[0].id).toBeDefined();
      expect(result[0].addedAt).toBeDefined();
    });

    it('should handle empty CSV', () => {
      const csv = 'title,author,publisher,publishedYear,isbn,status,isFavorite';
      const result = parseCSV(csv);
      expect(result).toHaveLength(0);
    });

    it('should handle missing optional fields', () => {
      const csv = `title,author,publisher,publishedYear,isbn,status,isFavorite
Book1,Author1,,,9781234567890,unread,false`;
      
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(1);
      // 実装では空文字列の場合にデフォルト値が設定される
      expect(result[0].publisher).toBe('Unknown Publisher');
      expect(result[0].publishedYear).toBe(0);
    });
  });

  describe('generateCSV', () => {
    it('should generate valid CSV from books array', () => {
      const books: Book[] = [
        {
          id: '1',
          title: 'Book1',
          author: 'Author1',
          publisher: 'Publisher1',
          publishedYear: 2020,
          isbn: '9781234567890',
          status: 'read',
          isFavorite: true,
          addedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Book2',
          author: 'Author2',
          publisher: 'Publisher2',
          publishedYear: 2021,
          isbn: '9780987654321',
          status: 'unread',
          isFavorite: false,
          addedAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      const csv = generateCSV(books);
      
      expect(csv).toContain('title,author,publisher,publishedYear,isbn,status,isFavorite');
      expect(csv).toContain('Book1,Author1,Publisher1,2020,9781234567890,read,true');
      expect(csv).toContain('Book2,Author2,Publisher2,2021,9780987654321,unread,false');
    });

    it('should handle empty books array', () => {
      const csv = generateCSV([]);
      // 実装ではヘッダーのみが返される（改行なし）
      expect(csv).toBe('title,author,publisher,publishedYear,isbn,status,isFavorite');
    });
  });
});

