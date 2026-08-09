import React, { useState, useEffect } from 'react';
import { 
  Send, Calendar, Clock, FileText, User, Plus, AlertCircle, 
  X, Save, CheckCircle2, Check, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_AVATARS = {
  'Sunita Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma',
  'Amit Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Sharma',
  'Anil Gupta': 'https://api.dicebear.com/7.x/initials/svg?seed=Anil%20Gupta',
  'You (Admin)': 'https://api.dicebear.com/7.x/initials/svg?seed=Aarav%20Sharma',
  'Default': 'https://api.dicebear.com/7.x/initials/svg?seed=Default'
};

const SEED_REQUESTS = [
  { id: 1, type: 'Sick Leave', applicant: 'Sunita Sharma', from: '2026-05-15', to: '2026-05-16', days: 2, status: 'Pending', reason: 'Fever and medical checkup.', avatar: PRESET_AVATARS['Sunita Sharma'] },
  { id: 2, type: 'Casual Leave', applicant: 'Amit Sharma', from: '2026-05-20', to: '2026-05-20', days: 1, status: 'Pending', reason: 'Family function.', avatar: PRESET_AVATARS['Amit Sharma'] },
  { id: 3, type: 'Personal', applicant: 'Anil Gupta', from: '2026-05-25', to: '2026-05-27', days: 3, status: 'Pending', reason: 'Personal urgent administrative reasons.', avatar: PRESET_AVATARS['Anil Gupta'] },
];

const SEED_BALANCES = [
  { label: 'Sick Leave', total: 12, used: 2, color: '#ef4444' },
  { label: 'Casual Leave', total: 10, used: 4, color: '#f59e0b' },
  { label: 'Personal', total: 5, used: 0, color: '#10b981' }
];

const LeaveRequest = () => {
  // Requests state
  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('leave_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(req => {
          if (!req.avatar) {
            return { ...req, avatar: PRESET_AVATARS[req.applicant] || PRESET_AVATARS['Default'] };
          }
          return req;
        });
      }
    } catch (e) {}
    return SEED_REQUESTS;
  });

  // Employee Leave Balances state
  const [balances, setBalances] = useState(() => {
    try {
      const saved = localStorage.getItem('leave_balances');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SEED_BALANCES;
  });

  const [toast, setToast] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Form inputs
  const [form, setForm] = useState({
    type: 'Sick Leave',
    from: '',
    to: '',
    reason: ''
  });

  // Persists
  const persistRequests = (updated) => {
    setRequests(updated);
    localStorage.setItem('leave_requests', JSON.stringify(updated));
  };

  const persistBalances = (updated) => {
    setBalances(updated);
    localStorage.setItem('leave_balances', JSON.stringify(updated));
  };

  // Toast notifications
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Automated date days calculation
  const calculateDays = (fromStr, toStr) => {
    if (!fromStr || !toStr) return 0;
    const start = new Date(fromStr);
    const end = new Date(toStr);
    if (end < start) return 0;
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const currentCalculatedDays = calculateDays(form.from, form.to);

  // Submit Leave Request
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    const days = calculateDays(form.from, form.to);
    if (days <= 0) {
      showToast('error', 'End Date must be after or equal to Start Date.');
      return;
    }

    const newRequest = {
      id: Date.now(),
      applicant: 'You (Admin)',
      type: form.type,
      from: form.from,
      to: form.to,
      days: days,
      status: 'Pending',
      reason: form.reason.trim(),
      avatar: PRESET_AVATARS['You (Admin)']
    };

    const updated = [newRequest, ...requests];
    persistRequests(updated);
    showToast('success', 'Leave application submitted successfully.');
    setShowFormModal(false);
    setForm({ type: 'Sick Leave', from: '', to: '', reason: '' });
  };

  // Approve leave request handler
  const handleApprove = (reqId) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    // update state status
    const updatedRequests = requests.map(r => r.id === reqId ? { ...r, status: 'Approved' } : r);
    persistRequests(updatedRequests);

    // deduct from balance only if applicant is 'You (Admin)'
    if (req.applicant === 'You (Admin)') {
      const updatedBalances = balances.map(b => {
        if (b.label === req.type) {
          const nextUsed = Math.min(b.total, b.used + req.days);
          return { ...b, used: nextUsed };
        }
        return b;
      });
      persistBalances(updatedBalances);
    }

    // Push to approved_leaves in local storage
    try {
      const savedApproved = localStorage.getItem('approved_leaves');
      const approvedList = savedApproved ? JSON.parse(savedApproved) : [];
      if (!approvedList.some(item => item.id === reqId)) {
        const approvedAvatar = req.avatar || PRESET_AVATARS[req.applicant] || PRESET_AVATARS['Default'];
        const newApprovedItem = {
          id: req.id,
          applicant: req.applicant,
          type: req.type,
          from: req.from,
          to: req.to,
          approvedBy: 'You (Admin)',
          date: new Date().toISOString().split('T')[0],
          auditCode: `SECURE-AUTH-${req.applicant.split(' ').pop().toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
          avatar: approvedAvatar
        };
        localStorage.setItem('approved_leaves', JSON.stringify([newApprovedItem, ...approvedList]));
      }
    } catch (e) {}

    showToast('success', `Approved leave request for ${req.applicant}.`);
  };

  // Reject leave request handler
  const handleReject = (reqId) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    const updatedRequests = requests.map(r => r.id === reqId ? { ...r, status: 'Rejected' } : r);
    persistRequests(updatedRequests);
    showToast('error', `Rejected leave request for ${req.applicant}.`);
  };

  const statusStyles = {
    'Pending': { text: 'PENDING REVIEW', bg: '#fffbeb', color: '#d97706', border: '1px solid #d9770630' },
    'Approved': { text: 'APPROVED', bg: '#ecfdf5', color: '#10b981', border: '1px solid #10b98130' },
    'Rejected': { text: 'REJECTED', bg: '#fef2f2', color: '#ef4444', border: '1px solid #ef444430' }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Toast Notifications */}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Leave Requests</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Submit and track applications for absence from institutional duties.</p>
        </div>
        <button 
          onClick={() => setShowFormModal(true)} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 800 }}
        >
          <Plus size={20} /> New Application
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Side: Incoming leave applications list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Applications Register</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {requests.length === 0 ? (
                   <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                     No leave applications registered.
                   </div>
                 ) : (
                   requests.map((req, idx) => {
                     const currentStyle = statusStyles[req.status] || statusStyles['Pending'];
                     return (
                       <motion.div 
                         key={req.id}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: idx * 0.05 }}
                         style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}
                       >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  borderRadius: '50%', 
                                  overflow: 'hidden', 
                                  border: '2px solid var(--border-color)', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  backgroundColor: 'var(--primary-light)'
                                }}>
                                  {req.avatar ? (
                                    <img 
                                      src={req.avatar} 
                                      alt={req.applicant} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                      onError={(e) => { 
                                        e.target.style.display = 'none'; 
                                        const fb = e.target.nextSibling;
                                        if (fb) fb.style.display = 'flex'; 
                                      }}
                                    />
                                  ) : null}
                                  <span style={{ 
                                    display: req.avatar ? 'none' : 'flex', 
                                    width: '100%', 
                                    height: '100%', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontWeight: 900, 
                                    color: 'var(--primary)',
                                    fontSize: '0.9rem'
                                  }}>
                                    {req.applicant.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                   <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{req.applicant}</p>
                                   <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>{req.type}</p>
                                </div>
                             </div>
                             <span style={{ 
                               padding: '6px 14px', 
                               backgroundColor: currentStyle.bg, 
                               color: currentStyle.color, 
                               borderRadius: '30px', 
                               fontSize: '0.75rem', 
                               fontWeight: 900,
                               border: currentStyle.border
                             }}>{currentStyle.text}</span>
                          </div>

                          <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                            <strong>Reason:</strong> {req.reason}
                          </p>

                          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Calendar size={14} /> <span>From: {req.from} To: {req.to}</span>
                             </div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Clock size={14} /> <span>{req.days} Days Requested</span>
                             </div>
                          </div>

                          {/* Render action buttons only if request is Pending */}
                          {req.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                               <button 
                                 onClick={() => handleApprove(req.id)}
                                 className="btn btn-primary" 
                                 style={{ flex: 1, padding: '10px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}
                               >
                                 Approve Request
                               </button>
                               <button 
                                 onClick={() => handleReject(req.id)}
                                 className="btn" 
                                 style={{ flex: 1, padding: '10px', fontSize: '0.85rem', fontWeight: 800, backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: 'none', cursor: 'pointer' }}
                               >
                                 Reject
                               </button>
                            </div>
                          )}
                       </motion.div>
                     );
                   })
                 )}
              </div>
           </div>
        </div>

        {/* Right Side: Active balance displays */}
        <div>
           <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', backgroundColor: 'var(--primary-light)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                 <AlertCircle size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
                 <h3 style={{ fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>Your Leave Balance</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Remaining paid leaves for the current academic session.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {balances.map((item, i) => {
                   const remaining = item.total - item.used;
                   const percent = Math.min(100, Math.max(0, (item.used / item.total) * 100));
                   return (
                     <div key={i} style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                           <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{item.label}</span>
                           <span style={{ fontWeight: 900, color: item.color }}>{remaining} Left</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-body)', borderRadius: '3px', overflow: 'hidden' }}>
                           <div style={{ width: `${percent}%`, height: '100%', backgroundColor: item.color, transition: '0.5s ease-out' }}></div>
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>
      </div>

      {/* NEW APPLICATION MODAL POPUP */}
      <AnimatePresence>
        {showFormModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>File Absence Request</h2>
                <button onClick={() => setShowFormModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Leave Classification Type *</label>
                  <select 
                    value={form.type} 
                    onChange={e => setForm({...form, type: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>From Date *</label>
                    <input 
                      type="date" 
                      required 
                      value={form.from} 
                      onChange={e => setForm({...form, from: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>To Date *</label>
                    <input 
                      type="date" 
                      required 
                      value={form.to} 
                      onChange={e => setForm({...form, to: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                    />
                  </div>
                </div>

                {/* Duration display panel */}
                {currentCalculatedDays > 0 && (
                  <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> Calculated Request Duration: {currentCalculatedDays} {currentCalculatedDays === 1 ? 'Day' : 'Days'}
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Absence Reason *</label>
                  <textarea 
                    required 
                    value={form.reason} 
                    onChange={e => setForm({...form, reason: e.target.value})} 
                    rows="3"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', resize: 'none', lineHeight: 1.4, fontFamily: 'inherit' }} 
                    placeholder="Briefly state the reason for absence..." 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowFormModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Send size={16} /> Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveRequest;
