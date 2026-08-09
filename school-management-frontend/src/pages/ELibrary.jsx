import React, { useState, useEffect } from 'react';
import { 
  Book, Download, ExternalLink, Search, Bookmark, 
  Filter, MoreVertical, Globe, BookOpen, Clock,
  Star, HardDrive, FileText, ChevronRight,
  TrendingUp, Archive, X, Check, RotateCw, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ELibrary = () => {
  // Core Books Dataset
  const [books] = useState([
    { id: 1, title: 'Advanced Calculus & Logic', author: 'Dr. Leonard Euler', category: 'Science', size: '12.4 MB', type: 'PDF', rating: 4.9, coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80' },
    { id: 2, title: 'English Literature: The Classics', author: 'William Shakespeare', category: 'Arts', size: '8.1 MB', type: 'EPUB', rating: 4.7, coverUrl: 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?w=400&q=80' },
    { id: 3, title: 'Introduction to Modern Physics', author: 'Isaac Newton', category: 'Science', size: '15.8 MB', type: 'PDF', rating: 4.8, coverUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&q=80' },
    { id: 4, title: 'World History: Ancient Civilizations', author: 'Herodotus', category: 'History', size: '22.3 MB', type: 'PDF', rating: 4.6, coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80' },
    { id: 5, title: 'Data Structures & Algorithms', author: 'Thomas Cormen', category: 'Technology', size: '18.2 MB', type: 'PDF', rating: 4.9, coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
    { id: 6, title: 'Organic Chemistry Principles', author: 'Linus Pauling', category: 'Science', size: '14.5 MB', type: 'PDF', rating: 4.5, coverUrl: 'https://images.unsplash.com/photo-1603126859738-1639f75f92ff?w=400&q=80' },
    { id: 7, title: 'Nature: Quantum Computing 2026', author: 'Various Authors', category: 'Journals', size: '4.2 MB', type: 'Journal', rating: 4.9, coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80' },
    { id: 8, title: 'AI in Modern Healthcare', author: 'Stanford Research', category: 'Technology', size: '5.1 MB', type: 'Paper', rating: 4.8, coverUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80' },
    { id: 9, title: 'The Industrial Revolution', author: 'Adam Smith', category: 'History', size: '12.8 MB', type: 'PDF', rating: 4.7, coverUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80' },
    { id: 10, title: 'Sustainable Energy Systems', author: 'MIT Press', category: 'Science', size: '18.5 MB', type: 'Paper', rating: 4.9, coverUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=80' },
    { id: 11, title: 'IEEE: Neural Networks Vol 12', author: 'IEEE Publishing', category: 'Journals', size: '6.7 MB', type: 'Journal', rating: 4.8, coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&q=80' },
    { id: 12, title: 'Macbeth: A Deep Analysis', author: 'Harold Bloom', category: 'Arts', size: '3.9 MB', type: 'PDF', rating: 4.6, coverUrl: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&q=80' },
  ]);

  // Filtering & UI State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bookmarking & Bookshelf States
  const [savedBookIds, setSavedBookIds] = useState([1, 5, 8]); // Initial bookmarked IDs
  const [activeReadingProgress, setActiveReadingProgress] = useState({
    1: 45,
    2: 12,
    5: 78,
    8: 62,
    10: 92
  });

  // Modal & Drawer States
  const [showMyReadings, setShowMyReadings] = useState(false);
  const [activeReaderBook, setActiveReaderBook] = useState(null);
  const [downloadingBookId, setDownloadingBookId] = useState(null);
  const [libraryToast, setLibraryToast] = useState(null);

  // E-Reader Settings State
  const [readerSettings, setReaderSettings] = useState({ theme: 'day', fontSize: 18 });
  const [readerChapter, setReaderChapter] = useState(1);

  // Categories list
  const categories = ['All', 'Science', 'Arts', 'History', 'Technology', 'Journals'];

  // Handle bookmark toggle
  const toggleBookmark = (bookId, bookTitle) => {
    let isAdded = false;
    setSavedBookIds(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        isAdded = true;
        return [...prev, bookId];
      }
    });

    // Auto-create reading progress if new
    if (isAdded && !activeReadingProgress[bookId]) {
      setActiveReadingProgress(prev => ({ ...prev, [bookId]: 0 }));
    }

    triggerToast(isAdded ? `"${bookTitle}" added to My Readings!` : `"${bookTitle}" removed from My Readings.`);
  };

  // Trigger Toast Notification Helper
  const triggerToast = (msg) => {
    setLibraryToast(msg);
    setTimeout(() => setLibraryToast(null), 3000);
  };

  // Simulate download progress
  const handleDownloadBook = (bookId, bookTitle) => {
    if (downloadingBookId) return; // Already downloading something
    
    setDownloadingBookId(bookId);
    setTimeout(() => {
      setDownloadingBookId(null);
      triggerToast(`Download Complete! "${bookTitle}" saved to device.`);
    }, 1500);
  };

  // Open active book reader
  const handleOpenReader = (book) => {
    setActiveReaderBook(book);
    setReaderChapter(1);
    setShowMyReadings(false); // Close readings drawer if open

    // Automatically update active reading progress to at least 5% if it was 0%
    if (activeReadingProgress[book.id] === undefined || activeReadingProgress[book.id] === 0) {
      setActiveReadingProgress(prev => ({ ...prev, [book.id]: 5 }));
    }
  };

  // Progress reader page and increase reading completion %
  const handleReaderPageChange = (nextChapter) => {
    setReaderChapter(nextChapter);
    
    // Increment progress dynamically
    if (activeReaderBook) {
      const currentProgress = activeReadingProgress[activeReaderBook.id] || 0;
      if (nextChapter === 2 && currentProgress < 50) {
        setActiveReadingProgress(prev => ({ ...prev, [activeReaderBook.id]: 50 }));
      } else if (nextChapter === 1 && currentProgress < 25) {
        setActiveReadingProgress(prev => ({ ...prev, [activeReaderBook.id]: 25 }));
      }
    }
  };

  // Active Reader Simulated Content
  const getReaderContent = (title, chapter) => {
    const database = {
      'Advanced Calculus & Logic': {
        1: `<h3>Chapter 1: Continuous Functions and Limits</h3>
            <p>Let $f(x)$ be a function continuous on the closed interval $[a, b]$ and differentiable on the open interval $(a, b)$. By the Intermediate Value Theorem, if $u$ is a number between $f(a)$ and $f(b)$, then there exists at least one $c$ in $[a, b]$ such that $f(c) = u$.</p>
            <p>We define the formal limit as: $\\lim_{x \\to c} f(x) = L$ if and only if for every $\\epsilon > 0$ there exists a $\\delta > 0$ such that $0 < |x - c| < \\delta$ implies $|f(x) - L| < \\epsilon$. This forms the foundation of real analysis.</p>`,
        2: `<h3>Chapter 2: Integration & Fourier Series</h3>
            <p>Consider an orthogonal set of functions $\\{\\phi_n(x)\\}$ on $[a, b]$. We express any integrable function $f(x)$ as a linear combination of these basis elements: $f(x) = \\sum_{n=1}^{\\infty} c_n \\phi_n(x)$.</p>
            <p>The coefficients $c_n$ are solved via inner products: $c_n = \\frac{\\langle f, \\phi_n \\rangle}{\\langle \\phi_n, \\phi_n \\rangle}$. In standard trigonometric Fourier series, $\\phi_n(x)$ represent sines and cosines, solving heat equations in physics.</p>`
      },
      'Data Structures & Algorithms': {
        1: `<h3>Chapter 1: Analysis of Algorithms</h3>
            <p>An algorithm is a finite set of rigorous instructions, typically used to solve a class of specific computation problems. We measure performance using Big O notation, describing the limiting behavior as the input size $n$ approaches infinity.</p>
            <p><strong>Pseudocode: Linear Search</strong><br/>
            <code>
            function linearSearch(array, target):<br/>
            &nbsp;&nbsp;for index from 0 to length(array) - 1:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;if array[index] == target:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return index<br/>
            &nbsp;&nbsp;return -1
            </code></p>`,
        2: `<h3>Chapter 2: Binary Search Trees (BST)</h3>
            <p>A binary search tree is a rooted binary tree data structure whose nodes contain keys. The BST property states that for any node $N$: all keys in $N$'s left subtree are less than $N$'s key, and all keys in $N$'s right subtree are greater than $N$'s key.</p>
            <p><strong>Algorithm: BST Insertion</strong><br/>
            <code>
            function insert(node, key):<br/>
            &nbsp;&nbsp;if node is null:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;return new Node(key)<br/>
            &nbsp;&nbsp;if key < node.key:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;node.left = insert(node.left, key)<br/>
            &nbsp;&nbsp;else:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;node.right = insert(node.right, key)<br/>
            &nbsp;&nbsp;return node
            </code></p>`
      }
    };

    const bookData = database[title] || {
      1: `<h3>Chapter 1: Foundations & Core Ideals</h3>
          <p>This introductory chapter examines the primary guidelines and structural foundations governing our topic. Historically, research began with small-scale modeling before scaling up to modern frameworks.</p>
          <p>It is vital to establish a rigorous framework of study before engaging in advanced experimentation. This textbook aims to bridge the gap between academic theory and practical application.</p>`,
      2: `<h3>Chapter 2: Practical Applications & Advanced Cases</h3>
          <p>In this second chapter, we inspect case studies and real-world scenarios. We see how applying core theorems leads to dramatic increases in operating efficiency and design consistency.</p>
          <p>We review several comparative models before concluding with empirical results derived from leading laboratories in North America and Europe.</p>`
    };

    return bookData[chapter];
  };

  // Dynamic Filtering Logic
  const filteredBooks = books.filter(book => {
    // 1. Category Filter
    if (activeCategory !== 'All' && book.category !== activeCategory) {
      return false;
    }

    // 2. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', position: 'relative' }}
    >
      {/* Dynamic Visual Toast Notification */}
      <AnimatePresence>
        {libraryToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            style={{ 
              position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', 
              backgroundColor: 'rgba(15,23,42,0.95)', color: 'white', padding: '12px 32px', 
              borderRadius: '20px', zIndex: 3000, fontWeight: 800, fontSize: '0.9rem', 
              boxShadow: 'var(--shadow-2xl)', display: 'flex', alignItems: 'center', gap: '10px' 
            }}
          >
            <Check size={16} color="#10B981" /> {libraryToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
               <Archive size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Digital Knowledge Base</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Digital E-Library</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Access over 10,000+ digital books, research journals, and academic resources.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              className="btn" 
              onClick={() => setShowMyReadings(true)}
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <TrendingUp size={18} /> MY READINGS
           </button>
           <button 
              className="btn btn-primary" 
              onClick={() => handleOpenReader(books[0])} // Open default book in e-reader
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer' }}
           >
              <BookOpen size={18} /> OPEN E-READER
           </button>
        </div>
      </div>

      {/* Library Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
         {[
           { label: 'Digital Books', value: '8,450', color: 'var(--primary)', icon: <Book size={20} /> },
           { label: 'Research Papers', value: '1,200', color: '#8B5CF6', icon: <FileText size={20} /> },
           { label: 'Readings Active', value: String(savedBookIds.length).padStart(2, '0'), color: '#10B981', icon: <Globe size={20} /> },
           { label: 'Storage Used', value: '1.2 TB', color: '#F59E0B', icon: <HardDrive size={20} /> }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <div style={{ width: '50px', height: '50px', borderRadius: '15px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)' }}>{stat.value}</div>
               </div>
            </div>
         ))}
      </div>

      {/* Search & Categories */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
         <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
               <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="btn" 
                  style={{ 
                     backgroundColor: activeCategory === cat ? 'var(--primary)' : 'var(--bg-card)', 
                     color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                     border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                     fontWeight: 800,
                     fontSize: '0.8rem',
                     cursor: 'pointer'
                  }}
               >
                  {cat}
               </button>
            ))}
         </div>
         <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search title, author or ISBN..." 
               style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '16px', top: '13px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
         </div>
      </div>

      {/* Resources Grid */}
      {filteredBooks.length === 0 ? (
        <div style={{ padding: '80px 24px', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px dashed var(--border-color)', borderRadius: '32px' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>No e-books found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 600 }}>Try altering your search or selecting another category tab.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
           {filteredBooks.map((book) => {
              const isBookmarked = savedBookIds.includes(book.id);
              const isDownloading = downloadingBookId === book.id;
              
              return (
                <motion.div 
                   key={book.id}
                   whileHover={{ y: -8 }}
                   className="card hover-card" 
                   style={{ padding: '24px', borderRadius: '32px', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                >
                   <div style={{ backgroundColor: 'var(--primary)', height: '180px', borderRadius: '4px 24px 24px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative', overflow: 'hidden', flexShrink: 0, boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.2), inset -1px 0 2px rgba(255,255,255,0.4), 6px 6px 15px rgba(0,0,0,0.15)', borderLeft: '6px solid rgba(255,255,255,0.25)' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', color: 'white' }}>
                        <Book size={32} style={{ marginBottom: '12px', opacity: 0.8 }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, lineHeight: 1.2 }}>{book.title}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, marginTop: '8px' }}>{book.author}</span>
                      </div>
                      
                      {book.coverUrl && (
                        <img 
                          src={book.coverUrl} 
                          alt={book.title}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                      
                      {/* Book Glare Overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0) 20%)', zIndex: 3, pointerEvents: 'none' }} />

                      <button 
                        onClick={() => toggleBookmark(book.id, book.title)}
                        style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, backgroundColor: 'white', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: 'var(--shadow-sm)', color: isBookmarked ? '#F59E0B' : 'var(--text-muted)', cursor: 'pointer', transition: 'transform 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                         <Bookmark size={18} fill={isBookmarked ? '#F59E0B' : 'none'} />
                      </button>
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.95)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                         {book.type}
                      </div>
                   </div>
                   
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '6px', lineHeight: 1.4, color: 'var(--text-main)' }}>{book.title}</h3>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '20px' }}>By {book.author}</p>
                   
                   <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                         <Clock size={14} color="#F59E0B" /> {book.size}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                         <button 
                            className="btn-icon" 
                            disabled={isDownloading}
                            onClick={() => handleDownloadBook(book.id, book.title)}
                            style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', cursor: isDownloading ? 'default' : 'pointer' }}
                         >
                            {isDownloading ? (
                              <RotateCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <Download size={16} />
                            )}
                         </button>
                         <button 
                            className="btn-icon" 
                            onClick={() => handleOpenReader(book)}
                            style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                         >
                            <ExternalLink size={16} />
                         </button>
                      </div>
                   </div>
                </motion.div>
              );
           })}
        </div>
      )}

      {/* Slide-out Readings Drawer ("My Readings") */}
      <AnimatePresence>
        {showMyReadings && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMyReadings(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                padding: '32px', overflowY: 'auto' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={24} color="var(--primary)" />
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)', margin: 0 }}>My Readings Shelf</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Active reading progress and saved bookmarks.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMyReadings(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Saved books list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {savedBookIds.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, border: '1px dashed var(--border-color)', borderRadius: '24px' }}>
                    No books in your shelf yet. Click the bookmark icon on any book to add it!
                  </div>
                ) : (
                  books.filter(b => savedBookIds.includes(b.id)).map((book) => {
                    const progress = activeReadingProgress[book.id] || 0;
                    return (
                      <div key={book.id} style={{ padding: '20px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                          <div style={{ width: '40px', height: '56px', backgroundColor: 'var(--primary)', borderRadius: '2px 6px 6px 2px', flexShrink: 0, boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.2), inset -1px 0 1px rgba(255,255,255,0.4), 3px 3px 8px rgba(0,0,0,0.15)', borderLeft: '2px solid rgba(255,255,255,0.25)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2px', textAlign: 'center', color: 'white' }}>
                              <Book size={14} style={{ opacity: 0.8 }} />
                            </div>
                            {book.coverUrl && (
                              <img 
                                src={book.coverUrl} 
                                alt={book.title}
                                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0) 20%)', zIndex: 3, pointerEvents: 'none' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.3 }}>{book.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>By {book.author}</span>
                          </div>
                        </div>

                        {/* Progress Meter */}
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px' }}>
                            <span>Reading Progress</span>
                            <span style={{ color: 'var(--primary)' }}>{progress}%</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '10px' }} />
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', justify: 'flex-end', gap: '10px', marginTop: '16px', borderTop: '1px dashed var(--border-color)', paddingTop: '12px' }}>
                          <button 
                            onClick={() => toggleBookmark(book.id, book.title)}
                            style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                          <button 
                            onClick={() => handleOpenReader(book)}
                            style={{ padding: '6px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 10px rgba(72,128,255,0.2)' }}
                          >
                            Open Reader
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Immersive E-Reader Overlay viewport */}
      <AnimatePresence>
        {activeReaderBook && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 2000, 
              backgroundColor: readerSettings.theme === 'night' ? '#141416' : '#f5f4f0', 
              display: 'flex', flexDirection: 'column', padding: '30px 40px' 
            }}
          >
            {/* Top Toolbar panel */}
            <div style={{ 
              width: '100%', maxWidth: '900px', margin: '0 auto 20px', display: 'flex', 
              justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${readerSettings.theme === 'night' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, 
              paddingBottom: '16px' 
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  E-READER PLAYBACK ACTIVE
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: readerSettings.theme === 'night' ? 'white' : '#1e2022', margin: '4px 0 0' }}>
                  {activeReaderBook.title}
                </h3>
              </div>

              {/* Adjusters: Theme & Font Size */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {/* Font Sizer */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', border: `1px solid ${readerSettings.theme === 'night' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, borderRadius: '10px', padding: '4px 10px' }}>
                  <button 
                    disabled={readerSettings.fontSize <= 14}
                    onClick={() => setReaderSettings(prev => ({ ...prev, fontSize: prev.fontSize - 2 }))}
                    style={{ background: 'none', border: 'none', color: readerSettings.theme === 'night' ? 'white' : '#1e2022', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    A-
                  </button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', margin: '0 4px' }}>
                    {readerSettings.fontSize}px
                  </span>
                  <button 
                    disabled={readerSettings.fontSize >= 28}
                    onClick={() => setReaderSettings(prev => ({ ...prev, fontSize: prev.fontSize + 2 }))}
                    style={{ background: 'none', border: 'none', color: readerSettings.theme === 'night' ? 'white' : '#1e2022', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    A+
                  </button>
                </div>

                {/* Theme selectors */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['day', 'sepia', 'night'].map(t => (
                    <button
                      key={t}
                      onClick={() => setReaderSettings(prev => ({ ...prev, theme: t }))}
                      style={{ 
                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, 
                        border: 'none', cursor: 'pointer',
                        backgroundColor: t === 'day' ? '#fbfaf7' : t === 'sepia' ? '#f4ecd8' : '#1e1f22',
                        color: t === 'day' ? '#2a2b2d' : t === 'sepia' ? '#5b4636' : '#c4c6cb',
                        boxShadow: readerSettings.theme === t ? '0 0 0 2px var(--primary)' : '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setActiveReaderBook(null)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', border: 'none', color: readerSettings.theme === 'night' ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Immersive Book Page Frame */}
            <div style={{ 
              flex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', 
              borderRadius: '28px', border: `1px solid ${readerSettings.theme === 'night' ? '#2d2e32' : '#e0dfdb'}`,
              backgroundColor: readerSettings.theme === 'day' ? '#fbfaf7' : readerSettings.theme === 'sepia' ? '#f4ecd8' : '#1e1f22',
              color: readerSettings.theme === 'day' ? '#2a2b2d' : readerSettings.theme === 'sepia' ? '#5b4636' : '#c4c6cb',
              display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}>
              {/* Actual Book Content */}
              <div 
                className="reader-content"
                style={{ 
                  flex: 1, padding: '40px 60px', overflowY: 'auto', 
                  fontSize: `${readerSettings.fontSize}px`, lineHeight: 1.8, fontWeight: 500,
                  fontFamily: 'Georgia, serif' 
                }}
                dangerouslySetInnerHTML={{ __html: getReaderContent(activeReaderBook.title, readerChapter) }}
              />

              {/* Book footer pagination */}
              <div style={{ 
                padding: '20px 40px', borderTop: `1px solid ${readerSettings.theme === 'night' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
              }}>
                <button
                  disabled={readerChapter <= 1}
                  onClick={() => handleReaderPageChange(readerChapter - 1)}
                  style={{ 
                    padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'rgba(0,0,0,0.02)', fontWeight: 800, fontSize: '0.8rem', 
                    cursor: readerChapter <= 1 ? 'default' : 'pointer', opacity: readerChapter <= 1 ? 0.4 : 1,
                    color: 'inherit'
                  }}
                >
                  PREVIOUS PAGE
                </button>
                
                <span style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.8 }}>
                  Page {readerChapter === 1 ? '12' : '45'} of 340
                </span>

                <button
                  disabled={readerChapter >= 2}
                  onClick={() => handleReaderPageChange(readerChapter + 1)}
                  style={{ 
                    padding: '8px 18px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'rgba(0,0,0,0.02)', fontWeight: 800, fontSize: '0.8rem', 
                    cursor: readerChapter >= 2 ? 'default' : 'pointer', opacity: readerChapter >= 2 ? 0.4 : 1,
                    color: 'inherit'
                  }}
                >
                  NEXT PAGE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ELibrary;
