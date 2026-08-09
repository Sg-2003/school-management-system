import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Award, BarChart, TrendingUp, Search, 
  ChevronRight, Brain, Zap, MessageCircle, Star,
  ShieldCheck, PieChart, Activity, X, Loader2,
  Sparkles, Filter, FileText, CheckCircle2, Download,
  Printer, User, Mail, Calendar, BookOpen, AlertCircle
} from 'lucide-react';

import devonAvatar from '../assets/devon_avatar.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import ninaPatelAvatar from '../assets/nina_patel_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import marcusAvatar from '../assets/marcus_avatar.png';
import sophiaAvatar from '../assets/sophia_avatar.png';
import elenaAvatar from '../assets/elena_avatar.png';

const FacultyPerformanceAI = () => {
  // 1. Initial Interactive Teacher Data
  const [teachers, setTeachers] = useState([
    { 
      name: 'Dr. Sunita Rao', 
      subject: 'Advanced Physics', 
      dept: 'Science',
      score: 94, 
      engagement: 'High', 
      status: 'Exceeding',
      avatarColor: '#6366f1',
      avatar: janeAvatar,
      metrics: { lessonQuality: 96, techAdoption: 92, punctuality: 98, studentSentiment: 95 },
      feedback: { positive: 92, neutral: 6, negative: 2, quote: "Dr. Rao makes complex quantum concepts feel like everyday logic. Her visual notes are amazing." },
      observation: "Highly interactive lecture structure. Successfully checks understanding every 10 minutes. Peer collaboration was integrated smoothly."
    },
    { 
      name: 'Prof. Amit Bose', 
      subject: 'Pure Mathematics', 
      dept: 'Mathematics',
      score: 88, 
      engagement: 'Optimal', 
      status: 'On Track',
      avatarColor: '#10b981',
      avatar: devonAvatar,
      metrics: { lessonQuality: 89, techAdoption: 78, punctuality: 94, studentSentiment: 91 },
      feedback: { positive: 85, neutral: 12, negative: 3, quote: "Clear instruction and thorough problem-solving sessions. Sometimes pacing is a bit fast." },
      observation: "Clear whiteboard presentation. Pace was rapid but structured. Recommended to introduce a 2-minute pause for student questions mid-session."
    },
    { 
      name: 'Elena Rodriguez', 
      subject: 'Organic Chemistry', 
      dept: 'Science',
      score: 76, 
      engagement: 'Fluctuating', 
      status: 'Intervention',
      avatarColor: '#f59e0b',
      avatar: elenaAvatar,
      metrics: { lessonQuality: 78, techAdoption: 64, punctuality: 80, studentSentiment: 82 },
      feedback: { positive: 65, neutral: 20, negative: 15, quote: "Struggles to keep students focused during labs. Slide presentations contain too much text." },
      observation: "Lab supervision is sound, but direct instructional segments lacked student interaction. Digital tools could enhance structural visualization."
    },
    { 
      name: 'Robert Chen', 
      subject: 'World History', 
      dept: 'History',
      score: 91, 
      engagement: 'High', 
      status: 'Exceeding',
      avatarColor: '#ec4899',
      avatar: robertAvatar,
      metrics: { lessonQuality: 92, techAdoption: 90, punctuality: 95, studentSentiment: 93 },
      feedback: { positive: 90, neutral: 8, negative: 2, quote: "His storytelling approach to historic battles is gripping. I never miss a single session." },
      observation: "Exceptional narrative delivery. Highly creative interactive timelines used. Excellent vocal modulation and group management."
    },
    { 
      name: 'Dr. Clara Vance', 
      subject: 'English Literature', 
      dept: 'Languages',
      score: 85, 
      engagement: 'Optimal', 
      status: 'On Track',
      avatarColor: '#8b5cf6',
      avatar: ninaPatelAvatar,
      metrics: { lessonQuality: 87, techAdoption: 80, punctuality: 90, studentSentiment: 88 },
      feedback: { positive: 80, neutral: 14, negative: 6, quote: "Excellent essay feedback. However, class discussions can occasionally be dominated by a few voices." },
      observation: "Strong text discussion, but relies heavily on voluntary speakers. Interactive pop-quizzes could prompt more uniform classroom response."
    },
    { 
      name: 'Dr. Marcus Brody', 
      subject: 'Artificial Intelligence', 
      dept: 'Science',
      score: 92, 
      engagement: 'High', 
      status: 'Exceeding',
      avatarColor: '#06b6d4',
      avatar: marcusAvatar,
      metrics: { lessonQuality: 94, techAdoption: 97, punctuality: 91, studentSentiment: 93 },
      feedback: { positive: 91, neutral: 6, negative: 3, quote: "His AI labs are incredibly hands-on. He guides us perfectly through practical neural network setups." },
      observation: "Excellent utilization of smart IDE tools. Managed hybrid class interaction smoothly. Pacing was well adjusted for advanced and beginner tracks."
    },
    { 
      name: 'Prof. Sophia Martinez', 
      subject: 'Creative Writing', 
      dept: 'Languages',
      score: 87, 
      engagement: 'Optimal', 
      status: 'On Track',
      avatarColor: '#14b8a6',
      avatar: sophiaAvatar,
      metrics: { lessonQuality: 88, techAdoption: 85, punctuality: 92, studentSentiment: 89 },
      feedback: { positive: 86, neutral: 10, negative: 4, quote: "Sophia creates such a welcoming workshop atmosphere. The constructive critique sessions are highly helpful." },
      observation: "Warm classroom climate with active peer-review cycles. Successfully kept discussion focused. Recommending extra digital tools for collective real-time editing."
    }
  ]);

  // 2. Filter & Navigation States
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  // 3. Modals & Side Drawers
  const [activeModal, setActiveModal] = useState(null); // 'pdf' | 'recalc' | 'teacher' | 'incentive' | 'training'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherTab, setTeacherTab] = useState('metrics');

  // 4. Neural Re-calculation Progress State
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState(0);

  // 5. Toast Feedback State
  const [toast, setToast] = useState(null);

  // 6. Suggestion action local states
  const [incentiveStatus, setIncentiveStatus] = useState('pending'); // 'pending' | 'active'
  const [trainingStatus, setTrainingStatus] = useState('pending'); // 'pending' | 'scheduled'
  const [bonusDept, setBonusDept] = useState('Science');
  const [bonusPercent, setBonusPercent] = useState('10%');
  const [workshopDate, setWorkshopDate] = useState('2026-06-15');

  // Trigger interactive visual toast
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const CALCULATION_STEPS = [
    "Initializing multi-modal analysis engine...",
    "Retrieving student feedback vectors (1,248 parameters)...",
    "Processing Natural Language Processing for sentiment indexes...",
    "Correlating grading distribution models...",
    "Analyzing classroom frequency & active learning patterns...",
    "Evaluating lesson structure & check-for-understanding ratios...",
    "Compiling neural coefficients & predictive weight matrices...",
    "Updating decentralized data repositories...",
    "Re-calculation complete!"
  ];

  // Neural Recalculation Effect
  useEffect(() => {
    if (!isCalculating) return;
    const interval = setInterval(() => {
      setCalcStep(prev => {
        if (prev < CALCULATION_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Apply subtle AI updates
            setTeachers(prevTeachers => 
              prevTeachers.map(t => {
                const delta = (Math.random() * 3.6 - 1.2).toFixed(1); 
                const newScore = Math.min(100, Math.max(65, Math.round(t.score + parseFloat(delta))));
                let newStatus = 'On Track';
                if (newScore >= 90) newStatus = 'Exceeding';
                else if (newScore < 80) newStatus = 'Intervention';
                
                return {
                  ...t,
                  score: newScore,
                  status: newStatus,
                  metrics: {
                    lessonQuality: Math.min(100, Math.max(70, Math.round(t.metrics.lessonQuality + (Math.random() * 4 - 2)))),
                    techAdoption: Math.min(100, Math.max(60, Math.round(t.metrics.techAdoption + (Math.random() * 4 - 2)))),
                    punctuality: Math.min(100, Math.max(75, Math.round(t.metrics.punctuality + (Math.random() * 2 - 1)))),
                    studentSentiment: Math.min(100, Math.max(70, Math.round(t.metrics.studentSentiment + (Math.random() * 4 - 2))))
                  }
                };
              })
            );
            setIsCalculating(false);
            setActiveModal(null);
            triggerToast("All Faculty AI Effectiveness Indices successfully re-calculated!", "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isCalculating]);

  // Compute stats dynamically based on the teachers in context
  const filteredTeachers = teachers.filter(t => {
    const matchesDept = selectedDept === 'All' || t.dept === selectedDept;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const avgEffectiveness = filteredTeachers.length > 0 
    ? (filteredTeachers.reduce((acc, t) => acc + t.score, 0) / filteredTeachers.length).toFixed(1) 
    : "0";

  const avgSentiment = filteredTeachers.length > 0 
    ? (filteredTeachers.reduce((acc, t) => acc + (t.metrics.studentSentiment / 20), 0) / filteredTeachers.length).toFixed(1)
    : "0";

  // Trigger actions
  const handleCommendation = (teacherName) => {
    triggerToast(`Official AI Commendation Letter successfully sent to ${teacherName}!`, "success");
    setActiveModal(null);
  };

  const handleScheduleAudit = (teacherName) => {
    triggerToast(`Next AI observation scheduled for ${teacherName}. Camera & audio integrations ready.`, "info");
    setActiveModal(null);
  };

  const deployIncentivePolicy = () => {
    setIncentiveStatus('active');
    triggerToast(`Quarterly Performance Bonus initialized: ${bonusPercent} for ${bonusDept} faculty!`, "success");
    setActiveModal(null);
    // Positively boost target department teachers scores
    setTeachers(prev => prev.map(t => {
      if (t.dept === bonusDept) {
        const newScore = Math.min(100, t.score + 2);
        return {
          ...t,
          score: newScore,
          status: newScore >= 90 ? 'Exceeding' : t.status
        };
      }
      return t;
    }));
  };

  const deployWorkshop = () => {
    setTrainingStatus('scheduled');
    triggerToast(`Digital Pedagogy Workshop registered for chemistry faculty! Date: ${workshopDate}`, "success");
    setActiveModal(null);
    // Improve Rodriguez's stats after enrollment
    setTeachers(prev => prev.map(t => {
      if (t.name === 'Elena Rodriguez') {
        return {
          ...t,
          score: 82,
          status: 'On Track',
          metrics: { ...t.metrics, lessonQuality: 84, techAdoption: 80 }
        };
      }
      return t;
    }));
  };

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif", position: 'relative' }}>
      
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{ 
              position: 'fixed', 
              top: '24px', 
              right: '24px', 
              zIndex: 9999, 
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              padding: '16px 24px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: toast.type === 'success' ? '#10b98125' : '#6366f125',
              color: toast.type === 'success' ? '#10b981' : '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Action Completed' : 'Notification'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{toast.message}</div>
            </div>
            <button 
              onClick={() => setToast(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '12px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: 1, minWidth: '320px' }}>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', borderRadius: '30px', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <Award size={16} /> FACULTY EXCELLENCE ENGINE
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Faculty <span style={{ color: '#6366f1' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '24px' }}>
            Analyzing educator effectiveness through multimodal data vectors.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             <button 
              onClick={() => setActiveModal('pdf')}
              style={{ 
                padding: '16px 32px', 
                borderRadius: '18px', 
                border: '1px solid var(--border-color)', 
                backgroundColor: 'var(--bg-card)', 
                color: 'var(--text-main)', 
                fontWeight: 800, 
                fontSize: '0.9rem', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
            >
              <FileText size={18} color="var(--text-muted)" /> Generate PDF Audit
            </button>
             <button 
              onClick={() => {
                setIsCalculating(true);
                setCalcStep(0);
                setActiveModal('recalc');
              }}
              style={{ 
                padding: '16px 32px', 
                borderRadius: '18px', 
                border: 'none', 
                backgroundColor: 'var(--text-main)', 
                color: 'var(--bg-card)', 
                fontWeight: 900, 
                fontSize: '0.9rem', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
               <Zap size={18} color="#f59e0b" /> Re-Calculate Indices
            </button>
          </div>
        </div>
      </div>

      {/* Top Dynamic Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '32px' }}>
        
        {/* Metric 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Star size={24} />
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{avgEffectiveness}%</div>
           <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>AVG. FACULTY EFFECTIVENESS</div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <MessageCircle size={24} />
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{avgSentiment}/5</div>
           <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>SENTIMENT ANALYSIS SCORE</div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}
        >
           <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Activity size={24} />
           </div>
           <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{selectedDept === 'All' ? '92%' : selectedDept === 'Science' ? '93%' : '90%'}</div>
           <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>ENGAGEMENT RECALL INDEX</div>
        </motion.div>
      </div>

      {/* Content Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Left Side: Faculty Matrix Table */}
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
           
           {/* Section Header */}
           <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>Faculty Performance Matrix</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>Click on any educator to review deep AI sentiment & metrics.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                 {/* Live Search */}
                 <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
                    <input 
                      type="text" 
                      placeholder="Search educator..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        padding: '10px 16px 10px 36px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-body)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        outline: 'none',
                        width: '200px',
                        transition: 'all 0.2s'
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = '#6366f1';
                        e.currentTarget.style.width = '240px';
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.width = '200px';
                      }}
                    />
                 </div>

                 {/* Department Custom Filter Dropdown */}
                 <div style={{ position: 'relative' }}>
                   <div 
                      onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                      style={{ 
                        padding: '10px 16px', 
                        borderRadius: '12px', 
                        backgroundColor: 'var(--bg-body)', 
                        fontSize: '0.8rem', 
                        fontWeight: 700, 
                        color: 'var(--text-sidebar)', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid var(--border-color)',
                        userSelect: 'none'
                      }}
                   >
                      <Filter size={14} color="var(--text-muted)" />
                      {selectedDept === 'All' ? 'Dept: All' : selectedDept}
                   </div>

                   <AnimatePresence>
                     {deptDropdownOpen && (
                       <>
                         {/* Close backdrop */}
                         <div 
                           onClick={() => setDeptDropdownOpen(false)}
                           style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} 
                         />
                         
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: 10 }}
                           style={{ 
                             position: 'absolute', 
                             top: '100%', 
                             right: 0, 
                             marginTop: '8px', 
                             backgroundColor: 'var(--bg-card)',
                             border: '1px solid var(--border-color)',
                             borderRadius: '16px',
                             boxShadow: 'var(--shadow-lg)',
                             padding: '8px',
                             zIndex: 100,
                             minWidth: '160px',
                             display: 'flex',
                             flexDirection: 'column',
                             gap: '4px'
                           }}
                         >
                           {['All', 'Science', 'Mathematics', 'History', 'Languages'].map((dept) => (
                             <div 
                               key={dept}
                               onClick={() => {
                                 setSelectedDept(dept);
                                 setDeptDropdownOpen(false);
                               }}
                               style={{
                                 padding: '10px 12px',
                                 borderRadius: '8px',
                                 cursor: 'pointer',
                                 fontSize: '0.8rem',
                                 fontWeight: selectedDept === dept ? 800 : 500,
                                 backgroundColor: selectedDept === dept ? '#6366f115' : 'transparent',
                                 color: selectedDept === dept ? '#6366f1' : 'var(--text-sidebar)',
                               }}
                               onMouseEnter={e => {
                                 if (selectedDept !== dept) e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                               }}
                               onMouseLeave={e => {
                                 if (selectedDept !== dept) e.currentTarget.style.backgroundColor = 'transparent';
                               }}
                             >
                               {dept === 'All' ? 'All Departments' : `${dept} Dept`}
                             </div>
                           ))}
                         </motion.div>
                       </>
                     )}
                   </AnimatePresence>
                 </div>
              </div>
           </div>

           {/* Table Matrix List */}
           <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, i) => (
                  <motion.div 
                    key={i} 
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setTeacherTab('metrics');
                      setActiveModal('teacher');
                    }}
                    whileHover={{ backgroundColor: 'var(--bg-body)' }}
                    style={{ 
                      padding: '24px 32px', 
                      borderBottom: '1px solid var(--border-color)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s'
                    }}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img 
                          src={teacher.avatar} 
                          alt={teacher.name}
                          style={{ 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '12px', 
                            objectFit: 'cover',
                            border: `2px solid ${teacher.avatarColor}`
                          }} 
                        />
                        <div>
                           <div style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             {teacher.name}
                             <span style={{ fontSize: '0.65rem', padding: '3px 8px', backgroundColor: 'var(--border-color)', borderRadius: '20px', color: 'var(--text-muted)', fontWeight: 700 }}>
                               {teacher.dept}
                             </span>
                           </div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>{teacher.subject}</div>
                        </div>
                     </div>
                     <div style={{ flex: 1, padding: '0 32px' }}>
                        <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${teacher.score}%` }}
                              transition={{ duration: 0.5, delay: i * 0.05 }}
                              style={{ 
                                height: '100%', 
                                backgroundColor: teacher.score > 90 ? '#10b981' : teacher.score > 80 ? '#6366f1' : '#f59e0b', 
                                borderRadius: '4px' 
                              }}
                           />
                        </div>
                     </div>
                     <div style={{ textAlign: 'right', minWidth: '100px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                        <div>
                           <div style={{ fontWeight: 900, color: 'var(--text-main)' }}>{teacher.score}%</div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 700, color: teacher.status === 'Exceeding' ? '#10b981' : teacher.status === 'On Track' ? '#6366f1' : '#f59e0b' }}>
                             {teacher.status}
                           </div>
                        </div>
                        <ChevronRight size={16} color="var(--text-muted)" />
                     </div>
                  </motion.div>
                ))
              ) : (
                <div style={{ padding: '60px 32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <AlertCircle size={40} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>No Educators Match Filters</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Try searching another keyword or clearing search fields.</div>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: AI Suggestion Deck & Heatmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
           
           {/* Suggestions Panel */}
           <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '32px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                 <Brain size={24} color="#6366f1" />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Neural Suggestions</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {/* Card 1 */}
                 <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '24px', borderLeft: '4px solid #6366f1', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Incentive Alignment</div>
                      {incentiveStatus === 'active' ? (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: '#10b98120', border: '1px solid #10b981', color: '#10b981', borderRadius: '12px', fontWeight: 800 }}>
                          ACTIVE
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: '#f59e0b20', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: '12px', fontWeight: 800 }}>
                          PENDING
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '14px' }}>
                      High correlation between performance bonus and Science dept output. Recommend quarterly review.
                    </div>
                    <button 
                      onClick={() => setActiveModal('incentive')}
                      style={{
                        width: '100%',
                        padding: '10px 0',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
                    >
                      <Sparkles size={12} /> {incentiveStatus === 'active' ? 'Re-configure Policy' : 'Initiate Review Policy'}
                    </button>
                 </div>

                 {/* Card 2 */}
                 <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '24px', borderLeft: '4px solid #10b981', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Training Opportunity</div>
                      {trainingStatus === 'scheduled' ? (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: '#6366f120', border: '1px solid #6366f1', color: '#6366f1', borderRadius: '12px', fontWeight: 800 }}>
                          SCHEDULED
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', backgroundColor: '#f59e0b20', border: '1px solid #f59e0b', color: '#f59e0b', borderRadius: '12px', fontWeight: 800 }}>
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '14px' }}>
                      Recommend digital pedagogy workshop for Chemistry faculty to boost classroom interactive scores.
                    </div>
                    <button 
                      onClick={() => setActiveModal('training')}
                      style={{
                        width: '100%',
                        padding: '10px 0',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                      <BookOpen size={12} /> {trainingStatus === 'scheduled' ? 'View Workshop Setup' : 'Enroll Chemistry Faculty'}
                    </button>
                 </div>
              </div>
           </div>

           {/* Interactive Heatmap */}
           <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)' }}>Engagement Heatmap</h3>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', backgroundColor: 'var(--bg-body)', color: 'var(--text-muted)', fontWeight: 700, borderRadius: '8px' }}>
                  Weekly Recalled Metrics
                </span>
              </div>
              <div style={{ height: '150px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '16px', justifyContent: 'space-around', position: 'relative' }}>
                 {[
                   { day: 'MON', val: 40, label: '40% - Normal class pacing' },
                   { day: 'TUE', val: 70, label: '70% - High laboratory focus' },
                   { day: 'WED', val: 45, label: '45% - Midweek dip' },
                   { day: 'THU', val: 90, label: '90% - Optimal interactive session' },
                   { day: 'FRI', val: 65, label: '65% - Consistent project review' },
                   { day: 'SAT', val: 80, label: '80% - Elective visual courses' },
                   { day: 'SUN', val: 55, label: '55% - Remote testing audits' }
                 ].map((d, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ scaleY: 1.05 }}
                     title={`${d.day}: ${d.label}`}
                     style={{ 
                       height: `${d.val}%`, 
                       width: '100%', 
                       backgroundColor: '#6366f1', 
                       borderRadius: '6px', 
                       opacity: 0.2 + (d.val/100),
                       cursor: 'pointer',
                       position: 'relative'
                     }}
                     onClick={() => triggerToast(`${d.day} Analysis: Average student interest spiked to ${d.val}% under interactive loops.`, "info")}
                   />
                 ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                 <span>MON</span>
                 <span>TUE</span>
                 <span>WED</span>
                 <span>THU</span>
                 <span>FRI</span>
                 <span>SAT</span>
                 <span>SUN</span>
              </div>
           </div>
        </div>
      </div>

      {/* ================= MODALS & OVERLAYS ================= */}
      
      <AnimatePresence>
        {activeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isCalculating) setActiveModal(null);
              }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(15,23,42,0.6)', 
                backdropFilter: 'blur(8px)',
                zIndex: -1
              }} 
            />

            {/* Neural Recalculating Loader */}
            {activeModal === 'recalc' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid #1e293b',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: 'auto'
                }}
              >
                <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #6366f120', borderTopColor: '#6366f1' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }}>
                    <Brain size={32} className="pulse" />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>AI Model Optimizing</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Parsing classroom telemetry & observation vectors</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((calcStep + 1) / CALCULATION_STEPS.length) * 100}%` }}
                    transition={{ ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#6366f1' }}
                  />
                </div>

                <div style={{ 
                  width: '100%', 
                  backgroundColor: '#020617', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  color: '#10b981', 
                  textAlign: 'left',
                  height: '100px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b'
                }}>
                  {CALCULATION_STEPS.slice(0, calcStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === calcStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generated PDF Audit Modal */}
            {activeModal === 'pdf' && (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  display: 'flex',
                  gap: '32px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  overflow: 'hidden',
                  width: '1000px',
                  maxWidth: '100%',
                  height: '80vh',
                  maxHeight: '800px',
                  margin: 'auto'
                }}
              >
                {/* Print Layout Sheet */}
                <div style={{ flex: 2, border: '1px solid var(--border-color)', borderRadius: '24px', backgroundColor: '#f8fafc', padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                  
                  {/* Watermark Logo */}
                  <div style={{ position: 'absolute', top: '40%', left: '30%', opacity: 0.03, transform: 'rotate(-30deg)', pointerEvents: 'none' }}>
                    <Award size={400} color="#0f172a" />
                  </div>
                  
                  {/* Sheet Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontWeight: 900, color: '#0f172a', fontSize: '1.25rem', letterSpacing: '-1px' }}>ALEXANDRIA INTERNATIONAL ACADEMY</h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>FACULTY AI EVALUATION SUITE • CORE AUDIT</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>REPORT NO: AIA-FAC-2026</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>DATE: May 25, 2026</div>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <h5 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>I. EXECUTIVE SUMMARY</h5>
                    <p style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
                      This audit evaluates core pedagogy metrics, tech integrations, class management parameters, and raw student sentiment metrics across the active faculty registers. Dynamic telemetry indices show an overall institutional effectiveness benchmark of <strong>{avgEffectiveness}%</strong>. Science and Math departments maintain optimal scores, while specific intervention protocols are suggested for chemistry components to align tech adoption vectors.
                    </p>
                  </div>

                  {/* Table */}
                  <div>
                    <h5 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>II. TELEMETRY SCORES MATRIX</h5>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#0f172a', color: 'white', textAlign: 'left' }}>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Faculty Name</th>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Department</th>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Specialization</th>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>NLP Sentiment</th>
                          <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>Effectiveness Index</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((t, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f1f5f9', color: '#334155' }}>
                            <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700 }}>{t.name}</td>
                            <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>{t.dept}</td>
                            <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>{t.subject}</td>
                            <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>{(t.metrics.studentSentiment / 20).toFixed(1)} / 5.0</td>
                            <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 800, color: t.score > 90 ? '#10b981' : '#475569' }}>{t.score}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Signatures */}
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>AI Engine Core Evaluator</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>Cryptographically signed via AI-Core</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a' }}>Alexandria Administration Board</div>
                      <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>Verified Institutional Audit Seal</div>
                    </div>
                  </div>

                </div>

                {/* Print Controls Panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)' }}>Audit Report Suite</h4>
                    <button 
                      onClick={() => setActiveModal(null)}
                      style={{ background: 'var(--border-color)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Deploy cryptographic institutional report documents containing absolute classroom vectors.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>Cryptographic verification attached</div>
                    </div>
                    <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={18} color="#10b981" />
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>High-fidelity database logs included</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      onClick={() => {
                        triggerToast("PDF generated and successfully downloaded!", "success");
                        setActiveModal(null);
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: 'none',
                        backgroundColor: '#6366f1',
                        color: 'white',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Download size={18} /> Download official PDF
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                      }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Printer size={18} /> Print physical copy
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Custom Teacher Detailed Drawer (Interactive) */}
            {activeModal === 'teacher' && selectedTeacher && (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '560px',
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 10000,
                  borderLeft: '1px solid var(--border-color)'
                }}
              >
                {/* Header */}
                <div style={{ padding: '40px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img 
                      src={selectedTeacher.avatar} 
                      alt={selectedTeacher.name}
                      style={{ 
                        width: '64px', 
                        height: '64px', 
                        borderRadius: '18px', 
                        objectFit: 'cover',
                        border: `2px solid ${selectedTeacher.avatarColor}`
                      }} 
                    />
                    <div>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {selectedTeacher.name}
                        <span style={{ fontSize: '0.7rem', padding: '3px 10px', backgroundColor: '#6366f115', color: '#6366f1', borderRadius: '30px', fontWeight: 800 }}>
                          {selectedTeacher.dept}
                        </span>
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{selectedTeacher.subject}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Tabs selection */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 40px' }}>
                  {['metrics', 'feedback', 'observation'].map(tab => (
                    <div 
                      key={tab}
                      onClick={() => setTeacherTab(tab)}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: teacherTab === tab ? 800 : 600,
                        color: teacherTab === tab ? '#6366f1' : 'var(--text-muted)',
                        borderBottom: '3px solid',
                        borderColor: teacherTab === tab ? '#6366f1' : 'transparent',
                        textTransform: 'capitalize'
                      }}
                    >
                      {tab === 'feedback' ? 'Student Reviews' : tab === 'metrics' ? 'AI Metrics' : 'Observation Logs'}
                    </div>
                  ))}
                </div>

                {/* Drawer Body Scroll */}
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Tab Content 1: Metrics */}
                  {teacherTab === 'metrics' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ backgroundColor: 'var(--bg-body)', borderRadius: '24px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)', padding: '12px' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-main)' }}>{selectedTeacher.score}%</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>OVERALL EFFICIENCY</div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '12px' }}>
                          <div style={{ fontSize: '2rem', fontWeight: 950, color: '#10b981' }}>{selectedTeacher.engagement}</div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px' }}>ENGAGEMENT BAND</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h5 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Pedagogical Vector Breakdown</h5>
                        
                        {/* Bar 1 */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                            <span style={{ color: 'var(--text-sidebar)' }}>Lesson Plan Rigor</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.metrics.lessonQuality}%</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.metrics.lessonQuality}%`, backgroundColor: '#6366f1', borderRadius: '4px' }}></div>
                          </div>
                        </div>

                        {/* Bar 2 */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                            <span style={{ color: 'var(--text-sidebar)' }}>Tech tool Adoption</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.metrics.techAdoption}%</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.metrics.techAdoption}%`, backgroundColor: '#10b981', borderRadius: '4px' }}></div>
                          </div>
                        </div>

                        {/* Bar 3 */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                            <span style={{ color: 'var(--text-sidebar)' }}>Attendance & Punctuality</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.metrics.punctuality}%</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.metrics.punctuality}%`, backgroundColor: '#f59e0b', borderRadius: '4px' }}></div>
                          </div>
                        </div>

                        {/* Bar 4 */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                            <span style={{ color: 'var(--text-sidebar)' }}>Sentiment Score Index</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.metrics.studentSentiment}%</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.metrics.studentSentiment}%`, backgroundColor: '#ec4899', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content 2: Feedback */}
                  {teacherTab === 'feedback' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <h5 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>Sentiment Distribution Vector</h5>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Positive */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                            <span style={{ color: '#10b981' }}>Positive Comments</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.feedback.positive}%</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.feedback.positive}%`, backgroundColor: '#10b981', borderRadius: '3px' }}></div>
                          </div>
                        </div>

                        {/* Neutral */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                            <span style={{ color: '#6366f1' }}>Neutral Comments</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.feedback.neutral}%</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.feedback.neutral}%`, backgroundColor: '#6366f1', borderRadius: '3px' }}></div>
                          </div>
                        </div>

                        {/* Negative */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>
                            <span style={{ color: '#f59e0b' }}>Constructive Flags</span>
                            <span style={{ color: 'var(--text-main)' }}>{selectedTeacher.feedback.negative}%</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${selectedTeacher.feedback.negative}%`, backgroundColor: '#f59e0b', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#6366f105', padding: '24px', borderRadius: '24px', borderLeft: '4px solid #6366f1', marginTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>
                          <Sparkles size={16} /> AI Summary Quote
                        </div>
                        <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-sidebar)', lineHeight: 1.6 }}>
                          "{selectedTeacher.feedback.quote}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tab Content 3: Observations */}
                  {teacherTab === 'observation' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-body)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                        <ShieldCheck size={20} color="#10b981" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>
                          Evaluated via Smart Class Camera Audit Log
                        </span>
                      </div>
                      
                      <div>
                        <h5 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px' }}>Audited Telemetry Log</h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-sidebar)', lineHeight: 1.6, textAlign: 'justify' }}>
                          {selectedTeacher.observation}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '12px', padding: '16px', borderRadius: '20px', backgroundColor: '#f59e0b10', border: '1px solid #f59e0b30' }}>
                        <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>AI Recommended Action</div>
                          <div style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '2px', lineHeight: 1.4 }}>
                            {selectedTeacher.score >= 90 
                              ? "Exceeds standard indices. Recommended to dispatch administrative commendation letter to reinforce performance." 
                              : "Review training workshop alignment options below to optimize Lesson Quality & Tech Adoption bands."}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer action dashboard */}
                <div style={{ padding: '32px 40px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px', backgroundColor: 'var(--bg-body)' }}>
                  <button 
                    onClick={() => handleCommendation(selectedTeacher.name)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: 'var(--text-main)',
                      color: 'var(--bg-card)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <Mail size={16} /> Commend
                  </button>
                  
                  <button 
                    onClick={() => handleScheduleAudit(selectedTeacher.name)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      borderRadius: '14px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                  >
                    <Calendar size={16} /> Audit Next Class
                  </button>
                </div>
              </motion.div>
            )}

            {/* Incentive Policy Form Modal */}
            {activeModal === 'incentive' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '460px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <Sparkles size={20} color="#6366f1" style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Incentive Alignment Portal</h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Target Faculty Department</label>
                    <select 
                      value={bonusDept} 
                      onChange={e => setBonusDept(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none' }}
                    >
                      <option value="Science">Science Department</option>
                      <option value="Mathematics">Mathematics Department</option>
                      <option value="History">History Department</option>
                      <option value="Languages">Languages Department</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Quarterly Performance Bonus (%)</label>
                    <select 
                      value={bonusPercent} 
                      onChange={e => setBonusPercent(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none' }}
                    >
                      <option value="5%">5% Quarterly Merit Increase</option>
                      <option value="10%">10% Quarterly Merit Increase</option>
                      <option value="15%">15% Quarterly Merit Increase</option>
                      <option value="20%">20% Quarterly Merit Increase</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={deployIncentivePolicy}
                    style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Deploy Incentive Program
                  </button>
                </div>
              </motion.div>
            )}

            {/* Training Enrollment Modal */}
            {activeModal === 'training' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '460px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <BookOpen size={20} color="#10b981" style={{ flexShrink: 0 }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Pedagogical Workshop Setup</h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0 }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <div style={{ backgroundColor: '#10b98110', padding: '16px', borderRadius: '16px', border: '1px solid #10b98130', fontSize: '0.75rem', color: '#047857', lineHeight: 1.4 }}>
                    <strong>Automated Enrollment:</strong> High-priority recommendations mapped to chemistry & lab educators below 80% Tech adoption index (Elena Rodriguez).
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Select Workshop Module</label>
                    <select style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none' }}>
                      <option>Digital Chemistry Pedagogical Lab Mastery</option>
                      <option>Classroom Active Pacing & Interactive Cycles</option>
                      <option>Advanced NLP & Tech-Tool Integration Suite</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>Commencement Date</label>
                    <input 
                      type="date"
                      value={workshopDate}
                      onChange={e => setWorkshopDate(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={deployWorkshop}
                    style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <BookOpen size={16} /> Confirm & Register
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FacultyPerformanceAI;
