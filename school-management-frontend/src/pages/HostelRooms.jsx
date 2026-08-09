import React, { useState, useEffect } from 'react';

import devonAvatar from '../assets/devon_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';
import elenaAvatar from '../assets/elena_avatar.png';
import marcusAvatar from '../assets/marcus_avatar.png';
import sophiaAvatar from '../assets/sophia_avatar.png';
import studentAvatar from '../assets/student_avatar.png';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed, Users, Search, Plus, Filter, MoreVertical, 
  ChevronLeft, ArrowRight, Activity, DoorOpen, ShieldAlert,
  CheckCircle, XCircle, X, Save, AlertCircle, Edit, Trash2, Shield,
  SlidersHorizontal
} from 'lucide-react';
import { 
  RoomAppearanceModal, getRoomAppearance, applyRoomAppearanceStyles 
} from '../components/RoomAppearanceModal';

const MOCK_STUDENTS_POOL = [
  { name: 'Ethan Hunt', id: 'ADM-2026-001', class: '10-A', avatar: elenaAvatar },
  { name: 'Olivia Wilde', id: 'ADM-2026-002', class: '10-B', avatar: devonAvatar },
  { name: 'Liam Neeson', id: 'ADM-2026-003', class: '11-A', avatar: robertAvatar },
  { name: 'Emma Stone', id: 'ADM-2026-004', class: '12-C', avatar: elenaAvatar },
  { name: 'Noah Centineo', id: 'ADM-2026-005', class: '9-B', avatar: devonAvatar },
  { name: 'Sophia Loren', id: 'ADM-2026-006', class: '10-C', avatar: ninaPatelAvatar },
  { name: 'Jackson Rathbone', id: 'ADM-2026-007', class: '11-B', avatar: robertAvatar },
  { name: 'Mia Farrow', id: 'ADM-2026-008', class: '12-A', avatar: elenaAvatar },
  { name: 'Lucas Hedges', id: 'ADM-2026-009', class: '9-A', avatar: studentAvatar },
  { name: 'Isabella Rossellini', id: 'ADM-2026-010', class: '10-A', avatar: janeAvatar },
  { name: 'Mason Mount', id: 'ADM-2026-011', class: '11-C', avatar: ninaPatelAvatar },
  { name: 'Amelia Earhart', id: 'ADM-2026-012', class: '12-B', avatar: janeAvatar },
  { name: 'Logan Lerman', id: 'ADM-2026-013', class: '10-B', avatar: elenaAvatar },
  { name: 'Harper Lee', id: 'ADM-2026-014', class: '11-A', avatar: sophiaAvatar },
  { name: 'Jacob Elordi', id: 'ADM-2026-015', class: '12-A', avatar: eleanorAvatar },
  { name: 'Evelyn Glennie', id: 'ADM-2026-016', class: '9-B', avatar: sophiaAvatar },
  { name: 'Ethan Hawke', id: 'ADM-2026-017', class: '10-C', avatar: sophiaAvatar },
  { name: 'Abigail Breslin', id: 'ADM-2026-018', class: '11-C', avatar: elenaAvatar },
  { name: 'Daniel Radcliffe', id: 'ADM-2026-019', class: '12-C', avatar: ninaPatelAvatar },
  { name: 'Emily Blunt', id: 'ADM-2026-020', class: '10-A', avatar: sophiaAvatar },
  { name: 'Matthew McConaughey', id: 'ADM-2026-021', class: '11-B', avatar: devonAvatar },
  { name: 'Elizabeth Olsen', id: 'ADM-2026-022', class: '12-B', avatar: sophiaAvatar },
  { name: 'Alexander Skarsgard', id: 'ADM-2026-023', class: '9-C', avatar: studentAvatar },
  { name: 'Scarlett Johansson', id: 'ADM-2026-024', class: '10-B', avatar: marcusAvatar },
  { name: 'William Levy', id: 'ADM-2026-025', class: '11-A', avatar: janeAvatar },
  { name: 'Victoria Beckham', id: 'ADM-2026-026', class: '12-A', avatar: devonAvatar },
  { name: 'Henry Cavill', id: 'ADM-2026-027', class: '10-C', avatar: ninaPatelAvatar },
  { name: 'Grace Kelly', id: 'ADM-2026-028', class: '11-C', avatar: sophiaAvatar },
  { name: 'James Dean', id: 'ADM-2026-029', class: '12-C', avatar: devonAvatar },
  { name: 'Audrey Hepburn', id: 'ADM-2026-030', class: '9-A', avatar: elenaAvatar },
  { name: 'Marlon Brando', id: 'ADM-2026-031', class: '10-A', avatar: janeAvatar },
  { name: 'Vivien Leigh', id: 'ADM-2026-032', class: '11-B', avatar: elenaAvatar },
  { name: 'Paul Newman', id: 'ADM-2026-033', class: '12-B', avatar: studentAvatar },
  { name: 'Ingrid Bergman', id: 'ADM-2026-034', class: '10-B', avatar: elenaAvatar },
  { name: 'Humphrey Bogart', id: 'ADM-2026-035', class: '11-A', avatar: robertAvatar },
  { name: 'Bette Davis', id: 'ADM-2026-036', class: '12-A', avatar: marcusAvatar },
  { name: 'Cary Grant', id: 'ADM-2026-037', class: '9-B', avatar: ninaPatelAvatar },
  { name: 'Katharine Hepburn', id: 'ADM-2026-038', class: '10-C', avatar: ninaPatelAvatar },
  { name: 'Clark Gable', id: 'ADM-2026-039', class: '11-C', avatar: sophiaAvatar },
  { name: 'Judy Garland', id: 'ADM-2026-040', class: '12-C', avatar: eleanorAvatar },
  { name: 'Gregory Peck', id: 'ADM-2026-041', class: '10-A', avatar: marcusAvatar },
  { name: 'Joan Crawford', id: 'ADM-2026-042', class: '11-B', avatar: eleanorAvatar },
  { name: 'Spencer Tracy', id: 'ADM-2026-043', class: '12-B', avatar: sophiaAvatar },
  { name: 'Elizabeth Taylor', id: 'ADM-2026-044', class: '9-C', avatar: elenaAvatar },
  { name: 'Laurence Olivier', id: 'ADM-2026-045', class: '10-B', avatar: ninaPatelAvatar },
  { name: 'Greta Garbo', id: 'ADM-2026-046', class: '11-A', avatar: ninaPatelAvatar },
  { name: 'James Stewart', id: 'ADM-2026-047', class: '12-A', avatar: devonAvatar },
  { name: 'Ginger Rogers', id: 'ADM-2026-048', class: '10-C', avatar: elenaAvatar },
  { name: 'John Wayne', id: 'ADM-2026-049', class: '11-C', avatar: ninaPatelAvatar },
  { name: 'Shirley Temple', id: 'ADM-2026-050', class: '12-C', avatar: janeAvatar }
];

const SEED_ROOMS = [
  { id: 1, room_no: '101', floor: '1st', type: 'Premium', capacity: 2, occupied: 2, status: 'Full', amenities: ['AC', 'Attached Bath'] },
  { id: 2, room_no: '102', floor: '1st', type: 'Standard', capacity: 4, occupied: 3, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 3, room_no: '103', floor: '1st', type: 'Standard', capacity: 4, occupied: 4, status: 'Full', amenities: ['Fan', 'Shared Bath'] },
  { id: 4, room_no: '201', floor: '2nd', type: 'Premium', capacity: 2, occupied: 1, status: 'Available', amenities: ['AC', 'Attached Bath'] },
  { id: 5, room_no: '202', floor: '2nd', type: 'Economy', capacity: 6, occupied: 5, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 6, room_no: '203', floor: '2nd', type: 'Standard', capacity: 4, occupied: 0, status: 'Empty', amenities: ['Fan', 'Shared Bath'] },
  { id: 7, room_no: '301', floor: '3rd', type: 'Premium', capacity: 2, occupied: 2, status: 'Full', amenities: ['AC', 'Attached Bath', 'Balcony'] },
  { id: 8, room_no: '302', floor: '3rd', type: 'Standard', capacity: 4, occupied: 2, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 9, room_no: '303', floor: '3rd', type: 'Economy', capacity: 8, occupied: 7, status: 'Available', amenities: ['Fan', 'Large Locker'] },
  { id: 10, room_no: '401', floor: '4th', type: 'Premium', capacity: 1, occupied: 0, status: 'Empty', amenities: ['AC', 'Single Bed', 'TV'] },
  { id: 11, room_no: '402', floor: '4th', type: 'Standard', capacity: 4, occupied: 1, status: 'Available', amenities: ['Fan', 'Shared Bath'] },
  { id: 12, room_no: '403', floor: '4th', type: 'Economy', capacity: 4, occupied: 4, status: 'Full', amenities: ['Fan', 'Shared Bath'] },
];

const populateRoomsWithUniqueStudents = (roomsList) => {
  let poolIdx = 0;
  return roomsList.map(room => {
    const occupants = [];
    const count = room.occupied || 0;
    for (let i = 0; i < count; i++) {
      if (poolIdx < MOCK_STUDENTS_POOL.length) {
        occupants.push(MOCK_STUDENTS_POOL[poolIdx]);
        poolIdx++;
      } else {
        const randId = Math.floor(100 + Math.random() * 900);
        occupants.push({
          name: `Student #${randId}`,
          id: `ADM-2026-${randId}`,
          class: '10-A',
          avatar: devonAvatar
        });
      }
    }
    return {
      ...room,
      occupants
    };
  });
};

const HostelRooms = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hostelId = searchParams.get('id') || 'HST-001';
  
  // Rooms state with local storage integration
  const [rooms, setRooms] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('hostel_rooms_version');
      if (storedVersion !== '2026-rooms-v8') {
        localStorage.removeItem('hostel_rooms');
        localStorage.setItem('hostel_rooms_version', '2026-rooms-v8');
      }

      const saved = localStorage.getItem('hostel_rooms');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && !parsed[0].occupants) {
          const migrated = populateRoomsWithUniqueStudents(parsed);
          localStorage.setItem('hostel_rooms', JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      }
    } catch(e) {}
    const seeded = populateRoomsWithUniqueStudents(SEED_ROOMS);
    localStorage.setItem('hostel_rooms', JSON.stringify(seeded));
    return seeded;
  });

  const persist = (updated) => {
    setRooms(updated);
    localStorage.setItem('hostel_rooms', JSON.stringify(updated));
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOccupantsModal, setShowOccupantsModal] = useState(null);
  
  // Custom dialogs & action states
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  const [newRoom, setNewRoom] = useState({
    number: '', type: 'Standard', capacity: '4', floor: '1'
  });

  const [toast, setToast] = useState(null);
  
  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  };

  // Appearance Overrides State
  const [appearance, setAppearance] = useState(getRoomAppearance);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [systemDark, setSystemDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
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

  // Form submit handler (Add / Edit)
  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoom.number || !newRoom.capacity) {
      showToast('Please fill in all required fields.', true);
      return;
    }

    let updatedList;
    if (editingRoom) {
      updatedList = rooms.map(r => {
        if (r.id === editingRoom.id) {
          const cap = parseInt(newRoom.capacity) || 4;
          const currentOccupants = r.occupants || [];
          const slicedOccupants = currentOccupants.slice(0, cap);
          const occ = slicedOccupants.length;
          const stat = occ === cap ? 'Full' : occ === 0 ? 'Empty' : 'Available';
          
          return { 
            ...r, 
            room_no: newRoom.number.trim(), 
            floor: `${newRoom.floor}${newRoom.floor === '1' ? 'st' : newRoom.floor === '2' ? 'nd' : newRoom.floor === '3' ? 'rd' : 'th'}`, 
            type: newRoom.type, 
            capacity: cap,
            occupied: occ,
            occupants: slicedOccupants,
            status: stat
          };
        }
        return r;
      });
      showToast(`Room ${newRoom.number} updated successfully.`);
    } else {
      // Check if room number already exists
      const exists = rooms.some(r => r.room_no === newRoom.number.trim());
      if (exists) {
        showToast(`Room number "${newRoom.number}" already exists.`, true);
        return;
      }

      const addedRoom = {
        id: Date.now(),
        room_no: newRoom.number.trim(),
        floor: `${newRoom.floor}${newRoom.floor === '1' ? 'st' : newRoom.floor === '2' ? 'nd' : newRoom.floor === '3' ? 'rd' : 'th'}`,
        type: newRoom.type,
        capacity: parseInt(newRoom.capacity) || 4,
        occupied: 0,
        occupants: [],
        status: 'Empty',
        amenities: ['Fan', 'Shared Bath']
      };
      updatedList = [addedRoom, ...rooms];
      showToast(`Room ${addedRoom.room_no} successfully registered.`);
    }

    persist(updatedList);
    setShowAddModal(false);
    setEditingRoom(null);
    setNewRoom({ number: '', type: 'Standard', capacity: '4', floor: '1' });
  };

  // Open modal prefill helper
  const handleOpenForm = (room = null) => {
    if (room) {
      setEditingRoom(room);
      const floorVal = room.floor.replace(/[^0-9]/g, '') || '1';
      setNewRoom({
        number: room.room_no,
        type: room.type,
        capacity: room.capacity.toString(),
        floor: floorVal
      });
    } else {
      setEditingRoom(null);
      setNewRoom({ number: '', type: 'Standard', capacity: '4', floor: '1' });
    }
    setShowAddModal(true);
  };

  // Log safety inspections simulation
  const handleSafetyInspection = (room) => {
    showToast(`Safety inspection logged for Room ${room.room_no}. All systems secure.`);
    setShowActionsMenu(null);
  };

  // Remove student from room (de-allotment)
  const handleRemoveStudent = (room, studentId) => {
    const currentRoomData = rooms.find(r => r.id === room.id);
    if (!currentRoomData) return;

    const updatedOccupants = (currentRoomData.occupants || []).filter(s => s.id !== studentId);
    const nextOcc = updatedOccupants.length;
    const nextStat = nextOcc === currentRoomData.capacity ? 'Full' : nextOcc === 0 ? 'Empty' : 'Available';

    const updated = rooms.map(r => 
      r.id === room.id 
        ? { ...r, occupied: nextOcc, occupants: updatedOccupants, status: nextStat } 
        : r
    );
    persist(updated);
    showToast(`Successfully de-allotted student from Room ${room.room_no}.`);
    
    // Update the active occupants modal with new data
    const updatedRoom = updated.find(r => r.id === room.id);
    setShowOccupantsModal(updatedRoom);
  };

  // Quick allotment student bed allocation action
  const handleQuickAllot = (room) => {
    const currentRoomData = rooms.find(r => r.id === room.id) || room;
    if (currentRoomData.occupied >= currentRoomData.capacity) {
      showToast(`Room ${room.room_no} is already full.`, true);
      setShowActionsMenu(null);
      return;
    }

    // Find all allocated student IDs
    const allocatedIds = new Set();
    rooms.forEach(r => {
      if (r.occupants) {
        r.occupants.forEach(s => allocatedIds.add(s.id));
      }
    });

    // Find the first student in the pool who is not currently allocated
    let nextStudent = MOCK_STUDENTS_POOL.find(s => !allocatedIds.has(s.id));

    if (!nextStudent) {
      // If pool is somehow fully allocated, generate a completely new unique one
      const randId = Math.floor(100 + Math.random() * 900);
      nextStudent = {
        name: `Student #${randId}`,
        id: `ADM-2026-${randId}`,
        class: '10-A',
        avatar: studentAvatar
      };
    }

    const updatedOccupants = [...(currentRoomData.occupants || []), nextStudent];
    const nextOcc = updatedOccupants.length;
    const nextStat = nextOcc === currentRoomData.capacity ? 'Full' : 'Available';

    const updated = rooms.map(r => 
      r.id === room.id 
        ? { ...r, occupied: nextOcc, occupants: updatedOccupants, status: nextStat } 
        : r
    );
    persist(updated);
    showToast(`Allotted student ${nextStudent.name} to Room ${room.room_no}.`);
    
    // Update active occupants modal if it's open for this room
    if (showOccupantsModal && showOccupantsModal.id === room.id) {
      const updatedRoom = updated.find(r => r.id === room.id);
      setShowOccupantsModal(updatedRoom);
    }
    
    setShowActionsMenu(null);
  };

  // De-register room asset handler
  const handleDeleteRoom = (roomId) => {
    setDeleteConfirmId(roomId);
    setShowActionsMenu(null);
  };

  const stats = [
    { label: 'Total Rooms', value: rooms.length, icon: <DoorOpen />, color: '#4f46e5' },
    { label: 'Total Capacity', value: rooms.reduce((acc, r) => acc + r.capacity, 0), icon: <Users />, color: '#06b6d4' },
    { label: 'Occupied Beds', value: rooms.reduce((acc, r) => acc + r.occupied, 0), icon: <Bed />, color: '#ef4444' },
    { label: 'Available Beds', value: rooms.reduce((acc, r) => acc + (r.capacity - r.occupied), 0), icon: <CheckCircle />, color: '#10b981' }
  ];

  const [floorFilter, setFloorFilter] = useState('All');
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.room_no.includes(searchTerm);
    const matchesFloor = floorFilter === 'All' || r.floor.includes(floorFilter);
    return matchesSearch && matchesFloor;
  });

  return (
    <div style={{ padding: spacing.padding, backgroundColor: palette.bgBody, color: palette.textMain, minHeight: '100vh', transition: 'all 0.4s ease' }}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', 
              backgroundColor: toast.isError ? '#EF4444' : palette.textMain, color: palette.bgCard, padding: '16px 32px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-xl)',
              zIndex: 2000, fontWeight: 700, fontSize: '0.9rem'
            }}
          >
            {toast.isError ? <XCircle size={18} color="#ffffff" /> : <CheckCircle size={18} color="#10b981" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs / Back */}
      <div style={{ marginBottom: '40px' }}>
         <button 
           onClick={() => navigate('/dashboard/hostel')}
           style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'none', backgroundColor: 'transparent', color: palette.textMuted, fontWeight: 800, cursor: 'pointer', padding: 0 }}
         >
           <ChevronLeft size={20} /> Back to Hostel List
         </button>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.gap, flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: spacing.fontSizeTitle, fontWeight: 950, color: palette.textMain, letterSpacing: '-1.5px', marginBottom: '8px', transition: 'font-size 0.3s' }}>Room Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span style={{ color: palette.textMuted, fontSize: spacing.fontSizeSub, fontWeight: 500 }}>Configuring units for</span>
             <span style={{ padding: '6px 14px', backgroundColor: palette.primaryLight, color: palette.primary, borderRadius: '10px', fontWeight: 900, fontSize: '0.9rem' }}>{hostelId}</span>
          </div>
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
            onClick={() => handleOpenForm()}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px', 
              backgroundColor: palette.primary, color: 'white', borderRadius: '18px', 
              border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer',
              boxShadow: `0 10px 20px ${palette.primaryLight}`, transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            <Plus size={20} /> Add New Room
          </button>
        </div>
      </div>


      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.gap, marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            style={{ 
              padding: spacing.cardPadding, 
              backgroundColor: palette.bgCard, 
              borderRadius: spacing.borderRadius, 
              boxShadow: palette.shadow, 
              border: `1.5px solid ${palette.borderColor}`, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '24px',
              backdropFilter: palette.backdrop
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
               <div style={{ fontSize: '1.75rem', fontWeight: 950, color: palette.textMain }}>{stat.value}</div>
               <div style={{ color: palette.textMuted, fontWeight: 700, fontSize: '0.85rem' }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
         <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: palette.textMuted }} size={20} />
            <input 
              type="text" 
              placeholder="Filter by room number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '20px 20px 20px 64px', borderRadius: '24px', 
                border: `1.5px solid ${palette.borderColor}`, backgroundColor: palette.bgCard, color: palette.textMain, fontSize: '1rem',
                fontWeight: 600, outline: 'none'
              }}
            />
         </div>
         <div style={{ position: 'relative' }}>
           <button 
             onClick={() => setShowFloorDropdown(!showFloorDropdown)}
             style={{ 
               padding: '20px 32px', borderRadius: '24px', 
               border: `1px solid ${palette.borderColor}`, 
               backgroundColor: palette.bgCard, 
               fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', 
               color: palette.textMain, cursor: 'pointer', transition: 'all 0.2s ease'
             }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = palette.bgCard}
           >
              <Filter size={18} /> {floorFilter === 'All' ? 'Floor Filter' : `${floorFilter} Floor`}
           </button>
           
           <AnimatePresence>
             {showFloorDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ 
                    position: 'absolute', top: '110%', right: 0, width: '200px', 
                    backgroundColor: palette.bgCard, borderRadius: '24px', padding: '12px', 
                    boxShadow: palette.shadow, border: `1.5px solid ${palette.borderColor}`, zIndex: 10 
                  }}
                >
                  {['All', '1st', '2nd', '3rd', '4th'].map((floor) => (
                    <button 
                      key={floor}
                      onClick={() => { setFloorFilter(floor); setShowFloorDropdown(false); }}
                      style={{ 
                        width: '100%', padding: '14px 20px', borderRadius: '16px', border: 'none', 
                        backgroundColor: floorFilter === floor ? palette.primaryLight : 'transparent', 
                        color: floorFilter === floor ? palette.primary : palette.textMuted,
                        textAlign: 'left', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => { if (floorFilter !== floor) e.currentTarget.style.backgroundColor = palette.bgBody; }}
                      onMouseOut={(e) => { if (floorFilter !== floor) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {floor === 'All' ? 'All Floors' : `${floor} Floor`}
                    </button>
                  ))}
                </motion.div>
             )}
           </AnimatePresence>
         </div>
      </div>

      {/* Rooms Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${spacing.gridMin}, 1fr))`, gap: spacing.gap }}>
        {filteredRooms.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: palette.textMuted, border: `2px dashed ${palette.borderColor}`, borderRadius: spacing.borderRadius, backgroundColor: palette.bgCard, backdropFilter: palette.backdrop }}>
            <DoorOpen size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 950, color: palette.textMain }}>No units found</div>
            <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>Try altering your search or floor filters.</p>
          </div>
        ) : (
          filteredRooms.map((room, i) => {
            const emptyColor = appearance.colors.empty || '#64748b';
            const fullColor = room.status === 'Full' ? (appearance.colors.full || '#ef4444') : (appearance.colors.available || '#10b981');
            
            return (
              <motion.div 
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  backgroundColor: palette.bgCard, borderRadius: spacing.borderRadius, padding: spacing.cardPadding, 
                  boxShadow: palette.shadow, border: `1.5px solid ${palette.borderColor}`,
                  position: 'relative', backdropFilter: palette.backdrop
                }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                       <div style={{ fontSize: '0.8rem', fontWeight: 900, color: palette.textMuted, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Room</div>
                       <h3 style={{ fontSize: '2rem', fontWeight: 950, color: palette.textMain, margin: 0 }}>{room.room_no}</h3>
                    </div>
                    <div style={{ 
                      padding: '8px 16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900, 
                      backgroundColor: room.status === 'Full' ? 'rgba(239, 68, 68, 0.15)' : room.status === 'Available' ? 'rgba(16, 185, 129, 0.15)' : palette.borderColor,
                      color: room.status === 'Full' ? (appearance.colors.full || '#ef4444') : room.status === 'Available' ? (appearance.colors.available || '#10b981') : palette.textMuted
                    }}>
                      {room.status}
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <span style={{ padding: '6px 12px', backgroundColor: palette.bgBody, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: palette.textMain }}>{room.floor} Floor</span>
                    <span style={{ padding: '6px 12px', backgroundColor: palette.primaryLight, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: palette.primary }}>{room.type}</span>
                 </div>

                 <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 800, color: palette.textMuted }}>Capacity</span>
                       <span style={{ fontSize: '0.9rem', fontWeight: 900, color: palette.textMain }}>{room.occupied} / {room.capacity} Beds Occupied</span>
                    </div>

                    {/* Dynamic Occupancy Visualizers */}
                    {appearance.occupancyStyle === 'progressbar' && (
                      <div style={{ height: '8px', backgroundColor: palette.bgBody, borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                         <div style={{ 
                           width: `${(room.occupied / room.capacity) * 100}%`, 
                           backgroundColor: fullColor,
                           transition: 'width 0.4s ease'
                         }} />
                      </div>
                    )}

                    {appearance.occupancyStyle === 'dots' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                         {[...Array(room.capacity)].map((_, idx) => {
                           const filled = idx < room.occupied;
                           return (
                             <div 
                               key={idx} 
                               style={{ 
                                 width: '28px', height: '28px', borderRadius: '50%', 
                                 backgroundColor: filled ? fullColor : 'transparent',
                                 border: `2px solid ${filled ? fullColor : emptyColor}`,
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 boxShadow: filled ? `0 0 8px ${fullColor}40` : 'none',
                                 transition: 'all 0.2s'
                               }}
                             >
                               <Bed size={12} color={filled ? '#ffffff' : emptyColor} />
                             </div>
                           );
                         })}
                      </div>
                    )}

                    {appearance.occupancyStyle === 'numeric' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <div style={{ fontSize: '1.4rem', fontWeight: 950, color: fullColor }}>
                           {room.occupied} / {room.capacity}
                         </div>
                         <div style={{ fontSize: '0.85rem', color: palette.textMuted, fontWeight: 700 }}>beds reserved</div>
                      </div>
                    )}
                 </div>

                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                    {room.amenities.map((a, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: palette.textMuted }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: palette.borderColor }}></div>
                        {a}
                      </div>
                    ))}
                 </div>

                 <div style={{ display: 'flex', gap: '12px', borderTop: `1px solid ${palette.borderColor}`, paddingTop: '24px' }}>
                    <button 
                      onClick={() => setShowOccupantsModal(room)}
                      style={{ 
                        flex: 1, padding: '14px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, 
                        backgroundColor: palette.bgCard, color: palette.textMain, fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = palette.bgCard}
                    >
                      View Students
                    </button>
                    <button 
                      onClick={() => setShowActionsMenu(room)} 
                      style={{ 
                        width: '48px', height: '48px', borderRadius: '14px', border: `1px solid ${palette.borderColor}`, 
                        backgroundColor: palette.bgCard, color: palette.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = palette.bgBody}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = palette.bgCard}
                    >
                       <MoreVertical size={20} />
                    </button>
                 </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* DUAL ADD / EDIT ROOM MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowAddModal(false)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               style={{ 
                 position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', 
                 borderRadius: '32px', padding: '48px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', zIndex: 10
               }}
             >
                <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '32px' }}>
                  {editingRoom ? 'Edit Room Unit' : 'Add New Unit'}
                </h2>
                <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Room Number *</label>
                      <input 
                        required type="text" placeholder="e.g. 305"
                        value={newRoom.number} onChange={(e) => setNewRoom({...newRoom, number: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                      />
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Floor</label>
                        <select 
                          value={newRoom.floor} onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                          style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                           <option value="1">1st Floor</option>
                           <option value="2">2nd Floor</option>
                           <option value="3">3rd Floor</option>
                           <option value="4">4th Floor</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Room Type</label>
                        <select 
                          value={newRoom.type} onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                          style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
                        >
                           <option>Standard</option>
                           <option>Premium</option>
                           <option>Economy</option>
                        </select>
                      </div>
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '10px' }}>Capacity (Beds) *</label>
                      <input 
                        required type="number" min="1"
                        value={newRoom.capacity} onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                      />
                   </div>
                   <button type="submit" style={{ padding: '18px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: '12px', boxShadow: '0 10px 20px var(--primary-light)' }}>
                     {editingRoom ? 'Save Changes' : 'Register Room'}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Occupants Modal */}
      <AnimatePresence>
        {showOccupantsModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowOccupantsModal(null)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               style={{ 
                 position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', 
                 borderRadius: '32px', padding: '48px', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)',
                 maxHeight: '80vh', overflowY: 'auto', zIndex: 10
               }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                   <div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', margin: 0 }}>Room {showOccupantsModal.room_no} Residents</h2>
                      <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem', marginTop: '8px' }}>
                        Currently housing {(rooms.find(r => r.id === showOccupantsModal.id)?.occupied || 0)} students.
                      </p>
                   </div>
                   <button 
                     onClick={() => setShowOccupantsModal(null)}
                     style={{ width: '48px', height: '48px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ef4444' }}
                   >
                      <XCircle size={24} />
                   </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {(() => {
                     const currentRoomData = rooms.find(r => r.id === showOccupantsModal.id) || showOccupantsModal;
                     const occupants = currentRoomData.occupants || [];
                     return occupants.length > 0 ? (
                       occupants.map((student, idx) => (
                         <motion.div 
                           key={student.id || idx}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           style={{ 
                             padding: '20px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', 
                             border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px' 
                           }}
                         >
                            <div style={{ 
                              width: '56px', 
                              height: '56px', 
                              borderRadius: '16px', 
                              overflow: 'hidden', 
                              border: '2px solid var(--border-color)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              backgroundColor: 'var(--primary-light)'
                            }}>
                              <img 
                                src={student.avatar} 
                                alt={student.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => { 
                                  e.target.style.display = 'none'; 
                                  const fb = e.target.nextSibling;
                                  if (fb) fb.style.display = 'flex'; 
                                }}
                              />
                              <span style={{ 
                                display: 'none', 
                                width: '100%', 
                                height: '100%', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 900, 
                                color: 'var(--primary)',
                                fontSize: '1.2rem'
                              }}>
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div style={{ flex: 1 }}>
                               <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                  {student.name}
                               </div>
                               <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                  Class {student.class} • {student.id}
                               </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => { setShowOccupantsModal(null); navigate(`/dashboard/student-details/${student.id}`); }}
                                style={{ 
                                  padding: '10px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', 
                                  backgroundColor: 'var(--bg-card)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s ease' 
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                              >
                                 Profile
                              </button>
                              <button 
                                onClick={() => handleRemoveStudent(currentRoomData, student.id)}
                                style={{ 
                                  padding: '10px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', 
                                  backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease' 
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                                title="Remove student from room"
                              >
                                 <Trash2 size={16} />
                              </button>
                            </div>
                         </motion.div>
                       ))
                     ) : (
                        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                           <ShieldAlert size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                           <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>No Residents Found</div>
                           <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>This unit is currently vacant and ready for allotment.</p>
                        </div>
                     );
                   })()}
                </div>

                {(() => {
                  const currentRoomData = rooms.find(r => r.id === showOccupantsModal.id) || showOccupantsModal;
                  return currentRoomData.occupied < currentRoomData.capacity ? (
                    <button 
                      onClick={() => { handleQuickAllot(currentRoomData); }}
                      style={{ width: '100%', padding: '18px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: '32px', boxShadow: '0 10px 20px var(--primary-light)' }}
                    >
                       Allot New Student
                    </button>
                  ) : null;
                })()}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK OPERATIONS BOTTOM SHEET ACTION DRAWER */}
      <AnimatePresence>
        {showActionsMenu && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setShowActionsMenu(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              style={{ 
                width: '100%', maxWidth: '360px', backgroundColor: 'var(--bg-card)', 
                borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', 
                zIndex: 10, padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-main)' }}>Room Operations</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Managing Unit {showActionsMenu.room_no}</p>
                </div>
                <button onClick={() => setShowActionsMenu(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '4px 0' }} />

              <button 
                onClick={() => {
                  setShowActionsMenu(null);
                  handleOpenForm(showActionsMenu);
                }} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', 
                  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', cursor: 'pointer', 
                  fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', transition: 'all 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
              >
                <Edit size={18} style={{ color: 'var(--primary)' }} /> Edit Unit parameters
              </button>

              <button 
                onClick={() => handleSafetyInspection(showActionsMenu)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', 
                  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', cursor: 'pointer', 
                  fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', transition: 'all 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
              >
                <Shield size={18} style={{ color: '#10b981' }} /> Log Safety Inspection
              </button>

              <button 
                onClick={() => handleQuickAllot(showActionsMenu)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', 
                  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', cursor: 'pointer', 
                  fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', transition: 'all 0.2s ease' 
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
              >
                <Plus size={18} style={{ color: '#06b6d4' }} /> Allot Student (Quick Bed Add)
              </button>

              <button 
                onClick={() => handleDeleteRoom(showActionsMenu.id)} 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
              >
                <Trash2 size={18} /> De-register Unit
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRM DELETE DIALOG */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }} onClick={() => setDeleteConfirmId(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-xl)', textAlign: 'center', border: '1px solid var(--border-color)', zIndex: 10 }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>De-register Unit</h3>
              <p style={{ margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                Are you sure you want to de-register this hostel room unit? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDeleteConfirmId(null)} 
                  style={{ 
                    flex: 1, padding: '14px', borderRadius: '14px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-main)', 
                    fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                >
                  Go Back
                </button>
                <button 
                  onClick={() => {
                    const target = rooms.find(r => r.id === deleteConfirmId);
                    if (target) {
                      const updated = rooms.filter(r => r.id !== deleteConfirmId);
                      persist(updated);
                      showToast(`Hostel room unit ${target.room_no} has been de-registered.`);
                    }
                    setDeleteConfirmId(null);
                  }} 
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  De-register
                </button>
              </div>
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

export default HostelRooms;
