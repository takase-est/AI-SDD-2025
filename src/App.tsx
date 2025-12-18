import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Book, SortConfig, SortKey, ReadStatus, ActivityLog, ActivityType } from './types';
import { CSV_SEED_DATA, ITEMS_PER_PAGE, INITIAL_ACTIVITIES } from './constants';
import { parseCSV, generateCSV } from './utils/csvParser';
import { 
  SearchIcon, PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, 
  SortIcon, SortAscIcon, SortDescIcon, BookOpenIcon, 
  HomeIcon, ChartBarIcon, UploadIcon, DownloadIcon, MenuIcon, HeartIcon, HelpIcon, ActivityIcon
} from './components/Icons';
import { Modal } from './components/Modal';
import { BookForm } from './components/BookForm';

const App: React.FC = () => {
  // --- State ---
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('my_library_books');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
      return parseCSV(CSV_SEED_DATA);
    } catch (e) {
      console.error("Failed to load data", e);
      return parseCSV(CSV_SEED_DATA);
    }
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('my_library_activities');
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_ACTIVITIES;
    } catch (e) {
      return INITIAL_ACTIVITIES;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'addedAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'activity' | 'help'>('dashboard');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('my_library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('my_library_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // --- Logic ---

  const logActivity = (type: ActivityType, message: string) => {
    const newLog: ActivityLog = {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newLog, ...prev]);
  };

  // 1. Statistics
  const stats = useMemo(() => {
    const total = books.length;
    
    // Status counts
    const readCount = books.filter(b => b.status === 'read').length;
    const readingCount = books.filter(b => b.status === 'reading').length;
    const unreadCount = books.filter(b => b.status === 'unread').length;

    // Favorites count
    const favoriteCount = books.filter(b => b.isFavorite).length;

    return { total, favoriteCount, readCount, readingCount, unreadCount };
  }, [books]);

  // 2. Filter
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const lowerQuery = searchQuery.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      (book.publisher && book.publisher.toLowerCase().includes(lowerQuery)) ||
      (book.isbn && book.isbn.toLowerCase().includes(lowerQuery))
    );
  }, [books, searchQuery]);

  // 3. Sort
  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredBooks, sortConfig]);

  // 4. Paginate
  const totalPages = Math.ceil(sortedBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedBooks.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedBooks, currentPage]);

  // --- Handlers ---

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddBook = (newBookData: Omit<Book, 'id' | 'addedAt'>) => {
    const newBook: Book = {
      ...newBookData,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString()
    };
    setBooks(prev => [newBook, ...prev]);
    logActivity('add', `「${newBook.title}」を新規登録しました`);
    setIsModalOpen(false);
  };

  const onRequestDelete = (book: Book) => {
    setDeleteTarget(book);
  };

  const executeDelete = () => {
    if (deleteTarget) {
      setBooks(prev => prev.filter(b => b.id !== deleteTarget.id));
      logActivity('delete', `「${deleteTarget.title}」を削除しました`);
      if (paginatedBooks.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
      setDeleteTarget(null);
    }
  };

  const statusLabels: Record<ReadStatus, string> = {
    unread: '未読',
    reading: '読書中',
    read: '読了',
  };

  const handleStatusChange = (id: string, newStatus: ReadStatus) => {
    const book = books.find(b => b.id === id);
    if (book) {
      setBooks(prev => prev.map(b => 
        b.id === id ? { ...b, status: newStatus } : b
      ));
      logActivity('status', `「${book.title}」の状態を更新しました (${statusLabels[newStatus]})`);
    }
  };

  const handleToggleFavorite = (id: string) => {
    const book = books.find(b => b.id === id);
    if (book) {
      const newFavStatus = !book.isFavorite;
      setBooks(prev => prev.map(b => 
        b.id === id ? { ...b, isFavorite: newFavStatus } : b
      ));
      logActivity('favorite', `「${book.title}」をお気に入り${newFavStatus ? 'に登録' : 'から解除'}しました`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('データを初期状態に戻しますか？すべての変更が失われます。')) {
      setBooks(parseCSV(CSV_SEED_DATA));
      setActivities(INITIAL_ACTIVITIES);
      setSearchQuery('');
      setSortConfig({ key: 'addedAt', direction: 'desc' });
      setCurrentPage(1);
      logActivity('system', 'データを初期化しました');
    }
  };

  // CSV Import
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          const parsedBooks = parseCSV(content);
          
          let addedCount = 0;
          let skippedCount = 0;
          
          setBooks(prevBooks => {
            const newBooks = [...prevBooks];
            
            parsedBooks.forEach(newBook => {
              const exists = prevBooks.some(
                existing => existing.title === newBook.title && existing.author === newBook.author
              );
              
              if (!exists) {
                newBooks.unshift(newBook); 
                addedCount++;
              } else {
                skippedCount++;
              }
            });
            return newBooks;
          });

          logActivity('import', `CSVインポートを実行しました (追加: ${addedCount}件, スキップ: ${skippedCount}件)`);
          alert(`インポート完了\n追加: ${addedCount}件\nスキップ: ${skippedCount}件`);
        } catch (err) {
          console.error(err);
          alert('エラー: ファイル形式が正しくありません。');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // CSV Export
  const handleExportCSV = () => {
    const csvContent = generateCSV(books);
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Library_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('export', 'CSVエクスポートを実行しました');
  };

  // --- Render Helpers ---

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <SortIcon className="h-4 w-4 text-slate-600 opacity-20" />;
    return sortConfig.direction === 'asc' 
      ? <SortAscIcon className="h-4 w-4 text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
      : <SortDescIcon className="h-4 w-4 text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />;
  };

  const getStatusBadge = (status: ReadStatus) => {
    switch (status) {
      case 'read':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/30 shadow-[0_0_5px_rgba(0,255,65,0.3)]">読了</span>;
      case 'reading':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/30 shadow-[0_0_5px_rgba(0,243,255,0.3)]">読書中</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">未読</span>;
    }
  };

  const getActivityIcon = (type: ActivityType) => {
    switch(type) {
        case 'add': return <PlusIcon className="w-4 h-4 text-neon-blue" />;
        case 'delete': return <TrashIcon className="w-4 h-4 text-red-500" />;
        case 'status': return <ActivityIcon className="w-4 h-4 text-neon-green" />;
        case 'favorite': return <HeartIcon className="w-4 h-4 text-neon-pink" filled />;
        case 'import': return <UploadIcon className="w-4 h-4 text-yellow-400" />;
        case 'export': return <DownloadIcon className="w-4 h-4 text-purple-400" />;
        case 'system': return <ActivityIcon className="w-4 h-4 text-slate-400" />;
        default: return <ActivityIcon className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch(type) {
        case 'add': return 'border-neon-blue bg-neon-blue/5';
        case 'delete': return 'border-red-500 bg-red-500/5';
        case 'status': return 'border-neon-green bg-neon-green/5';
        case 'favorite': return 'border-neon-pink bg-neon-pink/5';
        case 'import': return 'border-yellow-400 bg-yellow-400/5';
        case 'export': return 'border-purple-400 bg-purple-400/5';
        default: return 'border-slate-700 bg-slate-800/50';
    }
  };

  return (
    <div className="flex h-screen bg-dark-950 font-sans overflow-hidden text-slate-200 bg-cyber-grid bg-[length:40px_40px] relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent via-transparent to-neon-blue/5 z-0"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[100px] rounded-full pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark-950/90 border-r border-neon-blue/30 backdrop-blur-md transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 shadow-[5px_0_30px_rgba(0,0,0,0.5)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center h-24 px-6 border-b border-neon-blue/30 relative overflow-hidden group">
          <BookOpenIcon className="h-8 w-8 text-neon-blue transition-all duration-500" />
          <div className="ml-3 relative z-10">
             <span className="block text-2xl font-bold text-white tracking-wider leading-none drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] font-display">
              CYSHELF
            </span>
            <span className="text-[10px] text-neon-pink tracking-[0.3em] block mt-1 font-mono">VERSION 0.1</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent shadow-[0_0_10px_#00f3ff]"></div>
          
          {/* Sidebar header effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/0 via-neon-blue/5 to-neon-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
        
        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'ダッシュボード', icon: HomeIcon },
            { id: 'activity', label: 'アクティビティ', icon: ActivityIcon },
            { id: 'help', label: 'ヘルプ', icon: HelpIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center px-4 py-3 border-l-2 transition-all duration-300 font-medium tracking-wide relative overflow-hidden group ${
                  currentView === item.id
                  ? 'text-neon-blue bg-neon-blue/10 border-neon-blue shadow-[inset_0_0_20px_rgba(0,243,255,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent hover:border-slate-500'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 transition-transform duration-300 ${currentView === item.id ? 'scale-110 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">{item.label}</span>
              {currentView === item.id && (
                <div className="absolute right-0 top-0 h-full w-[2px] bg-neon-blue shadow-[0_0_10px_#00f3ff]"></div>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="h-20 bg-dark-900/50 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4 sm:px-8 z-30 transition-all duration-500">
          <div className="flex items-center w-full max-w-2xl">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-neon-blue hover:bg-neon-blue/10 md:hidden mr-4 transition-colors"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            {currentView === 'dashboard' && (
              <div className="relative hidden sm:block w-full group animate-fade-in">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-slate-500 group-focus-within:text-neon-blue transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 bg-dark-950/50 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] sm:text-sm transition-all duration-300 rounded-sm"
                  placeholder="検索 (タイトル、著者、出版社、ISBN)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            {currentView !== 'dashboard' && <div />}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin scrollbar-thumb-neon-blue scrollbar-track-dark-900">
          
          {currentView === 'dashboard' ? (
            <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: '総蔵書数', value: stats.total, icon: BookOpenIcon, color: 'text-neon-blue', border: 'border-neon-blue', shadow: 'shadow-neon-blue' },
                { 
                  label: '読書状況', 
                  value: `${Math.round((stats.readCount / (stats.total || 1)) * 100)}%`, 
                  sub: `読了: ${stats.readCount} / 読書中: ${stats.readingCount}`, 
                  icon: ChartBarIcon, 
                  color: 'text-neon-green', 
                  border: 'border-neon-green',
                  shadow: 'shadow-neon-green'
                },
                { label: 'お気に入り', value: stats.favoriteCount, icon: HeartIcon, color: 'text-neon-pink', border: 'border-neon-pink', shadow: 'shadow-neon-pink' }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`bg-dark-900/40 backdrop-blur border-l-4 ${stat.border} p-6 relative overflow-hidden group hover:bg-dark-800/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                   <div className={`absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-110 ${stat.color}`}>
                     <stat.icon className="h-12 w-12" />
                   </div>
                   <span className="text-xs font-bold text-slate-500 tracking-wider block mb-2 font-display">{stat.label}</span>
                   <div className="flex items-baseline gap-2">
                     <span className={`text-4xl font-bold text-white drop-shadow-md font-display`}>{stat.value}</span>
                     {stat.sub && <span className="text-xs text-neon-green font-mono">{stat.sub}</span>}
                   </div>
                   {/* Scanline decoration */}
                   <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/50 transition-all duration-500"></div>
                </div>
              ))}
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-900/50 p-2 border border-white/5 backdrop-blur-md rounded-sm">
               {/* Mobile Search shows here */}
               <div className="relative w-full sm:hidden">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 bg-dark-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-neon-blue text-sm rounded-sm"
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                <button
                  onClick={handleImportClick}
                  className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-slate-600 bg-transparent hover:bg-slate-800 text-xs font-bold tracking-wide text-slate-300 hover:text-white hover:border-neon-blue transition-all uppercase group rounded-sm active:scale-95"
                >
                  <UploadIcon className="h-4 w-4 mr-2 text-slate-500 group-hover:text-neon-blue transition-colors" />
                  CSV読込
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".csv" 
                  className="hidden" 
                />
                
                <button
                  onClick={handleExportCSV}
                  className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-slate-600 bg-transparent hover:bg-slate-800 text-xs font-bold tracking-wide text-slate-300 hover:text-white hover:border-neon-green transition-all uppercase group rounded-sm active:scale-95"
                >
                  <DownloadIcon className="h-4 w-4 mr-2 text-slate-500 group-hover:text-neon-green transition-colors" />
                  CSV保存
                </button>

                <div className="h-6 w-[1px] bg-slate-700 mx-2 hidden sm:block"></div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-shrink-0 inline-flex items-center px-6 py-2 border border-neon-blue bg-neon-blue/10 text-neon-blue hover:bg-neon-blue hover:text-black text-xs font-bold tracking-wide shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition-all uppercase ml-auto sm:ml-2 rounded-sm active:scale-95 duration-200"
                >
                  <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                  本を追加
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="relative border border-slate-800 bg-dark-900/40 backdrop-blur-md overflow-hidden rounded-sm shadow-xl">
               {/* Cyber Corners */}
               <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-blue"></div>
               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-blue"></div>
               <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-blue"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-blue"></div>

               {sortedBooks.length === 0 ? (
                <div className="p-16 text-center border-t border-b border-white/5 animate-fade-in">
                  <div className="mx-auto h-20 w-20 bg-dark-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <BookOpenIcon className="h-10 w-10 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-300 tracking-wide font-display">データが見つかりません</h3>
                  <p className="mt-2 text-sm text-slate-500">新規登録するか、検索条件を変更してください。</p>
                  {books.length === 0 && (
                    <button 
                      onClick={handleResetData}
                      className="mt-8 px-6 py-2 border border-dashed border-slate-600 text-xs text-slate-400 hover:text-neon-blue hover:border-neon-blue transition-colors hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                    >
                      データを初期化する
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-800">
                      <thead>
                        <tr className="bg-dark-950/80">
                          {/* Operations Column */}
                          <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-neon-blue uppercase tracking-widest w-24 whitespace-nowrap">
                            操作
                          </th>
                          
                          {/* Status Column */}
                          <th
                            scope="col"
                            className="px-6 py-4 text-left text-[10px] font-bold text-neon-blue uppercase tracking-widest cursor-pointer group hover:bg-white/5 transition-colors w-24 whitespace-nowrap"
                            onClick={() => handleSort('status')}
                          >
                            <div className="flex items-center gap-2">
                              状態
                              {renderSortIcon('status')}
                            </div>
                          </th>

                          {/* Data Columns */}
                          {[
                            { id: 'title', label: '書籍名', width: 'w-auto' },
                            { id: 'author', label: '著者', width: 'w-1/5' },
                            { id: 'publisher', label: '出版社', width: 'w-1/6' },
                            { id: 'publishedYear', label: '出版年', width: 'w-1/12' },
                            { id: 'isbn', label: 'ISBN', width: 'w-1/6' },
                          ].map((column) => (
                            <th
                              key={column.id}
                              scope="col"
                              className={`px-6 py-4 text-left text-[10px] font-bold text-neon-blue uppercase tracking-widest cursor-pointer group hover:bg-white/5 transition-colors ${column.width} whitespace-nowrap`}
                              onClick={() => handleSort(column.id as SortKey)}
                            >
                              <div className="flex items-center gap-2">
                                {column.label}
                                {renderSortIcon(column.id as SortKey)}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-sm">
                        {paginatedBooks.map((book, idx) => (
                          <tr 
                            key={book.id} 
                            className="hover:bg-neon-blue/5 transition-all duration-200 group border-l-2 border-transparent hover:border-neon-blue hover-glow-row"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            
                            {/* Operations Cell (Heart + Trash) */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-4">
                                {/* Favorite Button with Tooltip */}
                                <div className="group/tooltip relative">
                                  <button
                                    onClick={() => handleToggleFavorite(book.id)}
                                    className={`transition-all duration-300 hover:scale-125 focus:outline-none ${book.isFavorite ? 'text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]' : 'text-slate-600 hover:text-neon-pink'}`}
                                  >
                                    <HeartIcon className="h-4 w-4" filled={book.isFavorite} />
                                  </button>
                                  <span className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-dark-900 border border-neon-pink/50 text-[10px] text-neon-pink whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_0_10px_rgba(255,0,255,0.2)] backdrop-blur-sm">
                                    {book.isFavorite ? "お気に入り解除" : "お気に入り登録"}
                                    {/* Tooltip Connector */}
                                    <span className="absolute left-2 bottom-0 -translate-x-1/2 translate-y-full w-[1px] h-2 bg-neon-pink/50"></span>
                                  </span>
                                </div>

                                {/* Delete Button with Tooltip */}
                                <div className="group/tooltip relative">
                                  <button
                                    onClick={() => onRequestDelete(book)}
                                    className="text-slate-600 hover:text-red-500 transition-all duration-300 hover:scale-125 focus:outline-none hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                  <span className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-dark-900 border border-red-500/50 text-[10px] text-red-400 whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-[0_0_10px_rgba(255,0,0,0.2)] backdrop-blur-sm">
                                    削除する
                                    {/* Tooltip Connector */}
                                    <span className="absolute left-2 bottom-0 -translate-x-1/2 translate-y-full w-[1px] h-2 bg-red-500/50"></span>
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Status Cell */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => {
                                  const nextStatus = book.status === 'unread' ? 'reading' : book.status === 'reading' ? 'read' : 'unread';
                                  handleStatusChange(book.id, nextStatus);
                                }}
                                className="hover:opacity-80 transition-all focus:outline-none hover:scale-105 active:scale-95"
                                title="クリックして状態を変更"
                              >
                                {getStatusBadge(book.status)}
                              </button>
                            </td>

                            {/* Data Cells */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white font-medium group-hover:text-neon-blue transition-colors duration-300">{book.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-slate-400">{book.author}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <div className="text-slate-400 text-sm">{book.publisher || '不明'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono">
                              {book.publishedYear}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs tracking-wider font-mono">
                              {book.isbn || '---'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="px-6 py-3 border-t border-slate-800 bg-dark-950/30 flex items-center justify-between backdrop-blur-sm">
                    <div className="text-xs text-slate-500 font-mono">
                      表示中: <span className="text-white">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredBooks.length)}</span> - <span className="text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredBooks.length)}</span> / 全 <span className="text-neon-blue">{filteredBooks.length}</span> 件
                    </div>
                    
                    {totalPages > 1 && (
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1 px-2 rounded-sm border border-slate-700 text-slate-500 hover:border-neon-blue hover:text-neon-blue disabled:opacity-30 disabled:hover:border-slate-700 transition-all text-xs active:scale-95"
                        >
                          前へ
                        </button>
                        
                        <div className="hidden sm:flex items-center gap-1 mx-2">
                           {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-6 h-6 flex items-center justify-center text-xs transition-all border rounded-sm font-mono ${
                                  currentPage === i + 1
                                    ? 'border-neon-blue bg-neon-blue/20 text-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.4)] scale-110'
                                    : 'border-transparent text-slate-600 hover:text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                {i + 1}
                              </button>
                           ))}
                        </div>

                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1 px-2 rounded-sm border border-slate-700 text-slate-500 hover:border-neon-blue hover:text-neon-blue disabled:opacity-30 disabled:hover:border-slate-700 transition-all text-xs active:scale-95"
                        >
                          次へ
                        </button>
                      </nav>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="text-center pb-8 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={handleResetData}
                className="text-[10px] text-slate-600 hover:text-red-400 uppercase tracking-widest border-b border-transparent hover:border-red-400 transition-colors"
              >
                データを初期化する
              </button>
            </div>

            </div>
          ) : currentView === 'activity' ? (
             // --- ACTIVITY VIEW ---
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              <div className="border-l-4 border-neon-blue pl-6 mb-8 flex justify-between items-end bg-gradient-to-r from-neon-blue/5 to-transparent py-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white tracking-wider font-display">ACTIVITY LOG</h2>
                    <p className="text-neon-blue text-sm tracking-widest mt-1">SYSTEM OPERATIONS TIMELINE</p>
                 </div>
                 <div className="text-xs text-slate-500 font-mono pr-4">
                    TOTAL EVENTS: <span className="text-white">{activities.length}</span>
                 </div>
              </div>

              <div className="relative pl-8 border-l border-slate-800 space-y-8">
                 {activities.map((log, idx) => (
                    <div 
                      key={log.id} 
                      className="relative animate-slide-in-right"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                       {/* Timeline Dot */}
                       <div className="absolute -left-[37px] top-4 w-4 h-4 rounded-full bg-dark-950 border-2 border-slate-600 flex items-center justify-center z-10">
                          <div className={`w-2 h-2 rounded-full ${getActivityColor(log.type).split(' ')[0].replace('border-', 'bg-')} shadow-[0_0_10px_currentColor]`}></div>
                       </div>
                       
                       <div className={`p-5 rounded-sm border-l-2 ${getActivityColor(log.type)} backdrop-blur-sm transition-all hover:bg-white/5 hover:translate-x-2 duration-300 shadow-lg group`}>
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                {getActivityIcon(log.type)}
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors">
                                   {log.type}
                                </span>
                             </div>
                             <span className="text-xs font-mono text-slate-600">
                                {new Date(log.timestamp).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          <p className="text-sm text-slate-200">{log.message}</p>
                       </div>
                    </div>
                 ))}
                 
                 {activities.length === 0 && (
                    <div className="text-slate-500 text-sm italic p-4">
                       No activities recorded.
                    </div>
                 )}
              </div>
            </div>
          ) : (
            // --- HELP VIEW ---
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
               <div className="border-l-4 border-neon-blue pl-6 mb-8 bg-gradient-to-r from-neon-blue/5 to-transparent py-4">
                 <h2 className="text-3xl font-bold text-white tracking-wider font-display">SYSTEM HELP</h2>
                 <p className="text-neon-blue text-sm tracking-widest mt-1">OPERATIONAL GUIDE & MANUAL</p>
               </div>

               {/* CSV Spec */}
               <div className="bg-dark-900/40 border border-slate-800 p-8 relative overflow-hidden group hover:border-neon-blue/30 transition-colors duration-500">
                 {/* Decorative elements */}
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                   <UploadIcon className="h-24 w-24 text-neon-blue" />
                 </div>
                 
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center font-display">
                   <span className="w-2 h-2 bg-neon-blue rounded-full mr-3 shadow-[0_0_10px_#00f3ff]"></span>
                   CSVインポート仕様
                 </h3>
                 
                 <p className="text-slate-400 text-sm leading-relaxed mb-6">
                   外部データを取り込む際は、以下のフォーマットに従ったCSVファイル（カンマ区切り）を用意してください。<br/>
                   1行目はヘッダーとして無視されます。2行目以降にデータを記述してください。
                 </p>

                 <div className="overflow-hidden border border-slate-700 bg-dark-950/50 mb-6 rounded-sm">
                   <table className="min-w-full text-sm text-left">
                     <thead className="bg-slate-800 text-xs text-slate-300 uppercase">
                       <tr>
                         <th className="px-4 py-3">No.</th>
                         <th className="px-4 py-3">項目名</th>
                         <th className="px-4 py-3">必須</th>
                         <th className="px-4 py-3">内容</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-700 text-slate-400 font-mono text-xs">
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">1</td><td className="px-4 py-2 text-neon-blue">title</td><td className="px-4 py-2 text-neon-pink">Yes</td><td>書籍のタイトル</td></tr>
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">2</td><td className="px-4 py-2 text-neon-blue">author</td><td className="px-4 py-2 text-neon-pink">Yes</td><td>著者名</td></tr>
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">3</td><td className="px-4 py-2 text-neon-blue">publisher</td><td className="px-4 py-2">-</td><td>出版社名</td></tr>
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">4</td><td className="px-4 py-2 text-neon-blue">publishedYear</td><td className="px-4 py-2">-</td><td>出版年 (西暦)</td></tr>
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">5</td><td className="px-4 py-2 text-neon-blue">isbn</td><td className="px-4 py-2">-</td><td>ISBNコード</td></tr>
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">6</td><td className="px-4 py-2 text-neon-blue">status</td><td className="px-4 py-2">-</td><td>read / reading / unread</td></tr>
                       <tr className="hover:bg-white/5 transition-colors"><td className="px-4 py-2">7</td><td className="px-4 py-2 text-neon-blue">isFavorite</td><td className="px-4 py-2">-</td><td>true / false</td></tr>
                     </tbody>
                   </table>
                 </div>
                 
                 <div className="bg-black/40 border border-slate-700 p-4 font-mono text-xs text-slate-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-green/50"></div>
                    <div className="text-slate-500 mb-2">// サンプルデータ</div>
                    <div className="text-neon-green">
                      title,author,publisher,publishedYear,isbn,status,isFavorite<br/>
                      銀河鉄道の夜,宮沢 賢治,新潮社,1989,9784101092055,reading,false
                    </div>
                 </div>
               </div>

               {/* FAQ or Tips */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-dark-900/40 border border-slate-800 p-6 hover:bg-dark-800/40 transition-all duration-300 hover:scale-[1.02]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-display">
                      <BookOpenIcon className="h-5 w-5 text-neon-pink mr-2" />
                      データの保存について
                    </h3>
                    <p className="text-slate-400 text-sm">
                      データはブラウザのローカルストレージに自動的に保存されます。
                      ブラウザのキャッシュをクリアするとデータが消失する可能性があるため、定期的に「CSV保存」でバックアップを取ることを推奨します。
                    </p>
                 </div>
                 <div className="bg-dark-900/40 border border-slate-800 p-6 hover:bg-dark-800/40 transition-all duration-300 hover:scale-[1.02]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center font-display">
                      <TrashIcon className="h-5 w-5 text-red-400 mr-2" />
                      データの削除
                    </h3>
                    <p className="text-slate-400 text-sm">
                      削除ボタンから個別の書籍を削除できます。
                      全データをリセットしたい場合は、リスト最下部の「データを初期化する」を使用してください。
                    </p>
                 </div>
               </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="新規書籍登録"
      >
        <BookForm
          onSubmit={handleAddBook}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="書籍の削除"
      >
        <div className="text-slate-300 animate-fade-in">
          <p className="mb-4">以下の書籍を削除してもよろしいですか？</p>
          <div className="p-4 bg-dark-900 border border-slate-800 mb-6 shadow-inner">
            <p className="text-lg font-bold text-white mb-1 font-display">{deleteTarget?.title}</p>
            <p className="text-sm text-slate-500">{deleteTarget?.author}</p>
          </div>
          <p className="text-xs text-red-400 mb-6">※この操作は取り消すことができません。</p>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-transparent hover:border-slate-600 transition-all uppercase tracking-wide rounded-sm"
            >
              キャンセル
            </button>
            <button
              onClick={executeDelete}
              className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-2 text-sm font-bold uppercase tracking-wide hover:bg-red-500 hover:text-black hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all rounded-sm"
            >
              削除する
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default App;