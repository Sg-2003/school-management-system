import React, { useState } from 'react';
import { 
  Bus, MapPin, Search, Filter, Plus, Navigation, Activity, Clock, 
  ShieldCheck, MoreVertical, X, Save, CheckCircle2, AlertCircle, 
  Edit, Trash2, BatteryCharging 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEED_VEHICLES = [
  { id: 1, name: 'Bus 01', route: 'North Campus - Sector 12', driver: 'Suresh Yadav', status: 'In Transit', fuel: '75%', load: '85%' },
  { id: 2, name: 'Bus 02', route: 'East Campus - Main Road', driver: 'Mukesh Tiwari', status: 'Idle', fuel: '45%', load: '0%' },
  { id: 3, name: 'Van 04', route: 'Staff Route - Downtown', driver: 'Geeta Pillai', status: 'Maintenance', fuel: '90%', load: '0%' },
  { id: 4, name: 'Bus 05', route: 'West Campus - Residential', driver: 'Ramesh Gupta', status: 'In Transit', fuel: '60%', load: '95%' },
];

const Transport = () => {
  // Fleet vehicles state
  const [vehicles, setVehicles] = useState(() => {
    try {
      const s = localStorage.getItem('transport_fleet');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return SEED_VEHICLES;
  });

  const persist = (updated) => {
    setVehicles(updated);
    localStorage.setItem('transport_fleet', JSON.stringify(updated));
  };

  // UI state variables
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  
  // Custom dialogs & action states
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Form values state
  const [form, setForm] = useState({ 
    name: '', 
    route: '', 
    driver: '', 
    fuel: '100%', 
    status: 'Idle' 
  });

  // Toast notifier
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Form submit handler (Add / Edit)
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.route.trim() || !form.driver.trim()) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    let updated;
    if (editingVehicle) {
      updated = vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { 
              ...v, 
              name: form.name.trim(), 
              route: form.route.trim(), 
              driver: form.driver.trim(), 
              fuel: form.fuel.trim(), 
              status: form.status 
            } 
          : v
      );
      showToast('success', `Vehicle ${form.name} updated successfully.`);
    } else {
      const newVehicle = {
        id: Date.now(),
        name: form.name.trim(),
        route: form.route.trim(),
        driver: form.driver.trim(),
        fuel: form.fuel.trim() || '100%',
        status: form.status,
        load: '0%'
      };
      updated = [...vehicles, newVehicle];
      showToast('success', 'New vehicle registered successfully.');
    }

    persist(updated);
    setShowAddModal(false);
    setEditingVehicle(null);
    setForm({ name: '', route: '', driver: '', fuel: '100%', status: 'Idle' });
  };

  // Open modal prefill helper
  const handleOpenForm = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setForm({
        name: vehicle.name,
        route: vehicle.route,
        driver: vehicle.driver,
        fuel: vehicle.fuel,
        status: vehicle.status
      });
    } else {
      setEditingVehicle(null);
      setForm({ name: '', route: '', driver: '', fuel: '100%', status: 'Idle' });
    }
    setShowAddModal(true);
  };

  // Refuel vehicle instantly
  const handleRefuelVehicle = (vehicle) => {
    const updated = vehicles.map(v => 
      v.id === vehicle.id 
        ? { ...v, fuel: '100%' } 
        : v
    );
    persist(updated);
    showToast('success', `Refueled ${vehicle.name} successfully to 100%.`);
    setShowActionsMenu(null);
  };

  // Toggle transit duty status
  const handleToggleStatus = (vehicle) => {
    const statusCycle = { 'Idle': 'In Transit', 'In Transit': 'Maintenance', 'Maintenance': 'Idle' };
    const nextStatus = statusCycle[vehicle.status] || 'Idle';
    
    const updated = vehicles.map(v => 
      v.id === vehicle.id 
        ? { ...v, status: nextStatus, load: nextStatus === 'In Transit' ? '80%' : '0%' } 
        : v
    );
    persist(updated);
    showToast('success', `Status of ${vehicle.name} shifted to ${nextStatus}.`);
    setShowActionsMenu(null);
  };

  // Delete/De-register vehicle asset handler
  const handleDeleteVehicle = (vehicleId) => {
    setDeleteConfirmId(vehicleId);
    setShowActionsMenu(null);
  };

  const statusStyles = {
    'In Transit': { color: '#10b981', bg: '#ecfdf5', icon: <Navigation size={14} /> },
    'Idle': { color: '#4f46e5', bg: '#eef2ff', icon: <Clock size={14} /> },
    'Maintenance': { color: '#ef4444', bg: '#fef2f2', icon: <Activity size={14} /> }
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Transport Fleet Overview</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time monitoring of institutional vehicles, route status, and driver telemetry.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => setShowLogsModal(true)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: 800 }}>
              <ShieldCheck size={20} /> Safety Logs
           </button>
           <button onClick={() => handleOpenForm()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 800 }}>
              <Plus size={20} /> Register Vehicle
           </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {vehicles.map((v, idx) => (
          <motion.div 
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card"
            style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', transition: '0.3s' }}
            whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)', borderColor: 'var(--primary)' }}
          >
            <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                     <Bus size={24} />
                  </div>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '30px', 
                    fontSize: '0.75rem', fontWeight: 800, 
                    color: statusStyles[v.status]?.color || '#4f46e5', 
                    backgroundColor: statusStyles[v.status]?.bg || '#eef2ff'
                  }}>
                    {statusStyles[v.status]?.icon || <Clock size={14} />}
                    {v.status.toUpperCase()}
                  </div>
               </div>

               <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '4px', color: 'var(--text-main)' }}>{v.name}</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
                  <MapPin size={14} /> {v.route}
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                     <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800 }}>Occupancy</p>
                     <p style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>{v.load}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                     <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800 }}>Fuel Level</p>
                     <p style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: parseInt(v.fuel) < 50 ? '#f59e0b' : '#10b981' }}>{v.fuel}</p>
                  </div>
               </div>
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, fontWeight: 700 }}>Driver</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{v.driver}</p>
               </div>
               <button onClick={() => setShowActionsMenu(v)} className="icon-btn" style={{ cursor: 'pointer' }}><MoreVertical size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* REGISTER / EDIT VEHICLE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>
                  {editingVehicle ? 'Edit Vehicle Profile' : 'Register New Vehicle'}
                </h2>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>
              <form onSubmit={handleAddSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle Identification Code *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. Bus 06" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Driver Name *</label>
                  <input type="text" required value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Route details *</label>
                  <input type="text" required value={form.route} onChange={e => setForm({...form, route: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. Downtown - Campus" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initial Fuel Level</label>
                    <input type="text" required value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. 100%" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transit Status</label>
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
                      <option value="Idle">Idle</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Save size={18} /> {editingVehicle ? 'Save Changes' : 'Register Vehicle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAFETY LOGS MODAL */}
      <AnimatePresence>
        {showLogsModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}
            >
              <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}><ShieldCheck size={24} /></div>
                   <div>
                      <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Safety & Maintenance Logs</h2>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recent compliance checks and service records.</p>
                   </div>
                </div>
                <button onClick={() => setShowLogsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
              </div>
              
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {[
                   { date: '2026-05-24', vehicle: 'Bus 01', type: 'Routine Inspection', status: 'Passed', notes: 'Brake pads replaced.' },
                   { date: '2026-05-20', vehicle: 'Van 04', type: 'Engine Check', status: 'Requires Attention', notes: 'Scheduled for maintenance on Friday.' },
                   { date: '2026-05-18', vehicle: 'Bus 05', type: 'Emissions Test', status: 'Passed', notes: 'Clear.' },
                   { date: '2026-05-15', vehicle: 'Bus 02', type: 'Tire Rotation', status: 'Completed', notes: 'All 6 tires rotated and aligned.' },
                   { date: '2026-05-10', vehicle: 'Bus 01', type: 'Oil Change', status: 'Completed', notes: 'Synthetic oil and new filter.' },
                 ].map((log, i) => (
                    <div key={i} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '16px', backgroundColor: 'var(--bg-body)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{log.vehicle} - {log.type}</span>
                          <span style={{ 
                            fontSize: '0.75rem', fontWeight: 900, padding: '4px 10px', borderRadius: '12px',
                            backgroundColor: log.status === 'Passed' || log.status === 'Completed' ? '#ecfdf5' : '#fef2f2',
                            color: log.status === 'Passed' || log.status === 'Completed' ? '#10b981' : '#ef4444'
                          }}>{log.status.toUpperCase()}</span>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}><Clock size={12}/>{log.date}</p>
                       <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{log.notes}</p>
                    </div>
                 ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK OPERATIONS BOTTOM SHEET ACTION DRAWER */}
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
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)' }}>Transit Operations</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Managing fleet asset {showActionsMenu.name}</p>
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
                <Edit size={18} style={{ color: 'var(--primary)' }} /> Edit Vehicle Profile
              </button>

              <button 
                onClick={() => handleRefuelVehicle(showActionsMenu)}
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <BatteryCharging size={18} style={{ color: '#10b981' }} /> Refuel Vehicle (Set to 100%)
              </button>

              <button 
                onClick={() => handleToggleStatus(showActionsMenu)}
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer', fontWeight: 700 }}
              >
                <Navigation size={18} style={{ color: '#4f46e5' }} /> Toggle Status ({showActionsMenu.status})
              </button>

              <button 
                onClick={() => handleDeleteVehicle(showActionsMenu.id)} 
                className="btn" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #ef444420', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: 800 }}
              >
                <Trash2 size={18} /> De-register Vehicle
              </button>
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
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>De-register Vehicle</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to de-register this institutional fleet vehicle? This action cannot be undone.
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
                    const target = vehicles.find(v => v.id === deleteConfirmId);
                    if (target) {
                      const updated = vehicles.filter(v => v.id !== deleteConfirmId);
                      persist(updated);
                      showToast('success', `Fleet vehicle ${target.name} has been de-registered.`);
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
    </div>
  );
};

export default Transport;
