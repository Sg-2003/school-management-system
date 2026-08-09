import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Calendar, CheckCircle, 
  XCircle, Clock, MoreVertical, Download, 
  ArrowLeft, ChevronLeft, ChevronRight, UserCheck, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast, ToastRenderer } from '../hooks/useToast';

// ─── Hook: reads dark-mode from localStorage + syncs with Topbar toggle ──────
const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(
    () => localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark'
  );
  React.useEffect(() => {
    const sync = () => setIsDark(localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('storage', sync);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', sync);
      observer.disconnect();
    };
  }, []);
  return isDark;
};

// ─── Student Avatar Helper Component ─────────────────────────────────────────
const StudentAvatar = ({ name, size = 40, border = '1px solid rgba(99,102,241,0.25)', borderRadius = '12px' }) => {
  const [imgError, setImgError] = useState(false);
  const avatars = {
    'Aanya Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Aanya%20Sharma',
    'Rohan Malhotra': 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Malhotra',
    'Karan Mehta': 'https://api.dicebear.com/7.x/initials/svg?seed=Karan%20Mehta',
    'Divya Joshi': 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi',
    'Aman Verma': 'https://api.dicebear.com/7.x/initials/svg?seed=Aman%20Verma',
    'Neha Patel': 'https://api.dicebear.com/7.x/initials/svg?seed=Neha%20Patel',
    'Kabir Sen': 'https://api.dicebear.com/7.x/initials/svg?seed=Kabir%20Sen',
    'Aditi Nair': 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair',
  };

  const url = avatars[name] || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;

  if (imgError) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(6, 182, 212, 0.2))',
        color: '#6366f1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: size > 45 ? '1.25rem' : '0.9rem',
        flexShrink: 0,
        border,
        userSelect: 'none'
      }}>
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <div style={{ width: `${size}px`, height: `${size}px`, borderRadius, overflow: 'hidden', flexShrink: 0, border, transition: 'transform 0.2s ease' }}>
      <img
        src={url}
        alt={name}
        onError={() => setImgError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

const MessAttendance = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const { toast, showToast, hideToast } = useToast();

  const T = {
    bg:         'var(--bg-body)',
    bgCard:     'var(--bg-card)',
    bgRaised:   isDark ? 'rgba(0,0,0,0.15)'           : '#f1f5f9',
    border:     'var(--border-color)',
    borderSub:  'var(--border-color)',
    textMain:   isDark ? '#f1f5f9'                    : 'var(--text-main)',
    textSub:    isDark ? '#94a3b8'                    : '#64748b',
    textMuted:  isDark ? '#475569'                    : '#94a3b8',
    primary:    isDark ? '#6366f1'                    : 'var(--primary)',
    primaryGlow:isDark ? 'rgba(99,102,241,0.25)'      : 'rgba(69,179,224,0.15)',
    success:    '#10b981',
    warning:    '#f59e0b',
    danger:     '#ef4444',
    cyan:       '#06b6d4',
    pink:       '#ec4899',
    // inputs
    inputBg:    isDark ? 'rgba(255,255,255,0.04)'     : 'var(--bg-body)',
    inputBorder:isDark ? 'rgba(255,255,255,0.08)'     : 'var(--border-color)',
    hoverBg:    isDark ? 'rgba(255,255,255,0.07)'     : 'var(--primary-light)',
    // buttons
    ghostBg:    isDark ? 'rgba(99,102,241,0.09)'      : 'rgba(69,179,224,0.05)',
    ghostBgHov: isDark ? 'rgba(99,102,241,0.2)'       : 'rgba(69,179,224,0.14)',
    actionBg:   isDark ? 'rgba(255,255,255,0.03)'     : '#f8fafc',
    actionBgHov:isDark ? 'rgba(255,255,255,0.08)'     : '#f1f5f9',
    // shadow
    shadow:     isDark ? '0 4px 24px rgba(0,0,0,0.5)':'0 4px 20px rgba(0,0,0,0.02)',
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const [attendance, setAttendance] = useState([
    { id: 1, name: 'Aanya Sharma', idNo: 'STU-2026-001', meal: 'Breakfast', time: '08:15 AM', status: 'Present', color: '#4f46e5' },
    { id: 2, name: 'Rohan Malhotra', idNo: 'STU-2026-045', meal: 'Breakfast', time: '08:20 AM', status: 'Present', color: '#ec4899' },
    { id: 3, name: 'Karan Mehta', idNo: 'STU-2026-122', meal: 'Breakfast', time: '08:45 AM', status: 'Present', color: '#10b981' },
    { id: 4, name: 'Divya Joshi', idNo: 'STU-2026-089', meal: 'Lunch', time: '01:05 PM', status: 'Present', color: '#f59e0b' },
    { id: 5, name: 'Aman Verma', idNo: 'STU-2026-156', meal: 'Lunch', time: '---', status: 'Absent', color: '#64748b' },
    { id: 6, name: 'Neha Patel', idNo: 'STU-2026-201', meal: 'Lunch', time: '01:15 PM', status: 'Present', color: '#ec4899' },
    { id: 7, name: 'Kabir Sen', idNo: 'STU-2026-245', meal: 'Dinner', time: '07:45 PM', status: 'Present', color: '#4f46e5' },
    { id: 8, name: 'Aditi Nair', idNo: 'STU-2026-312', meal: 'Dinner', time: '08:05 PM', status: 'Present', color: '#ec4899' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterMeal, setFilterMeal] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Daily Dining Attendance Report exported successfully!', 'success', 'Report Exported');
    }, 2000);
  };

  const filteredAttendance = attendance.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.idNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMeal = filterMeal === 'All' || a.meal === filterMeal;
    return matchesSearch && matchesMeal;
  });

  return (
    <>
    <div style={{ padding: '40px', backgroundColor: T.bg, minHeight: '100vh', color: T.textMain, fontFamily: 'Inter, system-ui, sans-serif', transition: 'background-color 0.4s, color 0.4s' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <button 
             onClick={() => navigate('/dashboard/mess-overview')}
             style={{ width: '48px', height: '48px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.bgCard, color: T.textMain, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
             onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.hoverBg; e.currentTarget.style.borderColor=T.primary; }}
             onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.bgCard; e.currentTarget.style.borderColor=T.border; }}
           >
              <ArrowLeft size={20} />
           </button>
           <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: T.textMain, letterSpacing: '-1.5px', marginBottom: '8px', margin: 0 }}>Dining Attendance</h1>
              <p style={{ color: T.textSub, fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Monitor live student meal verification and participation rates.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <button 
             onClick={handleExportReport}
             disabled={isExporting}
             style={{ 
               padding: '16px 24px', borderRadius: '18px', border: `1px solid ${T.border}`, 
               backgroundColor: T.bgCard, color: isExporting ? T.textMuted : T.textMain, 
               fontWeight: 800, fontSize: '0.9rem', cursor: isExporting ? 'not-allowed' : 'pointer', 
               display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', height: '48px' 
             }}
             onMouseEnter={e => { if(!isExporting){ e.currentTarget.style.backgroundColor=T.hoverBg; e.currentTarget.style.borderColor=T.primary; } }}
             onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.bgCard; e.currentTarget.style.borderColor=T.border; }}
           >
              <Download size={18} /> {isExporting ? 'Compiling...' : 'Export Daily Report'}
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
         <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: T.textSub }} size={18} />
            <input 
              type="text" placeholder="Search by student name or ID..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 54px', borderRadius: '18px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s' }}
            />
         </div>
         <div style={{ display: 'flex', backgroundColor: T.bgCard, padding: '6px', borderRadius: '18px', border: `1px solid ${T.border}`, gap: '8px' }}>
            {['All', 'Breakfast', 'Lunch', 'Dinner'].map(meal => (
              <button 
                key={meal}
                onClick={() => setFilterMeal(meal)}
                style={{ 
                  padding: '10px 20px', borderRadius: '14px', border: 'none',
                  backgroundColor: filterMeal === meal ? (isDark ? T.primary : '#0f172a') : 'transparent',
                  color: filterMeal === meal ? 'white' : T.textSub,
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.3s'
                }}
              >
                 {meal}
              </button>
            ))}
         </div>
      </div>

      {/* Attendance Ledger */}
      <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', border: `1px solid ${T.border}`, overflow: 'hidden', boxShadow: T.shadow, transition: 'background-color 0.4s, border-color 0.4s' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ backgroundColor: T.actionBg, borderBottom: `1px solid ${T.borderSub}` }}>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>STUDENT & ID</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>MEAL SESSION</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>ENTRY TIME</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>STATUS</th>
                  <th style={{ padding: '24px 32px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>VERIFICATION</th>
               </tr>
            </thead>
            <tbody>
               {filteredAttendance.map((record, i) => (
                 <motion.tr 
                   key={record.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                   style={{ borderBottom: `1px solid ${T.borderSub}` }}
                 >
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <StudentAvatar name={record.name} size={40} borderRadius="12px" border={`1px solid ${record.color}25`} />
                          <div>
                             <div style={{ fontSize: '0.95rem', fontWeight: 800, color: T.textMain }}>{record.name}</div>
                             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textSub }}>{record.idNo}</div>
                          </div>
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textMain }}>{record.meal}</span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: T.textSub }}>
                          <Clock size={14} /> {record.time}
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ 
                         padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                         backgroundColor: record.status === 'Present' ? `${T.success}18` : `${T.danger}18`,
                         color: record.status === 'Present' ? T.success : T.danger
                       }}>
                          {record.status}
                       </span>
                    </td>
                    <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                          {record.status === 'Present' ? (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: T.success, fontWeight: 800, fontSize: '0.8rem' }}>
                                <CheckCircle size={16} /> Biometric Verified
                             </div>
                          ) : (
                             <button 
                               onClick={() => {
                                 setAttendance(attendance.map(a => a.id === record.id ? { ...a, status: 'Present', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : a));
                                 showToast(`${record.name} marked as Present.`, 'success', 'Verification Complete');
                               }}
                               style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${T.border}`, backgroundColor: T.ghostBg, color: T.primary, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                               onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.ghostBgHov; e.currentTarget.style.borderColor=T.primary; }}
                               onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.ghostBg; e.currentTarget.style.borderColor=T.border; }}
                             >Mark Present</button>
                          )}
                       </div>
                    </td>
                 </motion.tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default MessAttendance;
