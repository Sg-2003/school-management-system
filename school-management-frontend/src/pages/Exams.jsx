import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Calendar, Trophy, Search, Filter, 
  MoreVertical, ChevronRight, BookOpen, Clock, AlertCircle,
  Download, CheckCircle2, Layout, GraduationCap, TrendingUp, Users, X, Check, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Exams = () => {
  // Core Exams Roster State
  const [exams, setExams] = useState([
    { id: 'EXM-001', name: 'Mid-Term Examination 2026', type: 'Main', startDate: '2026-05-15', endDate: '2026-05-25', status: 'Upcoming', students: 450, color: 'var(--primary)', room: 'Hall A', invigilators: ['Dr. Sunita Rao'] },
    { id: 'EXM-002', name: 'Weekly Quiz - Mathematics', type: 'Quiz', startDate: '2026-05-10', endDate: '2026-05-10', status: 'Ongoing', students: 42, color: '#10B981', room: 'Hall B', invigilators: ['Devi Joshi'] },
    { id: 'EXM-003', name: 'Pre-Board Assessment', type: 'Internal', startDate: '2026-06-01', endDate: '2026-06-15', status: 'Scheduled', students: 120, color: '#F59E0B', room: 'Science Lab 3', invigilators: ['Prof. Amit Bose'] },
  ]);

  // Filtering & Dropdown States
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals & Drawers States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResultsPortal, setShowResultsPortal] = useState(false);
  const [activeManageExam, setActiveManageExam] = useState(null);
  const [examToast, setExamToast] = useState(null);

  // Dropdown & Edit states
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [editExamId, setEditExamId] = useState(null);

  // Active Results Portal Publishing Switch
  const [isResultsPublished, setIsResultsPublished] = useState(false);

  // Create Exam Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    type: 'Main',
    startDate: '',
    endDate: '',
    students: 100
  });

  // Manage Exam Extra Local States
  const [roomAllocation, setRoomAllocation] = useState('Hall A');
  const [rosteredInvigilators, setRosteredInvigilators] = useState(['Dr. Sunita Rao']);

  // Handle Toast helper
  const triggerToast = (msg) => {
    setExamToast(msg);
    setTimeout(() => setExamToast(null), 3000);
  };

  // Dynamic Statistics
  const getStats = () => {
    const totalStudents = exams.reduce((sum, e) => sum + e.students, 0);
    return {
      activeExams: String(exams.filter(e => e.status === 'Ongoing' || e.status === 'Upcoming').length).padStart(2, '0'),
      completedExams: '12', // baseline mock
      participatingStudents: totalStudents.toLocaleString(),
      avgScore: '78%'
    };
  };

  const stats = getStats();

  // Dynamic Filtering Logic
  const filteredExams = exams.filter(exam => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      exam.name.toLowerCase().includes(query) || 
      exam.id.toLowerCase().includes(query) ||
      exam.type.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    // 2. Type Filter
    if (selectedType !== 'All' && exam.type !== selectedType) {
      return false;
    }

    // 3. Status Filter
    if (selectedStatus !== 'All' && exam.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // CSV List Exporter
  const handleExportExams = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Exam ID,Exam Name,Type,Start Date,End Date,Status,Registered Students\n"
      + filteredExams.map(e => 
          `"${e.id}","${e.name}","${e.type}","${e.startDate}","${e.endDate}","${e.status}",${e.students}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `exams_schedule_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Exams roster exported successfully!');
  };

  // Increment student count in Manage Exam Drawer
  const handleRegisterMoreStudents = (examId) => {
    setExams(prev => prev.map(exam => {
      if (exam.id === examId) {
        const updated = { ...exam, students: exam.students + 1 };
        // Sync active manage drawer if matching
        if (activeManageExam && activeManageExam.id === examId) {
          setActiveManageExam(updated);
        }
        return updated;
      }
      return exam;
    }));
    triggerToast('Added +1 registered student!');
  };

  // Handle Room Allocation change per-exam
  const handleRoomChange = (examId, room) => {
    setExams(prev => prev.map(e => e.id === examId ? { ...e, room } : e));
    triggerToast(`Room allocated: ${room}`);
  };

  // Toggle Invigilator roster per-exam
  const toggleInvigilatorForExam = (examId, name) => {
    setExams(prev => prev.map(e => {
      if (e.id === examId) {
        const invs = e.invigilators || [];
        const updatedInvs = invs.includes(name)
          ? invs.filter(n => n !== name)
          : [...invs, name];
        
        triggerToast(invs.includes(name) ? `${name} removed from roster.` : `${name} rostered for exam.`);
        return { ...e, invigilators: updatedInvs };
      }
      return e;
    }));
  };

  // Handle Post New Exam Submit / Edit Exam Submit
  const handleCreateExamSubmit = (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.startDate || !createForm.endDate) {
      triggerToast('Please fill out Exam Name and Dates.');
      return;
    }

    let typeColor = 'var(--primary)';
    if (createForm.type === 'Quiz') typeColor = '#10B981';
    else if (createForm.type === 'Internal') typeColor = '#F59E0B';

    if (editExamId) {
      // Editing Mode
      setExams(prev => prev.map(exam => {
        if (exam.id === editExamId) {
          return {
            ...exam,
            name: createForm.name,
            type: createForm.type,
            startDate: createForm.startDate,
            endDate: createForm.endDate,
            students: Number(createForm.students) || 0,
            color: typeColor
          };
        }
        return exam;
      }));
      triggerToast('Exam schedule updated successfully!');
      setEditExamId(null);
    } else {
      // Creation Mode
      const nextIdNumber = exams.length + 1;
      const newExam = {
        id: `EXM-${String(nextIdNumber).padStart(3, '0')}`,
        name: createForm.name,
        type: createForm.type,
        startDate: createForm.startDate,
        endDate: createForm.endDate,
        status: 'Upcoming',
        students: Number(createForm.students) || 0,
        color: typeColor,
        room: 'Hall A',
        invigilators: ['Dr. Sunita Rao']
      };

      setExams(prev => [newExam, ...prev]);
      triggerToast('New institutional exam created!');
    }

    setShowCreateModal(false);
    
    // Reset Form
    setCreateForm({
      name: '',
      type: 'Main',
      startDate: '',
      endDate: '',
      students: 100
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditExamId(null);
    setCreateForm({
      name: '',
      type: 'Main',
      startDate: '',
      endDate: '',
      students: 100
    });
  };

  // Dynamic room allocation read
  const currentRoomAllocation = activeManageExam ? (exams.find(e => e.id === activeManageExam.id)?.room || 'Hall A') : 'Hall A';
  
  // Dynamic invigilators allocation read
  const currentInvigilators = activeManageExam ? (exams.find(e => e.id === activeManageExam.id)?.invigilators || []) : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', position: 'relative' }}
    >
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {examToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            style={{ 
              position: 'fixed', top: '100px', left: '50%', transform: 'translateX(-50%)', 
              backgroundColor: 'rgba(15,23,42,0.95)', color: 'white', padding: '12px 32px', 
              borderRadius: '20px', zIndex: 3000, fontWeight: 800, fontSize: '0.9rem', 
              boxShadow: 'var(--shadow-2xl)', display: 'flex', alignItems: 'center', gap: '10px' 
            }}
          >
            <Check size={16} color="#10B981" /> {examToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
               <Layout size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Examination Management</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 955, margin: 0, letterSpacing: '-1px' }}>Institutional Exams</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Create, manage, and monitor all institutional examinations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              className="btn" 
              onClick={handleExportExams}
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Download size={18} /> EXPORT LIST
           </button>
           <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer' }}
           >
              <Plus size={18} /> CREATE NEW EXAM
           </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
         {[
           { label: 'Active Exams', value: stats.activeExams, icon: <FileText size={20} />, color: 'var(--primary)', sub: 'This Month' },
           { label: 'Completed', value: stats.completedExams, icon: <CheckCircle2 size={20} />, color: '#10B981', sub: 'Last Quarter' },
           { label: 'Participating', value: stats.participatingStudents, icon: <GraduationCap size={20} />, color: '#8B5CF6', sub: 'Total Students' },
           { label: 'Avg Score', value: stats.avgScore, icon: <TrendingUp size={20} />, color: '#F59E0B', sub: 'Institutional' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-main)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>{stat.sub}</div>
               </div>
            </div>
         ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
         {/* Main Exams card list */}
         <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {/* Table Header Filter & Search */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(0,0,0,0.02)' }}>
               <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                     <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search exam name or ID..." 
                        style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
                     />
                  </div>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn" 
                    style={{ 
                      backgroundColor: showFilters || selectedType !== 'All' || selectedStatus !== 'All' ? 'var(--primary-light)' : 'white', 
                      border: `1px solid ${showFilters || selectedType !== 'All' || selectedStatus !== 'All' ? 'var(--primary)' : 'var(--border-color)'}`, 
                      color: showFilters || selectedType !== 'All' || selectedStatus !== 'All' ? 'var(--primary)' : 'var(--text-muted)',
                      padding: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                     <Filter size={18} />
                  </button>
               </div>

               {/* Collapsible Filters Row */}
               <AnimatePresence>
                 {showFilters && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     style={{ overflow: 'hidden', display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '8px' }}
                   >
                     {/* Type Filter */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '140px' }}>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>EXAM TYPE</span>
                       <select 
                         value={selectedType}
                         onChange={(e) => setSelectedType(e.target.value)}
                         style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                       >
                         <option value="All">All Types</option>
                         <option value="Main">Main Exams</option>
                         <option value="Quiz">Quizzes</option>
                         <option value="Internal">Internal Assessments</option>
                       </select>
                     </div>

                     {/* Status Filter */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '140px' }}>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STATUS</span>
                       <select 
                         value={selectedStatus}
                         onChange={(e) => setSelectedStatus(e.target.value)}
                         style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                       >
                         <option value="All">All Statuses</option>
                         <option value="Upcoming">Upcoming</option>
                         <option value="Ongoing">Ongoing</option>
                         <option value="Scheduled">Scheduled</option>
                         <option value="Completed">Completed</option>
                       </select>
                     </div>

                     {/* Clear Filter Button */}
                     <button
                       onClick={() => { setSelectedType('All'); setSelectedStatus('All'); setSearchQuery(''); }}
                       style={{ alignSelf: 'flex-end', padding: '10px 16px', borderRadius: '10px', border: 'none', backgroundColor: 'transparent', color: 'var(--danger)', fontWeight: 800, cursor: 'pointer' }}
                     >
                       Reset Filters
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Exams list grid content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {filteredExams.length === 0 ? (
                 <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                   No examinations scheduled for these parameters.
                 </div>
               ) : (
                 filteredExams.map((exam) => (
                    <div key={exam.id} className="hover-card" style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s', backgroundColor: 'var(--bg-card)' }}>
                       <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${exam.color}15`, color: exam.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <BookOpen size={28} />
                          </div>
                          <div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>{exam.name}</h3>
                                <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, backgroundColor: exam.status === 'Ongoing' ? '#10B98115' : 'var(--bg-body)', color: exam.status === 'Ongoing' ? '#10B981' : 'var(--text-muted)', textTransform: 'uppercase' }}>{exam.status}</span>
                             </div>
                             <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                   <Calendar size={14} color="var(--primary)" /> {exam.startDate} - {exam.endDate}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                   <Users size={14} color="#8B5CF6" /> {exam.students} Registered
                                </div>
                             </div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button 
                            className="btn" 
                            onClick={() => setActiveManageExam(exam)}
                            style={{ fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}
                          >
                            MANAGE
                          </button>
                           <div style={{ position: 'relative' }}>
                              <button 
                                className="btn-icon" 
                                onClick={() => setActiveDropdownId(activeDropdownId === exam.id ? null : exam.id)}
                                style={{ backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}
                              >
                                <MoreVertical size={18} />
                              </button>
                              <AnimatePresence>
                                {activeDropdownId === exam.id && (
                                  <>
                                    <div 
                                      onClick={() => setActiveDropdownId(null)} 
                                      style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                      style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        marginTop: '8px',
                                        backgroundColor: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        boxShadow: 'var(--shadow-lg)',
                                        zIndex: 95,
                                        width: '180px',
                                        padding: '6px',
                                        textAlign: 'left',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px'
                                      }}
                                    >
                                      <button
                                        onClick={() => {
                                          setCreateForm({
                                            name: exam.name,
                                            type: exam.type,
                                            startDate: exam.startDate,
                                            endDate: exam.endDate,
                                            students: exam.students
                                          });
                                          setEditExamId(exam.id);
                                          setShowCreateModal(true);
                                          setActiveDropdownId(null);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          width: '100%',
                                          padding: '10px 12px',
                                          border: 'none',
                                          backgroundColor: 'transparent',
                                          color: 'var(--text-main)',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 700,
                                          transition: 'background 0.2s'
                                        }}
                                        className="dropdown-item"
                                      >
                                        <Edit3 size={14} /> Edit Exam
                                      </button>
                                      <button
                                        onClick={() => {
                                          setActiveManageExam(exam);
                                          setActiveDropdownId(null);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          width: '100%',
                                          padding: '10px 12px',
                                          border: 'none',
                                          backgroundColor: 'transparent',
                                          color: 'var(--text-main)',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 700,
                                          transition: 'background 0.2s'
                                        }}
                                        className="dropdown-item"
                                      >
                                        <Layout size={14} /> Manage Schedule
                                      </button>
                                      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                                      <button
                                        onClick={() => {
                                          const nextStatus = exam.status === 'Completed' ? 'Upcoming' : 'Completed';
                                          setExams(prev => prev.map(e => e.id === exam.id ? { ...e, status: nextStatus } : e));
                                          triggerToast(`Status changed to ${nextStatus}.`);
                                          setActiveDropdownId(null);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          width: '100%',
                                          padding: '10px 12px',
                                          border: 'none',
                                          backgroundColor: 'transparent',
                                          color: 'var(--text-main)',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 700,
                                          transition: 'background 0.2s'
                                        }}
                                        className="dropdown-item"
                                      >
                                        <Check size={14} /> Mark {exam.status === 'Completed' ? 'Upcoming' : 'Completed'}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setExams(prev => prev.filter(item => item.id !== exam.id));
                                          triggerToast(`Exam deleted successfully.`);
                                          setActiveDropdownId(null);
                                        }}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          width: '100%',
                                          padding: '10px 12px',
                                          border: 'none',
                                          backgroundColor: 'transparent',
                                          color: '#EF4444',
                                          borderRadius: '8px',
                                          cursor: 'pointer',
                                          fontSize: '0.8rem',
                                          fontWeight: 700,
                                          transition: 'background 0.2s'
                                        }}
                                        className="dropdown-item-danger"
                                      >
                                        <X size={14} /> Delete
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                           </div>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Sidebar Actions */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Upcoming Deadlines */}
            <div className="card" style={{ padding: '24px', borderRadius: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 955, marginBottom: '20px', color: 'var(--text-main)' }}>Upcoming Deadlines</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { title: 'Result Submission', date: 'Tomorrow, 5 PM', color: '#EF4444' },
                    { title: 'Question Paper Approval', date: 'May 12, 10 AM', color: '#F59E0B' },
                    { title: 'Invigilation List', date: 'May 14, 2 PM', color: 'var(--primary)' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                       <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.date}</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Results Portal Card */}
            <div className="card" style={{ padding: '24px', borderRadius: '32px', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 955, marginBottom: '12px' }}>Result Portal</h3>
               <p style={{ fontSize: '0.85rem', lineHeight: 1.6, opacity: 0.9, fontWeight: 600, marginBottom: '20px' }}>
                  Annual academic results for the current session are now ready for publication.
               </p>
               <button 
                 onClick={() => setShowResultsPortal(true)}
                 className="btn" 
                 style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontWeight: 800, fontSize: '0.8rem', width: '100%', cursor: 'pointer', transition: 'all 0.2s' }}
                 onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                 onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
               >
                  GO TO RESULTS
               </button>
            </div>
         </div>
      </div>

      {/* Slide-out Drawer Overlay for Managing Exam */}
      <AnimatePresence>
        {activeManageExam && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveManageExam(null)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '450px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                padding: '32px', overflowY: 'auto' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: activeManageExam.color, backgroundColor: `${activeManageExam.color}15`, padding: '4px 10px', borderRadius: '8px', textTransform: 'uppercase' }}>
                    {activeManageExam.type} EXAM SCHEDULE
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)', margin: '12px 0 4px' }}>{activeManageExam.name}</h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Exam ID: {activeManageExam.id}</span>
                </div>
                <button 
                  onClick={() => setActiveManageExam(null)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contents */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                {/* Registered Students Increment */}
                <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>REGISTERED STUDENTS</span>
                    <h4 style={{ margin: '4px 0 0', fontSize: '1.3rem', fontWeight: 950, color: 'var(--text-main)' }}>{activeManageExam.students}</h4>
                  </div>
                  <button 
                    onClick={() => handleRegisterMoreStudents(activeManageExam.id)}
                    style={{ padding: '8px 16px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', boxShadow: '0 4px 10px rgba(72,128,255,0.2)' }}
                  >
                    <Plus size={14} /> ADD STUDENT
                  </button>
                </div>

                {/* Date & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>START DATE</span>
                    <h4 style={{ margin: '6px 0 0', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--primary)" /> {activeManageExam.startDate}
                    </h4>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>END DATE</span>
                    <h4 style={{ margin: '6px 0 0', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--primary)" /> {activeManageExam.endDate}
                    </h4>
                  </div>
                </div>

                {/* Room Allocation dropdown selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>ALLOCATE EXAMINATION HALL</label>
                  <select 
                    value={currentRoomAllocation}
                    onChange={(e) => handleRoomChange(activeManageExam.id, e.target.value)}
                    style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
                  >
                    {['Hall A', 'Hall B', 'Science Lab 3', 'Computer Center 2', 'Auditorium Main'].map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                </div>

                {/* Invigilator roster checklists */}
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-main)' }}>Assign Invigilators</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Dr. Sunita Rao', 'Prof. Amit Bose', 'Devi Joshi', 'Rajinder Singh'].map((name) => {
                      const isAssigned = currentInvigilators.includes(name);
                      return (
                        <div 
                          key={name}
                          onClick={() => toggleInvigilatorForExam(activeManageExam.id, name)}
                          style={{ 
                            padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', 
                            backgroundColor: isAssigned ? 'var(--primary-light)' : 'var(--bg-body)', 
                            color: isAssigned ? 'var(--primary)' : 'var(--text-main)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                            cursor: 'pointer', transition: '0.2s', fontWeight: 700, fontSize: '0.85rem'
                          }}
                        >
                          <span>{name}</span>
                          <input 
                            type="checkbox" 
                            checked={isAssigned} 
                            readOnly
                            style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Drawer Overlay for Results Portal */}
      <AnimatePresence>
        {showResultsPortal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResultsPortal(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '480px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                padding: '32px', overflowY: 'auto' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Trophy size={24} color="#8B5CF6" />
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)', margin: 0 }}>Results Publication Portal</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Publish academic score reports to the student portal.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowResultsPortal(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contents */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                {/* Publish Toggle switch */}
                <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>Publish Results to Portal</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isResultsPublished ? 'Visible to students and parents.' : 'Draft state. Locked for adjustments.'}
                    </p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={isResultsPublished}
                    onChange={(e) => {
                      setIsResultsPublished(e.target.checked);
                      triggerToast(e.target.checked ? 'Academic scores published to student portal!' : 'Scores unpublished.');
                    }}
                    style={{ width: '40px', height: '20px', accentColor: '#8B5CF6', cursor: 'pointer' }}
                  />
                </div>

                {/* Score stats */}
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-main)' }}>Institutional Subject Averages</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { subject: 'Mathematics', average: '78%', accuracy: 78, color: 'var(--primary)' },
                      { subject: 'Physics', average: '82%', accuracy: 82, color: '#8B5CF6' },
                      { subject: 'History', average: '89%', accuracy: 89, color: '#10B981' },
                      { subject: 'Chemistry', average: '72%', accuracy: 72, color: '#F59E0B' }
                    ].map((subj) => (
                      <div key={subj.subject} style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                          <span>{subj.subject}</span>
                          <span style={{ color: 'var(--text-main)' }}>{subj.average}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${subj.accuracy}%`, height: '100%', backgroundColor: subj.color, borderRadius: '10px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      const csvContent = [
                        ['Subject', 'Average Score'],
                        ['Mathematics', '78%'],
                        ['Physics', '82%'],
                        ['History', '89%'],
                        ['Chemistry', '72%']
                      ].map(e => e.join(",")).join("\n");
                      
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `Institutional_Subject_Averages.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      triggerToast('Averages report exported!');
                    }}
                    className="btn"
                    style={{ padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '0.8rem', width: '100%', cursor: 'pointer', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(72,128,255,0.2)' }}
                  >
                    <Download size={14} /> EXPORT SUBJECT AVERAGES
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create New Exam Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Modal Container */}
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ 
                  width: '500px', maxWidth: '95%', backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', borderRadius: '28px', 
                  boxShadow: 'var(--shadow-2xl)', display: 'flex', flexDirection: 'column', 
                  overflow: 'hidden'
                }}
              >
                {/* Header */}
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 955, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {editExamId ? (
                      <>
                        <Edit3 size={20} color="var(--primary)" /> Edit Exam Schedule
                      </>
                    ) : (
                      <>
                        <Plus size={20} color="var(--primary)" /> Schedule New Exam
                      </>
                    )}
                  </h2>
                  <button 
                    onClick={handleCloseCreateModal}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateExamSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>EXAMINATION NAME *</label>
                    <input 
                      type="text" 
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Annual Physics Lab Board Exam"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>EXAM SUBJECT / TYPE</label>
                      <select 
                        value={createForm.type}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['Main', 'Quiz', 'Internal'].map(t => (
                          <option key={t} value={t}>{t} Exam</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>REGISTERED STUDENTS</label>
                      <input 
                        type="number" 
                        value={createForm.students}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, students: e.target.value }))}
                        placeholder="e.g. 120"
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>START DATE *</label>
                      <input 
                        type="date" 
                        value={createForm.startDate}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, startDate: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>END DATE *</label>
                      <input 
                        type="date" 
                        value={createForm.endDate}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, endDate: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button 
                      type="button"
                      onClick={handleCloseCreateModal}
                      style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
                    >
                      {editExamId ? 'Save Changes' : 'Create Schedule'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Exams;
