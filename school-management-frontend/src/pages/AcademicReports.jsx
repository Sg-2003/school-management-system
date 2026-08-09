/* EduPro Elite - Ultra-Premium Academic Reports Portal v3.0 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Download, Filter, Search, 
  ChevronRight, BarChart3, TrendingUp, Users,
  BookOpen, FileText, Share2, Printer, ShieldCheck, Eye, X,
  Activity, CheckCircle2, AlertCircle, Fingerprint, Terminal, Scale
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const AcademicReports = () => {
  // --- STATE SYSTEM ---
  const [activeAction, setActiveAction] = useState(null); 
  const [showToast, setShowToast] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  // Custom builder states
  const [customExam, setCustomExam] = useState('Final Term Audit 2025');
  const [selectedMetrics, setSelectedMetrics] = useState(['Subject Mastery']);
  
  // Dynamic stats
  const [stats, setStats] = useState({
    institutionScore: 84.2,
    reportsMeta: 1420,
    academicAlertsCount: 3
  });

  // Scholastic scholastic warnings triage dataset
  const [triageItems, setTriageItems] = useState([
    { id: 1, name: 'Manish Verma', grade: 'Grade 11-B', score: '58% in Pure Mathematics', outreachActive: false, status: 'Outreach Pending' },
    { id: 2, name: 'Kirti Sen', grade: 'Grade 10-C', score: '64% in Advanced Physics', outreachActive: false, status: 'Outreach Pending' },
    { id: 3, name: 'Nitin Handa', grade: 'Grade 12-A', score: '62% in World History', outreachActive: false, status: 'Outreach Pending' }
  ]);
  const [triageOpen, setTriageOpen] = useState(false);

  // Dynamic template list state
  const [reportTemplates, setReportTemplates] = useState([
    { title: 'Class-wise Performance Summary', type: 'Analytical', lastGen: 'Yesterday' },
    { title: 'Student Grade Trend Analysis', type: 'Predictive', lastGen: '3 days ago' },
    { title: 'Subject-wise Pass/Fail Ratio', type: 'Statistical', lastGen: '1 week ago' },
    { title: 'Teacher Engagement Index', type: 'Faculty', lastGen: '2 weeks ago' },
    { title: 'Mid-term vs Final Comparison', type: 'Comparative', lastGen: '1 month ago' },
    { title: 'Academic Honors List (Toppers)', type: 'Merit', lastGen: '2 months ago' },
  ]);

  // Curve calibration settings
  const [gradingCurveSlider, setGradingCurveSlider] = useState(0); // Shifting grades by % (-10 to +10)
  const [scannerProgress, setScannerProgress] = useState(null);
  const [showScanCert, setShowScanCert] = useState(false);

  const academicData = [
    { month: 'Jan', efficacy: 78 },
    { month: 'Feb', efficacy: 82 },
    { month: 'Mar', efficacy: 85 },
    { month: 'Apr', efficacy: 81 },
    { month: 'May', efficacy: 88 },
    { month: 'Jun', efficacy: 92 },
  ];

  // Click outside listener for filter popover
  useEffect(() => {
    const dismissFilters = () => setFilterDropdownOpen(false);
    window.addEventListener('click', dismissFilters);
    return () => window.removeEventListener('click', dismissFilters);
  }, []);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // --- ACTIONS & INTERACTIVE RUNNERS ---

  const handleAction = (name, type = 'process') => {
    setActiveAction({ name, type });
    
    // Custom steps logging or percentage progression
    let duration = 2500;
    setTimeout(() => {
      setActiveAction(null);
      let msg = '';
      if (name === 'print') msg = 'Bulk Print Job Sent to Campus Queue';
      else if (name === 'distribute') msg = 'Reports Distributed via Parental Portal';
      else msg = `${name} ${type === 'download' ? 'Downloaded' : 'Processed'} Successfully`;
      
      setShowToast(msg);
      if (type === 'view') {
        setPreviewReport(name);
        setGradingCurveSlider(0);
        setScannerProgress(null);
        setShowScanCert(false);
      }
      setTimeout(() => setShowToast(null), 3000);
    }, duration);
  };

  // Category filter
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    triggerToast(`Filter Adjusted to: ${type.toUpperCase()}`);
  };

  const filteredTemplates = selectedType === 'all'
    ? reportTemplates
    : reportTemplates.filter(t => t.type.toLowerCase().includes(selectedType.toLowerCase()));

  // Bespoke Report Builder Compiler
  const handleCreateCustomReport = () => {
    const customTitle = `${customExam.replace('2025', '2026')} [Custom Insight]`;
    const customType = 'Custom';
    
    // Statefully append to templates
    setReportTemplates(prev => [
      ...prev,
      { title: customTitle, type: customType, lastGen: 'Just Now' }
    ]);

    setStats(s => ({ ...s, reportsMeta: s.reportsMeta + 1 }));
    setIsCustomModalOpen(false);
    triggerToast(`Created Custom Template: ${customTitle}`);
  };

  // Toggle comparison metrics
  const toggleMetric = (metric) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(prev => prev.filter(m => m !== metric));
    } else {
      setSelectedMetrics(prev => [...prev, metric]);
    }
  };

  // Client-Side CSV Compiler
  const handleDownloadCSV = (template) => {
    let headers = ['Student ID', 'Student Name', 'Academic Division', 'Evaluation Term', 'Mean Score', 'Grade Assigned', 'Efficacy Index'];
    let rows = [];

    if (template.title.includes('Performance') || template.title.includes('Trend')) {
      rows = [
        ['STU-2024-001', 'Lokesh Roy', 'Grade 12-A', 'Spring 2026', '94.2%', 'A+ Elite', 'Optimal'],
        ['STU-2024-004', 'Neha Sharma', 'Grade 12-A', 'Spring 2026', '92.8%', 'A+ Elite', 'Optimal'],
        ['STU-2024-112', 'Abhishek Singh', 'Grade 12-A', 'Spring 2026', '88.5%', 'A High', 'High'],
        ['STU-2024-301', 'Nitin Handa', 'Grade 12-A', 'Spring 2026', '62.0%', 'C Warning', 'Lagging'],
        ['STU-2024-405', 'Geeta Patel', 'Grade 12-A', 'Spring 2026', '81.4%', 'B+ Standard', 'High']
      ];
    } else if (template.title.includes('Pass/Fail') || template.title.includes('Honors')) {
      rows = [
        ['STU-2024-001', 'Lokesh Roy', 'Grade 12-A', 'Final Term 2025', '98.5%', 'A+ Topper', 'Optimal'],
        ['STU-2024-004', 'Neha Sharma', 'Grade 12-A', 'Final Term 2025', '96.2%', 'A+ Topper', 'Optimal'],
        ['STU-2024-055', 'Priya Patel', 'Grade 12-B', 'Final Term 2025', '95.4%', 'A+ Topper', 'Optimal'],
        ['STU-2024-019', 'Meera Iyer', 'Grade 12-A', 'Final Term 2025', '94.8%', 'A+ Elite', 'Optimal'],
        ['STU-2024-088', 'Alok Verma', 'Grade 12-B', 'Final Term 2025', '92.5%', 'A+ Elite', 'Optimal']
      ];
    } else {
      rows = [
        ['STU-2024-101', 'Isha Sen', 'Grade 11-B', 'Standard Audit', '84.2%', 'B+ Standard', 'High'],
        ['STU-2024-110', 'Manish Verma', 'Grade 11-B', 'Standard Audit', '58.0%', 'D Remedial', 'Lagging'],
        ['STU-2024-210', 'Lokesh Roy', 'Grade 11-B', 'Standard Audit', '76.8%', 'B- Standard', 'Moderate'],
        ['STU-2024-245', 'Kirti Sen', 'Grade 10-C', 'Standard Audit', '64.0%', 'C- Warning', 'Lagging'],
        ['STU-2024-302', 'Deepak Kumar', 'Grade 10-C', 'Standard Audit', '89.4%', 'A High', 'High']
      ];
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const formattedFilename = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-report.csv';
    link.setAttribute("download", formattedFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`CSV Compiled: ${formattedFilename}`);
  };

  // Scholastic Triage remedial outreaches
  const handleIssueRemedial = (id) => {
    setTriageItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, outreachActive: true, status: 'SMS Outraged' };
      }
      return item;
    }));

    triggerToast("Remedial peer tutor invitation dispatches generated");

    setTimeout(() => {
      setTriageItems(prev => prev.filter(item => {
        if (item.id === id) {
          setStats(s => ({
            ...s,
            academicAlertsCount: Math.max(0, s.academicAlertsCount - 1),
            institutionScore: parseFloat((s.institutionScore + 0.6).toFixed(1))
          }));
          return false;
        }
        return true;
      }));
      triggerToast("Corrections resolved! Scholastic warnings updated.");
    }, 1500);
  };

  // Real-time curve calibration math
  const getCalibratedSubjectScores = () => {
    const subjects = [
      { s: 'Advanced Physics', m: 88.4, v: 2.1, e: 'High' },
      { s: 'Pure Mathematics', m: 92.1, v: -0.4, e: 'Critical' },
      { s: 'World History', m: 84.5, v: 4.2, e: 'High' },
      { s: 'Computer Science', m: 95.8, v: 1.2, e: 'High' }
    ];

    return subjects.map(sub => {
      const adjustedMean = sub.m + gradingCurveSlider;
      let adjustedVariance = sub.v + (gradingCurveSlider * 0.1);
      
      let level = 'High';
      if (adjustedMean >= 90) level = 'Optimal';
      else if (adjustedMean < 85) level = 'Critical';

      return {
        s: sub.s,
        m: `${adjustedMean.toFixed(1)}%`,
        v: adjustedVariance >= 0 ? `+${adjustedVariance.toFixed(1)}%` : `${adjustedVariance.toFixed(1)}%`,
        e: level
      };
    });
  };

  const getCalibratedGPA = () => {
    const baseGPA = 3.65;
    const adjustedGPA = baseGPA + (gradingCurveSlider * 0.02);
    return Math.min(4.0, Math.max(0, adjustedGPA)).toFixed(2);
  };

  const runTranscriptCryptCheck = () => {
    setScannerProgress(0);
    setShowScanCert(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScannerProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setScannerProgress(100);
        setShowScanCert(true);
        triggerToast("Transcript Security Verified Secure");
      }
    }, 150);
  };

  const downloadTranscriptCert = () => {
    const certText = `--- BEGIN EDUPRO SCHOLASTIC COMPLIANCE SIGNATURE ---\nVerification Key: FCC-${Math.floor(100000 + Math.random() * 900000)}\nTimestamp: ${new Date().toISOString()}\nInstitutional GPA Base: ${getCalibratedGPA()} (Curve: ${gradingCurveSlider >= 0 ? `+${gradingCurveSlider}` : gradingCurveSlider}%)\nIntegrity Verification Code: SHA-256:4f3c7a91de88f2177c3e\n--- END EDUPRO SCHOLASTIC COMPLIANCE SIGNATURE ---`;
    const element = document.createElement("a");
    const file = new Blob([certText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `academic-transcript-verification-key.key`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Transcript Key Downloaded");
  };

  const calibratedSubjects = getCalibratedSubjectScores();

  return (
    <div style={{ padding: '32px', backgroundColor: 'var(--bg-body, #f8fafc)', minHeight: '100vh', position: 'relative', transition: 'background-color 0.3s' }}>
      
      {/* --- INSTITUTIONAL PRINT / PORTAL OUTREACH FULL-SCREEN TELEMETRY MODAL --- */}
      <AnimatePresence>
        {activeAction && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '40px', borderRadius: '40px', width: '400px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border-color, #e2e8f0)' }}
            >
               <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '4px solid var(--bg-body, #f1f5f9)', borderTopColor: '#6366f1', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    {activeAction.name === 'print' ? <Printer size={32} /> : 
                     activeAction.name === 'distribute' ? <Share2 size={32} /> : 
                     activeAction.type === 'download' ? <Download size={32} /> : <Eye size={32} />}
                  </div>
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                 {activeAction.name === 'print' ? 'Institutional Print Job' : 
                  activeAction.name === 'distribute' ? 'Parental Distribution' : 'Generating Intelligence'}
               </h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', fontWeight: 500, marginBottom: '24px' }}>
                 {activeAction.name === 'print' ? 'Compiling bulk transcript assets...' : 
                  activeAction.name === 'distribute' ? 'Securing institutional communication channels...' : 
                  `Processing ${activeAction.name}...`}
               </p>
               <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-body, #f1f5f9)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} style={{ height: '100%', backgroundColor: '#6366f1' }} />
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- TOAST NOTIFICATIONS --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{ 
              position: 'fixed', 
              bottom: '40px', 
              left: '50%', 
              zIndex: 1300, 
              backgroundColor: 'var(--text-main, #0f172a)', 
              color: 'var(--bg-card, #ffffff)', 
              padding: '16px 32px', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
              fontWeight: 800, 
              fontSize: '0.9rem', 
              border: '1px solid rgba(255,255,255,0.08)' 
            }}
          >
            <ShieldCheck size={18} color="#10b981" />
            {showToast.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PAGE HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#6366f115', borderRadius: '30px', color: '#6366f1', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <GraduationCap size={16} /> ACADEMIC AUDIT PORTAL
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>
            Academic <span style={{ color: '#6366f1' }}>Reports</span>
          </h1>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '1.1rem', fontWeight: 500 }}>
            Generate comprehensive academic transcripts and performance audits.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => handleAction('print')}
             style={{ 
               padding: '16px 32px', 
               borderRadius: '18px', 
               border: '1px solid var(--border-color, #e2e8f0)', 
               backgroundColor: 'var(--bg-card, #ffffff)', 
               color: 'var(--text-main, #0f172a)', 
               fontWeight: 900, 
               fontSize: '0.9rem', 
               cursor: 'pointer', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '8px', 
               boxShadow: 'var(--shadow-sm)' 
             }}
           >
              <Printer size={18} style={{ color: '#6366f1' }} /> Bulk Print
           </motion.button>
           
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => handleAction('distribute')}
             style={{ 
               padding: '16px 32px', 
               borderRadius: '18px', 
               border: 'none', 
               backgroundColor: 'var(--text-main, #0f172a)', 
               color: 'var(--bg-card, #ffffff)', 
               fontWeight: 950, 
               fontSize: '0.9rem', 
               cursor: 'pointer', 
               display: 'flex', 
               alignItems: 'center', 
               gap: '8px', 
               boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)' 
             }}
           >
              <Share2 size={18} style={{ color: '#6366f1' }} /> Distribute to Parents
           </motion.button>
        </div>
      </div>

      {/* --- CHART & DYNAMIC STATS HUB --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 2fr))', gap: '32px', marginBottom: '32px' }}>
         
         {/* Efficacy Curve Graph */}
         <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '40px', borderRadius: '40px', border: '1px solid var(--border-color, #f1f5f9)', boxShadow: 'var(--shadow-sm)', flex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', margin: 0, letterSpacing: '-0.5px' }}>
                 Institutional Efficacy Trend
               </h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: '#6366f1' }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted, #64748b)' }}>Efficacy Index</span>
               </div>
            </div>
            <div style={{ height: '300px', width: '100%', minHeight: '300px' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={academicData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                        <linearGradient id="efficacyGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #f1f5f9)" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--text-main, #0f172a)', borderRadius: '16px', border: 'none', color: 'var(--bg-card, #ffffff)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                        itemStyle={{ color: '#6366f1', fontWeight: 800 }}
                     />
                     <Area type="monotone" dataKey="efficacy" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#efficacyGradient)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Dynamic Alert & Performance Stat Cards */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            
            {/* Stat Card 1: Institution Score (TRIAGE CARD TRIGGER) */}
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => setTriageOpen(true)}
              style={{ 
                backgroundColor: 'var(--bg-card, #ffffff)', 
                padding: '32px', 
                borderRadius: '32px', 
                border: stats.academicAlertsCount > 0 ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color, #f1f5f9)', 
                boxShadow: stats.academicAlertsCount > 0 ? '0 10px 30px rgba(99, 102, 241, 0.08)' : 'var(--shadow-sm)',
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {stats.academicAlertsCount > 0 && (
                <span style={{ 
                  position: 'absolute', 
                  top: '20px', 
                  right: '20px', 
                  display: 'flex', 
                  height: '10px', 
                  width: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#6366f1'
                }}>
                  <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#6366f1', opacity: 0.75 }} />
                </span>
              )}
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={24} />
                 </div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#10b981', backgroundColor: '#10b98110', padding: '4px 12px', borderRadius: '20px' }}>
                   +1.4%
                 </span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-1px' }}>
                {stats.institutionScore}%
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Institution Score <span style={{ color: '#6366f1' }}>• Triage Warning</span>
              </div>
            </motion.div>

            {/* Stat Card 2: Reports Meta */}
            <motion.div 
              whileHover={{ y: -4 }}
              style={{ 
                backgroundColor: 'var(--bg-card, #ffffff)', 
                padding: '32px', 
                borderRadius: '32px', 
                border: '1px solid var(--border-color, #f1f5f9)', 
                boxShadow: 'var(--shadow-sm)',
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center' 
              }}
              onClick={() => triggerToast(`Active audited repository counts: ${stats.reportsMeta}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#6366f115', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={24} />
                 </div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#6366f1', backgroundColor: '#6366f110', padding: '4px 12px', borderRadius: '20px' }}>
                   +{stats.reportsMeta - 1300} New
                 </span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', letterSpacing: '-1px' }}>
                {stats.reportsMeta.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Transcripts Audited
              </div>
            </motion.div>

         </div>
      </div>

      {/* --- TEMPLATE MANAGEMENT WORKSPACE --- */}
      <div style={{ backgroundColor: 'var(--bg-card, #ffffff)', borderRadius: '32px', border: '1px solid var(--border-color, #f1f5f9)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
         <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color, #f1f5f9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main, #0f172a)', margin: 0 }}>Report Templates</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', fontWeight: 550 }}>Bespoke analytical and predictive scholastic ledger catalogs.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
               
               {/* Popover Filter Selector Menu */}
               <div 
                 onClick={(e) => {
                   e.stopPropagation();
                   setFilterDropdownOpen(!filterDropdownOpen);
                 }}
                 style={{ 
                   padding: '10px 20px', 
                   backgroundColor: 'var(--bg-body, #f8fafc)', 
                   borderRadius: '14px', 
                   color: 'var(--text-muted, #64748b)', 
                   fontSize: '0.85rem', 
                   fontWeight: 750, 
                   cursor: 'pointer',
                   border: '1px solid var(--border-color, #e2e8f0)',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '8px',
                   userSelect: 'none'
                 }}
               >
                 <Filter size={14} /> Filter: {selectedType.toUpperCase()}
               </div>

               <AnimatePresence>
                 {filterDropdownOpen && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     style={{ 
                       position: 'absolute',
                       top: '50px',
                       right: '150px',
                       backgroundColor: 'var(--bg-card, #ffffff)',
                       border: '1px solid var(--border-color, #e2e8f0)',
                       borderRadius: '16px',
                       width: '180px',
                       zIndex: 100,
                       boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                       overflow: 'hidden'
                     }}
                   >
                     {['all', 'Analytical', 'Predictive', 'Statistical', 'Faculty', 'Comparative', 'Merit', 'Custom'].map((t) => (
                       <div 
                         key={t}
                         onClick={() => handleTypeSelect(t)}
                         style={{ 
                           padding: '12px 18px', 
                           fontSize: '0.8rem', 
                           fontWeight: 650, 
                           color: selectedType === t ? '#6366f1' : 'var(--text-main, #0f172a)',
                           cursor: 'pointer',
                           borderBottom: '1px solid var(--border-color, #f1f5f9)',
                           backgroundColor: selectedType === t ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                           transition: '0.2s'
                         }}
                         onMouseOver={(e) => {
                           if (selectedType !== t) e.currentTarget.style.backgroundColor = 'var(--bg-body, #f8fafc)';
                         }}
                         onMouseOut={(e) => {
                           if (selectedType !== t) e.currentTarget.style.backgroundColor = 'transparent';
                         }}
                       >
                         {t.toUpperCase()}
                       </div>
                     ))}
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Open bespoke builder modal */}
               <button 
                onClick={() => setIsCustomModalOpen(true)}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#6366f1', 
                  border: 'none', 
                  borderRadius: '14px', 
                  color: 'white', 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  cursor: 'pointer', 
                  transition: '0.3s',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
               >
                 <Fingerprint size={14} /> Create Custom
               </button>
            </div>
         </div>

         {/* Templates list */}
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '0' }}>
            {filteredTemplates.map((template, i) => (
              <div 
                key={i} 
                style={{ 
                  padding: '28px 32px', 
                  borderBottom: '1px solid var(--border-color, #f1f5f9)', 
                  borderRight: '1px solid var(--border-color, #f1f5f9)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  transition: '0.3s', 
                  cursor: 'pointer' 
                }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.02)'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: 'var(--bg-body, #f8fafc)', border: '1px solid var(--border-color, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                       <BarChart3 size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)', fontSize: '0.95rem' }}>{template.title}</div>
                       <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>
                         <span style={{ color: '#6366f1', fontWeight: 850 }}>{template.type}</span> • Last Generated: {template.lastGen}
                       </div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleAction(template.title, 'view')}
                      style={{ 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color, #e2e8f0)', 
                        backgroundColor: 'var(--bg-card, #ffffff)', 
                        color: 'var(--text-main, #0f172a)', 
                        fontWeight: 800, 
                        fontSize: '0.75rem', 
                        cursor: 'pointer' 
                      }}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDownloadCSV(template)}
                      style={{ 
                        padding: '8px 12px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        backgroundColor: '#6366f1', 
                        color: 'white', 
                        fontWeight: 800, 
                        fontSize: '0.75rem', 
                        cursor: 'pointer' 
                      }}
                    >
                      <Download size={14} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* --- REPORT DETAIL CURVE ADJUSTER PREVIEW MODAL --- */}
      <AnimatePresence>
        {previewReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 40 }}
               style={{ 
                 backgroundColor: 'var(--bg-card, #ffffff)', 
                 width: '100%', 
                 maxWidth: '1240px', 
                 height: '90vh', 
                 borderRadius: '48px', 
                 overflow: 'hidden', 
                 display: 'flex', 
                 boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                 border: '1px solid var(--border-color, #e2e8f0)'
               }}
             >
                {/* Left Panel: Detailed Scholastic Report Sheet */}
                <div style={{ flex: 1.3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  {/* Preview Modal Header */}
                  <div style={{ padding: '32px 48px', borderBottom: '1px solid var(--border-color, #f1f5f9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-body, #f8fafc)' }}>
                     <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                           <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} /></div>
                           <h2 style={{ fontSize: '1.6rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', margin: 0, letterSpacing: '-1px' }}>{previewReport}</h2>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-muted, #64748b)', fontWeight: 600, fontSize: '0.85rem' }}>
                          Institutional Audit Copy • Generated {new Date().toLocaleDateString()}
                        </p>
                     </div>
                     <div style={{ display: 'flex', gap: '16px' }}>
                        <button 
                          onClick={() => handleAction(previewReport, 'download')}
                          style={{ 
                            padding: '12px 24px', 
                            borderRadius: '14px', 
                            border: 'none', 
                            backgroundColor: 'var(--text-main, #0f172a)', 
                            color: 'var(--bg-card, #ffffff)', 
                            fontWeight: 800, 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px' 
                          }}
                        >
                          <Download size={18} /> Export PDF
                        </button>
                        
                        <button 
                          onClick={() => setPreviewReport(null)} 
                          style={{ 
                            width: '56px', 
                            height: '56px', 
                            borderRadius: '18px', 
                            border: '1px solid var(--border-color, #e2e8f0)', 
                            backgroundColor: 'var(--bg-card, #ffffff)', 
                            color: 'var(--text-muted, #64748b)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: 'pointer', 
                            transition: '0.3s' 
                          }} 
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} 
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card, #ffffff)'}
                        >
                          <X size={24} />
                        </button>
                     </div>
                  </div>

                  {/* Dynamic Report Content Panel */}
                  <div style={{ flex: 1, padding: '48px', overflowY: 'auto', backgroundColor: 'var(--bg-body, #fdfdfd)' }}>
                     <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'var(--bg-card, #ffffff)', padding: '60px', borderRadius: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid var(--border-color, #f1f5f9)' }}>
                        
                        <div style={{ borderBottom: '2px solid var(--text-main, #0f172a)', paddingBottom: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                           <div>
                              <div style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main, #0f172a)' }}>EDUPRO ELITE ACADEMY</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted, #64748b)' }}>Institutional Excellence Since 2024</div>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>REPORT ID: #AR-2026-942</div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>{new Date().toLocaleString()}</div>
                           </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px' }}>
                           <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color, #f1f5f9)' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Target Cohort</div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--text-main, #0f172a)' }}>Grade 12 - Section A</div>
                           </div>
                           <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color, #f1f5f9)' }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Metric Profile</div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--text-main, #0f172a)' }}>Weighted GPA / Mastery Index</div>
                           </div>
                        </div>

                        {/* Subject Table with Dynamic Calibrated Marks */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '48px' }}>
                           <thead>
                              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8' }}>SUBJECT</th>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8' }}>MEAN MARKS</th>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8' }}>VARIANCE</th>
                                 <th style={{ padding: '16px 0', fontSize: '0.8rem', fontWeight: 900, color: '#94a3b8' }}>EFFICACY</th>
                              </tr>
                           </thead>
                           <tbody>
                              {calibratedSubjects.map((row, i) => (
                                 <tr key={i} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                                    <td style={{ padding: '20px 0', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{row.s}</td>
                                    <td style={{ padding: '20px 0', fontWeight: 700, color: 'var(--text-muted, #475569)' }}>{row.m}</td>
                                    <td style={{ padding: '20px 0', fontWeight: 700, color: row.v.startsWith('+') ? '#10b981' : '#ef4444' }}>{row.v}</td>
                                    <td style={{ padding: '20px 0' }}>
                                       <span style={{ padding: '4px 12px', borderRadius: '10px', backgroundColor: row.e === 'Optimal' || row.e === 'High' ? '#10b98115' : '#ef444415', color: row.e === 'Optimal' || row.e === 'High' ? '#10b981' : '#ef4444', fontSize: '0.7rem', fontWeight: 900 }}>{row.e.toUpperCase()}</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>

                        <div style={{ backgroundColor: 'var(--text-main, #0f172a)', padding: '32px', borderRadius: '24px', color: 'white' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                              <ShieldCheck size={20} color="#10b981" />
                              <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>ADMINISTRATIVE SUMMARY</span>
                           </div>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, fontWeight: 500 }}>
                              Institutional data confirms a 12.4% increase in academic efficacy across STEM subjects. Corrective measures are recommended for Pure Mathematics variance modeling.
                           </p>
                        </div>
                     </div>
                  </div>
                  
                  <div style={{ padding: '24px 48px', backgroundColor: 'var(--bg-body, #f8fafc)', borderTop: '1px solid var(--border-color, #f1f5f9)', textAlign: 'center' }}>
                     <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>CONFIDENTIAL SYSTEM GENERATED REPORT • EDUPRO ELITE INSTITUTIONAL ENGINE v3.0</p>
                  </div>
                </div>

                {/* Right Panel: Grading Curve Adjuster Slider & Scanners */}
                <div style={{ flex: 0.7, borderLeft: '1px solid var(--border-color, #e2e8f0)', padding: '40px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-card, #ffffff)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', marginTop: 0, marginBottom: '24px', letterSpacing: '-0.5px' }}>
                    Scholastic Adjusters
                  </h3>

                  {/* Curve Calibration Slider */}
                  <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', padding: '24px', borderRadius: '24px', border: '1px solid var(--border-color, #f1f5f9)', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', display: 'flex', alignItems: 'center', gap: '6px' }}><Scale size={16} /> Grading Scale Calibration</label>
                      <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#6366f1' }}>{gradingCurveSlider >= 0 ? `+${gradingCurveSlider}` : gradingCurveSlider}%</span>
                    </div>
                    
                    <input 
                      type="range"
                      min="-10"
                      max="10"
                      value={gradingCurveSlider}
                      onChange={(e) => setGradingCurveSlider(parseInt(e.target.value))}
                      style={{ 
                        width: '100%', 
                        accentColor: '#6366f1', 
                        cursor: 'pointer',
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--border-color, #e2e8f0)'
                      }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted, #64748b)', marginTop: '8px', fontWeight: 600 }}>
                      <span>-10% Strict</span>
                      <span>0% Raw</span>
                      <span>+10% Curved</span>
                    </div>
                  </div>

                  {/* Dynamic Math Output Panel */}
                  <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', padding: '28px', borderRadius: '24px', border: '1px solid var(--border-color, #f1f5f9)', marginBottom: '32px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main, #0f172a)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Dynamic Calibrated Metrics
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>Projected GPA Equivalent:</span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 950, color: '#6366f1' }}>{getCalibratedGPA()} / 4.00</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>Academic Tier:</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                          {gradingCurveSlider >= 5 ? 'A+ High honors' : gradingCurveSlider <= -5 ? 'Rigorous Bounds' : 'Standard Baseline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Transcript Scanner */}
                  <div style={{ backgroundColor: 'var(--text-main, #0f172a)', padding: '24px', borderRadius: '24px', color: '#6366f1', fontFamily: 'monospace', fontSize: '0.8rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={14} />
                        <span>TRANSCRIPT INTEGRITY SCAN</span>
                      </div>
                      <span>{scannerProgress !== null ? `${scannerProgress}%` : 'READY'}</span>
                    </div>

                    {scannerProgress !== null && scannerProgress < 100 && (
                      <div style={{ height: '4px', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${scannerProgress}%`, height: '100%', backgroundColor: '#6366f1', transition: 'width 0.15s' }} />
                      </div>
                    )}

                    {scannerProgress === 100 && (
                      <div style={{ color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                        <CheckCircle2 size={14} /> COMPLIANCE SEAL ACQUIRED
                      </div>
                    )}

                    {scannerProgress === null ? (
                      <button 
                        onClick={runTranscriptCryptCheck}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                          color: '#6366f1',
                          fontWeight: 800,
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: 'sans-serif'
                        }}
                      >
                        Verify Scholastic Compliance
                      </button>
                    ) : showScanCert ? (
                      <motion.button 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={downloadTranscriptCert}
                        style={{ 
                          marginTop: '16px', 
                          width: '100%', 
                          padding: '12px', 
                          borderRadius: '12px', 
                          backgroundColor: 'rgba(52, 211, 153, 0.15)', 
                          border: '1px solid rgba(52, 211, 153, 0.3)', 
                          color: '#34d399', 
                          fontWeight: 800, 
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontFamily: 'sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <Download size={14} /> Download Compliance Key
                      </motion.button>
                    ) : null}
                  </div>

                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BESPOKE SCHOLASTIC REPORT BUILDER MODAL --- */}
      <AnimatePresence>
        {isCustomModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(15px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
               style={{ backgroundColor: 'var(--bg-card, #ffffff)', padding: '48px', borderRadius: '48px', width: '600px', boxShadow: '0 50px 100px rgba(0,0,0,0.3)', border: '1px solid var(--border-color, #f1f5f9)' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                   <div>
                      <h2 style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-main, #0f172a)', margin: 0, letterSpacing: '-1.5px' }}>Academic <span style={{ color: '#6366f1' }}>Builder</span></h2>
                      <p style={{ margin: '8px 0 0', color: 'var(--text-muted, #64748b)', fontWeight: 600, fontSize: '0.95rem' }}>Configure bespoke scholastic analytics.</p>
                   </div>
                   <button onClick={() => setIsCustomModalOpen(false)} style={{ width: '48px', height: '48px', borderRadius: '14px', border: 'none', backgroundColor: 'var(--bg-body, #f1f5f9)', color: 'var(--text-muted, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Target Examination</label>
                      <select 
                        value={customExam}
                        onChange={(e) => setCustomExam(e.target.value)}
                        style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '2px solid var(--border-color, #f1f5f9)', outline: 'none', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main, #0f172a)', backgroundColor: 'var(--bg-card, #ffffff)' }}
                      >
                         <option>Final Term Audit 2025</option>
                         <option>Mid-Semester Assessment</option>
                         <option>Unit Performance Review</option>
                      </select>
                   </div>

                   <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Comparison Metrics</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                         {['Attendance Correlation', 'Subject Mastery', 'Behavioral Index', 'Previous Term Delta'].map((m) => {
                           const active = selectedMetrics.includes(m);
                           return (
                             <div 
                               key={m} 
                               onClick={() => toggleMetric(m)}
                               style={{ 
                                 padding: '14px', 
                                 borderRadius: '14px', 
                                 backgroundColor: active ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-body, #f8fafc)', 
                                 border: '1px solid', 
                                 borderColor: active ? '#6366f1' : 'var(--border-color, #f1f5f9)', 
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 gap: '10px', 
                                 cursor: 'pointer' 
                               }}
                             >
                                <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid', borderColor: active ? '#6366f1' : '#cbd5e1', backgroundColor: active ? '#6366f1' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                   {active && <X size={12} color="white" strokeWidth={4} />}
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: active ? 'var(--text-main, #0f172a)' : 'var(--text-muted, #64748b)' }}>{m}</span>
                             </div>
                           );
                         })}
                      </div>
                   </div>
                </div>

                <div style={{ marginTop: '48px', display: 'flex', gap: '16px' }}>
                   <button 
                     onClick={handleCreateCustomReport}
                     style={{ flex: 1, padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: 'var(--text-main, #0f172a)', color: 'var(--bg-card, #ffffff)', fontWeight: 950, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                   >
                      Generate Custom Insight
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SCHOLASTIC WARNINGS REMEDIAL TRIAGE DRAWER --- */}
      <AnimatePresence>
        {triageOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setTriageOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'black', zIndex: 990 }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                bottom: 0, 
                width: '560px', 
                backgroundColor: 'var(--bg-card, #ffffff)', 
                zIndex: 1000, 
                boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
                padding: '40px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border-color, #e2e8f0)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: '#6366f1', margin: 0, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={24} /> Scholastic Triage
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', fontWeight: 550 }}>
                    Students displaying learning delta indices. Issue remedial dispatches.
                  </p>
                </div>
                <button 
                  onClick={() => setTriageOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #64748b)' }}
                >
                  <X size={24} />
                </button>
              </div>

              {triageItems.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted, #64748b)', gap: '16px' }}>
                  <ShieldCheck size={48} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>All Scholastic Warnings Cleared!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                  {triageItems.map((item) => (
                    <div 
                      key={item.id} 
                      style={{ 
                        padding: '20px', 
                        borderRadius: '20px', 
                        backgroundColor: 'var(--bg-body, #f8fafc)', 
                        border: '1px solid var(--border-color, #f1f5f9)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)', fontSize: '0.95rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginTop: '4px' }}>
                          {item.grade} • <span style={{ color: '#6366f1', fontWeight: 800 }}>{item.score}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button 
                          disabled={item.outreachActive}
                          onClick={() => handleIssueRemedial(item.id)}
                          style={{ 
                            padding: '10px 16px', 
                            borderRadius: '12px', 
                            border: 'none', 
                            backgroundColor: item.outreachActive ? 'var(--border-color, #e2e8f0)' : '#6366f1', 
                            color: 'white', 
                            fontWeight: 800, 
                            fontSize: '0.75rem', 
                            cursor: item.outreachActive ? 'not-allowed' : 'pointer',
                            boxShadow: item.outreachActive ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.2)'
                          }}
                        >
                          {item.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AcademicReports;
