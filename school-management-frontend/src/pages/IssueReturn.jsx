import React, { useState } from 'react';
import { 
  Book, User, Search, RefreshCcw, ArrowRight, ArrowLeft, 
  Calendar, ShieldCheck, HelpCircle, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import devonAvatar from '../assets/devon_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';

const getMemberAvatar = (memberName) => {
  const name = memberName.toLowerCase();
  if (name.includes('devon') || name.includes('harry potter')) return devonAvatar;
  if (name.includes('jane') || name.includes('hermione granger')) return janeAvatar;
  if (name.includes('robert') || name.includes('ron weasley')) return robertAvatar;
  if (name.includes('eleanor') || name.includes('albus dumbledore')) return eleanorAvatar;
  if (name.includes('patel')) return ninaPatelAvatar;

  const fallbacks = {
    'luna lovegood': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    'draco malfoy': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    'severus snape': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'minerva mcgonagall': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
  };

  return fallbacks[name] || null;
};

const IssueReturn = () => {
  const [mode, setMode] = useState('issue'); // 'issue' or 'return'
  const [searchId, setSearchId] = useState('');
  const [matchedMember, setMatchedMember] = useState(null);
  const [showMember, setShowMember] = useState(false);
  const [bookSearch, setBookSearch] = useState('');
  const [matchedBook, setMatchedBook] = useState(null);
  const [showBook, setShowBook] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSearch = () => {
    if (!searchId.trim()) {
      showToast('error', 'Please enter a Member ID or Name.');
      return;
    }
    
    // Fetch members from localStorage
    let members = [];
    try {
      const stored = localStorage.getItem('library_members');
      if (stored) members = JSON.parse(stored);
    } catch (e) {}
    
    if (members.length === 0) {
      members = [
        { id: 'LIB-M-001', name: 'Harry Potter', role: 'Student', class: 'Grade 10-A', booksIssued: 2, status: 'Active' },
        { id: 'LIB-M-002', name: 'Hermione Granger', role: 'Student', class: 'Grade 10-A', booksIssued: 5, status: 'Active' },
        { id: 'LIB-M-003', name: 'Robert Lane', role: 'Guardian', class: 'Ward: Devon Lane (10A)', booksIssued: 1, status: 'Active' },
        { id: 'LIB-M-004', name: 'Albus Dumbledore', role: 'Teacher', dept: 'Administration', booksIssued: 12, status: 'Elite' },
      ];
    }
    
    const query = searchId.trim().toLowerCase();
    const found = members.find(m => m.id.toLowerCase() === query || m.name.toLowerCase().includes(query));
    
    if (found) {
      setMatchedMember(found);
      setShowMember(true);
      showToast('success', `Verified member: ${found.name}`);
    } else {
      setMatchedMember(null);
      setShowMember(false);
      showToast('error', 'No active library member found matching this search.');
    }
  };

  const handleBookSearch = () => {
    if (!bookSearch.trim()) {
      showToast('error', 'Please enter a Book Title, Author or ISBN.');
      return;
    }
    
    // Fetch books from localStorage
    let catalog = [];
    try {
      const stored = localStorage.getItem('library_books');
      if (stored) catalog = JSON.parse(stored);
    } catch (e) {}
    
    if (catalog.length === 0) {
      catalog = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', isbn: '978-0743273565', status: 'Available', shelf: 'A-12' },
        { id: 2, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '978-0262033848', status: 'Issued', shelf: 'CS-04' },
        { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', isbn: '978-0553380163', status: 'Available', shelf: 'S-08' },
        { id: 4, title: 'The Art of Computer Programming', author: 'Donald Knuth', category: 'Computer Science', isbn: '978-0201896831', status: 'Reserved', shelf: 'CS-01' },
      ];
    }
    
    const query = bookSearch.trim().toLowerCase();
    const found = catalog.find(b => b.isbn.toLowerCase() === query || b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));
    
    if (found) {
      setMatchedBook(found);
      setShowBook(true);
      showToast('success', `Verified book: ${found.title}`);
    } else {
      setMatchedBook(null);
      setShowBook(false);
      showToast('error', 'No book found matching this query.');
    }
  };

  const handleProcessTransaction = () => {
    if (!matchedMember) {
      showToast('error', 'Please verify a Member Identity first.');
      return;
    }
    if (!matchedBook) {
      showToast('error', 'Please verify a Book from the catalog first.');
      return;
    }

    // Get books from localStorage
    let catalog = [];
    try {
      const stored = localStorage.getItem('library_books');
      if (stored) catalog = JSON.parse(stored);
    } catch (e) {}

    // Get members from localStorage
    let members = [];
    try {
      const stored = localStorage.getItem('library_members');
      if (stored) members = JSON.parse(stored);
    } catch (e) {}

    if (catalog.length === 0) {
      catalog = [
        { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', isbn: '978-0743273565', status: 'Available', shelf: 'A-12' },
        { id: 2, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', category: 'Computer Science', isbn: '978-0262033848', status: 'Issued', shelf: 'CS-04' },
        { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', isbn: '978-0553380163', status: 'Available', shelf: 'S-08' },
        { id: 4, title: 'The Art of Computer Programming', author: 'Donald Knuth', category: 'Computer Science', isbn: '978-0201896831', status: 'Reserved', shelf: 'CS-01' },
      ];
    }
    if (members.length === 0) {
      members = [
        { id: 'LIB-M-001', name: 'Harry Potter', role: 'Student', class: 'Grade 10-A', booksIssued: 2, status: 'Active' },
        { id: 'LIB-M-002', name: 'Hermione Granger', role: 'Student', class: 'Grade 10-A', booksIssued: 5, status: 'Active' },
        { id: 'LIB-M-003', name: 'Robert Lane', role: 'Guardian', class: 'Ward: Devon Lane (10A)', booksIssued: 1, status: 'Active' },
        { id: 'LIB-M-004', name: 'Albus Dumbledore', role: 'Teacher', dept: 'Administration', booksIssued: 12, status: 'Elite' },
      ];
    }

    if (mode === 'issue') {
      if (matchedBook.status === 'Issued') {
        showToast('error', `"${matchedBook.title}" is already issued to another member.`);
        return;
      }

      // Update book status
      const updatedCatalog = catalog.map(b => b.id === matchedBook.id ? { ...b, status: 'Issued' } : b);
      localStorage.setItem('library_books', JSON.stringify(updatedCatalog));

      // Update member issued count
      const updatedMembers = members.map(m => m.id === matchedMember.id ? { ...m, booksIssued: (m.booksIssued || 0) + 1 } : m);
      localStorage.setItem('library_members', JSON.stringify(updatedMembers));

      showToast('success', `Successfully issued "${matchedBook.title}" to ${matchedMember.name}!`);
    } else {
      // Return mode
      // Update book status
      const updatedCatalog = catalog.map(b => b.id === matchedBook.id ? { ...b, status: 'Available' } : b);
      localStorage.setItem('library_books', JSON.stringify(updatedCatalog));

      // Update member issued count
      const updatedMembers = members.map(m => m.id === matchedMember.id ? { ...m, booksIssued: Math.max(0, (m.booksIssued || 1) - 1) } : m);
      localStorage.setItem('library_members', JSON.stringify(updatedMembers));

      showToast('success', `Processed return of "${matchedBook.title}" from ${matchedMember.name}!`);
    }

    // Reset fields
    setSearchId('');
    setShowMember(false);
    setMatchedMember(null);
    setBookSearch('');
    setShowBook(false);
    setMatchedBook(null);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const dueStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444', color: 'white',
              padding: '16px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Circulation Desk</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Efficiently handle book issuance and returns with real-time inventory updates.</p>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
           <button 
             onClick={() => setMode('issue')}
             style={{ 
               padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer',
               backgroundColor: mode === 'issue' ? 'var(--primary)' : 'transparent',
               color: mode === 'issue' ? 'white' : 'var(--text-muted)',
               transition: '0.3s'
             }}
           >
              ISSUE BOOK
           </button>
           <button 
             onClick={() => setMode('return')}
             style={{ 
               padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 900, cursor: 'pointer',
               backgroundColor: mode === 'return' ? '#ec4899' : 'transparent',
               color: mode === 'return' ? 'white' : 'var(--text-muted)',
               transition: '0.3s'
             }}
           >
              RETURN BOOK
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
         {/* Step 1: Identity Verification */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <User size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950 }}>{mode === 'issue' ? 'Issuer' : 'Returnee'} Identity</h3>
               </div>
               
               <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                     <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                     <input 
                       type="text" 
                       placeholder="Search Member by ID or Name..." 
                       value={searchId}
                       onChange={(e) => setSearchId(e.target.value)}
                       onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                       style={{ width: '100%', padding: '20px 20px 20px 56px', borderRadius: '20px', border: '2px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}
                     />
                  </div>
                  <button 
                     onClick={handleSearch}
                     style={{
                        padding: '0 24px',
                        borderRadius: '20px',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: '0.2s',
                        boxShadow: '0 4px 12px rgba(78, 128, 255, 0.2)'
                     }}
                  >
                     Verify ID
                  </button>
               </div>

               <AnimatePresence>
                  {showMember && matchedMember && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ padding: '24px', backgroundColor: 'var(--primary-light)', borderRadius: '20px', border: '1px solid var(--primary-light)', display: 'flex', gap: '20px', alignItems: 'center' }}
                    >
                       <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, overflow: 'hidden' }}>
                          {getMemberAvatar(matchedMember.name) ? (
                            <img 
                              src={getMemberAvatar(matchedMember.name)} 
                              alt={matchedMember.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            matchedMember.name.charAt(0)
                          )}
                       </div>
                       <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontWeight: 900 }}>{matchedMember.name}</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                            {matchedMember.role} • {matchedMember.class || matchedMember.dept} • {matchedMember.status.toUpperCase()}
                          </p>
                       </div>
                       <ShieldCheck color="var(--primary)" size={24} />
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <h4 style={{ fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><HelpCircle size={18} /> Desk Intelligence</h4>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {mode === 'issue' 
                    ? 'Verify that the book ISBN matches the system record before finalizing the issuance. Members can borrow up to 15 books.' 
                    : 'Inspect the book for physical damage before processing the return. Any delay beyond 15 days will incur a fine.'}
               </p>
            </div>
         </div>

         {/* Step 2: Resource Allocation */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: mode === 'issue' ? 'var(--primary-light)' : '#fce7f3', color: mode === 'issue' ? 'var(--primary)' : '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Book size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950 }}>Resource Cataloging</h3>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                     <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Book Title or ISBN</p>
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                           <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                           <input 
                             type="text" 
                             placeholder="Search book by Title or ISBN..." 
                             value={bookSearch}
                             onChange={(e) => setBookSearch(e.target.value)}
                             onKeyDown={(e) => { if (e.key === 'Enter') handleBookSearch(); }}
                             style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
                           />
                        </div>
                        <button 
                           onClick={handleBookSearch}
                           style={{
                              padding: '0 20px',
                              borderRadius: '16px',
                              backgroundColor: mode === 'issue' ? 'var(--primary)' : '#ec4899',
                              color: 'white',
                              border: 'none',
                              fontWeight: 900,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: '0.2s'
                           }}
                        >
                           Verify Book
                        </button>
                     </div>

                     <AnimatePresence>
                        {showBook && matchedBook && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ padding: '20px', backgroundColor: 'var(--primary-light)', borderRadius: '16px', border: '1px solid var(--primary-light)', display: 'flex', gap: '16px', alignItems: 'center', marginTop: '12px' }}
                          >
                               <div style={{ width: '48px', height: '64px', backgroundColor: mode === 'issue' ? 'var(--primary)' : '#ec4899', borderRadius: '2px 6px 6px 2px', flexShrink: 0, boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.2), inset -1px 0 1px rgba(255,255,255,0.4), 3px 3px 8px rgba(0,0,0,0.15)', borderLeft: '2px solid rgba(255,255,255,0.25)', position: 'relative', overflow: 'hidden' }}>
                                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px', textAlign: 'center', color: 'white' }}>
                                    <Book size={16} style={{ opacity: 0.8 }} />
                                  </div>
                                  {matchedBook.isbn && (
                                    <img 
                                      src={`https://covers.openlibrary.org/b/isbn/${matchedBook.isbn.replace(/-/g, '')}-S.jpg`} 
                                      alt={matchedBook.title}
                                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0) 20%)', zIndex: 3, pointerEvents: 'none' }} />
                               </div>
                             <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem' }}>{matchedBook.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>by {matchedBook.author} • Shelf {matchedBook.shelf}</p>
                             </div>
                             <span style={{ 
                               padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800,
                               backgroundColor: matchedBook.status === 'Available' ? '#ecfdf5' : '#fef2f2',
                               color: matchedBook.status === 'Available' ? '#10b981' : '#ef4444'
                             }}>
                               {matchedBook.status}
                             </span>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{mode === 'issue' ? 'Issue Date' : 'Return Date'}</p>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <Calendar size={18} className="text-muted" />
                           <span style={{ fontWeight: 700 }}>{todayStr}</span>
                        </div>
                     </div>
                     <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{mode === 'issue' ? 'Due Date' : 'Fine Calculated'}</p>
                        <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                           <Clock size={18} className="text-muted" />
                           <span style={{ fontWeight: 700 }}>{mode === 'issue' ? dueStr : '$0.00'}</span>
                        </div>
                     </div>
                  </div>

                  <button onClick={handleProcessTransaction} className="btn btn-primary" style={{ marginTop: '20px', padding: '20px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '1.1rem', fontWeight: 900, backgroundColor: mode === 'issue' ? 'var(--primary)' : '#ec4899', border: 'none', cursor: 'pointer', color: 'white' }}>
                     {mode === 'issue' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                     Process {mode === 'issue' ? 'Issuance' : 'Return'}
                  </button>
               </div>
            </div>
            
            <div style={{ display: 'flex', gap: '20px' }}>
               <div className="card" style={{ flex: 1, padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                  <h5 style={{ fontWeight: 800, marginBottom: '4px', color: 'var(--text-muted)' }}>Daily Desk Hub</h5>
                  <p style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0 }}>42 Transactions</p>
               </div>
               <div className="card" style={{ flex: 1, padding: '24px', textAlign: 'center', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                  <h5 style={{ fontWeight: 800, marginBottom: '4px', color: 'var(--text-muted)' }}>Current Desk SLA</h5>
                  <p style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0, color: '#10b981' }}>99.2%</p>
               </div>
            </div>
         </div>
      </div>
   </div>
  );
};

export default IssueReturn;
