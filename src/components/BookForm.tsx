import React, { useState } from 'react';
import { Book, ReadStatus } from '../types';

interface BookFormProps {
  onSubmit: (book: Omit<Book, 'id' | 'addedAt'>) => void;
  onCancel: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publishedYear: new Date().getFullYear(),
    isbn: '',
    status: 'unread' as ReadStatus,
    isFavorite: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "mt-1 block w-full bg-dark-900 border border-slate-700 text-slate-200 placeholder-slate-600 px-3 py-2 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue focus:outline-none sm:text-sm transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className={labelClass}>タイトル</label>
        <input
          type="text"
          id="title"
          required
          className={inputClass}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="author" className={labelClass}>著者</label>
        <input
          type="text"
          id="author"
          required
          className={inputClass}
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="publisher" className={labelClass}>出版社</label>
          <input
            type="text"
            id="publisher"
            className={inputClass}
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="year" className={labelClass}>出版年</label>
          <input
            type="number"
            id="year"
            min="1000"
            max={new Date().getFullYear() + 1}
            required
            className={inputClass}
            value={formData.publishedYear}
            onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="isbn" className={labelClass}>ISBN</label>
          <input
            type="text"
            id="isbn"
            placeholder="978-4-00-310101-8"
            className={inputClass}
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>ステータス</label>
          <select
            id="status"
            className={inputClass}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ReadStatus })}
          >
            <option value="unread">未読</option>
            <option value="reading">読書中</option>
            <option value="read">読了</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-slate-800 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-transparent hover:border-slate-600 transition-all uppercase tracking-wide"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="bg-neon-blue/10 border border-neon-blue text-neon-blue px-6 py-2 text-sm font-bold uppercase tracking-wide hover:bg-neon-blue hover:text-black hover:shadow-neon-blue transition-all"
        >
          保存する
        </button>
      </div>
    </form>
  );
};