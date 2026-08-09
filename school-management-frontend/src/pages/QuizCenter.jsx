import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Clock, CheckCircle2, Search, Filter, 
  MoreVertical, ChevronRight, Play, BookOpen, Trophy, Plus,
  AlertCircle, Layout, GraduationCap, Timer, Award, X, Check, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { QuizzesApi } from '../services/service';

const QuizCenter = () => {
  // Core Quiz State
  const { toast, showToast, hideToast } = useToast();
  const [quizzes, setQuizzes] = useState([
    { id: 'QZ-001', title: 'Advanced Algebra Weekly', subject: 'Mathematics', questions: 2, time: '20 mins', timeLimitSec: 1200, difficulty: 'Medium', status: 'Available', color: 'var(--primary)' },
    { id: 'QZ-002', title: 'Quantum Physics Intro', subject: 'Physics', questions: 2, time: '15 mins', timeLimitSec: 900, difficulty: 'Hard', status: 'Ongoing', color: '#EF4444' },
    { id: 'QZ-003', title: 'World War II Summary', subject: 'History', questions: 2, time: '30 mins', timeLimitSec: 1800, difficulty: 'Easy', status: 'Completed', color: '#10B981' },
    { id: 'QZ-004', title: 'Organic Chemistry Basics', subject: 'Chemistry', questions: 2, time: '18 mins', timeLimitSec: 1080, difficulty: 'Hard', status: 'Available', color: '#F59E0B' },
    { id: 'QZ-005', title: 'Differential Calculus', subject: 'Mathematics', questions: 2, time: '25 mins', timeLimitSec: 1500, difficulty: 'Hard', status: 'Available', color: '#EF4444' },
    { id: 'QZ-006', title: 'Global Geography Trivia', subject: 'Geography', questions: 2, time: '15 mins', timeLimitSec: 900, difficulty: 'Easy', status: 'Available', color: '#10B981' },
    { id: 'QZ-007', title: 'Cyber Security Ethics', subject: 'Technology', questions: 2, time: '20 mins', timeLimitSec: 1200, difficulty: 'Medium', status: 'Available', color: 'var(--primary)' },
    { id: 'QZ-008', title: 'Business Law Essentials', subject: 'Business', questions: 2, time: '30 mins', timeLimitSec: 1800, difficulty: 'Hard', status: 'Ongoing', color: '#F59E0B' },
  ]);

  // Load quizzes from backend on mount
  useEffect(() => {
    QuizzesApi.getAll()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setQuizzes(data);
          localStorage.setItem('quiz_center_quizzes', JSON.stringify(data));
        }
      })
      .catch(() => {
        // Fallback: try localStorage
        try {
          const cached = localStorage.getItem('quiz_center_quizzes');
          if (cached) setQuizzes(JSON.parse(cached));
        } catch (e) {}
      });
  }, []);

  // Sidebar Recent Results State
  const [recentResults, setRecentResults] = useState([
    { id: 'RES-001', user: 'Aarav Sharma', quizTitle: 'Advanced Algebra Weekly', score: '15/15', accuracy: 100, color: '#10B981', date: 'Today, 10:45 AM' },
    { id: 'RES-002', user: 'Aditi Nair', quizTitle: 'World War II Summary', score: '14/15', accuracy: 93, color: '#10B981', date: 'Today, 09:20 AM' },
    { id: 'RES-003', user: 'Amit Patel', quizTitle: 'Quantum Physics Intro', score: '08/15', accuracy: 53, color: '#EF4444', date: 'Yesterday, 04:15 PM' },
  ]);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Divya Joshi', quizzesTaken: 18, accuracy: 98, medal: '🥇' },
    { rank: 2, name: 'Aarav Sharma', quizzesTaken: 15, accuracy: 95, medal: '🥈' },
    { rank: 3, name: 'Sneha Reddy', quizzesTaken: 22, accuracy: 92, medal: '🥉' },
    { rank: 4, name: 'Neha Sharma', quizzesTaken: 12, accuracy: 89, medal: '' },
    { rank: 5, name: 'Karan Mehta', quizzesTaken: 14, accuracy: 85, medal: '' }
  ]);

  // Interactive Quiz Questions Database
  const questionsDatabase = {
    'QZ-001': [ // Advanced Algebra Weekly
      { id: 1, text: 'Solve for x: 3x - 7 = 14', options: ['x = 5', 'x = 7', 'x = 9', 'x = 11'], answer: 'x = 7' },
      { id: 2, text: 'Find the vertex of the parabola: y = x² - 4x + 5', options: ['(2, 1)', '(2, 5)', '(-2, 17)', '(4, 5)'], answer: '(2, 1)' }
    ],
    'QZ-002': [ // Quantum Physics Intro
      { id: 1, text: "What is the approximate value of Planck's constant (h)?", options: ['6.626 x 10^-34 J·s', '3.00 x 10^8 m/s', '1.602 x 10^-19 C', '9.11 x 10^-31 kg'], answer: '6.626 x 10^-34 J·s' },
      { id: 2, text: 'Which experiment demonstrated wave-particle duality?', options: ['Double-slit experiment', 'Michelson-Morley experiment', 'Millikan oil drop', 'Stern-Gerlach experiment'], answer: 'Double-slit experiment' }
    ]
  };

  // General Questions Fallback
  const generalQuestions = [
    { id: 1, text: 'What is the capital of France?', options: ['London', 'Paris', 'Rome', 'Berlin'], answer: 'Paris' },
    { id: 2, text: 'Which chemical element has the symbol O?', options: ['Osmium', 'Oxygen', 'Oganesson', 'Gold'], answer: 'Oxygen' }
  ];

  // Filtering & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showResultsLog, setShowResultsLog] = useState(false);

  // Active Quiz Simulator States
  const [activeQuizSession, setActiveQuizSession] = useState(null);
  const [activeQuizAnswers, setActiveQuizAnswers] = useState({});
  const [quizTimer, setQuizTimer] = useState(0);
  const [quizCompletedScore, setQuizCompletedScore] = useState(null);
  const [proctorWarning, setProctorWarning] = useState(false);

  // Create Quiz Form State
  const [createForm, setCreateForm] = useState({
    title: '',
    subject: 'Mathematics',
    questions: 10,
    time: 15,
    difficulty: 'Medium'
  });

  // Ticking Quiz Session Countdown Timer
  useEffect(() => {
    let interval = null;
    if (activeQuizSession && quizCompletedScore === null) {
      interval = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmitQuiz();
            return 0;
          }
          // Dynamic proctor behavior trigger
          if (prev === 585 || prev === 285) {
            setProctorWarning(true);
            setTimeout(() => setProctorWarning(false), 5000);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeQuizSession, quizCompletedScore]);

  // Dynamic Statistics
  const getStats = () => {
    const accuracyList = recentResults.map(r => r.accuracy);
    const avgAccuracy = Math.round(accuracyList.reduce((a, b) => a + b, 0) / accuracyList.length);
    return {
      totalQuizzes: String(quizzes.length + 16).padStart(2, '0'), // base + custom list length
      activeSessions: String(quizzes.filter(q => q.status === 'Ongoing').length + 10).padStart(2, '0'),
      avgAccuracy: `${avgAccuracy}%`,
      certificates: String(150 + recentResults.filter(r => r.accuracy >= 80).length).padStart(2, '0')
    };
  };

  const stats = getStats();

  // Dynamic Filtering Logic
  const filteredQuizzes = quizzes.filter(quiz => {
    // 1. Search Query Filter
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      quiz.title.toLowerCase().includes(query) || 
      quiz.subject.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    // 2. Difficulty Select Filter
    if (selectedDifficulty !== 'All' && quiz.difficulty !== selectedDifficulty) {
      return false;
    }

    return true;
  });

  // Launch Active Quiz Session
  const handleLaunchQuiz = (quiz) => {
    setActiveQuizSession(quiz);
    setActiveQuizAnswers({});
    setQuizTimer(quiz.timeLimitSec || 600); // Set countdown seconds
    setQuizCompletedScore(null);
    setProctorWarning(false);
  };

  // Submit quiz answers & calculate score
  const handleSubmitQuiz = () => {
    const questionsList = questionsDatabase[activeQuizSession.id] || generalQuestions;
    let correctCount = 0;
    
    questionsList.forEach(q => {
      if (activeQuizAnswers[q.id] === q.answer) {
        correctCount++;
      }
    });

    const accuracy = Math.round((correctCount / questionsList.length) * 100);
    const scoreStr = `${correctCount}/${questionsList.length}`;
    setQuizCompletedScore({ correctCount, totalCount: questionsList.length, accuracy });

    // Append to Recent Results List
    const newResult = {
      id: `RES-${String(recentResults.length + 1).padStart(3, '0')}`,
      user: 'You (Student)',
      quizTitle: activeQuizSession.title,
      score: scoreStr,
      accuracy: accuracy,
      color: accuracy >= 80 ? '#10B981' : '#EF4444',
      date: 'Just now'
    };
    setRecentResults(prev => [newResult, ...prev]);

    // Update Quiz Status in Parent List
    setQuizzes(prev => prev.map(q => {
      if (q.id === activeQuizSession.id) {
        const updated = { ...q, status: 'Completed', color: '#10B981' };
        // Sync completed status to database
        QuizzesApi.update(q.id, { ...updated }).catch(() => {});
        return updated;
      }
      return q;
    }));
  };

  // Auto Submit on Timer Exhaust
  const handleAutoSubmitQuiz = () => {
    showToast('Time expired! Your answers have been submitted automatically.', 'warning', 'Time Up');
    handleSubmitQuiz();
  };

  // Format countdown seconds into MM:SS
  const formatTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Handle Post New Quiz Form Submit
  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (!createForm.title) {
      showToast('Please enter a Quiz Title.', 'warning', 'Validation Error');
      return;
    }

    const nextIdNumber = quizzes.length + 1;
    const newQuiz = {
      id: `QZ-${String(nextIdNumber).padStart(3, '0')}`,
      title: createForm.title,
      subject: createForm.subject,
      questions: createForm.questions,
      time: `${createForm.time} mins`,
      timeLimitSec: createForm.time * 60,
      difficulty: createForm.difficulty,
      status: 'Available',
      color: 'var(--primary)'
    };

    setQuizzes(prev => [newQuiz, ...prev]);
    setShowCreateModal(false);

    // Sync to database
    QuizzesApi.create(newQuiz).catch(() => {});

    // Reset Form
    setCreateForm({
      title: '',
      subject: 'Mathematics',
      questions: 10,
      time: 15,
      difficulty: 'Medium'
    });
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px', position: 'relative' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#F59E0B', marginBottom: '8px' }}>
            <div style={{ padding: '8px', backgroundColor: '#F59E0B15', borderRadius: '10px' }}>
               <HelpCircle size={20} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Assessment</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 955, margin: 0, letterSpacing: '-1px' }}>Online Quiz Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', fontWeight: 600 }}>Assess student knowledge through automated quizzes and mock tests.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button 
              className="btn" 
              onClick={() => setShowLeaderboard(true)}
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
           >
              <Trophy size={18} /> LEADERBOARD
           </button>
           <button 
              className="btn btn-primary" 
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '12px 28px', fontWeight: 900, boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)', cursor: 'pointer' }}
           >
              <Plus size={18} /> CREATE NEW QUIZ
           </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
         {[
           { label: 'Total Quizzes', value: stats.totalQuizzes, icon: <BookOpen size={20} />, color: 'var(--primary)' },
           { label: 'Active Sessions', value: stats.activeSessions, icon: <Timer size={20} />, color: '#EF4444' },
           { label: 'Avg. Accuracy', value: stats.avgAccuracy, icon: <Award size={20} />, color: '#10B981' },
           { label: 'Certificates', value: stats.certificates, icon: <CheckCircle2 size={20} />, color: '#8B5CF6' }
         ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <div style={{ width: '54px', height: '54px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
               </div>
               <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>{stat.value}</div>
               </div>
            </div>
         ))}
      </div>

      {/* Quiz Layout List & Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
         {/* Main Quiz List */}
         <div className="card" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {/* Table Header Filter & Search */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.02)' }}>
               <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  <div style={{ position: 'relative', width: '300px' }}>
                     <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: 'var(--text-muted)' }} />
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search quiz by title..." 
                        style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
                     />
                  </div>
                  {/* Difficulty Filter select */}
                  <select 
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="form-input" 
                    style={{ borderRadius: '14px', border: '1px solid var(--border-color)', padding: '10px 18px', backgroundColor: 'var(--bg-card)', fontWeight: 700, cursor: 'pointer', outline: 'none', width: '150px' }}
                  >
                    <option value="All">All Difficulty</option>
                    <option value="Easy">Easy Only</option>
                    <option value="Medium">Medium Only</option>
                    <option value="Hard">Hard Only</option>
                  </select>
               </div>
            </div>

            {/* List Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {filteredQuizzes.length === 0 ? (
                 <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                   No quizzes found matching filters.
                 </div>
               ) : (
                 filteredQuizzes.map((quiz) => (
                    <motion.div 
                       key={quiz.id}
                       whileHover={{ x: 10 }}
                       style={{ padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s', backgroundColor: 'var(--bg-card)' }}
                       className="hover-card"
                    >
                       <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${quiz.color}15`, color: quiz.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <HelpCircle size={28} />
                          </div>
                          <div>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>{quiz.title}</h3>
                                <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 900, backgroundColor: quiz.status === 'Completed' ? '#10B98115' : 'var(--bg-body)', color: quiz.status === 'Completed' ? '#10B981' : 'var(--text-muted)', textTransform: 'uppercase' }}>{quiz.status}</span>
                             </div>
                             <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                   <BookOpen size={14} /> {quiz.subject}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                   <Clock size={14} /> {quiz.time}
                                </div>
                             </div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ textAlign: 'right', marginRight: '10px' }}>
                             <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>DIFFICULTY</div>
                             <div style={{ fontSize: '0.85rem', fontWeight: 900, color: quiz.difficulty === 'Hard' ? '#EF4444' : '#10B981' }}>{quiz.difficulty.toUpperCase()}</div>
                          </div>
                          <button 
                            className="btn" 
                            disabled={quiz.status === 'Completed'}
                            onClick={() => handleLaunchQuiz(quiz)}
                            style={{ 
                              padding: '10px 20px', 
                              fontWeight: 800, 
                              backgroundColor: quiz.status === 'Ongoing' ? '#EF4444' : quiz.status === 'Completed' ? 'var(--border-color)' : 'var(--primary)', 
                              color: 'white', 
                              border: 'none',
                              cursor: quiz.status === 'Completed' ? 'default' : 'pointer',
                              opacity: quiz.status === 'Completed' ? 0.6 : 1
                            }}
                          >
                             {quiz.status === 'Ongoing' ? 'RESUME' : quiz.status === 'Completed' ? 'COMPLETED' : 'START QUIZ'}
                          </button>
                       </div>
                    </motion.div>
                 ))
               )}
            </div>
         </div>

         {/* Sidebar Insights */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', borderRadius: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 950, marginBottom: '20px', color: 'var(--text-main)' }}>Recent Results</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentResults.map((res, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>{res.user.charAt(0)}</div>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', display: 'block' }}>{res.user}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{res.quizTitle}</span>
                          </div>
                       </div>
                       <span style={{ fontSize: '0.85rem', fontWeight: 950, color: res.color }}>{res.score}</span>
                    </div>
                  ))}
               </div>
               <button 
                 onClick={() => setShowResultsLog(true)}
                 className="btn" 
                 style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', fontWeight: 800, cursor: 'pointer' }}
               >
                 VIEW ALL RESULTS
               </button>
            </div>

            <div className="card" style={{ padding: '24px', borderRadius: '32px', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '12px' }}>AI Proctoring</h3>
               <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '20px' }}>
                  Our advanced AI proctoring system is active. All quiz sessions are monitored for academic integrity.
               </p>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 1.5s infinite' }}></div> 
                  SYSTEM SECURE
               </div>
            </div>
         </div>
      </div>

      {/* Leaderboard Drawer */}
      <AnimatePresence>
        {showLeaderboard && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeaderboard(false)}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Trophy size={24} color="#F59E0B" />
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)', margin: 0 }}>Leaderboard Rankings</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Top assessment performers in the institution.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowLeaderboard(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Leaderboard list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {leaderboard.map((student) => (
                  <div 
                    key={student.rank} 
                    style={{ 
                      padding: '18px 24px', borderRadius: '20px', border: '1px solid var(--border-color)', 
                      backgroundColor: student.rank === 1 ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-body)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--text-main)', fontSize: '1rem' }}>
                        {student.medal || student.rank}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>{student.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{student.quizzesTaken} Quizzes Taken</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>AVG ACCURACY</div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 950, color: '#10B981' }}>{student.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Historical Results Log Drawer */}
      <AnimatePresence>
        {showResultsLog && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResultsLog(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(8px)' }}
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', right: 0, top: 0, bottom: 0, width: '500px', maxWidth: '100%', 
                backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', 
                boxShadow: 'var(--shadow-2xl)', zIndex: 1001, display: 'flex', flexDirection: 'column', 
                padding: '32px', overflowY: 'auto' 
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 955, color: 'var(--text-main)', margin: 0 }}>Quiz Results Directory</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>Historical record of student quiz attempts and grades.</p>
                </div>
                <button 
                  onClick={() => setShowResultsLog(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Log List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentResults.map((res) => (
                  <div key={res.id} style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)' }}>{res.quizTitle}</h4>
                      <span style={{ fontSize: '1rem', fontWeight: 950, color: res.color }}>{res.score} ({res.accuracy}%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px', fontWeight: 600 }}>
                      <span>Student: {res.user}</span>
                      <span>Attempted: {res.date}</span>
                    </div>
                    {res.accuracy >= 80 && (
                      <button 
                        onClick={() => showToast(`Certificate for "${res.quizTitle}" has been downloaded!`, 'success', 'Certificate Ready')}
                        style={{ width: '100%', marginTop: '14px', padding: '10px', borderRadius: '8px', border: '1px solid #8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.05)', color: '#8B5CF6', fontWeight: 900, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Award size={14} /> DOWNLOAD CERTIFICATE
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create New Quiz Modal */}
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
                    <Plus size={20} color="var(--primary)" /> Create Assessment Quiz
                  </h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateQuizSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>QUIZ TITLE *</label>
                    <input 
                      type="text" 
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Weekly Calculus Concepts"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>SUBJECT</label>
                      <select 
                        value={createForm.subject}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, subject: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['Mathematics', 'Physics', 'Chemistry', 'History', 'Geography', 'Technology', 'Business'].map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>DIFFICULTY LEVEL</label>
                      <select 
                        value={createForm.difficulty}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, difficulty: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                      >
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>QUESTION COUNT</label>
                      <input 
                        type="number" 
                        value={createForm.questions}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, questions: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>TIME LIMIT (MINUTES)</label>
                      <input 
                        type="number" 
                        value={createForm.time}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, time: e.target.value }))}
                        style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontWeight: 600, outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button 
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(72, 128, 255, 0.2)' }}
                    >
                      Create Quiz
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Proctored Interactive Quiz Player Simulator */}
      <AnimatePresence>
        {activeQuizSession && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, backgroundColor: 'var(--bg-body)', zIndex: 2000, 
              display: 'flex', flexDirection: 'column', padding: '40px', overflowY: 'auto' 
            }}
          >
            {/* Proctor Alert banner */}
            <div style={{ 
              width: '100%', maxWidth: '800px', margin: '0 auto 24px', padding: '12px 24px', 
              borderRadius: '16px', backgroundColor: proctorWarning ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
              color: proctorWarning ? '#EF4444' : '#10B981', border: proctorWarning ? '1px solid #EF4444' : '1px solid #10B981',
              display: 'flex', alignItems: 'center', justifySpace: 'between', flexWrap: 'wrap', gap: '8px',
              fontWeight: 800, fontSize: '0.85rem'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: proctorWarning ? '#EF4444' : '#10B981', animation: 'pulse 1.2s infinite' }}></span>
                {proctorWarning ? 'PROCTOR WARNING: Shifting focus from browser window is logged!' : 'PROCTOR STATUS: SECURE • Focus monitoring active'}
              </span>
            </div>

            {/* Inner Content Grid */}
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
              {/* Header Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--primary)' }}>{activeQuizSession.subject} ASSESSMENT</span>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 955, color: 'var(--text-main)', margin: '6px 0 0' }}>{activeQuizSession.title}</h2>
                </div>
                {quizCompletedScore === null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                    <Timer size={18} color="#EF4444" />
                    <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 900, color: quizTimer <= 60 ? '#EF4444' : 'var(--text-main)' }}>
                      {formatTimer(quizTimer)}
                    </span>
                  </div>
                )}
              </div>

              {/* Complete Performance Screen */}
              {quizCompletedScore !== null ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e6f4ea', color: '#137333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 955, color: 'var(--text-main)', margin: 0 }}>Quiz Submitted Successfully!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '6px', fontWeight: 600 }}>Your attempt is graded and logged in the academic record.</p>
                  </div>

                  {/* Grade Board */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', width: '100%', maxWidth: '400px' }}>
                    <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>SCORE</span>
                      <h4 style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>
                        {quizCompletedScore.correctCount} / {quizCompletedScore.totalCount}
                      </h4>
                    </div>
                    <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ACCURACY</span>
                      <h4 style={{ margin: '8px 0 0', fontSize: '1.5rem', fontWeight: 950, color: quizCompletedScore.accuracy >= 80 ? '#10B981' : '#EF4444' }}>
                        {quizCompletedScore.accuracy}%
                      </h4>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveQuizSession(null)}
                    className="btn btn-primary"
                    style={{ padding: '14px 40px', fontWeight: 900, marginTop: '20px', borderRadius: '14px' }}
                  >
                    RETURN TO DASHBOARD
                  </button>
                </motion.div>
              ) : (
                /* Playable Question Sheet */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {(questionsDatabase[activeQuizSession.id] || generalQuestions).map((q, idx) => (
                    <div key={q.id} style={{ padding: '32px', borderRadius: '28px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>QUESTION {idx + 1} OF { (questionsDatabase[activeQuizSession.id] || generalQuestions).length }</span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: '12px 0 24px', lineHeight: 1.5 }}>{q.text}</h3>
                      
                      {/* Interactive Options list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {q.options.map(opt => {
                          const isSelected = activeQuizAnswers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setActiveQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              style={{ 
                                width: '100%', padding: '16px 20px', borderRadius: '16px', 
                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                                backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-body)', 
                                color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                textAlign: 'left', fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.15s ease', fontSize: '0.9rem'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Submission Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to quit the quiz? Your progress will not be saved.")) {
                          setActiveQuizSession(null);
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Quit Session
                    </button>
                    <button 
                      onClick={handleSubmitQuiz}
                      className="btn btn-primary"
                      style={{ padding: '14px 36px', fontWeight: 900, borderRadius: '12px', boxShadow: '0 6px 16px rgba(72,128,255,0.25)', cursor: 'pointer' }}
                    >
                      SUBMIT QUIZ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default QuizCenter;
