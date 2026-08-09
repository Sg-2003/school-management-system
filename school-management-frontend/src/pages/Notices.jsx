import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Megaphone, Plus, Bell, Trash2, Search, Filter, Calendar, User, MoreVertical, Pin, ShieldAlert, CheckCircle, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoticesApi } from '../services/service';

const Notices = () => {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [selectedNotice, setSelectedNotice] = useState(null);

  const defaultNotices = [
    { id: 1, title: 'Annual Sports Meet 2026', content: 'The annual sports meet is scheduled for next month. All students are requested to register for events by the end of this week.', target: 'All Students', date: '2026-05-15', category: 'Events', pinned: true },
    { id: 2, title: 'Summer Vacation Announcement', content: 'The school will remain closed for summer vacation from June 1st to July 15th. Have a great break!', target: 'Everyone', date: '2026-05-12', category: 'Academic', pinned: true },
    { id: 3, title: 'Parent-Teacher Meeting', content: 'PTM for the first quarter will be held this Saturday. Attendance is mandatory for all parents.', target: 'Parents', date: '2026-05-10', category: 'General', pinned: false },
    { id: 4, title: 'New Library Policy', content: 'Please note the updated library timings and book issue limits starting next Monday.', target: 'Students & Staff', date: '2026-05-08', category: 'Library', pinned: false },
    { id: 5, title: 'Semester 2 Academic Syllabus Review', content: 'The revised syllabus for Semester 2 has been updated in the LMS resources directory. All teachers and students are requested to download the updated guides.', target: 'Students & Staff', date: '2026-05-20', category: 'Academic', pinned: false },
    { id: 6, title: 'Digital Portal Scheduled Maintenance', content: 'The EduPro portal and server database will undergo scheduled security updates this Sunday from 02:00 AM to 06:00 AM. Access might be temporarily offline.', target: 'Everyone', date: '2026-05-18', category: 'General', pinned: false },
    { id: 7, title: 'Annual Science Exhibition Registration', content: 'Registration for the Annual Science Exhibition is now open! Please submit your project abstract and team names to the science department by next Friday.', target: 'All Students', date: '2026-05-17', category: 'Events', pinned: false }
  ];

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('institutional_notices');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasNewNotices = parsed.some(n => n.id === 5 || n.id === 6 || n.id === 7);
        if (!hasNewNotices) {
          localStorage.setItem('institutional_notices', JSON.stringify(defaultNotices));
          return defaultNotices;
        }
        return parsed;
      } catch (e) {
        return defaultNotices;
      }
    }
    return defaultNotices;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Quick Action Sheet and Confirm Delete states
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Custom Edit notice state
  const [editingNotice, setEditingNotice] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', category: 'General', target: 'All', content: '' });

  // Custom Toast state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('institutional_notices', JSON.stringify(notices));
  }, [notices]);

  // Fetch notices from backend on mount
  useEffect(() => {
    NoticesApi.getNotices()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(n => ({
            id: n.id,
            title: n.title,
            content: n.content,
            target: n.target || 'Everyone',
            date: n.created_at ? new Date(n.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            category: n.type ? (n.type.charAt(0).toUpperCase() + n.type.slice(1)) : 'General',
            pinned: n.pinned || false
          }));
          setNotices(mapped);
          localStorage.setItem('institutional_notices', JSON.stringify(mapped));
        }
      })
      .catch(() => { /* keep localStorage fallback */ });
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.triggerToast) {
      showToast(location.state.triggerToast, 'success');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const filteredNotices = notices
    .filter(notice => {
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            notice.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All Categories' || notice.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Institutional Notice Board</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Centralized communication hub for broadcasting announcements, events, and official updates.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/dashboard/add-notice')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
        >
          <Plus size={20} /> Create Announcement
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
         {/* Main Notices Stream */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredNotices.map((notice, idx) => (
              <motion.div 
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card"
                style={{ padding: '28px', borderLeft: notice.pinned ? '6px solid var(--primary)' : '1px solid var(--border-color)', position: 'relative' }}
              >
                {notice.pinned && (
                   <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--primary)' }}>
                      <Pin size={16} fill="var(--primary)" />
                   </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                   <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                         <span style={{ 
                            padding: '4px 12px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 800,
                            backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase'
                         }}>
                            {notice.category}
                         </span>
                         <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} /> {notice.date}
                         </span>
                      </div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-main)' }}>{notice.title}</h3>
                   </div>
                   <button 
                     onClick={() => setShowActionsMenu(notice)}
                     style={{ 
                       width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--border-color)', 
                       backgroundColor: showActionsMenu?.id === notice.id ? 'var(--bg-body)' : 'var(--bg-card)', 
                       color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
                     }}
                   >
                     <MoreVertical size={18} />
                   </button>
                </div>

                <p style={{ color: 'var(--text-main)', lineHeight: '1.7', fontSize: '1rem', marginBottom: '20px' }}>
                   {notice.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0 0', borderTop: '1px solid var(--border-color)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
                      <User size={16} /> Audience: <span style={{ color: 'var(--text-main)' }}>{notice.target}</span>
                   </div>
                   <button 
                     className="btn" 
                     onClick={() => setSelectedNotice(notice)}
                     style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                   >
                      Read More
                   </button>
                </div>
              </motion.div>
            ))}
         </div>

         {/* Sidebar: Filters & Quick Actions */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
               <h4 style={{ fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Filter size={18} /> Filter Notices
               </h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                     <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                     <input 
                       type="text" placeholder="Search notices..." 
                       value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                       style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }} 
                     />
                  </div>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none' }}
                  >
                     <option value="All Categories">All Categories</option>
                     <option value="Academic">Academic</option>
                     <option value="Events">Events</option>
                     <option value="Library">Library</option>
                     <option value="General">General</option>
                  </select>
               </div>
            </div>

            <div className="card" style={{ padding: '24px', backgroundColor: 'var(--primary)', color: 'white' }}>
               <Bell size={32} style={{ marginBottom: '16px' }} />
               <h4 style={{ fontWeight: 900, marginBottom: '8px' }}>Push Notifications</h4>
               <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '20px' }}>Broadcast important alerts directly to user mobile devices and dashboards.</p>
               <button 
                 className="btn" 
                 onClick={() => {
                   showToast("Push notification channel validated. API service online.", "success");
                 }}
                 style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontWeight: 800, padding: '12px', cursor: 'pointer' }}
               >
                  Config Push API
               </button>
            </div>
         </div>
      </div>

      {/* Notice Detail Modal */}
      <AnimatePresence>
        {selectedNotice && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '48px', borderRadius: '32px', maxWidth: '700px', width: '100%', boxShadow: 'var(--shadow-2xl)', position: 'relative' }}
            >
              <button 
                onClick={() => setSelectedNotice(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ padding: '6px 16px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {selectedNotice.category}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} /> {selectedNotice.date}
                </span>
              </div>

              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-main)', lineHeight: '1.2' }}>{selectedNotice.title}</h2>
              
              <div style={{ color: 'var(--text-main)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '40px' }}>
                {selectedNotice.content}
                <p style={{ marginTop: '20px' }}>This is an official institutional announcement. Please ensure compliance or registration as per the details mentioned above. For further inquiries, contact the administration office.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0 0', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
                  <User size={18} /> Audience: <span style={{ color: 'var(--text-main)' }}>{selectedNotice.target}</span>
                </div>
                <button className="btn btn-primary" onClick={() => setSelectedNotice(null)} style={{ padding: '12px 32px', borderRadius: '14px' }}>
                  Close Announcement
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Announcement Actions Drawer */}
      <AnimatePresence>
        {showActionsMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowActionsMenu(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'relative', width: '100%', maxWidth: '500px', 
                backgroundColor: 'var(--bg-card)', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', 
                padding: '36px', boxShadow: '0 -20px 40px rgba(0,0,0,0.15)', zIndex: 901,
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ width: '40px', height: '5px', backgroundColor: 'var(--border-color)', borderRadius: '10px', margin: '0 auto 24px' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.25rem' }}>
                  {showActionsMenu.category.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{showActionsMenu.title}</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', margin: '4px 0 0' }}>Audience: {showActionsMenu.target} &bull; {showActionsMenu.date}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => {
                    const updated = notices.map(n => n.id === showActionsMenu.id ? { ...n, pinned: !n.pinned } : n);
                    setNotices(updated);
                    const action = showActionsMenu.pinned ? "unpinned" : "pinned";
                    showToast(`Announcement has been successfully ${action}!`, "success");
                    setShowActionsMenu(null);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                     <Pin size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>{showActionsMenu.pinned ? 'Unpin Announcement' : 'Pin Announcement'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Float this notice to the top of the notice board</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setEditingNotice(showActionsMenu);
                    setEditFormData({
                      title: showActionsMenu.title,
                      category: showActionsMenu.category,
                      target: showActionsMenu.target,
                      content: showActionsMenu.content
                    });
                    setShowActionsMenu(null);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                     <Megaphone size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>Edit Announcement Parameters</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Modify text, category, or audience targets</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setDeleteConfirmId(showActionsMenu.id);
                    setShowActionsMenu(null);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: '1px solid #fee2e2', 
                    backgroundColor: '#fff5f5', color: '#dc2626', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444' }}>
                     <Trash2 size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>Delete Announcement</div>
                    <div style={{ fontSize: '0.75rem', color: '#ef444490', fontWeight: 500 }}>Permanently remove from the system notice board</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setShowActionsMenu(null)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: '16px', border: 'none', 
                  backgroundColor: 'var(--border-color)', color: 'var(--text-muted)', fontWeight: 800, 
                  fontSize: '0.9rem', cursor: 'pointer', marginTop: '20px'
                }}
              >
                Close Actions Panel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notice Edit Modal */}
      <AnimatePresence>
        {editingNotice && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setEditingNotice(null)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '48px', boxShadow: 'var(--shadow-2xl)' }}
             >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>Edit Announcement</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', fontWeight: 600 }}>Update institutional parameters for this broadcast.</p>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNotices(notices.map(n => n.id === editingNotice.id ? {
                      ...n,
                      title: editFormData.title,
                      category: editFormData.category,
                      target: editFormData.target,
                      content: editFormData.content
                    } : n));
                    setEditingNotice(null);
                    showToast("Announcement updated successfully!", "success");
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Notice Title</label>
                      <input 
                        required type="text" placeholder="Title"
                        value={editFormData.title} onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 700 }}
                      />
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Category</label>
                        <select 
                          value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 700 }}
                        >
                           <option>General</option>
                           <option>Academic</option>
                           <option>Events</option>
                           <option>Library</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Audience</label>
                        <select 
                          value={editFormData.target} onChange={(e) => setEditFormData({...editFormData, target: e.target.value})}
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 700 }}
                        >
                           <option>All Students</option>
                           <option>Everyone</option>
                           <option>Parents</option>
                           <option>Students & Staff</option>
                        </select>
                     </div>
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Content</label>
                      <textarea 
                        required placeholder="Write details..." rows={4}
                        value={editFormData.content} onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, resize: 'vertical' }}
                      />
                   </div>
                   <button type="submit" style={{ padding: '18px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>Update Broadcast</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Safety Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (() => {
          const targetNotice = notices.find(n => n.id === deleteConfirmId);
          if (!targetNotice) return null;
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1010, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
                style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{ 
                  position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: 'var(--bg-card)', 
                  borderRadius: '32px', padding: '40px', boxShadow: 'var(--shadow-2xl)',
                  textAlign: 'center', border: '1px solid #fee2e2'
                }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <ShieldAlert size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '12px' }}>Delete Notice</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500, marginBottom: '32px' }}>
                  Are you absolutely sure you want to permanently delete the announcement <strong style={{ color: 'var(--text-main)', fontWeight: 800 }}>"{targetNotice.title}"</strong>? This will remove it from all user notice streams.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    style={{ 
                      padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' 
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const updated = notices.filter(n => n.id !== deleteConfirmId);
                      setNotices(updated);
                      showToast("Notice has been successfully deleted.", "success");
                      // Sync delete to backend
                      NoticesApi.deleteNotice(deleteConfirmId).catch(() => {});
                      setDeleteConfirmId(null);
                    }}
                    style={{ 
                      padding: '16px', borderRadius: '16px', border: 'none', 
                      backgroundColor: '#ef4444', color: 'white', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                      boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    Delete Notice
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#10b98120', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4' }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notices;
