import React, { useState, useMemo } from 'react';
import { 
  UserCheck, Calendar, Search, Filter, Download, MoreVertical, 
  CheckCircle2, X, AlertCircle, FileText, Trash2, Shield 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import devonAvatar from '../assets/devon_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';
import elenaAvatar from '../assets/elena_avatar.png';
import marcusAvatar from '../assets/marcus_avatar.png';
import sophiaAvatar from '../assets/sophia_avatar.png';
import studentAvatar from '../assets/student_avatar.png';

const PRESET_APPROVED_AVATARS = {
  'Prof. Eleanor Pena': eleanorAvatar,
  'Ms. Nina Patel': ninaPatelAvatar,
  'Mr. Marcus Johnson': marcusAvatar,
  'Dr. Robert Brown': robertAvatar,
  'Default': studentAvatar
};

const SEED_APPROVED_LEAVES = [
  { id: 1, applicant: 'Prof. Albus Dumbledore', type: 'Sabbatical', from: '2026-06-01', to: '2026-08-30', approvedBy: 'Board of Governors', date: '2026-05-01', auditCode: 'SECURE-AUTH-DUMB-001', avatar: PRESET_APPROVED_AVATARS['Prof. Albus Dumbledore'] },
  { id: 2, applicant: 'Ms. Minerva McGonagall', type: 'Casual Leave', from: '2026-05-10', to: '2026-05-12', approvedBy: 'Principal', date: '2026-05-05', auditCode: 'SECURE-AUTH-MIN-982', avatar: PRESET_APPROVED_AVATARS['Ms. Minerva McGonagall'] },
  { id: 3, applicant: 'Mr. Severus Snape', type: 'Sick Leave', from: '2026-05-08', to: '2026-05-08', approvedBy: 'Vice Principal', date: '2026-05-07', auditCode: 'SECURE-AUTH-SEV-501', avatar: PRESET_APPROVED_AVATARS['Mr. Severus Snape'] },
  { id: 4, applicant: 'Dr. Gregory House', type: 'Medical Leave', from: '2026-05-15', to: '2026-05-20', approvedBy: 'Medical Board', date: '2026-05-09', auditCode: 'SECURE-AUTH-HOU-442', avatar: PRESET_APPROVED_AVATARS['Dr. Gregory House'] },
];

const LeaveApproved = () => {
  // Approved leaves state
  const [approvedList, setApprovedList] = useState(() => {
    try {
      const saved = localStorage.getItem('approved_leaves');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(item => {
          if (!item.avatar) {
            return { ...item, avatar: PRESET_APPROVED_AVATARS[item.applicant] || PRESET_APPROVED_AVATARS['Default'] };
          }
          return item;
        });
      }
    } catch(e) {}
    return SEED_APPROVED_LEAVES;
  });

  const persist = (updated) => {
    setApprovedList(updated);
    localStorage.setItem('approved_leaves', JSON.stringify(updated));
  };

  // UI state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [toast, setToast] = useState(null);

  // Modals & action sheet states
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showAuditDetails, setShowAuditDetails] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Toast notifier
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Live filter & search logic
  const filteredList = useMemo(() => {
    return approvedList.filter(item => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.applicant.toLowerCase().includes(query) ||
        item.approvedBy.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);

      const matchesType = 
        filterType === 'All' || 
        item.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [approvedList, searchQuery, filterType]);

  // Extract CSV files directly
  const handleExportCSV = () => {
    if (approvedList.length === 0) {
      showToast('error', 'No sanctioned records available to export.');
      return;
    }

    const headers = 'Applicant,Leave Type,From Date,To Date,Sanctioned By,Sanction Date,Security Hash\n';
    const rows = approvedList.map(a => 
      `"${a.applicant}","${a.type}","${a.from}","${a.to}","${a.approvedBy}","${a.date}","${a.auditCode || 'N/A'}"`
    ).join('\n');
    const csvContent = headers + rows;
    
    // Download triggers
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sanctioned_leaves_archive_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('success', 'Compliance records exported successfully in CSV format.');
  };

  // Revocation handler
  const handleRevokeLeave = (id) => {
    setDeleteConfirmId(id);
    setShowActionsMenu(null);
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Toast Component */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed', bottom: '36px', right: '36px', zIndex: 9999,
              backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444', color: 'white',
              padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
              boxShadow: '0 10px 30px -5px rgba(0,0,0,0.25)', fontWeight: 700, fontSize: '0.9rem'
            }}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Approved Leaves</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Historical record of all sanctioned leave applications across the institution.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 800 }}
        >
          <Download size={20} /> Export Records
        </button>
      </div>

      {/* Main Grid View */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        {/* Search & filters panel */}
        <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
           <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                placeholder="Search approved applications by name, type, or sanction authority..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', color: 'var(--text-main)', fontWeight: 600 }}
              />
           </div>
           
           <select 
             value={filterType}
             onChange={(e) => setFilterType(e.target.value)}
             style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 800, cursor: 'pointer' }}
           >
             <option value="All">All Classifications</option>
             <option value="Sabbatical">Sabbatical</option>
             <option value="Casual Leave">Casual Leave</option>
             <option value="Sick Leave">Sick Leave</option>
             <option value="Medical Leave">Medical Leave</option>
           </select>
        </div>

        {/* Sanctions Table */}
        <div style={{ overflowX: 'auto' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                 <tr style={{ backgroundColor: 'var(--bg-body)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applicant</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sanctioned By</th>
                    <th style={{ padding: '20px 24px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '20px 24px' }}></th>
                 </tr>
              </thead>
              <tbody>
                 {filteredList.length === 0 ? (
                   <tr>
                     <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                       No sanctioned leave records found matching your active queries.
                     </td>
                   </tr>
                 ) : (
                   filteredList.map((item) => (
                     <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ 
                                width: '36px', 
                                height: '36px', 
                                borderRadius: '50%', 
                                overflow: 'hidden', 
                                border: '2px solid var(--border-color)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                backgroundColor: 'var(--primary-light)'
                              }}>
                                {item.avatar ? (
                                  <img 
                                    src={item.avatar} 
                                    alt={item.applicant} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={(e) => { 
                                      e.target.style.display = 'none'; 
                                      const fb = e.target.nextSibling;
                                      if (fb) fb.style.display = 'flex'; 
                                    }}
                                  />
                                ) : null}
                                <span style={{ 
                                  display: item.avatar ? 'none' : 'flex', 
                                  width: '100%', 
                                  height: '100%', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  fontWeight: 900, 
                                  color: 'var(--primary)',
                                  fontSize: '0.8rem'
                                }}>
                                  {item.applicant.charAt(0)}
                                </span>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.applicant}</span>
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>{item.type}</td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.from} to {item.to}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sanction Date: {item.date}</span>
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.approvedBy}</td>
                        <td style={{ padding: '20px 24px' }}>
                           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 900, fontSize: '0.75rem', padding: '6px 14px', borderRadius: '30px', backgroundColor: '#ecfdf5', border: '1px solid #10b98125' }}>
                              <CheckCircle2 size={14} /> APPROVED
                           </div>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                           <button onClick={() => setShowActionsMenu(item)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                        </td>
                     </tr>
                   ))
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* QUICK OPERATIONS BOTTOM SHEET DRAWER */}
      <AnimatePresence>
        {showActionsMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowActionsMenu(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              style={{ width: '100%', maxWidth: '360px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 10, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)' }}>Sanction Operations</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Archived log of {showActionsMenu.applicant}</p>
                </div>
                <button onClick={() => setShowActionsMenu(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '4px 0' }} />

              <button 
                onClick={() => {
                  setShowAuditDetails(showActionsMenu);
                  setShowActionsMenu(null);
                }} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <FileText size={18} style={{ color: 'var(--primary)' }} /> View Sanction Audit details
              </button>

              <button 
                onClick={() => handleRevokeLeave(showActionsMenu.id)} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ef444420', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
              >
                <Trash2 size={18} /> Revoke Leave Sanction
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIGNIFIED AUDIT DETAILS POPUP (ELECTRONIC CERTIFICATE STYLE) */}
      <AnimatePresence>
        {showAuditDetails && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowAuditDetails(null)} />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '540px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '2px solid var(--border-color)' }}
            >
              {/* Certificate Border Header */}
              <div style={{ padding: '36px 36px 24px 36px', textAlign: 'center', backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <button onClick={() => setShowAuditDetails(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Shield size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, letterSpacing: '0.5px', color: 'var(--text-main)' }}>ABSENCE SANCTION ORDER</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Hogwarts School compliance records</p>
              </div>

              {/* Certificate Details */}
              <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Sanctioned Applicant</span>
                    <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>{showAuditDetails.applicant}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Classification</span>
                    <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)' }}>{showAuditDetails.type}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Absence Range</span>
                    <strong style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{showAuditDetails.from} to {showAuditDetails.to}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Sanction Authority</span>
                    <strong style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{showAuditDetails.approvedBy}</strong>
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px dashed var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Security SHA-Hash Audit code</span>
                  <code style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.5px' }}>
                    {showAuditDetails.auditCode || `SECURE-AUTH-${showAuditDetails.applicant.split(' ')[1]?.substring(0,3).toUpperCase() || 'SYS'}-${Date.now().toString().substring(8,12)}`}
                  </code>
                </div>

                {/* Simulated signature blocks */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: 0, fontFamily: 'cursive', fontSize: '1.1rem', color: 'var(--primary)', opacity: 0.85 }}>{showAuditDetails.approvedBy.split(' ')[0] || 'Sanctioner'}</p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', borderTop: '1px solid var(--border-color)', padding: '4px 8px 0 0', display: 'inline-block', marginTop: '4px' }}>Sanction signature</span>
                  </div>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #10b98130', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', transform: 'rotate(-12deg)' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 950, letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>INSTITUTIONAL<br />SEAL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRM DELETE DIALOG */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setDeleteConfirmId(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center', border: '1px solid var(--border-color)', zIndex: 10 }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Revoke Leave Sanction</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to revoke this approved leave sanction? This will cancel their absence authorization record.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    const target = approvedList.find(a => a.id === deleteConfirmId);
                    if (target) {
                      const updated = approvedList.filter(a => a.id !== deleteConfirmId);
                      persist(updated);
                      showToast('success', `Sanctioned leave record for ${target.applicant} has been revoked.`);
                    }
                    setDeleteConfirmId(null);
                  }} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  Revoke Leave
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveApproved;
