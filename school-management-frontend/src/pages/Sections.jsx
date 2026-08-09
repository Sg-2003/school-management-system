import React, { useState } from 'react';
import { Layers, Plus, Users, Edit, Trash2, Search, Filter, X, Save, BookOpen, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eleanorAvatar from '../assets/eleanor_avatar.png';

const teacherAvatars = {
  'Sunita Rao': 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Rao',
  'Meeta Devi': 'https://api.dicebear.com/7.x/initials/svg?seed=Meeta%20Devi',
  'Rajesh Verma': 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
  'Divya Joshi': 'https://api.dicebear.com/7.x/initials/svg?seed=Divya%20Joshi',
  'Mrs. Priya Patel': 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel',
  'Mr. Rajesh Malhotra': 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Malhotra',
  'Ms. Ananya Iyer': 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Iyer',
  'Mr. Amit Bose': 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Bose'
};

const Sections = () => {
  const [sections, setSections] = useState([
    { id: 1, name: 'Section A', class: 'Class 10', strength: 40, room: 'Room 101', teacher: 'Sunita Rao' },
    { id: 2, name: 'Section B', class: 'Class 10', strength: 38, room: 'Room 102', teacher: 'Mr. Rajesh Malhotra' },
    { id: 3, name: 'Section A', class: 'Class 9', strength: 42, room: 'Room 201', teacher: 'Ms. Ananya Iyer' },
    { id: 4, name: 'Section C', class: 'Class 8', strength: 35, room: 'Room 305', teacher: 'Mr. Amit Bose' },
  ]);

  const classesList = ['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6'];
  
  const teachersList = [
    'Sunita Rao',
    'Mrs. Priya Patel',
    'Mr. Rajesh Malhotra',
    'Ms. Ananya Iyer',
    'Mr. Amit Bose',
    'Meeta Devi',
    'Rajesh Verma',
    'Divya Joshi'
  ];

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All Classes');
  const [minStrength, setMinStrength] = useState(0);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Add Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSecName, setNewSecName] = useState('');
  const [newSecClass, setNewSecClass] = useState(classesList[0]);
  const [newSecStrength, setNewSecStrength] = useState(35);
  const [newSecRoom, setNewSecRoom] = useState('');
  const [newSecTeacher, setNewSecTeacher] = useState(teachersList[0]);

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editSecName, setEditSecName] = useState('');
  const [editSecClass, setEditSecClass] = useState('');
  const [editSecStrength, setEditSecStrength] = useState(0);
  const [editSecRoom, setEditSecRoom] = useState('');
  const [editSecTeacher, setEditSecTeacher] = useState('');

  // Handlers
  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSecName.trim() || !newSecRoom.trim()) return;

    const newSection = {
      id: Date.now(),
      name: newSecName,
      class: newSecClass,
      strength: Number(newSecStrength) || 0,
      room: newSecRoom,
      teacher: newSecTeacher
    };

    setSections([...sections, newSection]);

    // Reset fields
    setNewSecName('');
    setNewSecClass(classesList[0]);
    setNewSecStrength(35);
    setNewSecRoom('');
    setNewSecTeacher(teachersList[0]);
    setIsAddOpen(false);
  };

  const handleOpenEdit = (sec) => {
    setSelectedSection(sec);
    setEditSecName(sec.name);
    setEditSecClass(sec.class);
    setEditSecStrength(sec.strength);
    setEditSecRoom(sec.room);
    setEditSecTeacher(sec.teacher);
    setIsEditOpen(true);
  };

  const handleUpdateSection = (e) => {
    e.preventDefault();
    if (!editSecName.trim() || !editSecRoom.trim() || !selectedSection) return;

    setSections(sections.map(sec => {
      if (sec.id === selectedSection.id) {
        return {
          ...sec,
          name: editSecName,
          class: editSecClass,
          strength: Number(editSecStrength) || 0,
          room: editSecRoom,
          teacher: editSecTeacher
        };
      }
      return sec;
    }));

    setIsEditOpen(false);
    setSelectedSection(null);
  };

  const handleDeleteSection = (id) => {
    if (window.confirm("Are you sure you want to delete this section? All associated student seating maps and allocations will be deleted.")) {
      setSections(sections.filter(sec => sec.id !== id));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setClassFilter('All Classes');
    setMinStrength(0);
  };

  // Filtered Sections
  const filteredSections = sections.filter(sec => {
    const matchesSearch = 
      sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.room.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesClass = classFilter === 'All Classes' || sec.class === classFilter;
    const matchesStrength = sec.strength >= minStrength;

    return matchesSearch && matchesClass && matchesStrength;
  });

  const activeFiltersCount = 
    (classFilter !== 'All Classes' ? 1 : 0) + 
    (minStrength > 0 ? 1 : 0);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Sections Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage school sections, class assignments, and room allocations.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={() => setIsAddOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
        >
          <Plus size={20} /> Add New Section
        </motion.button>
      </div>

      {/* SEARCH AND FILTERS PANEL */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search sections, classes or teachers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn" 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '10px', 
              backgroundColor: showFilterPanel ? 'var(--primary-light)' : 'var(--bg-body)', 
              border: `1px solid ${showFilterPanel ? 'var(--primary)' : 'var(--border-color)'}`, 
              color: showFilterPanel ? 'var(--primary)' : 'var(--text-main)',
              padding: '12px 20px', fontWeight: 700 
            }}
          >
            <Filter size={18} /> Filters {activeFiltersCount > 0 && <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.75rem', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{activeFiltersCount}</span>}
          </motion.button>
        </div>

        {/* Sliding Filters Panel */}
        <AnimatePresence>
          {showFilterPanel && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-color)', marginTop: '16px', paddingTop: '16px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '20px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Class Filter</label>
                  <select 
                    value={classFilter} 
                    onChange={(e) => setClassFilter(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', cursor: 'pointer' }}
                  >
                    <option value="All Classes">All Classes</option>
                    {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Min Section Strength ({minStrength} students)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={minStrength} 
                    onChange={(e) => setMinStrength(Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', height: '6px', borderRadius: '3px', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'transparent', marginBottom: '8px', userSelect: 'none' }}>Spacer</label>
                  <button 
                    onClick={clearFilters}
                    className="btn" 
                    style={{ width: '100%', height: '42px', padding: 0, backgroundColor: 'transparent', border: '1px dashed var(--danger)', color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTIONS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        <AnimatePresence>
          {filteredSections.length > 0 ? (
            filteredSections.map((section, idx) => (
              <motion.div 
                layout
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="card"
                style={{ padding: '24px', border: '1px solid var(--border-color)', transition: '0.3s', position: 'relative' }}
                whileHover={{ y: -5, borderColor: 'var(--primary)', boxShadow: 'var(--shadow-lg)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--primary-light)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Layers size={24} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button 
                      whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-body)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleOpenEdit(section)}
                      style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1, backgroundColor: 'var(--danger-light)' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteSection(section.id)}
                      style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px', color: 'var(--text-main)' }}>{section.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>{section.class}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Room</p>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>{section.room}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Students</p>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>{section.strength} Seated</p>
                  </div>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.75rem' }}>
                    {teacherAvatars[section.teacher] ? (
                      <img src={teacherAvatars[section.teacher]} alt={section.teacher} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      section.teacher.charAt(section.teacher.indexOf(' ') + 1) || section.teacher.charAt(0)
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Class Teacher</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{section.teacher}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 24px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
              <Layers size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>No Sections Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No sections matched your current search filters. Try clearing them above.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ADD SECTION MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => setIsAddOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={24} color="var(--primary)" /> Add New Section
              </h2>

              <form onSubmit={handleAddSection} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Section Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Section D" 
                    value={newSecName}
                    onChange={(e) => setNewSecName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Assign Class</label>
                    <select 
                      value={newSecClass}
                      onChange={(e) => setNewSecClass(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Room Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Room 404" 
                      value={newSecRoom}
                      onChange={(e) => setNewSecRoom(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Students Strength</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 35" 
                      value={newSecStrength}
                      onChange={(e) => setNewSecStrength(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Class Teacher</label>
                    <select 
                      value={newSecTeacher}
                      onChange={(e) => setNewSecTeacher(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {teachersList.map((t, idx) => (
                        <option key={idx} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsAddOpen(false)}
                    className="btn" 
                    style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '100%' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                  >
                    Add Section
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SECTION MODAL */}
      <AnimatePresence>
        {isEditOpen && selectedSection && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedSection(null);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'var(--text-main)' }}>
                Edit Section
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Modify the layout, capacity, teacher assignment or classroom location details.</p>

              <form onSubmit={handleUpdateSection} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Section Name</label>
                  <input 
                    type="text" 
                    value={editSecName}
                    onChange={(e) => setEditSecName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Assign Class</label>
                    <select 
                      value={editSecClass}
                      onChange={(e) => setEditSecClass(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {classesList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Room Number</label>
                    <input 
                      type="text" 
                      value={editSecRoom}
                      onChange={(e) => setEditSecRoom(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Students Strength</label>
                    <input 
                      type="number" 
                      value={editSecStrength}
                      onChange={(e) => setEditSecStrength(Number(e.target.value))}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Class Teacher</label>
                    <select 
                      value={editSecTeacher}
                      onChange={(e) => setEditSecTeacher(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {teachersList.map((t, idx) => (
                        <option key={idx} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditOpen(false);
                      setSelectedSection(null);
                    }}
                    className="btn" 
                    style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)', width: '100%' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                  >
                    Save Changes
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

export default Sections;
