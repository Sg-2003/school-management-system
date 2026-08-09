import React, { useState } from 'react';
import { 
  Calendar, Clock, BookOpen, MapPin, Search, Filter, 
  Download, Plus, ChevronLeft, ChevronRight, Layout,
  MoreVertical, Info, ShieldCheck, User, X, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamSchedule = () => {
  // Core Schedules State
  const [schedules, setSchedules] = useState([
    { id: 1, subject: 'Mathematics', date: '2026-05-15', time: '09:00 AM - 12:00 PM', venue: 'Hall A', class: '10A', invigilator: 'Dr. Sunita Rao', examGroup: 'Mid-Term 2026' },
    { id: 2, subject: 'Physics', date: '2026-05-17', time: '09:00 AM - 12:00 PM', venue: 'Hall B', class: '10A', invigilator: 'Prof. Amit Bose', examGroup: 'Mid-Term 2026' },
    { id: 3, subject: 'Chemistry', date: '2026-05-19', time: '09:00 AM - 12:00 PM', venue: 'Hall A', class: '10A', invigilator: 'Devi Joshi', examGroup: 'Mid-Term 2026' },
    { id: 4, subject: 'English', date: '2026-05-21', time: '01:00 PM - 04:00 PM', venue: 'Hall C', class: '10A', invigilator: 'Sanjay Gupta', examGroup: 'Mid-Term 2026' },
    { id: 5, subject: 'Biology', date: '2026-06-10', time: '09:00 AM - 12:00 PM', venue: 'Hall B', class: '11B', invigilator: 'Dr. Sunita Rao', examGroup: 'Final-Term 2026' },
    { id: 6, subject: 'History', date: '2026-06-12', time: '01:00 PM - 04:00 PM', venue: 'Hall C', class: '11B', invigilator: 'Devi Joshi', examGroup: 'Final-Term 2026' },
    { id: 7, subject: 'Algebra Quiz', date: '2026-05-08', time: '10:00 AM - 11:30 AM', venue: 'Room 204', class: '10A', invigilator: 'Dr. Sunita Rao', examGroup: 'Weekly Quiz' },
    { id: 8, subject: 'Mechanics Quiz', date: '2026-05-09', time: '10:00 AM - 11:30 AM', venue: 'Room 205', class: '12A', invigilator: 'Prof. Amit Bose', examGroup: 'Weekly Quiz' }
  ]);

  // Filtering States
  const [selectedExam, setSelectedExam] = useState('Mid-Term 2026');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // UI Interactive States
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Form State for Scheduling New Exam
  const [formInput, setFormInput] = useState({
    subject: '',
    examGroup: 'Mid-Term 2026',
    class: '10A',
    date: '',
    time: '09:00 AM - 12:00 PM',
    venue: '',
    invigilator: ''
  });

  // Unique Classes Selector List derived dynamically
  const classesList = ['All', ...new Set(schedules.map(item => item.class))].sort();

  // Trigger Glassmorphic Toast Notification Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Real-time Filtering Logic
  const filteredSchedules = schedules.filter(item => {
    // 1. Exam Group Filter
    if (selectedExam !== 'All' && item.examGroup !== selectedExam) {
      return false;
    }
    // 2. Class Filter
    if (selectedClass !== 'All' && item.class !== selectedClass) {
      return false;
    }
    // 3. Search Query text check
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchesSubject = item.subject.toLowerCase().includes(query);
      const matchesInvigilator = item.invigilator.toLowerCase().includes(query);
      const matchesVenue = item.venue.toLowerCase().includes(query);
      const matchesClass = item.class.toLowerCase().includes(query);
      return matchesSubject || matchesInvigilator || matchesVenue || matchesClass;
    }
    return true;
  });

  // Action: CSV Spreadsheet Downloader / Timetable Exporter
  const handleDownloadTimetable = () => {
    if (filteredSchedules.length === 0) {
      triggerToast("No schedules to export for current filters.");
      return;
    }

    const csvHeaders = "Subject,Exam Group,Class,Date,Time Slot,Venue,Invigilator\n";
    const csvRows = filteredSchedules.map(s => 
      `"${s.subject}","${s.examGroup}","${s.class}","${s.date}","${s.time}","${s.venue}","${s.invigilator}"`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + csvHeaders + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `exam_timetable_${selectedExam.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Exported ${filteredSchedules.length} exam timetable records!`);
  };

  // Action: Handle Scheduling Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formInput.subject || !formInput.date || !formInput.venue || !formInput.invigilator) {
      triggerToast("Please fill out all the required schedule fields.");
      return;
    }

    const newSlot = {
      id: Date.now(), // Unique ID
      subject: formInput.subject,
      examGroup: formInput.examGroup,
      class: formInput.class,
      date: formInput.date,
      time: formInput.time,
      venue: formInput.venue,
      invigilator: formInput.invigilator
    };

    setSchedules(prev => [newSlot, ...prev]);
    setShowAddModal(false);
    triggerToast(`Scheduled ${formInput.subject} successfully!`);

    // Reset Form (preset examGroup to the currently active page filter)
    setFormInput({
      subject: '',
      examGroup: selectedExam === 'All' ? 'Mid-Term 2026' : selectedExam,
      class: '10A',
      date: '',
      time: '09:00 AM - 12:00 PM',
      venue: '',
      invigilator: ''
    });
  };

  // Action: Handle Cancellation of an exam slot
  const handleDeleteSchedule = (id, subject) => {
    setSchedules(prev => prev.filter(item => item.id !== id));
    setActiveMenuId(null);
    triggerToast(`Cancelled exam slot for ${subject}.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
               <Calendar size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Timetable</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>Exam Schedules</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Manage subject-wise exam timings, venues, and invigilation assignments.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
           <button 
              className="btn" 
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, gap: '8px' }}
              onClick={handleDownloadTimetable}
           >
              <Download size={18} /> DOWNLOAD TIMETABLE
           </button>
           <button 
              className="btn btn-primary" 
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', gap: '8px' }}
              onClick={() => {
                // Pre-populate active group when triggering modal
                setFormInput(prev => ({
                  ...prev,
                  examGroup: selectedExam === 'All' ? 'Mid-Term 2026' : selectedExam
                }));
                setShowAddModal(true);
              }}
           >
              <Plus size={18} /> ADD SCHEDULE
           </button>
        </div>
      </div>

      {/* Selector & Search Filters */}
      <div className="card" style={{ padding: '20px 24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
         <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
               <div style={{ fontWeight: 850, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Select Exam:</div>
               <select 
                  className="form-input" 
                  style={{ width: '250px', borderRadius: '12px', padding: '10px 14px' }}
                  value={selectedExam}
                  onChange={(e) => {
                    setSelectedExam(e.target.value);
                    setSelectedClass('All'); // Reset sub-filters to prevent confusion
                  }}
               >
                  <option value="All">All Exam Categories</option>
                  <option value="Mid-Term 2026">Mid-Term Examination 2026</option>
                  <option value="Final-Term 2026">Final-Term Examination 2026</option>
                  <option value="Weekly Quiz">Weekly Assessment Quiz</option>
               </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
               <div style={{ fontWeight: 850, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class:</div>
               <select 
                  className="form-input" 
                  style={{ width: '150px', borderRadius: '12px', padding: '10px 14px' }}
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
               >
                  {classesList.map(c => (
                     <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>
                  ))}
               </select>
            </div>
         </div>

         <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
            <input 
               type="text" 
               placeholder="Search subject or invigilator..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               style={{ 
                  width: '100%', 
                  padding: '14px 44px 14px 48px', 
                  borderRadius: '14px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', 
                  outline: 'none', 
                  fontWeight: 600 
               }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ 
                  position: 'absolute', 
                  right: '16px', 
                  top: '15px', 
                  border: 'none', 
                  background: 'transparent', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
              >
                <X size={16} />
              </button>
            )}
         </div>
      </div>

      {/* Schedule Grid */}
      {filteredSchedules.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
           {filteredSchedules.map((item) => (
             <motion.div 
               key={item.id}
               whileHover={{ y: -5 }}
               className="card hover-card" 
               style={{ padding: '28px', borderRadius: '32px', position: 'relative', overflow: 'visible' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                   <div style={{ width: '56px', height: '56px', borderRadius: '18px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={28} />
                   </div>
                   
                   {/* More Options / Delete Action Dropdown */}
                   <div style={{ position: 'relative' }}>
                      <button 
                        className="btn-icon" 
                        style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                      >
                         <MoreVertical size={20} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === item.id && (
                          <>
                            <div 
                              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }} 
                              onClick={() => setActiveMenuId(null)} 
                            />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              style={{
                                 position: 'absolute',
                                 top: '32px',
                                 right: 0,
                                 backgroundColor: 'var(--bg-card)',
                                 border: '1px solid var(--border-color)',
                                 borderRadius: '12px',
                                 boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                 zIndex: 10,
                                 padding: '6px',
                                 minWidth: '160px',
                                 backdropFilter: 'blur(20px)'
                              }}
                            >
                               <button
                                  style={{
                                     width: '100%',
                                     padding: '10px 14px',
                                     display: 'flex',
                                     alignItems: 'center',
                                     gap: '8px',
                                     border: 'none',
                                     background: 'transparent',
                                     color: '#EF4444',
                                     fontSize: '0.85rem',
                                     fontWeight: 800,
                                     cursor: 'pointer',
                                     borderRadius: '8px',
                                     textAlign: 'left'
                                  }}
                                  onClick={() => handleDeleteSchedule(item.id, item.subject)}
                               >
                                  <Trash2 size={15} /> Cancel Allotment
                               </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                   </div>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: '0 0 16px 0' }}>{item.subject}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <Calendar size={16} color="var(--primary)" /> {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <Clock size={16} color="var(--primary)" /> {item.time}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <MapPin size={16} color="var(--primary)" /> {item.venue}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <User size={16} color="var(--primary)" /> {item.invigilator}
                   </div>
                </div>

                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 850, color: 'var(--primary)' }}>CLASS: {item.class}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 800, color: '#10B981' }}>
                      <ShieldCheck size={14} /> ALLOTTED
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           style={{ 
             padding: '80px 24px', 
             borderRadius: '32px', 
             border: '1px dashed var(--border-color)', 
             display: 'flex', 
             flexDirection: 'column', 
             alignItems: 'center', 
             justifyContent: 'center', 
             gap: '16px',
             backgroundColor: 'var(--bg-card)',
             color: 'var(--text-muted)',
             textAlign: 'center'
           }}
        >
           <BookOpen size={48} style={{ color: 'var(--primary)', opacity: 0.4 }} />
           <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 900, color: 'var(--text)' }}>No Exam Slots Found</h3>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Try altering your search text or selecting a different class filter.</p>
           </div>
        </motion.div>
      )}

      {/* Info Notice */}
      <div className="card" style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#F0F7FF', border: '1px solid #D1E9FF', display: 'flex', gap: '16px', alignItems: 'center' }}>
         <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#D1E9FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Info size={24} />
         </div>
         <p style={{ margin: 0, fontSize: '0.9rem', color: '#1E40AF', fontWeight: 600, lineHeight: 1.5 }}>
            Invigilators are requested to collect the question papers from the Examination Cell at least 30 minutes before the scheduled start time. 
            All hall arrangements must be verified by the Floor Supervisor.
         </p>
      </div>

      {/* Add Schedule Glassmorphic Modal */}
      <AnimatePresence>
         {showAddModal && (
            <div 
               style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
               }}
               onClick={() => setShowAddModal(false)}
            >
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', duration: 0.4 }}
                  style={{
                     width: '90%',
                     maxWidth: '560px',
                     backgroundColor: 'var(--bg-card)',
                     border: '1px solid var(--border-color)',
                     borderRadius: '32px',
                     padding: '36px',
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                     position: 'relative',
                     overflow: 'hidden'
                  }}
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Glassmorphic decorative background glow */}
                  <div style={{
                     position: 'absolute',
                     top: '-10%',
                     right: '-10%',
                     width: '200px',
                     height: '200px',
                     background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
                     zIndex: 0,
                     opacity: 0.4,
                     pointerEvents: 'none'
                  }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
                     <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Add Exam Schedule</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px', fontWeight: 600 }}>Create an exam slot timing, class, room, and assignment.</p>
                     </div>
                     <button 
                        className="btn-icon" 
                        style={{ border: '1px solid var(--border-color)', borderRadius: '14px', padding: '8px' }}
                        onClick={() => setShowAddModal(false)}
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Exam Category *</label>
                           <select 
                              className="form-input" 
                              style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                              value={formInput.examGroup}
                              onChange={(e) => setFormInput({ ...formInput, examGroup: e.target.value })}
                           >
                              <option value="Mid-Term 2026">Mid-Term Examination 2026</option>
                              <option value="Final-Term 2026">Final-Term Examination 2026</option>
                              <option value="Weekly Quiz">Weekly Assessment Quiz</option>
                           </select>
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Target Class *</label>
                           <select 
                              className="form-input" 
                              style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                              value={formInput.class}
                              onChange={(e) => setFormInput({ ...formInput, class: e.target.value })}
                           >
                              <option value="10A">Class 10A</option>
                              <option value="10B">Class 10B</option>
                              <option value="11A">Class 11A</option>
                              <option value="11B">Class 11B</option>
                              <option value="12A">Class 12A</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Subject Name *</label>
                        <input 
                           type="text" 
                           required
                           placeholder="e.g. Science" 
                           className="form-input"
                           style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                           value={formInput.subject}
                           onChange={(e) => setFormInput({ ...formInput, subject: e.target.value })}
                        />
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Exam Date *</label>
                           <input 
                              type="date" 
                              required
                              className="form-input"
                              style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                              value={formInput.date}
                              onChange={(e) => setFormInput({ ...formInput, date: e.target.value })}
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Time Duration *</label>
                           <select 
                              className="form-input" 
                              style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                              value={formInput.time}
                              onChange={(e) => setFormInput({ ...formInput, time: e.target.value })}
                           >
                              <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                              <option value="01:00 PM - 04:00 PM">01:00 PM - 04:00 PM</option>
                              <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                              <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                           </select>
                        </div>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Venue / Room No. *</label>
                           <input 
                              type="text" 
                              required
                              placeholder="e.g. Hall A" 
                              className="form-input"
                              style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                              value={formInput.venue}
                              onChange={(e) => setFormInput({ ...formInput, venue: e.target.value })}
                           />
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Assigned Invigilator *</label>
                           <input 
                              type="text" 
                              required
                              placeholder="e.g. Dr. Sunita Rao" 
                              className="form-input"
                              style={{ width: '100%', borderRadius: '12px', padding: '12px' }}
                              value={formInput.invigilator}
                              onChange={(e) => setFormInput({ ...formInput, invigilator: e.target.value })}
                           />
                        </div>
                     </div>

                     <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                        <button 
                           type="button" 
                           className="btn" 
                           style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border-color)', fontWeight: 800 }}
                           onClick={() => setShowAddModal(false)}
                        >
                           Cancel
                        </button>
                        <button 
                           type="submit" 
                           className="btn btn-primary" 
                           style={{ flex: 1, fontWeight: 900 }}
                        >
                           Schedule Slot
                        </button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ExamSchedule;
