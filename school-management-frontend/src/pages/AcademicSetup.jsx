import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, GraduationCap, BookOpen, Layers, 
  Plus, Search, Edit2, Trash2, Calendar,
  ChevronRight, Save, X, CheckCircle,
  Building2, Users, Layout, ShieldCheck,
  Sparkles, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Hook: reads dark-mode from localStorage + syncs with Topbar toggle ──────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark'
  );
  useEffect(() => {
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

const AcademicSetup = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const [activeTab, setActiveTab] = useState('classes');
  
  // List States
  const [academicYears, setAcademicYears] = useState([
    { id: 1, year: '2025-2026', status: 'Active', start: 'Aug 2025', end: 'June 2026' },
    { id: 2, year: '2026-2027', status: 'Draft', start: 'Aug 2026', end: 'June 2027' }
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: 'Grade 10', sections: ['A', 'B', 'C'], students: 120, head: 'Mr. Amit Sharma' },
    { id: 2, name: 'Grade 11', sections: ['A', 'B'], students: 85, head: 'Ms. Priya Patel' },
    { id: 3, name: 'Grade 12', sections: ['A', 'B', 'C', 'D'], students: 150, head: 'Dr. Sanjay Gupta' }
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Advanced Mathematics', code: 'MTH-401', credits: 4, type: 'Core' },
    { id: 2, name: 'Physics & Lab', code: 'PHY-302', credits: 3, type: 'Core' },
    { id: 3, name: 'World History', code: 'HIS-201', credits: 2, type: 'Elective' }
  ]);

  const [campus, setCampus] = useState([
    { id: 1, block: 'North Wing', type: 'Academic Classrooms', capacity: 1200 },
    { id: 2, block: 'Science Center', type: 'Laboratories', capacity: 400 },
    { id: 3, block: 'Athletic Complex', type: 'Sports & Recreation', capacity: 2000 },
    { id: 4, block: 'Central Library', type: 'Study Hub', capacity: 800 }
  ]);

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Undo memory state
  const [deletedItem, setDeletedItem] = useState(null); // { item, type, index }

  // Modal states
  const [modalType, setModalType] = useState(null); // 'grade', 'year', 'subject', 'space'
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const handleDeployChanges = () => {
    showToast('Deploying academic infrastructure configurations to production servers...', 'info');
    setTimeout(() => {
      showToast('Academic infrastructure successfully deployed & active!', 'success');
    }, 2000);
  };

  const handleNewSetup = () => {
    showToast('Initializing advanced neural campus setup wizard...', 'info');
    setTimeout(() => {
      setModalType('grade');
      showToast('Select parameters to begin Grade configuration.', 'success');
    }, 1200);
  };

  const handleDelete = (id, type) => {
    if (type === 'grade') {
      const idx = classes.findIndex(c => c.id === id);
      const item = classes[idx];
      setDeletedItem({ item, type, index: idx });
      setClasses(classes.filter(c => c.id !== id));
      showToast(`Deleted ${item.name} Grade Level.`, 'success');
    } else if (type === 'year') {
      const idx = academicYears.findIndex(y => y.id === id);
      const item = academicYears[idx];
      setDeletedItem({ item, type, index: idx });
      setAcademicYears(academicYears.filter(y => y.id !== id));
      showToast(`Deleted Session ${item.year}.`, 'success');
    } else if (type === 'subject') {
      const idx = subjects.findIndex(s => s.id === id);
      const item = subjects[idx];
      setDeletedItem({ item, type, index: idx });
      setSubjects(subjects.filter(s => s.id !== id));
      showToast(`Deleted subject: ${item.name}.`, 'success');
    } else if (type === 'space') {
      const idx = campus.findIndex(c => c.id === id);
      const item = campus[idx];
      setDeletedItem({ item, type, index: idx });
      setCampus(campus.filter(c => c.id !== id));
      showToast(`Deallocated ${item.block}.`, 'success');
    }
  };

  const handleUndo = () => {
    if (!deletedItem) return;
    const { item, type, index } = deletedItem;
    if (type === 'grade') {
      const updated = [...classes];
      updated.splice(index, 0, item);
      setClasses(updated);
      showToast(`Restored ${item.name} successfully.`, 'success');
    } else if (type === 'year') {
      const updated = [...academicYears];
      updated.splice(index, 0, item);
      setAcademicYears(updated);
      showToast(`Restored Session ${item.year} successfully.`, 'success');
    } else if (type === 'subject') {
      const updated = [...subjects];
      updated.splice(index, 0, item);
      setSubjects(updated);
      showToast(`Restored subject: ${item.name} successfully.`, 'success');
    } else if (type === 'space') {
      const updated = [...campus];
      updated.splice(index, 0, item);
      setCampus(updated);
      showToast(`Restored space: ${item.block} successfully.`, 'success');
    }
    setDeletedItem(null);
  };

  const startEdit = (item, type) => {
    setEditingId(item.id);
    setModalType(type);
    if (type === 'grade') {
      setFormData({
        name: item.name,
        sections: item.sections.join(', '),
        students: item.students,
        head: item.head
      });
    } else if (type === 'year') {
      setFormData({
        year: item.year,
        start: item.start,
        end: item.end
      });
    } else if (type === 'subject') {
      setFormData({
        name: item.name,
        code: item.code,
        credits: item.credits,
        type: item.type
      });
    } else if (type === 'space') {
      setFormData({
        block: item.block,
        type: item.type,
        capacity: item.capacity
      });
    }
  };

  const T = {
    bg:         isDark ? 'var(--bg-body)' : '#f8fafc',
    bgCard:     'var(--bg-card)',
    bgRaised:   isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    border:     'var(--border-color)',
    textMain:   isDark ? '#f1f5f9' : '#0f172a',
    textMuted:  isDark ? '#94a3b8' : '#64748b',
    textDark:   isDark ? '#e2e8f0' : '#1e293b',
    inputBg:    isDark ? 'rgba(255,255,255,0.03)' : 'white',
    activeBtnBg:isDark ? '#4f46e5' : '#0f172a',
  };

  return (
    <div style={{ padding: '40px', backgroundColor: T.bg, minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: T.textMain, letterSpacing: '-1.5px', marginBottom: '8px' }}>Academic Infrastructure</h1>
          <p style={{ color: T.textMuted, fontSize: '1.1rem', fontWeight: 500 }}>Configure institutional grades, class structures, and academic cycles.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <button 
             onClick={handleDeployChanges}
             style={{ padding: '16px 28px', borderRadius: '18px', border: `1px solid ${T.border}`, backgroundColor: T.bgCard, color: T.textMain, fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}
           >
              <Save size={18} /> Deploy Changes
           </button>
           <button 
             onClick={handleNewSetup}
             style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: T.activeBtnBg, color: 'white', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Plus size={18} /> New Setup
           </button>
        </div>
      </div>

      {/* Setup Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', backgroundColor: T.bgCard, padding: '8px', borderRadius: '24px', width: 'fit-content', border: `1px solid ${T.border}` }}>
         {[
           { id: 'years', label: 'Academic Cycles', icon: <Calendar size={18} /> },
           { id: 'classes', label: 'Class Structure', icon: <Layers size={18} /> },
           { id: 'subjects', label: 'Curriculum Map', icon: <BookOpen size={18} /> },
           { id: 'campus', label: 'Campus Layout', icon: <Building2 size={18} /> }
         ].map(tab => (
           <button 
             key={tab.id} onClick={() => setActiveTab(tab.id)}
             style={{ 
               padding: '14px 28px', borderRadius: '18px', border: 'none',
               backgroundColor: activeTab === tab.id ? T.activeBtnBg : 'transparent',
               color: activeTab === tab.id ? 'white' : T.textMuted,
               fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
               display: 'flex', alignItems: 'center', gap: '12px', transition: '0.3s'
             }}
           >
              {tab.icon} {tab.label}
           </button>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>
         {/* Left Panel: Quick Stats & Hierarchy */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', padding: '32px', border: `1px solid ${T.border}` }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: T.textMain, marginBottom: '24px' }}>Institutional Audit</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'Total Student Capacity', val: '4,500', color: '#4f46e5', icon: <Users /> },
                    { label: 'Active Grade Levels', val: '12', color: '#10b981', icon: <GraduationCap /> },
                    { label: 'Resource Allocation', val: '92%', color: '#f59e0b', icon: <Layout /> }
                  ].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                       <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {stat.icon}
                       </div>
                       <div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 950, color: T.textMain }}>{stat.val}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted, textTransform: 'uppercase' }}>{stat.label}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ backgroundColor: isDark ? 'var(--bg-card)' : '#0f172a', border: isDark ? `1px solid ${T.border}` : 'none', borderRadius: '32px', padding: '32px', color: 'white' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>System Integrity</span>
               </div>
               <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: 0 }}>Academic structural changes are logged and synchronized across the institutional Neural Engine for real-time performance modeling.</p>
            </div>
         </div>

         {/* Right Panel: Content Area */}
         <div style={{ backgroundColor: T.bgCard, borderRadius: '32px', padding: '40px', border: `1px solid ${T.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
            <AnimatePresence mode="wait">
               {activeTab === 'classes' && (
                  <motion.div key="classes" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain }}>Grade Level Management</h2>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setFormData({});
                            setModalType('grade');
                          }}
                          style={{ padding: '10px 20px', borderRadius: '14px', border: 'none', backgroundColor: T.bgRaised, color: T.textMain, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                        >Add Grade Level</button>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {classes.map((cls, i) => (
                          <div key={cls.id} style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, backgroundColor: T.bgRaised, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: T.textDark, marginBottom: '4px' }}>{cls.name}</div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                   <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted }}>Sections: {cls.sections.join(', ')}</span>
                                   <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted }}>•</span>
                                   <span style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted }}>Capacity: {cls.students} Students</span>
                                </div>
                             </div>
                             <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                  onClick={() => startEdit(cls, 'grade')}
                                  style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                   <Edit2 size={16} color={T.textMuted} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(cls.id, 'grade')}
                                  style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                   <Trash2 size={16} color="#ef4444" />
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
               )}
               {activeTab === 'years' && (
                  <motion.div key="years" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain }}>Academic Cycles</h2>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setFormData({});
                            setModalType('year');
                          }}
                          style={{ padding: '10px 20px', borderRadius: '14px', border: 'none', backgroundColor: T.bgRaised, color: T.textMain, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                        >Initialize New Year</button>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {academicYears.map((yr, i) => (
                          <div key={yr.id} style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, backgroundColor: T.bgRaised, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: T.textDark, marginBottom: '4px' }}>Session {yr.year}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted }}>Cycle: {yr.start} — {yr.end}</div>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ 
                                  padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                                  backgroundColor: yr.status === 'Active' ? '#10b98115' : (isDark ? 'rgba(255,255,255,0.05)' : '#64748b15'),
                                  color: yr.status === 'Active' ? '#10b981' : T.textMuted
                                 }}>{yr.status}</span>
                                <button 
                                  onClick={() => {
                                    showToast(`Opening configurations for Session ${yr.year}...`, 'info');
                                    startEdit(yr, 'year');
                                  }}
                                  style={{ padding: '10px 20px', borderRadius: '12px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                                >Configure</button>
                                <button 
                                  onClick={() => handleDelete(yr.id, 'year')}
                                  style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                   <Trash2 size={16} color="#ef4444" />
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
               )}

               {activeTab === 'subjects' && (
                  <motion.div key="subjects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain }}>Curriculum Map</h2>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setFormData({});
                            setModalType('subject');
                          }}
                          style={{ padding: '10px 20px', borderRadius: '14px', border: 'none', backgroundColor: T.bgRaised, color: T.textMain, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                        >Add Subject</button>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {subjects.map((sub, i) => (
                          <div key={sub.id} style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, backgroundColor: T.bgRaised, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                   <span style={{ fontSize: '1.1rem', fontWeight: 900, color: T.textDark }}>{sub.name}</span>
                                   <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: T.activeBtnBg, color: 'white', fontSize: '0.65rem', fontWeight: 900 }}>{sub.code}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: T.textMuted }}>{sub.credits} Credits • {sub.type} Requirement</div>
                             </div>
                             <div style={{ display: 'flex', gap: '12px' }}>
                                <button 
                                  onClick={() => startEdit(sub, 'subject')}
                                  style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                   <Edit2 size={16} color={T.textMuted} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(sub.id, 'subject')}
                                  style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                   <Trash2 size={16} color="#ef4444" />
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
               )}

               {activeTab === 'campus' && (
                  <motion.div key="campus" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 950, color: T.textMain }}>Campus Layout</h2>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setFormData({});
                            setModalType('space');
                          }}
                          style={{ padding: '10px 20px', borderRadius: '14px', border: 'none', backgroundColor: T.bgRaised, color: T.textMain, fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                        >Allocate Space</button>
                     </div>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {campus.map((b, i) => (
                          <div key={b.id} style={{ padding: '24px', borderRadius: '24px', border: `1px solid ${T.border}`, backgroundColor: T.bgRaised, position: 'relative' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                               <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#4f46e510', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Building2 size={20} />
                               </div>
                               <div style={{ display: 'flex', gap: '8px' }}>
                                  <button 
                                    onClick={() => startEdit(b, 'space')}
                                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                  >
                                     <Edit2 size={12} color={T.textMuted} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(b.id, 'space')}
                                    style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                  >
                                     <Trash2 size={12} color="#ef4444" />
                                  </button>
                               </div>
                             </div>
                             <div style={{ fontSize: '1.1rem', fontWeight: 900, color: T.textMain, marginBottom: '4px' }}>{b.block}</div>
                             <div style={{ fontSize: '0.8rem', fontWeight: 700, color: T.textMuted, marginBottom: '16px' }}>{b.type}</div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: T.textDark }}>
                                <Users size={14} color={T.textMuted} /> Max Capacity: {b.capacity}
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* Configuration Modals */}
      <AnimatePresence>
        {modalType && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: T.bgCard, borderRadius: '32px', padding: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.4)', border: `1px solid ${T.border}` }}
            >
              <button 
                onClick={() => setModalType(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: T.textMain, marginBottom: '24px' }}>
                {editingId ? 'Edit Configuration' : (
                  modalType === 'grade' ? 'Add Grade Level' :
                  modalType === 'year' ? 'Initialize New Session' :
                  modalType === 'subject' ? 'Add Subject Map' :
                  'Allocate Campus Space'
                )}
              </h2>

              <form onSubmit={(e) => {
                e.preventDefault();
                const newId = Date.now();
                if (editingId) {
                  if (modalType === 'grade') {
                    setClasses(classes.map(c => c.id === editingId ? { 
                       ...c, 
                       name: formData.name || 'Grade 9', 
                       sections: formData.sections ? formData.sections.split(',').map(s => s.trim()) : ['A', 'B'], 
                       students: parseInt(formData.students) || 100, 
                       head: formData.head || 'TBD' 
                    } : c));
                    showToast(`${formData.name} updated successfully!`, 'success');
                  } else if (modalType === 'year') {
                    setAcademicYears(academicYears.map(y => y.id === editingId ? { 
                       ...y, 
                       year: formData.year || '2027-2028', 
                       start: formData.start || 'Aug 2027', 
                       end: formData.end || 'June 2028' 
                    } : y));
                    showToast(`Session ${formData.year} updated successfully!`, 'success');
                  } else if (modalType === 'subject') {
                    setSubjects(subjects.map(s => s.id === editingId ? { 
                       ...s, 
                       name: formData.name || 'General Science', 
                       code: formData.code || 'SCI-101', 
                       credits: parseInt(formData.credits) || 3, 
                       type: formData.type || 'Core' 
                    } : s));
                    showToast(`Subject ${formData.name} updated successfully!`, 'success');
                  } else if (modalType === 'space') {
                    setCampus(campus.map(cap => cap.id === editingId ? { 
                       ...cap, 
                       block: formData.block || 'West Hall', 
                       type: formData.type || 'Lecture Hall', 
                       capacity: parseInt(formData.capacity) || 150 
                    } : cap));
                    showToast(`${formData.block} updated successfully!`, 'success');
                  }
                  setEditingId(null);
                } else {
                  if (modalType === 'grade') {
                    const newGrade = {
                      id: newId,
                      name: formData.name || 'Grade 9',
                      sections: formData.sections ? formData.sections.split(',').map(s => s.trim()) : ['A', 'B'],
                      students: parseInt(formData.students) || 100,
                      head: formData.head || 'TBD'
                    };
                    setClasses([...classes, newGrade]);
                    showToast(`${newGrade.name} Grade Level added successfully!`, 'success');
                  } else if (modalType === 'year') {
                    const newYear = {
                      id: newId,
                      year: formData.year || '2027-2028',
                      status: 'Draft',
                      start: formData.start || 'Aug 2027',
                      end: formData.end || 'June 2028'
                    };
                    setAcademicYears([...academicYears, newYear]);
                    showToast(`Session ${newYear.year} initialized successfully!`, 'success');
                  } else if (modalType === 'subject') {
                    const newSub = {
                      id: newId,
                      name: formData.name || 'General Science',
                      code: formData.code || 'SCI-101',
                      credits: parseInt(formData.credits) || 3,
                      type: formData.type || 'Core'
                    };
                    setSubjects([...subjects, newSub]);
                    showToast(`Subject ${newSub.name} added successfully!`, 'success');
                  } else if (modalType === 'space') {
                    const newSpace = {
                      id: newId,
                      block: formData.block || 'West Hall',
                      type: formData.type || 'Lecture Hall',
                      capacity: parseInt(formData.capacity) || 150
                    };
                    setCampus([...campus, newSpace]);
                    showToast(`${newSpace.block} space allocated successfully!`, 'success');
                  }
                }
                setModalType(null);
                setFormData({});
              }}>
                {modalType === 'grade' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>GRADE LEVEL NAME</label>
                      <input required type="text" placeholder="e.g. Grade 9" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>SECTIONS (COMMA SEPARATED)</label>
                      <input type="text" placeholder="e.g. A, B, C" value={formData.sections || ''} onChange={(e) => setFormData({...formData, sections: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>STUDENT CAPACITY</label>
                      <input required type="number" placeholder="e.g. 120" value={formData.students || ''} onChange={(e) => setFormData({...formData, students: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>HEAD TEACHER</label>
                      <input type="text" placeholder="e.g. Mr. Davis" value={formData.head || ''} onChange={(e) => setFormData({...formData, head: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                  </div>
                )}

                {modalType === 'year' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>SESSION YEAR</label>
                      <input required type="text" placeholder="e.g. 2027-2028" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>START DATE</label>
                      <input required type="text" placeholder="e.g. Aug 2027" value={formData.start || ''} onChange={(e) => setFormData({...formData, start: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>END DATE</label>
                      <input required type="text" placeholder="e.g. June 2028" value={formData.end || ''} onChange={(e) => setFormData({...formData, end: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                  </div>
                )}

                {modalType === 'subject' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>SUBJECT NAME</label>
                      <input required type="text" placeholder="e.g. Chemistry" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>SUBJECT CODE</label>
                      <input required type="text" placeholder="e.g. CHM-101" value={formData.code || ''} onChange={(e) => setFormData({...formData, code: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>CREDITS</label>
                      <input required type="number" placeholder="e.g. 3" value={formData.credits || ''} onChange={(e) => setFormData({...formData, credits: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>CREDIT TYPE</label>
                      <select value={formData.type || 'Core'} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600, outline: 'none' }}>
                        <option value="Core">Core Requirement</option>
                        <option value="Elective">Elective Requirement</option>
                      </select>
                    </div>
                  </div>
                )}

                {modalType === 'space' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>BLOCK / HALL NAME</label>
                      <input required type="text" placeholder="e.g. West Wing" value={formData.block || ''} onChange={(e) => setFormData({...formData, block: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>SPACE TYPE</label>
                      <input required type="text" placeholder="e.g. Computer Laboratory" value={formData.type || ''} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: T.textMuted, display: 'block', marginBottom: '8px' }}>MAX CAPACITY</label>
                      <input required type="number" placeholder="e.g. 500" value={formData.capacity || ''} onChange={(e) => setFormData({...formData, capacity: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: `1px solid ${T.border}`, backgroundColor: T.inputBg, color: T.textMain, fontWeight: 600 }} />
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  style={{ width: '100%', padding: '18px', backgroundColor: T.activeBtnBg, color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: isDark ? '0 10px 20px rgba(79, 70, 229, 0.3)' : '0 10px 20px rgba(15, 23, 42, 0.2)' }}
                >
                  Confirm Allocation Details
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: toast.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : toast.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(59, 130, 246, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : '#60a5fa',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            {toast.message.includes('Deleted') || toast.message.includes('Deallocated') ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUndo();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  textTransform: 'uppercase',
                }}
              >
                Undo
              </button>
            ) : null}

            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicSetup;
