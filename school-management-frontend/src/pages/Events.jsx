import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Star, Plus, Search, Filter, MoreVertical, ExternalLink, ChevronLeft, ChevronRight, User, X, Check, RefreshCw, Trash2, ArrowRight, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const initialEvents = [
    { id: 1, title: 'Annual Sports Day 2026', date: 'May 25', day: 'Wednesday', time: '09:00 AM', location: 'Main Stadium', category: 'Sports', attendees: 'Grade 1-12', status: 'Upcoming' },
    { id: 2, title: 'Global Science Symposium', date: 'June 05', day: 'Friday', time: '10:00 AM', location: 'Grand Auditorium', category: 'Academic', attendees: 'Faculty & Researchers', status: 'Upcoming' },
    { id: 3, title: 'Parent-Teacher Conference', date: 'June 15', day: 'Monday', time: '08:30 AM', location: 'Administrative Block', category: 'General', attendees: 'Parents & Teachers', status: 'Planning' },
    { id: 4, title: 'Inter-School Debate Final', date: 'June 22', day: 'Monday', time: '11:00 AM', location: 'Debate Hall', category: 'Co-Curricular', attendees: 'Debate Team', status: 'Draft' },
  ];

  // States
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('school_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [selectedEventForRoster, setSelectedEventForRoster] = useState(null);
  
  // Create Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    dateMonth: 'June',
    dateDay: '12',
    day: 'Thursday',
    time: '10:00 AM',
    location: '',
    category: 'Academic',
    attendees: '',
    status: 'Upcoming'
  });

  const [activeMonthYear, setActiveMonthYear] = useState({ monthNum: 4, monthName: 'May', year: 2026 }); // 0-indexed month
  const [isSyncing, setIsSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('school_events', JSON.stringify(events));
  }, [events]);

  const showToast = (message, type = 'success', action = null) => {
    setToast({ message, type, action });
  };

  useEffect(() => {
    if (toast) {
      const duration = toast.action ? 6000 : 3000;
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Google Calendar Sync Simulation
  const handleGoogleSync = () => {
    setIsSending(true);
    showToast('Connecting to Google Calendar API...', 'success');

    setTimeout(() => {
      // Add a simulated new event from Google Calendar if not already there
      const hasSyncedEvent = events.some(e => e.title === 'Board of Directors AGM');
      if (!hasSyncedEvent) {
        const syncedEvent = {
          id: Date.now(),
          title: 'Board of Directors AGM',
          date: 'June 18',
          day: 'Thursday',
          time: '02:00 PM',
          location: 'Executive Boardroom',
          category: 'General',
          attendees: 'Board Members',
          status: 'Upcoming'
        };
        setEvents(prev => [syncedEvent, ...prev]);
        showToast('Successfully synced 1 new event from Google Calendar!', 'success');
      } else {
        showToast('Google Calendar synchronization complete. All events up to date.', 'success');
      }
      setIsSending(false);
    }, 2000);
  };

  // Create Event Submission
  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim() || !newEvent.location.trim() || !newEvent.attendees.trim()) {
      showToast('Please fill out all fields', 'error');
      return;
    }

    const formattedDate = `${newEvent.dateMonth} ${newEvent.dateDay.padStart(2, '0')}`;
    const generatedEvent = {
      id: Date.now(),
      title: newEvent.title,
      date: formattedDate,
      day: newEvent.day,
      time: newEvent.time,
      location: newEvent.location,
      category: newEvent.category,
      attendees: newEvent.attendees,
      status: newEvent.status
    };

    setEvents([generatedEvent, ...events]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      dateMonth: 'June',
      dateDay: '12',
      day: 'Thursday',
      time: '10:00 AM',
      location: '',
      category: 'Academic',
      attendees: '',
      status: 'Upcoming'
    });

    showToast(`Event "${generatedEvent.title}" created successfully!`, 'success');
  };

  // Delete Event with high-fidelity Undo
  const handleDeleteEvent = (id) => {
    const targetEvent = events.find(e => e.id === id);
    if (!targetEvent) return;

    const eventIndex = events.findIndex(e => e.id === id);
    const updatedEvents = events.filter(e => e.id !== id);
    
    setEvents(updatedEvents);
    setActiveMenuId(null);

    showToast(`Deleted event: "${targetEvent.title}"`, 'success', {
      label: 'Undo',
      onClick: () => {
        setEvents(prev => {
          const restored = [...prev];
          restored.splice(eventIndex, 0, targetEvent);
          return restored;
        });
        showToast('Event restored successfully!', 'success');
      }
    });
  };

  // Cycle Status
  const handleCycleStatus = (id) => {
    const statuses = ['Draft', 'Planning', 'Upcoming'];
    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        const currentIndex = statuses.indexOf(e.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const nextStatus = statuses[nextIndex];
        showToast(`Changed status of "${e.title}" to ${nextStatus}`, 'success');
        return { ...e, status: nextStatus };
      }
      return e;
    }));
    setActiveMenuId(null);
  };

  // Month navigation simulation
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const handleMonthPrev = () => {
    setActiveMonthYear(prev => {
      let newMonth = prev.monthNum - 1;
      let newYear = prev.year;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      return { monthNum: newMonth, monthName: months[newMonth], year: newYear };
    });
  };

  const handleMonthNext = () => {
    setActiveMonthYear(prev => {
      let newMonth = prev.monthNum + 1;
      let newYear = prev.year;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      return { monthNum: newMonth, monthName: months[newMonth], year: newYear };
    });
  };

  // Roster details generator for "Manage" option
  const mockRosters = {
    1: { expected: 450, accepted: 380, pending: 50, declined: 20, lead: 'Coach Rajesh Malhotra', participants: ['Amit Sharma (Student)', 'Aditi Nair (Parent)', 'Prof. Amit Sharma (Faculty)'] },
    2: { expected: 120, accepted: 95, pending: 15, declined: 10, lead: 'Dr. Sanjay Gupta', participants: ['Aarav Gupta (Researcher)', 'Prof. Priya Sharma (Faculty)', 'Isha Sen (Student)'] },
    3: { expected: 300, accepted: 240, pending: 40, declined: 20, lead: 'Principal Office', participants: ['Aditi Nair (Parent)', 'Rajesh Verma (Parent)', 'Prof. Amit Sharma (Faculty)'] },
    4: { expected: 50, accepted: 35, pending: 10, declined: 5, lead: 'Prof. Priya Sharma', participants: ['Amit Sharma (Student)', 'Neha Patel (Student)', 'Prof. Priya Sharma (Faculty)'] }
  };

  const handleOpenRoster = (event) => {
    const defaultRoster = { expected: 100, accepted: 75, pending: 20, declined: 5, lead: 'Administration', participants: ['Aditi Nair (Parent)', 'Amit Sharma (Student)', 'Prof. Amit Sharma (Faculty)'] };
    const roster = mockRosters[event.id] || defaultRoster;
    setSelectedEventForRoster({ event, roster });
    setShowRosterModal(true);
  };

  // Filter and search stream
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Institutional Event Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive management of academic, sporting, and social gatherings across the campus.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
             onClick={handleGoogleSync}
             disabled={isSyncing}
             className="btn" 
             style={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: '10px', 
               backgroundColor: 'var(--bg-card)', 
               border: '1px solid var(--border-color)',
               cursor: isSyncing ? 'not-allowed' : 'pointer',
               opacity: isSyncing ? 0.7 : 1
             }}
           >
              {isSyncing ? <RefreshCw size={20} className="spin" /> : <CalendarIcon size={20} />} 
              Sync Google Cal
           </button>
           <button 
             onClick={() => setShowCreateModal(true)}
             className="btn btn-primary" 
             style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer' }}
           >
              <Plus size={20} /> Create New Event
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
         {/* Main Event Stream */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
               <div style={{ position: 'relative', flex: 1 }}>
                  <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                  <input 
                    type="text" 
                    placeholder="Search events by name, venue, or category..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                  />
                  {searchQuery && (
                    <X 
                      size={16} 
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    />
                  )}
               </div>

               {/* Category Filter Select */}
               <div style={{ position: 'relative' }}>
                 <select 
                   value={selectedCategory} 
                   onChange={e => setSelectedCategory(e.target.value)}
                   style={{ 
                     padding: '12px 32px 12px 16px', 
                     borderRadius: '12px', 
                     border: '1px solid var(--border-color)', 
                     backgroundColor: 'var(--bg-card)', 
                     color: 'var(--text-main)', 
                     outline: 'none', 
                     fontWeight: 700,
                     cursor: 'pointer',
                     appearance: 'none',
                     backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'right 12px center',
                     backgroundSize: '14px'
                   }}
                 >
                    <option value="All">All Categories</option>
                    <option value="Sports">Sports</option>
                    <option value="Academic">Academic</option>
                    <option value="General">General</option>
                    <option value="Co-Curricular">Co-Curricular</option>
                 </select>
               </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                <CalendarIcon size={48} style={{ opacity: 0.15, marginBottom: '16px' }} />
                <p style={{ fontWeight: 800, margin: 0 }}>No matching events found</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>Try adjusting your search terms or selecting a different category.</p>
              </div>
            ) : (
              filteredEvents.map((event, idx) => (
                 <motion.div 
                   key={event.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="card"
                   style={{ padding: '0', overflow: 'visible', border: '1px solid var(--border-color)', display: 'flex', position: 'relative' }}
                   whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                 >
                    <div style={{ width: '120px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', flexShrink: 0 }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>{event.date.split(' ')[0]}</span>
                       <span style={{ fontSize: '2.5rem', fontWeight: 950, lineHeight: '1' }}>{event.date.split(' ')[1]}</span>
                       <span style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '4px', opacity: 0.9 }}>{event.day}</span>
                    </div>
  
                    <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ padding: '4px 10px', borderRadius: '30px', fontSize: '0.65rem', fontWeight: 900, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', textTransform: 'uppercase' }}>{event.category}</span>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: event.status === 'Upcoming' ? '#10b981' : event.status === 'Planning' ? '#f59e0b' : '#ef4444' }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>{event.status.toUpperCase()}</span>
                             </div>
                             <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>{event.title}</h3>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === event.id ? null : event.id)}
                              className="icon-btn"
                              style={{ cursor: 'pointer' }}
                            >
                              <MoreVertical size={18} />
                            </button>

                            {/* Dropdown Options Menu */}
                            <AnimatePresence>
                              {activeMenuId === event.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  style={{
                                    position: 'absolute', right: 0, top: '36px', zIndex: 100,
                                    width: '160px', backgroundColor: 'var(--bg-card)', borderRadius: '12px',
                                    border: '1px solid var(--border-color)', padding: '6px', boxShadow: 'var(--shadow-xl)'
                                  }}
                                >
                                   <button 
                                     onClick={() => handleCycleStatus(event.id)}
                                     style={{ 
                                       width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                                       borderRadius: '8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700,
                                       color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                     }}
                                     onMouseEnter={(el) => el.target.style.backgroundColor = 'var(--primary-light)'}
                                     onMouseLeave={(el) => el.target.style.backgroundColor = 'transparent'}
                                   >
                                      <Clock size={14} /> Toggle Status
                                   </button>
                                   <button 
                                     onClick={() => handleDeleteEvent(event.id)}
                                     style={{ 
                                       width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                                       borderRadius: '8px', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700,
                                       color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                     }}
                                     onMouseEnter={(el) => el.target.style.backgroundColor = 'rgba(239, 68, 68, 0.06)'}
                                     onMouseLeave={(el) => el.target.style.backgroundColor = 'transparent'}
                                   >
                                      <Trash2 size={14} /> Delete Event
                                   </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                       </div>
  
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                             <Clock size={16} /> {event.time}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                             <MapPin size={16} /> {event.location}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                             <User size={16} /> {event.attendees}
                          </div>
                       </div>
                    </div>
  
                    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--border-color)', flexShrink: 0 }}>
                       <button 
                         onClick={() => handleOpenRoster(event)}
                         className="btn" 
                         style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, cursor: 'pointer' }}
                       >
                          <ExternalLink size={16} /> Manage
                       </button>
                    </div>
                 </motion.div>
              ))
            )}
         </div>

         {/* Sidebar: Calendar Widget & Quick Stats */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    {activeMonthYear.monthName} {activeMonthYear.year}
                  </h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <button onClick={handleMonthPrev} className="icon-btn" style={{ width: '32px', height: '32px', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
                     <button onClick={handleMonthNext} className="icon-btn" style={{ width: '32px', height: '32px', cursor: 'pointer' }}><ChevronRight size={16} /></button>
                  </div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                     <span key={`${d}-${idx}`} style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', marginBottom: '8px' }}>{d}</span>
                  ))}
                  {[...Array(31)].map((_, i) => {
                     // Check if day matches any current event's day in activeMonth
                     const dayNumString = (i + 1).toString().padStart(2, '0');
                     const matchesEvent = events.some(e => {
                       const [m, d] = e.date.split(' ');
                       return m.toLowerCase().startsWith(activeMonthYear.monthName.slice(0,3).toLowerCase()) && d === dayNumString;
                     });

                     return (
                        <div key={i} style={{ 
                           padding: '8px 4px', fontSize: '0.75rem', fontWeight: 800, borderRadius: '8px', cursor: 'pointer',
                           backgroundColor: (i === 24 && activeMonthYear.monthName === 'May') ? 'var(--primary)' : matchesEvent ? 'var(--primary-light)' : 'transparent',
                           color: (i === 24 && activeMonthYear.monthName === 'May') ? 'white' : matchesEvent ? 'var(--primary)' : 'var(--text-main)',
                           border: matchesEvent ? '1px solid rgba(99, 102, 241, 0.3)' : 'none'
                        }}>
                           {i + 1}
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="card" style={{ padding: '24px', background: 'var(--primary-light)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
               <Star size={32} style={{ marginBottom: '16px' }} />
               <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', marginBottom: '8px' }}>Priority Highlight</h4>
               <p style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.9, lineHeight: '1.6' }}>The Annual Sports Day is the most anticipated event of the month. Ensure all logistics are verified by May 20th.</p>
            </div>
         </div>
      </div>

      {/* Create New Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '600px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '36px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Create Campus Event</h3>
                 <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Event Title</label>
                    <input 
                      required type="text" placeholder="e.g. Science Exhibition, Winter Gala..." 
                      value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                    />
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Month</label>
                       <select 
                         value={newEvent.dateMonth} onChange={e => setNewEvent({ ...newEvent, dateMonth: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       >
                          {months.map(m => <option key={m} value={m.slice(0,3)}>{m}</option>)}
                       </select>
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Day of Month</label>
                       <select 
                         value={newEvent.dateDay} onChange={e => setNewEvent({ ...newEvent, dateDay: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       >
                          {[...Array(31)].map((_, i) => {
                            const val = (i + 1).toString();
                            return <option key={val} value={val}>{val}</option>;
                          })}
                       </select>
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Day of Week</label>
                       <select 
                         value={newEvent.day} onChange={e => setNewEvent({ ...newEvent, day: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       >
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Time Slot</label>
                       <input 
                         required type="text" placeholder="e.g. 09:00 AM, 02:30 PM..." 
                         value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       />
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Venue Location</label>
                       <input 
                         required type="text" placeholder="e.g. Auditorium, Sports Complex..." 
                         value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       />
                    </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Category</label>
                       <select 
                         value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       >
                          <option>Academic</option>
                          <option>Sports</option>
                          <option>General</option>
                          <option>Co-Curricular</option>
                       </select>
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Attendees Scope</label>
                       <input 
                         required type="text" placeholder="e.g. Grade 10, Faculty..." 
                         value={newEvent.attendees} onChange={e => setNewEvent({ ...newEvent, attendees: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       />
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Initial Status</label>
                       <select 
                         value={newEvent.status} onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}
                         style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                       >
                          <option>Upcoming</option>
                          <option>Planning</option>
                          <option>Draft</option>
                       </select>
                    </div>
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn" style={{ padding: '12px 24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', cursor: 'pointer', border: 'none' }}>Create Event</button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Roster / Roster Management Modal */}
      <AnimatePresence>
        {showRosterModal && selectedEventForRoster && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '550px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '36px', boxShadow: 'var(--shadow-2xl)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 4px 0', color: 'var(--text-main)' }}>Roster & Attendance</h3>
                   <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800 }}>{selectedEventForRoster.event.title}</span>
                 </div>
                 <button onClick={() => setShowRosterModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', alignSelf: 'flex-start' }}>
                    <X size={20} />
                 </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>RSVP Breakdown</span>
                    <div style={{ width: '100%', height: '14px', borderRadius: '10px', display: 'flex', overflow: 'hidden', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                       <div style={{ width: `${(selectedEventForRoster.roster.accepted / selectedEventForRoster.roster.expected) * 100}%`, backgroundColor: '#10b981' }} title="Accepted"></div>
                       <div style={{ width: `${(selectedEventForRoster.roster.pending / selectedEventForRoster.roster.expected) * 100}%`, backgroundColor: '#f59e0b' }} title="Pending"></div>
                       <div style={{ width: `${(selectedEventForRoster.roster.declined / selectedEventForRoster.roster.expected) * 100}%`, backgroundColor: '#ef4444' }} title="Declined"></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-muted)' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Circle size={8} fill="#10b981" style={{ color: '#10b981' }} /> {selectedEventForRoster.roster.accepted} Accepted</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Circle size={8} fill="#f59e0b" style={{ color: '#f59e0b' }} /> {selectedEventForRoster.roster.pending} Pending</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Circle size={8} fill="#ef4444" style={{ color: '#ef4444' }} /> {selectedEventForRoster.roster.declined} Declined</span>
                    </div>
                 </div>

                 <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Logistics Coordinator</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{selectedEventForRoster.roster.lead}</span>
                 </div>

                 <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>Event Guest Attendees</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       {selectedEventForRoster.roster.participants.map((p, idx) => (
                         <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 700, padding: '10px 14px', backgroundColor: 'var(--bg-body)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                            {p}
                         </div>
                       ))}
                    </div>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
                    <button 
                      onClick={() => {
                        setShowRosterModal(false);
                        showToast('Attendance report exported to CSV successfully!', 'success');
                      }}
                      className="btn" 
                      style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                    >
                       Export Roster
                    </button>
                    <button 
                      onClick={() => setShowRosterModal(false)}
                      className="btn btn-primary" 
                      style={{ padding: '12px', borderRadius: '12px', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                    >
                       Close Roster
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 2000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#ef444420', 
              color: toast.type === 'success' ? '#10b981' : '#ef4444', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Check size={16} />
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
            {toast.action && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toast.action.onClick();
                  setToast(null);
                }}
                style={{
                  background: 'rgba(99, 102, 241, 0.25)',
                  border: 'none',
                  color: '#818cf8',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  transition: 'background 0.2s',
                  marginLeft: '8px',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.35)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(99, 102, 241, 0.25)'}
              >
                {toast.action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
