import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Filter, Shield,
  Trash2, CircleCheck, Clock, Download,
  Edit, Eye, AlertTriangle, X,
  CheckCircle2, User, Phone, Mail, MapPin,
  Briefcase, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import indianMan1 from '../assets/indian_man_portrait_1.png';
import indianMan2 from '../assets/indian_man_portrait_2.png';
import indianWoman1 from '../assets/indian_woman_portrait_1.png';
import indianWoman2 from '../assets/indian_woman_portrait_2.png';

const GuardianList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const [guardians, setGuardians] = useState(() => {
    // Version check: if stored data is old (no avatarUrl), clear it so rich profiles load
    const storedVersion = localStorage.getItem('guardians_version');
    if (storedVersion !== '2026-v5') {
      localStorage.removeItem('guardians');
      localStorage.setItem('guardians_version', '2026-v5');
    }
    const stored = localStorage.getItem('guardians');
    if (stored) return JSON.parse(stored);
    const defaultList = [
      {
        id: 'GDN-2026-001', name: 'Rajesh Verma', email: 'rajesh.v@example.com', phone: '+91 98765 43299',
        students: ['Aman Verma', 'Neha Sharma'], status: 'active', lastLogin: '2 hours ago',
        role: 'Parent', avatar: 'RV',
        avatarUrl: indianMan1,
        address: 'Block C, Sector 62, Noida, UP 201301',
        occupation: 'Senior Software Architect', company: 'Tech Solutions India',
        gender: 'Male', dob: '15 Mar 1980', emergencyContact: '+91 98765 43290',
        accountType: 'Premium Parent Portal', relation: 'Father',
        joiningDate: '10 Jan 2020',
        color: '#4880FF',
        lastActive: '2 hours ago',
        linkedStudents: [
          { id: 'STU101', name: 'Aman Verma', grade: '10A', attendance: '98%', perf: 'A+' },
          { id: 'STU108', name: 'Neha Sharma', grade: '12C', attendance: '95%', perf: 'B+' }
        ]
      },
      {
        id: 'GDN-2026-002', name: 'Meeta Devi', email: 'meeta.d@example.com', phone: '+91 98765 43296',
        students: ['Divya Joshi', 'Rohan Das'], status: 'active', lastLogin: '1 day ago',
        role: 'Guardian', avatar: 'MD',
        avatarUrl: indianWoman1,
        address: 'Preet Vihar, New Delhi 110092',
        occupation: 'Principal Consultant', company: 'Devi & Associates',
        gender: 'Female', dob: '22 Jun 1978', emergencyContact: '+91 98765 43290',
        accountType: 'Standard Parent Portal', relation: 'Mother',
        joiningDate: '05 Mar 2021',
        color: '#10B981',
        lastActive: '1 day ago',
        linkedStudents: [
          { id: 'STU102', name: 'Divya Joshi', grade: '11A', attendance: '92%', perf: 'A-' },
          { id: 'STU103', name: 'Rohan Das', grade: '10A', attendance: '89%', perf: 'B' }
        ]
      },
      {
        id: 'GDN-2026-003', name: 'Sanjay Gupta', email: 'sanjay.g@example.com', phone: '+91 98765 43297',
        students: ['Karan Mehta'], status: 'suspended', lastLogin: '5 days ago',
        role: 'Parent', avatar: 'SG',
        avatarUrl: indianMan2,
        address: 'Andheri West, Mumbai, MH 400053',
        occupation: 'Cardiologist', company: 'Kokilaben Hospital',
        gender: 'Male', dob: '08 Nov 1975', emergencyContact: '+91 98765 43290',
        accountType: 'Standard Parent Portal', relation: 'Father',
        joiningDate: '18 Aug 2019',
        color: '#F59E0B',
        lastActive: '5 days ago',
        linkedStudents: [
          { id: 'STU104', name: 'Karan Mehta', grade: '12B', attendance: '79%', perf: 'C+' }
        ]
      },
      {
        id: 'GDN-2026-004', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98765 43294',
        students: ['Neha Sharma'], status: 'active', lastLogin: '30 mins ago',
        role: 'Parent', avatar: 'PP',
        avatarUrl: indianWoman2,
        address: 'Satellite, Ahmedabad, GJ 380015',
        occupation: 'Financial Analyst', company: 'GIFT City Finance',
        gender: 'Female', dob: '03 Apr 1982', emergencyContact: '+91 98765 43290',
        accountType: 'Premium Parent Portal', relation: 'Mother',
        joiningDate: '22 Feb 2022',
        color: '#8B5CF6',
        lastActive: '30 mins ago',
        linkedStudents: [
          { id: 'STU108', name: 'Neha Sharma', grade: '12C', attendance: '96%', perf: 'A' }
        ]
      },
      {
        id: 'GDN-2026-005', name: 'Devendra Mishra', email: 'devendra.m@example.com', phone: '+91 98765 43221',
        students: ['Sameer Khan'], status: 'active', lastLogin: '3 hours ago',
        role: 'Parent', avatar: 'DM',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Devendra%20Mishra',
        address: 'Gomti Nagar, Lucknow, UP 226010',
        occupation: 'Civil Engineer', company: 'UP PWD',
        gender: 'Male', dob: '19 Sep 1977', emergencyContact: '+91 98765 43290',
        accountType: 'Premium Parent Portal', relation: 'Father',
        joiningDate: '14 Jul 2020',
        color: '#EF4444',
        lastActive: '3 hours ago',
        linkedStudents: [
          { id: 'STU216', name: 'Sameer Khan', grade: '10A', attendance: '97%', perf: 'A+' }
        ]
      },
      {
        id: 'GDN-2026-006', name: 'Priya Nair', email: 'p.nair@example.com', phone: '+91 98765 43215',
        students: ['Arjun Nair', 'Divya Nair'], status: 'pending', lastLogin: 'Never',
        role: 'Guardian', avatar: 'PN',
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Nair',
        address: 'Adyar, Chennai, TN 600020',
        occupation: 'University Professor', company: 'IIT Madras',
        gender: 'Female', dob: '11 Feb 1979', emergencyContact: '+91 98765 43290',
        accountType: 'Standard Parent Portal', relation: 'Mother',
        joiningDate: '01 Jan 2026',
        color: '#06B6D4',
        lastActive: 'Never',
        linkedStudents: [
          { id: 'STU-2026-104', name: 'Arjun Nair', grade: '08C', attendance: '88%', perf: 'B+' },
          { id: 'STU-2026-105', name: 'Divya Nair', grade: '06A', attendance: '94%', perf: 'A-' }
        ]
      }
    ];
    localStorage.setItem('guardians', JSON.stringify(defaultList));
    return defaultList;
  });

  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Delete flow
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deletedName, setDeletedName] = useState('');

  // Edit flow
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [savedName, setSavedName] = useState('');

  const filteredGuardians = guardians.filter(g => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || g.role === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const headers = ['Guardian ID', 'Name', 'Email', 'Phone', 'Students', 'Role', 'Status', 'Address'];
    const csvContent = [
      headers.join(','),
      ...filteredGuardians.map(g => [
        g.id, `"${g.name}"`, g.email, g.phone,
        `"${g.students.join(', ')}"`, g.role, g.status, `"${g.address}"`
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `guardians_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (guardian) => {
    // Clone the guardian object to avoid mutating state directly
    const guardianCopy = { ...guardian };
    setEditTarget(guardianCopy);
    setEditForm({
      name: guardianCopy.name || '',
      email: guardianCopy.email || '',
      phone: guardianCopy.phone || '',
      address: guardianCopy.address || '',
      role: guardianCopy.role || 'Parent',
      status: guardianCopy.status || 'active',
      relation: guardianCopy.relation || 'Father',
      gender: guardianCopy.gender || 'Male',
      dob: guardianCopy.dob || '',
      occupation: guardianCopy.occupation || '',
      company: guardianCopy.company || '',
      emergencyContact: guardianCopy.emergencyContact || '',
      accountType: guardianCopy.accountType || 'Standard Parent Portal',
    });
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      alert('Name, Email and Phone are required.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      const initials = editForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const updated = {
        ...editTarget,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        address: editForm.address.trim(),
        role: editForm.role,
        status: editForm.status,
        relation: editForm.relation,
        gender: editForm.gender,
        dob: editForm.dob,
        occupation: editForm.occupation.trim(),
        company: editForm.company.trim(),
        emergencyContact: editForm.emergencyContact.trim(),
        accountType: editForm.accountType,
        avatar: initials
      };
      setGuardians(prev => {
        const newList = prev.map(g => g.id === editTarget.id ? updated : g);
        localStorage.setItem('guardians', JSON.stringify(newList));
        return newList;
      });
      setSavedName(updated.name);
      setIsSaving(false);
      setEditTarget(null);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3500);
    }, 1200);
  };

  const handleDeleteClick = (guardian) => setDeleteTarget(guardian);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setTimeout(() => {
      setDeletedName(deleteTarget.name);
      setGuardians(prev => {
        const newList = prev.filter(g => g.id !== deleteTarget.id);
        localStorage.setItem('guardians', JSON.stringify(newList));
        return newList;
      });
      setDeleteTarget(null);
      setIsDeleting(false);
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 3500);
    }, 1200);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '12px',
    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)',
    fontWeight: 700, outline: 'none', color: 'var(--text-main)', fontSize: '0.88rem',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 800,
    color: 'var(--text-muted)', textTransform: 'uppercase',
    marginBottom: '6px', letterSpacing: '0.5px'
  };

  const sectionLabel = (icon, text) => (
    <div style={{
      fontSize: '0.68rem', fontWeight: 900, color: 'var(--primary)',
      textTransform: 'uppercase', letterSpacing: '1px',
      display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px'
    }}>
      {icon} {text}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: '40px' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Save Toast ── */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              background: 'linear-gradient(135deg, var(--primary), #8B5CF6)',
              color: 'white', padding: '16px 24px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 12px 30px -6px rgba(139,92,246,0.55)', fontWeight: 700,
              fontSize: '0.95rem'
            }}
          >
            <CheckCircle2 size={20} />
            <span><strong>{savedName}</strong>'s profile updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Toast ── */}
      <AnimatePresence>
        {showDeleteToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: '#EF4444', color: 'white',
              padding: '16px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(239,68,68,0.45)', fontWeight: 700,
              fontSize: '0.95rem'
            }}
          >
            <Trash2 size={20} />
            <span><strong>{deletedName}</strong> removed from Guardian Directory</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Profile Drawer ── */}
      <AnimatePresence>
        {editTarget && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', justifyContent: 'flex-end' }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isSaving && setEditTarget(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              style={{
                position: 'relative', width: '520px', height: '100%',
                backgroundColor: 'var(--bg-card)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.25)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
              }}
            >
              {/* Top gradient accent */}
              <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--primary), #8B5CF6)' }} />

              {/* Drawer Header */}
              <div style={{
                padding: '24px 28px 18px', borderBottom: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Edit Guardian Profile</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Updating: <strong style={{ color: 'var(--text-main)' }}>{editTarget.name}</strong> &nbsp;·&nbsp; {editTarget.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!isSaving) {
                      setEditTarget(null);
                      setEditForm({});
                    }
                  }}
                  style={{
                    background: 'none', border: '1px solid var(--border-color)',
                    borderRadius: '10px', cursor: 'pointer', padding: '8px',
                    color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)',
                    display: 'flex', alignItems: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {sectionLabel(<User size={12} />, 'Identity')}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Relation</label>
                    <select value={editForm.relation} onChange={e => setEditForm(p => ({ ...p, relation: e.target.value }))} style={inputStyle}>
                      {['Father', 'Mother', 'Guardian', 'Grandparent', 'Uncle', 'Aunt', 'Sibling', 'Other'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))} style={inputStyle}>
                      {['Parent', 'Guardian'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select value={editForm.gender} onChange={e => setEditForm(p => ({ ...p, gender: e.target.value }))} style={inputStyle}>
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input value={editForm.dob} onChange={e => setEditForm(p => ({ ...p, dob: e.target.value }))} placeholder="e.g. 15 Mar 1980" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select value={editForm.status} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                      {['active', 'suspended', 'pending'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {sectionLabel(<Mail size={12} />, 'Contact')}

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" style={inputStyle} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8901" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Emergency Contact</label>
                    <input value={editForm.emergencyContact} onChange={e => setEditForm(p => ({ ...p, emergencyContact: e.target.value }))} placeholder="+1 234 567 8999" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Home Address</label>
                  <input value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Oak Lane, City, State" style={inputStyle} />
                </div>

                {sectionLabel(<Briefcase size={12} />, 'Professional')}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Occupation</label>
                    <input value={editForm.occupation} onChange={e => setEditForm(p => ({ ...p, occupation: e.target.value }))} placeholder="e.g. Engineer" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Organization</label>
                    <input value={editForm.company} onChange={e => setEditForm(p => ({ ...p, company: e.target.value }))} placeholder="e.g. TechCorp" style={inputStyle} />
                  </div>
                </div>

                {sectionLabel(<Shield size={12} />, 'Account')}

                <div>
                  <label style={labelStyle}>Account Type</label>
                  <select value={editForm.accountType} onChange={e => setEditForm(p => ({ ...p, accountType: e.target.value }))} style={inputStyle}>
                    {['Premium Parent Portal', 'Standard Parent Portal', 'Guardian Access', 'Read-Only Access'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '18px 28px', borderTop: '1px solid var(--border-color)',
                display: 'flex', gap: '12px', backgroundColor: 'var(--bg-body)'
              }}>
                <button
                  onClick={() => {
                    if (!isSaving) {
                      // Reset form and close drawer
                      setEditForm({});
                      setEditTarget(null);
                    }
                  }}
                  disabled={isSaving}
                  className="btn"
                  style={{ flex: 1, padding: '13px', borderRadius: '14px', fontWeight: 800, border: '1px solid var(--border-color)', opacity: isSaving ? 0.5 : 1 }}
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  whileHover={!isSaving ? { scale: 1.03, boxShadow: '0 10px 20px -6px rgba(139,92,246,0.5)' } : {}}
                  whileTap={!isSaving ? { scale: 0.97 } : {}}
                  style={{
                    flex: 2, padding: '13px', borderRadius: '14px', border: 'none', fontWeight: 900,
                    background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)',
                    color: 'white', cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    opacity: isSaving ? 0.85 : 1,
                    boxShadow: '0 6px 16px -4px rgba(139,92,246,0.35)'
                  }}
                >
                  {isSaving ? (
                    <>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />
                      Saving...
                    </>
                  ) : (
                    <><Save size={16} /> Save Changes</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
          }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteTarget(null)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                position: 'relative', width: '100%', maxWidth: '460px',
                backgroundColor: 'var(--bg-card)', borderRadius: '24px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.35)', overflow: 'hidden'
              }}
            >
              <div style={{ height: '4px', backgroundColor: '#EF4444', width: '100%' }} />
              <div style={{ padding: '32px' }}>
                <button
                  onClick={() => !isDeleting && setDeleteTarget(null)}
                  style={{
                    position: 'absolute', top: '20px', right: '20px', background: 'none',
                    border: '1px solid var(--border-color)', borderRadius: '10px', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '6px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', backgroundColor: 'var(--bg-body)'
                  }}
                >
                  <X size={16} />
                </button>

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1, damping: 15, stiffness: 200 }}
                  style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#EF444415', color: '#EF4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
                  }}
                >
                  <AlertTriangle size={30} strokeWidth={2.5} />
                </motion.div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                  Remove Guardian Record
                </h3>
                <p style={{ margin: '0 0 24px 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  You are about to permanently delete the record for:
                </p>

                <div style={{
                  padding: '16px 20px', borderRadius: '16px',
                  backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)',
                  display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: '#EF444415', color: '#EF4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '0.85rem', flexShrink: 0
                  }}>
                    {deleteTarget.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {deleteTarget.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {deleteTarget.id} · {deleteTarget.role} · {deleteTarget.students.join(', ')}
                    </div>
                  </div>
                </div>

                <p style={{
                  margin: '0 0 28px 0', padding: '12px 16px', borderRadius: '10px',
                  backgroundColor: '#EF444408', border: '1px solid #EF444430',
                  color: '#EF4444', fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.5
                }}>
                  ⚠ This action cannot be undone. All associated student links and login credentials will be permanently erased.
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => !isDeleting && setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="btn"
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 800, border: '1px solid var(--border-color)', opacity: isDeleting ? 0.5 : 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 800,
                      backgroundColor: '#EF4444', color: 'white', border: 'none',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      opacity: isDeleting ? 0.85 : 1, transition: '0.2s'
                    }}
                  >
                    {isDeleting ? (
                      <>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />
                        Removing...
                      </>
                    ) : (
                      <><Trash2 size={16} /> Confirm Delete</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>Guardian Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Manage institutional guardian records and student associations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn"
            onClick={exportToCSV}
            style={{ border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}
          >
            <Download size={18} /> Export CSV
          </button>
          <motion.button
            whileHover={{ scale: 1.04, translateY: -2, boxShadow: '0 12px 24px -6px rgba(69,179,224,0.4)' }}
            whileTap={{ scale: 0.96 }}
            className="btn btn-primary"
            onClick={() => navigate('/dashboard/add-guardian')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary) 0%, #8B5CF6 100%)', border: 'none', boxShadow: '0 6px 16px -4px rgba(69,179,224,0.3)' }}
          >
            <UserPlus size={18} /> Add New Guardian
          </motion.button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Guardians', value: guardians.length.toLocaleString(), color: 'var(--primary)', icon: Users },
          { label: 'Verified Accounts', value: guardians.filter(g => g.status === 'active').length.toLocaleString(), color: 'var(--success)', icon: CircleCheck },
          { label: 'Pending Invites', value: guardians.filter(g => g.status === 'pending').length.toLocaleString(), color: '#f59e0b', icon: Clock },
          { label: 'Suspended', value: guardians.filter(g => g.status === 'suspended').length.toLocaleString(), color: 'var(--danger)', icon: Shield }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 950 }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter & Table ── */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="search-bar" style={{ width: '350px' }}>
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder="Search by name, ID or email..."
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
            <button
              className="btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{
                border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: activeFilter !== 'All' ? 'var(--primary-light)' : 'transparent',
                color: activeFilter !== 'All' ? 'var(--primary)' : 'inherit', fontWeight: 700
              }}
            >
              <Filter size={18} /> {activeFilter === 'All' ? 'Filter' : activeFilter}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                    backgroundColor: 'var(--bg-card)', borderRadius: '12px',
                    boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                    padding: '8px', zIndex: 100, width: '180px'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', padding: '8px', textTransform: 'uppercase' }}>Role</div>
                  {['All', 'Parent', 'Guardian'].map(f => (
                    <div
                      key={f}
                      onClick={() => { setActiveFilter(f); setIsFilterOpen(false); }}
                      style={{
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                        backgroundColor: activeFilter === f ? 'var(--primary-light)' : 'transparent',
                        color: activeFilter === f ? 'var(--primary)' : 'var(--text-main)'
                      }}
                    >
                      {f}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--bg-body)' }}>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>GUARDIAN INFO</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>ID &amp; ROLE</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>STUDENT ASSOCIATION</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>CONTACT</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>STATUS</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredGuardians.map(g => (
                  <motion.tr
                    key={g.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                    className="hover-row"
                  >
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '10px', 
                  backgroundColor: g.gender?.toLowerCase() === 'female' ? 'var(--success-light)' : 'var(--primary-light)', 
                          color: g.gender?.toLowerCase() === 'female' ? 'var(--success)' : 'var(--primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontWeight: 900, fontSize: '0.8rem', overflow: 'hidden' 
                        }}>
                          {(g.avatarUrl || g.img) ? (
                            <img src={g.id === 'GDN-2026-001' ? indianMan1 : (g.avatarUrl || g.img)} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : g.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{g.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{g.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{g.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{g.role}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {g.students.map((s, idx) => (
                          <span key={idx} style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'var(--bg-body)', fontSize: '0.7rem', fontWeight: 700, border: '1px solid var(--border-color)' }}>{s}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{g.phone}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{g.address}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900,
                        backgroundColor: g.status === 'active' ? '#10B98115' : g.status === 'suspended' ? '#EF444415' : '#F59E0B15',
                        color: g.status === 'active' ? '#10B981' : g.status === 'suspended' ? '#EF4444' : '#F59E0B'
                      }}>
                        {g.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => navigate(`/dashboard/guardian-details/${g.id}`)}
                          className="btn-icon"
                          style={{ backgroundColor: 'var(--bg-body)' }}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => openEditModal(g)}
                          className="btn-icon"
                          style={{ backgroundColor: 'rgba(69,179,224,0.1)', color: 'var(--primary)', border: '1px solid rgba(69,179,224,0.25)' }}
                          title="Edit guardian profile"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <button
                          onClick={() => handleDeleteClick(g)}
                          className="btn-icon"
                          style={{ backgroundColor: '#EF444410', color: '#EF4444' }}
                          title="Delete guardian"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredGuardians.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              <Users size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>No guardians found</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting your search or filter.</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GuardianList;
