import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, Utensils, Users, Clock, Calendar,
  ChevronRight, ArrowUpRight, ShieldCheck,
  Pizza, Soup, Apple, MoreHorizontal, Info,
  MoreVertical, ShieldAlert, CheckCircle, ArrowRight, X,
  Flame, TrendingUp, Zap, Star, Sun, Moon
} from 'lucide-react';

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
const StudentAvatar = ({ name, size = 40, border = '1px solid rgba(99,102,241,0.25)', borderRadius = '13px' }) => {
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
        fontSize: size > 45 ? '1.25rem' : '0.95rem',
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

const MessOverview = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.dispatchEvent(new Event('storage'));
  };

  // ── Theme-aware token builder ──────────────────────────────────────────────
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
    cardBg:     (color) => isDark ? `linear-gradient(135deg, var(--bg-card) 60%, ${color}08)` : `linear-gradient(135deg, #ffffff 60%, ${color}05)`,
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
    shadow:     isDark ? '0 4px 24px rgba(0,0,0,0.5)':'0 4px 20px rgba(0,0,0,0.08)',
    activeShadow:(color) => isDark ? `0 0 40px ${color}18, 0 4px 24px rgba(0,0,0,0.4)` : `0 4px 20px ${color}18`,
  };

  // ── Data ──────────────────────────────────────────────────────────────────
  const defaultMenu = [
    { meal:'Breakfast',    time:'07:30 AM – 09:30 AM', items:'Oatmeal, Boiled Eggs, Fruit Salad, Tea/Coffee', calories:'450 kcal', status:'Completed', color:'#06b6d4' },
    { meal:'Lunch',        time:'12:30 PM – 02:30 PM', items:'Grilled Chicken, Brown Rice, Mixed Veggies, Lentil Soup', calories:'750 kcal', status:'Active',    color:'#6366f1' },
    { meal:'Evening Snack',time:'04:30 PM – 05:30 PM', items:'Veggie Sandwiches, Fresh Juice', calories:'250 kcal', status:'Upcoming', color:'#f59e0b' },
    { meal:'Dinner',       time:'07:30 PM – 09:30 PM', items:'Paneer Butter Masala, Roti, Dal Tadka, Salad', calories:'650 kcal', status:'Upcoming', color:'#10b981' }
  ];
  const defaultDiners = [
    { id:1, name:'Aanya Sharma', idNo:'STU-2026-001', meal:'Lunch', time:'12:45 PM', status:'Verified', avatar:'https://api.dicebear.com/7.x/initials/svg?seed=Aanya%20Sharma' },
    { id:2, name:'Rohan Malhotra',    idNo:'STU-2026-045', meal:'Lunch', time:'12:50 PM', status:'Verified', avatar:'https://api.dicebear.com/7.x/initials/svg?seed=Rohan%20Malhotra' },
    { id:3, name:'Karan Mehta', idNo:'STU-2026-122', meal:'Lunch', time:'12:55 PM', status:'Verified', avatar:'https://api.dicebear.com/7.x/initials/svg?seed=Karan%20Mehta' },
    { id:4, name:'Divya Joshi',  idNo:'STU-2026-089', meal:'Lunch', time:'01:05 PM', status:'Verified', avatar:'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi' }
  ];

  const [todayMenu,   setTodayMenu]   = useState(() => { const s = localStorage.getItem('mess_today_menu');    return s ? JSON.parse(s) : defaultMenu; });
  const [recentDiners,setRecentDiners]= useState(() => { const s = localStorage.getItem('mess_recent_diners_v2'); return s ? JSON.parse(s) : defaultDiners; });
  const [stats,       setStats]       = useState(() => {
    const s = localStorage.getItem('mess_stats');
    if (s) return JSON.parse(s);
    return [
      { label:'Total Diners',       value:'850',   icon:'Users',       color:'#6366f1', trend:'+12%' },
      { label:'Meals Served Today', value:'1,240', icon:'Utensils',    color:'#10b981', trend:'+5%'  },
      { label:'Pending Feedback',   value:'14',    icon:'Info',        color:'#f59e0b', trend:'-2%'  },
      { label:'Safety Rating',      value:'9.8',   icon:'ShieldCheck', color:'#ec4899', trend:'Stable' }
    ];
  });

  const [showUpdateModal,   setShowUpdateModal]   = useState(false);
  const [editingMeal,       setEditingMeal]       = useState(null);
  const [newMenuData,       setNewMenuData]       = useState({ items:'', calories:'' });
  const [activeMenuMeal,    setActiveMenuMeal]    = useState(null);
  const [activeMenuDiner,   setActiveMenuDiner]   = useState(null);
  const [deleteConfirmMeal, setDeleteConfirmMeal] = useState(null);
  const [deleteConfirmDiner,setDeleteConfirmDiner]= useState(null);
  const [toast,             setToast]             = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); };

  React.useEffect(() => { localStorage.setItem('mess_today_menu',    JSON.stringify(todayMenu));     }, [todayMenu]);
  React.useEffect(() => { localStorage.setItem('mess_recent_diners', JSON.stringify(recentDiners)); }, [recentDiners]);
  React.useEffect(() => { localStorage.setItem('mess_stats',         JSON.stringify(stats));         }, [stats]);

  const getIcon = (name) => ({ Users:<Users size={22}/>, Utensils:<Utensils size={22}/>, Info:<Info size={22}/>, ShieldCheck:<ShieldCheck size={22}/> }[name] || <Info size={22}/>);
  const getMealIcon = (meal, size=28) => meal==='Breakfast' ? <Coffee size={size}/> : meal==='Lunch' ? <Pizza size={size}/> : meal==='Evening Snack' ? <Apple size={size}/> : <Soup size={size}/>;

  const handleUpdateMenu = (e) => {
    e.preventDefault();
    setTodayMenu(todayMenu.map(m => m.meal===editingMeal.meal ? {...m, items:newMenuData.items, calories:newMenuData.calories} : m));
    setShowUpdateModal(false);
    const n = editingMeal.meal; setEditingMeal(null);
    showToast(`Nutritional plan updated for ${n}!`);
  };

  const statusColor = (s) =>
    s==='Active'    ? { bg:`#6366f118`, text:'#6366f1', border:'#6366f125' } :
    s==='Completed' ? { bg:`#10b98118`, text:'#10b981', border:'#10b98125' } :
                      { bg: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', text:T.textSub, border:T.borderSub };

  // ── Shared style helpers ───────────────────────────────────────────────────
  const glassCard = (extra={}) => ({
    backgroundColor: T.bgCard,
    border: `1px solid ${T.border}`,
    borderRadius: '28px',
    transition: 'background-color 0.4s, border-color 0.4s',
    ...extra,
  });

  const inputStyle = {
    width:'100%', padding:'14px 18px', borderRadius:'14px',
    border:`1px solid ${T.inputBorder}`, backgroundColor:T.inputBg,
    color:T.textMain, fontSize:'0.95rem', fontWeight:600, outline:'none',
    boxSizing:'border-box', fontFamily:'Inter, system-ui, sans-serif',
    transition:'all 0.3s',
  };
  const labelStyle = {
    display:'block', fontSize:'0.75rem', fontWeight:800, color:T.textSub,
    marginBottom:'10px', textTransform:'uppercase', letterSpacing:'0.5px',
  };
  const drawerSheet = {
    position:'relative', width:'100%', maxWidth:'520px',
    backgroundColor:T.bgCard, borderTopLeftRadius:'36px', borderTopRightRadius:'36px',
    padding:'40px', boxShadow:`0 -30px 80px rgba(0,0,0,${isDark?0.8:0.15})`,
    border:`1px solid ${T.border}`, zIndex:901, transition:'background-color 0.4s',
  };
  const actionBtn = {
    display:'flex', alignItems:'center', gap:'16px', width:'100%',
    padding:'16px 20px', borderRadius:'18px', border:`1px solid ${T.borderSub}`,
    backgroundColor:T.actionBg, color:T.textMain, fontWeight:700, fontSize:'0.95rem',
    cursor:'pointer', transition:'all 0.2s', textAlign:'left',
  };

  return (
    <div style={{ padding:'40px 44px', backgroundColor:T.bg, minHeight:'100vh', color:T.textMain, fontFamily:'Inter, system-ui, sans-serif', transition:'background-color 0.4s, color 0.4s' }}>

      {/* Header */}
      <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'44px', flexWrap:'wrap', gap:'20px' }}
      >
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'10px' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'16px', background:`linear-gradient(135deg, #6366f1, #818cf8)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${T.primaryGlow}` }}>
              <Utensils size={22} color="white" />
            </div>
            <h1 style={{ fontSize:'2.4rem', fontWeight:950, color:T.textMain, letterSpacing:'-1.5px', margin:0 }}>Dining Overview</h1>
          </div>
          <p style={{ color:T.textSub, fontSize:'1rem', fontWeight:500, margin:0 }}>Monitor nutritional standards and dining operations in real-time.</p>
        </div>
        <div style={{ display:'flex', gap:'14px' }}>
          <button onClick={() => navigate('/dashboard/mess-menu')}
            style={{ padding:'14px 24px', borderRadius:'16px', border:`1px solid ${T.border}`, backgroundColor:T.ghostBg, color:T.textMain, fontWeight:800, fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', transition:'all 0.2s', height:'48px' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.ghostBgHov; e.currentTarget.style.borderColor=T.primary; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.ghostBg;    e.currentTarget.style.borderColor=T.border; }}
          ><Calendar size={17}/> Full Schedule</button>
          <button onClick={() => { setEditingMeal(todayMenu[0]); setNewMenuData({items:todayMenu[0].items,calories:todayMenu[0].calories}); setShowUpdateModal(true); }}
            style={{ padding:'14px 28px', borderRadius:'16px', border:'none', background:'linear-gradient(135deg,#6366f1,#818cf8)', color:'white', fontWeight:800, fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', boxShadow:`0 8px 24px ${T.primaryGlow}`, transition:'all 0.2s', height:'48px' }}
            onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.12)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter='brightness(1)';    e.currentTarget.style.transform='translateY(0)'; }}
          ><Utensils size={17}/> Update Menu</button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'24px', marginBottom:'44px' }}>
        {stats.map((stat,i) => (
          <motion.div key={i} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            style={{ ...glassCard({padding:'28px',position:'relative',overflow:'hidden'}), background:T.cardBg(stat.color) }}
          >
            <div style={{ position:'absolute',top:'-30px',right:'-30px',width:'100px',height:'100px',borderRadius:'50%',backgroundColor:stat.color,opacity:0.07,filter:'blur(30px)',pointerEvents:'none' }} />
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px' }}>
              <div style={{ width:'48px',height:'48px',borderRadius:'14px',backgroundColor:`${stat.color}18`,color:stat.color,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${stat.color}25` }}>{getIcon(stat.icon)}</div>
              <span style={{ fontSize:'0.75rem',fontWeight:900,color:stat.trend.includes('+') ? T.success : stat.trend.includes('-') ? T.warning : T.textSub,display:'flex',alignItems:'center',gap:'3px' }}>
                <TrendingUp size={12}/> {stat.trend}
              </span>
            </div>
            <div style={{ fontSize:'2.2rem',fontWeight:950,color:T.textMain,letterSpacing:'-1px',marginBottom:'4px' }}>{stat.value}</div>
            <div style={{ color:T.textSub,fontWeight:700,fontSize:'0.85rem' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:'32px' }}>

        {/* Today's Nutritional Plan */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
            <h2 style={{ fontSize:'1.4rem', fontWeight:900, color:T.textMain, margin:0 }}>Today's Nutritional Plan</h2>
            <span onClick={() => navigate('/dashboard/mess-menu')}
              style={{ fontSize:'0.875rem',fontWeight:800,color:T.primary,cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',padding:'8px 14px',borderRadius:'12px',border:`1px solid ${T.border}`,backgroundColor:T.ghostBg,transition:'all 0.2s' }}
            >View Month <ChevronRight size={15}/></span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {todayMenu.map((item,i) => {
              const sc = statusColor(item.status);
              const isActive = item.status === 'Active';
              return (
                <motion.div key={i} initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
                  style={{ display:'flex',alignItems:'center',gap:'20px',padding:'22px 24px', ...glassCard(), borderLeft:`4px solid ${item.color}`, boxShadow:T.activeShadow(item.color), position:'relative', overflow:'hidden' }}
                >
                  {isActive && <div style={{ position:'absolute',inset:0,background:`radial-gradient(ellipse at left, ${item.color}${isDark?'08':'04'} 0%, transparent 60%)`,pointerEvents:'none' }} />}
                  <div style={{ width:'56px',height:'56px',borderRadius:'18px',backgroundColor:`${item.color}18`,color:item.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:`1px solid ${item.color}25` }}>
                    {getMealIcon(item.meal)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'5px' }}>
                      <span style={{ fontSize:'1.1rem',fontWeight:900,color:T.textMain }}>{item.meal}</span>
                      <span style={{ fontSize:'0.7rem',fontWeight:900,padding:'3px 10px',borderRadius:'8px',backgroundColor:sc.bg,color:sc.text,border:`1px solid ${sc.border}` }}>{item.status}</span>
                    </div>
                    <div style={{ color:T.textSub,fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{item.items}</div>
                  </div>
                  <div style={{ display:'flex',alignItems:'center',gap:'14px',flexShrink:0 }}>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ display:'flex',alignItems:'center',gap:'5px',color:T.textMain,fontWeight:800,fontSize:'0.85rem',marginBottom:'3px' }}><Clock size={13} color={T.textSub}/> {item.time}</div>
                      <div style={{ display:'flex',alignItems:'center',gap:'4px',color:item.color,fontSize:'0.75rem',fontWeight:800 }}><Flame size={11}/> {item.calories}</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setActiveMenuMeal(item); }}
                      style={{ width:'36px',height:'36px',borderRadius:'10px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.actionBgHov; e.currentTarget.style.color=T.textMain; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.actionBg;    e.currentTarget.style.color=T.textSub; }}
                    ><MoreVertical size={16}/></button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>

          {/* Live Attendance */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <h2 style={{ fontSize:'1.3rem', fontWeight:900, color:T.textMain, margin:0 }}>Live Attendance</h2>
                <span style={{ width:'8px',height:'8px',borderRadius:'50%',backgroundColor:T.success,display:'inline-block',boxShadow:`0 0 8px ${T.success}` }} />
              </div>
              <button onClick={() => showToast('Initializing real-time attendance sync...')}
                style={{ width:'38px',height:'38px',borderRadius:'12px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor=T.actionBgHov}
                onMouseLeave={e => e.currentTarget.style.backgroundColor=T.actionBg}
              ><MoreHorizontal size={18} color={T.textSub}/></button>
            </div>
            <div style={glassCard({padding:'24px'})}>
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {recentDiners.map((diner,i) => (
                  <motion.div key={diner.id||i} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
                    style={{ display:'flex',alignItems:'center',gap:'14px',padding:'14px 12px',borderRadius:'16px',borderBottom:i<recentDiners.length-1?`1px solid ${T.borderSub}`:'none',transition:'background 0.2s',cursor:'default' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor=T.hoverBg}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}
                  >
                    <StudentAvatar name={diner.name} size={40} borderRadius="13px" border="1px solid rgba(99,102,241,0.25)" />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.9rem',fontWeight:800,color:T.textMain,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{diner.name}</div>
                      <div style={{ fontSize:'0.72rem',fontWeight:600,color:T.textMuted }}>{diner.idNo} · {diner.meal}</div>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:'10px',flexShrink:0 }}>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:'0.8rem',fontWeight:800,color:T.primary }}>{diner.time}</div>
                        <div style={{ fontSize:'0.65rem',fontWeight:900,color:diner.status==='Verified'?T.success:T.warning }}>{diner.status}</div>
                      </div>
                      <button onClick={() => setActiveMenuDiner(diner)}
                        style={{ width:'30px',height:'30px',borderRadius:'8px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor=T.actionBgHov; e.currentTarget.style.color=T.textMain; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.actionBg;    e.currentTarget.style.color=T.textSub; }}
                      ><MoreVertical size={13}/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => navigate('/dashboard/mess-attendance')}
                style={{ width:'100%',marginTop:'20px',padding:'13px',borderRadius:'14px',border:`1px solid ${T.border}`,backgroundColor:T.ghostBg,color:T.primary,fontWeight:800,fontSize:'0.85rem',cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor=T.ghostBgHov}
                onMouseLeave={e => e.currentTarget.style.backgroundColor=T.ghostBg}
              >View All Attendance <ArrowRight size={15}/></button>
            </div>
          </div>

          {/* Nutritional Insight Card */}
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.5}}
            style={{ padding:'28px',borderRadius:'28px',position:'relative',overflow:'hidden', background: isDark ? 'linear-gradient(135deg,#1e1b4b 0%,#0f172a 40%,#064e3b 100%)' : 'linear-gradient(135deg,#eef2ff 0%,#f0fdf4 100%)', border:`1px solid ${isDark?'rgba(99,102,241,0.3)':'rgba(99,102,241,0.15)'}` }}
          >
            <div style={{ position:'absolute',top:'-40px',right:'-40px',width:'140px',height:'140px',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.3) 0%,transparent 70%)',pointerEvents:'none' }} />
            <div style={{ position:'absolute',bottom:'-30px',left:'-30px',width:'100px',height:'100px',borderRadius:'50%',background:'radial-gradient(circle,rgba(16,185,129,0.25) 0%,transparent 70%)',pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}>
                <div style={{ width:'32px',height:'32px',borderRadius:'10px',backgroundColor:isDark?'rgba(99,102,241,0.3)':'rgba(99,102,241,0.12)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Zap size={16} color="#818cf8"/>
                </div>
                <h3 style={{ fontSize:'1rem',fontWeight:900,color:isDark?T.textMain:'#1e1b4b',margin:0 }}>Nutritional Insight</h3>
              </div>
              <p style={{ fontSize:'0.875rem',fontWeight:600,color:isDark?'rgba(241,245,249,0.75)':'#4338ca',lineHeight:1.7,margin:0 }}>
                Today's lunch provides <strong style={{ color:isDark?'#a5b4fc':'#6366f1' }}>45%</strong> of the recommended daily protein intake for active students. Compliance rated <strong style={{ color:T.success }}>Excellent</strong>.
              </p>
            </div>
          </motion.div>

          {/* Quick Nav Strip */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            {[
              { label:'Mess Schedule', icon:<Calendar size={16}/>, path:'/dashboard/mess-menu',          color:'#06b6d4' },
              { label:'Subscriptions', icon:<Star size={16}/>,     path:'/dashboard/mess-subscriptions', color:'#ec4899' },
            ].map((item,i) => (
              <button key={i} onClick={() => navigate(item.path)}
                style={{ padding:'16px',borderRadius:'18px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textMain,fontWeight:800,fontSize:'0.85rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor=`${item.color}10`; e.currentTarget.style.borderColor=`${item.color}40`; e.currentTarget.style.color=item.color; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor=T.actionBg; e.currentTarget.style.borderColor=T.borderSub; e.currentTarget.style.color=T.textMain; }}
              >{item.icon} {item.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Update Menu Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUpdateModal && editingMeal && (
          <div style={{ position:'fixed',inset:0,zIndex:1200,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px' }}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowUpdateModal(false)}
              style={{ position:'absolute',inset:0,backgroundColor:T.overlayBg,backdropFilter:'blur(16px)' }} />
            <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0}}
              style={{ position:'relative',width:'100%',maxWidth:'480px',backgroundColor:T.bgCard,border:`1px solid ${T.border}`,borderRadius:'32px',padding:'48px',boxShadow:`0 40px 100px rgba(0,0,0,${isDark?0.7:0.2}),0 0 80px ${T.primaryGlow}` }}
            >
              <div style={{ display:'flex',alignItems:'center',gap:'16px',marginBottom:'32px' }}>
                <div style={{ width:'52px',height:'52px',borderRadius:'16px',backgroundColor:`${editingMeal.color}20`,color:editingMeal.color,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${editingMeal.color}30` }}>
                  {getMealIcon(editingMeal.meal)}
                </div>
                <div>
                  <h2 style={{ fontSize:'1.4rem',fontWeight:950,color:T.textMain,margin:0 }}>Update {editingMeal.meal}</h2>
                  <p style={{ color:T.textSub,fontSize:'0.85rem',margin:'4px 0 0',fontWeight:600 }}>{editingMeal.time}</p>
                </div>
              </div>
              <form onSubmit={handleUpdateMenu} style={{ display:'flex',flexDirection:'column',gap:'20px' }}>
                <div><label style={labelStyle}>Menu Items</label>
                  <textarea value={newMenuData.items} onChange={e => setNewMenuData({...newMenuData,items:e.target.value})} rows={3} style={{...inputStyle,resize:'none'}} /></div>
                <div><label style={labelStyle}>Caloric Value</label>
                  <input value={newMenuData.calories} onChange={e => setNewMenuData({...newMenuData,calories:e.target.value})} placeholder="e.g. 750 kcal" style={inputStyle} /></div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',marginTop:'8px' }}>
                  <button type="button" onClick={() => setShowUpdateModal(false)} style={{ padding:'14px',borderRadius:'14px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,fontWeight:800,cursor:'pointer',fontSize:'0.95rem' }}>Cancel</button>
                  <button type="submit" style={{ padding:'14px',borderRadius:'14px',border:'none',background:'linear-gradient(135deg,#6366f1,#818cf8)',color:'white',fontWeight:900,cursor:'pointer',fontSize:'0.95rem',boxShadow:`0 8px 24px ${T.primaryGlow}` }}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Meal Quick Actions Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {activeMenuMeal && (
          <div style={{ position:'fixed',inset:0,zIndex:900,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setActiveMenuMeal(null)}
              style={{ position:'absolute',inset:0,backgroundColor:T.overlayBg,backdropFilter:'blur(14px)' }} />
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:26,stiffness:220}} style={drawerSheet}>
              <div style={{ width:'40px',height:'5px',backgroundColor:T.borderSub,borderRadius:'10px',margin:'0 auto 28px' }} />
              <div style={{ display:'flex',alignItems:'center',gap:'18px',marginBottom:'28px' }}>
                <div style={{ width:'52px',height:'52px',borderRadius:'16px',backgroundColor:`${activeMenuMeal.color}20`,color:activeMenuMeal.color,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${activeMenuMeal.color}30` }}>{getMealIcon(activeMenuMeal.meal)}</div>
                <div>
                  <h3 style={{ fontSize:'1.15rem',fontWeight:900,color:T.textMain,margin:0 }}>{activeMenuMeal.meal} Plan</h3>
                  <p style={{ fontSize:'0.8rem',fontWeight:600,color:T.textSub,margin:'4px 0 0' }}>{activeMenuMeal.time} · {activeMenuMeal.calories}</p>
                </div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
                {[
                  { label:'Update Menu Details', sub:'Modify session menu items and calorie count', icon:<Utensils size={17}/>, color:'#6366f1', action:() => { const t=activeMenuMeal; setActiveMenuMeal(null); setEditingMeal(t); setNewMenuData({items:t.items,calories:t.calories}); setShowUpdateModal(true); } },
                  { label:'Toggle Session Status', sub:'Cycle through Upcoming, Active, and Completed', icon:<Clock size={17}/>, color:T.warning, action:() => { const n=activeMenuMeal.status==='Upcoming'?'Active':activeMenuMeal.status==='Active'?'Completed':'Upcoming'; setTodayMenu(todayMenu.map(m=>m.meal===activeMenuMeal.meal?{...m,status:n}:m)); showToast(`${activeMenuMeal.meal} → ${n}`); setActiveMenuMeal(null); } },
                  { label:'Verify Session Nutrition', sub:'Simulate micro-nutrient safety and compliance audit', icon:<ShieldCheck size={17}/>, color:T.success, action:() => { showToast(`Audit complete for ${activeMenuMeal.meal}. 100% compliant!`); setActiveMenuMeal(null); } },
                ].map((a,i) => (
                  <button key={i} onClick={a.action} style={actionBtn}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor=T.actionBgHov}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor=T.actionBg}
                  >
                    <span style={{ width:'36px',height:'36px',borderRadius:'10px',backgroundColor:`${a.color}20`,color:a.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{a.icon}</span>
                    <div><div style={{ fontWeight:800 }}>{a.label}</div><div style={{ fontSize:'0.72rem',color:T.textSub,fontWeight:500,marginTop:'2px' }}>{a.sub}</div></div>
                  </button>
                ))}
                <button onClick={() => { setDeleteConfirmMeal(activeMenuMeal); setActiveMenuMeal(null); }}
                  style={{ ...actionBtn, backgroundColor:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', color:T.danger }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(239,68,68,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor='rgba(239,68,68,0.08)'}
                >
                  <span style={{ width:'36px',height:'36px',borderRadius:'10px',backgroundColor:'rgba(239,68,68,0.2)',color:T.danger,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><ShieldAlert size={17}/></span>
                  <div><div style={{ fontWeight:800 }}>Cancel Meal Session</div><div style={{ fontSize:'0.72rem',color:'rgba(239,68,68,0.7)',fontWeight:500,marginTop:'2px' }}>Permanently remove this session</div></div>
                </button>
              </div>
              <button onClick={() => setActiveMenuMeal(null)} style={{ width:'100%',padding:'13px',borderRadius:'14px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,fontWeight:800,fontSize:'0.9rem',cursor:'pointer',marginTop:'18px' }}>Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Diner Quick Actions Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {activeMenuDiner && (
          <div style={{ position:'fixed',inset:0,zIndex:900,display:'flex',alignItems:'flex-end',justifyContent:'center' }}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setActiveMenuDiner(null)}
              style={{ position:'absolute',inset:0,backgroundColor:T.overlayBg,backdropFilter:'blur(14px)' }} />
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:26,stiffness:220}} style={drawerSheet}>
              <div style={{ width:'40px',height:'5px',backgroundColor:T.borderSub,borderRadius:'10px',margin:'0 auto 28px' }} />
              <div style={{ display:'flex',alignItems:'center',gap:'18px',marginBottom:'28px' }}>
                <StudentAvatar name={activeMenuDiner.name} size={52} borderRadius="16px" border="1px solid rgba(99,102,241,0.25)" />
                <div>
                  <h3 style={{ fontSize:'1.15rem',fontWeight:900,color:T.textMain,margin:0 }}>{activeMenuDiner.name}</h3>
                  <p style={{ fontSize:'0.8rem',fontWeight:600,color:T.textSub,margin:'4px 0 0' }}>{activeMenuDiner.idNo} · {activeMenuDiner.meal}</p>
                </div>
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:'10px' }}>
                {[
                  { label: activeMenuDiner.status==='Verified'?'Set Unverified':'Set Verified', sub:'Toggle entry clearance check', icon:<CheckCircle size={17}/>, color:activeMenuDiner.status==='Verified'?T.danger:T.success, action:() => { const n=activeMenuDiner.status==='Verified'?'Unverified':'Verified'; setRecentDiners(recentDiners.map(d=>d.id===activeMenuDiner.id?{...d,status:n}:d)); setStats(stats.map(s=>s.label==='Meals Served Today'?{...s,value:(parseInt(s.value.replace(/,/g,''))+(n==='Verified'?1:-1)).toLocaleString()}:s)); showToast(`${activeMenuDiner.name} marked as ${n}.`); setActiveMenuDiner(null); } },
                  { label:'Simulate Badge Scan', sub:'Perform automated digital badge authentication', icon:<Users size={17}/>, color:'#6366f1', action:() => { showToast(`Badge scan simulated for ${activeMenuDiner.name}!`); setActiveMenuDiner(null); } },
                  { label:'Log Subscription Issue', sub:'Flag active plan/payment discrepancies', icon:<Clock size={17}/>, color:T.warning, action:() => { showToast(`Issue logged for ${activeMenuDiner.name}.`); setActiveMenuDiner(null); } },
                ].map((a,i) => (
                  <button key={i} onClick={a.action} style={actionBtn}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor=T.actionBgHov}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor=T.actionBg}
                  >
                    <span style={{ width:'36px',height:'36px',borderRadius:'10px',backgroundColor:`${a.color}20`,color:a.color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{a.icon}</span>
                    <div><div style={{ fontWeight:800 }}>{a.label}</div><div style={{ fontSize:'0.72rem',color:T.textSub,fontWeight:500,marginTop:'2px' }}>{a.sub}</div></div>
                  </button>
                ))}
                <button onClick={() => { setDeleteConfirmDiner(activeMenuDiner); setActiveMenuDiner(null); }}
                  style={{ ...actionBtn, backgroundColor:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', color:T.danger }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(239,68,68,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor='rgba(239,68,68,0.08)'}
                >
                  <span style={{ width:'36px',height:'36px',borderRadius:'10px',backgroundColor:'rgba(239,68,68,0.2)',color:T.danger,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><ShieldAlert size={17}/></span>
                  <div><div style={{ fontWeight:800 }}>Revoke Entry Record</div><div style={{ fontSize:'0.72rem',color:'rgba(239,68,68,0.7)',fontWeight:500,marginTop:'2px' }}>Permanently remove dining entry</div></div>
                </button>
              </div>
              <button onClick={() => setActiveMenuDiner(null)} style={{ width:'100%',padding:'13px',borderRadius:'14px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,fontWeight:800,fontSize:'0.9rem',cursor:'pointer',marginTop:'18px' }}>Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Confirm Cancel Meal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmMeal && (
          <div style={{ position:'fixed',inset:0,zIndex:1010,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px' }}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setDeleteConfirmMeal(null)} style={{ position:'absolute',inset:0,backgroundColor:T.overlayBg,backdropFilter:'blur(18px)' }} />
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              style={{ position:'relative',width:'100%',maxWidth:'420px',backgroundColor:T.bgCard,borderRadius:'32px',padding:'40px',boxShadow:`0 40px 100px rgba(0,0,0,0.8)`,textAlign:'center',border:'1px solid rgba(239,68,68,0.2)' }}
            >
              <div style={{ width:'64px',height:'64px',borderRadius:'20px',backgroundColor:'rgba(239,68,68,0.15)',color:T.danger,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',border:'1px solid rgba(239,68,68,0.3)' }}><ShieldAlert size={32}/></div>
              <h3 style={{ fontSize:'1.4rem',fontWeight:950,color:T.textMain,marginBottom:'12px' }}>Cancel Meal Session</h3>
              <p style={{ color:T.textSub,fontSize:'0.9rem',lineHeight:'1.7',fontWeight:500,marginBottom:'32px' }}>Cancel the <strong style={{ color:T.textMain }}>{deleteConfirmMeal.meal}</strong> session? This removes its nutrition plan for today.</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
                <button onClick={() => setDeleteConfirmMeal(null)} style={{ padding:'14px',borderRadius:'14px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,fontWeight:800,fontSize:'0.9rem',cursor:'pointer' }}>Keep Session</button>
                <button onClick={() => { setTodayMenu(todayMenu.filter(m=>m.meal!==deleteConfirmMeal.meal)); showToast(`${deleteConfirmMeal.meal} cancelled.`); setDeleteConfirmMeal(null); }}
                  style={{ padding:'14px',borderRadius:'14px',border:'none',backgroundColor:T.danger,color:'white',fontWeight:800,fontSize:'0.9rem',cursor:'pointer',boxShadow:'0 8px 24px rgba(239,68,68,0.3)' }}>Cancel Session</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Confirm Revoke Diner ────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteConfirmDiner && (
          <div style={{ position:'fixed',inset:0,zIndex:1010,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px' }}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setDeleteConfirmDiner(null)} style={{ position:'absolute',inset:0,backgroundColor:T.overlayBg,backdropFilter:'blur(18px)' }} />
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              style={{ position:'relative',width:'100%',maxWidth:'420px',backgroundColor:T.bgCard,borderRadius:'32px',padding:'40px',boxShadow:`0 40px 100px rgba(0,0,0,0.8)`,textAlign:'center',border:'1px solid rgba(239,68,68,0.2)' }}
            >
              <div style={{ width:'64px',height:'64px',borderRadius:'20px',backgroundColor:'rgba(239,68,68,0.15)',color:T.danger,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px',border:'1px solid rgba(239,68,68,0.3)' }}><ShieldAlert size={32}/></div>
              <h3 style={{ fontSize:'1.4rem',fontWeight:950,color:T.textMain,marginBottom:'12px' }}>Revoke Entry Record</h3>
              <p style={{ color:T.textSub,fontSize:'0.9rem',lineHeight:'1.7',fontWeight:500,marginBottom:'32px' }}>Permanently revoke dining entry for <strong style={{ color:T.textMain }}>{deleteConfirmDiner.name}</strong> ({deleteConfirmDiner.idNo})?</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px' }}>
                <button onClick={() => setDeleteConfirmDiner(null)} style={{ padding:'14px',borderRadius:'14px',border:`1px solid ${T.borderSub}`,backgroundColor:T.actionBg,color:T.textSub,fontWeight:800,fontSize:'0.9rem',cursor:'pointer' }}>Cancel</button>
                <button onClick={() => { setRecentDiners(recentDiners.filter(d=>d.id!==deleteConfirmDiner.id)); setStats(stats.map(s=>s.label==='Meals Served Today'?{...s,value:(parseInt(s.value.replace(/,/g,''))-1).toLocaleString()}:s)); showToast(`Record for ${deleteConfirmDiner.name} revoked.`); setDeleteConfirmDiner(null); }}
                  style={{ padding:'14px',borderRadius:'14px',border:'none',backgroundColor:T.danger,color:'white',fontWeight:800,fontSize:'0.9rem',cursor:'pointer',boxShadow:'0 8px 24px rgba(239,68,68,0.3)' }}>Revoke Entry</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:60,scale:0.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:0.95}}
            style={{ position:'fixed',bottom:'32px',right:'32px',zIndex:2000,display:'flex',alignItems:'center',gap:'12px',padding:'16px 24px',backgroundColor:T.bgCard,color:T.textMain,borderRadius:'20px',boxShadow:`0 20px 60px rgba(0,0,0,${isDark?0.6:0.15}),0 0 40px ${T.primaryGlow}`,maxWidth:'380px',border:`1px solid ${T.border}`,backdropFilter:'blur(20px)' }}
          >
            <div style={{ width:'30px',height:'30px',borderRadius:'9px',backgroundColor:`${T.success}20`,color:T.success,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}><CheckCircle size={17}/></div>
            <div style={{ fontSize:'0.875rem',fontWeight:700,lineHeight:'1.4' }}>{toast}</div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MessOverview;
