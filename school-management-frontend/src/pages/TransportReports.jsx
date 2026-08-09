import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, Download, Filter, Search, 
  ChevronRight, BarChart3, TrendingUp, MapPin,
  Fuel, Settings, ShieldCheck, FileText,
  Activity, Clock, X, CheckCircle2, AlertCircle, Sparkles,
  User, Eye, Calendar, HardDrive, Check
} from 'lucide-react';

const TransportReports = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);

  const showToast = (message, type = 'success', title = null) => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const transportTemplates = [
    { 
      title: 'Fleet Fuel Efficiency Audit', 
      type: 'Logistics', 
      lastGen: '1 day ago',
      size: '142 KB',
      hash: 'SHA-256-48EF92BC1A832A',
      rows: [
        { vehicle: 'BUS-201-A', type: 'Heavy School Bus', efficiency: '12.4 km/l', health: '94%', status: 'Optimal' },
        { vehicle: 'BUS-202-B', type: 'Heavy School Bus', efficiency: '11.8 km/l', health: '91%', status: 'Optimal' },
        { vehicle: 'VAN-104-C', type: 'Light Shuttle Van', efficiency: '14.2 km/l', health: '96%', status: 'Optimal' },
        { vehicle: 'CAR-052-D', type: 'Faculty Patrol Sedan', efficiency: '15.6 km/l', health: '98%', status: 'Optimal' },
        { vehicle: 'BUS-108-F', type: 'Support Transport', efficiency: '8.5 km/l', health: '72%', status: 'Inspection Required' }
      ]
    },
    { 
      title: 'Route Optimization & Latency Report', 
      type: 'Operational', 
      lastGen: '3 days ago',
      size: '210 KB',
      hash: 'SHA-256-0F928A941BC83B',
      rows: [
        { route: 'Route North A', activeDriver: 'Rajesh Yadav', schedule: 'Morning Core', avgLatency: '+2 mins', status: 'On Time' },
        { route: 'Route East B', activeDriver: 'Sunita Rao', schedule: 'Morning Core', avgLatency: '+15 mins', status: 'Delayed' },
        { route: 'Route South-West C', activeDriver: 'Dilip Rao', schedule: 'Afternoon Shuttle', avgLatency: '+0 mins', status: 'On Time' },
        { route: 'Express Route D', activeDriver: 'Lata Sharma', schedule: 'Faculty Special', avgLatency: '+4 mins', status: 'On Time' }
      ]
    },
    { 
      title: 'Driver Safety & Performance Log', 
      type: 'HR/Safety', 
      lastGen: '1 week ago',
      size: '95 KB',
      hash: 'SHA-256-77DA102BB9E094',
      rows: [
        { driver: 'Rajesh Yadav', tenure: '4 Years', score: '98/100', incidents: '0', standing: 'Excellent' },
        { driver: 'Sunita Rao', tenure: '6 Years', score: '99/100', incidents: '0', standing: 'Excellent' },
        { driver: 'Dilip Rao', tenure: '1 Year', score: '76/100', incidents: '1 (Hard Brake)', standing: 'Review Needed' },
        { driver: 'Lata Sharma', tenure: '3 Years', score: '95/100', incidents: '0', standing: 'Good' }
      ]
    },
    { 
      title: 'Vehicle Maintenance & Life Cycle', 
      type: 'Asset', 
      lastGen: '10 days ago',
      size: '340 KB',
      hash: 'SHA-256-32A44B9E09529F',
      rows: [
        { vehicle: 'BUS-201-A', service: 'Brake Fluid Refresh', mileage: '48,200 km', cost: '$420', status: 'Cleared' },
        { vehicle: 'BUS-202-B', service: 'Tire Realignment', mileage: '52,100 km', cost: '$280', status: 'Cleared' },
        { vehicle: 'VAN-104-C', service: 'Full Engine Tuneup', mileage: '12,400 km', cost: '$850', status: 'Cleared' },
        { vehicle: 'BUS-108-F', service: 'Transmission Check', mileage: '94,500 km', cost: '$1,400', status: 'Pending Approval' }
      ]
    },
    { 
      title: 'Student Transport Subscription Audit', 
      type: 'Financial', 
      lastGen: '2 weeks ago',
      size: '185 KB',
      hash: 'SHA-256-99A102CC54EE9B',
      rows: [
        { cohort: 'Grade 10 Active', students: '42 Subscribed', billing: 'Monthly Recur', revenue: '$5,040', ledger: 'Synchronized' },
        { cohort: 'Grade 11 Active', students: '30 Subscribed', billing: 'Term Lump', revenue: '$10,800', ledger: 'Synchronized' },
        { cohort: 'Grade 12 Active', students: '45 Subscribed', billing: 'Monthly Recur', revenue: '$5,400', ledger: 'Synchronized' }
      ]
    },
    { 
      title: 'Emergency Response & Incident Logs', 
      type: 'Security', 
      lastGen: '1 month ago',
      size: '64 KB',
      hash: 'SHA-256-11FFCC33BBDD04',
      rows: [
        { date: 'May 12, 2026', vehicle: 'BUS-202-B', detail: 'Minor fender scrape during parking', resolution: 'Resolved YTD', code: 'LOG-INC-092' },
        { date: 'April 20, 2026', vehicle: 'VAN-104-C', detail: 'Flat tire swap on Route West', resolution: 'Resolved YTD', code: 'LOG-INC-084' }
      ]
    },
  ];

  const handleExportFleetLog = () => {
    showToast("Compiling master logistics ledger database...", "info", "Fleet Audit");
    const csvContent = [
      ['Vehicle/Fleet ID', 'Type', 'Average Fuel Efficiency', 'Route On-Time Rate', 'Health Rating'],
      ['BUS-201-A', 'Heavy School Bus', '12.4 km/l', '96.8%', '94/100'],
      ['BUS-202-B', 'Heavy School Bus', '11.8 km/l', '95.2%', '91/100'],
      ['VAN-104-C', 'Light Shuttle Van', '14.2 km/l', '98.1%', '96/100'],
      ['CAR-052-D', 'Faculty Patrol Sedan', '15.6 km/l', '99.0%', '98/100'],
      ['BUS-108-F', 'Support Transport', '8.5 km/l', '72.0%', '72/100'],
      ['Audit Timestamp', new Date().toISOString()],
      ['Status', 'Sovereign Integrity Verified']
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Master_Fleet_Audit_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast("Fleet logs ledger compiled and exported.", "success", "Export Complete");
    }, 1200);
  };

  const handleDownloadTemplate = (template) => {
    showToast(`Generating report for "${template.title}"...`, "info", "Export CSV");
    
    // Dynamically compile rows data to CSV if available
    let csvContent = [
      ['Report Category', 'Audit Detail Log'],
      ['Report Title', template.title],
      ['Classification Type', template.type],
      ['Last Generated Sync', template.lastGen],
      ['Verification Hash', template.hash || 'SHA-256-48EF92BC1A832A'],
      ['Security Certification', 'EduPro Logistics Verified'],
      ['Export Date', new Date().toLocaleDateString()],
      [],
      // CSV Data Headers
      template.rows && template.rows.length > 0 ? Object.keys(template.rows[0]).map(k => k.toUpperCase()) : ['No specific row headers']
    ];

    if (template.rows) {
      template.rows.forEach(row => {
        csvContent.push(Object.values(row));
      });
    }
    
    const finalCsvString = csvContent.map(e => e.join(",")).join("\n");
    const blob = new Blob([finalCsvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${template.title.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      showToast("Logistics report downloaded successfully.", "success", "Download Complete");
    }, 1200);
  };

  const filteredTemplates = filterType === 'All' 
    ? transportTemplates 
    : transportTemplates.filter(t => t.type === filterType);

  return (
    <div style={{ padding: '32px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--primary-light)', borderRadius: '30px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
             <Bus size={16} /> LOGISTICS & FLEET AUDIT
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, margin: '0 0 8px 0' }}>
            Transport <span style={{ color: 'var(--primary)' }}>Reports</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>High-fidelity logistics auditing and vehicle performance tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => {
               showToast("Navigating to Fleet Route registry...", "info", "Routes Directory");
               setTimeout(() => navigate('/dashboard/route-list'), 600);
             }}
             style={{ padding: '16px 32px', borderRadius: '18px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
           >
             Route Analytics
           </motion.button>
           <motion.button 
             whileHover={{ scale: 1.02, translateY: -2 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleExportFleetLog}
             style={{ padding: '16px 32px', borderRadius: '18px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(69, 179, 224, 0.2)' }}
           >
              <Download size={18} /> Export Fleet Log
           </motion.button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
         {[
           { label: 'Avg. Fuel Efficiency', value: '12.4 km/l', trend: '+4.2%', icon: Fuel, color: 'var(--success)' },
           { label: 'Route On-Time Rate', value: '96.8%', trend: '+1.5%', icon: Clock, color: 'var(--primary)' },
           { label: 'Active Fleet Health', value: '92/100', trend: 'Stable', icon: ShieldCheck, color: 'var(--warning)' },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             whileHover={{ y: -6 }}
             onClick={() => {
              showToast(`Logistics analysis: ${stat.label} verified at ${stat.value}.`, "info", "Fleet Metrics");
              if (stat.label === 'Route On-Time Rate') {
                setTimeout(() => navigate('/dashboard/route-list'), 1000);
              } else if (stat.label === 'Active Fleet Health') {
                setTimeout(() => navigate('/dashboard/vehicle-registry'), 1000);
              }
            }}
            style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', cursor: 'pointer' }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={24} />
                 </div>
                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: stat.color }}>{stat.trend}</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-1px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>{stat.label}</div>
           </motion.div>
         ))}
      </div>

      {/* Templates Section */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '32px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Logistics Templates</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div 
                 onClick={() => {
                   showToast("Fleet filter synchronized by vehicle class.", "info", "Filters Sync");
                   setFilterType(filterType === 'All' ? 'Logistics' : 'All');
                 }}
                 style={{ padding: '8px 16px', backgroundColor: filterType !== 'All' ? 'var(--primary-light)' : 'var(--bg-body)', border: `1px solid ${filterType !== 'All' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '12px', color: filterType !== 'All' ? 'var(--primary)' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
               >
                 Filter By Logistics
               </div>
               <div 
                 onClick={() => {
                   showToast("Loading comprehensive historical daily registers...", "success", "Daily Sync");
                   setTimeout(() => navigate('/dashboard/transport'), 1000);
                 }}
                 style={{ padding: '8px 16px', backgroundColor: 'var(--text-main)', borderRadius: '12px', color: 'var(--bg-card)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
               >
                 Daily Logs
               </div>
            </div>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '0' }}>
            {filteredTemplates.map((template, i) => (
              <div 
                key={i} 
                style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.3s', cursor: 'pointer' }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                       <Activity size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{template.title}</div>
                       <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{template.type} • Last Gen: {template.lastGen}</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedReport(template);
                        showToast(`Displaying preview for "${template.title}".`, "success", "Report Preview");
                      }}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={12} /> View
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadTemplate(template)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      <Download size={14} />
                    </motion.button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Interactive Structured Report Preview Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              style={{ backgroundColor: 'var(--bg-card)', padding: '36px', borderRadius: '28px', width: '100%', maxWidth: '800px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {selectedReport.type}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{selectedReport.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  style={{ padding: '8px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Meta information row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '16px 24px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Last Generated</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{selectedReport.lastGen}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HardDrive size={16} color="var(--success)" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>File Size</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{selectedReport.size}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={16} color="var(--warning)" />
                  <div>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Security Hash</span>
                    <strong style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>{selectedReport.hash.slice(0, 15)}...</strong>
                  </div>
                </div>
              </div>

              {/* Live Telemetry Data Table Preview */}
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Audited Telemetry Logs</h4>
              <div style={{ overflowX: 'auto', maxHeight: '280px', marginBottom: '28px', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-body)', borderBottom: '1px solid var(--border-color)' }}>
                      {selectedReport.rows && selectedReport.rows.length > 0 && Object.keys(selectedReport.rows[0]).map((key, idx) => (
                        <th key={idx} style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.rows && selectedReport.rows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: idx !== selectedReport.rows.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-main)' }}>
                            {typeof val === 'string' && val.includes('Optimal') || val.includes('On Time') || val.includes('Excellent') || val.includes('Cleared') || val.includes('Synchronized') ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontWeight: 800, fontSize: '0.75rem' }}>
                                <Check size={10} /> {val}
                              </span>
                            ) : typeof val === 'string' && val.includes('Delayed') || val.includes('Review') || val.includes('Inspection') || val.includes('Pending') ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', fontWeight: 800, fontSize: '0.75rem' }}>
                                <AlertCircle size={10} /> {val}
                              </span>
                            ) : (
                              val
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <button 
                  onClick={() => setSelectedReport(null)}
                  style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                >
                  Close Preview
                </button>
                <button 
                  onClick={() => {
                    handleDownloadTemplate(selectedReport);
                    setSelectedReport(null);
                  }}
                  style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Download size={16} /> Download Full CSV
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Toast Notification Drawer */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              maxWidth: '400px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: toast.type === 'success' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : toast.type === 'error' 
                  ? 'rgba(239, 68, 68, 0.15)'
                  : toast.type === 'warning'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(99, 102, 241, 0.15)',
                color: toast.type === 'success' 
                  ? '#34d399' 
                  : toast.type === 'error' 
                  ? '#f87171'
                  : toast.type === 'warning'
                  ? '#fbbf24'
                  : '#818cf8',
                flexShrink: 0,
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 size={20} />
              ) : toast.type === 'error' ? (
                <AlertCircle size={20} />
              ) : toast.type === 'warning' ? (
                <Clock size={20} />
              ) : (
                <Sparkles size={20} />
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              {toast.title && (
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                  {toast.title}
                </h4>
              )}
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransportReports;
