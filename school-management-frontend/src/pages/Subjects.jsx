import React, { useState } from 'react';
import { BookOpen, Plus, Search, Filter, Edit2, Trash, Book, X, Save, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Subjects = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', code: 'MATH101', type: 'Core', classes: ['10th', '11th', '12th'], teacher: 'Dr. Rajesh Malhotra' },
    { id: 2, name: 'Physics', code: 'PHY202', type: 'Core', classes: ['11th', '12th'], teacher: 'Prof. Sanjay Gupta' },
    { id: 3, name: 'English Literature', code: 'ENG105', type: 'Language', classes: ['9th', '10th'], teacher: 'Ms. Sunita Rao' },
    { id: 4, name: 'Computer Science', code: 'CS303', type: 'Elective', classes: ['11th', '12th'], teacher: 'Mr. Amit Bose' },
    { id: 5, name: 'History', code: 'HIS102', type: 'Humanities', classes: ['8th', '9th', '10th'], teacher: 'Dr. Devendra Mishra' },
  ]);

  const teachersList = [
    'Dr. Rajesh Malhotra',
    'Prof. Sanjay Gupta',
    'Ms. Sunita Rao',
    'Mr. Amit Bose',
    'Dr. Devendra Mishra',
    'Meeta Devi',
    'Rajesh Verma',
    'Ananya Iyer'
  ];

  const typesList = ['Core', 'Language', 'Elective', 'Humanities'];

  const typeColors = {
    'Core': { bg: '#eef2ff', text: '#4f46e5' },
    'Language': { bg: '#ecfdf5', text: '#10b981' },
    'Elective': { bg: '#fef3c7', text: '#d97706' },
    'Humanities': { bg: '#fdf2f8', text: '#db2777' }
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Add Subject Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState(typesList[0]);
  const [newClasses, setNewClasses] = useState('10th, 11th');
  const [newTeacher, setNewTeacher] = useState(teachersList[0]);

  // Edit Subject Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editType, setEditType] = useState('');
  const [editClasses, setEditClasses] = useState('');
  const [editTeacher, setEditTeacher] = useState('');

  // Add Handler
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim()) return;

    const classesArray = newClasses
      ? newClasses.split(',').map(c => c.trim()).filter(c => c.length > 0)
      : ['10th'];

    const newSubject = {
      id: Date.now(),
      name: newName,
      code: newCode.toUpperCase(),
      type: newType,
      classes: classesArray,
      teacher: newTeacher
    };

    setSubjects([...subjects, newSubject]);

    // Reset fields
    setNewName('');
    setNewCode('');
    setNewType(typesList[0]);
    setNewClasses('10th, 11th');
    setNewTeacher(teachersList[0]);
    setIsAddOpen(false);
  };

  // Edit Handlers
  const handleOpenEdit = (sub) => {
    setSelectedSubject(sub);
    setEditName(sub.name);
    setEditCode(sub.code);
    setEditType(sub.type);
    setEditClasses(sub.classes.join(', '));
    setEditTeacher(sub.teacher);
    setIsEditOpen(true);
  };

  const handleUpdateSubject = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editCode.trim() || !selectedSubject) return;

    const classesArray = editClasses
      ? editClasses.split(',').map(c => c.trim()).filter(c => c.length > 0)
      : ['10th'];

    setSubjects(subjects.map(sub => {
      if (sub.id === selectedSubject.id) {
        return {
          ...sub,
          name: editName,
          code: editCode.toUpperCase(),
          type: editType,
          classes: classesArray,
          teacher: editTeacher
        };
      }
      return sub;
    }));

    setIsEditOpen(false);
    setSelectedSubject(null);
  };

  // Delete Handler
  const handleDeleteSubject = (id) => {
    if (window.confirm("Are you sure you want to delete this subject? All associated syllabus entries, assignment types and teacher tasks will be dropped.")) {
      setSubjects(subjects.filter(sub => sub.id !== id));
    }
  };

  // Filter Logic
  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All Types' || sub.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Subjects Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive list of curriculum subjects and faculty assignments.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={() => setIsAddOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
        >
          <Plus size={20} /> Add New Subject
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          {/* SEARCH & FILTERS HEADER */}
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
             <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input 
                  type="text" 
                  placeholder="Search by subject name or code..." 
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
               <Filter size={18} /> Filter: {typeFilter}
             </motion.button>
          </div>

          {/* Sliding Filter Bar */}
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}
              >
                <div style={{ padding: '16px 24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '10px' }}>Curriculum Type:</span>
                  <button 
                    onClick={() => setTypeFilter('All Types')}
                    style={{ 
                      padding: '8px 16px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                      backgroundColor: typeFilter === 'All Types' ? 'var(--primary)' : 'var(--bg-card)',
                      color: typeFilter === 'All Types' ? 'white' : 'var(--text-main)',
                      border: `1px solid ${typeFilter === 'All Types' ? 'var(--primary)' : 'var(--border-color)'}`
                    }}
                  >
                    All Types
                  </button>
                  {typesList.map((t, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setTypeFilter(t)}
                      style={{ 
                        padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                        backgroundColor: typeFilter === t ? 'var(--primary)' : 'var(--bg-card)',
                        color: typeFilter === t ? 'white' : 'var(--text-main)',
                        border: `1px solid ${typeFilter === t ? 'var(--primary)' : 'var(--border-color)'}`
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBJECTS DIRECTORY TABLE */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Subject</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Code</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applicable Classes</th>
                  <th style={{ padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>HOD / Faculty</th>
                  <th style={{ padding: '20px 24px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject, idx) => (
                      <motion.tr 
                        layout
                        key={subject.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ borderBottom: '1px solid var(--border-color)', transition: '0.2s' }}
                      >
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Book size={18} />
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>{subject.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>{subject.code}</td>
                        <td style={{ padding: '20px 24px' }}>
                          <span style={{ 
                            padding: '6px 12px', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800,
                            backgroundColor: typeColors[subject.type]?.bg || '#f1f5f9',
                            color: typeColors[subject.type]?.text || '#475569'
                          }}>
                            {subject.type}
                          </span>
                        </td>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {subject.classes.map((cls, i) => (
                              <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--bg-body)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>{cls}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GraduationCap size={16} color="var(--primary)" />
                            {subject.teacher}
                          </div>
                        </td>
                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: 'var(--bg-body)' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleOpenEdit(subject)}
                              style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-body)', color: 'var(--primary)', cursor: 'pointer' }}
                            >
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1, backgroundColor: 'var(--danger-light)' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteSubject(subject.id)}
                              style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', cursor: 'pointer' }}
                            >
                              <Trash size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <BookOpen size={40} style={{ opacity: 0.5, marginBottom: '12px' }} />
                        <p style={{ margin: 0, fontWeight: 700 }}>No curriculum subjects matched your search filters.</p>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD SUBJECT MODAL */}
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
                <Plus size={24} color="var(--primary)" /> Add Subject to Directory
              </h2>

              <form onSubmit={handleAddSubject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Subject Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Chemistry" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Subject Code</label>
                    <input 
                      type="text" 
                      placeholder="e.g. CHEM303" 
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Subject Type</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {typesList.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Applicable Classes (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 9th, 10th, 11th" 
                    value={newClasses}
                    onChange={(e) => setNewClasses(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>HOD / Assigned Faculty</label>
                  <select 
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                  >
                    {teachersList.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
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
                    Add Subject
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT SUBJECT MODAL */}
      <AnimatePresence>
        {isEditOpen && selectedSubject && (
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
                  setSelectedSubject(null);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'var(--text-main)' }}>
                Edit Subject Details
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Modify the subject profile parameters and reassigned faculty coordinates.</p>

              <form onSubmit={handleUpdateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Subject Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Subject Code</label>
                    <input 
                      type="text" 
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Subject Type</label>
                    <select 
                      value={editType}
                      onChange={(e) => setEditType(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {typesList.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Applicable Classes (comma separated)</label>
                  <input 
                    type="text" 
                    value={editClasses}
                    onChange={(e) => setEditClasses(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>HOD / Assigned Faculty</label>
                  <select 
                    value={editTeacher}
                    onChange={(e) => setEditTeacher(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                  >
                    {teachersList.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditOpen(false);
                      setSelectedSubject(null);
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

export default Subjects;
