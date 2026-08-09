import React, { useState } from 'react';
import { BookOpen, Plus, Users, ChevronRight, X, Trash2, Save, User, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const teacherAvatars = {
  'Ananya Iyer': 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Iyer',
  'Jane Smith': 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma',
  'Sunita Sharma': 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita%20Sharma',
  'Robert Wilson': 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
  'Rajesh Verma': 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh%20Verma',
  'Emily Davis': 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel',
  'Priya Patel': 'https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Patel',
  'Mrs. Sarah Parker': 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair',
  'Mrs. Aditi Nair': 'https://api.dicebear.com/7.x/initials/svg?seed=Aditi%20Nair',
  'Mr. David Miller': 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Bose',
  'Mr. Amit Bose': 'https://api.dicebear.com/7.x/initials/svg?seed=Amit%20Bose',
  'Ms. Elena Gilbert': 'https://api.dicebear.com/7.x/initials/svg?seed=Kavita%20Krishnan',
  'Ms. Kavita Krishnan': 'https://api.dicebear.com/7.x/initials/svg?seed=Kavita%20Krishnan',
  'Mr. Stefan Salvatore': 'https://api.dicebear.com/7.x/initials/svg?seed=Sameer%20Khan',
  'Mr. Sameer Khan': 'https://api.dicebear.com/7.x/initials/svg?seed=Sameer%20Khan'
};

const Classes = () => {
  const [classesList, setClassesList] = useState([
    { id: 1, name: 'Class 10', sections: ['Section A', 'Section B'], students: 45, teacher: 'Ananya Iyer' },
    { id: 2, name: 'Class 9', sections: ['Section A', 'Section C'], students: 38, teacher: 'Rajesh Verma' },
    { id: 3, name: 'Class 8', sections: ['Section B'], students: 42, teacher: 'Priya Patel' },
  ]);

  const teachersList = [
    'Ananya Iyer',
    'Sunita Sharma',
    'Rajesh Verma',
    'Priya Patel',
    'Mrs. Aditi Nair',
    'Mr. Amit Bose',
    'Ms. Kavita Krishnan',
    'Mr. Sameer Khan'
  ];

  // Create Class Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassTeacher, setNewClassTeacher] = useState(teachersList[0]);
  const [newClassSection, setNewClassSection] = useState('Section A');
  const [newClassStudents, setNewClassStudents] = useState(30);

  // Add Section Modal States
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [selectedClassForSection, setSelectedClassForSection] = useState(null);
  const [newSectionName, setNewSectionName] = useState('');

  // Class Details & Edit Modal States (Arrow Button)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [editClassTeacher, setEditClassTeacher] = useState('');
  const [editClassStudents, setEditClassStudents] = useState(0);
  const [editClassSections, setEditClassSections] = useState([]);
  const [tempSectionInput, setTempSectionInput] = useState('');

  // Handlers
  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const sectionsArray = newClassSection
      ? newClassSection.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : ['Section A'];

    const newClass = {
      id: Date.now(),
      name: newClassName,
      sections: sectionsArray,
      students: Number(newClassStudents) || 0,
      teacher: newClassTeacher
    };

    setClassesList([...classesList, newClass]);
    
    // Reset fields
    setNewClassName('');
    setNewClassTeacher(teachersList[0]);
    setNewClassSection('Section A');
    setNewClassStudents(30);
    setIsCreateOpen(false);
  };

  const handleOpenAddSection = (cls) => {
    setSelectedClassForSection(cls);
    setNewSectionName('');
    setIsAddSectionOpen(true);
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim() || !selectedClassForSection) return;

    setClassesList(classesList.map(cls => {
      if (cls.id === selectedClassForSection.id) {
        if (cls.sections.includes(newSectionName.trim())) return cls;
        return {
          ...cls,
          sections: [...cls.sections, newSectionName.trim()]
        };
      }
      return cls;
    }));

    setIsAddSectionOpen(false);
    setSelectedClassForSection(null);
    setNewSectionName('');
  };

  const handleOpenEdit = (cls) => {
    setSelectedClass(cls);
    setEditClassName(cls.name);
    setEditClassTeacher(cls.teacher);
    setEditClassStudents(cls.students);
    setEditClassSections([...cls.sections]);
    setTempSectionInput('');
    setIsEditOpen(true);
  };

  const handleUpdateClass = (e) => {
    e.preventDefault();
    if (!editClassName.trim() || !selectedClass) return;

    setClassesList(classesList.map(cls => {
      if (cls.id === selectedClass.id) {
        return {
          ...cls,
          name: editClassName,
          teacher: editClassTeacher,
          students: Number(editClassStudents) || 0,
          sections: editClassSections
        };
      }
      return cls;
    }));

    setIsEditOpen(false);
    setSelectedClass(null);
  };

  const handleDeleteClass = (id) => {
    if (window.confirm("Are you sure you want to delete this class? All associated sections and student records will be removed.")) {
      setClassesList(classesList.filter(cls => cls.id !== id));
      setIsEditOpen(false);
      setSelectedClass(null);
    }
  };

  const removeSectionFromEditList = (secToRemove) => {
    setEditClassSections(editClassSections.filter(sec => sec !== secToRemove));
  };

  const addSectionToEditList = () => {
    if (!tempSectionInput.trim() || editClassSections.includes(tempSectionInput.trim())) return;
    setEditClassSections([...editClassSections, tempSectionInput.trim()]);
    setTempSectionInput('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Class & Section Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure academic classes, manage student limits, assign class teachers, and configure sections.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary" 
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px' }}
        >
          <Plus size={20} /> Create Class
        </motion.button>
      </div>

      <div className="grid-2">
        {classesList.map((cls) => (
          <motion.div 
            layout
            className="card" 
            key={cls.id} 
            style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', transition: '0.3s' }}
            whileHover={{ y: -4, borderColor: 'var(--primary)', boxShadow: 'var(--shadow-lg)' }}
          >
            <div style={{ padding: '20px 24px', backgroundColor: 'var(--primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '10px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 0, color: 'var(--text-main)' }}>{cls.name}</h2>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', backgroundColor: 'rgba(72,128,255,0.1)', padding: '6px 12px', borderRadius: '30px' }}>
                {cls.students} Students
              </span>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Sections</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {cls.sections.map((sec, i) => (
                    <span key={i} style={{ padding: '6px 14px', backgroundColor: 'var(--bg-body)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>{sec}</span>
                  ))}
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(72,128,255,0.05)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOpenAddSection(cls)}
                    style={{ background: 'none', border: '1px dashed var(--primary)', color: 'var(--primary)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Add
                  </motion.button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>
                    {teacherAvatars[cls.teacher] ? (
                      <img src={teacherAvatars[cls.teacher]} alt={cls.teacher} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      cls.teacher.charAt(0)
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Class Teacher</p>
                    <p style={{ fontWeight: 800, margin: 0, color: 'var(--text-main)', fontSize: '0.9rem' }}>{cls.teacher}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOpenEdit(cls)}
                  className="icon-btn"
                  style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', transition: '0.2s' }}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CREATE CLASS MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => setIsCreateOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={24} color="var(--primary)" /> Create Academic Class
              </h2>

              <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Class Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Class 11" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Class Teacher</label>
                  <select 
                    value={newClassTeacher}
                    onChange={(e) => setNewClassTeacher(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                  >
                    {teachersList.map((t, idx) => (
                      <option key={idx} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Starting Sections (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Section A, Section B" 
                    value={newClassSection}
                    onChange={(e) => setNewClassSection(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Student Count</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 30" 
                    value={newClassStudents}
                    onChange={(e) => setNewClassStudents(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsCreateOpen(false)}
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
                    Create Class
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD SECTION MODAL */}
      <AnimatePresence>
        {isAddSectionOpen && selectedClassForSection && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '400px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => {
                  setIsAddSectionOpen(false);
                  setSelectedClassForSection(null);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
                Add New Section
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Add section for <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{selectedClassForSection.name}</span></p>

              <form onSubmit={handleAddSection} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Section Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Section C" 
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    required
                    autoFocus
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAddSectionOpen(false);
                      setSelectedClassForSection(null);
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
                    Add Section
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ARROW BUTTON: CLASS DETAILS & EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && selectedClass && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '550px', width: '100%', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', position: 'relative' }}
            >
              <button 
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedClass(null);
                }}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '4px', color: 'var(--text-main)' }}>
                Edit {selectedClass.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Modify academic parameters, manage sections and reassign details.</p>

              <form onSubmit={handleUpdateClass} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Class Name</label>
                  <input 
                    type="text" 
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Class Teacher</label>
                    <select 
                      value={editClassTeacher}
                      onChange={(e) => setEditClassTeacher(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                    >
                      {teachersList.map((t, idx) => (
                        <option key={idx} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Student Count</label>
                    <input 
                      type="number" 
                      value={editClassStudents}
                      onChange={(e) => setEditClassStudents(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Manage Sections List */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Sections Management</label>
                  
                  {/* Inline list of current sections in edit mode */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                    {editClassSections.length > 0 ? (
                      editClassSections.map((sec, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            padding: '4px 10px 4px 12px', 
                            backgroundColor: 'var(--bg-card)', 
                            borderRadius: '8px', 
                            fontSize: '0.8rem', 
                            fontWeight: 700, 
                            border: '1px solid var(--border-color)', 
                            color: 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {sec}
                          <button 
                            type="button"
                            onClick={() => removeSectionFromEditList(sec)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--danger)', 
                              cursor: 'pointer', 
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-light)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>No sections configured. Add one below.</p>
                    )}
                  </div>

                  {/* Add section inline */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Add section (e.g. Section C)" 
                      value={tempSectionInput}
                      onChange={(e) => setTempSectionInput(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSectionToEditList();
                        }
                      }}
                    />
                    <button 
                      type="button"
                      onClick={addSectionToEditList}
                      className="btn btn-primary"
                      style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem' }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={() => handleDeleteClass(selectedClass.id)}
                    className="btn" 
                    style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', border: 'none', padding: '12px 20px' }}
                  >
                    <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Delete Class
                  </motion.button>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsEditOpen(false);
                        setSelectedClass(null);
                      }}
                      className="btn" 
                      style={{ backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Classes;
