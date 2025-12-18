import { Book, ReadStatus } from '../types';

const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else if (!inQuotes) {
        // Start of quoted field
        inQuotes = true;
      } else {
        // End of quoted field
        inQuotes = false;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  values.push(current);
  return values;
};

const splitCSVLines = (csvText: string): string[] => {
  const lines: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote - keep both quotes for parseCSVLine to handle
        current += '""';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        current += char;
      }
    } else if (char === '\n' && !inQuotes) {
      // Line separator (only when not in quotes)
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last line
  if (current.trim()) {
    lines.push(current);
  }
  
  return lines;
};

export const parseCSV = (csvText: string): Book[] => {
  const lines = splitCSVLines(csvText.trim());
  
  // Skip header row and map the rest
  return lines.slice(1).map((line, index) => {
    const values = parseCSVLine(line);
    
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