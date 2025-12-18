import { Book, ReadStatus } from '../types';

export const parseCSV = (csvText: string): Book[] => {
  const lines = csvText.trim().split('\n');
  
  // Skip header row and map the rest
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    
    // Ensure we have enough values, fill with defaults if missing
    const title = values[0]?.trim() || 'Unknown Title';
    const author = values[1]?.trim() || 'Unknown Author';
    const publisher = values[2]?.trim() || 'Unknown Publisher';
    const publishedYear = parseInt(values[3]?.trim() || '0', 10);
    const isbn = values[4]?.trim() || '';
    
    let status: ReadStatus = 'unread';
    const rawStatus = values[5]?.trim().toLowerCase();
    if (rawStatus === 'read' || rawStatus === 'reading' || rawStatus === 'unread') {
      status = rawStatus as ReadStatus;
    }

    const isFavorite = values[6]?.trim().toLowerCase() === 'true';

    const book: Book = {
      id: `import-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      author,
      publisher,
      publishedYear,
      isbn,
      status,
      isFavorite,
      addedAt: new Date().toISOString(),
    };
    return book;
  }).filter(b => b.title !== 'Unknown Title');
};

export const generateCSV = (books: Book[]): string => {
  const headers = ['title', 'author', 'publisher', 'publishedYear', 'isbn', 'status', 'isFavorite'];
  const rows = books.map(book => {
    return [
      book.title,
      book.author,
      book.publisher,
      book.publishedYear,
      book.isbn,
      book.status,
      book.isFavorite
    ].map(value => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};