import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Brain, Cpu, BarChart3, 
  Zap, MessageSquare, Search, Send, 
  Bot, ShieldCheck, ZapIcon, TrendingUp,
  Target, Users, BookOpen, Clock, Lock, Copy,
  Mic, Volume2, ThumbsUp, ThumbsDown, RotateCcw, 
  Square, Paperclip, Trash2, Edit3, Check, X,
  ChevronDown, Globe, Menu, PanelLeftClose, PanelLeft,
  VolumeX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resolveAIIntent } from '../utils/aiIntentRouter';
import { useToast, ToastRenderer } from '../hooks/useToast';

// Premium Model Configs resembling ChatGPT-4o and Gemini
const MODELS = {
  'intelligence-4.5': {
    id: 'intelligence-4.5',
    name: 'EduPro Intelligence 4.5',
    tagline: 'Deep Reasoning & Analytical Precision',
    icon: Sparkles,
    color: '#6366f1',
    accentColor: '#818cf8',
    bgColor: '#6366f110',
    speed: 30
  },
  'flash-lite': {
    id: 'flash-lite',
    name: 'EduPro Flash-Lite',
    tagline: 'Fast Response & Routine Tasks',
    icon: Zap,
    color: '#06b6d4',
    accentColor: '#22d3ee',
    bgColor: '#06b6d410',
    speed: 12
  }
};

// ─── Hook: reads dark-mode from localStorage + syncs with Topbar toggle ──────
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark'
  );
  useEffect(() => {
    const sync = () => setIsDark(localStorage.getItem('theme') === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('storage', sync);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', sync);
      observer.disconnect();
    };
  }, []);
  return isDark;
};

const EduProAI = () => {
  const navigate = useNavigate();
  const isDark = useDarkMode();
  const { toast, showToast, hideToast } = useToast();
  
  // Model Selector State
  const [activeModelId, setActiveModelId] = useState('intelligence-4.5');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const activeModel = MODELS[activeModelId];

  // Online & Smart Features States
  const [smartMode, setSmartMode] = useState(true); // default to true to show off the feature!
  const [expandedThoughts, setExpandedThoughts] = useState({});

  // Helper to resolve high-fidelity simulation logs for search & thinking
  const getAILogs = (textQuery) => {
    const queryLower = textQuery.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    
    let category = 'default';
    if (queryLower.match(/fee|payment|money|finance|cost|revenue|budget/)) {
      category = 'finance';
    } else if (queryLower.match(/attendance|absent|late|leave/)) {
      category = 'attendance';
    } else if (queryLower.match(/exam|grade|score|performance|result|test|gpa/)) {
      category = 'academic';
    } else if (queryLower.match(/teacher|faculty|staff|employee|payroll/)) {
      category = 'staff';
    } else if (queryLower.match(/hostel|dorm|mess|dining|food|canteen/)) {
      category = 'logistics';
    } else if (queryLower.match(/security|access|log|permission/)) {
      category = 'security';
    } else if (queryLower === 'hi' || queryLower === 'hello' || queryLower === 'hey' || queryLower === 'greetings' || queryLower === 'howdy' || queryLower === 'hi there' || queryLower === 'hello there') {
      category = 'greeting';
    }

    const logs = {
      greeting: {
        search: [
          '🌐 Parsing conversation greeting intent...',
          '🔍 Accessing system routing directory...',
          '📄 Loaded greeting localizations'
        ],
        thinking: [
          'Identified friendly conversational opener.',
          'Determined query context as non-departmental routing.',
          'Activating administrative virtual support interface.',
          'Preparing system welcome packet.'
        ]
      },
      finance: {
        search: [
          '🌐 Ingesting school_db.fees transaction database...',
          '🔍 Querying outstanding Q2 billing ledgers...',
          '📄 Retrieved outstanding balance sheet logs'
        ],
        thinking: [
          'Analyzing outstanding billing collection variables.',
          'Detected $24,500 invoice deficit in grades 10-12.',
          'Modeling payment acceleration coefficients via billing alerts.',
          'Synthesizing cashflow acceleration forecast (+18%).'
        ]
      },
      attendance: {
        search: [
          '🌐 Reading student_attendance logs...',
          '🔍 Analyzing class attendance records across sections...',
          '📄 Scanned morning roll-call and tardiness records'
        ],
        thinking: [
          'Calculating morning class attendance rates (currently 96%).',
          'Correlating daily delays with transit shuttle Route 4 logs.',
          'Formulating automated alert triggers for parental communication.',
          'Calculating impact of shifting attendance logging times (+10m shift).'
        ]
      },
      academic: {
        search: [
          '🌐 Accessing exam_marks registry...',
          '🔍 Auditing student GPA averages across classes...',
          '📄 Loaded academic performance spreadsheets'
        ],
        thinking: [
          'Processing Grade 9-12 GPA indexes (average GPA: 3.4).',
          'Identified statistical GPA dip of 2.4% in Mathematics.',
          'Designing student support protocol (revisions & tutor peer-groups).',
          'Validating study group intervention success criteria.'
        ]
      },
      staff: {
        search: [
          '🌐 Ingesting employee payroll and work logs...',
          '🔍 Querying administrative prep hours allocation maps...',
          '📄 Retrieved faculty course planner schedules'
        ],
        thinking: [
          'Auditing administrative burden indicators across faculty.',
          'Discovered 15% prep hours lost to redundant entry systems.',
          'Drafting gradebook synchronization model in LMS.',
          'Calculating employee retention acceleration index (+11% retaining).'
        ]
      },
      logistics: {
        search: [
          '🌐 Connecting to hostel allocation matrices...',
          '🔍 Scanning cafeteria traffic tracking registers...',
          '📄 Scanned peak dining hall flow metrics'
        ],
        thinking: [
          'Ingesting hostel room occupancy percentages (86% utilization rate).',
          'Pinpointing peak hall corridor congestion at 8:00 AM - 8:20 AM.',
          'Designing staggered 20-minute meal schedule offsets.',
          'Calculating projected food waste reduction curve (-12% delta).'
        ]
      },
      security: {
        search: [
          '🌐 Connecting to security overwatch access logs...',
          '🔍 Auditing digital compliance protocols...',
          '📄 Scanned parental portal 2FA authentication lists'
        ],
        thinking: [
          'Reviewing digital firewall event histories.',
          'Detected 1 blocked brute-force attack from external IP.',
          'Verifying user 2FA status (confirmed 100% compliance).',
          'Developing weekly routine system log auditing schedules.'
        ]
      },
      default: {
        search: [
          '🌐 Auditing connected system indices...',
          '🔍 Running multi-node intelligence check...',
          '📄 Scanned student, staff, and financial data hooks'
        ],
        thinking: [
          'Decoupling queries to resolve active operational entities.',
          'Structuring cross-department performance indicators.',
          'Analyzing neural system compliance vectors.',
          'Synthesizing final administrative recommendation parameters.'
        ]
      }
    };

    return logs[category];
  };

  // Chat History Sidebar & Threads State (persisted inside client database)
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(true);
  const [threads, setThreads] = useState(() => {
    const DEFAULT_THREADS = [
      {
        id: 'thread-1',
        title: 'Operational Consultation',
        modelId: 'intelligence-4.5',
        messages: [
          { role: 'assistant', text: 'Hello! I am EduPro AI. I can help you analyze institutional performance, predict student outcomes, or optimize catering schedules. How can I assist you today?', feedback: null }
        ]
      },
      {
        id: 'thread-2',
        title: 'Q2 Financial Variance',
        modelId: 'intelligence-4.5',
        messages: [
          { role: 'user', text: 'Analyze Q2 budget outstanding accounts' },
          { 
            role: 'assistant', 
            text: `**Institutional Financial Consultation complete.** \n\nBased on the latest Q2 fee collection metrics ($1.25M / 94.2% rate), I have identified a $24.5k variance in outstanding accounts.\n\nHere is my recommended optimization action plan:\n- **Billing Reminders**: Activate automated SMS & Email billing alerts under \`Settings\` to speed up payments.\n- **Direct Deposit**: Configure secure direct-deposit links to reduce manual clearing times.\n- **Reconciliation**: Audit the outstanding balance sheet weekly to capture late charges.\n\nBy implementing these, we can accelerate cash flow by 18% over the next 30 days.`,
            feedback: 'up'
          }
        ]
      },
      {
        id: 'thread-3',
        title: 'Attendance Early Warning',
        modelId: 'flash-lite',
        messages: [
          { role: 'user', text: 'Any warning vectors on student attendance?' },
          { 
            role: 'assistant', 
            text: `**Predictive Attendance Audit complete.**\n\nStandard attendance rates are optimal at 96%, but my regression model indicates early warning vectors in the morning classes.\n\n- **Core Discovery**: Faculty logs confirm morning delays are primarily due to public transit delays on Route 4.\n- **Communication**: I suggest setting up automated attendance SMS alerts in the API configuration to bridge parental communication.\n- **Flexibility**: Consider shifting morning roll-call by 10 minutes to accommodate transit variances.`,
            feedback: null
          }
        ]
      }
    ];
    const saved = localStorage.getItem('edupro_ai_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved threads:', e);
      }
    }
    return DEFAULT_THREADS;
  });
  const [activeThreadId, setActiveThreadId] = useState(() => {
    const saved = localStorage.getItem('edupro_ai_active_thread_id');
    return saved || 'thread-1';
  });
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [hoveredThreadId, setHoveredThreadId] = useState(null);

  // Main UI Chat states
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  
  // Audio Speech States
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);
  
  // Training system states
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Refs
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const inlineFileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // Sync scroll on chat updates
  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const aiHistory = activeThread.messages;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [aiHistory, isProcessing, isStreaming]);

  // Synchronize threads changes into local storage database
  useEffect(() => {
    localStorage.setItem('edupro_ai_threads', JSON.stringify(threads));
  }, [threads]);

  // Synchronize active thread selection into local storage database
  useEffect(() => {
    localStorage.setItem('edupro_ai_active_thread_id', activeThreadId);
  }, [activeThreadId]);

  // Handle Thread Switching
  const handleSelectThread = (threadId) => {
    setActiveThreadId(threadId);
    const th = threads.find(t => t.id === threadId);
    if (th) {
      setActiveModelId(th.modelId || 'intelligence-4.5');
    }
    // Cancel any active Speech
    window.speechSynthesis.cancel();
    setSpeakingMsgIndex(null);
    // Cancel any active typing stream
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      setIsStreaming(false);
      setIsProcessing(false);
    }
  };

  // Add New Chat Thread
  const handleNewChat = () => {
    const newId = `thread-${Date.now()}`;
    const newThread = {
      id: newId,
      title: 'New Conversation',
      modelId: activeModelId,
      messages: [
        { 
          role: 'assistant', 
          text: `Hello! I am EduPro AI, running on the **${activeModel.name}** model. I am ready to process your institutional inquiries. How can I help you today?`, 
          feedback: null 
        }
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
    showToast('Started a new conversation thread.', 'success', 'New Thread Created');
  };

  // Delete Chat Thread
  const handleDeleteThread = (e, threadId) => {
    e.stopPropagation();
    if (threads.length <= 1) {
      showToast('You must keep at least one conversation active.', 'info', 'Action Denied');
      return;
    }
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeThreadId === threadId) {
      const remaining = threads.filter(t => t.id !== threadId);
      setActiveThreadId(remaining[0].id);
    }
    showToast('Conversation thread removed.', 'info', 'Thread Deleted');
  };

  // Inline renaming controls
  const startRenameThread = (e, thread) => {
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditingTitleText(thread.title);
  };

  const saveRenameThread = (e, threadId) => {
    e.stopPropagation();
    if (!editingTitleText.trim()) return;
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, title: editingTitleText.trim() } : t));
    setEditingThreadId(null);
    showToast('Thread renamed successfully.', 'success', 'Saved');
  };

  const cancelRenameThread = (e) => {
    e.stopPropagation();
    setEditingThreadId(null);
  };

  // Reset Context for active thread
  const handleClearContext = () => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          title: 'New Conversation',
          messages: [
            { 
              role: 'assistant', 
              text: `Hello! I am EduPro AI. Context has been reset. How can I assist you with institutional insights today?`, 
              feedback: null 
            }
          ]
        };
      }
      return t;
    }));
    window.speechSynthesis.cancel();
    setSpeakingMsgIndex(null);
    showToast('Active thread context has been reset.', 'info', 'Context Reset');
  };

  // Purge entire threads database and reset
  const handleClearAllThreads = () => {
    localStorage.removeItem('edupro_ai_threads');
    localStorage.removeItem('edupro_ai_active_thread_id');
    
    const newId = `thread-${Date.now()}`;
    const defaultThread = {
      id: newId,
      title: 'Operational Consultation',
      modelId: 'intelligence-4.5',
      messages: [
        { role: 'assistant', text: 'Hello! I am EduPro AI. I can help you analyze institutional performance, predict student outcomes, or optimize catering schedules. How can I assist you today?', feedback: null }
      ]
    };
    
    setThreads([defaultThread]);
    setActiveThreadId(newId);
    window.speechSynthesis.cancel();
    setSpeakingMsgIndex(null);
    showToast('Database reset. All conversation histories have been purged.', 'info', 'History Cleared');
  };

  // Ingestion File Drop controls
  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validTypes = ['.pdf', '.docx', '.csv', '.doc', '.xlsx'];
    const validFiles = files.filter(f => validTypes.some(ext => f.name.toLowerCase().endsWith(ext)));
    if (validFiles.length === 0) {
      showToast('Unsupported file format. Please upload PDF, DOCX, or CSV files.', 'error', 'Upload Failed');
      return;
    }
    setUploadedFiles(prev => [...prev, ...validFiles]);
    const names = validFiles.map(f => f.name).join(', ');
    showToast(`${validFiles.length} file(s) queued for training: ${names}`, 'success', 'Files Uploaded');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Progress Training
  const startTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          showToast('Institutional AI training complete. Neural weights have been recalibrated.', 'success', 'Training Complete');
          setTimeout(() => setShowTrainingModal(false), 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Voice Speech Synthesis (Read Aloud)
  const handleSpeakText = (text, index) => {
    if (speakingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    // Strip bold markers and code blocks from speak text
    const cleanText = text.replace(/[\*`#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeakingMsgIndex(null);
    utterance.onerror = () => setSpeakingMsgIndex(null);
    setSpeakingMsgIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Typing (Speech to Text)
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showToast('Speech recognition is not supported in this browser.', 'error', 'Not Supported');
        return;
      }
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onstart = () => {
        setIsListening(true);
        showToast('Listening to your query...', 'info', 'Voice Dictation Active');
      };
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setQuery(prev => {
          const fullVal = prev ? prev + ' ' + text : text;
          // Synchronize to sidebar thread title in real-time
          setThreads(threadsPrev => threadsPrev.map(t => {
            if (t.id === activeThreadId && t.messages.length <= 1) {
              const displayTitle = fullVal.trim() 
                ? (fullVal.length > 22 ? fullVal.substring(0, 20) + '...' : fullVal)
                : 'New Conversation';
              return { ...t, title: displayTitle };
            }
            return t;
          }));
          return fullVal;
        });
      };
      rec.onerror = () => {
        setIsListening(false);
        showToast('Voice dictation error or timeout.', 'error', 'Speech Failed');
      };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
      rec.start();
    }
  };

  // Stop generative stream
  const handleStopGenerating = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setIsStreaming(false);
    setIsProcessing(false);
    showToast('AI response generation stopped.', 'info', 'Generation Terminated');
  };

  // Handle typing input in real-time to update the sidebar title dynamically
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        // Only dynamically change the title if this is a new conversation thread with 1 message (the greeting)
        const isNewThread = t.messages.length <= 1;
        if (isNewThread) {
          const displayTitle = val.trim() 
            ? (val.length > 22 ? val.substring(0, 20) + '...' : val)
            : 'New Conversation';
          return { ...t, title: displayTitle };
        }
      }
      return t;
    }));
  };

  // User input submission
  const handleQuery = (e) => {
    e.preventDefault();
    if (!query.trim() || isProcessing || isStreaming) return;
    submitQuery(query.trim());
    setQuery('');
  };

  const runSearchStage = (textQuery, activeLogs) => {
    if (!searchActive) {
      runThinkingStage(textQuery, activeLogs);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < activeLogs.search.length) {
        const nextStep = activeLogs.search[currentIndex];
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            const msgs = [...t.messages];
            const last = { ...msgs[msgs.length - 1] };
            last.searchSteps = [...(last.searchSteps || []), nextStep];
            last.currentSearchIndex = currentIndex;
            msgs[msgs.length - 1] = last;
            return { ...t, messages: msgs };
          }
          return t;
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setThreads(prev => prev.map(t => {
            if (t.id === activeThreadId) {
              const msgs = [...t.messages];
              const last = { ...msgs[msgs.length - 1] };
              last.isSearching = false; // completed search
              msgs[msgs.length - 1] = last;
              return { ...t, messages: msgs };
            }
            return t;
          }));
          runThinkingStage(textQuery, activeLogs);
        }, 500);
      }
    }, 400);
  };

  const runThinkingStage = (textQuery, activeLogs) => {
    if (!smartMode) {
      runStreamingStage(textQuery);
      return;
    }

    let currentIndex = 0;
    let startTime = Date.now();
    
    const timerInterval = setInterval(() => {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          const msgs = [...t.messages];
          const last = { ...msgs[msgs.length - 1] };
          last.thinkingTime = elapsed;
          msgs[msgs.length - 1] = last;
          return { ...t, messages: msgs };
        }
        return t;
      }));
    }, 100);

    const stepInterval = setInterval(() => {
      if (currentIndex < activeLogs.thinking.length) {
        const nextThought = activeLogs.thinking[currentIndex];
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            const msgs = [...t.messages];
            const last = { ...msgs[msgs.length - 1] };
            last.thinkingSteps = [...(last.thinkingSteps || []), nextThought];
            last.currentThinkingIndex = currentIndex;
            msgs[msgs.length - 1] = last;
            return { ...t, messages: msgs };
          }
          return t;
        }));
        currentIndex++;
      } else {
        clearInterval(stepInterval);
        clearInterval(timerInterval);
        
        setTimeout(() => {
          setThreads(prev => prev.map(t => {
            if (t.id === activeThreadId) {
              const msgs = [...t.messages];
              const last = { ...msgs[msgs.length - 1] };
              last.isThinking = false; // completed thinking
              msgs[msgs.length - 1] = last;
              return { ...t, messages: msgs };
            }
            return t;
          }));
          runStreamingStage(textQuery);
        }, 400);
      }
    }, 500);
  };

  const runStreamingStage = (textQuery) => {
    setIsProcessing(false);
    setIsStreaming(true);

    const intent = resolveAIIntent(textQuery);
    let routeAction = intent.route;
    let textResponse = intent.text;

    if (!textResponse) {
      const queryLower = textQuery.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      
      if (queryLower === 'hi' || queryLower === 'hello' || queryLower === 'hey' || queryLower === 'greetings' || queryLower === 'howdy' || queryLower === 'hi there' || queryLower === 'hello there') {
        textResponse = `**Hey there! How are you?** How could I assist you today? \n\nI am your **EduPro AI Operational Consultant**, ready to help you analyze institutional performance, predict student outcomes, optimize catering schedules, or audit financial balances. Let's make today highly productive!`;
      } else if (queryLower.match(/fee|payment|money|finance|cost|revenue|budget/)) {
        textResponse = `**Institutional Financial Consultation complete.** \n\nBased on the latest Q2 fee collection metrics ($1.25M / 94.2% rate), I have identified a $24.5k variance in outstanding accounts.\n\nHere is my recommended optimization action plan:\n- **Billing Reminders**: Activate automated SMS & Email billing alerts under \`Settings\` to speed up payments.\n- **Direct Deposit**: Configure secure direct-deposit links to reduce manual clearing times.\n- **Reconciliation**: Audit the outstanding balance sheet weekly to capture late charges.\n\nBy implementing these, we can accelerate cash flow by 18% over the next 30 days.`;
      } else if (queryLower.match(/attendance|absent|late|leave/)) {
        textResponse = `**Predictive Attendance Audit complete.**\n\nStandard attendance rates are optimal at 96%, but my regression model indicates early warning vectors in the morning classes.\n\n- **Core Discovery**: Faculty logs confirm morning delays are primarily due to public transit delays on Route 4.\n- **Communication**: I suggest setting up automated attendance SMS alerts in the API configuration to bridge parental communication.\n- **Flexibility**: Consider shifting morning roll-call by 10 minutes to accommodate transit variances.`;
      } else if (queryLower.match(/exam|grade|score|performance|result|test|gpa/)) {
        textResponse = `**Academic Performance Analysis complete.**\n\nThe institutional GPA stands at a premium 3.4. While Humanities and Sciences show strong growth, Mathematics has experienced a minor 2.4% dip.\n\n1. **Revision Sheets**: Deploy supplementary interactive revision sheets to the LMS Digital Library.\n2. **Study Groups**: Form tutor-led peer study groups for students falling below the 2.8 GPA threshold.\n3. **Analytics**: Track interactive progress metrics on the academic performance dashboard.`;
      } else if (queryLower.match(/teacher|faculty|staff|employee|payroll/)) {
        textResponse = `**Operational Staff Audit complete.**\n\nCurrently, 15% of teacher prep hours are allocated to administrative routine tasks.\n\n- **Automating Gradebooks**: Syncing the LMS Course planner will save approximately 6 hours per week per faculty member, significantly reducing administrative fatigue.\n- **Fatigue Reduction**: Saving these routine administrative hours is projected to increase overall employee retention by 11%.`;
      } else if (queryLower.match(/hostel|dorm|mess|dining|food|canteen/)) {
        textResponse = `**Logistical & Hostel Audit complete.**\n\nMess hall utilization peaks at 86% during breakfast hours.\n\n- **Meal Timetable Shift**: Shifting the meal timetable to overlapping 20-minute windows.\n- **Waste Minimization**: Streamline menu planning on the Dining Hub to reduce peak congestion by 35% and minimize food waste by 12%.`;
      } else if (queryLower.match(/security|access|log|permission/)) {
        textResponse = `**Security Overwatch Analysis active.**\n\nThe digital perimeter is highly secure. Here is the threat intelligence report:\n- **Blocked Events**: Detected 1 blocked brute-force firewall event from external servers last week.\n- **Authentication**: Two-factor authentication (2FA) is successfully active for all parent portals.\n- **Audit Frequency**: I recommend auditing access logs on the Security Overwatch page weekly.`;
      } else {
        textResponse = `**Institutional Intelligence query processed successfully.**\n\nRegarding your request: *"${textQuery}"*, our neural networks have reviewed all linked student, staff, and financial nodes. The institutional command centers are operating at peak efficiency.\n\nWould you like me to generate a detailed report for this department or explore specific student analytics?`;
      }
    }

    let searchPrepend = "";
    if (searchActive) {
      searchPrepend = `**[Database & Web Search Enabled]**\n\n`;
    }

    const fullResponse = searchPrepend + textResponse + (routeAction ? "" : "\n\nWould you like me to generate a detailed report?");

    let currentText = "";
    let wordIndex = 0;
    const words = fullResponse.split(" ");

    typingIntervalRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            const msgs = [...t.messages];
            msgs[msgs.length - 1] = {
              ...msgs[msgs.length - 1],
              text: currentText,
              isStreaming: true
            };
            return { ...t, messages: msgs };
          }
          return t;
        }));
        wordIndex++;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsStreaming(false);

        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            const msgs = [...t.messages];
            msgs[msgs.length - 1] = {
              ...msgs[msgs.length - 1],
              text: fullResponse,
              isStreaming: false
            };
            return { ...t, messages: msgs };
          }
          return t;
        }));

        if (routeAction) {
          setTimeout(() => {
            navigate(routeAction);
          }, 1800);
        }
      }
    }, activeModel.speed);
  };

  const submitQuery = (textQuery) => {
    // Add user message to active thread
    const userMsg = { role: 'user', text: textQuery };
    
    // Determine category and logs
    const activeLogs = getAILogs(textQuery);

    // Cancel active Speech synthesis
    window.speechSynthesis.cancel();
    setSpeakingMsgIndex(null);

    // 1. Add user message
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        const isFirstQuery = t.title === 'New Conversation' || t.title === 'New Chat' || t.title === 'New Conversation Thread' || !t.messages || t.messages.length <= 2;
        const newTitle = isFirstQuery 
          ? (textQuery.length > 25 ? textQuery.substring(0, 22) + '...' : textQuery)
          : t.title;
        return { 
          ...t, 
          title: newTitle,
          messages: [...t.messages, userMsg] 
        };
      }
      return t;
    }));

    setIsProcessing(true);

    // 2. Add assistant message placeholder
    const assistantMsgPlaceholder = {
      role: 'assistant',
      text: '',
      isSearching: searchActive,
      searchSteps: [],
      currentSearchIndex: -1,
      isThinking: smartMode,
      thinkingSteps: [],
      currentThinkingIndex: -1,
      thinkingTime: 0,
      isStreaming: false,
      feedback: null
    };

    setTimeout(() => {
      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return { ...t, messages: [...t.messages, assistantMsgPlaceholder] };
        }
        return t;
      }));

      // Start stages
      runSearchStage(textQuery, activeLogs);
    }, 400);
  };

  // Feedback widgets handler
  const handleFeedback = (msgIndex, type) => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        const updated = [...t.messages];
        const currentFeedback = updated[msgIndex].feedback;
        updated[msgIndex] = {
          ...updated[msgIndex],
          feedback: currentFeedback === type ? null : type
        };
        return { ...t, messages: updated };
      }
      return t;
    }));
    
    showToast(
      type === 'up' ? 'Feedback submitted. Thank you for rating this response!' : 'Feedback submitted. We will recalibrate the training parameters.',
      'success',
      'Feedback Recorded'
    );
  };

  // Regenerate last response
  const handleRegenerate = () => {
    if (isProcessing || isStreaming || aiHistory.length < 2) return;
    const historyCopy = [...aiHistory];
    // Find last user query
    let lastUserQuery = '';
    for (let i = historyCopy.length - 1; i >= 0; i--) {
      if (historyCopy[i].role === 'user') {
        lastUserQuery = historyCopy[i].text;
        break;
      }
    }

    if (!lastUserQuery) return;

    // Pop the last assistant message
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        const popped = t.messages.slice(0, -1);
        return { ...t, messages: popped };
      }
      return t;
    }));

    showToast('Regenerating response...', 'info', 'Regeneration Active');
    submitQuery(lastUserQuery);
  };

  // Custom mini markdown elements formatter
  const parseAIResponse = (text) => {
    if (!text) return '';
    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      const lines = para.split('\n');
      const isBulletList = lines.every(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
      const isNumList = lines.every(line => /^\d+\.\s/.test(line.trim()));

      if (isBulletList) {
        return (
          <ul key={pIdx} style={{ margin: '14px 0', paddingLeft: '24px', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^[\s-*]+/, '');
              return <li key={lIdx} style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6 }}>{renderFormattedText(cleaned)}</li>;
            })}
          </ul>
        );
      }

      if (isNumList) {
        return (
          <ol key={pIdx} style={{ margin: '14px 0', paddingLeft: '24px', listStyleType: 'decimal', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^\d+\.\s+/, '');
              return <li key={lIdx} style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6 }}>{renderFormattedText(cleaned)}</li>;
            })}
          </ol>
        );
      }

      return (
        <p key={pIdx} style={{ margin: '12px 0', lineHeight: 1.7, color: 'var(--text-main)', fontSize: '0.92rem' }}>
          {renderFormattedText(para)}
        </p>
      );
    });
  };

  const renderFormattedText = (text) => {
    // Regex matches bold (**bold**), code pills (`code`), stats (% or $ currency)
    const regex = /(\*\*.*?\*\*|`.*?`|\$\d+(?:\.\d+)?[M|k]|(?:\d+(?:\.\d+)?%))/g;
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ fontWeight: 800, color: 'var(--text-main)' }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} style={{ 
            fontFamily: 'monospace', 
            backgroundColor: 'var(--bg-body)', 
            padding: '2px 6px', 
            borderRadius: '6px', 
            fontSize: '0.85em', 
            color: '#4f46e5',
            border: '1px solid var(--border-color)',
            fontWeight: 700
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      if (/^\$\d+(?:\.\d+)?[M|k]$/.test(part) || /^\d+(?:\.\d+)?%$/.test(part)) {
        return (
          <span key={idx} style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#10b98115',
            color: '#10b981',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 800,
            margin: '0 4px',
            border: '1px solid #10b98125',
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.05)'
          }}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // File attach direct from input panel
  const handleInlineFileAttach = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadedFiles(prev => [...prev, ...files]);
    showToast(`Attached ${files.length} file(s) directly to the active session.`, 'success', 'Attached');
  };

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', fontFamily: 'inherit' }}>
      
      {/* Upper Brand Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', borderRadius: '30px', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <Sparkles size={16} /> INSTITUTIONAL INTELLIGENCE
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            EduPro <span style={{ color: '#6366f1' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
            Advanced predictive modeling and automated administrative insights.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <button 
             onClick={() => setShowTrainingModal(true)}
             style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}
             onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--text-muted)'}
             onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--text-main)'}
           >
              <Cpu size={18} /> Train AI
           </button>
           <div style={{ padding: '16px 24px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>AI CORE SECURE</span>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '32px' }}>
        
        {/* Left column: Analytics Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={20} color="#6366f1" /> Predictive Analytics
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'Student Performance Prediction', val: '+12%', color: '#10b981', trend: 'Improving' },
                    { label: 'Dropout Risk Probability', val: '2.4%', color: '#f59e0b', trend: 'Low' },
                    { label: 'Administrative Load Forecast', val: '88%', color: '#4f46e5', trend: 'Optimal' }
                  ].map((stat, i) => (
                     <div key={i} style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>{stat.label}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                           <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>{stat.val}</div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 900, color: stat.color }}>{stat.trend}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '32px', color: 'var(--text-main)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
               <Brain size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.08 }} />
               <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '16px' }}>Neural Engine Status</h4>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Real-time Data Processing Active</span>
               </div>
               <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: 0 }}>
                  The EduPro Neural Engine is currently analyzing 50M+ institutional data points to optimize your operational roadmap.
               </p>
            </div>
        </div>

        {/* Right column: High-Fidelity Gemini/ChatGPT Console */}
        <div style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '32px', 
          border: '1px solid var(--border-color)', 
          display: 'grid', 
          gridTemplateColumns: isHistorySidebarOpen ? '260px 1fr' : '0px 1fr', 
          transition: 'grid-template-columns 0.3s ease',
          height: 'calc(100vh - 240px)', 
          overflow: 'hidden', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.02)' 
        }}>
           
           {/* Collapsible Chat Threads Sidebar */}
           <div style={{ 
             backgroundColor: 'var(--bg-body)', 
             borderRight: '1px solid var(--border-color)', 
             display: 'flex', 
             flexDirection: 'column', 
             overflow: 'hidden',
             visibility: isHistorySidebarOpen ? 'visible' : 'hidden'
           }}>
             
             {/* New Chat Area */}
             <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-color)' }}>
               <button 
                 onClick={handleNewChat}
                 style={{ 
                   width: '100%', 
                   padding: '12px', 
                   borderRadius: '14px', 
                   backgroundColor: 'var(--text-main)', 
                   color: 'var(--bg-body)', 
                   border: 'none', 
                   fontWeight: 800, 
                   fontSize: '0.85rem', 
                   cursor: 'pointer', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   gap: '8px',
                   boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                 }}
               >
                 <MessageSquare size={16} /> New Chat
               </button>
             </div>

             {/* Recent Threads List */}
             <div style={{ flex: 1, padding: '16px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', paddingLeft: '8px', marginBottom: '4px' }}>
                 RECENT CONVERSATIONS
               </div>
               
               {threads.map((thread) => {
                 const isActive = thread.id === activeThreadId;
                 const isEditing = editingThreadId === thread.id;

                 return (
                   <div 
                     key={thread.id} 
                     onClick={() => !isEditing && handleSelectThread(thread.id)}
                     onMouseEnter={() => setHoveredThreadId(thread.id)}
                     onMouseLeave={() => setHoveredThreadId(null)}
                     style={{ 
                       padding: '10px 12px', 
                       borderRadius: '12px', 
                       backgroundColor: isActive ? 'var(--bg-card)' : (hoveredThreadId === thread.id ? 'var(--bg-body)' : 'transparent'), 
                       border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'space-between',
                       transition: '0.2s',
                       boxShadow: isActive ? '0 4px 6px -1px rgba(0,0,0,0.03)' : 'none'
                     }}
                     className="thread-item"
                   >
                     {isEditing ? (
                       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
                         <input 
                           type="text" 
                           value={editingTitleText} 
                           onChange={e => setEditingTitleText(e.target.value)}
                           onClick={e => e.stopPropagation()}
                           style={{ width: '70%', padding: '4px 6px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid #6366f1', borderRadius: '6px', outline: 'none', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)' }}
                         />
                         <button onClick={(e) => saveRenameThread(e, thread.id)} style={{ padding: '2px', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><Check size={14} /></button>
                         <button onClick={cancelRenameThread} style={{ padding: '2px', background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}><X size={14} /></button>
                       </div>
                     ) : (
                       <>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '70%', overflow: 'hidden' }}>
                           <MessageSquare size={14} color={isActive ? '#6366f1' : '#64748b'} />
                           <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 800 : 600, color: isActive ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                             {thread.title}
                           </span>
                         </div>
                         {(isActive || hoveredThreadId === thread.id) && (
                           <div style={{ display: 'flex', gap: '4px' }}>
                             <button 
                               onClick={(e) => startRenameThread(e, thread)}
                               style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                             >
                               <Edit3 size={12} />
                             </button>
                             <button 
                               onClick={(e) => handleDeleteThread(e, thread.id)}
                               style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                             >
                               <Trash2 size={12} />
                             </button>
                           </div>
                         )}
                       </>
                     )}
                   </div>
                 );
               })}
             </div>

             {/* Sidebar Footer Controls */}
             <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}>
               <button 
                 onClick={handleClearAllThreads}
                 style={{ 
                   width: '100%', 
                   padding: '10px', 
                   borderRadius: '10px', 
                   backgroundColor: 'transparent', 
                   color: '#f43f5e', 
                   border: '1px solid #f43f5e30', 
                   fontWeight: 800, 
                   fontSize: '0.78rem', 
                   cursor: 'pointer', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   gap: '8px',
                   transition: '0.2s'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.backgroundColor = '#f43f5e10';
                   e.currentTarget.style.borderColor = '#f43f5e';
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.backgroundColor = 'transparent';
                   e.currentTarget.style.borderColor = '#f43f5e30';
                 }}
               >
                 <Trash2 size={14} /> Clear All Chats
               </button>
             </div>
           </div>

           {/* Active Chat Window Area */}
           <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
             
             {/* Chat Workspace Header */}
             <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', zIndex: 10 }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   
                   {/* Sidebar Toggle Button */}
                   <button 
                     onClick={() => setIsHistorySidebarOpen(!isHistorySidebarOpen)}
                     style={{ 
                       background: 'none', 
                       border: 'none', 
                       color: 'var(--text-muted)', 
                       cursor: 'pointer', 
                       padding: '8px', 
                       borderRadius: '8px', 
                       backgroundColor: 'var(--bg-body)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       marginRight: '4px'
                     }}
                   >
                     {isHistorySidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                   </button>

                   {/* Model selector trigger */}
                   <div style={{ position: 'relative' }}>
                     <button 
                       onClick={() => setShowModelDropdown(!showModelDropdown)}
                       style={{ 
                         padding: '8px 16px', 
                         borderRadius: '12px', 
                         border: '1px solid var(--border-color)', 
                         backgroundColor: 'var(--bg-body)', 
                         display: 'flex', 
                         alignItems: 'center', 
                         gap: '8px', 
                         cursor: 'pointer',
                         transition: '0.2s'
                       }}
                     >
                       <activeModel.icon size={16} color={activeModel.color} />
                       <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeModel.name}</span>
                       <ChevronDown size={14} color="var(--text-muted)" />
                     </button>

                     {/* Model Selector Dropdown list */}
                     <AnimatePresence>
                       {showModelDropdown && (
                         <>
                           <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowModelDropdown(false)} />
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 10 }}
                             style={{ 
                               position: 'absolute', 
                               top: '100%', 
                               left: 0, 
                               marginTop: '8px', 
                               width: '320px', 
                               backgroundColor: 'var(--bg-card)', 
                               borderRadius: '16px', 
                               boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                               border: '1px solid var(--border-color)',
                               padding: '8px', 
                               zIndex: 50 
                             }}
                           >
                             {Object.values(MODELS).map((m) => (
                               <div 
                                 key={m.id}
                                 onClick={() => {
                                   setActiveModelId(m.id);
                                   // Sync to active thread structure
                                   setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, modelId: m.id } : t));
                                   setShowModelDropdown(false);
                                   showToast(`Switched active intelligence core to ${m.name}`, 'info', 'Model Switched');
                                 }}
                                 style={{ 
                                   padding: '12px', 
                                   borderRadius: '12px', 
                                   backgroundColor: activeModelId === m.id ? m.bgColor : 'transparent',
                                   cursor: 'pointer',
                                   display: 'flex',
                                   gap: '12px',
                                   alignItems: 'flex-start',
                                   transition: '0.2s'
                                 }}
                                 onMouseEnter={e => e.currentTarget.style.backgroundColor = m.bgColor}
                                 onMouseLeave={e => {
                                   if (activeModelId !== m.id) e.currentTarget.style.backgroundColor = 'transparent';
                                 }}
                               >
                                 <m.icon size={18} color={m.color} style={{ marginTop: '2px', flexShrink: 0 }} />
                                 <div>
                                   <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{m.name}</div>
                                   <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>{m.tagline}</div>
                                 </div>
                               </div>
                             ))}
                           </motion.div>
                         </>
                       )}
                     </AnimatePresence>
                   </div>
                </div>

                {/* Right utility buttons */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button 
                    onClick={handleClearContext} 
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '10px', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-body)', 
                      color: 'var(--text-muted)', 
                      fontWeight: 800, 
                      fontSize: '0.75rem', 
                      cursor: 'pointer', 
                      transition: '0.3s' 
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    Clear Context
                  </button>
                </div>
             </div>

             {/* Chat Messages Log */}
             <div 
               ref={chatContainerRef}
               style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: 'var(--bg-card)' }}
             >
                {aiHistory.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const isSpeaking = speakingMsgIndex === i;

                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 12 }} 
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        maxWidth: '82%', 
                        display: 'flex', 
                        gap: '14px',
                        flexDirection: isUser ? 'row-reverse' : 'row'
                      }}
                    >
                       {/* Avatar block with animated neural pulse for AI */}
                       <div style={{ 
                         width: '36px', 
                         height: '36px', 
                         borderRadius: '12px', 
                         backgroundColor: isUser ? (isDark ? '#6366f1' : '#0f172a') : activeModel.bgColor,
                         color: isUser ? 'white' : activeModel.color,
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center', 
                         flexShrink: 0,
                         boxShadow: isUser ? 'none' : `0 0 15px ${activeModel.color}15`,
                         border: isUser ? 'none' : `1px solid ${activeModel.color}25`
                       }}>
                          {isUser ? <Users size={16} /> : <Bot size={18} />}
                       </div>

                       {/* Message Bubble wrapper */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                         <div style={{ 
                           padding: '18px 22px', 
                           borderRadius: '24px', 
                           borderTopRightRadius: isUser ? '4px' : '24px',
                           borderTopLeftRadius: isUser ? '24px' : '4px',
                           backgroundColor: isUser ? (isDark ? '#6366f1' : '#0f172a') : 'var(--bg-body)',
                           color: isUser ? 'white' : 'var(--text-main)',
                           fontWeight: isUser ? 600 : 500, 
                           border: isUser ? 'none' : '1px solid var(--border-color)',
                           boxShadow: isUser ? '0 4px 15px rgba(15,23,42,0.05)' : 'none',
                           position: 'relative'
                         }}>
                            
                            {/* User plain-text or AI Custom Formatted Markdown */}
                            {/* Online Web Search Progress logs */}
                            {!isUser && (msg.searchSteps && msg.searchSteps.length > 0 || msg.isSearching) && (
                              <div style={{
                                marginBottom: '16px',
                                padding: '14px 18px',
                                borderRadius: '16px',
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid #10b98120',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.8rem', fontWeight: 800 }}>
                                  <motion.div
                                    animate={{ rotate: msg.isSearching ? 360 : 0 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                  >
                                    <Globe size={14} />
                                  </motion.div>
                                  <span>ONLINE WEB SEARCH</span>
                                  {msg.isSearching && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>• searching indices...</span>
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                                  {msg.searchSteps && msg.searchSteps.map((step, sIdx) => (
                                    <motion.div 
                                      key={sIdx}
                                      initial={{ opacity: 0, x: -4 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                      {step}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Deep Reasoning chain-of-thought blocks */}
                            {!isUser && (msg.thinkingSteps && msg.thinkingSteps.length > 0 || msg.isThinking) && (
                              <div style={{
                                marginBottom: '16px',
                                borderRadius: '16px',
                                border: '1px solid #6366f120',
                                backgroundColor: '#6366f104',
                                overflow: 'hidden'
                              }}>
                                <div 
                                  onClick={() => setExpandedThoughts(prev => ({ ...prev, [i]: !prev[i] }))}
                                  style={{
                                    padding: '12px 18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    borderBottom: expandedThoughts[i] || msg.isThinking ? '1px solid #6366f115' : 'none'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontSize: '0.8rem', fontWeight: 800 }}>
                                    <Brain size={14} />
                                    <span>SMART DEEP REASONING</span>
                                    {msg.thinkingTime > 0 && (
                                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>({msg.thinkingTime}s)</span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span>{expandedThoughts[i] || msg.isThinking ? 'Hide Thoughts' : 'Expand Thoughts'}</span>
                                    <ChevronDown size={14} style={{ transform: expandedThoughts[i] || msg.isThinking ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {(expandedThoughts[i] || msg.isThinking) && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      style={{ overflow: 'hidden' }}
                                    >
                                      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {msg.thinkingSteps && msg.thinkingSteps.map((step, tIdx) => (
                                          <motion.div
                                            key={tIdx}
                                            initial={{ opacity: 0, x: -4 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.5 }}
                                          >
                                            <span style={{ color: '#6366f1', userSelect: 'none' }}>•</span>
                                            <span>{step}</span>
                                          </motion.div>
                                        ))}
                                        {msg.isThinking && (
                                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px', paddingLeft: '2px' }}>
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366f1' }}></motion.div>
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366f1' }}></motion.div>
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366f1' }}></motion.div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, fontStyle: 'italic' }}>thinking...</span>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {isUser ? (
                              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>{msg.text}</p>
                            ) : (
                              parseAIResponse(msg.text)
                            )}

                            {/* Active typing blinker cursor */}
                            {msg.isStreaming && (
                              <motion.span 
                                animate={{ opacity: [0.2, 1, 0.2] }} 
                                transition={{ repeat: Infinity, duration: 0.7 }} 
                                style={{ 
                                  display: 'inline-block', 
                                  width: '4px', 
                                  height: '15px', 
                                  backgroundColor: activeModel.color, 
                                  marginLeft: '4px', 
                                  verticalAlign: 'middle' 
                                }}
                              />
                            )}

                            {/* Actions panel under responses */}
                            {!isUser && !msg.isStreaming && (
                              <div style={{ 
                                display: 'flex', 
                                gap: '14px', 
                                marginTop: '12px', 
                                borderTop: '1px solid var(--border-color)', 
                                paddingTop: '10px', 
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                              }}>
                                 {/* Text-to-Speech button with active soundwave animation */}
                                 <button 
                                   type="button"
                                   onClick={() => handleSpeakText(msg.text, i)}
                                   style={{ 
                                     display: 'inline-flex', 
                                     alignItems: 'center', 
                                     gap: '4px', 
                                     background: 'none', 
                                     border: 'none', 
                                     color: isSpeaking ? activeModel.color : 'var(--text-muted)', 
                                     cursor: 'pointer', 
                                     fontSize: '0.75rem', 
                                     fontWeight: 800,
                                     transition: '0.2s'
                                   }}
                                 >
                                    {isSpeaking ? (
                                      <>
                                        <VolumeX size={14} /> 
                                        <span>Stop Voice</span>
                                        {/* Premium Live Audio Wave dots */}
                                        <div style={{ display: 'flex', gap: '2px', marginLeft: '4px', alignItems: 'center', height: '10px' }}>
                                          <motion.div animate={{ height: [3, 9, 3] }} transition={{ repeat: Infinity, duration: 0.6 }} style={{ width: '2px', backgroundColor: activeModel.color }} />
                                          <motion.div animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} style={{ width: '2px', backgroundColor: activeModel.color }} />
                                          <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} style={{ width: '2px', backgroundColor: activeModel.color }} />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <Volume2 size={14} /> 
                                        <span>Read Out</span>
                                      </>
                                    )}
                                 </button>

                                 {/* Copy button */}
                                 <button 
                                   type="button"
                                   onClick={() => {
                                     navigator.clipboard.writeText(msg.text);
                                     showToast('Response copied to clipboard!', 'success', 'Copied');
                                   }}
                                   style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800 }}
                                 >
                                    <Copy size={13} /> Copy
                                 </button>

                                 {/* Feedback widgets */}
                                 <div style={{ display: 'flex', gap: '6px', borderLeft: '1px solid var(--border-color)', paddingLeft: '10px' }}>
                                   <button 
                                     onClick={() => handleFeedback(i, 'up')}
                                     style={{ 
                                       background: 'none', 
                                       border: 'none', 
                                       color: msg.feedback === 'up' ? '#10b981' : 'var(--text-muted)', 
                                       cursor: 'pointer', 
                                       padding: '2px',
                                       transition: 'scale 0.2s'
                                     }}
                                     onMouseEnter={e => e.currentTarget.style.scale = '1.15'}
                                     onMouseLeave={e => e.currentTarget.style.scale = '1.0'}
                                   >
                                     <ThumbsUp size={13} />
                                   </button>
                                   <button 
                                     onClick={() => handleFeedback(i, 'down')}
                                     style={{ 
                                       background: 'none', 
                                       border: 'none', 
                                       color: msg.feedback === 'down' ? '#f43f5e' : 'var(--text-muted)', 
                                       cursor: 'pointer', 
                                       padding: '2px',
                                       transition: 'scale 0.2s'
                                     }}
                                     onMouseEnter={e => e.currentTarget.style.scale = '1.15'}
                                     onMouseLeave={e => e.currentTarget.style.scale = '1.0'}
                                   >
                                     <ThumbsDown size={13} />
                                   </button>
                                 </div>

                                 {/* Regenerate last answer check */}
                                 {i === aiHistory.length - 1 && (
                                   <button 
                                     onClick={handleRegenerate}
                                     style={{ 
                                       display: 'inline-flex', 
                                       alignItems: 'center', 
                                       gap: '4px', 
                                       background: 'none', 
                                       border: 'none', 
                                       color: 'var(--text-muted)', 
                                       cursor: 'pointer', 
                                       fontSize: '0.75rem', 
                                       fontWeight: 800,
                                       marginLeft: '4px'
                                     }}
                                   >
                                     <RotateCcw size={13} /> Retry
                                   </button>
                                 )}
                              </div>
                            )}
                         </div>
                       </div>
                    </motion.div>
                  );
                })}

                {/* Intelligent loading state */}
                {isProcessing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', display: 'flex', gap: '14px' }}>
                     <div style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: activeModel.bgColor, color: activeModel.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${activeModel.color}25` }}>
                        <Bot size={18} />
                     </div>
                     <div style={{ padding: '18px 22px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeModel.color }}></motion.div>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeModel.color }}></motion.div>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: activeModel.color }}></motion.div>
                     </div>
                  </motion.div>
                )}
                
             </div>

             {/* Quick recommendation chips (Visible only at new threads) */}
             {aiHistory.length < 2 && !isProcessing && (
               <div style={{ padding: '0 32px 16px', display: 'flex', gap: '12px', overflowX: 'auto', zIndex: 10 }} className="hide-scrollbar">
                  {['Student Attendance Analysis', 'Q2 Fee Collection Structure', 'Hostel Mess Capacities', 'Setting API Integrations'].map(action => (
                    <button 
                      key={action}
                      onClick={() => submitQuery(action)}
                      style={{ 
                        whiteSpace: 'nowrap', 
                        padding: '10px 20px', 
                        borderRadius: '24px', 
                        border: `1.5px solid ${activeModel.color}50`, 
                        backgroundColor: `${activeModel.color}08`, 
                        color: activeModel.color, 
                        fontSize: '0.82rem', 
                        fontWeight: 800, 
                        cursor: 'pointer', 
                        transition: '0.3s' 
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = `${activeModel.color}15`;
                        e.currentTarget.style.borderColor = activeModel.color;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = `${activeModel.color}08`;
                        e.currentTarget.style.borderColor = `${activeModel.color}50`;
                      }}
                    >
                      {action}
                    </button>
                  ))}
               </div>
             )}

             {/* Bottom Input Area */}
             <div style={{ padding: '24px 32px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', zIndex: 10 }}>
              
              {/* Premium Online & Smart Settings Bar */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Smart Mode Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setSmartMode(!smartMode);
                    showToast(
                      !smartMode ? 'Smart Mode enabled. Advanced deep reasoning core is active.' : 'Smart Mode disabled.',
                      'success',
                      'Smart Mode Toggled'
                    );
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    border: smartMode ? '1.5px solid #6366f1' : '1.5px solid var(--border-color)',
                    backgroundColor: smartMode ? '#6366f112' : 'var(--bg-body)',
                    color: smartMode ? '#6366f1' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: smartMode ? '0 0 15px #6366f115' : 'none'
                  }}
                >
                  <Brain size={14} style={{ filter: smartMode ? 'drop-shadow(0 0 4px #6366f1)' : 'none' }} />
                  Smart Mode {smartMode && '• Active'}
                </button>

                {/* Online Search Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchActive(!searchActive);
                    showToast(
                      !searchActive ? 'Online search enabled. Real-time web & DB indices are connected.' : 'Online search disabled.',
                      'info',
                      'Online Search Toggled'
                    );
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    border: searchActive ? '1.5px solid #10b981' : '1.5px solid var(--border-color)',
                    backgroundColor: searchActive ? '#10b98112' : 'var(--bg-body)',
                    color: searchActive ? '#10b981' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: searchActive ? '0 0 15px #10b98115' : 'none'
                  }}
                >
                  <Globe size={14} style={{ filter: searchActive ? 'drop-shadow(0 0 4px #10b981)' : 'none' }} />
                  Online Search {searchActive && '• Active'}
                </button>
              </div>

                <form onSubmit={handleQuery} style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                   
                   {/* File attachment paperclip */}
                   <button 
                     type="button"
                     onClick={() => inlineFileInputRef.current?.click()}
                     style={{ 
                       position: 'absolute', 
                       left: '16px', 
                       background: 'none', 
                       border: 'none', 
                       color: 'var(--text-muted)', 
                       cursor: 'pointer',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       padding: '8px',
                       borderRadius: '50%',
                       transition: '0.2s',
                       zIndex: 5
                     }}
                     onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                     onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                   >
                     <Paperclip size={18} />
                   </button>
                   
                   <input 
                     type="file" 
                     ref={inlineFileInputRef} 
                     onChange={handleInlineFileAttach} 
                     style={{ display: 'none' }} 
                     multiple 
                   />

                   {/* Main Query input field */}
                   <input 
                     type="text" 
                     placeholder={smartMode ? `Message EduPro AI [Smart Reasoning Active]...` : `Message EduPro AI (${activeModel.name})...`}
                     value={query} 
                     onChange={handleInputChange}
                     disabled={isProcessing || isStreaming}
                     style={{ 
                       width: '100%', 
                       padding: '18px 120px 18px 52px', 
                       borderRadius: '20px', 
                       border: '1px solid var(--border-color)', 
                       backgroundColor: 'var(--bg-body)',
                       color: 'var(--text-main)',
                       outline: 'none', 
                       fontWeight: 600, 
                       fontSize: '0.92rem', 
                       transition: 'all 0.3s ease',
                       boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                     }}
                     onFocus={e => {
                       e.currentTarget.style.borderColor = activeModel.color;
                       e.currentTarget.style.boxShadow = `0 0 0 4px ${activeModel.color}15`;
                     }}
                     onBlur={e => {
                       e.currentTarget.style.borderColor = 'var(--border-color)';
                       e.currentTarget.style.boxShadow = 'none';
                     }}
                   />

                   {/* Right Side absolute control pills (Speech, Search database, Send) */}
                   <div style={{ position: 'absolute', right: '10px', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 5 }}>
                      
                      {/* Microphone Voice dictation */}
                      <button 
                        type="button"
                        onClick={toggleVoiceInput}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: isListening ? '#f43f5e' : 'var(--text-muted)', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                          borderRadius: '50%',
                          backgroundColor: isListening ? '#f43f5e15' : 'transparent',
                          transition: '0.2s'
                        }}
                      >
                        {isListening ? (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                            <Mic size={18} />
                          </motion.div>
                        ) : (
                          <Mic size={18} />
                        )}
                      </button>

                      {/* Action trigger (Send / Stop Generating) */}
                      {isStreaming ? (
                        <button 
                          type="button"
                          onClick={handleStopGenerating}
                          style={{ 
                            width: '46px', 
                            height: '46px', 
                            borderRadius: '14px', 
                            border: 'none', 
                            backgroundColor: '#ef4444', 
                            color: 'white', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: 'pointer', 
                            transition: '0.3s' 
                          }}
                        >
                           <Square size={16} fill="white" />
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          disabled={!query.trim() || isProcessing}
                          style={{ 
                            width: '46px', 
                            height: '46px', 
                            borderRadius: '14px', 
                            border: 'none', 
                            backgroundColor: query.trim() ? activeModel.color : 'var(--bg-body)', 
                            color: query.trim() ? 'white' : 'var(--text-muted)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: query.trim() ? 'pointer' : 'default', 
                            transition: '0.3s' 
                          }}
                        >
                           <Send size={16} />
                        </button>
                      )}
                   </div>
                </form>
                
                {/* Secure & version taglines */}
                <div style={{ marginTop: '12px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                   <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={12} /> NEURAL ENGINE v4.5</span>
                   <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Lock size={12} /> END-TO-END SECURE</span>
                   {uploadedFiles.length > 0 && (
                     <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <BookOpen size={12} /> {uploadedFiles.length} file(s) loaded
                     </span>
                   )}
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Institutional Core Training Modal */}
      <AnimatePresence>
        {showTrainingModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => !isTraining && setShowTrainingModal(false)}
               style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)' }}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }} 
               exit={{ scale: 0.95, opacity: 0 }}
               style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '32px', padding: '40px', border: '1px solid var(--border-color)', boxShadow: '0 45px 100px rgba(0,0,0,0.3)' }}
             >
                {/* Close Button */}
                {!isTraining && (
                  <button 
                    onClick={() => setShowTrainingModal(false)}
                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}
                  >
                    <X size={20} />
                  </button>
                )}

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                   <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <Brain size={40} />
                   </div>
                   <h2 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>Neural Calibration</h2>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Feed institutional documents to train the EduPro AI core.</p>
                </div>

                {!isTraining ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleFileDrop}
                        style={{ padding: '32px 24px', borderRadius: '24px', border: '2px dashed var(--border-color)', textAlign: 'center', cursor: 'pointer', transition: '0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.backgroundColor = '#6366f108'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                         <input type="file" ref={fileInputRef} onChange={handleFileDrop} accept=".pdf,.docx,.csv,.doc,.xlsx" multiple style={{ display: 'none' }} />
                         <BookOpen size={28} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                         <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Drop Institutional Handbooks Here</div>
                         <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>PDF, DOCX, XLS or CSV supported</div>
                         {uploadedFiles.length > 0 && (
                           <div style={{ marginTop: '16px', fontSize: '0.78rem', fontWeight: 800, color: '#10b981', backgroundColor: '#10b98110', padding: '6px 12px', borderRadius: '20px', display: 'inline-block' }}>
                             {uploadedFiles.length} file(s) loaded & ready
                           </div>
                         )}
                      </div>
                     <button 
                       onClick={startTraining}
                       style={{ padding: '18px', backgroundColor: 'var(--text-main)', color: 'var(--bg-body)', borderRadius: '16px', border: 'none', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: '0.2s' }}
                       onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--text-muted)'}
                       onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--text-main)'}
                     >
                        Initialize Neural Training
                     </button>
                  </div>
                ) : (
                  <div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)' }}>INGESTING DATA...</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#6366f1' }}>{trainingProgress}%</span>
                     </div>
                     <div style={{ height: '12px', backgroundColor: 'var(--bg-body)', borderRadius: '6px', overflow: 'hidden', marginBottom: '24px' }}>
                        <motion.div 
                          animate={{ width: `${trainingProgress}%` }}
                          style={{ height: '100%', backgroundColor: '#6366f1', borderRadius: '6px' }}
                        />
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Clock size={16} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Optimizing Neural Weights...</span>
                     </div>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast Render */}
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default EduProAI;
