export type ReadStatus = 'unread' | 'reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishedYear: number;
  isbn: string;
  status: ReadStatus;
  isFavorite: boolean;
  addedAt: string;
}

export type SortKey = keyof Omit<Book, 'id'>;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export type ActivityType = 'add' | 'delete' | 'status' | 'favorite' | 'import' | 'export' | 'system';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}