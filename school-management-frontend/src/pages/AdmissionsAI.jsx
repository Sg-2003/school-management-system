import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, TrendingUp, Target, 
  Map, Globe, MessageSquare, PieChart,
  ChevronRight, ArrowUpRight, Zap, Search, Filter, X, 
  CheckCircle2, AlertCircle, RefreshCw, Sparkles, MapPin, 
  DollarSign, LineChart, Send, FileText, Check, Database, Award, ShieldCheck, Printer
} from 'lucide-react';

const AdmissionsAI = () => {
  // 1. Dynamic Pool States (Local CRM Database)
  const [inquiriesPool, setInquiriesPool] = useState([
    { name: "Karan Verma", grade: "Grade 9", channel: "Organic Search", date: "May 24", message: "Interested in the high-school Science & Robotics AP program.", propensity: 76 },
    { name: "Ananya Sen", grade: "Grade 11", channel: "Meta Ads", date: "May 23", message: "Inquiry about Advanced Biology and campus lab availability.", propensity: 68 },
    { name: "Aman Das", grade: "Grade 10", channel: "Referral Link", date: "May 23", message: "Transfer requirements for high school basketball team coaching.", propensity: 84 },
    { name: "Riya Banerjee", grade: "Grade 12", channel: "Google Search", date: "May 22", message: "Looking for scholarship quotas for classical music majors.", propensity: 59 }
  ]);

  const [applicationsPool, setApplicationsPool] = useState([
    { name: "Sneha Patel", grade: "Grade 10", major: "Pre-Engineering", date: "May 22" },
    { name: "Rahul Kapoor", grade: "Grade 9", major: "General Studies", date: "May 21" },
    { name: "Aditi Nair", grade: "Grade 12", major: "English Honors", date: "May 20" },
    { name: "Arjun Reddy", grade: "Grade 11", major: "World History AP", date: "May 19" }
  ]);

  const [interviewsPool, setInterviewsPool] = useState([
    { name: "Karan Mehta", grade: "Grade 11", time: "May 26, 10:00 AM", format: "In-Person Panel", interviewer: "Dr. Sunita Rao" },
    { name: "Ananya Rao", grade: "Grade 12", time: "May 27, 2:00 PM", format: "Virtual Tele-Link", interviewer: "Prof. Amit Bose" },
    { name: "Aman Joshi", grade: "Grade 10", time: "May 28, 11:30 AM", format: "In-Person Panel", interviewer: "Dr. Sunita Sharma" }
  ]);

  const [admittedPool, setAdmittedPool] = useState([
    { name: "Ishaanvi Bose", grade: "Grade 9", scholarship: "Full Merit", portalAccess: "Registered", date: "May 18", hash: "0x8fa2e412bc902" },
    { name: "Atharv Singh", grade: "Grade 10", scholarship: "None", portalAccess: "Pending Fee", date: "May 17", hash: null },
    { name: "Aadya Sharma", grade: "Grade 11", scholarship: "Sports Waiver", portalAccess: "Registered", date: "May 15", hash: "0x3e17b840fb01e" }
  ]);

  // Base Offsets to reflect realistic aggregate counts
  const [baseInquiriesCount, setBaseInquiriesCount] = useState(1236);
  const [baseApplicationsCount, setBaseApplicationsCount] = useState(846);
  const [baseInterviewsCount, setBaseInterviewsCount] = useState(417);
  const [baseAdmissionsCount, setBaseAdmissionsCount] = useState(182);

  // Derived Counts
  const inquiriesCount = baseInquiriesCount + inquiriesPool.length;
  const applicationsCount = baseApplicationsCount + applicationsPool.length;
  const interviewsCount = baseInterviewsCount + interviewsPool.length;
  const admissionsCount = baseAdmissionsCount + admittedPool.length;

  // 2. Metrics & Config States
  const [leadConversionIndex, setLeadConversionIndex] = useState(74);
  const [responseLatency, setResponseLatency] = useState(8.2);
  const [costPerAcquisition, setCostPerAcquisition] = useState(1240);
  const [responsePolicy, setResponsePolicy] = useState("Priority"); // "Instantaneous" | "Priority" | "Standard" | "Manual"
  const [isOptimizingDiagnostics, setIsOptimizingDiagnostics] = useState(false);

  // 3. Interactive Modals State
  const [activeModal, setActiveModal] = useState(null); 
  // 'campaign' | 'audit' | 'funnel_step' | 'geo_details' | 'new_prospect' | 'latency_calibration' | 'conversion_diagnostics' | 'sms_outreach' | 'registry_sync' | 'welcome_packet' | null
  const [selectedStep, setSelectedStep] = useState(null); // 0: Inquiries, 1: Apps, 2: Interviews, 3: Admissions
  const [selectedGeo, setSelectedGeo] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 4. Interactive Geographic Leads
  const [geoZones, setGeoZones] = useState([
    { zone: 'Urban Core', leads: 450, trend: '+8%', campaignStatus: 'Ready' },
    { zone: 'Suburban North', leads: 320, trend: '+14%', campaignStatus: 'Ready' },
    { zone: 'Coastal District', leads: 120, trend: '-2%', campaignStatus: 'Ready' }
  ]);

  // 5. Campaign Spends Slider Simulator
  const [adWordsSpend, setAdWordsSpend] = useState(4500); 
  const [socialSpend, setSocialSpend] = useState(3500); 

  // 6. Lead Audit Telemetry Loop
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  // 7. Cryptographic Ledger Registry Sync
  const [isSealingRegistry, setIsSealingRegistry] = useState(false);
  const [registrySealStep, setRegistrySealStep] = useState(0);

  // 8. SMS Chat Support Simulation
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [chatStepIndex, setChatStepIndex] = useState(0);
  const chatBottomRef = useRef(null);

  // 9. New Prospect Registration Form
  const [newProspectName, setNewProspectName] = useState('');
  const [newProspectGrade, setNewProspectGrade] = useState('Grade 9');
  const [newProspectChannel, setNewProspectChannel] = useState('Organic Search');
  const [newProspectMessage, setNewProspectMessage] = useState('');

  // 10. Interview Scheduler Form
  const [scheduleInterviewer, setScheduleInterviewer] = useState('Dr. Sunita Rao');
  const [scheduleTime, setScheduleTime] = useState('May 30, 10:00 AM');
  const [scheduleFormat, setScheduleFormat] = useState('In-Person Panel');

  // 11. Admission Approval Form
  const [admitScholarship, setAdmitScholarship] = useState('None');

  // 12. Toast Feedback
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Autoscroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatTyping]);

  // Audit Script logs
  const AUDIT_STEPS = [
    "Establishing connection with multi-channel CRM registries...",
    "Telemetry scanning of 1,240 active student leads...",
    "Running NLP classification on parental inquiries...",
    "Correlating geographic density against local school zones...",
    "Identifying stale records and duplication coefficients...",
    "Applying conversion propensity neural model...",
    "Syncing audit credentials with Alexandria Registry...",
    "Lead database optimization complete!"
  ];

  // Registry Seal Script logs
  const REGISTRY_SEAL_LOGS = [
    "Initiating Alexandria Distributed Academic Ledger handshake...",
    "Compiling student academic portfolio coefficients...",
    "Signing enrollment block with Dean credentials key...",
    "Broadcasting ledger block to global network validators...",
    "Generating cryptographic SHA-256 registry address...",
    "Registry database synchronization successfully sealed!"
  ];

  // Chat Dialogues Database
  const CHAT_DIALOGUES = {
    "Karan Verma": [
      { sender: "parent", text: "Hello! Karan is interested in the Grade 9 Robotics program. What facilities do you host?" },
      { sender: "ai", text: "Hello! We offer a state-of-the-art Makerspace equipped with double-extrusion 3D printers, precision CNC routers, and a VEX Robotics competition arena. Our robotics team finished 3rd nationally last year!" },
      { sender: "parent", text: "That is amazing. Are there any prior coding portfolio requirements?" },
      { sender: "ai", text: "For Grade 9, no portfolios are strictly mandatory. However, listing Karan's science activities will prioritize his file. Would you like me to schedule a direct campus lab tour?" },
      { sender: "parent", text: "Yes, please! That would be fantastic. Next Tuesday morning works best for us." },
      { sender: "ai", text: "Perfect! I've booked your lab tour for Tuesday at 10:00 AM under Dr. Sunita Rao. I've also pushed a registration form link directly to your portal. We are ready to proceed!" }
    ],
    "Ananya Sen": [
      { sender: "parent", text: "Hello, does the Grade 11 pathway support students looking at pre-medical programs?" },
      { sender: "ai", text: "Greetings! Yes, our pre-med honors track features AP Biology, AP Chemistry, and a unique partnership with the Coastal Health Center for weekend clinical internships." },
      { sender: "parent", text: "Partnered internships? That is wonderful. How do we apply?" },
      { sender: "ai", text: "Ananya can register for the internship credits once enrolled, provided she maintains a 3.5 GPA. Let's advance her inquiry to the official application so we can map out her advisory schedule." },
      { sender: "parent", text: "Perfect. Please push the transcript portal details so I can submit her high school file." },
      { sender: "ai", text: "Absolutely! Pushing Ananya's AP registration and transcript submission panel link. We are ready to move to Applications!" }
    ],
    "Aman Das": [
      { sender: "parent", text: "Hello! We are looking at varsity athletic facilities. Aman plays competitive basketball." },
      { sender: "ai", text: "Welcome! Our basketball team trains in our new triple-court sports arena with professional maple flooring and AI performance mapping. We actually sponsor outstanding talent." },
      { sender: "parent", text: "Do you offer tuition waivers or athletic scholarships?" },
      { sender: "ai", text: "Yes, up to 40% tuition waivers for athletic excellence! I can register Aman's profile today so Coach Rajesh Yadav can review his match tapes." },
      { sender: "parent", text: "Wonderful. Let's schedule the video reel submission and complete the application." },
      { sender: "ai", text: "Superb! Pushing Aman's athletic registration link and scheduling Coach Rajesh Yadav's review. You are ready to submit the application!" }
    ],
    "Riya Banerjee": [
      { sender: "parent", text: "Hello, are there scholarship options for classical music majors in Grade 12?" },
      { sender: "ai", text: "Greetings! Yes, our Fine Arts department sponsors classical piano and violin cohorts, providing up to 50% merit-based awards based on audition portfolios." },
      { sender: "parent", text: "Splendid. We have a digital studio recording ready. Who evaluates it?" },
      { sender: "ai", text: "Our Conservatory Panel, led by Prof. Amit Bose, handles all reviews. I'll link Riya's audition portal directly to your application now so she can upload her studio files." },
      { sender: "parent", text: "Excellent! Let's submit her profile and get this rolling." },
      { sender: "ai", text: "Fabulous! Pushed the conservatory audition link and advanced Riya's file. Let's transition her to an active Application stage!" }
    ]
  };

  // Lead Audit Loop Effect
  useEffect(() => {
    if (!isAuditing) return;
    const interval = setInterval(() => {
      setAuditStep(prev => {
        if (prev < AUDIT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            // Apply Slight optimizations post-audit
            setBaseInquiriesCount(prev => prev + 50);
            setLeadConversionIndex(78);
            setResponseLatency(7.6);
            setIsAuditing(false);
            setActiveModal(null);
            triggerToast("Autonomous lead database audit successfully completed!", "success");
          }, 600);
          return prev;
        }
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isAuditing]);

  // Registry Seal Loop Effect
  useEffect(() => {
    if (!isSealingRegistry || !selectedStudent) return;
    const interval = setInterval(() => {
      setRegistrySealStep(prev => {
        if (prev < REGISTRY_SEAL_LOGS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            const randomHash = "0x" + Math.random().toString(16).substring(2, 15);
            setAdmittedPool(prev => prev.map(s => {
              if (s.name === selectedStudent.name) {
                return { ...s, portalAccess: "Registered", hash: randomHash };
              }
              return s;
            }));
            setLeadConversionIndex(prev => Math.min(99, prev + 1));
            setIsSealingRegistry(false);
            setRegistrySealStep(0);
            triggerToast(`Academic ledger sealed for ${selectedStudent.name}! Hash: ${randomHash.substring(0, 10)}...`, "success");
          }, 600);
          return prev;
        }
      });
    }, 450);
    return () => clearInterval(interval);
  }, [isSealingRegistry, selectedStudent]);

  // SMS Chat Live Simulation Trigger Effect
  useEffect(() => {
    if (activeModal !== 'sms_outreach' || !selectedStudent) return;
    
    const dialogue = CHAT_DIALOGUES[selectedStudent.name] || [
      { sender: "parent", text: "Hello! We would like to inquire about admissions." },
      { sender: "ai", text: "Hello! Welcome to Alexandria Academy support. What grade level or sports pathway are you looking at?" },
      { sender: "parent", text: "Grade 10 General Studies." },
      { sender: "ai", text: "Excellent. I've sent the application details to your mail. Ready to proceed!" }
    ];

    setChatMessages([]);
    setChatStepIndex(0);
    setIsChatTyping(true);

    let timerId;

    const streamChat = (idx) => {
      if (idx >= dialogue.length) {
        setIsChatTyping(false);
        // Boost lead propensity on complete chat simulation
        setInquiriesPool(prev => prev.map(s => {
          if (s.name === selectedStudent.name) {
            return { ...s, propensity: 98 };
          }
          return s;
        }));
        setLeadConversionIndex(prev => Math.min(99, prev + 2));
        return;
      }

      setIsChatTyping(true);
      timerId = setTimeout(() => {
        setChatMessages(prev => [...prev, dialogue[idx]]);
        setIsChatTyping(false);

        if (idx + 1 < dialogue.length) {
          timerId = setTimeout(() => {
            streamChat(idx + 1);
          }, 1100);
        } else {
          streamChat(idx + 1);
        }
      }, 1400); // simulate realistic typing speeds
    };

    timerId = setTimeout(() => {
      streamChat(0);
    }, 400);

    return () => clearTimeout(timerId);
  }, [activeModal, selectedStudent]);

  // Dispatch micro-marketing campaign
  const runLocalCampaign = (zoneName) => {
    setGeoZones(prev => prev.map(z => {
      if (z.zone === zoneName) {
        return {
          ...z,
          leads: z.leads + 35,
          trend: '+18%',
          campaignStatus: 'Active'
        };
      }
      return z;
    }));
    setBaseInquiriesCount(prev => prev + 35);
    triggerToast(`AI Micro-Marketing Campaign dispatched to ${zoneName}! +35 leads registered.`, "success");
    setActiveModal(null);
  };

  // Add a new inquiry prospect
  const handleAddProspect = (e) => {
    e.preventDefault();
    if (!newProspectName.trim()) {
      triggerToast("Please input a valid candidate name.", "error");
      return;
    }
    const newLead = {
      name: newProspectName,
      grade: newProspectGrade,
      channel: newProspectChannel,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      message: newProspectMessage || "Requested curriculum catalog.",
      propensity: Math.floor(Math.random() * 25) + 60 // 60-85% initial propensity
    };

    setInquiriesPool(prev => [newLead, ...prev]);
    triggerToast(`New Prospect ${newProspectName} successfully added to Inquiries!`, "success");
    
    // reset form
    setNewProspectName('');
    setNewProspectMessage('');
    setActiveModal(null);
  };

  // Funnel Operations: Progress inquiry to application
  const promoteInquiryToApplication = (student) => {
    setInquiriesPool(prev => prev.filter(s => s.name !== student.name));
    setApplicationsPool(prev => [
      {
        name: student.name,
        grade: student.grade,
        major: student.grade === "Grade 11" || student.grade === "Grade 12" ? "Pre-Engineering" : "General Studies",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      },
      ...prev
    ]);
    triggerToast(`${student.name} promoted to Applications Pool!`, "success");
    setSelectedStudent(null);
    setActiveModal(null);
  };

  // Funnel Operations: Progress application to scheduled interview
  const promoteApplicationToInterview = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setApplicationsPool(prev => prev.filter(s => s.name !== selectedStudent.name));
    setInterviewsPool(prev => [
      {
        name: selectedStudent.name,
        grade: selectedStudent.grade,
        time: scheduleTime,
        format: scheduleFormat,
        interviewer: scheduleInterviewer
      },
      ...prev
    ]);

    triggerToast(`Interview scheduled for ${selectedStudent.name}!`, "success");
    setSelectedStudent(null);
    setActiveModal(null);
  };

  // Funnel Operations: Progress interview to admitted
  const promoteInterviewToAdmitted = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setInterviewsPool(prev => prev.filter(s => s.name !== selectedStudent.name));
    setAdmittedPool(prev => [
      {
        name: selectedStudent.name,
        grade: selectedStudent.grade,
        scholarship: admitScholarship,
        portalAccess: "Pending Fee",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hash: null
      },
      ...prev
    ]);

    triggerToast(`${selectedStudent.name} admitted successfully!`, "success");
    setSelectedStudent(null);
    setActiveModal(null);
  };

  // Auto-responder calibration submission
  const handleCalibrateLatency = (policy) => {
    setResponsePolicy(policy);
    let latency = 8.2;
    let indexOffset = 0;
    let cpaOffset = 0;

    if (policy === "Instantaneous") {
      latency = 0.2;
      indexOffset = 10;
      cpaOffset = -90;
    } else if (policy === "Priority") {
      latency = 4.8;
      indexOffset = 4;
      cpaOffset = -40;
    } else if (policy === "Standard") {
      latency = 14.5;
      indexOffset = -4;
      cpaOffset = 30;
    } else if (policy === "Manual") {
      latency = 120.0;
      indexOffset = -22;
      cpaOffset = 180;
    }

    setResponseLatency(latency);
    setLeadConversionIndex(prev => Math.min(98, Math.max(40, 74 + indexOffset)));
    setCostPerAcquisition(prev => Math.max(900, 1240 + cpaOffset));
    triggerToast(`AI Auto-Responder set to ${policy} Policy!`, "success");
    setActiveModal(null);
  };

  // Optimize conversion channels
  const handleOptimizeChannels = () => {
    setIsOptimizingDiagnostics(true);
    setTimeout(() => {
      setInquiriesPool(prev => prev.map(s => ({
        ...s,
        propensity: Math.min(99, s.propensity + 12)
      })));
      setLeadConversionIndex(prev => Math.min(99, prev + 5));
      setCostPerAcquisition(prev => Math.max(900, prev - 60));
      setIsOptimizingDiagnostics(false);
      triggerToast("Channels successfully optimized! Conversion propensity boosted by +12%.", "success");
      setActiveModal(null);
    }, 1800);
  };

  // Recalculate CPA based on sliders
  const totalMarketingBudget = adWordsSpend + socialSpend;
  const currentCPA = Math.round((totalMarketingBudget / (inquiriesCount + 100)) * 135);

  const handleBudgetOptimization = () => {
    // Snap budget to sweet spot allocation
    setAdWordsSpend(5500);
    setSocialSpend(4500);
    setCostPerAcquisition(980);
    triggerToast("AI Budget Engine balanced spending! Allocated $5.5k Google / $4.5k Social. CPA Optimized.", "success");
  };

  // Funnel Detailed lists mapping
  const funnelPools = [
    {
      title: "Active Inquiries Pool",
      sourceSplit: { Organic: "48%", Social: "32%", Referral: "20%" },
      leads: inquiriesPool
    },
    {
      title: "Completed Applications Pool",
      sourceSplit: { Science: "45%", Arts: "35%", Commerce: "20%" },
      leads: applicationsPool
    },
    {
      title: "Scheduled Interviews Pool",
      sourceSplit: { Academic: "60%", Sports: "25%", Music: "15%" },
      leads: interviewsPool
    },
    {
      title: "Admitted Students Pool",
      sourceSplit: { Regular: "70%", Scholarship: "30%" },
      leads: admittedPool
    }
  ];

  const funnelSteps = [
    { label: 'Total Inquiries', count: inquiriesCount.toLocaleString(), conversion: '+12%', color: '#6366f1' },
    { label: 'Applications', count: applicationsCount.toLocaleString(), conversion: `${Math.round((applicationsCount/inquiriesCount)*100)}%`, color: '#8b5cf6' },
    { label: 'Interviews', count: interviewsCount.toLocaleString(), conversion: `${Math.round((interviewsCount/applicationsCount)*100)}%`, color: '#a855f7' },
    { label: 'Admissions', count: admissionsCount.toLocaleString(), conversion: `${Math.round((admissionsCount/interviewsCount)*100)}%`, color: '#10b981' }
  ];

  return (
    <div style={{ fontFamily: "'Outfit', 'Inter', sans-serif", position: 'relative', minHeight: '80vh' }}>
      
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
              zIndex: 99999, 
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
              backgroundColor: toast.type === 'success' ? '#10b98125' : '#ef444425',
              color: toast.type === 'success' ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{toast.type === 'success' ? 'Telemetry Success' : 'Admissions Error'}</div>
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
             <UserPlus size={16} /> ADMISSIONS PREDICTIVE ENGINE
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Enrollment <span style={{ color: '#6366f1' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '24px' }}>
            Predictive modeling for enrollment funnels and lead conversion optimization.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             <button 
              onClick={() => setActiveModal('campaign')}
              style={{ 
                padding: '16px 28px', 
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
              <LineChart size={18} color="var(--text-muted)" /> Campaign Analytics
            </button>
            <button 
              onClick={() => setActiveModal('new_prospect')}
              style={{ 
                padding: '16px 28px', 
                borderRadius: '18px', 
                border: '1px solid var(--border-color)', 
                backgroundColor: 'var(--bg-card)', 
                color: '#6366f1', 
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
              <UserPlus size={18} /> Quick Add Inquiry
            </button>
             <button 
              onClick={() => {
                setIsAuditing(true);
                setAuditStep(0);
                setActiveModal('audit');
              }}
              style={{ 
                padding: '16px 28px', 
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
               <Zap size={18} color="#f59e0b" /> Run Lead Audit
            </button>
          </div>
        </div>
      </div>

      {/* Main Column Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '32px' }}>
        
        {/* Left Side: Enrollment Funnel */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', gridColumn: 'span 2' }}>
           <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '4px' }}>Conversion Funnel Matrix</h3>
           <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '32px' }}>Click any funnel step to inspect corresponding student pools and advance candidates.</p>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {funnelSteps.map((step, i) => (
                <motion.div 
                  key={i} 
                  onClick={() => {
                    setSelectedStep(i);
                    setActiveModal('funnel_step');
                  }}
                  whileHover={{ scale: 1.01 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }}
                >
                   <div style={{ width: '120px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-sidebar)' }}>{step.label}</div>
                   <div style={{ flex: 1, height: '48px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - (i * 20)}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        style={{ height: '100%', backgroundColor: step.color, opacity: 0.8, borderRadius: '12px' }} 
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between' }}>
                         <span style={{ fontWeight: 900, color: i === 3 ? 'white' : 'var(--text-main)' }}>{step.count}</span>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: i === 3 ? 'white' : 'var(--text-muted)' }}>{step.conversion}</span>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
           
           <div style={{ marginTop: '32px', padding: '24px', borderRadius: '24px', backgroundColor: '#10b98108', border: '1px solid #10b98120', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <TrendingUp size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-sidebar)', margin: 0, lineHeight: 1.5 }}>
                AI predicts a <strong>15% surge</strong> in inquiries for next month based on current organic traffic trends and seasonal patterns.
              </p>
           </div>
        </div>

        {/* Right Side: Predictive Geo-Mapping */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '32px', padding: '40px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
              <Globe size={400} style={{ position: 'absolute', right: '-100px', bottom: '-100px' }} />
           </div>
           
           <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '8px' }}>Geographic Lead Pulse</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '32px' }}>Real-time distribution of potential student inquiries.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                 {geoZones.map((item, i) => (
                   <motion.div 
                     key={i} 
                     onClick={() => {
                       setSelectedGeo(item);
                       setActiveModal('geo_details');
                     }}
                     whileHover={{ scale: 1.02, backgroundColor: '#1e293b' }}
                     style={{ 
                       display: 'flex', 
                       justifyContent: 'space-between', 
                       alignItems: 'center', 
                       padding: '16px 20px', 
                       backgroundColor: '#131e31', 
                       borderRadius: '24px', 
                       border: '1px solid #1e293b',
                       cursor: 'pointer',
                       transition: 'background-color 0.15s'
                     }}
                   >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.campaignStatus === 'Active' ? '#10b981' : '#6366f1' }} />
                           {item.zone}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px', fontWeight: 700 }}>Click to review campaigns</div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                         <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>{item.leads}</span>
                         <span style={{ fontSize: '0.75rem', fontWeight: 800, color: item.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>{item.trend}</span>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Bottom 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '40px' }}>
         <motion.div 
           whileHover={{ y: -5 }}
           onClick={() => setActiveModal('conversion_diagnostics')}
           style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
         >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                 <Target size={22} />
              </div>
              <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: '#10b98115', color: '#10b981', fontWeight: 800 }}>DIAGNOSTICS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{leadConversionIndex}%</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>LEAD CONVERSION INDEX</div>
         </motion.div>

         <motion.div 
           whileHover={{ y: -5 }}
           onClick={() => setActiveModal('latency_calibration')}
           style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
         >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                 <MessageSquare size={22} />
              </div>
              <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: '#6366f115', color: '#6366f1', fontWeight: 800 }}>{responsePolicy}</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{responseLatency}m</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>AVG. RESPONSE LATENCY</div>
         </motion.div>

         <motion.div 
           whileHover={{ y: -5 }}
           onClick={() => setActiveModal('campaign')}
           style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }}
         >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                 <PieChart size={22} />
              </div>
              <span style={{ fontSize: '0.65rem', padding: '4px 8px', borderRadius: '12px', backgroundColor: '#f59e0b15', color: '#f59e0b', fontWeight: 800 }}>SIMULATOR</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>${costPerAcquisition.toLocaleString()}</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>COST PER ACQUISITION (CPA)</div>
         </motion.div>
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
                if (!isAuditing && !isSealingRegistry) {
                  setActiveModal(null);
                  setSelectedStudent(null);
                }
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

            {/* Lead Telemetry Diagnostics Loader */}
            {activeModal === 'audit' && (
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
                  boxShadow: 'var(--shadow-xl)',
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
                    <UserPlus size={32} />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Auditing Lead Database</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Analyzing organic telemetry pipelines</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((auditStep + 1) / AUDIT_STEPS.length) * 100}%` }}
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
                  height: '130px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b'
                }}>
                  {AUDIT_STEPS.slice(0, auditStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === auditStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Campaign Analytics & CPA Sandbox Simulator */}
            {activeModal === 'campaign' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '520px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LineChart size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Multi-Channel CPA Simulator
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    <strong>Acquisition Cost Sandbox:</strong> Move spending sliders below to simulate Google and Meta ad spending distributions. High spending increases total inquiries, driving down the overall Cost Per Acquisition (CPA) organically.
                  </p>

                  {/* AdWords Spend Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      <span>Google AdWords Budget</span>
                      <span style={{ color: '#6366f1' }}>${adWordsSpend.toLocaleString()}/mo</span>
                    </div>
                    <input 
                      type="range"
                      min="1000"
                      max="10000"
                      step="500"
                      value={adWordsSpend}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setAdWordsSpend(val);
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Social Spend Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      <span>Meta & Social Campaigns</span>
                      <span style={{ color: '#8b5cf6' }}>${socialSpend.toLocaleString()}/mo</span>
                    </div>
                    <input 
                      type="range"
                      min="1000"
                      max="8000"
                      step="500"
                      value={socialSpend}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setSocialSpend(val);
                      }}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Cost Calculation Readout */}
                  <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>TOTAL BUDGET</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                        ${totalMarketingBudget.toLocaleString()}/mo
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>SIMULATED CPA</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                        ${currentCPA.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleBudgetOptimization}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Sparkles size={14} /> AI Optimize Spend
                  </button>
                  <button 
                    onClick={() => {
                      setCostPerAcquisition(currentCPA);
                      triggerToast(`Simulated acquisition configuration of $${totalMarketingBudget.toLocaleString()} deployed!`, "success");
                      setActiveModal(null);
                    }}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Deploy Marketing Setup
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Add Inquiry Form */}
            {activeModal === 'new_prospect' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      Quick Add Inquiry Prospect
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleAddProspect} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      CANDIDATE STUDENT NAME
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Katherine Vance"
                      value={newProspectName}
                      onChange={e => setNewProspectName(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                        TARGET GRADE
                      </label>
                      <select 
                        value={newProspectGrade}
                        onChange={e => setNewProspectGrade(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      >
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                        OUTREACH CHANNEL
                      </label>
                      <select 
                        value={newProspectChannel}
                        onChange={e => setNewProspectChannel(e.target.value)}
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none' }}
                      >
                        <option value="Organic Search">Organic Search</option>
                        <option value="Meta Ads">Meta Ads</option>
                        <option value="Referral Link">Referral Link</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Walk-in">Walk-in / Physical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '8px' }}>
                      PARENT / PROSPECT NOTE
                    </label>
                    <textarea 
                      placeholder="Enter specific academic focus or questions..."
                      value={newProspectMessage}
                      onChange={e => setNewProspectMessage(e.target.value)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', height: '100px', resize: 'none' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}
                  >
                    Register Inquiry Prospect
                  </button>
                </form>
              </motion.div>
            )}

            {/* Clickable Conversion Funnel step Details Pool */}
            {activeModal === 'funnel_step' && selectedStep !== null && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '580px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {funnelPools[selectedStep].title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedStudent(null);
                    }}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                  
                  {/* Source breakdown chart splits */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>TELEMETRY POOL DISTRIBUTION</div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--border-color)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                      <div style={{ width: '50%', backgroundColor: '#6366f1', height: '100%' }}></div>
                      <div style={{ width: '30%', backgroundColor: '#10b981', height: '100%' }}></div>
                      <div style={{ width: '20%', backgroundColor: '#f59e0b', height: '100%' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {Object.entries(funnelPools[selectedStep].sourceSplit).map(([key, val]) => (
                        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: key === 'Organic' || key === 'Science' || key === 'Academic' ? '#6366f1' : key === 'Social' || key === 'Arts' || key === 'Sports' ? '#10b981' : '#f59e0b' }} />
                          {key}: <strong>{val}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* List of active candidates */}
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '12px' }}>
                      CANDIDATE PROFILES IN POOL ({funnelPools[selectedStep].leads.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                      {funnelPools[selectedStep].leads.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          No active candidates in this step.
                        </div>
                      ) : (
                        funnelPools[selectedStep].leads.map((lead, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedStudent(selectedStudent?.name === lead.name ? null : lead)}
                            style={{ 
                              padding: '14px 18px', 
                              borderRadius: '16px', 
                              backgroundColor: selectedStudent?.name === lead.name ? 'var(--bg-body)' : 'var(--bg-card)', 
                              border: selectedStudent?.name === lead.name ? '2px solid #6366f1' : '1px solid var(--border-color)', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {lead.name}
                                {lead.propensity && (
                                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '8px', backgroundColor: lead.propensity >= 75 ? '#10b98115' : '#f59e0b15', color: lead.propensity >= 75 ? '#10b981' : '#f59e0b', fontWeight: 800 }}>
                                    {lead.propensity}% propensity
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                {lead.grade} • {lead.channel || lead.major || lead.format || 'Admissions Sync'}
                              </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {lead.date || lead.time || (lead.hash ? "Sealed Ledger" : "Registry Pending")} 
                              <ChevronRight size={14} style={{ transform: selectedStudent?.name === lead.name ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Selected student detail expansion */}
                  {selectedStudent && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ 
                        padding: '24px', 
                        borderRadius: '24px', 
                        backgroundColor: 'var(--bg-body)', 
                        border: '1px solid var(--border-color)',
                        marginTop: '8px'
                      }}
                    >
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={16} color="#6366f1" /> Operational Lead File: {selectedStudent.name}
                      </h4>
                      
                      {selectedStep === 0 && (
                        <div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                            <strong>Inquiry Detail:</strong> "{selectedStudent.message}"
                          </p>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                              onClick={() => setActiveModal('sms_outreach')}
                              style={{ flex: 1.2, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: '#6366f1', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <MessageSquare size={14} /> AI Outreach SMS
                            </button>
                            <button 
                              onClick={() => promoteInquiryToApplication(selectedStudent)}
                              style={{ flex: 1.5, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              Process Application <Sparkles size={14} />
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedStep === 1 && (
                        <form onSubmit={promoteApplicationToInterview}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Schedule admissions advisory panel and review matching transcripts.
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '6px' }}>INTERVIEWER</label>
                              <select 
                                value={scheduleInterviewer}
                                onChange={e => setScheduleInterviewer(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.75rem' }}
                              >
                                <option value="Dr. Sunita Rao">Dr. Sunita Rao</option>
                                <option value="Prof. Amit Bose">Prof. Amit Bose</option>
                                <option value="Dr. Sunita Sharma">Dr. Sunita Sharma</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '6px' }}>FORMAT</label>
                              <select 
                                value={scheduleFormat}
                                onChange={e => setScheduleFormat(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.75rem' }}
                              >
                                <option value="In-Person Panel">In-Person Panel</option>
                                <option value="Virtual Tele-Link">Virtual Tele-Link</option>
                                <option value="One-on-One Chat">One-on-One Chat</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '6px' }}>DATE & TIME</label>
                              <input 
                                type="text"
                                value={scheduleTime}
                                onChange={e => setScheduleTime(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.75rem' }}
                              />
                            </div>
                            <button 
                              type="submit"
                              style={{ padding: '11px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Schedule Interview
                            </button>
                          </div>
                        </form>
                      )}

                      {selectedStep === 2 && (
                        <form onSubmit={promoteInterviewToAdmitted}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Evaluate counselor session score card and declare formal admittance.
                          </p>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '6px' }}>SCHOLARSHIP / WAIVER ALLOCATION</label>
                              <select 
                                value={admitScholarship}
                                onChange={e => setAdmitScholarship(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none', fontSize: '0.75rem' }}
                              >
                                <option value="None">None (Standard Tuition)</option>
                                <option value="20% Academic Merit">20% Academic Merit</option>
                                <option value="50% Fine Arts Waiver">50% Fine Arts Waiver</option>
                                <option value="Full Merit Scholarship">Full Merit Scholarship</option>
                                <option value="Sports Waiver">Sports Waiver (Athletic Grant)</option>
                              </select>
                            </div>
                            <button 
                              type="submit"
                              style={{ padding: '11px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Approve Admittance
                            </button>
                          </div>
                        </form>
                      )}

                      {selectedStep === 3 && (
                        <div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Review scholarship: <strong>{selectedStudent.scholarship}</strong> • Status: <strong>{selectedStudent.portalAccess}</strong>
                          </p>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            {!selectedStudent.hash ? (
                              <button 
                                onClick={() => {
                                  setIsSealingRegistry(true);
                                  setRegistrySealStep(0);
                                  setActiveModal('registry_sync');
                                }}
                                style={{ flex: 1.5, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyText: 'center', justifyContent: 'center', gap: '6px' }}
                              >
                                <Database size={14} /> Seal Alexandria Registry
                              </button>
                            ) : (
                              <div style={{ flex: 1.5, padding: '12px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: '#10b98108', color: '#10b981', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <ShieldCheck size={14} /> Ledger Sealed Successfully
                              </div>
                            )}
                            <button 
                              onClick={() => setActiveModal('welcome_packet')}
                              style={{ flex: 1.2, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <FileText size={14} /> View Welcome Letter
                            </button>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      setSelectedStudent(null);
                    }}
                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close Pool Drawer
                  </button>
                </div>
              </motion.div>
            )}

            {/* Geographic Zone detail diagnostics */}
            {activeModal === 'geo_details' && selectedGeo && (
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
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {selectedGeo.zone} Campaign Diagnostics
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  
                  {/* Status Box */}
                  <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>POTENTIAL LEADS</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
                        {selectedGeo.leads}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>GROWTH VELOCITY</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 950, color: selectedGeo.trend.startsWith('+') ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                        {selectedGeo.trend}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Admissions telemetry identifies elevated inquiry interest ratios in the Suburban North region. Deploying targeted AI micro-marketing ads is recommended to lock in local candidates.
                  </p>

                  <div style={{ padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-sidebar)' }}>
                      Local ad delivery schedules calibrated
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                  {selectedGeo.campaignStatus !== 'Active' ? (
                    <button 
                      onClick={() => runLocalCampaign(selectedGeo.zone)}
                      style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <Sparkles size={14} /> Dispatch Local Campaign
                    </button>
                  ) : (
                    <button 
                      disabled
                      style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#10b98120', color: '#10b981', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <CheckCircle2 size={14} /> Campaign Active
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* AI Auto-Responder Latency Calibration */}
            {activeModal === 'latency_calibration' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '500px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={20} color="#10b981" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      AI Responder Calibration
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Select an autonomous AI outreach response policy. Faster response latencies yield a significantly higher Lead Conversion index, though requiring higher vector processing token allocations.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { key: 'Instantaneous', label: 'Instantaneous (AI Chat Agent)', desc: '0.2 min response delay. Conversion Index +10%', color: '#10b981' },
                      { key: 'Priority', label: 'Priority Queue (AI & Counselor)', desc: '4.8 min response delay. Conversion Index +4%', color: '#6366f1' },
                      { key: 'Standard', label: 'Standard Batch (Hourly processing)', desc: '14.5 min response delay. Baseline CPA.', color: '#f59e0b' },
                      { key: 'Manual', label: 'Manual Review (Human operator)', desc: '120 min response delay. Conversion Index -22%', color: '#ef4444' }
                    ].map(policyItem => (
                      <div 
                        key={policyItem.key}
                        onClick={() => handleCalibrateLatency(policyItem.key)}
                        style={{ 
                          padding: '16px', 
                          borderRadius: '16px', 
                          border: responsePolicy === policyItem.key ? `2px solid ${policyItem.color}` : '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-body)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)' }}>{policyItem.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{policyItem.desc}</div>
                        </div>
                        {responsePolicy === policyItem.key && <Check size={18} color={policyItem.color} />}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Lead Conversion Propensity Diagnostics */}
            {activeModal === 'conversion_diagnostics' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '520px',
                  maxWidth: '100%',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={20} color="#6366f1" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      AI Conversion Diagnostics
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ background: 'var(--bg-body)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Real-time analysis of lead acquisition channels. Boosting low-performing channels increases aggregate student enrollments and lowers overall customer acquisition costs.
                  </p>

                  {/* Channel Breakdown list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Organic Search (SEO)', rate: 89, color: '#10b981' },
                      { name: 'Meta / Social Ads', rate: 64, color: '#6366f1' },
                      { name: 'Referral Direct Partner', rate: 78, color: '#8b5cf6' },
                      { name: 'Google Ads AdWords', rate: 58, color: '#f59e0b' }
                    ].map(channel => (
                      <div key={channel.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-sidebar)', marginBottom: '6px' }}>
                          <span>{channel.name}</span>
                          <span>{channel.rate}% conv.</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', borderRadius: '4px', backgroundColor: 'var(--border-color)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${channel.rate}%`, backgroundColor: channel.color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close Diagnostics
                  </button>
                  <button 
                    onClick={handleOptimizeChannels}
                    disabled={isOptimizingDiagnostics}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    {isOptimizingDiagnostics ? (
                      <>
                        <RefreshCw size={14} className="spin" /> Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Optimize Low Channels
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* AI SMS Outreach Live chat modal */}
            {activeModal === 'sms_outreach' && selectedStudent && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: '#0f172a',
                  color: 'white',
                  borderRadius: '32px',
                  padding: '30px',
                  width: '420px',
                  maxWidth: '100%',
                  border: '1px solid #1e293b',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto',
                  height: '560px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Smartphone styled header */}
                <div style={{ display: 'flex', justifySelf: 'flex-start', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{selectedStudent.name}</div>
                      <div style={{ fontSize: '0.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                        AI outreach active
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveModal('funnel_step');
                    }}
                    style={{ background: '#1e293b', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Messages Container */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {chatMessages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      style={{ 
                        maxWidth: '80%', 
                        alignSelf: msg.sender === 'ai' ? 'flex-start' : 'flex-end',
                        backgroundColor: msg.sender === 'ai' ? '#1e293b' : '#6366f1',
                        color: 'white',
                        padding: '12px 16px',
                        borderRadius: msg.sender === 'ai' ? '20px 20px 20px 4px' : '20px 20px 4px 20px',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                    >
                      {msg.text}
                    </motion.div>
                  ))}
                  {isChatTyping && (
                    <div style={{ display: 'flex', alignSelf: 'flex-start', backgroundColor: '#1e293b', padding: '12px 20px', borderRadius: '20px 20px 20px 4px', gap: '4px' }}>
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.4 }}></span>
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.4, animationDelay: '0.2s' }}></span>
                      <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white', opacity: 0.4, animationDelay: '0.4s' }}></span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Smartphone styled footer button */}
                <div style={{ justifySelf: 'flex-end', paddingTop: '12px', borderTop: '1px solid #1e293b' }}>
                  {chatMessages.length === (CHAT_DIALOGUES[selectedStudent.name] || []).length && !isChatTyping ? (
                    <button 
                      onClick={() => promoteInquiryToApplication(selectedStudent)}
                      style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      Advance to Applications <Sparkles size={14} />
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', padding: '10px' }}>
                      Simulating AI Conversational Agent...
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Cryptographic Ledger seal loading animation */}
            {activeModal === 'registry_sync' && selectedStudent && (
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
                  boxShadow: 'var(--shadow-xl)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: 'auto'
                }}
              >
                <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '24px' }}>
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '4px solid #f59e0b20', borderTopColor: '#f59e0b' }}
                  />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#f59e0b' }}>
                    <Database size={32} />
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>Sealing Academic Ledger</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '24px' }}>Encrypting registry records for {selectedStudent.name}</p>

                <div style={{ width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', height: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((registrySealStep + 1) / REGISTRY_SEAL_LOGS.length) * 100}%` }}
                    transition={{ ease: 'easeOut' }}
                    style={{ height: '100%', backgroundColor: '#f59e0b' }}
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
                  height: '130px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b'
                }}>
                  {REGISTRY_SEAL_LOGS.slice(0, registrySealStep + 1).map((log, i) => (
                    <div key={i} style={{ marginBottom: '6px', opacity: i === registrySealStep ? 1 : 0.4 }}>
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Printable Welcome Packet Letter */}
            {activeModal === 'welcome_packet' && selectedStudent && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: 'relative',
                  backgroundColor: 'white',
                  color: '#0f172a',
                  borderRadius: '32px',
                  padding: '40px',
                  width: '600px',
                  maxWidth: '100%',
                  boxShadow: 'var(--shadow-xl)',
                  margin: 'auto'
                }}
              >
                {/* Print Control Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '2px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={22} color="#4f46e5" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '1px' }}>
                      Executive Welcome Letter Suite
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveModal('funnel_step')}
                    style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0f172a' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Letter Body */}
                <div id="welcome-letter-content" style={{ padding: '24px', border: '1px solid #e2e8f0', borderRadius: '20px', fontFamily: "'Merriweather', serif", lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '24px', backgroundColor: '#fafbfd' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Alexandria Academy</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', textTransform: 'uppercase', fontWeight: 800 }}>Global Admissions & Records Office</div>
                    <div style={{ height: '1px', width: '60px', backgroundColor: '#e2e8f0', margin: '12px auto' }}></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '24px' }}>
                    <div>DATE: {selectedStudent.date || new Date().toLocaleDateString()}</div>
                    <div>REGISTRY SEAL: {selectedStudent.hash ? selectedStudent.hash.substring(0, 14) : "PENDING"}</div>
                  </div>

                  <p style={{ fontWeight: 800, marginBottom: '16px' }}>To the student parent of: {selectedStudent.name}</p>

                  <p style={{ marginBottom: '16px' }}>
                    We are absolutely thrilled to inform you that following evaluation by our Conservatory and Academic board panel, <strong>{selectedStudent.name}</strong> has been officially approved for admissions to <strong>Alexandria Academy</strong>, starting this upcoming academic semester.
                  </p>

                  <p style={{ marginBottom: '16px' }}>
                    Your candidate's academic files and entrance credentials have been successfully sealed inside our decentral registry under grade level: <strong>{selectedStudent.grade}</strong>.
                  </p>

                  {selectedStudent.scholarship && selectedStudent.scholarship !== 'None' && (
                    <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #10b981', backgroundColor: '#10b98108', fontSize: '0.8rem', color: '#10b981', fontWeight: 800, marginBottom: '16px' }}>
                      OFFICIAL GRANT AWARD: {selectedStudent.scholarship} has been fully provisioned against your student's annual tuition structure.
                    </div>
                  )}

                  <p style={{ marginBottom: '32px' }}>
                    Congratulations again on joining our global cohort. Welcome to Alexandria!
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Dr. Sunita Sharma</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Dean of Admissions</div>
                    </div>
                    <div style={{ opacity: 0.15 }}>
                      <Award size={48} />
                    </div>
                  </div>
                </div>

                {/* Print Control Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setActiveModal('funnel_step')}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #cbd5e1', backgroundColor: 'white', color: '#475569', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Back to Pool
                  </button>
                  <button 
                    onClick={() => window.print()}
                    style={{ flex: 1.5, padding: '14px', borderRadius: '14px', border: 'none', backgroundColor: '#4f46e5', color: 'white', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Printer size={16} /> Print Welcome Packet
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        )}
      </AnimatePresence>

      <style>{`
        .dot {
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
          background: var(--border-color);
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
        }
      `}</style>

    </div>
  );
};

export default AdmissionsAI;
