import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Phone, MapPin, Search, Filter, Plus, ShieldCheck, Mail, Star, 
  MoreVertical, Award, Calendar, ExternalLink, MessageSquare, X, Save, 
  CheckCircle2, AlertCircle, Edit, Trash2, Send, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DriversApi } from '../services/service';

const SEED_DRIVERS = [
  { 
    id: 1, 
    name: 'Rajesh Verma', 
    license: 'DL-2024-5501', 
    experience: '12 Years', 
    rating: 4.8, 
    status: 'Active', 
    phone: '+91 98765 43210', 
    email: 'r.verma@edupro.com', 
    assignment: 'North Express',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
    certifications: { cdl: true, medical: true, background: true, defensive: true },
    metrics: { completedTrips: 1250, onTimeRate: '98.5%', satisfaction: '4.8', incidentLog: [] }
  },
  { 
    id: 2, 
    name: 'Vikram Malhotra', 
    license: 'DL-2023-9982', 
    experience: '8 Years', 
    rating: 4.5, 
    status: 'Active', 
    phone: '+91 98765 43211', 
    email: 'v.malhotra@edupro.com', 
    assignment: 'Downtown Shuttle',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Malhotra',
    certifications: { cdl: true, medical: true, background: true, defensive: true },
    metrics: { completedTrips: 840, onTimeRate: '96.2%', satisfaction: '4.6', incidentLog: [] }
  },
  { 
    id: 3, 
    name: 'Suman Sharma', 
    license: 'DL-2025-1104', 
    experience: '15 Years', 
    rating: 5.0, 
    status: 'On Leave', 
    phone: '+91 98765 43212', 
    email: 's.sharma@edupro.com', 
    assignment: 'Staff Loop',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Suman%20Sharma',
    certifications: { cdl: true, medical: true, background: true, defensive: true },
    metrics: { completedTrips: 1890, onTimeRate: '99.8%', satisfaction: '5.0', incidentLog: [] }
  },
  { 
    id: 4, 
    name: 'Manoj Kumar', 
    license: 'DL-2022-4433', 
    experience: '6 Years', 
    rating: 4.2, 
    status: 'Active', 
    phone: '+91 98765 43213', 
    email: 'm.kumar@edupro.com', 
    assignment: 'Residency Express',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Manoj%20Kumar',
    certifications: { cdl: true, medical: true, background: true, defensive: false },
    metrics: { completedTrips: 520, onTimeRate: '94.8%', satisfaction: '4.3', incidentLog: [{ date: '2026-04-12', detail: 'Minor mirror scrape at gate entry.' }] }
  },
  { 
    id: 5, 
    name: 'Jaspreet Singh', 
    license: 'DL-007-GOLD', 
    experience: '20 Years', 
    rating: 4.9, 
    status: 'Active', 
    phone: '+91 98765 43214', 
    email: 'j.singh@edupro.com', 
    assignment: 'South Connect',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jaspreet%20Singh',
    certifications: { cdl: true, medical: true, background: true, defensive: true },
    metrics: { completedTrips: 2450, onTimeRate: '99.1%', satisfaction: '4.9', incidentLog: [] }
  },
];

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
  'https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Malhotra',
  'https://api.dicebear.com/7.x/initials/svg?seed=Suman%20Sharma',
  'https://api.dicebear.com/7.x/initials/svg?seed=Manoj%20Kumar',
  'https://api.dicebear.com/7.x/initials/svg?seed=Jaspreet%20Singh'
];

const TransportDrivers = () => {
  // State variables
  const [drivers, setDrivers] = useState(() => {
    try {
      const saved = localStorage.getItem('transport_drivers_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(d => {
            if (!d.avatar) {
              const seed = SEED_DRIVERS.find(s => s.id === d.id || s.name === d.name);
              return { ...d, avatar: seed ? seed.avatar : PRESET_AVATARS[0] };
            }
            return d;
          });
        }
      }
    } catch (e) {}
    return SEED_DRIVERS;
  });
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toast, setToast] = useState(null);
  
  // Modals & overlay states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showCertsModal, setShowCertsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [showChatDrawer, setShowChatDrawer] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form values state
  const [form, setForm] = useState({
    name: '',
    license: '',
    experience: '',
    rating: 5.0,
    status: 'Active',
    phone: '',
    email: '',
    assignment: '',
    avatar: PRESET_AVATARS[0]
  });

  // Chat interface state
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('driver_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      1: [
        { sender: 'driver', text: 'Good morning! Performing pre-trip check on Bus 01.', time: '07:30 AM' },
        { sender: 'admin', text: 'Excellent. Stay safe on the North Express route today.', time: '07:32 AM' }
      ],
      2: [
        { sender: 'driver', text: 'Stuck in moderate traffic near East Campus entrance.', time: '08:15 AM' },
        { sender: 'admin', text: 'Understood. Please keep speed within 40km/h and monitor telemetry.', time: '08:16 AM' }
      ],
      3: [
        { sender: 'driver', text: 'Hello, I am on scheduled leave this week. My replacement James Bond is ready.', time: 'Yesterday' },
        { sender: 'admin', text: 'Got it Sarah. Rest well!', time: 'Yesterday' }
      ],
      4: [
        { sender: 'driver', text: 'Completed the Residency Express student morning shift.', time: '08:45 AM' },
        { sender: 'admin', text: 'Good job Michael. Remember to update the student passenger count.', time: '08:47 AM' }
      ],
      5: [
        { sender: 'driver', text: 'All systems green for South Connect. Ready to depart.', time: '07:15 AM' },
        { sender: 'admin', text: 'Copy that, double-O-seven. Safe travels.', time: '07:16 AM' }
      ]
    };
  });

  // Fetch drivers from backend on mount
  useEffect(() => {
    setLoading(true);
    DriversApi.getAll()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map(d => ({
            ...d,
            certifications: d.certifications || { cdl: true, medical: true, background: true, defensive: true },
            metrics: d.metrics || { completedTrips: 0, onTimeRate: '100%', satisfaction: String(d.rating || 5), incidentLog: [] }
          }));
          setDrivers(enriched);
          localStorage.setItem('transport_drivers_v2', JSON.stringify(enriched));
        }
      })
      .catch(() => { /* keep localStorage fallback already in state */ })
      .finally(() => setLoading(false));
  }, []);

  // Persist drivers helper (local cache only)
  const persist = (updated) => {
    setDrivers(updated);
    localStorage.setItem('transport_drivers_v2', JSON.stringify(updated));
  };

  // Toast notifier
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChatDrawer, isTyping]);

  // Form submit handler (Add or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.license || !form.phone || !form.email || !form.assignment) {
      showToast('error', 'Please fill all required fields.');
      return;
    }

    const payload = { ...form, rating: parseFloat(form.rating) || 5.0 };

    if (editingDriver) {
      // Optimistic update
      const updatedDrivers = drivers.map(d => d.id === editingDriver.id ? { ...d, ...payload } : d);
      persist(updatedDrivers);
      showToast('success', `${form.name}'s profile updated successfully.`);
      // Sync to database
      DriversApi.update(editingDriver.id, payload).catch(() =>
        showToast('error', 'Failed to sync update to database.')
      );
    } else {
      const newDriver = {
        id: Date.now(),
        ...payload,
        certifications: { cdl: true, medical: true, background: true, defensive: true },
        metrics: { completedTrips: 0, onTimeRate: '100%', satisfaction: '5.0', incidentLog: [] }
      };
      const updatedDrivers = [...drivers, newDriver];
      persist(updatedDrivers);
      showToast('success', `New driver ${form.name} registered successfully.`);
      // Sync to database
      DriversApi.create({ ...payload, id: undefined }).catch(() =>
        showToast('error', 'Failed to sync new driver to database.')
      );
    }

    setShowFormModal(false);
  };

  // Open modal helper
  const handleOpenForm = (driver = null) => {
    if (driver) {
      setEditingDriver(driver);
      setForm({
        name: driver.name,
        license: driver.license,
        experience: driver.experience,
        rating: driver.rating,
        status: driver.status,
        phone: driver.phone,
        email: driver.email,
        assignment: driver.assignment,
        avatar: driver.avatar || PRESET_AVATARS[0]
      });
    } else {
      setEditingDriver(null);
      setForm({
        name: '',
        license: '',
        experience: '',
        rating: 5.0,
        status: 'Active',
        phone: '',
        email: '',
        assignment: '',
        avatar: PRESET_AVATARS[0]
      });
    }
    setShowFormModal(true);
  };

  // Delete driver handler (confirm then sync to DB)
  const handleDeleteDriver = async (driverId) => {
    const updatedDrivers = drivers.filter(d => d.id !== driverId);
    persist(updatedDrivers);
    setDeleteConfirmId(null);
    setShowActionsMenu(null);
    showToast('success', 'Driver record removed successfully.');
    DriversApi.delete(driverId).catch(() =>
      showToast('error', 'Failed to sync deletion to database.')
    );
  };

  // Toggle duty status
  const handleToggleStatus = (driver) => {
    const nextStatus = driver.status === 'Active' ? 'On Leave' : 'Active';
    const updated = drivers.map(d => d.id === driver.id ? { ...d, status: nextStatus } : d);
    persist(updated);
    showToast('success', `${driver.name}'s status updated to ${nextStatus}.`);
    setShowActionsMenu(null);
    // Sync to database
    DriversApi.update(driver.id, { ...driver, status: nextStatus }).catch(() =>
      showToast('error', 'Failed to sync status to database.')
    );
  };

  // Toggle Certification Checklist item
  const handleToggleCert = (driverId, certKey) => {
    const updated = drivers.map(d => {
      if (d.id === driverId) {
        const certs = d.certifications || { cdl: true, medical: true, background: true, defensive: true };
        return {
          ...d,
          certifications: {
            ...certs,
            [certKey]: !certs[certKey]
          }
        };
      }
      return d;
    });
    persist(updated);
    showToast('success', `Certification verification state updated.`);
  };

  // Simulated Live Chat message submit
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !showChatDrawer) return;

    const driverId = showChatDrawer.id;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'admin', text: chatInput, time: timeNow };
    
    const updatedChats = {
      ...chatMessages,
      [driverId]: [...(chatMessages[driverId] || []), userMsg]
    };
    
    setChatMessages(updatedChats);
    localStorage.setItem('driver_chat_messages', JSON.stringify(updatedChats));
    setChatInput('');
    setIsTyping(true);

    // Dynamic, realistic AI response simulator
    setTimeout(() => {
      let replyText = "Copy that. Safely driving and maintaining route guidelines.";
      if (showChatDrawer.status === 'On Leave') {
        replyText = `Hi there! I am currently on leave. For any immediate routes, please contact the secondary dispatch crew.`;
      } else {
        switch(showChatDrawer.assignment) {
          case 'North Express':
            replyText = "North Express update: Currently passing Sector 12. Traffic is moving fine. All students are seated safely.";
            break;
          case 'Downtown Shuttle':
            replyText = "Downtown Shuttle is on the return loop now. On track for an on-time arrival.";
            break;
          case 'Residency Express':
            replyText = "Residency Express here. We are delayed by roughly 5 minutes near the main bridge due to light work, but safe.";
            break;
          case 'South Connect':
            replyText = "South Connect completed. Vehicle parked, locks done. Awaiting new dispatch manifest.";
            break;
          case 'Staff Loop':
            replyText = "Loop run is complete. Preparing for the evening staff transit runs.";
            break;
          default:
            replyText = `Hello! I'm currently driving on the assigned route: ${showChatDrawer.assignment}. Systems are normal.`;
        }
      }
      
      const driverMsg = { 
        sender: 'driver', 
        text: replyText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      setChatMessages(prev => {
        const next = {
          ...prev,
          [driverId]: [...(prev[driverId] || []), driverMsg]
        };
        localStorage.setItem('driver_chat_messages', JSON.stringify(next));
        return next;
      });
      setIsTyping(false);
    }, 1500);
  };

  // Filter & Search Logic
  const filteredDrivers = drivers.filter(d => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      d.name.toLowerCase().includes(query) || 
      d.assignment.toLowerCase().includes(query) ||
      d.license.toLowerCase().includes(query) ||
      d.phone.includes(query);
      
    const matchesFilter = 
      filterStatus === 'All' || 
      d.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      {/* Toast Notification Component */}
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
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Transport Faculty Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive database of certified institutional drivers, safety records, and assignment metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => setShowCertsModal(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 800 }}>
              <Award size={20} /> Certification Log
           </button>
           <button onClick={() => handleOpenForm()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 800 }}>
              <Plus size={20} /> Register Driver
           </button>
        </div>
      </div>

      {/* Search & Filter Component */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search drivers by name, assignment, license..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {/* Drivers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {filteredDrivers.map((driver, idx) => (
          <motion.div 
            key={driver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card"
            style={{ padding: '28px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'visible' }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)', borderColor: 'var(--primary)' }}
          >
            {/* Status Badge */}
            <div style={{ 
              position: 'absolute', top: '28px', right: '60px',
              padding: '6px 14px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900,
              backgroundColor: driver.status === 'Active' ? '#ecfdf5' : '#fef2f2',
              color: driver.status === 'Active' ? '#10b981' : '#ef4444',
              border: `1px solid ${driver.status === 'Active' ? '#10b98130' : '#ef444430'}`
            }}>
               {driver.status.toUpperCase()}
            </div>

            {/* Context Options Button */}
            <button 
              onClick={() => setShowActionsMenu(driver)}
              className="icon-btn" 
              style={{ position: 'absolute', top: '22px', right: '16px', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              <MoreVertical size={20} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Driver Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
               <div style={{ width: '70px', height: '70px', borderRadius: '20px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 950, overflow: 'hidden', boxShadow: '0 10px 20px -5px var(--primary)' }}>
                  {driver.avatar ? (
                     <img 
                        src={driver.avatar} 
                        alt={driver.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                  ) : (
                     driver.name.charAt(0)
                  )}
               </div>
               <div>
                  <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: 'var(--text-main)' }}>{driver.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 800, marginTop: '4px' }}>
                     <Star size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} /> {driver.rating} SAFETY RATING
                  </div>
               </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
               <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Experience</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>{driver.experience}</p>
               </div>
               <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>License</p>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900 }}>{driver.license}</p>
               </div>
            </div>

            {/* Assignment & Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                  <MapPin size={16} className="text-muted" />
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Assigned Route:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{driver.assignment}</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                  <Phone size={16} className="text-muted" />
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Direct Contact:</span>
                  <span style={{ fontWeight: 800 }}>{driver.phone}</span>
               </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
               <button 
                  onClick={() => setShowChatDrawer(driver)}
                  className="btn" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', cursor: 'pointer' }}
               >
                  <MessageSquare size={16} /> Chat
               </button>
               <button 
                  onClick={() => setShowHistoryModal(driver)}
                  className="btn" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 800, padding: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', cursor: 'pointer' }}
               >
                  <ExternalLink size={16} /> History
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* REGISTER / EDIT DRIVER MODAL */}
      <AnimatePresence>
        {showFormModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>
                  {editingDriver ? 'Edit Driver Profile' : 'Register New Driver'}
                </h2>
                <button onClick={() => setShowFormModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <form onSubmit={handleFormSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Driver Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                    placeholder="e.g. Rajesh Verma" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>License Number *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.license} 
                      onChange={e => setForm({...form, license: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. DL-2024-5501" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Experience (Years)</label>
                    <input 
                      type="text" 
                      value={form.experience} 
                      onChange={e => setForm({...form, experience: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. 10 Years" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct Contact Phone *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.phone} 
                      onChange={e => setForm({...form, phone: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. +1 234 567 8901" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. w.robert@edupro.com" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Route *</label>
                    <input 
                      type="text" 
                      required 
                      value={form.assignment} 
                      onChange={e => setForm({...form, assignment: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} 
                      placeholder="e.g. North Express" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duty Status</label>
                    <select 
                      value={form.status} 
                      onChange={e => setForm({...form, status: e.target.value})} 
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Safety Star Rating (1.0 to 5.0)</label>
                  <input 
                    type="number" 
                    min="1.0" 
                    max="5.0" 
                    step="0.1" 
                    value={form.rating} 
                    onChange={e => setForm({...form, rating: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', marginBottom: '16px' }} 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Profile Avatar Picker *</label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {PRESET_AVATARS.map((url, i) => (
                      <div 
                        key={i} 
                        onClick={() => setForm({...form, avatar: url})}
                        style={{ 
                          width: '45px', 
                          height: '45px', 
                          borderRadius: '12px', 
                          overflow: 'hidden', 
                          cursor: 'pointer', 
                          border: form.avatar === url ? '3px solid var(--primary)' : '2px solid transparent',
                          transform: form.avatar === url ? 'scale(1.1)' : 'scale(1)',
                          transition: '0.2s',
                          boxShadow: form.avatar === url ? '0 4px 10px rgba(78, 128, 255, 0.3)' : 'none'
                        }}
                      >
                        <img src={url} alt={`avatar-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Or Custom Image URL</label>
                    <input 
                      type="text" 
                      value={form.avatar} 
                      onChange={e => setForm({...form, avatar: e.target.value})} 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none' }} 
                      placeholder="Enter custom image URL..." 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setShowFormModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={18} /> {editingDriver ? 'Save Changes' : 'Register Driver'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CERTIFICATION LOG COMPLIANCE MODAL */}
      <AnimatePresence>
        {showCertsModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '780px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}><ShieldCheck size={24} /></div>
                   <div>
                      <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Certification Compliance Log</h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Admin checklist to authorize driving privileges and safety validation status.</p>
                   </div>
                </div>
                <button onClick={() => setShowCertsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>

              <div style={{ padding: '24px', overflowX: 'auto', maxHeight: '55vh' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px' }}>Driver</th>
                      <th style={{ padding: '12px' }}>CDL License</th>
                      <th style={{ padding: '12px' }}>Medical clearance</th>
                      <th style={{ padding: '12px' }}>Background Check</th>
                      <th style={{ padding: '12px' }}>Defensive Driving</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map(d => (
                      <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 700, color: 'var(--text-main)' }}>{d.name}</td>
                        <td style={{ padding: '16px 12px' }}>
                          <input 
                            type="checkbox" 
                            checked={d.certifications?.cdl ?? true} 
                            onChange={() => handleToggleCert(d.id, 'cdl')}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                          />
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <input 
                            type="checkbox" 
                            checked={d.certifications?.medical ?? true} 
                            onChange={() => handleToggleCert(d.id, 'medical')}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                          />
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <input 
                            type="checkbox" 
                            checked={d.certifications?.background ?? true} 
                            onChange={() => handleToggleCert(d.id, 'background')}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                          />
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <input 
                            type="checkbox" 
                            checked={d.certifications?.defensive ?? true} 
                            onChange={() => handleToggleCert(d.id, 'defensive')}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowCertsModal(false)} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 800, cursor: 'pointer' }}>Close Logs</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAFETY & TRIP HISTORY MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, overflow: 'hidden' }}>
                      {showHistoryModal.avatar ? (
                         <img src={showHistoryModal.avatar} alt={showHistoryModal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                         showHistoryModal.name.charAt(0)
                      )}
                   </div>
                   <div>
                      <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>{showHistoryModal.name} - Safety History</h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified safe driving metrics and critical event records.</p>
                   </div>
                </div>
                <button onClick={() => setShowHistoryModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '55vh', overflowY: 'auto' }}>
                {/* Score Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Trips Done</p>
                    <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950 }}>{showHistoryModal.metrics?.completedTrips ?? 120}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>On-Time Rate</p>
                    <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#10b981' }}>{showHistoryModal.metrics?.onTimeRate ?? '98%'}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Rating Score</p>
                    <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 950, color: '#f59e0b' }}>{showHistoryModal.metrics?.satisfaction ?? '5.0'}/5</p>
                  </div>
                </div>

                {/* Compliance Checklist Preview */}
                <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '20px', backgroundColor: 'var(--bg-body)' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 800 }}>Authorization Checklist</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} style={{ color: (showHistoryModal.certifications?.cdl ?? true) ? '#10b981' : '#ef4444' }} />
                      <span style={{ fontWeight: 600 }}>CDL License: Valid</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} style={{ color: (showHistoryModal.certifications?.medical ?? true) ? '#10b981' : '#ef4444' }} />
                      <span style={{ fontWeight: 600 }}>Medical: Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} style={{ color: (showHistoryModal.certifications?.background ?? true) ? '#10b981' : '#ef4444' }} />
                      <span style={{ fontWeight: 600 }}>Background Check: OK</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <CheckCircle2 size={16} style={{ color: (showHistoryModal.certifications?.defensive ?? true) ? '#10b981' : '#ef4444' }} />
                      <span style={{ fontWeight: 600 }}>Defensive Driving Course</span>
                    </div>
                  </div>
                </div>

                {/* Incident logs */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800 }}>Recent Incidents Log</h4>
                  {(!showHistoryModal.metrics?.incidentLog || showHistoryModal.metrics.incidentLog.length === 0) ? (
                    <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981' }}>
                      <CheckCircle2 size={20} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Excellent: Zero driving violations or incidents logged.</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {showHistoryModal.metrics.incidentLog.map((inc, i) => (
                        <div key={i} style={{ padding: '16px', borderRadius: '16px', border: '1px solid #ef444430', backgroundColor: '#fef2f2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.8rem' }}>INCIDENT DETECTED</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{inc.date}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#7f1d1d' }}>{inc.detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '20px 24px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowHistoryModal(null)} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 800, cursor: 'pointer' }}>Close History</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SIMULATED DIRECT CHAT DRAWER */}
      <AnimatePresence>
        {showChatDrawer && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}>
            {/* Backdrop click closer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: -1 }} onClick={() => setShowChatDrawer(null)} />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ width: '100%', maxWidth: '440px', height: '100%', backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.15)' }}
            >
              {/* Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', overflow: 'hidden' }}>
                    {showChatDrawer.avatar ? (
                      <img 
                        src={showChatDrawer.avatar} 
                        alt={showChatDrawer.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      showChatDrawer.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>{showChatDrawer.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>{showChatDrawer.status.toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setShowChatDrawer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>

              {/* Message feed */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-body)' }}>
                {(chatMessages[showChatDrawer.id] || []).map((msg, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{ 
                      padding: '12px 18px', 
                      borderRadius: msg.sender === 'admin' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', 
                      backgroundColor: msg.sender === 'admin' ? 'var(--primary)' : 'var(--bg-card)', 
                      color: msg.sender === 'admin' ? 'white' : 'var(--text-main)',
                      border: msg.sender === 'admin' ? 'none' : '1px solid var(--border-color)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {msg.text}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', alignSelf: msg.sender === 'admin' ? 'flex-end' : 'flex-start', fontWeight: 600 }}>{msg.time}</span>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', borderRadius: '20px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', alignSelf: 'flex-start', maxWidth: '80%' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{showChatDrawer.name} is typing</span>
                    <span className="dot-typing" style={{ display: 'inline-flex', gap: '3px' }}>
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'bounce 1.4s infinite ease-in-out both' }}></span>
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
                    </span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', backgroundColor: 'var(--bg-card)' }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Send direct message to ${showChatDrawer.name.split(' ')[0]}...`}
                  style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', padding: 0, cursor: 'pointer' }}>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DRIVER ACTIONS OPTIONS DRAWER / BOTTOM SHEET */}
      <AnimatePresence>
        {showActionsMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            {/* Close actions backdrop */}
            <div style={{ position: 'absolute', inset: 0 }} onClick={() => setShowActionsMenu(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              style={{ 
                width: '100%', maxWidth: '360px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', 
                zIndex: 10, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, overflow: 'hidden' }}>
                      {showActionsMenu.avatar ? (
                         <img src={showActionsMenu.avatar} alt={showActionsMenu.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                         showActionsMenu.name.charAt(0)
                      )}
                   </div>
                   <div>
                      <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)' }}>Driver Operations</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Managing profile of {showActionsMenu.name}</p>
                   </div>
                </div>
                <button onClick={() => setShowActionsMenu(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '4px 0' }} />

              <button 
                onClick={() => {
                  setShowActionsMenu(null);
                  handleOpenForm(showActionsMenu);
                }} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <Edit size={18} style={{ color: 'var(--primary)' }} /> Edit Driver Profile
              </button>

              <button 
                onClick={() => handleToggleStatus(showActionsMenu)} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <Calendar size={18} style={{ color: '#f59e0b' }} /> Toggle Duty Status ({showActionsMenu.status === 'Active' ? 'On Leave' : 'Active'})
              </button>

              <button 
                onClick={() => {
                  setShowActionsMenu(null);
                  setShowChatDrawer(showActionsMenu);
                }} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <MessageSquare size={18} style={{ color: '#10b981' }} /> Direct Message / Chat
              </button>

              <button 
                onClick={() => handleDeleteDriver(showActionsMenu.id)} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ef444420', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
              >
                <Trash2 size={18} /> De-register Driver
              </button>
            </motion.div>
          </div>
        )}

        {/* CUSTOM DELETE CONFIRMATION DIALOG */}
        {deleteConfirmId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
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
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>De-register Driver</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to de-register this institutional driver? This action cannot be undone.
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
                    const target = drivers.find(d => d.id === deleteConfirmId);
                    if (target) {
                      const updated = drivers.filter(d => d.id !== deleteConfirmId);
                      persist(updated);
                      showToast('success', `Driver ${target.name} has been de-registered.`);
                    }
                    setDeleteConfirmId(null);
                  }} 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer' }}
                >
                  De-register
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded CSS for dot bounce animation */}
      <style>{`
        .dot-typing {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 6px;
        }
        .dot-typing .dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: var(--text-muted);
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TransportDrivers;
