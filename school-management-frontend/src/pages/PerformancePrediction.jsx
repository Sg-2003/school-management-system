/* EduPro Neural Core - v6.0 Institutional Intelligence Core */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Brain, 
  Target, Users, Zap, ShieldAlert, BarChart3, ChevronRight,
  Download, Activity, CheckCircle2, Search, Filter, Sparkles,
  RefreshCw, MousePointer2, ArrowUpRight, AlertCircle,
  FileText, CheckCircle, XCircle, PieChart, Info,
  LayoutDashboard, Network, Microscope, Layers, Bot,
  Fingerprint, Clock, ExternalLink, MoreVertical, ScanSearch,
  Trophy, GraduationCap, Settings2, Sliders, Monitor,
  FileBarChart, ClipboardList, Database, Share2, UserSearch,
  X, Terminal, Mail, Calendar, UserCheck, Award, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentRiskCard = ({ student, onViewProfile }) => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [improvementRate, setImprovementRate] = useState(null);

  const measureImprovement = (e) => {
    e.stopPropagation();
    setIsMeasuring(true);
    setTimeout(() => {
      setImprovementRate((Math.random() * 20 + 5).toFixed(1));
      setIsMeasuring(false);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005, backgroundColor: 'var(--perf-bg-body)' }}
      onClick={() => onViewProfile(student)}
      style={{ padding: '16px 24px', borderBottom: '1px solid var(--perf-border-color)', display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 48px', alignItems: 'center', gap: '20px', transition: '0.2s', cursor: 'pointer', position: 'relative' }}
    >
       <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: student.riskLevel === 'High' ? 'var(--perf-high-bg)' : student.riskLevel === 'Medium' ? 'var(--perf-medium-bg)' : 'var(--perf-low-bg)', color: student.riskLevel === 'High' ? 'var(--perf-high-text)' : student.riskLevel === 'Medium' ? 'var(--perf-medium-text)' : 'var(--perf-low-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {student.riskLevel === 'High' ? <ShieldAlert size={18} /> : student.riskLevel === 'Medium' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          </div>
          <div style={{ overflow: 'hidden' }}>
             <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--perf-text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{student.name}</div>
             <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--perf-text-muted)' }}>{student.id}</div>
          </div>
       </div>
       <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--perf-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: student.riskLevel === 'High' ? '#ef4444' : student.riskLevel === 'Medium' ? '#f59e0b' : '#10b981' }} />
          {student.factor}
       </div>
       <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Current</div>
          <div style={{ fontSize: '1rem', fontWeight: 950, color: 'var(--perf-text-main)' }}>{student.predictedScore}</div>
       </div>
       <div style={{ textAlign: 'right' }}>
          {improvementRate ? (
             <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ fontSize: '1rem', fontWeight: 950, color: '#10b981' }}>+{improvementRate}%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981' }}>VELOCITY</div>
             </motion.div>
          ) : (
             <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1' }}>NEURAL SCAN</div>
          )}
       </div>
       <button onClick={measureImprovement} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: isMeasuring ? '#6366f1' : 'var(--perf-border-color)', color: isMeasuring ? 'white' : 'var(--perf-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s' }}>
          {isMeasuring ? <RefreshCw size={14} className="spin-slow" /> : <ChevronRight size={16} />}
       </button>
    </motion.div>
  );
};

const PivotCard = ({ student, onCalibrate }) => (
  <motion.div 
    whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
    onClick={() => onCalibrate(student)}
    style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '24px', padding: '24px', border: '1px solid var(--perf-border-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '260px' }}
  >
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#6366f110', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Network size={24} /></div>
        <div style={{ padding: '6px 12px', borderRadius: '10px', backgroundColor: '#f59e0b10', color: '#f59e0b', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>PIVOT PHASE</div>
     </div>
     <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1.15rem', fontWeight: 950, color: 'var(--perf-text-main)', marginBottom: '4px' }}>{student.name}</div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--perf-text-muted)', marginBottom: '20px' }}>{student.grade}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
           <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--perf-text-muted)', textTransform: 'uppercase' }}>Potential Score</span>
           <span style={{ fontSize: '1rem', fontWeight: 950, color: '#6366f1' }}>{student.pivotScore}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--perf-bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
           <motion.div initial={{ width: 0 }} animate={{ width: `${student.pivotScore}%` }} style={{ height: '100%', backgroundColor: '#6366f1' }} />
        </div>
     </div>
  </motion.div>
);

const ReportCard = ({ report, triggerToast }) => {
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const generateReport = () => {
    setStatus('generating');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { 
          clearInterval(interval); 
          setStatus('ready'); 
          triggerToast(`Report '${report.name}' compiled successfully! Ready for download.`, 'success');
          return 100; 
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          triggerToast(`Briefing report '${report.name}' downloaded successfully!`, 'success');
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <motion.div whileHover={{ y: -5 }} style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '24px', padding: '24px', border: '1px solid var(--perf-border-color)' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#6366f110', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileBarChart size={24} /></div>
          {status === 'ready' && <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981', backgroundColor: '#ecfdf5', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>READY</span>}
       </div>
       <h4 style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--perf-text-main)', marginBottom: '8px' }}>{report.name}</h4>
       <p style={{ fontSize: '0.8rem', color: 'var(--perf-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>{report.desc}</p>
       
       {isDownloading ? (
          <div style={{ width: '100%' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', marginBottom: '6px' }}>
                <span>DOWNLOADING...</span>
                <span>{downloadProgress}%</span>
             </div>
             <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--perf-bg-body)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${downloadProgress}%`, height: '100%', backgroundColor: '#6366f1', transition: 'width 0.15s ease' }} />
             </div>
          </div>
       ) : status === 'generating' ? (
          <div style={{ width: '100%' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', marginBottom: '6px' }}>
                <span>ANALYZING DATA...</span>
                <span>{progress}%</span>
             </div>
             <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--perf-bg-body)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#6366f1', transition: 'width 0.10s ease' }} />
             </div>
          </div>
       ) : status === 'ready' ? (
          <button onClick={handleDownload} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Download size={14} /> Download PDF</button>
       ) : (
          <button onClick={generateReport} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: 'var(--perf-text-main)', color: 'var(--perf-bg-card)', border: 'none', fontWeight: 950, cursor: 'pointer' }}>Generate Report</button>
       )}
    </motion.div>
  );
};

const PerformancePrediction = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); 
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [institutionalPassRate, setInstitutionalPassRate] = useState(92.4);
  
  // Custom themed toast state
  const [toast, setToast] = useState(null);

  // Layout settings state
  const [layoutSettings, setLayoutSettings] = useState({
    compactView: true,
    showTooltips: true,
    autoRefresh: false
  });

  // State-driven student cohorts
  const [criticalStudents, setCriticalStudents] = useState([
    { id: 'STU-1092', name: 'Lokesh Roy', riskLevel: 'High', factor: 'Chronic Absenteeism', predictedScore: '45%', attendance: '72%', missingTasks: 7, avatar: 'LR', desc: 'Lokesh exhibits chronic absenteeism and high regression rates in math vectors.' },
    { id: 'STU-0881', name: 'Noah Patel', riskLevel: 'High', factor: 'Low Engagement', predictedScore: '38%', attendance: '68%', missingTasks: 9, avatar: 'NP', desc: 'Noah has very low online system activity and chronic missing lab modules.' },
    { id: 'STU-0943', name: 'Alok Verma', riskLevel: 'High', factor: 'Reading Regression', predictedScore: '42%', attendance: '79%', missingTasks: 5, avatar: 'AV', desc: 'Alok shows conceptual regressions on textbook reading comprehension vectors.' }
  ]);

  const [resilientStudents, setResilientStudents] = useState([
    { id: 'STU-1205', name: 'Divya Joshi', riskLevel: 'Low', factor: 'GPA Dip', predictedScore: '74%', attendance: '98%', gpa: '3.92', avatar: 'DJ', desc: 'Divya maintains high attendance and stable homework engagement scores.' },
    { id: 'STU-1166', name: 'Shalini Mishra', riskLevel: 'Low', factor: 'Stable Capability', predictedScore: '98%', attendance: '99%', gpa: '3.98', avatar: 'SM', desc: 'Shalini is an elite mathematical contributor in cohort research groups.' },
    { id: 'STU-0955', name: 'Deepak Kumar', riskLevel: 'Low', factor: 'Stable Velocity', predictedScore: '94%', attendance: '97%', gpa: '3.85', avatar: 'DK', desc: 'Deepak has robust conceptual capabilities across biology and coding lectures.' }
  ]);

  // Pivot strategies state
  const [pivotList, setPivotList] = useState([
    { id: 'STU-1122', name: 'Maya Reddy', grade: 'Grade 10-B', pivotScore: 42, factor: 'Pre-Calculus Regression' },
    { id: 'STU-0899', name: 'Madhav Yadav', grade: 'Grade 9-A', pivotScore: 38, factor: 'Chronic Tardiness' },
    { id: 'STU-1405', name: 'Kriti Sen', grade: 'Grade 12-C', pivotScore: 45, factor: 'Physics Laboratory Lag' },
    { id: 'STU-1502', name: 'Rahul Verma', grade: 'Grade 11-A', pivotScore: 48, factor: 'Reading Comprehension' },
    { id: 'STU-0944', name: 'Meera Iyer', grade: 'Grade 10-A', pivotScore: 52, factor: 'English Assignment Lag' },
    { id: 'STU-1177', name: 'Arun Patel', grade: 'Grade 11-C', pivotScore: 41, factor: 'Chemistry Regression' },
    { id: 'STU-1088', name: 'Zara Khan', grade: 'Grade 9-B', pivotScore: 49, factor: 'French Homework Compliance' },
    { id: 'STU-1255', name: 'Farhan Khan', grade: 'Grade 12-A', pivotScore: 55, factor: 'Advanced Calculus' },
    { id: 'STU-1333', name: 'Sana Malik', grade: 'Grade 10-C', pivotScore: 44, factor: 'Trigonometry Homework' }
  ]);

  // Audit list state
  const [auditList, setAuditList] = useState([
    { id: 'STU-1092', name: 'Lokesh Roy', riskLevel: 'High', factor: 'Chronic Absenteeism', predictedScore: '45%', attendance: '72%', missingTasks: 7, desc: 'Lokesh exhibits chronic absenteeism and high regression rates in math vectors.' },
    { id: 'STU-1144', name: 'Neha Sharma', riskLevel: 'Medium', factor: 'Physics Regression', predictedScore: '62%', attendance: '81%', missingTasks: 4, desc: 'Neha exhibits declining trends in science modules and homework completions.' },
    { id: 'STU-0881', name: 'Noah Patel', riskLevel: 'High', factor: 'Low Engagement', predictedScore: '51%', attendance: '68%', missingTasks: 9, desc: 'Noah has very low online system activity and chronic missing lab modules.' },
    { id: 'STU-1205', name: 'Divya Joshi', riskLevel: 'Low', factor: 'GPA Dip', predictedScore: '74%', attendance: '98%', gpa: '3.92', desc: 'Divya maintains high attendance and stable homework engagement scores.' },
    { id: 'STU-0943', name: 'Alok Verma', riskLevel: 'High', factor: 'Reading Regression', predictedScore: '42%', attendance: '79%', missingTasks: 5, desc: 'Alok shows conceptual regressions on textbook reading comprehension vectors.' },
    { id: 'STU-1120', name: 'Geeta Patel', riskLevel: 'Medium', factor: 'Lab Reports', predictedScore: '65%', attendance: '84%', missingTasks: 3, desc: 'Geeta shows moderate compliance delays in biology practical blocks.' }
  ]);

  // Interactive UI modals state
  const [selectedProfileStudent, setSelectedProfileStudent] = useState(null);
  const [calibratingStudent, setCalibratingStudent] = useState(null);
  const [calibrationHours, setCalibrationHours] = useState(5);
  const [auditFilter, setAuditFilter] = useState('all'); // 'all', 'High', 'Medium', 'Low'
  const [isOptimizing, setIsOptimizing] = useState(false);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auto-refresh simulation
  useEffect(() => {
    if (layoutSettings.autoRefresh) {
      const interval = setInterval(() => {
        setInstitutionalPassRate(prev => {
          const delta = (Math.random() * 0.4 - 0.2);
          return parseFloat(Math.min(100, Math.max(80, prev + delta)).toFixed(2));
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [layoutSettings.autoRefresh]);

  const toggleLayoutSetting = (key) => {
    setLayoutSettings(prev => {
      const newVal = !prev[key];
      const labels = {
        compactView: 'Compact Audit View',
        showTooltips: 'Neural Tooltips',
        autoRefresh: 'Auto-Refresh Vectors'
      };
      triggerToast(`${labels[key]} toggled ${newVal ? 'ON' : 'OFF'}.`, 'success');
      return { ...prev, [key]: newVal };
    });
  };

  const handleResetLayout = () => {
    setLayoutSettings({
      compactView: true,
      showTooltips: true,
      autoRefresh: false
    });
    triggerToast('Layout configurations restored statefully.', 'success');
  };

  const handleOutcomeClick = (type) => {
    if (type === 'fail') {
      setActiveTab('audit');
      setAuditFilter('High');
      triggerToast('Filtered Audit View to show CRITICAL high-risk students.', 'info');
    } else {
      setActiveTab('overview');
      triggerToast('Showing Resilient and Stable cohorts overview.', 'info');
    }
  };

  // Full screen scanning simulation
  const startPerformanceScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    triggerToast('Initializing institutional predictive vectors scan...', 'info');

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setInstitutionalPassRate(94.8);
            triggerToast('Neural core optimization complete! Projected pass rate increased to 94.8%.', 'success');
            setScanResult({
              highFail: [{ name: 'Lokesh Roy', chance: 82 }, { name: 'Noah Patel', chance: 76 }],
              lowFail: [{ name: 'Divya Joshi', chance: 12 }, { name: 'Neha Sharma', chance: 18 }]
            });
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
       setSelectedStudent({
          name: query,
          passProb: (Math.random() * 40 + 50).toFixed(1),
          failProb: (Math.random() * 30 + 10).toFixed(1),
          risk: 'Minimal',
          status: 'Stable Vector'
       });
    } else {
       setSelectedStudent(null);
    }
  };

  // Strategic Advisor Optimization Modelling
  const startStrategicOptimization = () => {
    setIsOptimizing(true);
    triggerToast('Launching secure AI strategic simulation...', 'info');
    setTimeout(() => {
      setIsOptimizing(false);
      setScanResult({ type: 'strategy', data: ['Math Block Scheduling', 'Engagement Sprints', 'Predictive Grade Weighting'] });
      triggerToast('AI optimization modeling completed successfully.', 'success');
    }, 1800);
  };

  // Intervention simulations
  const handleCounselingSession = (studentName) => {
    triggerToast(`Academic counseling session scheduled statefully for ${studentName}!`, 'success');
    setSelectedProfileStudent(null);
  };

  const handleGuardianAlert = (studentName) => {
    triggerToast(`Sent formal academic alert notification to ${studentName}'s guardians.`, 'success');
    setSelectedProfileStudent(null);
  };

  const handleHonorRoll = (studentName) => {
    triggerToast(`Nominated ${studentName} for the STEM Elite Honor Roll scholarship!`, 'success');
    setSelectedProfileStudent(null);
  };

  // Deploy Pivot strategy calibration
  const deployCalibration = () => {
    if (!calibratingStudent) return;
    const originalHours = 5;
    const factor = (calibrationHours - originalHours) / 10;
    const projectedIncrease = Math.round(factor * 20);
    const newScore = Math.min(100, calibratingStudent.pivotScore + projectedIncrease);

    setPivotList(prev => prev.map(s => s.id === calibratingStudent.id ? { ...s, pivotScore: newScore } : s));
    triggerToast(`Calibrated strategic model deployed statefully for ${calibratingStudent.name}!`, 'success');
    setCalibratingStudent(null);
  };

  // Filtering for strategic risk audit list
  const filteredAuditList = auditList.filter(s => {
    if (auditFilter === 'all') return true;
    return s.riskLevel === auditFilter;
  });

  const reports = [
    { id: 1, name: 'Graduation Path', desc: 'Forecasting of graduation probability and institutional timelines.' },
    { id: 2, name: 'Risk Heatmap', desc: 'Identify highest risk variance across all active student cohorts.' },
    { id: 3, name: 'Departmental Matrix', desc: 'Comparative analysis of departmental performance and efficiency.' },
    { id: 4, name: 'Attendance Regression', desc: 'Detailed audit of attendance patterns vs academic regressions.' },
    { id: 5, name: 'Graduation Velocity', desc: 'Predictive modeling of institutional graduation speed vectors.' },
    { id: 6, name: 'Neural Learning Trends', desc: 'Analysis of syllabus engagement and cognitive retention rates.' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--perf-bg-body)', padding: '32px', fontFamily: 'Inter, sans-serif', color: 'var(--perf-text-main)', transition: 'background-color 0.3s, color 0.3s' }}>
      <style>{`
        :root {
          --perf-bg-body: #f8fafc;
          --perf-bg-card: #ffffff;
          --perf-text-main: #0f172a;
          --perf-text-muted: #64748b;
          --perf-border-color: #f1f5f9;
          --perf-input-bg: #ffffff;
          
          --perf-risk-bg: #fef2f2;
          --perf-risk-border: #fee2e2;
          --perf-risk-text: #991b1b;
          
          --perf-success-bg: #ecfdf5;
          --perf-success-border: #d1fae5;
          --perf-success-text: #065f46;

          --perf-high-bg: rgba(239, 68, 68, 0.08);
          --perf-high-text: #ef4444;
          --perf-medium-bg: rgba(245, 158, 11, 0.08);
          --perf-medium-text: #d97706;
          --perf-low-bg: rgba(16, 185, 129, 0.08);
          --perf-low-text: #10b981;
          
          --perf-tab-bg: #ffffff;
          --perf-tab-btn-bg: transparent;
          --perf-tab-btn-color: #64748b;
        }
        
        [data-theme='dark'] {
          --perf-bg-body: #1a202c;
          --perf-bg-card: #2d3748;
          --perf-text-main: #f7fafc;
          --perf-text-muted: #a0aec0;
          --perf-border-color: #4a5568;
          --perf-input-bg: #1a202c;
          
          --perf-risk-bg: rgba(239, 68, 68, 0.12);
          --perf-risk-border: rgba(239, 68, 68, 0.25);
          --perf-risk-text: #f87171;
          
          --perf-success-bg: rgba(16, 185, 129, 0.12);
          --perf-success-border: rgba(16, 185, 129, 0.25);
          --perf-success-text: #34d399;

          --perf-high-bg: rgba(239, 68, 68, 0.15);
          --perf-high-text: #f87171;
          --perf-medium-bg: rgba(245, 158, 11, 0.15);
          --perf-medium-text: #fbbf24;
          --perf-low-bg: rgba(16, 185, 129, 0.15);
          --perf-low-text: #34d399;
          
          --perf-tab-bg: #2d3748;
          --perf-tab-btn-bg: transparent;
          --perf-tab-btn-color: #cbd5e0;
        }

        .range-slider::-webkit-slider-runnable-track {
          background: var(--perf-border-color);
          border-radius: 4px;
          height: 8px;
        }

        .range-slider::-webkit-slider-thumb {
          background: #6366f1;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -5px;
        }
      `}</style>
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 20, scale: 1 }} 
            exit={{ opacity: 0, y: -50, scale: 0.9 }} 
            style={{ 
              position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 28px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '24px', 
              boxShadow: '0 20px 40px rgba(15,23,42,0.2)', border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)'
            }}
          >
             <div style={{ 
               width: '28px', height: '28px', borderRadius: '8px', 
               backgroundColor: toast.type === 'success' ? '#10b98120' : '#6366f120', 
               color: toast.type === 'success' ? '#10b981' : '#6366f1', 
               display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
               {toast.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
             </div>
             <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block */}
      <div style={{ marginBottom: '40px' }}>
         <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: '#6366f110', color: '#6366f1', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 900, marginBottom: '16px' }}>
            <Sparkles size={14} /> INSTITUTIONAL NEURAL CORE v6.0
         </div>
         <h1 style={{ fontSize: '3.2rem', fontWeight: 950, color: 'var(--perf-text-main)', letterSpacing: '-2.5px', margin: 0 }}>Performance <span style={{ color: '#6366f1' }}>Intelligence</span></h1>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', backgroundColor: 'var(--perf-tab-bg)', padding: '8px', borderRadius: '24px', border: '1px solid var(--perf-border-color)', width: 'fit-content' }}>
         {['overview', 'audit', 'strategies', 'reports'].map((tab) => (
           <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '12px 28px', borderRadius: '18px', border: 'none', backgroundColor: activeTab === tab ? '#6366f1' : 'transparent', color: activeTab === tab ? 'white' : 'var(--perf-tab-btn-color)', fontWeight: 800, cursor: 'pointer', textTransform: 'capitalize', transition: '0.3s' }}>{tab}</button>
         ))}
      </div>

      {/* Primary Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <AnimatePresence mode="wait">
               {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                     
                     {/* Core Stats Overview Row */}
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        {[
                          { label: 'Pass Rate', value: `${institutionalPassRate}%`, icon: Activity, color: '#6366f1' },
                          { label: 'At-Risk Count', value: '47', icon: AlertTriangle, color: '#ef4444' },
                          { label: 'AI Accuracy', value: '99.4%', icon: Brain, color: '#10b981' },
                          { label: 'Interventions', value: '12', icon: Target, color: '#f59e0b' }
                        ].map((stat, i) => (
                           <motion.div key={i} whileHover={{ y: -5 }} style={{ backgroundColor: 'var(--perf-bg-card)', padding: '24px', borderRadius: '24px', border: '1px solid var(--perf-border-color)', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${stat.color}10`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <stat.icon size={22} />
                              </div>
                              <div>
                                 <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--perf-text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
                                 <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--perf-text-main)', letterSpacing: '-1px' }}>{stat.value}</div>
                              </div>
                           </motion.div>
                        ))}
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '40px' }}>
                        
                        {/* Individual Student Prediction Lookup */}
                        <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', padding: '32px', border: '1px solid var(--perf-border-color)', boxShadow: '0 4px 25px rgba(0,0,0,0.02)', position: 'relative' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#6366f110', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserSearch size={20} /></div>
                              <h2 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, color: 'var(--perf-text-main)' }}>Prediction Lookup</h2>
                           </div>
                           <div style={{ position: 'relative' }}>
                              <input 
                                 type="text" placeholder="Student Name or ID..."
                                 value={searchQuery} onChange={handleSearch}
                                 style={{ width: '100%', padding: '16px 50px', borderRadius: '16px', border: '1px solid var(--perf-border-color)', backgroundColor: 'var(--perf-input-bg)', color: 'var(--perf-text-main)', fontSize: '1rem', fontWeight: 600, outline: 'none' }}
                              />
                              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} color="#94a3b8" size={18} />
                              {searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setSelectedStudent(null); }} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                  <X size={18} />
                                </button>
                              )}
                           </div>

                           <AnimatePresence>
                              {selectedStudent && (
                                 <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', backgroundColor: 'var(--perf-bg-body)', borderRadius: '24px', border: '1px solid var(--perf-border-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                       <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--perf-text-main)' }}>{selectedStudent.name}</div>
                                       <span style={{ fontSize: '0.7rem', fontWeight: 900, backgroundColor: 'var(--perf-border-color)', color: 'var(--perf-text-main)', padding: '4px 8px', borderRadius: '8px' }}>STABLE</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid var(--perf-border-color)', paddingTop: '16px' }}>
                                       <div style={{ textAlign: 'center', borderRight: '1px solid var(--perf-border-color)' }}>
                                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-text-muted)', marginBottom: '4px' }}>PASS PROB</div>
                                          <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#10b981' }}>{selectedStudent.passProb}%</div>
                                       </div>
                                       <div style={{ textAlign: 'center' }}>
                                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-text-muted)', marginBottom: '4px' }}>FAIL PROB</div>
                                          <div style={{ fontSize: '2.2rem', fontWeight: 950, color: '#ef4444' }}>{selectedStudent.failProb}%</div>
                                       </div>
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>

                        {/* Neural Estimator Quick Launch */}
                        <div style={{ backgroundColor: '#0f172a', borderRadius: '40px', padding: '40px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                           <Sparkles size={48} color="#f59e0b" style={{ marginBottom: '24px' }} />
                           <h2 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '16px' }}>Neural Outcome <span style={{ color: '#6366f1' }}>Estimator</span></h2>
                           <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '32px', lineHeight: 1.5 }}>Recalibrate institutional performance weights based on real-time data vectors.</p>
                           <button onClick={startPerformanceScan} disabled={isScanning} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 950, cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}>{isScanning ? 'Recalibrating...' : 'Launch Intelligence Scan'}</button>
                        </div>
                     </div>

                     {/* Risk Spectrum Analytics (Side-by-Side) */}
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        
                        {/* High Risk Tier */}
                        <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', padding: '32px', border: '1px solid var(--perf-risk-border)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--perf-risk-text)', margin: 0 }}>Critical Risk Tier</h3>
                              <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'var(--perf-risk-bg)', color: 'var(--perf-risk-text)', fontSize: '0.65rem', fontWeight: 900 }}>3 STUDENTS</div>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {criticalStudents.map((s, i) => (
                                 <div 
                                   key={i} 
                                   onClick={() => setSelectedProfileStudent({ ...s, type: 'risk' })}
                                   style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: 'var(--perf-risk-bg)', border: '1px solid var(--perf-risk-border)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--perf-risk-text)', cursor: 'pointer', transition: '0.2s' }}
                                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                   onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                 >
                                    <span>{s.name}</span>
                                    <span style={{ opacity: 0.7 }}>AUDIT FLAG</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Low Risk Tier */}
                        <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', padding: '32px', border: '1px solid var(--perf-success-border)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--perf-success-text)', margin: 0 }}>Resilient Success</h3>
                              <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'var(--perf-success-bg)', color: 'var(--perf-success-text)', fontSize: '0.65rem', fontWeight: 900 }}>3 STUDENTS</div>
                           </div>
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {resilientStudents.map((s, i) => (
                                 <div 
                                   key={i} 
                                   onClick={() => setSelectedProfileStudent({ ...s, type: 'success' })}
                                   style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', backgroundColor: 'var(--perf-success-bg)', border: '1px solid var(--perf-success-border)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--perf-success-text)', cursor: 'pointer', transition: '0.2s' }}
                                   onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                   onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                 >
                                    <span>{s.name}</span>
                                    <span style={{ opacity: 0.7 }}>STABLE VECTOR</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'audit' && (
                  <motion.div key="audit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                     <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', border: '1px solid var(--perf-border-color)', overflow: 'hidden' }}>
                        <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--perf-border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h2 style={{ fontSize: '1.6rem', fontWeight: 950, margin: 0, color: 'var(--perf-text-main)' }}>Strategic Risk Audit</h2>
                          
                          {/* Audit Filter Selector */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {['all', 'High', 'Medium', 'Low'].map(lvl => (
                              <button 
                                key={lvl}
                                onClick={() => { setAuditFilter(lvl); triggerToast(`Filtering audit by ${lvl.toUpperCase()} level.`, 'info'); }}
                                style={{
                                  padding: '8px 16px', borderRadius: '10px', border: 'none',
                                  backgroundColor: auditFilter === lvl ? '#6366f1' : 'var(--perf-bg-body)',
                                  color: auditFilter === lvl ? 'white' : 'var(--perf-text-muted)',
                                  fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s'
                                }}
                              >
                                {lvl.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                         <div style={{ maxHeight: '600px', overflowY: 'auto' }} className="hide-scrollbar">
                            {filteredAuditList.length > 0 ? (
                              filteredAuditList.map((s) => (
                                <StudentRiskCard 
                                  key={s.id} 
                                  student={s} 
                                  onViewProfile={(student) => setSelectedProfileStudent({ ...student, type: student.riskLevel === 'Low' ? 'success' : 'risk' })} 
                                />
                              ))
                            ) : (
                              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--perf-text-muted)', fontWeight: 700 }}>No students found matching this criteria.</div>
                            )}
                         </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'strategies' && (
                  <motion.div key="strategies" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                     <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', padding: '40px', border: '1px solid var(--perf-border-color)' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 950, marginBottom: '32px', color: 'var(--perf-text-main)' }}>Neural Pivot Strategy</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                           {pivotList.map((s) => <PivotCard key={s.id} student={s} onCalibrate={(student) => { setCalibratingStudent(student); setCalibrationHours(5); }} />)}
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'reports' && (
                  <motion.div key="reports" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        {reports.map((report) => <ReportCard key={report.id} report={report} triggerToast={triggerToast} />)}
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Sidebar Controls */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Outcome Monitor blocks (PASS / FAIL selectors) */}
            <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', padding: '32px', border: '1px solid var(--perf-border-color)' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '24px', color: 'var(--perf-text-main)' }}>Outcome Monitor</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div 
                    onClick={() => handleOutcomeClick('pass')}
                    style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--perf-success-bg)', border: '1px solid var(--perf-success-border)', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                  >
                    <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#10b981' }}>342</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#047857', letterSpacing: '0.5px' }}>COHORT PASS</div>
                  </div>
                  
                  <div 
                    onClick={() => handleOutcomeClick('fail')}
                    style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--perf-risk-bg)', border: '1px solid var(--perf-risk-border)', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                  >
                    <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#ef4444' }}>47</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#991b1b', letterSpacing: '0.5px' }}>COHORT RISK</div>
                  </div>
               </div>
            </div>

             {/* Layout Intelligence Controller */}
             <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '40px', padding: '32px', border: '1px solid var(--perf-border-color)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--perf-text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings2 size={20} /> Layout Intel</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   {[
                     { label: 'Compact Audit View', key: 'compactView', active: layoutSettings.compactView },
                     { label: 'Show Neural Tooltips', key: 'showTooltips', active: layoutSettings.showTooltips },
                     { label: 'Auto-Refresh Vectors', key: 'autoRefresh', active: layoutSettings.autoRefresh }
                   ].map((opt, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--perf-text-muted)' }}>{opt.label}</span>
                         <div onClick={() => toggleLayoutSetting(opt.key)} style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: opt.active ? '#6366f1' : 'var(--perf-bg-body)', position: 'relative', cursor: 'pointer', transition: '0.2s' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', right: opt.active ? '2px' : 'auto', left: opt.active ? 'auto' : '2px', transition: '0.2s' }} />
                         </div>
                      </div>
                   ))}
                </div>
                <button onClick={handleResetLayout} style={{ width: '100%', marginTop: '32px', padding: '14px', borderRadius: '12px', backgroundColor: 'var(--perf-bg-body)', color: 'var(--perf-text-muted)', border: '1px solid var(--perf-border-color)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', transition: '0.2s' }}>Reset Default Layout</button>
             </div>
          </div>
      </div>

      {/* Immersive Neural Scan Overlay */}
      <AnimatePresence>
        {isScanning && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', zIndex: 9000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '400px', width: '100%', padding: '0 24px', textAlign: 'center' }}
            >
              <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 1.2s linear infinite' }} />
                <Brain size={44} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }} />
              </div>
              
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 950 }}>Neural Core Radar Scan</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#a5b4fc', fontWeight: 700 }}>Processing systemic cohort outcomes...</p>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginTop: '8px' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', backgroundColor: '#6366f1', transition: 'width 0.15s ease' }} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace' }}>{scanProgress}%</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Profile Interventions Dialog */}
      <AnimatePresence>
        {selectedProfileStudent && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--perf-bg-card)', border: '1px solid var(--perf-border-color)', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', color: 'var(--perf-text-main)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, backgroundColor: selectedProfileStudent.type === 'risk' ? 'var(--perf-risk-bg)' : 'var(--perf-success-bg)', color: selectedProfileStudent.type === 'risk' ? 'var(--perf-risk-text)' : 'var(--perf-success-text)' }}>
                    {selectedProfileStudent.type === 'risk' ? <ShieldAlert size={14} /> : <Trophy size={14} />}
                    {selectedProfileStudent.type === 'risk' ? 'CRITICAL AUDIT PROTOCOL' : 'ELITE SCHOLAR PROFILE'}
                 </div>
                 <button onClick={() => setSelectedProfileStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                 <div style={{ width: '72px', height: '72px', borderRadius: '24px', backgroundColor: selectedProfileStudent.type === 'risk' ? 'var(--perf-risk-bg)' : 'var(--perf-success-bg)', color: selectedProfileStudent.type === 'risk' ? 'var(--perf-risk-text)' : 'var(--perf-success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900 }}>
                    {selectedProfileStudent.avatar || selectedProfileStudent.name.split(' ').map(n=>n[0]).join('')}
                 </div>
                 <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 950, color: 'var(--perf-text-main)' }}>{selectedProfileStudent.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--perf-text-muted)', fontWeight: 700 }}>ID: {selectedProfileStudent.id}</span>
                 </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--perf-text-muted)', lineHeight: 1.6, margin: '0 0 28px 0', fontWeight: 500 }}>{selectedProfileStudent.desc || 'System-compiled student neural audit metrics.'}</p>

              {/* Student KPI breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid var(--perf-border-color)', borderBottom: '1px solid var(--perf-border-color)', padding: '20px 0', marginBottom: '32px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Outcome Prob</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--perf-text-main)' }}>{selectedProfileStudent.predictedScore}</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Attendance</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{selectedProfileStudent.attendance || '94%'}</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    {selectedProfileStudent.type === 'risk' ? (
                       <>
                         <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Missing Tasks</div>
                         <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{selectedProfileStudent.missingTasks || 3}</div>
                       </>
                    ) : (
                       <>
                         <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Active GPA</div>
                         <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6366f1' }}>{selectedProfileStudent.gpa || '3.92'}</div>
                       </>
                    )}
                 </div>
              </div>

              {/* Recommended Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 {selectedProfileStudent.type === 'risk' ? (
                   <>
                     <button 
                       onClick={() => handleCounselingSession(selectedProfileStudent.name)} 
                       style={{ padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                     >
                        <Calendar size={16} /> Schedule Counseling
                     </button>
                     <button 
                       onClick={() => handleGuardianAlert(selectedProfileStudent.name)} 
                       style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                     >
                        <Mail size={16} /> Alert Guardians
                     </button>
                   </>
                 ) : (
                   <>
                     <button 
                       onClick={() => handleHonorRoll(selectedProfileStudent.name)} 
                       style={{ padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                     >
                        <Award size={16} /> STEM Honor Nomination
                     </button>
                     <button 
                       onClick={() => {
                         triggerToast(`Academic recognition notice dispatched to ${selectedProfileStudent.name}.`, 'success');
                         setSelectedProfileStudent(null);
                       }} 
                       style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                     >
                        <UserCheck size={16} /> Congratulate Scholar
                     </button>
                   </>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pivot Calibrator Modal */}
      <AnimatePresence>
        {calibratingStudent && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--perf-bg-card)', border: '1px solid var(--perf-border-color)', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', color: 'var(--perf-text-main)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, backgroundColor: '#6366f115', color: '#6366f1' }}>
                    <Network size={14} /> ACTIVE CALIBRATION MODELER
                 </div>
                 <button onClick={() => setCalibratingStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 950, color: 'var(--perf-text-main)' }}>Calibration: {calibratingStudent.name}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--perf-text-muted)', lineHeight: 1.5, margin: '0 0 24px 0', fontWeight: 500 }}>
                 Adjust targeted tutoring intervention weights to simulate prospective conceptual increases statefully.
              </p>

              {/* Range Slider calibration */}
              <div style={{ backgroundColor: 'var(--perf-bg-body)', padding: '24px', borderRadius: '20px', border: '1px solid var(--perf-border-color)', marginBottom: '32px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', marginBottom: '16px' }}>
                   <span style={{ color: 'var(--perf-text-muted)' }}>Target Weekly Tutoring Hours</span>
                   <span style={{ color: '#6366f1', fontSize: '1.1rem' }}>{calibrationHours} Hours</span>
                 </div>
                 <input 
                   type="range" min="5" max="15" 
                   value={calibrationHours} 
                   onChange={(e) => setCalibrationHours(parseInt(e.target.value))}
                   className="range-slider"
                   style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'transparent', outline: 'none', cursor: 'pointer', WebkitAppearance: 'none' }}
                 />
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', marginTop: '8px' }}>
                   <span>5 Hours (Base)</span>
                   <span>10 Hours</span>
                   <span>15 Hours (Max)</span>
                 </div>
              </div>

              {/* Simulated Projections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                 <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--perf-success-bg)', border: '1px solid var(--perf-success-border)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-success-text)', textTransform: 'uppercase', marginBottom: '6px' }}>Potential Increase</div>
                    <div style={{ fontSize: '2rem', fontWeight: 950, color: '#10b981' }}>+{Math.round(((calibrationHours - 5)/10)*20)}%</div>
                 </div>
                 <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', marginBottom: '6px' }}>Projected Potential</div>
                    <div style={{ fontSize: '2rem', fontWeight: 950, color: '#6366f1' }}>{Math.min(100, calibratingStudent.pivotScore + Math.round(((calibrationHours - 5)/10)*20))}%</div>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                 <button 
                   onClick={deployCalibration}
                   style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer' }}
                 >
                    Deploy Strategic Calibration
                 </button>
                 <button 
                   onClick={() => setCalibratingStudent(null)} 
                   style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, cursor: 'pointer' }}
                 >
                    Cancel
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled animation components */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-slow { animation: spin 3s linear infinite; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default PerformancePrediction;
