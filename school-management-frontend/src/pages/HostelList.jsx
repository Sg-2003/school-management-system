import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, Bed, Users, Search, Plus, Filter, MoreVertical, 
  MapPin, Shield, Phone, ArrowRight, Activity, Grid, List, X,
  SlidersHorizontal
} from 'lucide-react';
import { 
  RoomAppearanceModal, getRoomAppearance, applyRoomAppearanceStyles 
} from '../components/RoomAppearanceModal';

const HostelList = () => {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [newHostel, setNewHostel] = useState({
    name: '', type: 'Boys', address: '', rooms: '', capacity: '', warden: '', contact: ''
  });
  const [activeMenu, setActiveMenu] = useState(null);

  // Appearance Overrides State
  const [appearance, setAppearance] = useState(getRoomAppearance);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [systemDark, setSystemDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    fetchHostels();
    
    const syncAppearance = () => {
      setAppearance(getRoomAppearance());
      setSystemDark(localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('storage', syncAppearance);
    
    // Track data-theme shifts dynamically
    const observer = new MutationObserver(() => {
      setSystemDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => {
      window.removeEventListener('storage', syncAppearance);
      observer.disconnect();
    };
  }, []);

  const { isDark, palette, spacing } = applyRoomAppearanceStyles(appearance, systemDark);

  const fetchHostels = async () => {
    try {
      const storedVersion = localStorage.getItem('hostel_buildings_version');
      if (storedVersion !== '2026-v2') {
        localStorage.removeItem('hostel_buildings');
        localStorage.setItem('hostel_buildings_version', '2026-v2');
      }
      const saved = localStorage.getItem('hostel_buildings');
      if (saved) {
        setHostels(JSON.parse(saved));
      } else {
        const initialBuildings = [
          { 
            id: 'HST-001', name: 'Elite Boys Residency', type: 'Boys', 
            address: 'North Campus, Block A', rooms: 45, capacity: 180, 
            occupied: 142, warden: 'Mr. Rajesh Kumar', contact: '+91 98765 43201',
            status: 'Active', rating: 4.8, color: '#4f46e5'
          },
          { 
            id: 'HST-002', name: 'Starlight Girls Wing', type: 'Girls', 
            address: 'East Campus, Block B', rooms: 38, capacity: 152, 
            occupied: 148, warden: 'Mrs. Sunita Sharma', contact: '+91 98765 43202',
            status: 'Nearly Full', rating: 4.9, color: '#ec4899'
          },
          { 
            id: 'HST-003', name: 'Premium Faculty Lodge', type: 'Staff', 
            address: 'South Campus, Block C', rooms: 20, capacity: 20, 
            occupied: 15, warden: 'Dr. Anand Joshi', contact: '+91 98765 43203',
            status: 'Active', rating: 4.7, color: '#10b981'
          }
        ];
        localStorage.setItem('hostel_buildings', JSON.stringify(initialBuildings));
        setHostels(initialBuildings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHostel = (e) => {
    e.preventDefault();
    const id = `HST-00${hostels.length + 1}`;
    const colors = ['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#6366f1'];
    const addedHostel = {
      ...newHostel,
      id,
      occupied: 0,
      status: 'Active',
      rating: 5.0,
      color: colors[hostels.length % colors.length]
    };
    const updated = [addedHostel, ...hostels];
    setHostels(updated);
    localStorage.setItem('hostel_buildings', JSON.stringify(updated));
    setShowAddModal(false);
    setNewHostel({ name: '', type: 'Boys', address: '', rooms: '', capacity: '', warden: '', contact: '' });
  };

  const handleUpdateHostel = (e) => {
    e.preventDefault();
    const updated = hostels.map(h => h.id === editingHostel.id ? {
      ...h,
      name: newHostel.name,
      type: newHostel.type,
      capacity: newHostel.capacity,
      address: newHostel.address,
      rooms: newHostel.rooms,
      warden: newHostel.warden,
      contact: newHostel.contact
    } : h);
    setHostels(updated);
    localStorage.setItem('hostel_buildings', JSON.stringify(updated));
    setEditingHostel(null);
    setNewHostel({ name: '', type: 'Boys', address: '', rooms: '', capacity: '', warden: '', contact: '' });
  };

  const openEditModal = (hostel) => {
    setEditingHostel(hostel);
    setNewHostel({
      name: hostel.name,
      type: hostel.type,
      address: hostel.address,
      rooms: hostel.rooms,
      capacity: hostel.capacity,
      warden: hostel.warden || '',
      contact: hostel.contact || ''
    });
    setActiveMenu(null);
  };

  const stats = [
    { label: 'Total Hostels', value: hostels.length, icon: <Building />, color: '#4f46e5' },
    { label: 'Total Capacity', value: hostels.reduce((acc, h) => acc + (parseInt(h.capacity) || 0), 0), icon: <Users />, color: '#06b6d4' },
    { label: 'Available Beds', value: hostels.reduce((acc, h) => acc + ((parseInt(h.capacity) || 0) - (parseInt(h.occupied) || 0)), 0), icon: <Bed />, color: '#10b981' },
    { label: 'Occupancy Rate', value: hostels.length > 0 ? `${Math.round((hostels.reduce((acc, h) => acc + (parseInt(h.occupied) || 0), 0) / hostels.reduce((acc, h) => acc + (parseInt(h.capacity) || 0), 0)) * 100)}%` : '0%', icon: <Activity />, color: '#f59e0b' }
  ];

  const [typeFilter, setTypeFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredHostels = hostels.filter(h => {
    const name = h.name || '';
    const warden = h.warden || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          warden.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || h.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: spacing.padding, backgroundColor: palette.bgBody, color: palette.textMain, minHeight: '100vh', transition: 'all 0.4s ease' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: spacing.fontSizeTitle, fontWeight: 950, color: palette.textMain, letterSpacing: '-1.5px', marginBottom: '8px', transition: 'font-size 0.3s' }}>Hostel Management</h1>
          <p style={{ color: palette.textMuted, fontSize: spacing.fontSizeSub, fontWeight: 500 }}>Oversee institutional residency and accommodation infrastructure.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowAppearanceModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', 
              backgroundColor: palette.bgCard, color: palette.textMain, borderRadius: '18px', 
              border: `1px solid ${palette.borderColor}`, fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: palette.shadow, transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.backgroundColor = palette.bgBody; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = palette.bgCard; }}
          >
            <SlidersHorizontal size={18} color={palette.primary} /> Customize Style
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px', 
              backgroundColor: palette.primary, color: 'white', borderRadius: '18px', 
              border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: `0 10px 20px ${palette.primaryLight}`, transition: '0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={20} /> Register New Hostel
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.gap, marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            style={{ 
              padding: spacing.cardPadding, 
              backgroundColor: palette.bgCard, 
              borderRadius: spacing.borderRadius, 
              boxShadow: palette.shadow, 
              border: `1.5px solid ${palette.borderColor}`,
              backdropFilter: palette.backdrop
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: palette.textMain, marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ color: palette.textMuted, fontWeight: 700, fontSize: '0.95rem' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Control Bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
          <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: palette.textMuted }} size={20} />
          <input 
            type="text" 
            placeholder="Search hostels, wardens, or locations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', padding: '20px 20px 20px 64px', borderRadius: '24px', 
              border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.textMain, fontSize: '1rem',
              fontWeight: 600, outline: 'none', transition: '0.3s'
            }}
          />
        </div>
        <div style={{ display: 'flex', backgroundColor: palette.bgCard, padding: '8px', borderRadius: '20px', border: `1px solid ${palette.borderColor}`, gap: '8px', backdropFilter: palette.backdrop }}>
           <button 
             onClick={() => setViewType('grid')}
             style={{ padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: viewType === 'grid' ? palette.bgBody : 'transparent', color: viewType === 'grid' ? palette.primary : palette.textMuted, cursor: 'pointer', transition: 'all 0.2s' }}
           ><Grid size={20} /></button>
           <button 
             onClick={() => setViewType('list')}
             style={{ padding: '12px', borderRadius: '14px', border: 'none', backgroundColor: viewType === 'list' ? palette.bgBody : 'transparent', color: viewType === 'list' ? palette.primary : palette.textMuted, cursor: 'pointer', transition: 'all 0.2s' }}
           ><List size={20} /></button>
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            style={{ padding: '20px 32px', borderRadius: '24px', border: `1px solid ${palette.borderColor}`, backgroundColor: showFilterDropdown ? palette.bgBody : palette.bgCard, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', color: palette.textMain, cursor: 'pointer', boxShadow: palette.shadow }}
          >
            <Filter size={18} /> {typeFilter === 'All' ? 'Filters' : `Type: ${typeFilter}`}
          </button>
          
          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ 
                  position: 'absolute', top: '110%', right: 0, width: '220px', 
                  backgroundColor: palette.bgCard, borderRadius: '24px', padding: '12px', 
                  boxShadow: palette.shadow, border: `1px solid ${palette.borderColor}`, zIndex: 10 
                }}
              >
                {['All', 'Boys', 'Girls', 'Staff'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => { setTypeFilter(type); setShowFilterDropdown(false); }}
                    style={{ 
                      width: '100%', padding: '14px 20px', borderRadius: '16px', border: 'none', 
                      backgroundColor: typeFilter === type ? palette.primaryLight : 'transparent', 
                      color: typeFilter === type ? palette.primary : palette.textMuted,
                      textAlign: 'left', fontWeight: 700, cursor: 'pointer', transition: '0.2s'
                    }}
                  >
                    {type} Residency
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewType === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${spacing.gridMin}, 1fr))`, gap: spacing.gap }}
          >
            {filteredHostels.map((hostel, i) => (
              <motion.div 
                key={hostel.id}
                whileHover={{ y: -10 }}
                style={{ 
                  backgroundColor: palette.bgCard, borderRadius: spacing.borderRadius, overflow: 'hidden', 
                  boxShadow: palette.shadow, border: `1.5px solid ${palette.borderColor}`,
                  position: 'relative', backdropFilter: palette.backdrop
                }}
              >
                <div style={{ height: '12px', backgroundColor: hostel.color }}></div>
                <div style={{ padding: spacing.cardPadding }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${hostel.color}10`, color: hostel.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Building size={32} />
                      </div>
                      <div style={{ padding: '8px 16px', borderRadius: '12px', backgroundColor: palette.bgBody, color: palette.textMuted, fontSize: '0.8rem', fontWeight: 900 }}>
                         {hostel.id}
                      </div>
                   </div>

                   <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: palette.textMain, marginBottom: '8px' }}>{hostel.name}</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: palette.textMuted, fontWeight: 600, marginBottom: '32px' }}>
                      <MapPin size={16} /> {hostel.address}
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                      <div style={{ padding: '20px', backgroundColor: palette.bgBody, borderRadius: '24px' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: 800, color: palette.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>Rooms</div>
                         <div style={{ fontSize: '1.25rem', fontWeight: 900, color: palette.textMain }}>{hostel.rooms} Units</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: palette.bgBody, borderRadius: '24px' }}>
                         <div style={{ fontSize: '0.75rem', fontWeight: 800, color: palette.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>Type</div>
                         <div style={{ fontSize: '1.25rem', fontWeight: 900, color: hostel.color }}>{hostel.type}</div>
                      </div>
                   </div>

                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                         <span style={{ fontSize: '0.9rem', fontWeight: 800, color: palette.textMuted }}>Occupancy ({hostel.occupied}/{hostel.capacity})</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: 900, color: palette.textMain }}>{hostel.capacity > 0 ? Math.round((hostel.occupied / hostel.capacity) * 100) : 0}%</span>
                      </div>
                      <div style={{ height: '10px', backgroundColor: palette.bgBody, borderRadius: '5px', overflow: 'hidden' }}>
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${hostel.capacity > 0 ? (hostel.occupied / hostel.capacity) * 100 : 0}%` }}
                           transition={{ duration: 1, delay: 0.5 }}
                           style={{ height: '100%', backgroundColor: hostel.color }}
                         ></motion.div>
                      </div>
                   </div>

                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${palette.borderColor}`, paddingTop: '32px' }}>
                      <button 
                        onClick={() => navigate(`/dashboard/hostel-rooms?id=${hostel.id}`)}
                        style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', backgroundColor: palette.primary, color: 'white', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', boxShadow: `0 4px 10px ${palette.primaryLight}` }}>
                        Manage Units <ArrowRight size={16} />
                      </button>
                      <div style={{ position: 'relative' }}>
                         <button 
                           onClick={() => setActiveMenu(activeMenu === hostel.id ? null : hostel.id)}
                           style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                         >
                            <MoreVertical size={20} />
                         </button>
                         {activeMenu === hostel.id && (
                           <div style={{ position: 'absolute', bottom: '110%', right: 0, width: '180px', backgroundColor: palette.bgCard, borderRadius: '15px', padding: '10px', boxShadow: palette.shadow, zIndex: 10, border: `1px solid ${palette.borderColor}` }}>
                             <button 
                               onClick={() => openEditModal(hostel)}
                               style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '10px', color: palette.textMain, fontWeight: 600, cursor: 'pointer' }}
                             >
                                <Plus size={16} color={palette.primary} /> Edit Details
                             </button>
                           </div>
                         )}
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: palette.bgCard, borderRadius: spacing.borderRadius, overflow: 'hidden', boxShadow: palette.shadow, border: `1.5px solid ${palette.borderColor}`, backdropFilter: palette.backdrop }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: palette.bgBody, borderBottom: `1px solid ${palette.borderColor}` }}>
                <tr>
                  <th style={{ padding: '24px 40px', color: palette.textMuted, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Hostel Detail</th>
                  <th style={{ padding: '24px', color: palette.textMuted, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Warden</th>
                  <th style={{ padding: '24px', color: palette.textMuted, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Capacity</th>
                  <th style={{ padding: '24px', color: palette.textMuted, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Occupancy</th>
                  <th style={{ padding: '24px', color: palette.textMuted, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '24px 40px', color: palette.textMuted, fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHostels.map((hostel) => (
                  <tr key={hostel.id} style={{ borderBottom: `1px solid ${palette.borderColor}` }}>
                    <td style={{ padding: '32px 40px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${hostel.color}10`, color: hostel.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: palette.textMain }}>{hostel.name}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: palette.textMuted }}>{hostel.address}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '32px 24px' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: palette.textMain }}>{hostel.warden || 'N/A'}</div>
                      <div style={{ fontSize: '0.85rem', color: palette.textMuted }}>{hostel.contact}</div>
                    </td>
                    <td style={{ padding: '32px 24px' }}>
                       <div style={{ fontSize: '1rem', fontWeight: 800, color: palette.textMain }}>{hostel.capacity} Beds</div>
                       <div style={{ fontSize: '0.85rem', color: palette.textMuted }}>{hostel.rooms} Rooms</div>
                    </td>
                    <td style={{ padding: '32px 24px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ flex: 1, width: '100px', height: '8px', backgroundColor: palette.bgBody, borderRadius: '4px', overflow: 'hidden' }}>
                             <div style={{ width: `${hostel.capacity > 0 ? (hostel.occupied / hostel.capacity) * 100 : 0}%`, height: '100%', backgroundColor: hostel.color }}></div>
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: palette.textMain }}>{hostel.capacity > 0 ? Math.round((hostel.occupied / hostel.capacity) * 100) : 0}%</span>
                       </div>
                    </td>
                    <td style={{ padding: '32px 24px' }}>
                       <span style={{ padding: '6px 16px', borderRadius: '10px', backgroundColor: hostel.status === 'Active' ? '#10b98115' : '#f59e0b15', color: hostel.status === 'Active' ? '#10b981' : '#f59e0b', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>
                         {hostel.status}
                       </span>
                    </td>
                    <td style={{ padding: '32px 40px', textAlign: 'right' }}>
                       <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => openEditModal(hostel)}
                            style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.primary, fontWeight: 800, cursor: 'pointer' }}
                          >
                             Edit
                          </button>
                          <button 
                            onClick={() => navigate(`/dashboard/hostel-rooms?id=${hostel.id}`)}
                            style={{ padding: '12px 24px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.primary, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            Manage <ArrowRight size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || editingHostel) && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => { setShowAddModal(false); setEditingHostel(null); }}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               style={{ position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: palette.bgCard, borderRadius: spacing.borderRadius, padding: '40px', boxShadow: palette.shadow, border: `1.5px solid ${palette.borderColor}`, maxHeight: '90vh', overflowY: 'auto' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                   <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: palette.textMain, margin: 0 }}>{editingHostel ? 'Edit Hostel' : 'Register Hostel'}</h2>
                   <button onClick={() => { setShowAddModal(false); setEditingHostel(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: palette.textMuted }}><X size={24} /></button>
                </div>

                <form onSubmit={editingHostel ? handleUpdateHostel : handleAddHostel} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Hostel Name</label>
                         <input 
                           required type="text" placeholder="e.g. Elite Boys Block"
                           value={newHostel.name} onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
                           style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem' }}
                         />
                      </div>
                      <div className="form-group">
                         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Hostel Type</label>
                         <select 
                           value={newHostel.type} onChange={(e) => setNewHostel({...newHostel, type: e.target.value})}
                           style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                         >
                            <option>Boys</option>
                            <option>Girls</option>
                            <option>Staff</option>
                         </select>
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Total Rooms</label>
                         <input 
                           required type="number" placeholder="e.g. 50"
                           value={newHostel.rooms} onChange={(e) => setNewHostel({...newHostel, rooms: e.target.value})}
                           style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem' }}
                         />
                      </div>
                      <div className="form-group">
                         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Total Capacity</label>
                         <input 
                           required type="number" placeholder="e.g. 200"
                           value={newHostel.capacity} onChange={(e) => setNewHostel({...newHostel, capacity: e.target.value})}
                           style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem' }}
                         />
                      </div>
                   </div>

                   <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Address</label>
                      <input 
                        required type="text" placeholder="Full street address"
                        value={newHostel.address} onChange={(e) => setNewHostel({...newHostel, address: e.target.value})}
                        style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem' }}
                      />
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Warden Name</label>
                         <input 
                           type="text" placeholder="Warden name"
                           value={newHostel.warden} onChange={(e) => setNewHostel({...newHostel, warden: e.target.value})}
                           style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem' }}
                         />
                      </div>
                      <div className="form-group">
                         <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: palette.textMuted, fontSize: '0.9rem' }}>Contact No.</label>
                         <input 
                           type="text" placeholder="Contact number"
                           value={newHostel.contact} onChange={(e) => setNewHostel({...newHostel, contact: e.target.value})}
                           style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: `1px solid ${palette.borderColor}`, backgroundColor: palette.bgBody, color: palette.textMain, outline: 'none', fontSize: '1rem' }}
                         />
                      </div>
                   </div>

                   <button type="submit" style={{ marginTop: '10px', padding: '16px', borderRadius: '15px', border: 'none', backgroundColor: palette.primary, color: 'white', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: `0 10px 20px ${palette.primaryLight}` }}>
                      {editingHostel ? 'Save Changes' : 'Register Building'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RoomAppearanceModal 
        isOpen={showAppearanceModal} 
        onClose={() => setShowAppearanceModal(false)} 
        onChange={(updated) => setAppearance(updated)} 
      />
    </div>
  );
};

export default HostelList;
