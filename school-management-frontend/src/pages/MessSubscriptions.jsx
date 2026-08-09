import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Search, Filter, Plus, Users, 
  Utensils, Calendar, CheckCircle, Clock, 
  ArrowRight, ArrowLeft, Download, MoreVertical, 
  UserCheck, ShieldCheck, BadgeCheck, XCircle, ShieldAlert, Sun, Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const MessSubscriptions = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();

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
    // overlay
    overlayBg:  isDark ? 'rgba(0,0,0,0.88)'           : 'rgba(15,23,42,0.6)',
    // shadow
    shadow:     isDark ? '0 4px 24px rgba(0,0,0,0.5)':'0 4px 20px rgba(0,0,0,0.02)',
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const defaultSubs = [
    { id: 1, name: 'Aanya Sharma', idNo: 'STU-2026-001', plan: 'Premium (3 Meals)', status: 'Active', renewal: 'June 15, 2026', color: '#4f46e5', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aanya%20Sharma' },
    { id: 2, name: 'Rohan Malhotra', idNo: 'STU-2026-045', plan: 'Standard (Lunch Only)', status: 'Expiring Soon', renewal: 'May 20, 2026', color: '#ec4899', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Malhotra' },
    { id: 3, name: 'Karan Mehta', idNo: 'STU-2026-122', plan: 'Premium (3 Meals)', status: 'Active', renewal: 'July 01, 2026', color: '#10b981', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Karan%20Mehta' },
    { id: 4, name: 'Divya Joshi', idNo: 'STU-2026-089', plan: 'Eco (Breakfast & Dinner)', status: 'Active', renewal: 'June 10, 2026', color: '#f59e0b', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi' },
    { id: 5, name: 'Aman Verma', idNo: 'STU-2026-156', plan: 'Standard (Lunch Only)', status: 'Inactive', renewal: '---', color: '#64748b', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Aman%20Verma' }
  ];

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('mess_subscriptions_v2');
    return saved ? JSON.parse(saved) : defaultSubs;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSubscriber, setActiveSubscriber] = useState(null);
  const [newEnrollment, setNewEnrollment] = useState({
    name: '',
    idNo: '',
    plan: 'Premium (3 Meals)'
  });

  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  React.useEffect(() => {
    localStorage.setItem('mess_subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const handleExportList = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Dining Subscription Ledger has been exported successfully.', 'success');
    }, 2000);
  };

  const handleEnroll = (e) => {
    e.preventDefault();
    const newSub = {
      id: subscriptions.length > 0 ? Math.max(...subscriptions.map(s => s.id)) + 1 : 1,
      ...newEnrollment,
      status: 'Active',
      renewal: 'June 15, 2026',
      color: newEnrollment.plan.includes('Premium') ? '#4f46e5' : newEnrollment.plan.includes('Standard') ? '#ec4899' : '#f59e0b'
    };
    setSubscriptions([...subscriptions, newSub]);
    setShowEnrollModal(false);
    setNewEnrollment({ name: '', idNo: '', plan: 'Premium (3 Meals)' });
    showToast(`Dining plan enrolled successfully for ${newSub.name}!`, 'success');
  };

  const handleUpdatePlan = (e) => {
    e.preventDefault();
    setSubscriptions(subscriptions.map(s => 
      s.id === activeSubscriber.id ? activeSubscriber : s
    ));
    setShowManageModal(false);
    showToast(`Dining plan updated successfully for ${activeSubscriber.name}.`, 'success');
  };

  const openManageModal = (sub) => {
    setActiveSubscriber(sub);
    setShowManageModal(true);
  };

  const filteredSubs = subscriptions.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.idNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'All' || s.plan.includes(filterPlan);
    return matchesSearch && matchesPlan;
  });

  return (
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
              <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: T.textMain, letterSpacing: '-1.5px', marginBottom: '8px', margin: 0 }}>Dining Subscriptions</h1>
              <p style={{ color: T.textSub, fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Manage student meal plans, enrollment status, and catering renewals.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <button 
             onClick={handleExportList}
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
              <Download size={18} /> {isExporting ? 'Compiling Ledger...' : 'Export List'}
           </button>
           <button 
             onClick={() => setShowEnrollModal(true)}
             style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: isDark ? T.primary : '#0f172a', color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', height: '48px', boxShadow: `0 8px 24px ${T.primaryGlow}`, transition: 'all 0.2s' }}
             onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.15)'; e.currentTarget.style.transform='translateY(-2px)'; }}
             onMouseLeave={e => { e.currentTarget.style.filter='brightness(1)'; e.currentTarget.style.transform='translateY(0)'; }}
           >
              <Plus size={18} /> Enroll Student
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
         {[
           { label: 'Active Subscribers', value: (subscriptions.filter(s => s.status === 'Active').length + 1235).toLocaleString(), icon: <Users size={20} />, color: '#4f46e5' },
           { label: 'Monthly Revenue', value: `$${((subscriptions.filter(s => s.status === 'Active').length + 1235) * 15 / 1000).toFixed(1)}k`, icon: <CreditCard size={20} />, color: '#10b981' },
           { label: 'Expiring Plans', value: (subscriptions.filter(s => s.status === 'Expiring Soon').length + 11).toString(), icon: <Clock size={20} />, color: '#f59e0b' },
           { label: 'Catering Capacity', value: '88%', icon: <Utensils size={20} />, color: '#ec4899' }
         ].map((stat, i) => (
           <div key={i} style={{ backgroundColor: T.bgCard, padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: T.shadow, transition: 'background-color 0.4s, border-color 0.4s' }}>
              <div>
                 <div style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textSub, textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain }}>{stat.value}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${stat.color}18`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${stat.color}25` }}>
                 {stat.icon}
              </div>
           </div>
         ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
         <div style={{ flex: 1, position: 'relative', minWidth: '280px' }}>
            <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: T.textSub }} size={18} />
            <input 
              type="text" placeholder="Search by subscriber name or ID..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 54px', borderRadius: '18px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s' }}
            />
         </div>
         <div style={{ display: 'flex', backgroundColor: T.bgCard, padding: '6px', borderRadius: '18px', border: `1px solid ${T.border}`, gap: '8px' }}>
            {['All', 'Premium', 'Standard', 'Eco'].map(p => (
              <button 
                key={p} onClick={() => setFilterPlan(p)}
                style={{ 
                  padding: '10px 20px', borderRadius: '14px', border: 'none',
                  backgroundColor: filterPlan === p ? (isDark ? T.primary : '#0f172a') : 'transparent',
                  color: filterPlan === p ? 'white' : T.textSub,
                  fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.3s'
                }}
              >
                 {p} Plans
              </button>
            ))}
         </div>
      </div>

      {/* Subscription Ledger */}
      <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', border: `1px solid ${T.border}`, overflow: 'hidden', boxShadow: T.shadow, transition: 'background-color 0.4s, border-color 0.4s' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ backgroundColor: T.actionBg, borderBottom: `1px solid ${T.borderSub}` }}>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>SUBSCRIBER</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>MEAL PLAN</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>STATUS</th>
                  <th style={{ padding: '24px 32px', textAlign: 'left', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>RENEWAL DATE</th>
                  <th style={{ padding: '24px 32px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 800, color: T.textSub }}>ACTIONS</th>
               </tr>
            </thead>
            <tbody>
               {filteredSubs.map((sub, i) => (
                 <motion.tr 
                   key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                   style={{ borderBottom: `1px solid ${T.borderSub}` }}
                 >
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <StudentAvatar name={sub.name} size={40} borderRadius="12px" border={`1px solid ${sub.color}25`} />
                          <div>
                             <div style={{ fontSize: '0.95rem', fontWeight: 800, color: T.textMain }}>{sub.name}</div>
                             <div style={{ fontSize: '0.75rem', fontWeight: 600, color: T.textSub }}>{sub.idNo}</div>
                          </div>
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Utensils size={14} color={T.textSub} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textMain }}>{sub.plan}</span>
                       </div>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <span style={{ 
                         padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                         backgroundColor: sub.status === 'Active' ? `${T.success}18` : (sub.status === 'Expiring Soon' ? `${T.warning}18` : `${T.danger}18`),
                         color: sub.status === 'Active' ? T.success : (sub.status === 'Expiring Soon' ? T.warning : T.danger)
                       }}>
                          {sub.status}
                       </span>
                    </td>
                    <td style={{ padding: '24px 32px' }}>
                       <div style={{ fontSize: '0.9rem', fontWeight: 700, color: T.textSub }}>{sub.renewal}</div>
                    </td>
                    <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                          <button 
                            onClick={() => openManageModal(sub)}
                            style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${T.border}`, backgroundColor: T.ghostBg, color: T.primary, fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.ghostBgHov; e.currentTarget.style.borderColor=T.primary; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.ghostBg; e.currentTarget.style.borderColor=T.border; }}
                          >
                             Manage Plan
                          </button>
                          <button 
                            onClick={() => setShowActionsMenu(sub)}
                            style={{ 
                              width: '36px', 
                              height: '36px', 
                              borderRadius: '10px', 
                              border: `1px solid ${T.borderSub}`, 
                              backgroundColor: showActionsMenu?.id === sub.id ? T.actionBgHov : T.actionBg, 
                              color: T.textSub,
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.actionBgHov; e.currentTarget.style.color=T.textMain; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor=showActionsMenu?.id === sub.id ? T.actionBgHov : T.actionBg; e.currentTarget.style.color=T.textSub; }}
                          >
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </td>
                 </motion.tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {showEnrollModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowEnrollModal(false)}
               style={{ position: 'absolute', inset: 0, backgroundColor: T.overlayBg, backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: T.bgCard, borderRadius: '32px', padding: '48px', border: `1px solid ${T.border}`, boxShadow: `0 40px 100px rgba(0,0,0,${isDark?0.8:0.2})` }}
             >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: T.textMain, marginBottom: '8px', margin: 0 }}>Enroll Subscriber</h2>
                <p style={{ color: T.textSub, fontSize: '0.9rem', marginBottom: '32px', fontWeight: 600, marginTop: '4px' }}>Register a new student or faculty for the institutional dining plan.</p>
                
                <form onSubmit={handleEnroll} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: T.textSub, marginBottom: '10px' }}>Full Name</label>
                      <input 
                        required type="text" placeholder="e.g. Aarav Sharma"
                        value={newEnrollment.name} onChange={(e) => setNewEnrollment({...newEnrollment, name: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s' }}
                      />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: T.textSub, marginBottom: '10px' }}>Institutional ID No.</label>
                      <input 
                        required type="text" placeholder="e.g. STU-2026-999"
                        value={newEnrollment.idNo} onChange={(e) => setNewEnrollment({...newEnrollment, idNo: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s' }}
                      />
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: T.textSub, marginBottom: '10px' }}>Select Meal Plan</label>
                      <select 
                        value={newEnrollment.plan} onChange={(e) => setNewEnrollment({...newEnrollment, plan: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s' }}
                      >
                         <option value="Premium (3 Meals)">Premium (3 Meals)</option>
                         <option value="Standard (Lunch Only)">Standard (Lunch Only)</option>
                         <option value="Eco (Breakfast & Dinner)">Eco (Breakfast & Dinner)</option>
                      </select>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '8px' }}>
                      <button type="button" onClick={() => setShowEnrollModal(false)} style={{ padding: '14px', borderRadius: '14px', border: `1px solid ${T.borderSub}`, backgroundColor: T.actionBg, color: T.textSub, fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Cancel</button>
                      <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: `linear-gradient(135deg, ${T.primary}, #818cf8)`, color: 'white', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem', boxShadow: `0 8px 24px ${T.primaryGlow}` }}>Enroll</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Plan Modal */}
      <AnimatePresence>
        {showManageModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowManageModal(false)}
               style={{ position: 'absolute', inset: 0, backgroundColor: T.overlayBg, backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: T.bgCard, borderRadius: '32px', padding: '48px', border: `1px solid ${T.border}`, boxShadow: `0 40px 100px rgba(0,0,0,${isDark?0.8:0.2})` }}
             >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: T.textMain, marginBottom: '8px', margin: 0 }}>Modify Subscription</h2>
                <p style={{ color: T.textSub, fontSize: '0.9rem', marginBottom: '32px', fontWeight: 600, marginTop: '4px' }}>Update plan details for {activeSubscriber?.name}.</p>
                
                <form onSubmit={handleUpdatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: T.textSub, marginBottom: '10px' }}>Current Meal Plan</label>
                      <select 
                        value={activeSubscriber?.plan} onChange={(e) => setActiveSubscriber({...activeSubscriber, plan: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s' }}
                      >
                         <option value="Premium (3 Meals)">Premium (3 Meals)</option>
                         <option value="Standard (Lunch Only)">Standard (Lunch Only)</option>
                         <option value="Eco (Breakfast & Dinner)">Eco (Breakfast & Dinner)</option>
                      </select>
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: T.textSub, marginBottom: '10px' }}>Enrollment Status</label>
                      <select 
                        value={activeSubscriber?.status} onChange={(e) => setActiveSubscriber({...activeSubscriber, status: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: `1px solid ${T.inputBorder}`, backgroundColor: T.inputBg, color: T.textMain, outline: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.3s' }}
                      >
                         <option value="Active">Active</option>
                         <option value="Expiring Soon">Expiring Soon</option>
                         <option value="Inactive">Inactive</option>
                      </select>
                   </div>
                   <div style={{ padding: '20px', backgroundColor: T.actionBg, borderRadius: '20px', border: `1px solid ${T.borderSub}` }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: T.textSub, marginBottom: '4px' }}>RENEWAL SCHEDULE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: T.textMain }}>{activeSubscriber?.renewal || 'Not Scheduled'}</div>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '8px' }}>
                      <button type="button" onClick={() => setShowManageModal(false)} style={{ padding: '14px', borderRadius: '14px', border: `1px solid ${T.borderSub}`, backgroundColor: T.actionBg, color: T.textSub, fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}>Cancel</button>
                      <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: `linear-gradient(135deg, ${T.primary}, #818cf8)`, color: 'white', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem', boxShadow: `0 8px 24px ${T.primaryGlow}` }}>Save</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Quick Actions Overlay Sheet */}
      <AnimatePresence>
        {showActionsMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 900, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowActionsMenu(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: T.overlayBg, backdropFilter: 'blur(8px)' }}
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'relative', width: '100%', maxWidth: '500px', 
                backgroundColor: T.bgCard, borderTopLeftRadius: '32px', borderTopRightRadius: '32px', 
                padding: '36px', boxShadow: `0 -20px 40px rgba(0,0,0,${isDark?0.8:0.15})`, zIndex: 901,
                border: `1px solid ${T.border}`
              }}
            >
              <div style={{ width: '40px', height: '5px', backgroundColor: T.borderSub, borderRadius: '10px', margin: '0 auto 24px' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
                <StudentAvatar name={showActionsMenu.name} size={56} borderRadius="18px" border={`1px solid ${showActionsMenu.color}25`} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: T.textMain, margin: 0 }}>{showActionsMenu.name}</h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: T.textSub, margin: '4px 0 0' }}>ID: {showActionsMenu.idNo} &bull; {showActionsMenu.plan}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={() => {
                    const target = showActionsMenu;
                    setShowActionsMenu(null);
                    openManageModal(target);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: `1px solid ${T.borderSub}`, 
                    backgroundColor: T.actionBg, color: T.textMain, fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.actionBgHov}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = T.actionBg}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(99,102,241,0.2)', color: T.primary }}>
                     <Users size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>Modify Meal Plan</div>
                    <div style={{ fontSize: '0.75rem', color: T.textSub, fontWeight: 500 }}>Update active student pricing plan parameters</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    const nextStatus = showActionsMenu.status === 'Active' ? 'Expiring Soon' : showActionsMenu.status === 'Expiring Soon' ? 'Inactive' : 'Active';
                    const nextRenewal = nextStatus === 'Inactive' ? '---' : 'June 15, 2026';
                    setSubscriptions(subscriptions.map(s => s.id === showActionsMenu.id ? { ...s, status: nextStatus, renewal: nextRenewal } : s));
                    showToast(`Status updated to ${nextStatus} for ${showActionsMenu.name}`, 'success');
                    setShowActionsMenu(null);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: `1px solid ${T.borderSub}`, 
                    backgroundColor: T.actionBg, color: T.textMain, fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.actionBgHov}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = T.actionBg}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(245,158,11,0.2)', color: T.warning }}>
                     <Clock size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>Toggle Subscription Status</div>
                    <div style={{ fontSize: '0.75rem', color: T.textSub, fontWeight: 500 }}>Cycle subscriber state active/expiring/inactive</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    showToast(`NFC catering credentials provisioned successfully for ${showActionsMenu.name}!`, 'success');
                    setShowActionsMenu(null);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: `1px solid ${T.borderSub}`, 
                    backgroundColor: T.actionBg, color: T.textMain, fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = T.actionBgHov}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = T.actionBg}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.2)', color: T.success }}>
                     <ShieldCheck size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>Provision NFC Smart Card</div>
                    <div style={{ fontSize: '0.75rem', color: T.textSub, fontWeight: 500 }}>Simulate allocating smart NFC dining credentials</div>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setDeleteConfirmId(showActionsMenu.id);
                    setShowActionsMenu(null);
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', 
                    padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.2)', 
                    backgroundColor: 'rgba(239,68,68,0.08)', color: T.danger, fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(239,68,68,0.2)', color: T.danger }}>
                     <ShieldAlert size={18} />
                  </span>
                  <div>
                    <div style={{ fontWeight: 800 }}>Revoke Meal Plan</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(239,68,68,0.7)', fontWeight: 500 }}>Permanently de-register dining subscription</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setShowActionsMenu(null)}
                style={{ 
                  width: '100%', padding: '14px', borderRadius: '16px', border: `1px solid ${T.borderSub}`, 
                  backgroundColor: T.actionBg, color: T.textSub, fontWeight: 800, 
                  fontSize: '0.9rem', cursor: 'pointer', marginTop: '20px'
                }}
              >
                Close Actions Panel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Danger Warning Modal */}
      <AnimatePresence>
        {deleteConfirmId && (() => {
          const targetSub = subscriptions.find(s => s.id === deleteConfirmId);
          if (!targetSub) return null;
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1010, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
                style={{ position: 'absolute', inset: 0, backgroundColor: T.overlayBg, backdropFilter: 'blur(12px)' }}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                style={{ 
                  position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: T.bgCard, 
                  borderRadius: '32px', padding: '40px', boxShadow: `0 40px 100px rgba(0,0,0,${isDark?0.8:0.2})`,
                  textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)'
                }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(239,68,68,0.15)', color: T.danger, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <ShieldAlert size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain, marginBottom: '12px', margin: 0 }}>Confirm Revocation</h3>
                <p style={{ color: T.textSub, fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500, marginBottom: '32px', marginTop: '12px' }}>
                  Are you absolutely sure you want to revoke the dining subscription plan for <strong style={{ color: T.textMain, fontWeight: 800 }}>{targetSub.name}</strong> ({targetSub.idNo})? The student will no longer be permitted to dine.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <button 
                    onClick={() => setDeleteConfirmId(null)}
                    style={{ 
                      padding: '16px', borderRadius: '16px', border: `1px solid ${T.borderSub}`, 
                      backgroundColor: T.actionBg, color: T.textSub, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' 
                    }}
                  >
                    Keep Plan
                  </button>
                  <button 
                    onClick={() => {
                      const updated = subscriptions.filter(s => s.id !== deleteConfirmId);
                      setSubscriptions(updated);
                      showToast(`Dining subscription plan revoked successfully for ${targetSub.name}.`, 'success');
                      setDeleteConfirmId(null);
                    }}
                    style={{ 
                      padding: '16px', borderRadius: '16px', border: 'none', 
                      backgroundColor: T.danger, color: 'white', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                      boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    Revoke Plan
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
              backgroundColor: T.bgCard, color: T.textMain, borderRadius: '20px', 
              boxShadow: `0 20px 40px rgba(0,0,0,${isDark?0.6:0.15}), 0 0 40px ${T.primaryGlow}`, maxWidth: '400px', border: `1px solid ${T.border}`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${T.success}20`, color: T.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={18} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4' }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessSubscriptions;
