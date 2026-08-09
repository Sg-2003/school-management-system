import React, { useState, useMemo } from 'react';
import { User, Book, Clock, AlertCircle, Calendar, History, Mail, Phone, ChevronRight, CheckCircle2, ShieldCheck, Users, Building, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import devonAvatar from '../assets/devon_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';

const getMemberAvatar = (memberName) => {
  const name = memberName.toLowerCase();
  if (name.includes('devon') || name.includes('harry potter')) return devonAvatar;
  if (name.includes('jane') || name.includes('hermione granger')) return janeAvatar;
  if (name.includes('robert') || name.includes('ron weasley')) return robertAvatar;
  if (name.includes('eleanor') || name.includes('albus dumbledore')) return eleanorAvatar;
  if (name.includes('patel')) return ninaPatelAvatar;

  // Falling back to high quality matching portrait face-shots for other members
  const fallbacks = {
    'luna lovegood': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    'draco malfoy': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    'severus snape': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'minerva mcgonagall': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    'james bond': 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop'
  };

  return fallbacks[name] || null;
};

const LibraryMemberDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const member = useMemo(() => {
    try {
      const stored = localStorage.getItem('library_members');
      if (stored) {
        const list = JSON.parse(stored);
        const found = list.find(m => m.id === id);
        if (found) return {
          ...found,
          email: `${found.name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
          phone: '+1 234 567 8901',
          maxLimit: found.role === 'Student' ? 10 : (found.role === 'Teacher' ? 25 : (found.role === 'Guardian' ? 8 : (found.role === 'Driver' ? 12 : 15))),
          fineAmount: 0.00
        };
      }
    } catch (e) {}

    // Fallback member if database entry is not found
    return {
      id: id || 'LIB-M-002',
      name: 'Hermione Granger',
      role: 'Student',
      class: 'Grade 10-A',
      email: 'hermione.g@school.edu',
      phone: '+1 234 567 8901',
      status: 'Elite Member',
      joinDate: '2025-09-01',
      booksIssued: 5,
      maxLimit: 15,
      fineAmount: 0.00
    };
  }, [id]);

  const [loans, setLoans] = useState([
    { id: 1, title: 'Introduction to Algorithms', issued: '2026-05-01', due: '2026-05-15', status: 'On Track', isbn: '9780262033848' },
    { id: 2, title: 'History of Magic', issued: '2026-04-28', due: '2026-05-12', status: 'Due Soon', isbn: '9780590353427' },
    { id: 3, title: 'Advanced Potion-Making', issued: '2026-04-15', due: '2026-04-29', status: 'Overdue', isbn: '9780439785969' },
  ]);

  const handleRenew = (id, title) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === id) {
        const d = new Date(loan.due);
        d.setDate(d.getDate() + 14);
        return { ...loan, due: d.toISOString().split('T')[0], status: 'On Track' };
      }
      return loan;
    }));
    showToast('success', `Renewed "${title}" successfully for 14 days.`);
  };

  const handleReturn = (id, title) => {
    setLoans(prev => prev.filter(loan => loan.id !== id));
    showToast('success', `"${title}" returned successfully.`);
  };

  const roleConfig = useMemo(() => {
    if (member.role === 'Teacher') {
      return {
        themeColor: '#8B5CF6',
        glowColor: 'rgba(139, 92, 246, 0.3)',
        badgeText: 'Faculty Gold Access',
        statusBg: '#f5f3ff',
        statusBorder: '#8b5cf620',
        statusTitleColor: '#6d28d9',
        statusDescColor: '#5b21b6',
        statusText: 'Late Fee Exempted',
        statusDesc: 'Academic privilege active. No overdue penalty accrued.',
        metaDetail: `${member.class || member.dept || 'Science Department'}`,
        idLabel: 'Faculty ID',
        icon: <ShieldCheck size={18} style={{ color: '#8B5CF6' }} />
      };
    } else if (member.role === 'Staff') {
      return {
        themeColor: '#F59E0B',
        glowColor: 'rgba(245, 158, 11, 0.3)',
        badgeText: 'Institutional Staff Pass',
        statusBg: '#fffbeb',
        statusBorder: '#f59e0b20',
        statusTitleColor: '#b45309',
        statusDescColor: '#92400e',
        statusText: 'Staff Privilege Enabled',
        statusDesc: 'Inter-library dispatch permitted. Extended lending enabled.',
        metaDetail: `${member.class || member.dept || 'Administration'}`,
        idLabel: 'Staff ID',
        icon: <Building size={18} style={{ color: '#F59E0B' }} />
      };
    } else if (member.role === 'Guardian') {
      return {
        themeColor: '#EC4899',
        glowColor: 'rgba(236, 72, 153, 0.3)',
        badgeText: 'Parent Reader Pass',
        statusBg: '#fdf2f8',
        statusBorder: '#ec489920',
        statusTitleColor: '#db2777',
        statusDescColor: '#9d174d',
        statusText: 'Family Link Active',
        statusDesc: 'Permitted to borrow for ward. Library stats synced to parent app.',
        metaDetail: `${member.class || 'Ward: Devon Lane (10A)'}`,
        idLabel: 'Guardian ID',
        icon: <Users size={18} style={{ color: '#EC4899' }} />
      };
    } else if (member.role === 'Driver' || member.role.includes('Driver') || member.role.includes('Transport')) {
      return {
        themeColor: '#14B8A6', // Teal
        glowColor: 'rgba(20, 184, 166, 0.3)',
        badgeText: 'Transit Crew Reader Pass',
        statusBg: '#f0fdfa',
        statusBorder: '#14b8a620',
        statusTitleColor: '#0f766e',
        statusDescColor: '#115e59',
        statusText: 'Transit Priority Enabled',
        statusDesc: 'Authorized for route-lending locks. Quick check-out active.',
        metaDetail: `${member.route || member.class || 'Transit & Logistics Dept'}`,
        idLabel: 'CDL License No.',
        icon: <Briefcase size={18} style={{ color: '#14B8A6' }} />
      };
    } else {
      return {
        themeColor: 'var(--primary)',
        glowColor: 'rgba(72, 128, 255, 0.3)',
        badgeText: 'Student Library Pass',
        statusBg: '#ecfdf5',
        statusBorder: '#10b98120',
        statusTitleColor: '#10b981',
        statusDescColor: '#065f46',
        statusText: 'Account Healthy',
        statusDesc: 'No outstanding fines, overdue holds, or restrictions.',
        metaDetail: `${member.class || 'Grade 10-A'}`,
        idLabel: 'Student ID',
        icon: <User size={18} style={{ color: 'var(--primary)' }} />
      };
    }
  }, [member]);

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#4880FF', color: 'white',
              padding: '16px 24px', borderRadius: '16px',
              display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700,
              fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Left Column: Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="card" style={{ padding: '40px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '32px', backgroundColor: roleConfig.themeColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '3rem', margin: '0 auto 24px', boxShadow: '0 20px 40px ' + roleConfig.glowColor, overflow: 'hidden' }}>
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
              <h2 style={{ fontSize: '1.75rem', fontWeight: 950, marginBottom: '8px' }}>{member.name}</h2>
              <p style={{ color: roleConfig.themeColor, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '32px' }}>{roleConfig.badgeText}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                    {roleConfig.icon} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{member.role} • {roleConfig.metaDetail}</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                    <Mail size={18} style={{ color: roleConfig.themeColor }} /> <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{member.email}</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
                    <Calendar size={18} style={{ color: roleConfig.themeColor }} /> <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{roleConfig.idLabel}: {member.id}</span>
                 </div>
              </div>
           </div>

           <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '24px', fontSize: '1.1rem' }}>Borrowing Power</h4>
              <div style={{ marginBottom: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Quota Used</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{member.booksIssued} / {member.maxLimit}</span>
                 </div>
                 <div style={{ height: '10px', backgroundColor: 'var(--bg-body)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(member.booksIssued / member.maxLimit) * 100}%`, backgroundColor: roleConfig.themeColor }}></div>
                 </div>
              </div>
              <div style={{ padding: '20px', backgroundColor: roleConfig.statusBg, borderRadius: '16px', border: '1px solid ' + roleConfig.statusBorder, display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <CheckCircle2 color={roleConfig.themeColor} />
                 <div>
                    <p style={{ margin: 0, fontWeight: 800, color: roleConfig.statusTitleColor, fontSize: '0.9rem' }}>{roleConfig.statusText}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: roleConfig.statusDescColor, fontWeight: 600 }}>{roleConfig.statusDesc}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Loans & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Active Loans</h3>
                 <button onClick={() => navigate('/dashboard/issue-return')} className="btn" style={{ fontSize: '0.85rem', padding: '10px 20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}>Manage All</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {loans.map((loan) => (
                    <motion.div 
                      key={loan.id}
                      whileHover={{ scale: 1.01 }}
                      style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                       <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                           <div style={{ width: '48px', height: '64px', backgroundColor: 'var(--primary)', borderRadius: '2px 6px 6px 2px', flexShrink: 0, boxShadow: 'inset 2px 0 5px rgba(0,0,0,0.2), inset -1px 0 1px rgba(255,255,255,0.4), 3px 3px 8px rgba(0,0,0,0.15)', borderLeft: '2px solid rgba(255,255,255,0.25)', position: 'relative', overflow: 'hidden' }}>
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4px', textAlign: 'center', color: 'white' }}>
                                <Book size={16} style={{ opacity: 0.8 }} />
                              </div>
                              {loan.isbn && (
                                <img 
                                  src={`https://covers.openlibrary.org/b/isbn/${loan.isbn}-M.jpg`} 
                                  alt={loan.title}
                                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2 }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0) 20%)', zIndex: 3, pointerEvents: 'none' }} />
                           </div>
                          <div>
                             <h5 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>{loan.title}</h5>
                             <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                <span><Calendar size={12} /> Issued: {loan.issued}</span>
                                <span><Clock size={12} /> Due: {loan.due}</span>
                             </div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <span style={{ 
                           padding: '6px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900,
                           backgroundColor: loan.status === 'On Track' ? '#ecfdf5' : (loan.status === 'Due Soon' ? '#fffbeb' : '#fef2f2'),
                           color: loan.status === 'On Track' ? '#10b981' : (loan.status === 'Due Soon' ? '#d97706' : '#ef4444')
                         }}>
                            {loan.status.toUpperCase()}
                         </span>
                         <button onClick={() => handleRenew(loan.id, loan.title)} className="btn" style={{ padding: '6px 12px', fontSize: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>Renew</button>
                         <button onClick={() => handleReturn(loan.id, loan.title)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', borderRadius: '8px', fontWeight: 800 }}>Return</button>
                       </div>
                    </motion.div>
                 ))}
                 {loans.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                      No active loans.
                    </div>
                 )}
              </div>
            </div>

            {/* Role-Specific Credentials Ledger */}
            <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <ShieldCheck size={24} style={{ color: roleConfig.themeColor }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>Credentials & Logistics</h3>
               </div>
               
               {member.role === 'Student' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ACADEMIC RATING</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Grade A (Distinction)</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ATTENDANCE RATE</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>96.4% On Track</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>CLASS TEACHER</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Eleanor Pena</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>FINANCIAL OUTSTANDING</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ef4444' }}>$450.00 Outstanding</p>
                     </div>
                  </div>
               )}

               {member.role === 'Teacher' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>LECTURE TIME</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>18 Hours / Week</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>FACULTY RANK</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#8B5CF6' }}>Senior Professor</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ASSIGNED WORKLOAD</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Calculus & Logic</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>LAB ACCESS CODE</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace' }}>ADMIN-MATH-2026</p>
                     </div>
                  </div>
               )}

               {member.role === 'Staff' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>SHIFT TIMING</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>09:00 AM - 05:00 PM</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>CLEARANCE LEVEL</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#F59E0B' }}>Level-3 (High)</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>SUPERVISOR</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Administration Head</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>OFFICE LOCATION</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Admin Wing-B</p>
                     </div>
                  </div>
               )}

               {member.role === 'Guardian' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>WARD ACCOUNT</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Devon Lane (10A)</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>FAMILY WALLET</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>$250.00 Active</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>PARENT NOTIFICATION</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#EC4899' }}>SMS & Email (OK)</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>PTA REGISTERED</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Yes (Voter Class)</p>
                     </div>
                  </div>
               )}

               {(member.role === 'Driver' || member.role.includes('Driver') || member.role.includes('Transport')) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ASSIGNED VEHICLE</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Bus 05 (Express)</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>SAFETY INDEX</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#14B8A6' }}>4.9 Safety Index</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>LICENSE PRIVILEGE</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>CDL Class-A (Valid)</p>
                     </div>
                     <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ROUTE COVERAGE</p>
                        <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>South Connect Route</p>
                     </div>
                  </div>
               )}
            </div>

            <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                 <History size={24} color="var(--primary)" />
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Recent Activity</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                 {[
                   { action: 'Returned "Advanced Potion-Making"', date: '2 hours ago', icon: <History size={14} /> },
                   { action: 'Renewed "Introduction to Algorithms"', date: 'Yesterday', icon: <Clock size={14} /> },
                   { action: 'Reserved "Fantastic Beasts"', date: '2 days ago', icon: <AlertCircle size={14} /> }
                 ].map((activity, i) => (
                   <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{activity.icon}</div>
                      <div>
                         <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{activity.action}</p>
                         <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.date}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryMemberDetails;
