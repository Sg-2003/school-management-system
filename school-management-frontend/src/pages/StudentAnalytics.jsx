/* EduPro Elite - Ultra-Premium Student Analytics v3.0 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart3, TrendingUp, AlertCircle, 
  Search, BookOpen, Clock, Award, ChevronRight,
  Filter, Download, LayoutGrid, List, Calendar,
  PieChart, Activity, Globe, Zap, Target,
  ArrowUpRight, ArrowDownRight, MoreVertical,
  Fingerprint, MousePointer2, Scan, Eye,
  History, MessageSquare, Terminal, LineChart,
  Layers, ShieldCheck, Box, Settings, Bell, TrendingDown,
  FileText, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProCard = ({ children, title, icon: Icon, color, delay = 0, onMoreClick, hasMore = true, style = {} }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5, boxShadow: 'var(--shadow-md)' }}
    style={{ 
      backgroundColor: 'var(--bg-card)', 
      borderRadius: '32px', 
      padding: '32px', 
      border: '1px solid var(--border-color)', 
      position: 'relative', 
      overflow: 'hidden',
      ...style 
    }}
  >
     {title && (
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
             {Icon && <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} /></div>}
             {title}
          </h3>
          {hasMore && (
            <button 
              onClick={onMoreClick} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '50%',
                transition: '0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MoreVertical size={20} />
            </button>
          )}
       </div>
     )}
     {children}
  </motion.div>
);

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState('overview');
  const [showToast, setShowToast] = useState(null);
  const [activeProcessingItem, setActiveProcessingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [previewReport, setPreviewReport] = useState(null);

  // --- INTERACTIVE OVERHAUL STATES ---
  const [viewControls, setViewControls] = useState({
    heatmaps: true,
    percentages: true,
    liveSync: false
  });

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [calibrationPoint, setCalibrationPoint] = useState(null);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectDifficulty, setSubjectDifficulty] = useState(50);
  const [subjectAuditProgress, setSubjectAuditProgress] = useState(null);
  const [showSubjectCert, setShowSubjectCert] = useState(false);

  const [showComplianceSweep, setShowComplianceSweep] = useState(false);
  const [complianceLogs, setComplianceLogs] = useState([]);
  const [complianceProgress, setComplianceProgress] = useState(0);
  const [sweepState, setSweepState] = useState('idle');

  const [showAuditConsole, setShowAuditConsole] = useState(false);
  const [rollingLogsActive, setRollingLogsActive] = useState(true);
  const [auditLogs, setAuditLogs] = useState([
    { time: '23:14:02', level: 'SYSTEM', msg: 'EDUPRO Core database handshake verified.' },
    { time: '23:14:05', level: 'AUTH', msg: 'Administrator session token refreshed.' },
    { time: '23:15:30', level: 'TELEMETRY', msg: 'Grade 12 Physics vector adjusted (+2.4%).' },
    { time: '23:16:11', level: 'VAULT', msg: 'FERPA metadata wrapper verified.' }
  ]);

  const [mainStatsData, setMainStatsData] = useState({
    efficiency: 92.4,
    attendance: 96.8,
    coverage: 84.5
  });

  // Graph Data
  const graphPoints = [
    { month: 'Jan', val: 20, y: 240, x: 0, active: 1412, avg: 'B-', status: 'Baseline Established', milestone: 'Diagnostic Exams Complete' },
    { month: 'Feb', val: 40, y: 180, x: 167, active: 1422, avg: 'B', status: 'Curriculum Readjustment', milestone: 'Math Efficacy Audit' },
    { month: 'Mar', val: 33, y: 200, x: 333, active: 1430, avg: 'B-', status: 'Mid-term Focus Phase', milestone: 'Syllabus Coverage Sprint' },
    { month: 'Apr', val: 60, y: 120, x: 500, active: 1438, avg: 'B+', status: 'Physics Weight Calibrator', milestone: 'Lab Assignments Verified' },
    { month: 'May', val: 73, y: 80, x: 667, active: 1450, avg: 'A-', status: 'Longitudinal Data Sync', milestone: 'Predictive Accuracy Ready' },
    { month: 'Jun', val: 90, y: 30, x: 833, active: 1455, avg: 'A', status: 'Optimal Cohort Progression', milestone: 'Term Efficacy Target Met' },
    { month: 'Jul', val: 100, y: 0, x: 1000, active: 1462, avg: 'A+', status: 'Final Mastery Achieved', milestone: 'Institutional Capstone Complete' }
  ];

  // Live Sync oscillator effect
  useEffect(() => {
    if (!viewControls.liveSync) return;
    
    const interval = setInterval(() => {
      setMainStatsData(prev => {
        const dEff = (Math.random() - 0.5) * 0.4;
        const dAtt = (Math.random() - 0.5) * 0.2;
        const dCov = Math.random() * 0.05; // Progression generally trends positive/stable
        return {
          efficiency: Math.min(100, Math.max(80, parseFloat((prev.efficiency + dEff).toFixed(1)))),
          attendance: Math.min(100, Math.max(90, parseFloat((prev.attendance + dAtt).toFixed(1)))),
          coverage: Math.min(100, Math.max(50, parseFloat((prev.coverage + dCov).toFixed(1))))
        };
      });
      
      setAuditLogs(prev => {
        const timeStr = new Date().toTimeString().split(' ')[0];
        const logTypes = [
          { level: 'SYNC', msg: 'Cohort attendance matrix synchronized.' },
          { level: 'TELEMETRY', msg: 'Real-time efficiency vector updated.' },
          { level: 'NEURAL', msg: 'Predictive mastery indices re-weighted.' },
          { level: 'SECURITY', msg: 'SSL key verification handshake success.' }
        ];
        const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
        const nextLogs = [{ time: timeStr, ...randomLog }, ...prev];
        return nextLogs.slice(0, 30);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [viewControls.liveSync]);

  // Click outside to dismiss dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const [settings, setSettings] = useState([
    { id: 'acc', label: 'Predictive Accuracy Threshold', desc: 'Set the confidence interval for AI-driven performance modeling.', vals: ['90%', '95%', '98%', '99%'], current: 1 },
    { id: 'sens', label: 'Institutional Alert Sensitivity', desc: 'Define the variance percentage that triggers critical system alerts.', vals: ['Low', 'Medium', 'High'], current: 1 },
    { id: 'freq', label: 'Automated Reporting Frequency', desc: 'Frequency of cross-module data synchronization and export.', vals: ['Daily', 'Weekly', 'Monthly'], current: 1 },
    { id: 'ret', label: 'Data Retention Policy', desc: 'Archive duration for longitudinal student metadata.', vals: ['5 Years', '7 Years', '10 Years'], current: 1 }
  ]);

  const cycleSetting = (id) => {
    setSettings(prev => prev.map(s => {
      if (s.id === id) {
        const next = (s.current + 1) % s.vals.length;
        setShowToast(`Updated ${s.label} to ${s.vals[next]}`);
        setTimeout(() => setShowToast(null), 3000);
        return { ...s, current: next };
      }
      return s;
    }));
  };

  const handleResetSettings = () => {
    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setShowToast('Governance parameters reset to default.');
      setTimeout(() => setShowToast(null), 3000);
      setSettings(s => s.map(set => ({ ...set, current: 1 })));
    }, 1500);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast('Analytical governance updated successfully.');
      setTimeout(() => setShowToast(null), 3000);
    }, 2000);
  };

  const handleAction = (name) => {
    setActiveProcessingItem(name);
    setTimeout(() => {
      setActiveProcessingItem(null);
      setPreviewReport(name);
      setShowToast(`${name.toUpperCase()} PROCESSED SUCCESSFULLY`);
      setTimeout(() => setShowToast(null), 3000);
    }, 2500);
  };

  // Metric formatter based on percent toggle
  const formatMetric = (val, type) => {
    if (viewControls.percentages) {
      return `${val}%`;
    }
    if (type === 'efficiency') {
      if (val >= 95) return 'S+ Tier';
      if (val >= 92) return 'A+ Elite';
      return 'A Tier';
    }
    if (type === 'attendance') {
      if (val >= 97) return 'Optimal S';
      if (val >= 95) return 'Optimal A';
      return 'Stable';
    }
    if (type === 'coverage') {
      if (val >= 85) return 'High Velocity';
      if (val >= 80) return 'Velocity A';
      return 'Steady Progress';
    }
    return `${val}%`;
  };

  // Card details data export triggers
  const exportCardData = (title, data) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '-')}-metrics.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowToast(`Exported ${title} JSON`);
    setTimeout(() => setShowToast(null), 3000);
    setActiveDropdown(null);
  };

  const startCalibration = (pt) => {
    setCalibrationPoint(pt);
    setCalibrationProgress(0);
    
    const interval = setInterval(() => {
      setCalibrationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCalibrationPoint(null);
            setShowToast(`CALIBRATION COMPLETED FOR ${pt.month.toUpperCase()}`);
            setTimeout(() => setShowToast(null), 3000);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleSubjectClick = (name) => {
    const subjectData = {
      Mathematics: { name: 'Mathematics', val: 92, activeStudents: 480, avg: 'A', syllabus: '94%', trend: '+3.2%', instructor: 'Dr. Elizabeth Thorne', milestone: 'Algebraic Structures & Vector Calculus' },
      Physics: { name: 'Physics', val: 84, activeStudents: 420, avg: 'B+', syllabus: '81%', trend: '+8.4%', instructor: 'Prof. Marcus Vance', milestone: 'Electromagnetism & Quantum Mechanics' },
      History: { name: 'History', val: 76, activeStudents: 550, avg: 'B', syllabus: '78%', trend: '+1.5%', instructor: 'Sunita Rao, M.A.', milestone: 'Modern Geopolitics & Global Treaties' }
    };
    setSelectedSubject(subjectData[name]);
    setSubjectDifficulty(50);
    setShowSubjectCert(false);
  };

  const runSubjectAudit = () => {
    setSubjectAuditProgress(0);
    const interval = setInterval(() => {
      setSubjectAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSubjectAuditProgress(null);
            setShowSubjectCert(true);
            setShowToast(`Syllabus Audit Certified`);
            setTimeout(() => setShowToast(null), 3000);
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const downloadSubjectCert = (subject) => {
    const certText = `--------------------------------------------------
EDUPRO ELITE ACADEMY ACADEMIC VAULT CERTIFICATE
--------------------------------------------------
Subject: ${subject.name}
Instructor: ${subject.instructor}
Mastery Rating: ${subject.val}% (Syllabus: ${subject.syllabus})
Friction Index: ${subjectDifficulty}%
Verification Token: AUTH-CERT-${subject.name.toUpperCase().substring(0, 3)}-2026

Certified syllabus status: COMPLIANT and audited at maximum efficiency.
Generated on: ${new Date().toLocaleString()}
--------------------------------------------------`;
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(certText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${subject.name.toLowerCase()}-audit-certificate.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const runComplianceSweep = () => {
    setSweepState('running');
    setComplianceProgress(0);
    setComplianceLogs([]);
    
    const steps = [
      { p: 10, m: '[SEC] Initiating compliance vault sweep...' },
      { p: 25, m: '[AUTH] Handshaking with FERPA ledger verification hooks... OK' },
      { p: 45, m: '[DATA] Running student PII record metadata validation... PASS' },
      { p: 65, m: '[NEURAL] Checking predictive weight coefficients against model boundaries... VERIFIED' },
      { p: 85, m: '[NETWORK] Validating TLS 1.3 encryption layers and key rotations... EXCELLENT' },
      { p: 100, m: '[SYSTEM] Audit Complete. Status: 100% Secure & Compliant.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setComplianceProgress(step.p);
        setComplianceLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${step.m}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        setSweepState('completed');
        setShowToast('Vault Security Check Succeeded');
        setTimeout(() => setShowToast(null), 3000);
      }
    }, 400);
  };

  const downloadComplianceReport = () => {
    const reportContent = `==================================================
EDUPRO ELITE VAULT CRYPTOGRAPHIC INTEGRITY REPORT
==================================================
Timestamp: ${new Date().toLocaleString()}
Compliance Score: 99.8%
Vault Status: OPTIMAL / EXCELLENT
Authorized Signature Key: 0xFD49EA3C872D1E04B76C12A09B

Log Entries:
${complianceLogs.join('\n')}

All compliance and longitudinal privacy protocols are verified active.
==================================================`;
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(reportContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "compliance-vault-signature.key");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadMasterLedger = () => {
    const logContent = auditLogs.map(l => `[${l.time}] [${l.level}] ${l.msg}`).join('\n');
    const header = `==================================================
EDUPRO ELITE SYSTEM MASTER AUDIT LEDGER
==================================================
Export Time: ${new Date().toLocaleString()}
Records Scoped: ${auditLogs.length} entries
--------------------------------------------------\n`;
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(header + logContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "master-audit-ledger.log");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowToast('Master Audit Ledger Exported');
    setTimeout(() => setShowToast(null), 3000);
  };

  const mainStats = [
    { id: 'efficiency', label: 'Overall Efficiency', val: formatMetric(mainStatsData.efficiency, 'efficiency'), trend: '+4.1%', color: '#6366f1', icon: Target, desc: 'Institutional aggregate' },
    { id: 'attendance', label: 'Attendance Velocity', val: formatMetric(mainStatsData.attendance, 'attendance'), trend: '+0.2%', color: '#10b981', icon: Activity, desc: 'Daily cohort average' },
    { id: 'coverage', label: 'Syllabus Coverage', val: formatMetric(mainStatsData.coverage, 'coverage'), trend: '+12.5%', color: '#f59e0b', icon: BookOpen, desc: 'Curriculum progression' }
  ];

  const heatmapStyle = viewControls.heatmaps ? { boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' } : {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-body)', padding: '40px', position: 'relative' }}>
      
      {/* Action Preparation Modal */}
      <AnimatePresence>
        {activeProcessingItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '40px', borderRadius: '40px', width: '400px', maxWidth: '100%', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}
            >
               <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '4px solid var(--border-color)', borderTopColor: '#6366f1', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><Eye size={32} /></div>
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>Generating Intelligence</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '24px' }}>Compiling <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{activeProcessingItem}</span>...</p>
               <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} style={{ height: '100%', backgroundColor: '#6366f1' }} />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{ position: 'fixed', bottom: '40px', left: '50%', zIndex: 1300, backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', padding: '16px 32px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-xl)', fontWeight: 800, fontSize: '0.9rem', border: '1px solid var(--border-color)' }}
          >
            <ShieldCheck size={18} color="#10b981" />
            {showToast.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 10 }}>
         <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', color: '#6366f1', borderRadius: '40px', fontSize: '0.8rem', fontWeight: 950, letterSpacing: '1px', marginBottom: '24px' }}>
               <ShieldCheck size={14} /> INSTITUTIONAL INTELLIGENCE CORE v3.0
            </div>
            {viewControls.liveSync && (
               <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#10b98115', color: '#10b981', borderRadius: '40px', fontSize: '0.75rem', fontWeight: 900, marginLeft: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                  LIVE FEED COHORT BROADCAST ACTIVE
               </div>
            )}
            <h1 style={{ fontSize: '4.2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-4px', lineHeight: 0.9, marginBottom: '16px' }}>
               Student <span style={{ color: '#6366f1' }}>Core</span> Analytics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px' }}>Multi-layered analytical engine for academic monitoring and outcome modeling.</p>
         </div>
         <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-card)', padding: '6px', borderRadius: '18px', border: '1px solid var(--border-color)' }}>
               {['Overview', 'Reports', 'Settings'].map(t => (
                  <button key={t} onClick={() => setActiveSegment(t.toLowerCase())} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', backgroundColor: activeSegment === t.toLowerCase() ? 'var(--text-main)' : 'transparent', color: activeSegment === t.toLowerCase() ? 'var(--bg-card)' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.3s' }}>{t}</button>
               ))}
            </div>
         </div>
      </div>

      {/* Content Rendering */}
      <AnimatePresence mode="wait">
        {activeSegment === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
             
             {/* Left Column: Stats & Graphs */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', gridColumn: 'span 2' }}>
                
                {/* 3 Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                   {mainStats.map((s, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ y: -8, boxShadow: viewControls.heatmaps ? '0 12px 30px rgba(99, 102, 241, 0.2)' : 'var(--shadow-md)' }} 
                        style={{ 
                          backgroundColor: 'var(--bg-card)', 
                          padding: '40px', 
                          borderRadius: '48px', 
                          border: viewControls.heatmaps ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)', 
                          position: 'relative', 
                          overflow: 'hidden',
                          boxShadow: viewControls.heatmaps ? '0 8px 24px rgba(99, 102, 241, 0.08)' : 'none',
                          transition: 'border 0.3s, box-shadow 0.3s'
                        }}
                      >
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '20px', backgroundColor: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={28} /></div>
                            <div style={{ padding: '6px 12px', borderRadius: '12px', backgroundColor: '#10b98115', color: '#10b981', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> {s.trend}</div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>{s.label}</div>
                            <div style={{ fontSize: '3.2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-3px', lineHeight: 1 }}>{s.val}</div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '16px' }}>{s.desc}</p>
                         </div>
                         <div style={{ position: 'absolute', bottom: 0, left: 0, height: '6px', width: '100%', backgroundColor: 'var(--border-color)' }} />
                         <motion.div initial={{ width: 0 }} animate={{ width: `${parseFloat(mainStatsData[s.id])}%` }} transition={{ duration: 1.5, delay: 0.5 }} style={{ position: 'absolute', bottom: 0, left: 0, height: '6px', backgroundColor: s.color }} />
                      </motion.div>
                   ))}
                </div>

                {/* Graph Card */}
                 <ProCard 
                   title="Institutional Mastery Curve" 
                   icon={LineChart} 
                   color="#6366f1"
                   onMoreClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'mastery' ? null : 'mastery'); }}
                   style={viewControls.heatmaps ? { boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' } : {}}
                 >
                   {/* Card Action Dropdown Menu */}
                   <AnimatePresence>
                      {activeDropdown === 'mastery' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          style={{ position: 'absolute', right: '32px', top: '72px', zIndex: 120, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '8px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '4px' }}
                        >
                           <button onClick={(e) => { e.stopPropagation(); startCalibration(graphPoints[4]); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Calibrate May Core</button>
                           <button onClick={(e) => { e.stopPropagation(); exportCardData('Mastery Curve', graphPoints); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Export Data (JSON)</button>
                           <button onClick={(e) => { e.stopPropagation(); setShowToast('Refreshed Mastery Nodes'); setTimeout(() => setShowToast(null), 3000); setActiveDropdown(null); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Refresh Indices</button>
                        </motion.div>
                      )}
                   </AnimatePresence>

                   <div style={{ height: '350px', width: '100%', position: 'relative', paddingLeft: '45px', boxSizing: 'border-box' }}>
                       
                       {/* Aligned Grid Lines & SVG Container */}
                       <div style={{ position: 'relative', width: '100%', height: '300px' }}>
                          
                          {/* Y-Axis Grid Lines */}
                          {[0, 25, 50, 75, 100].map(grid => (
                            <div 
                              key={grid} 
                              style={{ 
                                position: 'absolute', 
                                left: 0, 
                                right: 0, 
                                bottom: `${grid}%`, 
                                borderTop: '1px dashed var(--border-color)',
                                zIndex: 0
                              }}
                            >
                              <span style={{ position: 'absolute', left: '-40px', top: '-10px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>{grid}%</span>
                            </div>
                          ))}

                          {/* SVG Plotting Curves */}
                          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                            <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                              <defs>
                                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              
                              {/* Filled Gradient Area Path */}
                              <motion.path 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ duration: 1.5 }} 
                                d="M 0 240 C 80 210, 100 190, 167 180 C 230 170, 270 210, 333 200 C 400 190, 430 140, 500 120 C 570 100, 600 90, 667 80 C 730 70, 770 40, 833 30 C 900 20, 930 10, 1000 0 L 1000 300 L 0 300 Z" 
                                fill="url(#curveGradient)" 
                              />
                              
                              {/* Main Stroked Pacing Line Path */}
                              <motion.path 
                                initial={{ pathLength: 0 }} 
                                animate={{ pathLength: 1 }} 
                                transition={{ duration: 2.5, ease: 'easeInOut' }} 
                                d="M 0 240 C 80 210, 100 190, 167 180 C 230 170, 270 210, 333 200 C 400 190, 430 140, 500 120 C 570 100, 600 90, 667 80 C 730 70, 770 40, 833 30 C 900 20, 930 10, 1000 0" 
                                fill="none" 
                                stroke="#6366f1" 
                                strokeWidth="5" 
                                strokeLinecap="round" 
                                style={viewControls.heatmaps ? { filter: 'drop-shadow(0px 8px 16px rgba(99, 102, 241, 0.4))' } : {}}
                              />
                              
                              {/* 7 Monthly Plot Markers */}
                              {graphPoints.map((pt, i) => (
                                <g key={i}>
                                  {/* Transparent larger circle for easy hover targeting */}
                                  <circle 
                                    cx={pt.x} 
                                    cy={pt.y} 
                                    r="20" 
                                    fill="transparent" 
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredPoint(pt)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    onClick={() => setSelectedPoint(pt)}
                                  />
                                  <motion.circle 
                                    initial={{ r: 0 }} 
                                    animate={{ r: (hoveredPoint?.month === pt.month || selectedPoint?.month === pt.month) ? 12 : 8 }} 
                                    transition={{ duration: 0.2 }} 
                                    cx={pt.x} 
                                    cy={pt.y} 
                                    fill={(hoveredPoint?.month === pt.month || selectedPoint?.month === pt.month) ? '#6366f1' : 'var(--bg-card)'} 
                                    stroke="#6366f1" 
                                    strokeWidth="4" 
                                    style={{ cursor: 'pointer' }}
                                  />
                                </g>
                              ))}
                            </svg>
                          </div>

                          {/* Floating HTML Graph Tooltip */}
                          <AnimatePresence>
                             {hoveredPoint && (
                                <motion.div 
                                   initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                   style={{ 
                                      position: 'absolute', 
                                      left: `calc(${(hoveredPoint.x / 10)}% - 90px)`, 
                                      bottom: `calc(${(300 - hoveredPoint.y) / 3}% + 15px)`, 
                                      zIndex: 100, 
                                      backgroundColor: 'var(--bg-card)', 
                                      border: '2px solid #6366f1', 
                                      borderRadius: '20px', 
                                      padding: '16px', 
                                      width: '180px', 
                                      boxShadow: 'var(--shadow-xl)', 
                                      pointerEvents: 'none',
                                      backdropFilter: 'blur(10px)',
                                   }}
                                >
                                   <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>{hoveredPoint.month} 2026</div>
                                   <div style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                                      {hoveredPoint.val}%
                                      <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#10b981' }}>Core Mastery</span>
                                   </div>
                                   <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Cohort: <strong style={{ color: 'var(--text-main)' }}>{hoveredPoint.active}</strong></div>
                                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>Avg Grade: <strong style={{ color: 'var(--text-main)' }}>{hoveredPoint.avg}</strong></div>
                                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.2 }}>{hoveredPoint.status}</div>
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>

                       </div>

                       {/* Center Aligned X-Axis Month Labels */}
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', position: 'relative' }}>
                         {graphPoints.map(pt => (
                           <span 
                             key={pt.month} 
                             onClick={() => setSelectedPoint(pt)}
                             style={{ 
                               fontSize: '0.75rem', 
                               fontWeight: selectedPoint?.month === pt.month ? 950 : 700, 
                               color: selectedPoint?.month === pt.month ? '#6366f1' : 'var(--text-muted)', 
                               width: '40px', 
                               textAlign: 'center', 
                               display: 'inline-block',
                               cursor: 'pointer',
                               transition: '0.2s'
                             }}
                           >
                              {pt.month}
                           </span>
                         ))}
                       </div>

                   </div>

                   {/* Point Selection Detail Panel */}
                   {selectedPoint && (
                      <motion.div 
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: 'auto' }}
                         exit={{ opacity: 0, height: 0 }}
                         style={{ marginTop: '32px', padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)' }}
                      >
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                               <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Activity size={16} color="#6366f1" /> Mastery Core Calibrations — {selectedPoint.month} 2026
                               </h4>
                               <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                  Active Cohort Milestone: <strong style={{ color: 'var(--text-main)' }}>{selectedPoint.milestone}</strong> | Target vector status is <span style={{ color: '#10b981', fontWeight: 800 }}>{selectedPoint.status}</span>.
                               </p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                               <button 
                                  onClick={() => startCalibration(selectedPoint)}
                                  disabled={calibrationPoint !== null}
                                  style={{ padding: '10px 18px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 850, fontSize: '0.8rem', cursor: calibrationPoint ? 'default' : 'pointer', transition: '0.3s' }}
                               >
                                  {calibrationPoint?.month === selectedPoint.month ? 'Calibrating...' : 'Tune Predictive Vectors'}
                               </button>
                               <button 
                                  onClick={() => setSelectedPoint(null)}
                                  style={{ width: '38px', height: '38px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                               >
                                  <X size={16} />
                               </button>
                            </div>
                         </div>
                         
                         {calibrationPoint?.month === selectedPoint.month && (
                            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid #6366f1' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={14} className="animate-pulse" /> OPTIMIZING WEIGHT COEFFICIENTS...</span>
                                  <span>{calibrationProgress}%</span>
                                </div>
                               <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-body)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <motion.div style={{ width: `${calibrationProgress}%`, height: '100%', backgroundColor: '#6366f1' }} />
                               </div>
                            </div>
                         )}
                      </motion.div>
                   )}

                   <div style={{ marginTop: '40px', display: 'flex', gap: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '32px', height: '4px', borderRadius: '2px', backgroundColor: '#6366f1' }} /><span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>Projected Mastery Curve</span></div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}><TrendingUp size={16} color="#10b981" /><span style={{ fontSize: '0.65rem', fontWeight: 950, color: '#10b981', letterSpacing: '1px' }}>INSTITUTIONAL EFFICIENCY +12.4%</span></div>
                   </div>
                 </ProCard>

                 {/* Sub distributions */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                    <ProCard 
                      title="Subject Distribution" 
                      icon={Layers} 
                      color="#f59e0b"
                      onMoreClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'subjects' ? null : 'subjects'); }}
                      style={viewControls.heatmaps ? { boxShadow: '0 20px 40px rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' } : {}}
                    >
                       <AnimatePresence>
                          {activeDropdown === 'subjects' && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              style={{ position: 'absolute', right: '32px', top: '72px', zIndex: 120, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '8px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '4px' }}
                            >
                               <button onClick={(e) => { e.stopPropagation(); handleSubjectClick('Mathematics'); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Open Mathematics Drawer</button>
                               <button onClick={(e) => { e.stopPropagation(); exportCardData('Subject Distribution', { Mathematics: 92, Physics: 84, History: 76 }); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Export Data (JSON)</button>
                            </motion.div>
                          )}
                       </AnimatePresence>

                       <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {['Mathematics', 'Physics', 'History'].map((sub, i) => {
                             const vals = [92, 84, 76];
                             return (
                                <div 
                                   key={i} 
                                   onClick={() => handleSubjectClick(sub)}
                                   style={{ 
                                      padding: '20px', 
                                      borderRadius: '20px', 
                                      backgroundColor: 'var(--bg-body)', 
                                      border: '1px solid var(--border-color)', 
                                      display: 'flex', 
                                      justifyContent: 'space-between', 
                                      alignItems: 'center',
                                      cursor: 'pointer',
                                      transition: '0.2s'
                                   }}
                                   onMouseOver={(e) => e.currentTarget.style.border = '1px solid #6366f1'}
                                   onMouseOut={(e) => e.currentTarget.style.border = '1px solid var(--border-color)'}
                                >
                                   <span style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}><BookOpen size={16} color="#f59e0b" /> {sub}</span>
                                   <span style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--text-main)' }}>{vals[i]}%</span>
                                </div>
                             );
                          })}
                       </div>
                    </ProCard>

                    <ProCard 
                      title="Security & Compliance" 
                      icon={Fingerprint} 
                      color="#10b981"
                      onMoreClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'compliance' ? null : 'compliance'); }}
                      style={{ 
                         cursor: 'pointer',
                         ...(viewControls.heatmaps ? { boxShadow: '0 20px 40px rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' } : {})
                      }}
                    >
                       <AnimatePresence>
                          {activeDropdown === 'compliance' && (
                            <motion.div 
                              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                              style={{ position: 'absolute', right: '32px', top: '72px', zIndex: 120, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '8px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '4px' }}
                            >
                               <button onClick={(e) => { e.stopPropagation(); setShowComplianceSweep(true); runComplianceSweep(); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Initiate Vault Sweep</button>
                               <button onClick={(e) => { e.stopPropagation(); exportCardData('Security Verification', { complianceRating: '99.8%', securityAudit: 'Class S' }); }} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Export Key Token (JSON)</button>
                            </motion.div>
                          )}
                       </AnimatePresence>

                       <div 
                          onClick={() => { setShowComplianceSweep(true); runComplianceSweep(); }}
                          style={{ textAlign: 'center', padding: '10px 0' }}
                       >
                          <div style={{ fontSize: '3.5rem', fontWeight: 950, color: '#10b981', marginBottom: '8px', letterSpacing: '-2px' }}>99.8%</div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.4 }}>Institutional compliance vector is currently within optimal parameters. Click to sweep.</p>
                       </div>
                    </ProCard>
                 </div>
              </div>

              {/* Right Column: Alerts & Settings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                 
                 {/* Alerts Box */}
                 <div style={{ backgroundColor: '#0f172a', borderRadius: '40px', padding: '40px', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}><Bell size={24} color="#a5b4fc" /> Alerts</h3>
                       <div style={{ padding: '6px 12px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 900 }}>3 ACTION REQUIRED</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                       {[
                         { type: 'Critical', msg: 'Grade 12 Physics regression detected.', time: '2m ago' },
                         { type: 'Update', msg: 'System recalibrated with new math weights.', time: '14m ago' },
                         { type: 'Success', msg: 'Institutional pass rate target reached.', time: '1h ago' }
                       ].map((alert, i) => (
                         <div key={i} style={{ padding: '20px', borderRadius: '24px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: alert.type === 'Critical' ? '#ef4444' : '#a5b4fc', marginBottom: '8px' }}>{alert.type.toUpperCase()}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', lineHeight: 1.4 }}>{alert.msg}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginTop: '8px' }}>{alert.time}</div>
                         </div>
                       ))}
                    </div>
                    <button 
                       onClick={() => setShowAuditConsole(true)} 
                       style={{ width: '100%', marginTop: '32px', padding: '18px', borderRadius: '18px', backgroundColor: '#6366f1', color: 'white', border: 'none', fontWeight: 950, cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)', transition: '0.3s' }}
                       onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                       onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
                    >
                       Audit Dashboard Console
                    </button>
                 </div>

                 {/* Switch Controls */}
                 <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', padding: '40px', border: '1px solid var(--border-color)', ...heatmapStyle }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><Settings size={20} /> View Controls</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       {[
                         { key: 'heatmaps', label: 'Display Heatmaps' },
                         { key: 'percentages', label: 'Show Percentages' },
                         { key: 'liveSync', label: 'Live Sync Data' }
                       ].map((opt, i) => (
                         <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{opt.label}</span>
                            <button 
                               onClick={() => {
                                  setViewControls(prev => ({ ...prev, [opt.key]: !prev[opt.key] }));
                                  setShowToast(`Toggled ${opt.label}`);
                                  setTimeout(() => setShowToast(null), 3000);
                               }}
                               style={{ 
                                  width: '50px', 
                                  height: '26px', 
                                  borderRadius: '13px', 
                                  backgroundColor: viewControls[opt.key] ? '#6366f1' : 'var(--border-color)', 
                                  position: 'relative', 
                                  border: 'none', 
                                  cursor: 'pointer',
                                  transition: '0.3s'
                               }}
                            >
                               <motion.div 
                                  layout
                                  transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                  style={{ 
                                     width: '18px', 
                                     height: '18px', 
                                     borderRadius: '50%', 
                                     backgroundColor: 'white', 
                                     position: 'absolute', 
                                     top: '4px', 
                                     left: viewControls[opt.key] ? 'auto' : '4px',
                                     right: viewControls[opt.key] ? '4px' : 'auto' 
                                  }} 
                               />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

           </motion.div>
        )}

        {activeSegment === 'reports' && (
          <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
             {[
               { title: 'Academic Performance Audit', desc: 'Comprehensive multi-subject efficacy and grade distribution analysis.', date: 'May 12, 2026', type: 'PDF / XLSX' },
               { title: 'Student Behavioral Metrics', desc: 'Disciplinary trends and extracurricular engagement correlation study.', date: 'May 10, 2026', type: 'PDF' },
               { title: 'Cohort Attendance Summary', desc: 'Longitudinal absenteeism tracking and parent engagement reports.', date: 'May 08, 2026', type: 'XLSX' },
               { title: 'Institutional Growth Matrix', desc: 'Annual comparison of academic outcomes and resource utilization.', date: 'May 05, 2026', type: 'PDF / JSON' }
             ].map((rep, i) => (
               <motion.div key={i} whileHover={{ scale: 1.02 }} style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '40px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Download size={20} /></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)' }}>{rep.type}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '8px' }}>{rep.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>{rep.desc}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>Generated on {rep.date}</span>
                    <button onClick={() => handleAction(rep.title)} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-card)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>View Intelligence</button>
                  </div>
               </motion.div>
             ))}
          </motion.div>
        )}

        {activeSegment === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ backgroundColor: 'var(--bg-card)', padding: '60px', borderRadius: '60px', border: '1px solid var(--border-color)' }}>
             <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: '48px' }}>
                  <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', marginBottom: '12px' }}>Analytical Governance</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>Configure the core parameters of the Student Intelligence Engine.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   {settings.map((set, i) => (
                     <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px', borderRadius: '24px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>{set.label}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{set.desc}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
                           <span style={{ fontWeight: 950, color: '#6366f1', fontSize: '1rem', width: '80px', textAlign: 'right' }}>{set.vals[set.current]}</span>
                           <button onClick={() => cycleSetting(set.id)} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--bg-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}><ChevronRight size={20} /></button>
                        </div>
                     </div>
                   ))}
                </div>
                <div style={{ marginTop: '48px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                   <button onClick={handleSaveSettings} disabled={isSaving} style={{ flex: 1.5, padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: isSaving ? 'var(--text-muted)' : 'var(--text-main)', color: 'var(--bg-card)', fontWeight: 950, fontSize: '1rem', cursor: isSaving ? 'default' : 'pointer', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                     {isSaving ? 'PERSISTING CONFIG...' : 'Save Configurations'}
                   </button>
                   <button onClick={handleResetSettings} disabled={isResetting || isSaving} style={{ flex: 1, padding: '20px 40px', borderRadius: '20px', border: '2px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', fontWeight: 800, fontSize: '1rem', cursor: (isResetting || isSaving) ? 'default' : 'pointer' }}>
                     {isResetting ? 'RESETTING...' : 'Reset to Default'}
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Report Preview Modal */}
      <AnimatePresence>
        {previewReport && (() => {
           const repData = (() => {
              if (previewReport === 'Academic Performance Audit') {
                return {
                  id: '#SR-2026-104', type: 'Cohort Analysis', vault: 'Student Core Telemetry',
                  headers: ['SUBJECT', 'ENROLLMENT', 'MASTERY RATING', 'PROGRESS STAGE'],
                  rows: [
                    { c1: 'Mathematics Core', c2: '480 Students', c3: '92.4%', c4: 'Stable' },
                    { c1: 'Quantum Physics', c2: '420 Students', c3: '84.5%', c4: 'Optimal' },
                    { c1: 'World History', c2: '550 Students', c3: '76.8%', c4: 'Optimal' },
                    { c1: 'Aggregate Average', c2: '1,450 Cohort', c3: '84.5%', c4: 'Steady Progress' }
                  ]
                };
              }
              if (previewReport === 'Student Behavioral Metrics') {
                return {
                  id: '#SR-2026-118', type: 'Extracurricular Engagement', vault: 'Privacy Shield v2',
                  headers: ['METRIC VECTOR', 'ENGAGEMENT VECTOR', 'INCIDENTS LOGGED', 'STATUS VECTOR'],
                  rows: [
                    { c1: 'Extracurricular Inclusions', c2: '89.4% Participation', c3: '0 incidents', c4: 'Stable' },
                    { c1: 'Disciplinary Auditing', c2: 'Optimal Compliance', c3: '1 deviation', c4: 'Audited' },
                    { c1: 'Peer-to-Peer Collaborations', c2: '94.2% Strength', c3: '0 incidents', c4: 'Optimal' },
                    { c1: 'Longitudinal Engagement', c2: 'High Velocity', c3: '0 anomalies', c4: 'S-Class' }
                  ]
                };
              }
              if (previewReport === 'Cohort Attendance Summary') {
                return {
                  id: '#SR-2026-125', type: 'Daily Cohort Velocity', vault: 'Parent Link Sync',
                  headers: ['GRADE COHORT', 'TOTAL REGISTRY', 'DAILY VELOCITY', 'STATUS RATING'],
                  rows: [
                    { c1: 'Grade 10 Academy', c2: '360 Students', c3: '96.2% Attendance', c4: 'Optimal' },
                    { c1: 'Grade 11 Academy', c2: '440 Students', c3: '95.8% Attendance', c4: 'Stable' },
                    { c1: 'Grade 12 Academy', c2: '650 Students', c3: '98.2% Attendance', c4: 'Optimal S' },
                    { c1: 'Overall Average', c2: '1,450 Registry', c3: '96.8% Aggregate', c4: 'Optimal' }
                  ]
                };
              }
              return {
                id: '#SR-2026-140', type: 'Annual Vector Delta', vault: 'Treasury Verification',
                headers: ['COMPARISON COHORT', 'EFFICIENCY INDEX', 'ENROLLMENT DELTA', 'BUDGET VALUE'],
                rows: [
                  { c1: 'FY24 Architecture', c2: '88.2% Efficiency', c3: 'Base registry', c4: 'Compliant' },
                  { c1: 'FY25 Acceleration', c2: '90.5% Efficiency', c3: '+124 Net Gain', c4: 'Optimal' },
                  { c1: 'FY26 Core Telemetry', c2: '92.4% Efficiency', c3: '+188 Net Gain', c4: 'Optimal S' },
                  { c1: 'Longitudinal Variance', c2: '+4.2% Growth', c3: '+312 Net Gain', c4: 'Excellent' }
                ]
              };
           })();

           return (
              <div 
                style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}
              >
                 <motion.div 
                   initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
                   style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '1200px', borderRadius: '48px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', margin: 'auto' }}
                 >
                    <div style={{ padding: '32px 48px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body)', flexWrap: 'wrap', gap: '16px' }}>
                       <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                             <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} /></div>
                             <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-1px' }}>{previewReport}</h2>
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Institutional Audit Copy • Generated {new Date().toLocaleDateString()}</p>
                       </div>
                       <div style={{ display: 'flex', gap: '16px' }}>
                          <button 
                            onClick={() => window.print()}
                            style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--text-main)', color: 'var(--bg-card)', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                          >
                            <Download size={18} /> Export PDF
                          </button>
                          <button onClick={() => setPreviewReport(null)} style={{ width: '56px', height: '56px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}><X size={24} /></button>
                       </div>
                    </div>
                    <div style={{ flex: 1, padding: '48px', overflowY: 'auto', backgroundColor: 'var(--bg-body)' }}>
                       <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-card)', padding: '60px', borderRadius: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
                          <div style={{ borderBottom: '2px solid var(--text-main)', paddingBottom: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
                             <div>
                                <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)' }}>EDUPRO ELITE ACADEMY</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Institutional Excellence Since 2024</div>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)' }}>REPORT ID: {repData.id}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{new Date().toLocaleString()}</div>
                             </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '48px' }}>
                             <div style={{ backgroundColor: 'var(--bg-body)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{repData.type}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--text-main)' }}>Student Core Telemetry</div>
                             </div>
                             <div style={{ backgroundColor: 'var(--bg-body)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Security Rating</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--text-main)' }}>{repData.vault}</div>
                             </div>
                          </div>

                          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '48px' }}>
                             <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                   {repData.headers.map((h, idx) => (
                                      <th key={idx} style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>{h}</th>
                                   ))}
                                </tr>
                             </thead>
                             <tbody>
                                {repData.rows.map((row, i) => (
                                   <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                      <td style={{ padding: '20px 0', fontWeight: 800, color: 'var(--text-main)' }}>{row.c1}</td>
                                      <td style={{ padding: '20px 0', fontWeight: 700, color: 'var(--text-main)' }}>{row.c2}</td>
                                      <td style={{ padding: '20px 0', fontWeight: 700, color: '#6366f1' }}>{row.c3}</td>
                                      <td style={{ padding: '20px 0' }}>
                                         <span style={{ padding: '4px 12px', borderRadius: '10px', backgroundColor: '#10b98115', color: '#10b981', fontSize: '0.7rem', fontWeight: 900 }}>{row.c4.toUpperCase()}</span>
                                      </td>
                                    </tr>
                                ))}
                             </tbody>
                          </table>

                          <div style={{ backgroundColor: 'var(--text-main)', padding: '32px', borderRadius: '24px', color: 'var(--bg-card)' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <ShieldCheck size={20} color="#10b981" />
                                <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--bg-card)' }}>ANALYTICAL SIGN-OFF</span>
                             </div>
                             <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--bg-body)', opacity: 0.8, lineHeight: 1.6, fontWeight: 500 }}>
                                Institutional student core telemetry indicates high velocity across all academic vectors. All metrics have been validated against the institutional intelligence core.
                             </p>
                          </div>
                       </div>
                    </div>
                    <div style={{ padding: '24px 48px', backgroundColor: 'var(--bg-body)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                       <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONFIDENTIAL STUDENT INTELLIGENCE REPORT • EDUPRO ELITE v3.0</p>
                    </div>
                 </motion.div>
              </div>
           );
        })()}
      </AnimatePresence>

      {/* Subject Efficacy Deep Dive Drawer */}
      <AnimatePresence>
        {selectedSubject && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1800, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setSelectedSubject(null)}
          >
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               onClick={(e) => e.stopPropagation()}
               style={{ backgroundColor: 'var(--bg-card)', width: '500px', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '40px' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={20} /></div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>{selectedSubject.name}</h3>
                   </div>
                   <button onClick={() => setSelectedSubject(null)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '8px' }}>
                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>COURSE LEADER</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)' }}>{selectedSubject.instructor}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>AI Efficacy Advisor Accredited</div>
                   </div>

                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Coursework Friction (Difficulty)</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: 950, color: '#f59e0b' }}>{subjectDifficulty}%</span>
                      </div>
                      <input 
                         type="range" min="10" max="100" value={subjectDifficulty} 
                         onChange={(e) => setSubjectDifficulty(parseInt(e.target.value))}
                         style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer', height: '6px', borderRadius: '3px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '6px' }}>
                         <span>Low Latency</span>
                         <span>Hyper Friction</span>
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>EXPECTED MASTERY</div>
                         <div style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-main)' }}>
                            {Math.round(selectedSubject.val - (subjectDifficulty - 50) * 0.2)}%
                         </div>
                         <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, marginTop: '4px' }}>Real-time projected outcome</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>SYLLABUS PROGRESSION</div>
                         <div style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-main)' }}>
                            {Math.round(parseFloat(selectedSubject.syllabus) - (subjectDifficulty - 50) * 0.1)}%
                         </div>
                         <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 800, marginTop: '4px' }}>Active curriculum velocity</div>
                      </div>
                   </div>

                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>SYLLABUS FOCUS POINT</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.4 }}>{selectedSubject.milestone}</div>
                   </div>

                   <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                      {subjectAuditProgress === null ? (
                         <button 
                            onClick={runSubjectAudit}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#f59e0b', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                         >
                            <Scan size={18} /> Run Neural Syllabus Audit
                         </button>
                      ) : (
                         <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid #f59e0b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>
                               <span>ANALYZING COURSEWORK COMPLIANCE...</span>
                               <span>{subjectAuditProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                               <div style={{ width: `${subjectAuditProgress}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                            </div>
                         </div>
                      )}

                      {showSubjectCert && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', padding: '16px', backgroundColor: '#10b98115', border: '1px solid #10b981', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>SYLLABUS CERTIFIED COMPLIANT</div>
                               <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Validated against EduPro Core v3.0</div>
                            </div>
                            <button 
                               onClick={() => downloadSubjectCert(selectedSubject)}
                               style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                               Export Cert
                            </button>
                         </motion.div>
                      )}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compliance Vault Sweep Terminal Overlay */}
      <AnimatePresence>
        {showComplianceSweep && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', zIndex: 1900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               style={{ backgroundColor: '#090d16', border: '2px solid #10b981', borderRadius: '32px', width: '600px', maxWidth: '100%', padding: '40px', color: '#10b981', fontFamily: 'monospace', boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', paddingBottom: '20px', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Fingerprint size={24} />
                      <span style={{ fontSize: '1.2rem', fontWeight: 950, letterSpacing: '1px' }}>COMPLIANCE VAULT SWEEP</span>
                   </div>
                   <button 
                      onClick={() => setShowComplianceSweep(false)} 
                      disabled={sweepState === 'running'}
                      style={{ background: 'none', border: '1px solid rgba(16, 185, 129, 0.5)', color: '#10b981', width: '36px', height: '36px', borderRadius: '8px', cursor: sweepState === 'running' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   >
                      X
                   </button>
                </div>

                <div style={{ backgroundColor: '#020408', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '24px', height: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '0.8rem', color: '#34d399' }}>
                   {complianceLogs.length === 0 && <div>[READY] Waiting to initiate system diagnostics...</div>}
                   {complianceLogs.map((log, idx) => (
                      <div key={idx} style={{ lineBreak: 'anywhere' }}>{log}</div>
                   ))}
                   {sweepState === 'running' && <div className="animate-pulse">_</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ width: '60%' }}>
                      {sweepState === 'running' && (
                         <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                               <span>RUNNING SECURE THREAD...</span>
                               <span>{complianceProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                               <div style={{ width: `${complianceProgress}%`, height: '100%', backgroundColor: '#10b981' }} />
                            </div>
                         </div>
                      )}
                      {sweepState === 'completed' && <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>VAULT INTEGRITY PASS [99.8%]</span>}
                   </div>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      {sweepState === 'completed' && (
                         <button 
                            onClick={downloadComplianceReport}
                            style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: '#090d16', fontWeight: 900, cursor: 'pointer', fontSize: '0.8rem' }}
                         >
                            Download Key
                         </button>
                      )}
                      <button 
                         onClick={runComplianceSweep}
                         disabled={sweepState === 'running'}
                         style={{ padding: '12px 20px', borderRadius: '12px', border: sweepState === 'completed' ? '1px solid #10b981' : 'none', backgroundColor: sweepState === 'completed' ? 'transparent' : '#10b981', color: sweepState === 'completed' ? '#10b981' : '#090d16', fontWeight: 900, cursor: sweepState === 'running' ? 'default' : 'pointer', fontSize: '0.8rem' }}
                      >
                         {sweepState === 'completed' ? 'Re-Sweep' : sweepState === 'running' ? 'Scanning...' : 'Start Sweep'}
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Master Audit Console Terminal Overlay */}
      <AnimatePresence>
        {showAuditConsole && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', zIndex: 1900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               style={{ backgroundColor: '#0f172a', border: '1px solid var(--border-color)', borderRadius: '32px', width: '800px', maxWidth: '100%', padding: '40px', color: 'var(--text-main)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', height: '550px' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Terminal size={24} color="#6366f1" />
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 950, margin: 0, letterSpacing: '-0.5px' }}>Institutional Core Audit Ledger</h3>
                   </div>
                   <button onClick={() => setShowAuditConsole(false)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ flex: 1, backgroundColor: '#020408', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8' }}>
                   {auditLogs.map((log, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                         <span style={{ color: '#475569' }}>[{log.time}]</span>
                         <span style={{ color: log.level === 'SYSTEM' ? '#f59e0b' : log.level === 'AUTH' ? '#10b981' : '#6366f1', fontWeight: 'bold' }}>[{log.level}]</span>
                         <span>{log.msg}</span>
                      </div>
                   ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rollingLogsActive ? '#10b981' : '#ef4444', display: 'inline-block' }} />
                      {rollingLogsActive ? 'Broadcasting rolling ledger logs' : 'Logging transmission paused'}
                   </div>
                   <div style={{ display: 'flex', gap: '16px' }}>
                      <button 
                         onClick={() => setRollingLogsActive(!rollingLogsActive)}
                         style={{ padding: '12px 24px', borderRadius: '14px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                         {rollingLogsActive ? 'Pause Broadcast' : 'Resume Broadcast'}
                      </button>
                      <button 
                         onClick={downloadMasterLedger}
                         style={{ padding: '12px 24px', borderRadius: '14px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                         Export Verified Ledger
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentAnalytics;
