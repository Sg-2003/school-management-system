import React, { useState, useEffect, useRef } from 'react'; // Verified Topbar V2
import { 
  Menu, Search, Bell, Moon, Sun, LogOut, User, Settings, 
  ChevronDown, Shield, LogIn, Globe, Check, Command,
  Mail, ShieldCheck, UserCircle, CreditCard, X, BellOff,
  AlertTriangle, FileText, Lock, Sparkles, Users, GraduationCap, 
  Wallet, MonitorPlay, Calendar, Folder, TrendingDown, ChevronRight,
  Building, Bed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import eleanorAvatar from '../assets/eleanor_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import studentAvatar from '../assets/student_avatar.png';

const Topbar = ({ toggleSidebar }) => {
  const customProfilePic = localStorage.getItem('userProfilePic');
  const getTeacherProfilePic = () => {
    try {
      const stored = localStorage.getItem('teachers');
      if (stored) {
        const list = JSON.parse(stored);
        const record = list.find(t => t.id === 'TCH-001' || t.teacherId === 'TCH-001');
        if (record && record.avatar) return record.avatar;
      }
    } catch (e) {}
    return janeAvatar;
  };

  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsMuted, setNotificationsMuted] = useState(localStorage.getItem('notificationsMuted') === 'true');
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('language') || 'English');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Exam Results Published', desc: 'Class 10th final exam results are now live.', time: '2 mins ago', type: 'academic', icon: <FileText size={16} />, color: '#4880FF', unread: true },
    { id: 2, title: 'Security Alert', desc: 'New login detected from Chrome on Windows.', time: '45 mins ago', type: 'security', icon: <Lock size={16} />, color: '#EF4444', unread: true },
    { id: 3, title: 'Fee Payment Success', desc: 'Receipt #FE-990 has been generated.', time: '3 hours ago', type: 'finance', icon: <CreditCard size={16} />, color: '#10B981', unread: false },
    { id: 4, title: 'System Update', desc: 'V3.2.0 features are now available.', time: 'Yesterday', type: 'system', icon: <Shield size={16} />, color: '#8B5CF6', unread: false }
  ]);

  useEffect(() => {
    const syncState = () => {
      setNotificationsMuted(localStorage.getItem('notificationsMuted') === 'true');
      const storedTheme = localStorage.getItem('theme');
      setDarkMode(storedTheme === 'dark');
    };
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, []);

  const handleToggleTheme = () => {
    const newTheme = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  const handleToggleMute = () => {
    const newState = !notificationsMuted;
    setNotificationsMuted(newState);
    localStorage.setItem('notificationsMuted', newState.toString());
    window.dispatchEvent(new Event('storage'));
  };

  const handleLanguageChange = (langName) => {
    setSelectedLang(langName);
    localStorage.setItem('language', langName);
    setIsLangOpen(false);
    window.dispatchEvent(new Event('storage'));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const availablePages = [
    { name: 'Student Management', path: '/dashboard/students', icon: <Users size={16} />, category: 'Academic' },
    { name: 'Teacher Faculty', path: '/dashboard/teachers', icon: <GraduationCap size={16} />, category: 'Academic' },
    { name: 'Fees & Finance', path: '/dashboard/fees', icon: <CreditCard size={16} />, category: 'Finance' },
    { name: 'Employee Registry', path: '/dashboard/employees', icon: <User size={16} />, category: 'HRM' },
    { name: 'Payroll Ledger', path: '/dashboard/payroll', icon: <Wallet size={16} />, category: 'Finance' },
    { name: 'LMS Learning Center', path: '/dashboard/learning', icon: <MonitorPlay size={16} />, category: 'Education' },
    { name: 'Exam Schedule', path: '/dashboard/exam-schedule', icon: <Calendar size={16} />, category: 'Academic' },
    { name: 'Staff Documents', path: '/dashboard/staff-documents', icon: <Folder size={16} />, category: 'HRM' },
    { name: 'School Expenses', path: '/dashboard/expenses', icon: <TrendingDown size={16} />, category: 'Finance' },
    { name: 'Hostel Management', path: '/dashboard/hostel', icon: <Building size={16} />, category: 'Residency' },
    { name: 'Room Units', path: '/dashboard/hostel-rooms', icon: <Bed size={16} />, category: 'Residency' },
    { name: 'System Settings', path: '/dashboard/settings', icon: <Settings size={16} />, category: 'System' }
  ];

  const searchResults = searchQuery 
    ? availablePages.filter(page => page.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  
  const profileRef = useRef(null);
  const langRef = useRef(null);
  const notifyRef = useRef(null);


  const languages = [
    { name: 'English', flag: '🇺🇸', code: 'EN' },
    { name: 'Japan', flag: '🇯🇵', code: 'JP' },
    { name: 'France', flag: '🇫🇷', code: 'FR' },
    { name: 'Germany', flag: '🇩🇪', code: 'DE' },
    { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
    { name: 'Bangladesh', flag: '🇧🇩', code: 'BD' },
    { name: 'India', flag: '🇮🇳', code: 'IN' },
    { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login', { state: { showLogoutToast: true } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (notifyRef.current && !notifyRef.current.contains(event.target)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const userRole = localStorage.getItem('userRole') || 'admin';
  const userName = localStorage.getItem('userName') || 'Institutional User';
  const userId = localStorage.getItem('userId') || 'ID-2026-X';
  const currentFlag = languages.find(l => l.name === selectedLang)?.flag || '🇺🇸';
  const unreadCount = notifications.filter(n => n.unread).length;

  const isSuperAdmin = userRole.toLowerCase().includes('admin');

  const getRoleTheme = () => {
    if (isSuperAdmin) return {
      bg: 'linear-gradient(135deg, #4880FF 0%, #8B5CF6 100%)',
      text: '#4880FF',
      label: 'Super Admin',
      glow: 'rgba(72, 128, 255, 0.4)'
    };
    if (userRole === 'teacher') return {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      text: '#f59e0b',
      label: 'Faculty Member',
      glow: 'rgba(245, 158, 11, 0.4)'
    };
    if (userRole === 'parent') return {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      text: '#10b981',
      label: 'Parent/Guardian',
      glow: 'rgba(16, 185, 129, 0.4)'
    };
    return {
      bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      text: '#3b82f6',
      label: 'Student',
      glow: 'rgba(59, 130, 246, 0.4)'
    };
  };

  const theme = getRoleTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={22} />
        </motion.button>
        
        <motion.div 
          className={`search-bar ${isSearchFocused ? 'focused' : ''}`}
          animate={{ width: isSearchFocused ? 360 : 300 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'relative' }}
        >
          <Search size={18} className={isSearchFocused ? 'text-primary' : 'text-muted'} />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="search-input" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
          {!isSearchFocused && !searchQuery && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', backgroundColor: 'var(--bg-body)', borderRadius: '6px', fontSize: '0.65rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: 800 }}>
               <Command size={10} /> K
            </div>
          )}

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ 
                  position: 'absolute', top: '105%', left: 0, right: 0, 
                  backgroundColor: 'var(--bg-card)', borderRadius: '16px', 
                  boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)',
                  padding: '8px', zIndex: 1200, maxHeight: '300px', overflowY: 'auto'
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        navigate(result.path);
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="dropdown-item"
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                        borderRadius: '10px', cursor: 'pointer', transition: '0.2s'
                      }}
                    >
                      <div style={{ padding: '8px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', color: 'var(--primary)' }}>{result.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{result.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{result.category}</div>
                      </div>
                      <ChevronRight size={14} className="text-muted" />
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>
                     No results found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      <div className="topbar-right">
        <motion.button whileHover={{ y: -2 }} className="icon-btn" onClick={handleToggleTheme}>
          {darkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
        </motion.button>

        {/* Language Selector */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <motion.button whileHover={{ y: -2 }} className="icon-btn" onClick={() => setIsLangOpen(!isLangOpen)} style={{ fontSize: '1.2rem', backgroundColor: isLangOpen ? 'var(--primary-light)' : 'var(--bg-card)' }}>
            {currentFlag}
          </motion.button>
          
          <AnimatePresence>
            {isLangOpen && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} style={{ position: 'absolute', top: '100%', right: 0, width: '280px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', padding: '16px', marginTop: '12px', zIndex: 1100, backdropFilter: 'blur(10px)' }}>
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px' }}>
                   <h3 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>Choose Your Language</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                  {languages.map((lang) => (
                    <motion.div key={lang.name} whileHover={{ x: 4 }} onClick={() => handleLanguageChange(lang.name)} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s', backgroundColor: selectedLang === lang.name ? 'var(--primary-light)' : 'transparent' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{lang.flag}</div>
                         <span style={{ fontWeight: 700, fontSize: '0.9rem', color: selectedLang === lang.name ? 'var(--primary)' : 'var(--text-main)' }}>{lang.name}</span>
                      </div>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${selectedLang === lang.name ? 'var(--primary)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}>
                        {selectedLang === lang.name && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div ref={notifyRef} style={{ position: 'relative' }}>
          <motion.button whileHover={{ y: -2 }} className="icon-btn" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} style={{ color: notificationsMuted ? 'var(--text-muted)' : 'inherit' }}>
            {notificationsMuted ? <BellOff size={20} /> : <Bell size={20} />}
            {unreadCount > 0 && !notificationsMuted && <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="badge">{unreadCount}</motion.span>}
          </motion.button>
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} style={{ position: 'absolute', top: '100%', right: 0, width: '360px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', marginTop: '12px', zIndex: 1100, overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                         Notifications {notificationsMuted && <BellOff size={14} className="text-muted" />}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{notificationsMuted ? 'Alerts are currently muted' : `You have ${unreadCount} unread messages`}</div>
                   </div>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={handleToggleMute}
                        style={{ 
                           background: notificationsMuted ? 'var(--danger-light)' : 'var(--bg-body)',
                           border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '10px',
                           fontSize: '0.7rem', fontWeight: 900, color: notificationsMuted ? 'var(--danger)' : 'var(--text-main)',
                           cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                      >
                        {notificationsMuted ? 'UNMUTE' : 'MUTE'}
                      </motion.button>
                      <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>Mark all</button>
                   </div>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <motion.div 
                      key={n.id} 
                      whileHover={{ backgroundColor: 'var(--bg-body)' }} 
                      onClick={() => {
                        // Mark as read
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                        setIsNotificationsOpen(false);
                        
                        // Navigate based on type/target
                        if (n.type === 'academic') {
                          navigate('/dashboard/exam-result');
                        } else if (n.type === 'security') {
                          navigate('/dashboard/security-logs');
                        } else if (n.type === 'finance') {
                          navigate('/dashboard/fees');
                        } else if (n.type === 'system') {
                          navigate('/dashboard/settings');
                        }
                      }}
                      style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px', position: 'relative', cursor: 'pointer' }}
                    >
                      {n.unread && <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></div>}
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${n.color}15`, color: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n.icon}</div>
                      <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}><span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{n.title}</span><span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{n.time}</span></div><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{n.desc}</p></div>
                    </motion.div>
                  ))}
                </div>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-body)', textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate('/dashboard/notices');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Elite Profile Section */}
        <div 
          ref={profileRef}
          className="user-profile"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{ 
            position: 'relative', cursor: 'pointer', padding: '4px 6px 4px 14px', borderRadius: '18px', 
            transition: '0.3s', backgroundColor: isProfileOpen ? 'var(--primary-light)' : 'var(--bg-body)', 
            border: `1px solid ${isProfileOpen ? theme.text : 'var(--border-color)'}`, 
            display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: isProfileOpen ? `0 0 15px ${theme.glow}` : 'none'
          }}
        >
          <div className="user-info" style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
              {userName}
              {isSuperAdmin && <ShieldCheck size={14} color="#4880FF" style={{ filter: 'drop-shadow(0 0 2px rgba(72,128,255,0.4))' }} />}
            </div>
            <div style={{ 
              fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px',
              color: 'white', background: theme.bg, padding: '2px 8px', borderRadius: '6px', marginTop: '4px',
              display: 'inline-block'
            }}>
              {theme.label}
            </div>
          </div>
          
          <div className="avatar-wrapper" style={{ position: 'relative' }}>
             <div className="avatar" style={{ 
               background: theme.bg, color: 'white', fontWeight: 950, width: '40px', height: '40px', 
               borderRadius: '12px', boxShadow: `0 6px 16px ${theme.glow}`, position: 'relative', zIndex: 2,
               display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
             }}>
                {customProfilePic ? (
                  <img 
                    src={customProfilePic} 
                    alt={userName} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundType=gradientLinear`;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : isSuperAdmin ? (
                  <img 
                    src={eleanorAvatar} 
                    alt={userName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                   <img 
                     src={userRole === 'teacher' ? getTeacherProfilePic() : (userRole === 'parent' ? robertAvatar : (userRole === 'student' ? studentAvatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`))} 
                     alt={userName} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   />
                )}
             </div>
             {isSuperAdmin && (
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                 style={{ 
                   position: 'absolute', inset: '-4px', borderRadius: '16px', 
                   border: '2px dashed #4880FF', opacity: 0.4, zIndex: 1
                 }}
               />
             )}
          </div>
          
          <motion.div animate={{ rotate: isProfileOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><ChevronDown size={14} className="text-muted" /></motion.div>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, width: '300px', backgroundColor: 'var(--bg-card)', borderRadius: '28px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', padding: '10px', marginTop: '12px', zIndex: 1100, overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
                <div style={{ padding: '24px 20px', background: theme.bg, borderRadius: '24px', marginBottom: '10px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                   <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}><Sparkles size={100} /></div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 2 }}>
                      <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '1.6rem', border: '1px solid rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                        {customProfilePic ? (
                          <img 
                            src={customProfilePic} 
                            alt={userName} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundType=gradientLinear`;
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : isSuperAdmin ? (
                          <img 
                            src={eleanorAvatar} 
                            alt={userName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <img 
                            src={userRole === 'teacher' ? getTeacherProfilePic() : (userRole === 'parent' ? robertAvatar : (userRole === 'student' ? studentAvatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`))} 
                            alt={userName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                         <div style={{ fontSize: '1.1rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '6px' }}>{userName} <Check size={14} color="#10B981" style={{ backgroundColor: 'white', borderRadius: '50%', padding: '2px' }} /></div>
                         <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 700, letterSpacing: '0.5px' }}>{theme.label.toUpperCase()} • {userId}</div>
                      </div>
                   </div>
                   <button 
                     onClick={() => { 
                       const target = isSuperAdmin ? '/dashboard/admin-profile' : 
                                    (userRole === 'teacher' ? '/dashboard/teacher-details/TCH-001' : 
                                    (userRole === 'parent' ? '/dashboard/guardian-details/GDN-2026-001' : '/dashboard/student-details/1'));
                       navigate(target); 
                       setIsProfileOpen(false); 
                     }} 
                     style={{ width: '100%', padding: '12px', borderRadius: '14px', backgroundColor: 'white', color: theme.text, border: 'none', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                   >
                     Elite Profile Management
                   </button>
                </div>
                <div style={{ padding: '6px' }}>
                  <div onClick={() => { navigate('/dashboard/institutional-security'); setIsProfileOpen(false); }} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', cursor: 'pointer' }}><ShieldCheck size={18} color={theme.text} /> Institutional Security</div>
                  <div onClick={() => { navigate('/dashboard/settings'); setIsProfileOpen(false); }} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}><Settings size={18} color="#f59e0b" /> Global System Settings</div>
                </div>
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '10px', paddingTop: '10px', padding: '6px' }}><div onClick={handleLogout} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 900, color: 'var(--danger)' }}><LogOut size={18} /> Terminate Session</div></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
