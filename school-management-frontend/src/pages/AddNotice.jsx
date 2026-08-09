import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Megaphone, Users, Calendar, Type, AlignLeft, ShieldCheck, Clock, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NoticesApi } from '../services/service';

const AddNotice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    target: 'All',
    content: '',
    isPinned: false,
    activationDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  const categories = ['General', 'Academic', 'Events', 'Holiday', 'Examination', 'Library'];
  const audiences = ['All', 'Students', 'Teachers', 'Parents', 'Staff'];

  // Custom Toast state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePublish = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Please enter a notice title.', 'error');
      return;
    }
    if (!formData.content.trim()) {
      showToast('Please enter notice content.', 'error');
      return;
    }

    const defaultNotices = [
      { id: 1, title: 'Annual Sports Meet 2026', content: 'The annual sports meet is scheduled for next month. All students are requested to register for events by the end of this week.', target: 'All Students', date: '2026-05-15', category: 'Events', pinned: true },
      { id: 2, title: 'Summer Vacation Announcement', content: 'The school will remain closed for summer vacation from June 1st to July 15th. Have a great break!', target: 'Everyone', date: '2026-05-12', category: 'Academic', pinned: true },
      { id: 3, title: 'Parent-Teacher Meeting', content: 'PTM for the first quarter will be held this Saturday. Attendance is mandatory for all parents.', target: 'Parents', date: '2026-05-10', category: 'General', pinned: false },
      { id: 4, title: 'New Library Policy', content: 'Please note the updated library timings and book issue limits starting next Monday.', target: 'Students & Staff', date: '2026-05-08', category: 'Library', pinned: false },
      { id: 5, title: 'Semester 2 Academic Syllabus Review', content: 'The revised syllabus for Semester 2 has been updated in the LMS resources directory. All teachers and students are requested to download the updated guides.', target: 'Students & Staff', date: '2026-05-20', category: 'Academic', pinned: false },
      { id: 6, title: 'Digital Portal Scheduled Maintenance', content: 'The EduPro portal and server database will undergo scheduled security updates this Sunday from 02:00 AM to 06:00 AM. Access might be temporarily offline.', target: 'Everyone', date: '2026-05-18', category: 'General', pinned: false },
      { id: 7, title: 'Annual Science Exhibition Registration', content: 'Registration for the Annual Science Exhibition is now open! Please submit your project abstract and team names to the science department by next Friday.', target: 'All Students', date: '2026-05-17', category: 'Events', pinned: false }
    ];

    const saved = localStorage.getItem('institutional_notices');
    let currentNotices = defaultNotices;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasNewNotices = parsed.some(n => n.id === 5 || n.id === 6 || n.id === 7);
        if (!hasNewNotices) {
          localStorage.setItem('institutional_notices', JSON.stringify(defaultNotices));
        } else {
          currentNotices = parsed;
        }
      } catch (e) {
        currentNotices = defaultNotices;
      }
    }

    let formattedTarget = formData.target;
    if (formData.target === 'All') formattedTarget = 'All Students';
    else if (formData.target === 'Staff') formattedTarget = 'Students & Staff';

    const newNotice = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      target: formattedTarget,
      date: formData.activationDate || new Date().toISOString().split('T')[0],
      category: formData.category,
      pinned: formData.isPinned,
      expiryDate: formData.expiryDate
    };

    const updated = [newNotice, ...currentNotices];
    localStorage.setItem('institutional_notices', JSON.stringify(updated));

    try {
      await NoticesApi.postNotice({
        title: formData.title,
        content: formData.content,
        type: formData.category.toLowerCase()
      });
    } catch (err) {
      console.warn("Could not sync with backend notice database:", err);
    }

    navigate('/dashboard/notices', { state: { triggerToast: 'Announcement published successfully!' } });
  };

  const handleDiscard = () => {
    if (formData.title.trim() || formData.content.trim()) {
      if (window.confirm('Are you sure you want to discard this draft? All changes will be lost.')) {
        navigate('/dashboard/notices');
      }
    } else {
      navigate('/dashboard/notices');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Post New Notice</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Draft and broadcast institutional announcements to specific audiences across the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
             className="btn" 
             onClick={handleDiscard}
             style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
           >
              <X size={20} /> Discard Draft
           </button>
           <button 
             className="btn btn-primary" 
             onClick={handlePublish}
             style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
           >
              <Send size={20} /> Publish Notice
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
         {/* Form Section */}
         <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
               <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                     <Type size={16} /> Notice Title
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter a descriptive title for the announcement..." 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontSize: '1.1rem', fontWeight: 600 }}
                  />
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                        <FileText size={16} /> Category
                     </label>
                     <select 
                       value={formData.category}
                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                       style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600 }}
                     >
                        {categories.map(c => <option key={c}>{c}</option>)}
                     </select>
                  </div>
                  <div>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                        <Users size={16} /> Target Audience
                     </label>
                     <select 
                       value={formData.target}
                       onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                       style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600 }}
                     >
                        {audiences.map(a => <option key={a}>{a}</option>)}
                     </select>
                  </div>
               </div>

               <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase' }}>
                     <AlignLeft size={16} /> Notice Content
                  </label>
                  <textarea 
                    placeholder="Write your announcement details here..." 
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontSize: '1rem', lineHeight: '1.6', resize: 'vertical' }}
                  ></textarea>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: '16px' }}>
                  <input 
                    type="checkbox" 
                    id="pin" 
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }} 
                  />
                  <label htmlFor="pin" style={{ fontWeight: 800, color: 'var(--primary)', cursor: 'pointer' }}>Pin this notice to the top of the board</label>
               </div>
            </div>
         </div>

         {/* Sidebar: Preview & Settings */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} /> Schedule & Expiry
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                     <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Activation Date</p>
                     <input 
                       type="date" 
                       value={formData.activationDate}
                       onChange={(e) => setFormData({ ...formData, activationDate: e.target.value })}
                       style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }} 
                     />
                  </div>
                  <div>
                     <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Auto-Archive Date</p>
                     <input 
                       type="date" 
                       value={formData.expiryDate}
                       onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                       style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }} 
                     />
                  </div>
               </div>
            </div>

            <div className="card" style={{ padding: '32px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)', color: 'white' }}>
               <ShieldCheck size={40} style={{ marginBottom: '16px' }} />
               <h4 style={{ fontWeight: 950, fontSize: '1.2rem', marginBottom: '8px' }}>Security Verified</h4>
               <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.5' }}>All notices are logged with author credentials and IP address for institutional security compliance.</p>
            </div>
         </div>
      </div>

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
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#ef444420', 
              color: toast.type === 'success' ? '#10b981' : '#ef4444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4' }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddNotice;
