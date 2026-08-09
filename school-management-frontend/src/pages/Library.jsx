import React, { useState, useMemo } from 'react';
import { Book, Plus, Search, Tag, Filter, MoreVertical, Bookmark, CheckCircle2, XCircle, Clock, X, Save, AlertCircle, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEED_BOOKS = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', isbn: '978-0743273565', status: 'Available', shelf: 'A-12' },
    { id: 2, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '978-0262033848', status: 'Issued', shelf: 'CS-04' },
    { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', isbn: '978-0553380163', status: 'Available', shelf: 'S-08' },
    { id: 4, title: 'The Art of Computer Programming', author: 'Donald Knuth', category: 'Computer Science', isbn: '978-0201896831', status: 'Reserved', shelf: 'CS-01' },
    { id: 5, title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', isbn: '978-0061120084', status: 'Available', shelf: 'A-05' },
    { id: 6, title: 'Clean Code', author: 'Robert C. Martin', category: 'Software Engineering', isbn: '978-0132350884', status: 'Available', shelf: 'SE-02' },
];

const statusStyles = {
  'Available': { color: '#10b981', bg: '#ecfdf5' },
  'Issued': { color: '#ef4444', bg: '#fef2f2' },
  'Reserved': { color: '#f59e0b', bg: '#fffbeb' }
};

const Library = () => {
  const [books, setBooks] = useState(() => {
    try {
      const s = localStorage.getItem('library_books');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return SEED_BOOKS;
  });

  const persist = (updated) => {
    setBooks(updated);
    localStorage.setItem('library_books', JSON.stringify(updated));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeBookId, setActiveBookId] = useState(null);

  const categories = ['All', ...new Set(books.map(b => b.category))];

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = books.map(b => b.id === id ? { ...b, status: newStatus } : b);
    persist(updated);
    setActiveBookId(null);
    showToast('success', `Book status shifted to "${newStatus}"!`);
  };

  const handleDeleteBook = (id) => {
    const bookToDelete = books.find(b => b.id === id);
    const updated = books.filter(b => b.id !== id);
    persist(updated);
    setActiveBookId(null);
    showToast('success', `Deregistered "${bookToDelete ? bookToDelete.title : id}" from catalog.`);
  };

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q);
      const matchC = filterCategory === 'All' || b.category === filterCategory;
      return matchQ && matchC;
    });
  }, [books, searchQuery, filterCategory]);

  const handleDigitalArchive = () => {
    showToast('success', 'Library archive synced to digital vault.');
  };

  const [form, setForm] = useState({ title: '', author: '', category: 'Fiction', isbn: '', shelf: '' });
  const [editForm, setEditForm] = useState({ title: '', author: '', category: 'Fiction', isbn: '', shelf: '' });

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      shelf: book.shelf || ''
    });
    setShowEditModal(true);
    setActiveBookId(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.author || !editForm.isbn) {
      showToast('error', 'Please fill all required fields.');
      return;
    }
    const updated = books.map(b => b.id === editingBook.id ? { ...b, ...editForm } : b);
    persist(updated);
    setShowEditModal(false);
    showToast('success', `"${editForm.title}" updated successfully.`);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.isbn) {
      showToast('error', 'Please fill all required fields.');
      return;
    }
    const newBook = { ...form, id: Date.now(), status: 'Available' };
    persist([newBook, ...books]);
    setShowAddModal(false);
    showToast('success', 'New book registered successfully.');
    setForm({ title: '', author: '', category: 'Fiction', isbn: '', shelf: '' });
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
          backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444', color: 'white',
          padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.9rem'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Library Book Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage institutional book inventory, digital records, and shelf allocations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={handleDigitalArchive} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
             <Bookmark size={20} /> Digital Archive
           </button>
           <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer' }}>
             <Plus size={20} /> Register New Book
           </button>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '32px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by title, author, or ISBN..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowFilter(!showFilter)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', padding: '12px 20px', cursor: 'pointer' }}>
              <Filter size={18} /> Filters {filterCategory !== 'All' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
            </button>
            {showFilter && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '180px' }}>
                {categories.map(c => (
                  <div 
                    key={c} 
                    onClick={() => { setFilterCategory(c); setShowFilter(false); }}
                    style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: filterCategory === c ? 'var(--primary-light)' : 'transparent', color: filterCategory === c ? 'var(--primary)' : 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem' }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredBooks.map((book, idx) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="card"
            style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', transition: '0.3s' }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)', borderColor: 'var(--primary)' }}
          >
            <div style={{ display: 'flex', gap: '24px', padding: '24px' }}>
               <div style={{ 
                  width: '100px', 
                  height: '140px', 
                  backgroundColor: 'var(--primary)', 
                  borderRadius: '4px 12px 12px 4px', 
                  flexShrink: 0,
                  boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.2), inset -1px 0 2px rgba(255,255,255,0.4), 6px 6px 15px rgba(0,0,0,0.15)',
                  borderLeft: '4px solid rgba(255,255,255,0.25)',
                  position: 'relative',
                  overflow: 'hidden'
               }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', textAlign: 'center', color: 'white' }}>
                    <Book size={24} style={{ marginBottom: '8px', opacity: 0.8 }} />
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, lineHeight: 1.2 }}>{book.title}</span>
                  </div>
                  {book.isbn && (
                    <img 
                      src={`https://covers.openlibrary.org/b/isbn/${book.isbn.replace(/-/g, '')}-M.jpg`} 
                      alt={book.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  {/* Book Glare Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0) 20%)', zIndex: 3, pointerEvents: 'none' }} />
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{book.category}</span>
                     <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button 
                           onClick={(e) => {
                              e.stopPropagation();
                              setActiveBookId(activeBookId === book.id ? null : book.id);
                           }}
                           style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                           <MoreVertical size={16} />
                        </button>
                        
                        <AnimatePresence>
                           {activeBookId === book.id && (
                              <>
                                 <div 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setActiveBookId(null);
                                    }} 
                                    style={{ position: 'fixed', inset: 0, zIndex: 998, cursor: 'default' }} 
                                 />
                                 <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.15 }}
                                    style={{ 
                                       position: 'absolute', 
                                       right: 0, 
                                       top: '100%', 
                                       marginTop: '6px',
                                       backgroundColor: 'var(--bg-card)', 
                                       border: '1px solid var(--border-color)', 
                                       borderRadius: '12px', 
                                       boxShadow: 'var(--shadow-xl)', 
                                       zIndex: 999, 
                                       minWidth: '170px',
                                       overflow: 'hidden',
                                       textAlign: 'left'
                                    }}
                                 >
                                     <div style={{ padding: '8px 12px 4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</div>
                                     <button
                                        type="button"
                                        onClick={(e) => {
                                           e.stopPropagation();
                                           handleOpenEditModal(book);
                                        }}
                                        style={{
                                           display: 'flex',
                                           alignItems: 'center',
                                           gap: '8px',
                                           width: '100%',
                                           padding: '10px 16px',
                                           backgroundColor: 'transparent',
                                           border: 'none',
                                           color: 'var(--text-main)',
                                           cursor: 'pointer',
                                           fontSize: '0.8rem',
                                           fontWeight: 800,
                                           transition: '0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-body)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                     >
                                        <Edit size={12} /> Edit Details
                                     </button>
                                     
                                     <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                                     
                                     <div style={{ padding: '8px 12px 4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shift Status</div>
                                     <button
                                       type="button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(book.id, 'Available');
                                       }}
                                       style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '100%',
                                          padding: '10px 16px',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          color: '#10b981',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 800,
                                          transition: '0.2s'
                                       }}
                                       onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-body)'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                       Mark Available
                                    </button>
                                    <button
                                       type="button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(book.id, 'Issued');
                                       }}
                                       style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '100%',
                                          padding: '10px 16px',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          color: '#ef4444',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 800,
                                          transition: '0.2s'
                                       }}
                                       onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-body)'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                       Mark Issued
                                    </button>
                                    <button
                                       type="button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(book.id, 'Reserved');
                                       }}
                                       style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '100%',
                                          padding: '10px 16px',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          color: '#f59e0b',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 800,
                                          transition: '0.2s'
                                       }}
                                       onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-body)'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                       Mark Reserved
                                    </button>
                                    
                                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }}></div>
                                    
                                    <button
                                       type="button"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteBook(book.id);
                                       }}
                                       style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          width: '100%',
                                          padding: '10px 16px',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          color: '#EF4444',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 850,
                                          transition: '0.2s'
                                       }}
                                       onMouseEnter={(e) => e.target.style.backgroundColor = '#EF444410'}
                                       onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                       Deregister Book
                                    </button>
                                 </motion.div>
                              </>
                           )}
                        </AnimatePresence>
                     </div>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '4px', lineHeight: 1.2 }}>{book.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>by {book.author}</p>
                  <div style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '30px', 
                    fontSize: '0.7rem', fontWeight: 800,
                    backgroundColor: statusStyles[book.status].bg,
                    color: statusStyles[book.status].color
                  }}>
                    {book.status === 'Available' ? <CheckCircle2 size={12} /> : (book.status === 'Issued' ? <XCircle size={12} /> : <Clock size={12} />)}
                    {book.status}
                  </div>
               </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={14} className="text-muted" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Shelf {book.shelf}</span>
               </div>
               <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{book.isbn}</span>
            </div>
          </motion.div>
        ))}
        {filteredBooks.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
            No books found matching your criteria.
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Register New Book</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="Book Title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Author</label>
                  <input type="text" required value={form.author} onChange={e => setForm({...form, author: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="Author Name" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</label>
                  <input type="text" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. Fiction" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ISBN</label>
                  <input type="text" required value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="ISBN-13" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shelf</label>
                  <input type="text" value={form.shelf} onChange={e => setForm({...form, shelf: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. A-12" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} /> Register Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Edit Book Details</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Title</label>
                <input type="text" required value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="Book Title" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Author</label>
                  <input type="text" required value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="Author Name" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category</label>
                  <input type="text" required value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. Fiction" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ISBN</label>
                  <input type="text" required value={editForm.isbn} onChange={e => setEditForm({...editForm, isbn: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="ISBN-13" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Shelf</label>
                  <input type="text" value={editForm.shelf} onChange={e => setEditForm({...editForm, shelf: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. A-12" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
