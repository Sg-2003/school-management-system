import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Building, Globe, Mail, 
  Phone, MapPin, Camera, Save, 
  Shield, Bell, Lock, Languages,
  Clock, CreditCard, Share2, Info, GraduationCap, Calendar, Layers, BookOpen, Building2, Users, Layout, Plus, X
} from 'lucide-react';

const InstitutionalSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [academicTab, setAcademicTab] = useState('classes');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [academicYears, setAcademicYears] = useState([
    { id: 1, year: '2025-2026', status: 'Active', start: 'Aug 2025', end: 'June 2026' },
    { id: 2, year: '2026-2027', status: 'Draft', start: 'Aug 2026', end: 'June 2027' }
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: 'Grade 10', sections: ['A', 'B', 'C'], students: 120, head: 'Mr. Amit Sharma' },
    { id: 2, name: 'Grade 11', sections: ['A', 'B'], students: 85, head: 'Ms. Priya Patel' },
    { id: 3, name: 'Grade 12', sections: ['A', 'B', 'C', 'D'], students: 150, head: 'Dr. Sanjay Gupta' }
  ]);

  const [schoolData, setSchoolData] = useState({
    name: 'EduPro Elite International',
    tagline: 'Empowering the next generation of leaders.',
    email: 'admin@edupro-elite.com',
    phone: '+91 98765 43210',
    address: '123 Academic Way, New Delhi, India',
    website: 'https://edupro-elite.com',
    timezone: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi',
    language: 'English (IN)'
  });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleSave = () => {
    triggerToast('Institutional settings successfully updated and synchronized across all portals!', 'success');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      {/* Premium Glassmorphic Success Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ 
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 1300,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#0f172a', 
              padding: '18px 28px',
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)', 
              fontWeight: 800,
              fontSize: '0.95rem'
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={18} />
            </div>
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              style={{
                background: 'none', border: 'none', color: '#64748b', 
                cursor: 'pointer', padding: '4px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0f172a', letterSpacing: '-1.5px', marginBottom: '8px' }}>Institutional Configuration</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Manage global school identity, contact information, and system preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)' }}
        >
           <Save size={20} /> Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '40px' }}>
         {/* Sidebar Navigation */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'profile', label: 'School Profile', icon: <Building size={18} /> },
              { id: 'academic', label: 'Academic Setup', icon: <GraduationCap size={18} /> },
              { id: 'contact', label: 'Contact Info', icon: <Mail size={18} /> },
              { id: 'security', label: 'Security & Access', icon: <Lock size={18} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
              { id: 'localization', label: 'Localization', icon: <Globe size={18} /> }
            ].map(item => (
              <button 
                key={item.id} onClick={() => setActiveSection(item.id)}
                style={{ 
                  padding: '16px 20px', borderRadius: '14px', border: 'none',
                  backgroundColor: activeSection === item.id ? '#0f172a' : 'transparent',
                  color: activeSection === item.id ? 'white' : '#64748b',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', transition: '0.3s',
                  textAlign: 'left'
                }}
              >
                 {item.icon} {item.label}
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '48px', border: '1px solid #f1f5f9', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
            {activeSection === 'academic' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#0f172a' }}>Academic Infrastructure</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                       {[
                         { id: 'classes', label: 'Class Structure' },
                         { id: 'years', label: 'Academic Cycles' },
                         { id: 'subjects', label: 'Curriculum Map' },
                         { id: 'campus', label: 'Campus Layout' }
                       ].map(t => (
                         <button 
                           key={t.id} onClick={() => setAcademicTab(t.id)}
                           style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: academicTab === t.id ? '#0f172a' : '#f1f5f9', color: academicTab === t.id ? 'white' : '#64748b', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: '0.3s' }}
                         >
                            {t.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 {academicTab === 'classes' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       {classes.map((cls, i) => (
                         <div key={i} style={{ padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>{cls.name}</div>
                               <div style={{ display: 'flex', gap: '12px' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Sections: {cls.sections.join(', ')}</span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>•</span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Capacity: {cls.students} Students</span>
                               </div>
                            </div>
                            <button style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>Manage</button>
                         </div>
                       ))}
                       <button style={{ padding: '16px', borderRadius: '16px', border: '2px dashed #e2e8f0', backgroundColor: 'transparent', color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Plus size={18} /> Add Grade Level
                       </button>
                    </div>
                 )}

                 {academicTab === 'years' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       {academicYears.map((yr, i) => (
                         <div key={i} style={{ padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>Session {yr.year}</div>
                               <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Cycle: {yr.start} — {yr.end}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                               <span style={{ 
                                 padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                                 backgroundColor: yr.status === 'Active' ? '#10b98115' : '#64748b15',
                                 color: yr.status === 'Active' ? '#10b981' : '#64748b'
                               }}>{yr.status}</span>
                               <button style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Configure</button>
                            </div>
                         </div>
                       ))}
                       <button style={{ padding: '16px', borderRadius: '16px', border: '2px dashed #e2e8f0', backgroundColor: 'transparent', color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Plus size={18} /> Initialize New Session
                       </button>
                    </div>
                 )}

                 {academicTab === 'subjects' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       {[
                         { name: 'Advanced Mathematics', code: 'MTH-401', credits: 4, type: 'Core' },
                         { name: 'Physics & Lab', code: 'PHY-302', credits: 3, type: 'Core' },
                         { name: 'World History', code: 'HIS-201', credits: 2, type: 'Elective' }
                       ].map((sub, i) => (
                         <div key={i} style={{ padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b' }}>{sub.name}</span>
                                  <span style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: '#0f172a', color: 'white', fontSize: '0.65rem', fontWeight: 900 }}>{sub.code}</span>
                               </div>
                               <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{sub.credits} Credits • {sub.type} Requirement</div>
                            </div>
                            <button style={{ padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#0f172a', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}>Manage</button>
                         </div>
                       ))}
                       <button style={{ padding: '16px', borderRadius: '16px', border: '2px dashed #e2e8f0', backgroundColor: 'transparent', color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Plus size={18} /> Add Subject
                       </button>
                    </div>
                 )}

                 {academicTab === 'campus' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                       {[
                         { block: 'North Wing', type: 'Academic Classrooms', capacity: 1200 },
                         { block: 'Science Center', type: 'Laboratories', capacity: 400 },
                         { block: 'Athletic Complex', type: 'Sports & Recreation', capacity: 2000 },
                         { block: 'Central Library', type: 'Study Hub', capacity: 800 }
                       ].map((b, i) => (
                         <div key={i} style={{ padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#4f46e510', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                               <Building2 size={20} />
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>{b.block}</div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '16px' }}>{b.type}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                               <Users size={14} color="#64748b" /> Max Capacity: {b.capacity}
                            </div>
                         </div>
                       ))}
                       <button style={{ padding: '24px', borderRadius: '24px', border: '2px dashed #e2e8f0', backgroundColor: 'transparent', color: '#64748b', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <Plus size={20} />
                          </div>
                          Allocate New Space
                       </button>
                    </div>
                 )}
              </motion.div>
            )}

            {activeSection === 'profile' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#0f172a', marginBottom: '32px' }}>School Profile</h2>
                 
                 {/* Logo Upload */}
                 <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '32px', backgroundColor: '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                       <Building size={40} color="#94a3b8" />
                       <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'white', padding: '6px', fontSize: '0.65rem', fontWeight: 900, textAngle: 'center', backdropFilter: 'blur(4px)' }}>
                          UPDATE LOGO
                       </div>
                    </div>
                    <div>
                       <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '4px' }}>Institutional Brand</h3>
                       <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>Upload your school logo for use on ID cards, certificates, and invoices.</p>
                       <button style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Browse Media</button>
                    </div>
                 </div>

                 {/* Form Fields */}
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>Institutional Name</label>
                       <input 
                        type="text" value={schoolData.name} onChange={(e) => setSchoolData({...schoolData, name: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 700 }}
                       />
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>Motto / Tagline</label>
                       <input 
                        type="text" value={schoolData.tagline} onChange={(e) => setSchoolData({...schoolData, tagline: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 700 }}
                       />
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>Primary Contact Email</label>
                       <input 
                        type="email" value={schoolData.email} onChange={(e) => setSchoolData({...schoolData, email: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 700 }}
                       />
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>Contact Phone</label>
                       <input 
                        type="text" value={schoolData.phone} onChange={(e) => setSchoolData({...schoolData, phone: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 700 }}
                       />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#64748b', marginBottom: '10px' }}>Physical Address</label>
                       <textarea 
                         value={schoolData.address} onChange={(e) => setSchoolData({...schoolData, address: e.target.value})}
                         style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 700, minHeight: '100px', resize: 'none' }}
                       />
                    </div>
                 </div>
              </motion.div>
            )}

            {activeSection === 'localization' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                 <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: '#0f172a', marginBottom: '32px' }}>Localization Settings</h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>System Timezone</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Set the default timezone for attendance and notifications.</p>
                       </div>
                       <select style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700, backgroundColor: '#f8fafc' }}>
                          <option>{schoolData.timezone}</option>
                          <option>(GMT-05:00) Eastern Time</option>
                       </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>Default Language</h4>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>The primary language used for the administrative portal.</p>
                       </div>
                       <select style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 700, backgroundColor: '#f8fafc' }}>
                          <option>{schoolData.language}</option>
                          <option>Spanish (ES)</option>
                          <option>French (FR)</option>
                       </select>
                    </div>
                 </div>
              </motion.div>
            )}
         </div>
      </div>
    </div>
  );
};

export default InstitutionalSettings;
