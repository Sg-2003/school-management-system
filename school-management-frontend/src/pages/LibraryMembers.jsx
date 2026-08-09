import React, { useState, useMemo } from 'react';
import { Users, Plus, Search, Filter, Mail, Phone, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import devonAvatar from '../assets/devon_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';
import elenaAvatar from '../assets/elena_avatar.png';
import marcusAvatar from '../assets/marcus_avatar.png';
import sophiaAvatar from '../assets/sophia_avatar.png';
import studentAvatar from '../assets/student_avatar.png';

const getMemberAvatar = (memberName) => {
  const name = memberName.toLowerCase();
  if (name.includes('devon') || name.includes('harry potter')) return devonAvatar;
  if (name.includes('jane') || name.includes('hermione granger')) return janeAvatar;
  if (name.includes('robert') || name.includes('ron weasley')) return robertAvatar;
  if (name.includes('eleanor') || name.includes('albus dumbledore')) return eleanorAvatar;
  if (name.includes('patel')) return ninaPatelAvatar;

  // Falling back to high quality matching portrait face-shots for other members
  const fallbacks = {
    'elena smith': elenaAvatar,
    'marcus johnson': marcusAvatar,
    'sophia williams': sophiaAvatar,
    'nina patel': ninaPatelAvatar,
    'robert brown': robertAvatar
  };

  return fallbacks[name] || null;
};


const SEED_MEMBERS = [
  { id: 'LIB-M-001', name: 'Devon Lane', role: 'Student', class: 'Grade 10-A', booksIssued: 2, status: 'Active', joinDate: '2025-09-01' },
  { id: 'LIB-M-002', name: 'Jane Doe', role: 'Student', class: 'Grade 10-A', booksIssued: 5, status: 'Active', joinDate: '2025-09-01' },
  { id: 'LIB-M-003', name: 'Robert Lane', role: 'Guardian', class: 'Ward: Devon Lane (10A)', booksIssued: 1, status: 'Active', joinDate: '2025-09-05' },
  { id: 'LIB-M-004', name: 'Albus Dumbledore', role: 'Teacher', dept: 'Administration', booksIssued: 12, status: 'Elite', joinDate: '2024-01-10' },
  { id: 'LIB-M-005', name: 'Robert Brown', role: 'Driver', route: 'Route: South Connect', booksIssued: 3, status: 'Active', joinDate: '2025-10-12' },
];

const LibraryMembers = () => {
  const navigate = useNavigate();
  
  const [members, setMembers] = useState(() => {
    let parsed = null;
    try {
      const s = localStorage.getItem('library_members');
      if (s) parsed = JSON.parse(s);
    } catch(e) {}

    if (parsed && Array.isArray(parsed)) {
      return parsed.map(m => {
        if (m.id === 'LIB-M-003' && m.name !== 'Robert Lane') {
          return { ...m, name: 'Robert Lane', role: 'Guardian', class: 'Ward: Devon Lane (10A)', status: 'Active' };
        }
        return m;
      });
    }

    localStorage.setItem('library_members', JSON.stringify(SEED_MEMBERS));
    return SEED_MEMBERS;
  });

  const persist = (updated) => {
    setMembers(updated);
    localStorage.setItem('library_members', JSON.stringify(updated));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  const roles = ['All', ...new Set(members.map(m => m.role))];

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || (m.class && m.class.toLowerCase().includes(q)) || (m.dept && m.dept.toLowerCase().includes(q));
      const matchR = filterRole === 'All' || m.role === filterRole;
      return matchQ && matchR;
    });
  }, [members, searchQuery, filterRole]);

  const handleOpenMember = (member) => {
    navigate(`/dashboard/library-member-details/${member.id}`);
  };

  const [form, setForm] = useState({ name: '', role: 'Student', details: '' });
  
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.details) {
      showToast('error', 'Please fill all required fields.');
      return;
    }
    const newMember = {
      id: `LIB-M-00${members.length + 1}`,
      name: form.name,
      role: form.role,
      [form.role === 'Student' || form.role === 'Guardian' ? 'class' : (form.role === 'Driver' ? 'route' : 'dept')]: form.role === 'Guardian' ? `Ward: ${form.details}` : (form.role === 'Driver' ? `Route: ${form.details}` : form.details),
      booksIssued: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    persist([newMember, ...members]);
    setShowAddModal(false);
    showToast('success', 'New member registered successfully.');
    setForm({ name: '', role: 'Student', details: '' });
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
          backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444', color: 'white',
          padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.9rem'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Library Membership Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track library access, borrowing privileges, and member activity across the institution.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer' }}>
          <Plus size={20} /> Register Member
        </button>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px' }}>
           <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                placeholder="Search by name, member ID or class..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }}
              />
           </div>
           <div style={{ position: 'relative' }}>
             <button onClick={() => setShowFilter(!showFilter)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', padding: '12px 20px', cursor: 'pointer' }}>
               <Filter size={18} /> Role {filterRole !== 'All' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
             </button>
             {showFilter && (
               <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '180px' }}>
                 {roles.map(r => (
                   <div 
                     key={r} 
                     onClick={() => { setFilterRole(r); setShowFilter(false); }}
                     style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: filterRole === r ? 'var(--primary-light)' : 'transparent', color: filterRole === r ? 'var(--primary)' : 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem' }}
                   >
                     {r}
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                 <tr style={{ backgroundColor: 'var(--bg-body)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Member Identity</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Classification</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Books Issued</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Membership Status</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Join Date</th>
                    <th style={{ padding: '20px 24px' }}></th>
                 </tr>
              </thead>
              <tbody>
                 {filteredMembers.map((member, idx) => (
                   <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, overflow: 'hidden' }}>
                               {getMemberAvatar(member.name) ? (
                                  <img 
                                     src={getMemberAvatar(member.name)} 
                                     alt={member.name} 
                                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  />
                               ) : (
                                  member.name.charAt(0)
                                )}
                            </div>
                            <div>
                               <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>{member.name}</p>
                               <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace' }}>{member.id}</p>
                            </div>
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{member.role}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{member.class || member.dept || member.route}</span>
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ height: '8px', width: '60px', backgroundColor: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
                               <div style={{ height: '100%', width: `${(member.booksIssued / 15) * 100}%`, backgroundColor: 'var(--primary)' }}></div>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{member.booksIssued}</span>
                         </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                         <span style={{ 
                            padding: '6px 12px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900,
                            backgroundColor: member.status === 'Active' ? '#ecfdf5' : (member.status === 'Elite' ? '#eef2ff' : '#fef2f2'),
                            color: member.status === 'Active' ? '#10b981' : (member.status === 'Elite' ? '#4f46e5' : '#ef4444')
                         }}>
                            {member.status === 'Elite' && <ShieldCheck size={10} style={{ marginRight: '4px' }} />}
                            {member.status.toUpperCase()}
                         </span>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{member.joinDate}</td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                         <button onClick={() => handleOpenMember(member)} style={{ padding: '8px', backgroundColor: 'var(--bg-body)', border: 'none', borderRadius: '8px', color: 'var(--primary)', cursor: 'pointer' }}>
                            <ExternalLink size={18} />
                         </button>
                      </td>
                   </tr>
                 ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                        No members found matching your criteria.
                      </td>
                    </tr>
                  )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Register New Member</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. John Doe" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Staff">Staff</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Driver">Driver / Transport Faculty</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {form.role === 'Student' ? 'Class' : (form.role === 'Guardian' ? 'Ward Name & Class' : (form.role === 'Driver' ? 'Assigned Route' : 'Department'))}
                  </label>
                  <input type="text" required value={form.details} onChange={e => setForm({...form, details: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder={form.role === 'Student' ? 'e.g. Grade 10-A' : (form.role === 'Guardian' ? 'e.g. Devon Lane (10A)' : (form.role === 'Driver' ? 'e.g. South Connect' : 'e.g. Science'))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} /> Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryMembers;
