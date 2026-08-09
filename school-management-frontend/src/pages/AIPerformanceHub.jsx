/* EduPro Elite - AIPerformanceHub v2.0 (Impact Edition) */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Brain, 
  Target, Users, Zap, ShieldAlert, BarChart3, ChevronRight,
  Download, Activity, CheckCircle2, Search, Filter, Sparkles,
  RefreshCw, MousePointer2, ArrowUpRight, ArrowDownRight,
  FileText, CheckCircle, XCircle, PieChart, Info,
  LayoutDashboard, Network, Microscope, Layers, Bot,
  Fingerprint, Clock, ExternalLink, MoreVertical, ScanSearch, Terminal, Scan,
  Trophy, GraduationCap, Settings2, Sliders, Monitor,
  Rocket, Lightbulb, Command, X, ShieldCheck, Mail, Calendar, UserCheck, Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImpactStat = ({ label, value, trend, icon: Icon, color, onClick }) => (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    onClick={onClick}
    style={{ backgroundColor: 'var(--perf-bg-card, white)', padding: '40px', borderRadius: '48px', border: '1px solid var(--perf-border-color, #edf2f7)', boxShadow: '0 20px 50px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
  >
     <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', backgroundColor: `${color}05`, borderRadius: '50%' }} />
     <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <Icon size={32} />
     </div>
     <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--perf-text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{label}</div>
     <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--perf-text-main, #0f172a)', letterSpacing: '-3px', lineHeight: 1, marginBottom: '16px' }}>{value}</div>
     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: trend.includes('+') ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '1rem' }}>
        {trend.includes('+') ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />} {trend}
        <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>VS PREVIOUS PERIOD</span>
     </div>
  </motion.div>
);

const AIPerformanceHub = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [toast, setToast] = useState(null);

  // Core Modals Visibility States
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [showDeepDiveModal, setShowDeepDiveModal] = useState(false);
  
  // High-fidelity Metrics Modals & Action States
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [showAccuracyModal, setShowAccuracyModal] = useState(false);
  const [showROIModal, setShowROIModal] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [loadingOverlayText, setLoadingOverlayText] = useState('');
  
  // Executive Acknowledgment signatures
  const [insightsState, setInsightsState] = useState('pending'); // 'pending' | 'acknowledged'
  const [insightSignature, setInsightSignature] = useState(null);

  // Deployed parameters & Outcome Forecasting synchronizations
  const [stemStudyHours, setStemStudyHours] = useState(5); 
  const [selectedCohort, setSelectedCohort] = useState('Grade 10 STEM');
  const [forecasts, setForecasts] = useState({ pass: 91, distinction: 34, attrition: 8 });
  const [deployedModelInfo, setDeployedModelInfo] = useState(null);

  // Interactive Systems health parameters
  const [systemHealths, setSystemHealths] = useState({ lms: 98, mess: 100, security: 94, finance: 96 });
  const [isAuditingSystems, setIsAuditingSystems] = useState(false);

  // ML model accuracy & epochs retraining parameters
  const [predictiveAccuracy, setPredictiveAccuracy] = useState(99.2);
  const [epochsTrained, setEpochsTrained] = useState(42);
  const [isTrainingEpoch, setIsTrainingEpoch] = useState(false);
  const [accuracyLogs, setAccuracyLogs] = useState([
    { name: 'Attrition Forecaster', score: 99.1, epoch: 42 },
    { name: 'Grade Compliancy Classifier', score: 98.8, epoch: 42 },
    { name: 'Attendance Alert Predictor', score: 99.4, epoch: 42 },
    { name: 'STEM Decoupled GPA Predictor', score: 99.3, epoch: 42 },
    { name: 'Special Needs Accommodation', score: 99.5, epoch: 42 },
  ]);

  // Intervention ROI staffing parameters
  const [staffHourRate, setStaffHourRate] = useState(45);
  const [roiPercentage, setRoiPercentage] = useState(82.4);

  // Student specific custom workflow variables
  const [counselorSlot, setCounselorSlot] = useState(null);
  const [smsDraft, setSmsDraft] = useState('');
  const [showSmsComposer, setShowSmsComposer] = useState(false);
  
  // Scholarship Nomination certificate variables
  const [scholarshipValue, setScholarshipValue] = useState(5000);
  const [scholarshipCitation, setScholarshipCitation] = useState('Outstanding Academic Aptitude & Conceptual Leadership in STEM Modules');
  const [isNominationSigned, setIsNominationSigned] = useState(false);
  const [nominationPin, setNominationPin] = useState('');
  
  // Congratulations editor variables
  const [congratsDraft, setCongratsDraft] = useState('');
  const [showCongratsComposer, setShowCongratsComposer] = useState(false);

  // Log filtering options
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Briefing Report PDF compiler parameters
  const [showBriefingCompiler, setShowBriefingCompiler] = useState(false);
  const [compilerProgress, setCompilerProgress] = useState(0);
  const [compilerPhase, setCompilerPhase] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const risks = [
    { name: 'Lokesh Roy', score: '42%', risk: 'Critical', grade: 'D-', attendance: '72%', missingTasks: 6, avatar: 'LR', desc: 'Lokesh is exhibiting steep declines in Algebra and homework compliance indexes.' },
    { name: 'Noah Patel', score: '38%', risk: 'Critical', grade: 'F', attendance: '68%', missingTasks: 9, avatar: 'NP', desc: 'Noah has missed consecutive lab modules, leading to credit allocation risks.' },
    { name: 'Ekta Kinger', score: '51%', risk: 'High', grade: 'D+', attendance: '79%', missingTasks: 3, avatar: 'EK', desc: 'Ekta shows moderate signs of conceptual regression in chemistry modules.' }
  ];

  const successes = [
    { name: 'Shalini Mishra', score: '98%', status: 'Elite', grade: 'A+', attendance: '99%', gpa: '3.98', avatar: 'SM', desc: 'Shalini leads the Grade 10 cohort in mathematics research assignments.' },
    { name: 'Divya Joshi', score: '96%', status: 'Elite', grade: 'A', attendance: '98%', gpa: '3.94', avatar: 'DJ', desc: 'Divya exhibits advanced conceptual mastery across biology and physics blocks.' },
    { name: 'Deepak Kumar', score: '94%', status: 'High', grade: 'A-', attendance: '96%', gpa: '3.88', avatar: 'DK', desc: 'Deepak is a strong conceptual contributor in computer science lectures.' }
  ];

  const [auditLogs, setAuditLogs] = useState([
    { time: '10:14:02', event: 'EVALUATION', details: 'AI Model evaluated Grade 10 Algebra marks vectors successfully.' },
    { time: '10:14:05', event: 'PREDICTION', details: 'Lokesh Roy flagged as CRITICAL risk for upcoming exam block.' },
    { time: '10:14:12', event: 'INTERVENTION', details: 'Triggered parental alert protocol for student Noah Patel.' },
    { time: '10:14:24', event: 'INTEGRITY', details: 'PCI DSS secure financial compliance check validated successfully.' },
    { time: '10:14:45', event: 'ACCELERATION', details: 'STEM acceleration program metrics exported to board registers.' }
  ]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Utility file text exporter
  const handleExportText = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Helper log generator
  const addAuditLog = (event, details) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAuditLogs(prev => [
      { time: timeStr, event, details },
      ...prev
    ]);
  };

  // Re-Audit System Health
  const handleReAuditSystems = () => {
    setIsAuditingSystems(true);
    showToast('Executing comprehensive diagnostic sweep across institutional nodes...', 'info');
    setTimeout(() => {
      const newLms = Math.floor(Math.random() * 3) + 97; // 97-99%
      const newMess = 100;
      const newSecurity = Math.floor(Math.random() * 4) + 95; // 95-98%
      const newFinance = Math.floor(Math.random() * 3) + 97; // 97-99%
      setSystemHealths({ lms: newLms, mess: newMess, security: newSecurity, finance: newFinance });
      setIsAuditingSystems(false);
      addAuditLog('INTEGRITY', `System health audit completed. LMS: ${newLms}%, Mess: 100%, Security: ${newSecurity}%, Finance: ${newFinance}%`);
      showToast('System health checks successfully verified! Clean diagnostic logs written.', 'success');
    }, 1500);
  };

  // Retrain AI Model Epochs
  const handleTrainEpoch = () => {
    setIsTrainingEpoch(true);
    showToast('Initializing machine learning retraining cycle (Epoch +1)...', 'info');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setIsTrainingEpoch(false);
        setEpochsTrained(prev => prev + 1);
        const accuracyInc = (Math.random() * 0.05).toFixed(3);
        const nextAcc = Math.min(99.9, parseFloat(predictiveAccuracy) + parseFloat(accuracyInc));
        setPredictiveAccuracy(parseFloat(nextAcc.toFixed(2)));
        
        setAccuracyLogs(prev => prev.map(m => ({
          ...m,
          epoch: m.epoch + 1,
          score: Math.min(99.9, parseFloat((m.score + Math.random() * 0.04).toFixed(1)))
        })));
        
        addAuditLog('EVALUATION', `AI Model retraining epoch completed. Global predictive accuracy adjusted to ${nextAcc.toFixed(2)}%`);
        showToast(`Retraining complete! Predictive accuracy is now ${nextAcc.toFixed(2)}%.`, 'success');
      }
    }, 300);
  };

  // Lock ROI calculator rate
  const handleDeployCostModel = () => {
    showToast(`Staffing parameters successfully locked at $${staffHourRate}/hr.`, 'success');
    const baseRoi = 75;
    const calculatedRoi = Math.min(98.5, baseRoi + (staffHourRate / 10) * 1.5);
    setRoiPercentage(parseFloat(calculatedRoi.toFixed(1)));
    addAuditLog('ACCELERATION', `Deployed staffing cost parameters. Rate: $${staffHourRate}/hr. Projected ROI adjusted to ${calculatedRoi.toFixed(1)}%.`);
    setShowROIModal(false);
  };

  // Narrative Insights authorization
  const handleAcknowledgeInsights = () => {
    const signatureHash = 'SHA-256:' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const timestamp = new Date().toLocaleString();
    setInsightSignature({
      admin: 'Principal Administrator (L2 Secure Auth)',
      time: timestamp,
      hash: signatureHash
    });
    setInsightsState('acknowledged');
    addAuditLog('INTEGRITY', `Executive summary formally acknowledged under hash: ${signatureHash.substring(0,18)}...`);
    showToast('System analytics acknowledged and cryptographically signed!', 'success');
  };

  // Dynamic simulated neural scanner
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    showToast('Initializing institutional neural vectors scan...', 'info');

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            showToast('Neural scan successfully completed! No critical anomalies detected.', 'success');
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setAuditLogs(prevLogs => [
              { time: timeStr, event: 'SCAN_COMPLETE', details: 'Full system neural vectors audit completed. 0 warnings.' },
              ...prevLogs
            ]);
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Briefing compilation triggers
  const handleStartBriefingCompiler = () => {
    setShowBriefingCompiler(true);
    setCompilerProgress(0);
    setCompilerPhase('Extracting institutional stats grids...');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCompilerProgress(progress);
      
      if (progress === 25) {
        setCompilerPhase('Harvesting predictive accuracy logs...');
      } else if (progress === 50) {
        setCompilerPhase('Compiling student intervention records...');
      } else if (progress === 75) {
        setCompilerPhase('Generating secure SHA-256 report verification signatures...');
      } else if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setShowBriefingCompiler(false);
          setShowPrintPreview(true);
          showToast('Institutional Briefing PDF compiled successfully!', 'success');
        }, 400);
      }
    }, 100);
  };

  // Raw plain text logs report exporter
  const handleExportAuditLogs = () => {
    let content = `========================================================\n`;
    content += `          EDUPRO SYSTEM PERFORMANCE AUDIT LEDGER\n`;
    content += `          Generated on: ${new Date().toLocaleString()}\n`;
    content += `========================================================\n\n`;
    content += `[Time]      | [Event Type]     | Details\n`;
    content += `--------------------------------------------------------\n`;
    
    const logsToExport = auditLogs.filter(l => {
      if (logFilter !== 'ALL' && l.event !== logFilter) return false;
      if (logSearchQuery.trim() !== '') {
        return l.details.toLowerCase().includes(logSearchQuery.toLowerCase()) || 
               l.event.toLowerCase().includes(logSearchQuery.toLowerCase());
      }
      return true;
    });

    logsToExport.forEach(l => {
      const time = l.time.padEnd(11, ' ');
      const evt = l.event.padEnd(16, ' ');
      content += `${time} | ${evt} | ${l.details}\n`;
    });
    
    content += `\n--------------------------------------------------------\n`;
    content += `Total Audit Entries Listed: ${logsToExport.length}\n`;
    content += `End of Ledger Report. Secured by EduPro AI.\n`;
    
    handleExportText(content, `edupro-audit-logs-${logFilter.toLowerCase()}.txt`);
    showToast('System audit log text report exported!', 'success');
  };

  // Briefing Report text exporter
  const handleExportBriefingTxt = () => {
    let content = `========================================================\n`;
    content += `       EDUPRO ELITE AI PERFORMANCE & IMPACT BRIEFING\n`;
    content += `       Generated on: ${new Date().toLocaleString()}\n`;
    content += `       Security Access: Principal Administrator Ledger\n`;
    content += `========================================================\n\n`;
    
    content += `1. CORE METRICS OVERVIEW:\n`;
    content += `   - Institutional Health: LMS: ${systemHealths.lms}% | Mess: ${systemHealths.mess}% | Security: ${systemHealths.security}% | Finance: ${systemHealths.finance}%\n`;
    content += `   - AI Predictive Accuracy: ${predictiveAccuracy}%\n`;
    content += `   - Intervention ROI: ${roiPercentage}% (Staffing Rate: $${staffHourRate}/hr)\n\n`;
    
    content += `2. DEPLOYED MODEL PARAMETERS:\n`;
    if (deployedModelInfo) {
      content += `   - Cohort: ${deployedModelInfo.cohort}\n`;
      content += `   - Target Tutoring Hours: ${deployedModelInfo.studyHours} Hours/week\n`;
      content += `   - Expected Pass Certitude: ${deployedModelInfo.passRate}%\n`;
      content += `   - Expected Distinction Rate: ${deployedModelInfo.distRate}%\n`;
      content += `   - Expected Attrition Risk: ${deployedModelInfo.attrRate}%\n\n`;
    } else {
      content += `   - Active Model: Grade 10 STEM Tutoring Model (Default)\n`;
      content += `   - Base Study Hours: 5 Hours/week\n`;
      content += `   - Expected Pass Certitude: ${forecasts.pass}%\n`;
      content += `   - Expected Distinction Rate: ${forecasts.distinction}%\n`;
      content += `   - Expected Attrition Risk: ${forecasts.attrition}%\n\n`;
    }
    
    content += `3. CRITICAL RISK TRIAGE INVENTORY:\n`;
    risks.forEach(r => {
      content += `   - ${r.name} (${r.risk} Risk): Average Grade: ${r.grade}, Missing Tasks: ${r.missingTasks}, Attendance: ${r.attendance}\n`;
    });
    
    content += `\n4. ELITE SUCCESS RECOGNITION ROSTER:\n`;
    successes.forEach(s => {
      content += `   - ${s.name} (${s.status}): Average Grade: ${s.grade}, Active GPA: ${s.gpa}, Attendance: ${s.attendance}\n`;
    });
    
    content += `\n========================================================\n`;
    content += `Secure Verification Code: ${insightSignature ? insightSignature.hash : 'UNSIGNED'}\n`;
    content += `End of Briefing Document.\n`;
    
    handleExportText(content, 'edupro-impact-briefing-report.txt');
    showToast('Briefing report text format downloaded!', 'success');
  };

  // Student details slot scheduling action
  const handleBookCounselor = (studentName) => {
    if (!counselorSlot) {
      showToast('Please select a valid time slot first!', 'info');
      return;
    }
    const selected = timeSlots.find(s => s.id === counselorSlot);
    addAuditLog('INTERVENTION', `Booked academic counselor consultation for ${studentName} on ${selected.day} at ${selected.time}.`);
    showToast(`Counselor scheduled for ${studentName}: ${selected.day} at ${selected.time}!`, 'success');
    setSelectedStudent(null);
    setCounselorSlot(null);
  };

  // Student details alert sending action
  const handleSendSMS = (studentName) => {
    if (!smsDraft.trim()) {
      showToast('SMS draft cannot be blank!', 'info');
      return;
    }
    showToast(`Transmitting secure alert to ${studentName}'s parent/guardian contacts...`, 'info');
    setTimeout(() => {
      addAuditLog('INTERVENTION', `Sent secure parent SMS notification regarding ${studentName}: "${smsDraft}"`);
      showToast(`SMS alert successfully transmitted to ${studentName}'s guardians.`, 'success');
      setSelectedStudent(null);
      setShowSmsComposer(false);
      setSmsDraft('');
    }, 1000);
  };

  // Scholarship Nomination certificate signing
  const handleIssueScholarshipNomination = (studentName) => {
    if (!nominationPin) {
      showToast('Enter security PIN (1234) to sign the nomination!', 'info');
      return;
    }
    if (nominationPin !== '1234') {
      showToast('Invalid Security PIN. Authorization rejected.', 'error');
      return;
    }
    setIsNominationSigned(true);
    showToast(`Nominating ${studentName} for $${scholarshipValue} STEM scholarship...`, 'info');
    setTimeout(() => {
      addAuditLog('ACCELERATION', `Issued gold-tier Honor Roll scholarship nomination ($${scholarshipValue}) to ${studentName} for: "${scholarshipCitation}"`);
      showToast(`Scholarship nomination officially registered and signed for ${studentName}!`, 'success');
      setSelectedStudent(null);
      setIsNominationSigned(false);
      setNominationPin('');
    }, 1500);
  };

  // congratulations letter actions
  const handleSendCongratulationsLetter = (studentName) => {
    if (!congratsDraft.trim()) {
      showToast('Congratulations letter draft cannot be blank!', 'info');
      return;
    }
    showToast(`Transmitting commendation dispatch to ${studentName}'s contacts...`, 'info');
    setTimeout(() => {
      addAuditLog('ACCELERATION', `Dispatched honor roll congratulations letter regarding ${studentName}: "${congratsDraft}"`);
      showToast(`Congratulations commendation letter sent to ${studentName}!`, 'success');
      setSelectedStudent(null);
      setShowCongratsComposer(false);
      setCongratsDraft('');
    }, 1000);
  };

  // Deployed target cohort modeling
  const handleDeployTargetModel = () => {
    showToast(`${selectedCohort} modeling deployed to live registers successfully!`, 'success');
    const studyDelta = stemStudyHours - 5;
    const newPass = Math.min(99.9, parseFloat((91 + studyDelta * 0.85).toFixed(1)));
    const newDistinction = Math.min(85, parseFloat((34 + studyDelta * 1.8).toFixed(1)));
    const newAttrition = Math.max(1.2, parseFloat((8 - studyDelta * 0.65).toFixed(1)));
    
    setForecasts({ pass: newPass, distinction: newDistinction, attrition: newAttrition });
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDeployedModelInfo({
      cohort: selectedCohort,
      studyHours: stemStudyHours,
      time: timestamp,
      passRate: newPass,
      distRate: newDistinction,
      attrRate: newAttrition
    });

    addAuditLog('MODEL_DEPLOY', `Deployed ${selectedCohort} weekly targets: ${stemStudyHours} tutoring hours. Yield projections synchronized.`);
    setShowDeepDiveModal(false);
  };

  // High-fidelity page transitions
  const triggerSecureNavigation = (path, label) => {
    setLoadingOverlayText(label);
    setShowLoadingOverlay(true);
    setTimeout(() => {
      setShowLoadingOverlay(false);
      navigate(path);
    }, 900);
  };

  const dynamicHealthScore = ((systemHealths.lms + systemHealths.mess + systemHealths.security + systemHealths.finance) / 4).toFixed(1);

  const stats = [
    { 
      label: 'Institutional Health', 
      value: `${dynamicHealthScore}%`, 
      trend: '+4.2%', 
      icon: Activity, 
      color: '#6366f1',
      onClick: () => setShowHealthModal(true)
    },
    { 
      label: 'Predictive Accuracy', 
      value: `${predictiveAccuracy}%`, 
      trend: '+0.8%', 
      icon: Brain, 
      color: '#10b981',
      onClick: () => setShowAccuracyModal(true)
    },
    { 
      label: 'Intervention ROI', 
      value: `${roiPercentage}%`, 
      trend: '+12.5%', 
      icon: Rocket, 
      color: '#f59e0b',
      onClick: () => setShowROIModal(true)
    }
  ];

  const timeSlots = [
    { id: 't1', day: 'Today', time: '2:00 PM - 2:30 PM', label: 'Urgent Counselor Slot' },
    { id: 't2', day: 'Tomorrow', time: '9:30 AM - 10:00 AM', label: 'Regular Assessment' },
    { id: 't3', day: 'Tomorrow', time: '1:15 PM - 1:45 PM', label: 'Academic Compliance review' },
    { id: 't4', day: 'Friday', time: '10:00 AM - 10:30 AM', label: 'Remedial Check-in' }
  ];

  const filteredLogs = auditLogs.filter(log => {
    if (logFilter !== 'ALL' && log.event !== logFilter) return false;
    if (logSearchQuery.trim() !== '') {
      return log.details.toLowerCase().includes(logSearchQuery.toLowerCase()) || 
             log.event.toLowerCase().includes(logSearchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--perf-bg-body)', color: 'var(--perf-text-main)', position: 'relative', overflowX: 'hidden', fontFamily: 'var(--font-main)', transition: 'background-color 0.3s, color 0.3s' }}>
      <style>{`
        :root {
          --perf-bg-body: #f8fafc;
          --perf-bg-card: #ffffff;
          --perf-text-main: #0f172a;
          --perf-text-muted: #64748b;
          --perf-border-color: #edf2f7;
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
          
          --perf-advisor-bg: #0f172a;
          --perf-modal-overlay: rgba(15, 23, 42, 0.4);
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
          
          --perf-advisor-bg: #1e293b;
          --perf-modal-overlay: rgba(15, 23, 42, 0.6);
        }
      `}</style>
      
      {/* Visual Background */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '1000px', height: '1000px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header Tier */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', position: 'relative', zIndex: 10 }}>
         <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--perf-text-main)', color: 'var(--perf-bg-card)', borderRadius: '40px', fontSize: '0.8rem', fontWeight: 950, letterSpacing: '1px', marginBottom: '24px' }}>
               <Sparkles size={14} color="#f59e0b" /> PERFORMANCE INTELLIGENCE HUB v2.0
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 950, color: 'var(--perf-text-main)', letterSpacing: '-4px', lineHeight: 0.85, marginBottom: '20px' }}>
               Impact <span style={{ color: '#6366f1' }}>Metrics</span>
            </h1>
            <p style={{ color: 'var(--perf-text-muted)', fontSize: '1.4rem', fontWeight: 500, maxWidth: '700px' }}>Precision institutional auditing, predictive modeling, and outcome verification.</p>
         </div>
         <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setShowLogsDrawer(true)} style={{ padding: '18px 36px', borderRadius: '20px', border: '2px solid var(--perf-border-color)', backgroundColor: 'var(--perf-bg-card)', color: 'var(--perf-text-main)', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', transition: '0.3s' }}>Audit Logs</button>
            <button onClick={handleStartBriefingCompiler} style={{ padding: '18px 40px', borderRadius: '20px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)' }}>Generate PDF Briefing</button>
         </div>
      </div>

      {/* Massive Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '60px', position: 'relative', zIndex: 10 }}>
         {stats.map((s, i) => <ImpactStat key={i} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '48px', position: 'relative', zIndex: 10 }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* AI Narrative Insight Box */}
            <div style={{ backgroundColor: 'var(--perf-advisor-bg)', borderRadius: '48px', padding: '48px', color: 'white', position: 'relative', overflow: 'hidden', border: '1px solid var(--perf-border-color)' }}>
               <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%)' }} />
               <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lightbulb size={24} color="#f59e0b" /></div>
                     <h2 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0 }}>Executive Intelligence Summary</h2>
                  </div>
                  <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: 1.6, fontWeight: 500, marginBottom: '32px' }}>
                     Institutional performance is exhibiting a <span style={{ color: '#10b981', fontWeight: 800 }}>Positive Surge</span>. Math proficiency in <span style={{ color: '#6366f1', fontWeight: 800 }}>{deployedModelInfo ? deployedModelInfo.cohort : 'Grade 10 STEM'}</span> has decoupled from historical seasonal regressions {deployedModelInfo ? `under the deployed target of ${deployedModelInfo.studyHours} tutoring hours` : 'yielding a 12.5% increase in intervention efficiency'}. <span style={{ color: '#6366f1', fontWeight: 800 }}>3 Critical Interventions</span> are recommended for the STEM cohort to stabilize long-term outcome certitude. Deployed certitude projections currently forecast a <span style={{ color: '#10b981', fontWeight: 800 }}>{forecasts.pass}% Pass Rate</span>.
                  </p>
                  
                  {insightsState === 'acknowledged' ? (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px dashed #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                     >
                       <div>
                         <div style={{ color: '#10b981', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> SECURITY COHORT ACKNOWLEDGED</div>
                         <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Signed: {insightSignature?.admin}</div>
                         <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', marginTop: '2px' }}>Fingerprint: {insightSignature?.hash}</div>
                       </div>
                       <button onClick={() => { setInsightsState('pending'); setInsightSignature(null); showToast('Acknowledgment authorization revoked.', 'info'); }} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Revoke</button>
                     </motion.div>
                  ) : (
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleAcknowledgeInsights} style={{ padding: '12px 24px', borderRadius: '14px', backgroundColor: '#6366f1', color: 'white', border: 'none', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}>Acknowledge Insights</button>
                        <button onClick={() => setShowDeepDiveModal(true)} style={{ padding: '12px 24px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer' }}>Deep Dive Audit</button>
                     </div>
                  )}
               </div>
            </div>

            {/* Side-by-Side Impact Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
               
               {/* Critical Risk Triage */}
               <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '48px', padding: '40px', border: '1px solid var(--perf-risk-border)' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--perf-risk-text)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldAlert size={24} /> Critical Risks</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     {risks.map((r, i) => (
                        <div 
                           key={i} 
                           onClick={() => setSelectedStudent({ ...r, type: 'risk' })}
                           style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--perf-risk-bg)', border: '1px solid var(--perf-risk-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }}
                           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                           onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                           title="Click to view intervention details"
                        >
                           <div>
                              <div style={{ fontWeight: 900, color: 'var(--perf-text-main)' }}>{r.name}</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-risk-text)' }}>{r.risk.toUpperCase()} LEVEL</div>
                           </div>
                           <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--perf-high-text)' }}>{r.score}</div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Elite Performance Tier */}
               <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '48px', padding: '40px', border: '1px solid var(--perf-success-border)' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--perf-success-text)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px' }}><Trophy size={24} /> Elite Success</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     {successes.map((s, i) => (
                        <div 
                           key={i} 
                           onClick={() => setSelectedStudent({ ...s, type: 'success' })}
                           style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'var(--perf-success-bg)', border: '1px solid var(--perf-success-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: '0.2s' }}
                           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                           onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                           title="Click to view recognition details"
                        >
                           <div>
                              <div style={{ fontWeight: 900, color: 'var(--perf-text-main)' }}>{s.name}</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-success-text)' }}>{s.status.toUpperCase()} STATUS</div>
                           </div>
                           <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--perf-low-text)' }}>{s.score}</div>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

         </div>

         {/* Sidebar Control Center */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            
            {/* Predictive Outcome Chart */}
            <div style={{ backgroundColor: 'var(--perf-bg-card)', borderRadius: '48px', padding: '40px', border: '1px solid var(--perf-border-color)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--perf-text-main)', margin: 0 }}>Outcome Forecast</h3>
                  {deployedModelInfo && (
                    <div style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--perf-success-bg)', color: 'var(--perf-success-text)', fontSize: '0.75rem', fontWeight: 900, border: '1px solid var(--perf-success-border)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <CheckCircle size={12} /> {deployedModelInfo.studyHours}H Tutoring
                    </div>
                  )}
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {[
                    { label: 'Pass Certitude', val: forecasts.pass, color: '#10b981' },
                    { label: 'Distinction Rate', val: forecasts.distinction, color: '#6366f1' },
                    { label: 'Attrition Risk', val: forecasts.attrition, color: '#ef4444' }
                  ].map((f, i) => (
                    <div key={i}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>
                          <span style={{ color: 'var(--perf-text-muted)' }}>{f.label}</span>
                          <span style={{ color: 'var(--perf-text-main)' }}>{f.val}%</span>
                       </div>
                       <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--perf-bg-body)', borderRadius: '5px', overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${f.val}%` }} style={{ height: '100%', backgroundColor: f.color }} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Institutional Radar Hub */}
            <div style={{ backgroundColor: 'var(--perf-advisor-bg)', borderRadius: '48px', padding: '40px', color: 'white', border: '1px solid var(--perf-border-color)' }}>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#6366f120', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                     <ScanSearch size={40} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: '12px' }}>Neural Radar</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '32px' }}>Scanning institutional vectors for predictive anomalies and growth opportunities.</p>
                  <button onClick={handleStartScan} style={{ width: '100%', padding: '16px', borderRadius: '18px', backgroundColor: '#6366f1', color: 'white', border: 'none', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                     <Sparkles size={16} /> Start Neural Scan
                  </button>
               </div>
            </div>

            {/* Quick Actions */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button 
                  onClick={() => triggerSecureNavigation('/dashboard/settings', 'Establishing encrypted admin settings tunnel...')} 
                  style={{ width: '100%', padding: '20px', borderRadius: '24px', backgroundColor: 'var(--perf-bg-card)', border: '1px solid var(--perf-border-color)', color: 'var(--perf-text-main)', fontWeight: 950, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                   <Command size={18} /> Administrative Settings
                </button>
                <button 
                  onClick={() => triggerSecureNavigation('/dashboard/teachers', 'Initializing faculty credential roster...')} 
                  style={{ width: '100%', padding: '20px', borderRadius: '24px', backgroundColor: 'var(--perf-bg-card)', border: '1px solid var(--perf-border-color)', color: 'var(--perf-text-main)', fontWeight: 950, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                   <Users size={18} /> Manage Faculty Access
                </button>
             </div>

          </div>

      </div>

      {/* Dynamic Simulated Neural Radar Scan Overlay */}
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
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 1.5s linear infinite' }} />
                <Brain size={44} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }} />
              </div>
              
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 950 }}>Radar Matrix Scan</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>Processing systemic node vectors...</p>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginTop: '8px' }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', backgroundColor: '#6366f1', transition: 'width 0.15s ease-out' }}></div>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'monospace' }}>{scanProgress}%</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Historical Audit Logs Sliding Drawer */}
      <AnimatePresence>
        {showLogsDrawer && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 5000, display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogsDrawer(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'relative', width: '100%', maxWidth: '440px', height: '100%', backgroundColor: '#0f172a', borderLeft: '1px solid #1e293b', padding: '32px', display: 'flex', flexDirection: 'column', color: '#38bdf8', fontFamily: 'monospace', boxShadow: '-10px 0 30px rgba(0,0,0,0.3)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
                 <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}><Terminal size={18} /> System Audit Logs</h3>
                 <button onClick={() => setShowLogsDrawer(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {/* Log Search input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#1e293b', borderRadius: '12px', marginBottom: '16px' }}>
                <Search size={14} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Search logs details..." 
                  value={logSearchQuery} 
                  onChange={(e) => setLogSearchQuery(e.target.value)} 
                  style={{ background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.8rem', width: '100%', fontFamily: 'monospace' }} 
                />
              </div>

              {/* Log Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
                {['ALL', 'EVALUATION', 'PREDICTION', 'INTERVENTION', 'INTEGRITY', 'MODEL_DEPLOY', 'SCAN_COMPLETE'].map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => setLogFilter(filter)} 
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      backgroundColor: logFilter === filter ? '#6366f1' : '#1e293b',
                      color: logFilter === filter ? 'white' : '#94a3b8',
                      border: 'none',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {filter === 'ALL' ? 'ALL' : filter.replace('_', ' ')}
                  </button>
                ))}
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem', paddingRight: '4px' }}>
                 {filteredLogs.length > 0 ? (
                   filteredLogs.map((log, idx) => (
                     <div key={idx} style={{ borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ color: '#64748b' }}>[{log.time}]</span>
                          <span style={{ fontWeight: 800, color: log.event === 'SCAN_COMPLETE' || log.event === 'MODEL_DEPLOY' ? '#4ade80' : '#6366f1' }}>{log.event}</span>
                        </div>
                        <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.4 }}>{log.details}</p>
                     </div>
                   ))
                 ) : (
                   <div style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>No logs match active filters.</div>
                 )}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  onClick={handleExportAuditLogs} 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Download size={16} /> Export Logs
                </button>
                <button 
                  onClick={() => {
                    setAuditLogs([]);
                    showToast('Audit logs cleared statefully.', 'success');
                  }} 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ef444430', backgroundColor: 'transparent', color: '#ef4444', fontWeight: 800, cursor: 'pointer' }}
                >
                  Clear Register
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Profile Dialog */}
      <AnimatePresence>
        {selectedStudent && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--perf-modal-overlay, rgba(15, 23, 42, 0.4))', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--perf-bg-card, white)', border: '1px solid var(--perf-border-color, #edf2f7)', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', color: 'var(--perf-text-main)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, backgroundColor: selectedStudent.type === 'risk' ? 'var(--perf-risk-bg)' : 'var(--perf-success-bg)', color: selectedStudent.type === 'risk' ? 'var(--perf-risk-text)' : 'var(--perf-success-text)' }}>
                    {selectedStudent.type === 'risk' ? <ShieldAlert size={14} /> : <Trophy size={14} />}
                    {selectedStudent.type === 'risk' ? 'CRITICAL RISK DETECTED' : 'ELITE SCHOLAR PROFILE'}
                 </div>
                 <button onClick={() => { setSelectedStudent(null); setShowSmsComposer(false); setSmsDraft(''); setShowCongratsComposer(false); setCongratsDraft(''); }} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                 <div style={{ width: '72px', height: '72px', borderRadius: '24px', backgroundColor: selectedStudent.type === 'risk' ? 'var(--perf-high-bg)' : 'var(--perf-low-bg)', color: selectedStudent.type === 'risk' ? 'var(--perf-high-text)' : 'var(--perf-low-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900 }}>
                    {selectedStudent.avatar}
                 </div>
                 <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: 950 }}>{selectedStudent.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--perf-text-muted)', fontWeight: 700 }}>Grade Level: Grade 10 STEM</span>
                 </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--perf-text-muted)', lineHeight: 1.6, margin: '0 0 28px 0', fontWeight: 500 }}>{selectedStudent.desc}</p>

              {/* Student KPI breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', borderTop: '1px solid var(--perf-border-color)', borderBottom: '1px solid var(--perf-border-color)', padding: '20px 0', marginBottom: '32px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Grade</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--perf-text-main)' }}>{selectedStudent.grade}</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Attendance</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10b981' }}>{selectedStudent.attendance}</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    {selectedStudent.type === 'risk' ? (
                      <>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Missing Tasks</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{selectedStudent.missingTasks}</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Active GPA</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#6366f1' }}>{selectedStudent.gpa}</div>
                      </>
                    )}
                 </div>
              </div>

              {/* Nested Custom Action Composers */}
              {showSmsComposer && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ backgroundColor: 'var(--perf-bg-body, #f8fafc)', border: '1px solid var(--perf-risk-border, #fee2e2)', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--perf-risk-text, #991b1b)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Send Guardian Progress SMS</div>
                  <textarea 
                    value={smsDraft} 
                    onChange={(e) => setSmsDraft(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', borderRadius: '12px', border: '1px solid var(--perf-border-color)', backgroundColor: 'var(--perf-input-bg)', color: 'var(--perf-text-main)', padding: '12px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', marginBottom: '12px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleSendSMS(selectedStudent.name)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Transmit SMS</button>
                    <button onClick={() => setShowSmsComposer(false)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', border: '1px solid var(--perf-border-color)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </motion.div>
              )}

              {showCongratsComposer && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ backgroundColor: 'var(--perf-bg-body, #f8fafc)', border: '1px solid var(--perf-success-border, #d1fae5)', padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--perf-success-text, #065f46)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Compose Congratulations Dispatch</div>
                  <textarea 
                    value={congratsDraft} 
                    onChange={(e) => setCongratsDraft(e.target.value)}
                    style={{ width: '100%', minHeight: '80px', borderRadius: '12px', border: '1px solid var(--perf-border-color)', backgroundColor: 'var(--perf-input-bg)', color: 'var(--perf-text-main)', padding: '12px', fontSize: '0.85rem', outline: 'none', resize: 'vertical', marginBottom: '12px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleSendCongratulationsLetter(selectedStudent.name)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Dispatch Note</button>
                    <button onClick={() => setShowCongratsComposer(false)} style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', border: '1px solid var(--perf-border-color)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </motion.div>
              )}

              {/* Recommended Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 {selectedStudent.type === 'risk' ? (
                   <>
                     {/* Calendar Time Slots appointment schedule picker */}
                     <div style={{ backgroundColor: 'var(--perf-bg-body)', padding: '20px', borderRadius: '20px', border: '1px solid var(--perf-border-color)' }}>
                       <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--perf-text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> Academic Counselor Planner</div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                         {timeSlots.map(slot => (
                           <div 
                             key={slot.id}
                             onClick={() => setCounselorSlot(slot.id)}
                             style={{
                               padding: '12px',
                               borderRadius: '12px',
                               border: counselorSlot === slot.id ? '2px solid #6366f1' : '1px solid var(--perf-border-color)',
                               backgroundColor: counselorSlot === slot.id ? 'rgba(99, 102, 241, 0.08)' : 'var(--perf-bg-card)',
                               cursor: 'pointer',
                               textAlign: 'center',
                               transition: '0.2s'
                             }}
                           >
                             <div style={{ fontSize: '0.8rem', fontWeight: 800, color: counselorSlot === slot.id ? '#6366f1' : 'var(--perf-text-main)' }}>{slot.day}</div>
                             <div style={{ fontSize: '0.7rem', color: 'var(--perf-text-muted)', marginTop: '2px' }}>{slot.time}</div>
                           </div>
                         ))}
                       </div>
                       <button 
                         onClick={() => handleBookCounselor(selectedStudent.name)}
                         style={{ padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.85rem', width: '100%', cursor: 'pointer' }}
                       >
                         Confirm Slot Appointment
                       </button>
                     </div>

                     <button 
                       onClick={() => {
                         setSmsDraft(`EduPro Academic Alert: Please be notified that Lokesh Roy is flagged under high math regression triggers. Let's schedule counselor slots.`);
                         setShowSmsComposer(true);
                       }} 
                       className="btn"
                       style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-main)', fontWeight: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                     >
                        <Mail size={16} /> Alert Parents/Guardians
                     </button>
                   </>
                 ) : (
                   <>
                     {/* Gold-Border Certificate builder nominations */}
                     <div style={{ backgroundColor: 'var(--perf-bg-body)', padding: '24px', borderRadius: '24px', border: '2px gold dashed', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '50%' }} />
                       <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#b25e00', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}><Trophy size={16} color="gold" /> Gold-Tier Honor Nomination</div>
                       
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                         <div>
                           <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-text-muted)' }}>Nomination Reward Value ($)</label>
                           <input 
                             type="number" 
                             value={scholarshipValue} 
                             onChange={(e) => setScholarshipValue(parseInt(e.target.value))}
                             style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--perf-border-color)', backgroundColor: 'var(--perf-input-bg)', color: 'var(--perf-text-main)', fontSize: '0.85rem', marginTop: '4px', outline: 'none' }} 
                           />
                         </div>
                         <div>
                           <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-text-muted)' }}>Citation Statement</label>
                           <input 
                             type="text" 
                             value={scholarshipCitation} 
                             onChange={(e) => setScholarshipCitation(e.target.value)}
                             style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--perf-border-color)', backgroundColor: 'var(--perf-input-bg)', color: 'var(--perf-text-main)', fontSize: '0.85rem', marginTop: '4px', outline: 'none' }} 
                           />
                         </div>
                         <div>
                           <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-text-muted)' }}>Enter Auth PIN (1234)</label>
                           <input 
                             type="password" 
                             placeholder="PIN"
                             value={nominationPin} 
                             onChange={(e) => setNominationPin(e.target.value)}
                             style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--perf-border-color)', backgroundColor: 'var(--perf-input-bg)', color: 'var(--perf-text-main)', fontSize: '0.85rem', marginTop: '4px', outline: 'none' }} 
                           />
                         </div>
                       </div>
                       
                       <button 
                         onClick={() => handleIssueScholarshipNomination(selectedStudent.name)}
                         style={{ padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#d4af37', color: 'black', fontWeight: 950, fontSize: '0.85rem', width: '100%', cursor: 'pointer', boxShadow: '0 4px 12px rgba(212,175,55,0.2)' }}
                       >
                         Authorize Signature & Nominations
                       </button>
                     </div>

                     <button 
                       onClick={() => {
                         setCongratsDraft(`Dear ${selectedStudent.name}, EduPro AI formally recognizes your outstanding high academic score blocks. Keep up the conceptual leadership.`);
                         setShowCongratsComposer(true);
                       }} 
                       className="btn"
                       style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-main)', fontWeight: 800, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                     >
                        <Mail size={16} /> Send Congratulations Notice
                     </button>
                   </>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic STEM Cohort Deep Dive Simulation Modal */}
      <AnimatePresence>
        {showDeepDiveModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--perf-modal-overlay, rgba(15, 23, 42, 0.4))', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '540px', backgroundColor: 'var(--perf-bg-card, white)', border: '1px solid var(--perf-border-color, #edf2f7)', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', color: 'var(--perf-text-main)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, backgroundColor: 'var(--perf-high-bg)', color: 'var(--perf-high-text)' }}>
                    <Microscope size={14} /> ACTIVE PREDICTIVE MODELING
                 </div>
                 <button onClick={() => setShowDeepDiveModal(false)} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 950 }}>STEM Cohort Micro-Analysis</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--perf-text-muted)', lineHeight: 1.5, margin: '0 0 24px 0', fontWeight: 500 }}>
                 Adjust the targeted study/rehearsal vector parameter to project prospective GPA yield and passing rates dynamically in real-time.
              </p>

              {/* Cohort Selector dropdown */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--perf-text-muted)', display: 'block', marginBottom: '8px' }}>Select Target Cohort</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Grade 10 STEM', 'Grade 9 Humanities', 'Grade 12 Calculus'].map(cohort => (
                    <button 
                      key={cohort}
                      onClick={() => setSelectedCohort(cohort)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '12px',
                        border: selectedCohort === cohort ? '2px solid var(--perf-high-text)' : '1px solid var(--perf-border-color)',
                        backgroundColor: selectedCohort === cohort ? 'var(--perf-high-bg)' : 'var(--perf-bg-card)',
                        color: selectedCohort === cohort ? 'var(--perf-high-text)' : 'var(--perf-text-main)',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {cohort}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Component */}
              <div style={{ backgroundColor: 'var(--perf-bg-body)', padding: '24px', borderRadius: '20px', border: '1px solid var(--perf-border-color)', marginBottom: '32px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', marginBottom: '16px' }}>
                   <span style={{ color: 'var(--perf-text-muted)' }}>Target Weekly Tutoring Hours</span>
                   <span style={{ color: 'var(--perf-high-text)', fontSize: '1.1rem' }}>{stemStudyHours} Hours</span>
                 </div>
                 <input 
                   type="range" 
                   min="5" 
                   max="15" 
                   value={stemStudyHours} 
                   onChange={(e) => setStemStudyHours(parseInt(e.target.value))}
                   style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--perf-border-color)', outline: 'none', cursor: 'pointer' }}
                 />
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', marginTop: '8px' }}>
                   <span>5 Hours (Base)</span>
                   <span>10 Hours</span>
                   <span>15 Hours (Max)</span>
                 </div>
              </div>

              {/* Simulation Result Output */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                 <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--perf-success-bg)', border: '1px solid var(--perf-success-border)', textAlign: 'center' }}>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-success-text)', textTransform: 'uppercase', marginBottom: '6px' }}>GPA Yield Increase</div>
                     <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--perf-success-text)' }}>+{((stemStudyHours - 5) * 0.085).toFixed(2)}</div>
                 </div>
                 <div style={{ padding: '20px', borderRadius: '20px', backgroundColor: 'var(--perf-high-bg)', border: '1px solid var(--perf-high-border)', textAlign: 'center' }}>
                     <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--perf-high-text)', textTransform: 'uppercase', marginBottom: '6px' }}>Projected Pass Rate</div>
                     <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--perf-high-text)' }}>{(91 + (stemStudyHours - 5) * 0.85).toFixed(1)}%</div>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                 <button 
                   onClick={handleDeployTargetModel} 
                   className="btn btn-primary"
                   style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--perf-high-text)', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer' }}
                 >
                    Deploy Target Model
                 </button>
                 <button 
                   onClick={() => setShowDeepDiveModal(false)} 
                   className="btn"
                   style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, cursor: 'pointer' }}
                 >
                    Dismiss Model
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Institutional Health diagnostics card modal */}
      <AnimatePresence>
        {showHealthModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--perf-modal-overlay, rgba(15, 23, 42, 0.4))', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--perf-bg-card, white)', border: '1px solid var(--perf-border-color)', borderRadius: '32px', padding: '40px', color: 'var(--perf-text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Activity color="var(--perf-high-text)" /> Health Auditing Matrix</h3>
                <button onClick={() => setShowHealthModal(false)} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--perf-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>Real-time health checking across critical institutional subsystems. Green tickers indicate optimal performance parameters.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {[
                  { name: 'LMS Academic Node', val: systemHealths.lms, latency: '12ms' },
                  { name: 'Mess Operational Database', val: systemHealths.mess, latency: '8ms' },
                  { name: 'Security Camera Feeds Matrix', val: systemHealths.security, latency: '40ms' },
                  { name: 'Secure Financial PCI-DSS Ledger', val: systemHealths.finance, latency: '18ms' }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: 'var(--perf-bg-body)', border: '1px solid var(--perf-border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--perf-text-muted)', marginTop: '2px' }}>Response Latency: {item.latency}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: item.val >= 98 ? 'var(--perf-success-text)' : 'var(--perf-warning-text)' }}>{item.val}%</span>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.val >= 98 ? 'var(--perf-success-text)' : 'var(--perf-warning-text)', boxShadow: item.val >= 98 ? '0 0 10px var(--perf-success-text)' : '0 0 10px var(--perf-warning-text)' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleReAuditSystems} 
                  disabled={isAuditingSystems}
                  style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--perf-high-text)', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <RefreshCw size={16} className={isAuditingSystems ? "spin" : ""} /> {isAuditingSystems ? 'Re-Auditing...' : 'Re-Audit Core Nodes'}
                </button>
                <button onClick={() => setShowHealthModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, cursor: 'pointer' }}>Dismiss</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AI Predictive Accuracy retraining modal */}
      <AnimatePresence>
        {showAccuracyModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--perf-modal-overlay, rgba(15, 23, 42, 0.4))', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--perf-bg-card, white)', border: '1px solid var(--perf-border-color)', borderRadius: '32px', padding: '40px', color: 'var(--perf-text-main)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Brain color="var(--perf-success-text)" /> AI Prediction Validation</h3>
                <button onClick={() => setShowAccuracyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--perf-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>Operational sub-classifiers audit log. Train active epochs to continuously optimize predictive confidence score limits.</p>
              
              <div style={{ padding: '16px 20px', borderRadius: '20px', backgroundColor: 'var(--perf-success-bg)', border: '1px dashed var(--perf-success-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--perf-text-muted)', fontWeight: 800 }}>AUDITED GLOBAL ACCURACY</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--perf-success-text)', letterSpacing: '-2px', marginTop: '4px' }}>{predictiveAccuracy}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--perf-text-muted)', fontWeight: 800 }}>EPOCHS PROCESSED</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--perf-text-main)', marginTop: '4px' }}>{epochsTrained} Epochs</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {accuracyLogs.map((item, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'var(--perf-bg-body)', border: '1px solid var(--perf-border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 900, color: 'var(--perf-success-text)' }}>
                      <span>AUC {item.score}%</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--perf-text-muted)', fontWeight: 700 }}>Ep:{item.epoch}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleTrainEpoch} 
                  disabled={isTrainingEpoch}
                  style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--perf-success-text)', color: 'white', fontWeight: 900, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <RefreshCw size={16} className={isTrainingEpoch ? "spin" : ""} /> {isTrainingEpoch ? 'Retraining Epoch...' : 'Execute Epoch Retraining'}
                </button>
                <button onClick={() => setShowAccuracyModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, cursor: 'pointer' }}>Dismiss</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Intervention ROI Calculator slider modal */}
      <AnimatePresence>
        {showROIModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--perf-modal-overlay, rgba(15, 23, 42, 0.4))', backdropFilter: 'blur(12px)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--perf-bg-card, white)', border: '1px solid var(--perf-border-color)', borderRadius: '32px', padding: '40px', color: 'var(--perf-text-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><Rocket color="var(--perf-warning-text)" /> Resource ROI Forecaster</h3>
                <button onClick={() => setShowROIModal(false)} style={{ background: 'none', border: 'none', color: 'var(--perf-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--perf-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>Forecast financial and structural yield metrics by calibrating hourly resource values dynamically.</p>
              
              <div style={{ backgroundColor: 'var(--perf-bg-body)', padding: '24px', borderRadius: '20px', border: '1px solid var(--perf-border-color)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', marginBottom: '16px' }}>
                  <span style={{ color: 'var(--perf-text-muted)' }}>Staffing Hourly Cost Rate</span>
                  <span style={{ color: 'var(--perf-warning-text)', fontSize: '1.2rem', fontWeight: 900 }}>${staffHourRate}/hr</span>
                </div>
                <input 
                  type="range" 
                  min="25" 
                  max="100" 
                  value={staffHourRate} 
                  onChange={(e) => setStaffHourRate(parseInt(e.target.value))}
                  style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--perf-border-color)', outline: 'none', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--perf-text-muted)', marginTop: '8px' }}>
                  <span>$25/hr</span>
                  <span>$62/hr</span>
                  <span>$100/hr</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--perf-warning-bg)', border: '1px solid var(--perf-warning-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--perf-warning-text)', textTransform: 'uppercase' }}>Hours Conserved</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '4px' }}>150+ Hours</div>
                </div>
                <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: 'var(--perf-success-bg)', border: '1px solid var(--perf-success-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--perf-success-text)', textTransform: 'uppercase' }}>Financial Yield Saved</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '4px', color: 'var(--perf-success-text)' }}>${150 * staffHourRate}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleDeployCostModel} 
                  style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--perf-warning-text)', color: 'black', fontWeight: 950, fontSize: '0.95rem', cursor: 'pointer' }}
                >
                  Deploy Cost Model
                </button>
                <button onClick={() => setShowROIModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid var(--perf-border-color)', backgroundColor: 'transparent', color: 'var(--perf-text-muted)', fontWeight: 800, cursor: 'pointer' }}>Dismiss</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full screen Routing loading screen */}
      <AnimatePresence>
        {showLoadingOverlay && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '4px solid rgba(255,255,255,0.05)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
                <Bot size={32} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#6366f1' }} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>Secure Node Gate</h4>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, fontFamily: 'monospace' }}>{loadingOverlayText}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Briefing compiling progression modal */}
      <AnimatePresence>
        {showBriefingCompiler && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', zIndex: 8500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '0 24px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <RefreshCw size={28} className="spin" />
              </div>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', fontWeight: 950 }}>Compiling PDF Briefing</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800, fontFamily: 'monospace' }}>{compilerPhase}</p>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ width: `${compilerProgress}%`, height: '100%', backgroundColor: '#6366f1', transition: 'width 0.1s ease-out' }} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace' }}>{compilerProgress}%</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printable PDF mockup preview overlay */}
      <AnimatePresence>
        {showPrintPreview && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(16px)', zIndex: 8000, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '40px 24px' }}>
            
            {/* Top controls header */}
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '16px 32px', borderRadius: '24px', color: 'white', zIndex: 8100 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800 }}><FileText size={16} color="#6366f1" /> Briefing Print Layout</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => window.print()}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={14} /> Print Report
                </button>
                <button 
                  onClick={handleExportBriefingTxt}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#94a3b8', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Download TXT Ledger
                </button>
                <button 
                  onClick={() => setShowPrintPreview(false)}
                  style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#ef444420', color: '#ef4444', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* Structured white report sheet layout */}
            <div 
              id="printable-briefing"
              style={{ 
                maxWidth: '800px', width: '100%', margin: '0 auto', 
                backgroundColor: 'white', color: '#0f172a', borderRadius: '32px', 
                padding: '60px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', 
                fontFamily: 'sans-serif', zIndex: 8050 
              }}
            >
              {/* Header blocks */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid #6366f1', paddingBottom: '32px', marginBottom: '40px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-1px', color: '#1e293b' }}>EDUPRO ELITE HIGH ACADEMIC ACCREDITATION</h2>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6366f1', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Institutional Performance Briefing Ledger</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>SECURITY STACK V2.0</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Summary details */}
              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>1. Executive Intelligence Overview</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                  Global institutional metrics are currently verifying a positive surge epoch. Average academic compliance and passing forecast coefficients stand at optimal values. All 15 ML operational modules are fully deployed under active retraining vectors to guarantee statistical accuracy certitude parameters.
                </p>
              </div>

              {/* Stats tables grids */}
              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>2. Global Accreditations Parameters</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                      <th style={{ padding: '12px' }}>Subsystem Vector</th>
                      <th style={{ padding: '12px' }}>Accreditation Value</th>
                      <th style={{ padding: '12px' }}>Validation Latency</th>
                      <th style={{ padding: '12px' }}>Operational Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>LMS Academic Node</td>
                      <td style={{ padding: '12px' }}>{systemHealths.lms}% Health</td>
                      <td style={{ padding: '12px' }}>12ms</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 800 }}>ACTIVE</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>Mess Operations database</td>
                      <td style={{ padding: '12px' }}>{systemHealths.mess}% Health</td>
                      <td style={{ padding: '12px' }}>8ms</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 800 }}>ACTIVE</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>Security Camera Feeds Matrix</td>
                      <td style={{ padding: '12px' }}>{systemHealths.security}% Health</td>
                      <td style={{ padding: '12px' }}>40ms</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 800 }}>ACTIVE</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>PCI-DSS Finance Node</td>
                      <td style={{ padding: '12px' }}>{systemHealths.finance}% Health</td>
                      <td style={{ padding: '12px' }}>18ms</td>
                      <td style={{ padding: '12px', color: '#10b981', fontWeight: 800 }}>ACTIVE</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Modeling configurations */}
              <div style={{ marginBottom: '40px', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>3. Deployed Modeling Target Coefficients</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ color: '#64748b', fontWeight: 700 }}>Target Cohort</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1e293b', marginTop: '4px' }}>{deployedModelInfo ? deployedModelInfo.cohort : 'Grade 10 STEM'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontWeight: 700 }}>Weekly Tutoring Target</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#1e293b', marginTop: '4px' }}>{deployedModelInfo ? deployedModelInfo.studyHours : stemStudyHours} Tutoring Hours</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontWeight: 700 }}>Projected Pass Rate</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>{forecasts.pass}% Confidence</div>
                  </div>
                </div>
              </div>

              {/* Student Risks registry */}
              <div style={{ marginBottom: '40px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>4. Active Intervention registries</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#ef4444' }}>Critical Academic Risks Triage</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {risks.map((item, idx) => (
                        <div key={idx} style={{ padding: '12px', border: '1px solid #fee2e2', borderRadius: '12px', backgroundColor: '#fef2f2', fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 800 }}>{item.name} ({item.grade})</div>
                          <div style={{ color: '#64748b', marginTop: '2px' }}>Attendance: {item.attendance} | Missing tasks: {item.missingTasks}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#10b981' }}>Elite Success Accolade Roster</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {successes.map((item, idx) => (
                        <div key={idx} style={{ padding: '12px', border: '1px solid #d1fae5', borderRadius: '12px', backgroundColor: '#ecfdf5', fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 800 }}>{item.name} ({item.grade})</div>
                          <div style={{ color: '#64748b', marginTop: '2px' }}>Attendance: {item.attendance} | Active GPA: {item.gpa}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Auths block */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div>
                  <div>Report Ledger Security: PCI-DSS compliance validated.</div>
                  <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>Authorization: {insightSignature ? insightSignature.hash : 'UNSIGNED_MODE_VERIFIED'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#475569' }}>EduPro Intelligence Engine v2.0</div>
                  <div style={{ marginTop: '2px' }}>Accreditation Stamp Signed</div>
                </div>
              </div>

            </div>
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
              position: 'fixed', bottom: '32px', right: '32px', zIndex: 7000, 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 24px', 
              backgroundColor: '#0f172a', color: 'white', borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', maxWidth: '450px', border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              backgroundColor: toast.type === 'success' ? '#10b98120' : '#6366f120', 
              color: toast.type === 'success' ? '#10b981' : '#6366f1', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {toast.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: '1.4', flex: 1 }}>{toast.message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        
        /* Print styles override layout */
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-briefing, #printable-briefing * {
            visibility: visible !important;
          }
          #printable-briefing {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 20px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      ` }} />
    </div>
  );
};

export default AIPerformanceHub;
