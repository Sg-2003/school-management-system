import React, { useState, useMemo } from 'react';
import { MapPin, Plus, Search, Filter, MoreVertical, Navigation, Users, Clock, ArrowRight, Eye, Edit, Trash2, Map as MapIcon, Info, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEED_ROUTES = [
  { id: 1, name: 'North Express Route', startPoint: 'Sector 12 Mall', endPoint: 'Main Campus', totalStops: 12, vehicle: 'Bus 01', driver: 'Suresh Yadav', timing: '07:30 AM', fare: '$45.00', status: 'Active' },
  { id: 2, name: 'Downtown Shuttle', startPoint: 'City Center', endPoint: 'West Campus', totalStops: 8, vehicle: 'Bus 02', driver: 'Mukesh Tiwari', timing: '08:00 AM', fare: '$30.00', status: 'Active' },
  { id: 3, name: 'Staff Loop', startPoint: 'East Suburb', endPoint: 'Admin Block', totalStops: 5, vehicle: 'Van 04', driver: 'Geeta Pillai', timing: '07:00 AM', fare: '$0.00', status: 'Inactive' },
  { id: 4, name: 'Residency Express', startPoint: 'Hills Estate', endPoint: 'Main Campus', totalStops: 15, vehicle: 'Bus 05', driver: 'Ramesh Gupta', timing: '07:15 AM', fare: '$55.00', status: 'Active' },
  { id: 5, name: 'South Connect', startPoint: 'Old Town', endPoint: 'Secondary Block', totalStops: 10, vehicle: 'Bus 08', driver: 'Karan Singh', timing: '07:45 AM', fare: '$40.00', status: 'Active' },
];

const RouteList = () => {
  const [routes, setRoutes] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('transport_routes_version');
      if (storedVersion !== '2026-v2') {
        localStorage.removeItem('transport_routes');
        localStorage.setItem('transport_routes_version', '2026-v2');
      }
      const s = localStorage.getItem('transport_routes');
      if (s) return JSON.parse(s);
    } catch(e) {}
    return SEED_ROUTES;
  });

  const persist = (updated) => {
    setRoutes(updated);
    localStorage.setItem('transport_routes', JSON.stringify(updated));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRouteForMap, setSelectedRouteForMap] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter(r => {
      const q = searchQuery.toLowerCase();
      const matchQ = !q || r.name.toLowerCase().includes(q) || r.startPoint.toLowerCase().includes(q) || r.endPoint.toLowerCase().includes(q) || r.driver.toLowerCase().includes(q);
      const matchS = filterStatus === 'All' || r.status === filterStatus;
      return matchQ && matchS;
    });
  }, [routes, searchQuery, filterStatus]);

  const handleDelete = (id) => {
    persist(routes.filter(r => r.id !== id));
    showToast('success', 'Route deleted successfully.');
  };

  const [form, setForm] = useState({ name: '', startPoint: '', endPoint: '', driver: '', vehicle: '', timing: '', fare: '$0.00', status: 'Active' });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.startPoint || !form.endPoint) {
      showToast('error', 'Please fill all required fields.');
      return;
    }
    
    if (editingId) {
      persist(routes.map(r => r.id === editingId ? { ...form, id: editingId } : r));
      showToast('success', 'Route updated successfully.');
    } else {
      const newRoute = {
        ...form,
        id: Date.now(),
        totalStops: Math.floor(Math.random() * 10) + 5
      };
      persist([...routes, newRoute]);
      showToast('success', 'New route created successfully.');
    }

    setShowAddModal(false);
    setEditingId(null);
    setForm({ name: '', startPoint: '', endPoint: '', driver: '', vehicle: '', timing: '', fare: '$0.00', status: 'Active' });
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
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Transport Route Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive management of institutional transit paths, stations, and assigned faculty.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button onClick={() => { setSelectedRouteForMap(null); setShowMapModal(true); }} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
              <MapIcon size={20} /> Network Map
           </button>
           <button onClick={() => { setEditingId(null); setForm({ name: '', startPoint: '', endPoint: '', driver: '', vehicle: '', timing: '', fare: '$0.00', status: 'Active' }); setShowAddModal(true); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer' }}>
              <Plus size={20} /> Add New Route
           </button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
         <div style={{ padding: '24px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search by route, station, or driver..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
                />
             </div>
             <div style={{ position: 'relative' }}>
               <button onClick={() => setShowFilter(!showFilter)} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>
                 <Filter size={18} /> Category {filterStatus !== 'All' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />}
               </button>
               {showFilter && (
                 <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '150px' }}>
                   {['All', 'Active', 'Inactive'].map(s => (
                     <div 
                       key={s} 
                       onClick={() => { setFilterStatus(s); setShowFilter(false); }}
                       style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: filterStatus === s ? 'var(--primary-light)' : 'transparent', color: filterStatus === s ? 'var(--primary)' : 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem' }}
                     >
                       {s}
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
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Route Configuration</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Path Spectrum</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Assets</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logistics</th>
                     <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operational Status</th>
                     <th style={{ padding: '20px 24px' }}></th>
                  </tr>
               </thead>
               <tbody>
                  {filteredRoutes.map((route, idx) => (
                    <motion.tr 
                      key={route.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}
                      hover={{ backgroundColor: 'var(--primary-light)' }}
                    >
                       <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                             <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Navigation size={22} />
                             </div>
                             <div>
                                <p style={{ margin: 0, fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>{route.name}</p>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>{route.totalStops} STATIONS RECORDED</p>
                             </div>
                          </div>
                       </td>
                       <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 800 }}>
                             <span style={{ color: 'var(--text-main)' }}>{route.startPoint}</span>
                             <div style={{ width: '20px', height: '2px', backgroundColor: 'var(--border-color)', position: 'relative' }}>
                                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) rotate(-45deg)', width: '6px', height: '2px', backgroundColor: 'var(--border-color)' }}></div>
                             </div>
                             <span style={{ color: 'var(--text-main)' }}>{route.endPoint}</span>
                          </div>
                       </td>
                       <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                             <span style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                <Users size={14} color="var(--primary)" /> {route.driver}
                             </span>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLEET ID: {route.vehicle}</span>
                          </div>
                       </td>
                       <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                             <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)' }}>{route.fare}</span>
                             <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                                <Clock size={14} /> DEPARTURE {route.timing}
                             </span>
                          </div>
                       </td>
                       <td style={{ padding: '20px 24px' }}>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', 
                            fontSize: '0.75rem', fontWeight: 900,
                            backgroundColor: route.status === 'Active' ? '#ecfdf5' : '#fef2f2',
                            color: route.status === 'Active' ? '#10b981' : '#ef4444',
                            border: `1px solid ${route.status === 'Active' ? '#10b98130' : '#ef444430'}`
                          }}>
                             <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 10px currentColor' }}></div>
                             {route.status.toUpperCase()}
                          </div>
                       </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                              <button onClick={() => { setSelectedRouteForMap(route); setShowMapModal(true); }} className="icon-btn" style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }} title="View Map"><Eye size={18} /></button>
                              <button onClick={() => { setForm(route); setEditingId(route.id); setShowAddModal(true); }} className="icon-btn" style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }} title="Edit Route"><Edit size={18} /></button>
                              <button onClick={() => handleDelete(route.id)} className="icon-btn" style={{ backgroundColor: '#fef2f2', color: 'var(--danger)', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                           </div>
                        </td>
                    </motion.tr>
                  ))}
                  {filteredRoutes.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                        No routes found matching your criteria.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '40px' }}>
         <div className="card" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}><Info size={16} className="text-muted" /></div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Fleet Coverage</p>
            <h4 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 950 }}>142.5 <small style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>KM</small></h4>
         </div>
         <div className="card" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}><Info size={16} className="text-muted" /></div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Subscription Yield</p>
            <h4 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 950 }}>$4,820 <small style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ MO</small></h4>
         </div>
         <div className="card" style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px' }}><Info size={16} className="text-muted" /></div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Operational Purity</p>
            <h4 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 950, color: '#10b981' }}>98.4%</h4>
         </div>
      </div>

      {/* Add Route Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>{editingId ? 'Edit Route' : 'Register New Route'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditingId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Route Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. West Express" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start Point</label>
                  <input type="text" required value={form.startPoint} onChange={e => setForm({...form, startPoint: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="Start location" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>End Point</label>
                  <input type="text" required value={form.endPoint} onChange={e => setForm({...form, endPoint: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="End location" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Driver Assigned</label>
                  <input type="text" required value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="Driver name" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehicle / Fleet ID</label>
                  <input type="text" required value={form.vehicle} onChange={e => setForm({...form, vehicle: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. Bus 03" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Timing</label>
                  <input type="text" required value={form.timing} onChange={e => setForm({...form, timing: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }} placeholder="e.g. 07:00 AM" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none' }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => { setShowAddModal(false); setEditingId(null); }} className="btn" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={18} /> {editingId ? 'Save Changes' : 'Register Route'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Network Map Modal */}
      {showMapModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '100%', maxWidth: '1000px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', height: '80vh' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}><MapIcon size={24} /></div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900 }}>Live Fleet Tracker</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {selectedRouteForMap ? `Focusing on ${selectedRouteForMap.name}` : 'Real-time GPS positioning of all active transport routes.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowMapModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24}/></button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Map Area */}
              <div style={{ flex: 2, position: 'relative', borderRight: '1px solid var(--border-color)' }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.025%2C40.700%2C-73.970%2C40.735&amp;layer=mapnik" 
                  style={{ filter: 'grayscale(0.2) contrast(1.1) opacity(0.9)' }}
                ></iframe>
                
                {/* Mock Live Indicators over the map */}
                <div style={{ position: 'absolute', top: '30%', left: '40%', width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}></div>
                <div style={{ position: 'absolute', top: '30%', left: '40%', width: '16px', height: '16px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.7 }}></div>
                
                {!selectedRouteForMap && (
                  <div style={{ position: 'absolute', top: '60%', left: '70%', width: '16px', height: '16px', backgroundColor: '#4f46e5', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.3)' }}></div>
                )}
                
                <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '10px 16px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', backdropFilter: 'blur(4px)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span> {selectedRouteForMap ? `Tracking: ${selectedRouteForMap.vehicle}` : 'Live GPS Active'}
                </div>
              </div>
              
              {/* Sidebar with Route List */}
              <div style={{ flex: 1, backgroundColor: 'var(--bg-body)', overflowY: 'auto', padding: '20px' }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: 900 }}>
                  {selectedRouteForMap ? 'Route Details' : 'Active Fleet'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(selectedRouteForMap ? [selectedRouteForMap] : filteredRoutes.filter(r => r.status === 'Active')).map((r, i) => (
                    <div key={i} style={{ padding: '16px', backgroundColor: selectedRouteForMap?.id === r.id ? 'var(--primary-light)' : 'var(--bg-card)', borderRadius: '16px', border: `1px solid ${selectedRouteForMap?.id === r.id ? 'var(--primary)' : 'var(--border-color)'}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedRouteForMap?.id === r.id ? 'var(--primary)' : 'inherit' }}>{r.name}</span>
                         <span style={{ fontSize: '0.75rem', fontWeight: 900, color: selectedRouteForMap?.id === r.id ? 'var(--primary)' : '#10b981' }}>{r.vehicle}</span>
                       </div>
                       <p style={{ margin: 0, fontSize: '0.75rem', color: selectedRouteForMap?.id === r.id ? 'var(--primary)' : 'var(--text-muted)' }}>{r.startPoint} → {r.endPoint}</p>
                       {selectedRouteForMap?.id === r.id && (
                         <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(79, 70, 229, 0.2)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                               <span>Driver:</span> <span>{r.driver}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                               <span>Stops:</span> <span>{r.totalStops}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               <span>Timing:</span> <span>{r.timing}</span>
                            </div>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RouteList;
