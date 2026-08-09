/* EduPro Elite - Ultra-Premium Asset Reports Portal v3.0 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Download, Filter, Search, 
  ChevronRight, BarChart3, TrendingUp, Bus,
  Library, Database, Archive, Layers,
  Activity, ArrowUpRight, X, Scan, Wrench, 
  CheckCircle2, RefreshCw, ShieldAlert, FileText 
} from 'lucide-react';

const InventoryReports = () => {
  // --- STATE SYSTEM ---
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [showToast, setShowToast] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    tracked: 1240,
    lowStock: 6,
    fleet: '98%',
    circulation: 420
  });

  // Triage items for critical low stock
  const [triageItems, setTriageItems] = useState([
    { id: 1, name: 'Grade 12 Physics Chemical Acid', category: 'Infrastructure', quantity: '2 bottles remaining', limit: '10 bottles minimum', orderActive: false },
    { id: 2, name: 'Main Campus Server Fiber Patch Cable', category: 'Operational', quantity: '1 cable remaining', limit: '5 cables minimum', orderActive: false },
    { id: 3, name: 'School Bus 4 Ceramic Brake Pads', category: 'Transport', quantity: '0 sets remaining', limit: '2 sets minimum', orderActive: false },
    { id: 4, name: 'Chemistry Lab Glass Beakers (500ml)', category: 'Infrastructure', quantity: '4 sets remaining', limit: '15 sets minimum', orderActive: false },
    { id: 5, name: 'Library Barcode Scanners (USB)', category: 'Operational', quantity: '1 scanner remaining', limit: '3 scanners minimum', orderActive: false },
    { id: 6, name: 'Canteen Disposable Paper Plates', category: 'Services', quantity: '100 units remaining', limit: '500 units minimum', orderActive: false }
  ]);

  const [triageOpen, setTriageOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [healthSlider, setHealthSlider] = useState(90);
  const [scannerProgress, setScannerProgress] = useState(null);
  const [showScanCert, setShowScanCert] = useState(false);

  // Archive Telemetry Sweep state
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiveProgress, setArchiveProgress] = useState(0);
  const [archiveLogs, setArchiveLogs] = useState([]);
  const [archiveStatus, setArchiveStatus] = useState('idle');

  // Click outside listener to dismiss category popover
  useEffect(() => {
     const dismissFilters = () => setCategoryFilterOpen(false);
     window.addEventListener('click', dismissFilters);
     return () => window.removeEventListener('click', dismissFilters);
  }, []);

  const triggerToast = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // --- INTERACTION LOGIC ---

  // Category change helper
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    triggerToast(`Filter Adjusted to: ${cat.toUpperCase()}`);
  };

  // 1. Archive sweep simulation
  const executeArchiveSweep = () => {
    setArchiveOpen(true);
    setArchiveStatus('running');
    setArchiveProgress(0);
    setArchiveLogs([]);

    const steps = [
      { p: 15, m: '[ARCHIVE] Searching expired hardware diagnostics cache...' },
      { p: 35, m: '[ARCHIVE] Removing baseline utilization records older than 365 days... OK' },
      { p: 60, m: '[DATABASE] De-fragmenting operational ledger indices...' },
      { p: 80, m: '[VAULT] Compiling historical metadata archives... ENCRYPTED' },
      { p: 100, m: '[SYSTEM] Archive sweep complete. 4.2 MB storage cache cleared.' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        setArchiveProgress(step.p);
        setArchiveLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${step.m}`]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setArchiveStatus('completed');
        triggerToast('Operational Cache Archives Swept');
      }
    }, 450);
  };

  // 2. Export inventory database to JSON
  const handleExportDatabase = () => {
    const fullDB = {
      timestamp: new Date().toISOString(),
      governance: 'EDUPRO ELITE AUDIT v3.0',
      stats: stats,
      criticalStock: triageItems,
      catalogs: assetTemplates
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDB, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "institutional-inventory-database.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('JSON Inventory Exported');
  };

  // 3. Procure / Restock triage low stock items
  const initiateProcurementOrder = (id, name) => {
    setTriageItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, orderActive: true };
      }
      return item;
    }));

    setTimeout(() => {
      // Remove ordered item, decrement lowStock count, increase tracked count by mock values
      setTriageItems(prev => prev.filter(item => item.id !== id));
      setStats(prev => ({
        ...prev,
        lowStock: Math.max(0, prev.lowStock - 1),
        tracked: prev.tracked + 12
      }));
      triggerToast(`Restock Request Sent for ${name.substring(0, 15)}...`);
    }, 1800);
  };

  // 4. Download individual template logs as CSV
  const handleDownloadCSV = (template, e) => {
    if (e) e.stopPropagation();
    
    // Create structured mock serial data based on template type
    const header = "ASSET ID,ITEM MODEL,SERIAL NUMBER,DEPLOMENT ZONE,HEALTH RATING,VERIFICATION\n";
    const rows = [
      `AST-901,${template.title.substring(0, 20)} Model-A,SN-8F9D7C2B4,Zone-Alpha,94%,COMPLIANT`,
      `AST-902,${template.title.substring(0, 20)} Model-A,SN-2D9K4H1M8,Zone-Gamma,88%,COMPLIANT`,
      `AST-903,${template.title.substring(0, 20)} Model-B,SN-6C4N8V9X0,Zone-Beta,91%,COMPLIANT`,
      `AST-904,${template.title.substring(0, 20)} Model-A,SN-3H4P8Y9T2,Zone-Delta,82%,COMPLIANT`,
    ].join('\n');

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `${template.title.toLowerCase().replace(/\s+/g, '-')}-log.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast(`${template.type} CSV Downloaded`);
  };

  // 5. Template drawer inspection details
  const openTemplateDrawer = (template) => {
     setSelectedTemplate(template);
     setHealthSlider(90);
     setScannerProgress(null);
     setShowScanCert(false);
  };

  // Run custom drawer diagnostics
  const runTemplateDiagnostics = () => {
    setScannerProgress(0);
    const interval = setInterval(() => {
      setScannerProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
             setScannerProgress(null);
             setShowScanCert(true);
             triggerToast('Asset Integrity Scan Complete');
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Download custom asset certificate
  const downloadAssetCertificate = (template) => {
    const certText = `==================================================
EDUPRO ELITE INSTITUTIONAL ASSET INTEGRITY CERTIFICATE
==================================================
Registry: ${template.title}
Asset Category: ${template.type}
Total Catalogued: ${template.totalUnits}
Calibrated Condition: ${template.condition}
Manager: ${template.manager}
Health Index Score: ${healthSlider}%
Calibration Cycle Lifetime: ${Math.round((healthSlider / 10) * 1.5)} Years
Audit Signature HASH: 0xEE7D91C49A28B3746D29

Status Statement: This asset index compiles with national school resources parameters and has been calibrated at ${healthSlider}% stability outcome.
Generated on: ${new Date().toLocaleString()}
==================================================`;
    
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(certText);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${template.title.toLowerCase().replace(/\s+/g, '-')}-health-cert.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- Mock Templates & Filtering Data ---
  const assetTemplates = [
    { id: 1, title: 'School Bus Fleet Utilization Log', type: 'Transport', lastGen: '2 days ago', totalUnits: '12 Buses', inUse: '10', reserved: '2', condition: 'Excellent', manager: 'Chief Officer Rajesh Yadav' },
    { id: 2, title: 'Library Book Circulation Audit', type: 'Academic Support', lastGen: '5 days ago', totalUnits: '42,000 volumes', inUse: '420 circulating', reserved: '1,200 requests', condition: 'Optimal', manager: 'Librarian Sunita Rao' },
    { id: 3, title: 'Laboratory Equipment Health Index', type: 'Infrastructure', lastGen: '1 week ago', totalUnits: '480 items', inUse: '380 active', reserved: '20 in vault', condition: 'Stable', manager: 'Prof. Amit Bose' },
    { id: 4, title: 'Digital Asset & IT Inventory', type: 'Operational', lastGen: '10 days ago', totalUnits: '820 Devices', inUse: '780 client PCs', reserved: '40 spares', condition: 'Optimal', manager: 'Director Aarav Sharma' },
    { id: 5, title: 'Canteen Stock Consumption Report', type: 'Services', lastGen: '12 days ago', totalUnits: '15 Supply Lines', inUse: '6 active', reserved: '9 stockrooms', condition: 'Stable', manager: 'Catering Lead Sunita Sharma' },
    { id: 6, title: 'Stationery & Supplies Audit', type: 'General', lastGen: '2 weeks ago', totalUnits: '6,200 catalogued', inUse: '4,100 distributed', reserved: '2,100 reserve', condition: 'Good', manager: 'Admin Services Team' },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? assetTemplates 
    : assetTemplates.filter(t => t.type.toLowerCase() === selectedCategory.toLowerCase() || (selectedCategory === 'operational' && t.type === 'Operational') || (selectedCategory === 'academic' && t.type === 'Academic Support'));

  return (
    <div style={{ padding: '40px', backgroundColor: 'var(--bg-body)', minHeight: '100vh', color: 'var(--text-main)', position: 'relative' }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{ position: 'fixed', bottom: '40px', left: '50%', zIndex: 2500, backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', padding: '16px 32px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: 'var(--shadow-xl)', fontWeight: 800, fontSize: '0.9rem', border: '1px solid var(--border-color)' }}
          >
            <CheckCircle2 size={18} color="#ec4899" />
            {showToast.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap', gap: '24px' }}>
        <div>
           <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#ec489915', borderRadius: '30px', color: '#ec4899', fontWeight: 950, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '24px' }}>
             <Package size={14} /> ASSET & INVENTORY PORTAL v3.0
          </div>
          <h1 style={{ fontSize: '4.2rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-4px', lineHeight: 0.9, marginBottom: '16px' }}>
             Asset <span style={{ color: '#ec4899' }}>Reports</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500, maxWidth: '600px' }}>Lifecycle tracking and utilization auditing for institutional resources.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
           <button 
             onClick={executeArchiveSweep}
             style={{ padding: '16px 32px', borderRadius: '20px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.3s' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
           >
              <Archive size={18} /> Archive Old Logs
           </button>
           <button 
             onClick={handleExportDatabase}
             style={{ padding: '16px 32px', borderRadius: '20px', border: 'none', backgroundColor: '#ec4899', color: 'white', fontWeight: 950, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)', transition: '0.3s' }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d81b60'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ec4899'}
           >
              <Download size={18} /> Export Inventory
           </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
         {[
           { key: 'tracked', label: 'Total Assets Tracked', value: stats.tracked.toLocaleString(), icon: Database, color: '#6366f1', clickable: false },
           { key: 'lowStock', label: 'Critical Low Stock', value: stats.lowStock < 10 ? `0${stats.lowStock}` : stats.lowStock, icon: ShieldAlert, color: '#ef4444', clickable: true },
           { key: 'fleet', label: 'Fleet Availability', value: stats.fleet, icon: Bus, color: '#10b981', clickable: false },
           { key: 'circulation', label: 'Book Circulation', value: stats.circulation, icon: Library, color: '#f59e0b', clickable: false },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             whileHover={{ y: -6, boxShadow: 'var(--shadow-md)' }} 
             onClick={() => stat.clickable && setTriageOpen(true)}
             style={{ 
               backgroundColor: 'var(--bg-card)', 
               padding: '32px', 
               borderRadius: '32px', 
               border: stat.clickable ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)', 
               position: 'relative',
               cursor: stat.clickable ? 'pointer' : 'default',
               boxShadow: stat.clickable ? '0 10px 25px rgba(239, 68, 68, 0.05)' : 'none'
             }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div animate={stat.clickable ? { scale: [1, 1.15, 1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                       <stat.icon size={22} />
                    </motion.div>
                 </div>
                 {stat.clickable && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, backgroundColor: '#ef444415', color: '#ef4444', padding: '4px 10px', borderRadius: '10px' }}>
                       TRIAGE REQUIRED
                    </span>
                 )}
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 950, color: 'var(--text-main)', letterSpacing: '-2px', lineHeight: 1, marginBottom: '6px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
           </motion.div>
         ))}
      </div>

      {/* Templates Section Table Wrapper */}
      <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '40px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
         
         {/* Table Header Filter controls */}
         <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>Institutional Resource Templates</h3>
            <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
               
               {/* Categories filter button trigger */}
               <div 
                 onClick={(e) => { e.stopPropagation(); setCategoryFilterOpen(!categoryFilterOpen); }}
                 style={{ padding: '10px 20px', backgroundColor: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
               >
                  <Filter size={14} /> Type: <strong style={{ color: 'var(--text-main)' }}>{selectedCategory.toUpperCase()}</strong>
               </div>
               
               {/* Dropdown overlay */}
               <AnimatePresence>
                 {categoryFilterOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', right: 0, top: '48px', zIndex: 120, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '8px', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '4px', width: '180px' }}
                    >
                       {['all', 'Transport', 'Academic Support', 'Infrastructure', 'Operational', 'Services', 'General'].map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => handleCategorySelect(cat === 'Academic Support' ? 'academic' : cat.toLowerCase())}
                            style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textAlign: 'left', borderRadius: '8px' }} 
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                             {cat === 'all' ? 'Show All' : cat}
                          </button>
                       ))}
                    </motion.div>
                 )}
               </AnimatePresence>

               <div 
                 onClick={() => { triggerToast('Audited ledger verification synced.'); }}
                 style={{ padding: '10px 20px', backgroundColor: 'var(--text-main)', borderRadius: '12px', color: 'var(--bg-card)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
               >
                  <CheckCircle2 size={14} /> Audit History
               </div>
            </div>
         </div>

         {/* Templates Grid List */}
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '0' }}>
            {filteredTemplates.map((template, i) => (
              <div 
                key={i} 
                onClick={() => openTemplateDrawer(template)}
                style={{ 
                  padding: '32px 40px', 
                  borderBottom: '1px solid var(--border-color)', 
                  borderRight: i % 2 === 0 ? '1px solid var(--border-color)' : 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  transition: '0.3s', 
                  cursor: 'pointer' 
                }} 
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'} 
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#ec489912', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                       <Activity size={22} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: '1.05rem', letterSpacing: '-0.3px', marginBottom: '4px' }}>{template.title}</div>
                       <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{template.type} • Last Gen: {template.lastGen}</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => openTemplateDrawer(template)}
                      style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: '0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                    >
                       View Details
                    </button>
                    <button 
                      onClick={(e) => handleDownloadCSV(template, e)}
                      style={{ width: '38px', height: '38px', borderRadius: '12px', border: 'none', backgroundColor: '#ec4899', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d81b60'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ec4899'}
                    >
                       <Download size={15} />
                    </button>
                 </div>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
               <div style={{ padding: '60px', gridColumn: 'span 2', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700 }}>
                  No asset templates found matching your query filter.
               </div>
            )}
         </div>
      </div>

      {/* --- OVERLAY MODALS --- */}

      {/* 1. Asset Health Detail Drawer overlay */}
      <AnimatePresence>
        {selectedTemplate && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1800, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setSelectedTemplate(null)}
          >
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               onClick={(e) => e.stopPropagation()}
               style={{ backgroundColor: 'var(--bg-card)', width: '500px', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '40px' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ec489912', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Wrench size={20} /></div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedTemplate.title}</h3>
                   </div>
                   <button onClick={() => setSelectedTemplate(null)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '8px' }}>
                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                         <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL REGISTRY</div>
                         <div style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--text-main)' }}>{selectedTemplate.totalUnits}</div>
                      </div>
                      <div>
                         <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>STATUS LEVEL</div>
                         <div style={{ fontSize: '1.2rem', fontWeight: 950, color: '#10b981' }}>{selectedTemplate.condition}</div>
                      </div>
                      <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                         <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>AUTHORIZED INVENTORY MANAGER</div>
                         <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedTemplate.manager}</div>
                      </div>
                   </div>

                   {/* Health index slider */}
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>Asset Calibration Metric (Health)</span>
                         <span style={{ fontSize: '0.9rem', fontWeight: 950, color: '#ec4899' }}>{healthSlider}%</span>
                      </div>
                      <input 
                         type="range" min="10" max="100" value={healthSlider} 
                         onChange={(e) => setHealthSlider(parseInt(e.target.value))}
                         style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer', height: '6px', borderRadius: '3px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '6px' }}>
                         <span>Critical Calibration</span>
                         <span>Excellent Stability</span>
                      </div>
                   </div>

                   {/* Real-time slider feedback projections */}
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>ESTIMATED LIFETIME</div>
                         <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>
                            {Math.round((healthSlider / 10) * 1.5)} Years
                         </div>
                         <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, marginTop: '4px' }}>Projected active cycle</div>
                      </div>
                      <div style={{ padding: '20px', backgroundColor: 'var(--bg-body)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                         <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>MAINTENANCE SLAT</div>
                         <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)' }}>
                            {healthSlider < 60 ? 'HIGH' : healthSlider < 80 ? 'MED' : 'LOW'}
                         </div>
                         <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 800, marginTop: '4px' }}>Priority trigger index</div>
                      </div>
                   </div>

                   <div style={{ padding: '24px', backgroundColor: 'var(--bg-body)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>DEPLOYMENT COVERAGE METRICS</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                         <span>In Use: <strong>{selectedTemplate.inUse}</strong></span>
                         <span>Reserved: <strong>{selectedTemplate.reserved}</strong></span>
                      </div>
                   </div>

                   <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                      {scannerProgress === null ? (
                         <button 
                            onClick={runTemplateDiagnostics}
                            style={{ width: '100%', padding: '16px', borderRadius: '16px', border: 'none', backgroundColor: '#ec4899', color: 'white', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                         >
                            <Scan size={18} /> Trigger Hardware Integrity Diagnostic
                         </button>
                      ) : (
                         <div style={{ padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid #ec4899' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 900, marginBottom: '6px', color: 'var(--text-main)' }}>
                               <span>SWEEPING HARDWARE LEDGER CONTROLS...</span>
                               <span>{scannerProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
                               <div style={{ width: `${scannerProgress}%`, height: '100%', backgroundColor: '#ec4899' }} />
                            </div>
                         </div>
                      )}

                      {showScanCert && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', padding: '16px', backgroundColor: '#10b98115', border: '1px solid #10b981', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                               <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>HARDWARE LOGS CERTIFIED COMPLIANT</div>
                               <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Secured against EDUPRO system hooks</div>
                            </div>
                            <button 
                               onClick={() => downloadAssetCertificate(selectedTemplate)}
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

      {/* 2. Critical Low Stock Triage Drawer overlay */}
      <AnimatePresence>
        {triageOpen && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', zIndex: 1800, display: 'flex', justifyContent: 'flex-end' }}
            onClick={() => setTriageOpen(false)}
          >
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               onClick={(e) => e.stopPropagation()}
               style={{ backgroundColor: 'var(--bg-card)', width: '550px', maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)', padding: '40px' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ef444415', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldAlert size={20} /></div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>Low Stock Triage Control</h3>
                   </div>
                   <button onClick={() => setTriageOpen(false)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
                   <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, lineHeight: 1.5 }}>
                      The following institutional resource assets are currently below low-stock margins. Click <strong>Place Procurement Order</strong> to initiate dynamic dynamic acquisition.
                   </p>
                   {triageItems.map((item) => (
                      <div key={item.id} style={{ padding: '20px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                               <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>{item.name}</div>
                               <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 650, marginTop: '2px' }}>Category: {item.category}</div>
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 900, backgroundColor: '#ef444415', color: '#ef4444', padding: '4px 8px', borderRadius: '8px' }}>
                               LOW CAPACITY
                            </span>
                         </div>
                         <div style={{ borderTop: '1px dotted var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                               In Stock: <strong style={{ color: '#ef4444' }}>{item.quantity.split(' ')[0]}</strong> | Margin: <strong>{item.limit.split(' ')[0]}</strong>
                            </div>
                            <button 
                               onClick={() => initiateProcurementOrder(item.id, item.name)}
                               disabled={item.orderActive}
                               style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', backgroundColor: item.orderActive ? 'var(--text-muted)' : '#ec4899', color: 'white', fontWeight: 850, fontSize: '0.7rem', cursor: item.orderActive ? 'default' : 'pointer' }}
                            >
                               {item.orderActive ? 'Ordering...' : 'Place Restock Order'}
                            </button>
                         </div>
                      </div>
                   ))}

                   {triageItems.length === 0 && (
                      <div style={{ padding: '40px', backgroundColor: '#10b98115', border: '1px solid #10b981', borderRadius: '24px', textAlign: 'center', color: '#10b981', fontWeight: 800 }}>
                         All low stock assets are successfully procured! Registry is at 100% capacity parameters.
                      </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Archive Log Sweep console modal */}
      <AnimatePresence>
        {archiveOpen && (
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', zIndex: 1900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
               style={{ backgroundColor: '#090d16', border: '2px solid #ec4899', borderRadius: '32px', width: '600px', maxWidth: '100%', padding: '40px', color: '#ec4899', fontFamily: 'monospace', boxShadow: '0 20px 50px rgba(236, 72, 153, 0.2)' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(236, 72, 153, 0.3)', paddingBottom: '20px', marginBottom: '24px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Archive size={24} />
                      <span style={{ fontSize: '1.2rem', fontWeight: 950, letterSpacing: '1px' }}>ARCHIVE PURGE TELEMETRY</span>
                   </div>
                   <button 
                      onClick={() => setArchiveOpen(false)} 
                      disabled={archiveStatus === 'running'}
                      style={{ background: 'none', border: '1px solid rgba(236, 72, 153, 0.5)', color: '#ec4899', width: '36px', height: '36px', borderRadius: '8px', cursor: archiveStatus === 'running' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                   >
                      X
                   </button>
                </div>

                <div style={{ backgroundColor: '#020408', borderRadius: '16px', border: '1px solid rgba(236, 72, 153, 0.2)', padding: '24px', height: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', fontSize: '0.8rem', color: '#ec4899' }}>
                   {archiveLogs.length === 0 && <div>[READY] Awaiting purge signal for metadata database files...</div>}
                   {archiveLogs.map((log, idx) => (
                      <div key={idx} style={{ lineBreak: 'anywhere' }}>{log}</div>
                   ))}
                   {archiveStatus === 'running' && <div className="animate-pulse">_</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ width: '60%' }}>
                      {archiveStatus === 'running' && (
                         <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                               <span>COMPRESSING RECORD BLOCKS...</span>
                               <span>{archiveProgress}%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(236, 72, 153, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                               <div style={{ width: `${archiveProgress}%`, height: '100%', backgroundColor: '#ec4899' }} />
                            </div>
                         </div>
                      )}
                      {archiveStatus === 'completed' && <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>SYSTEM SWEEP SUCCESSFUL [OPTIMAL LEDGER STATE]</span>}
                   </div>
                   <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                         onClick={executeArchiveSweep}
                         disabled={archiveStatus === 'running'}
                         style={{ padding: '12px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#ec4899', color: 'white', fontWeight: 900, cursor: archiveStatus === 'running' ? 'default' : 'pointer', fontSize: '0.8rem' }}
                      >
                         {archiveStatus === 'completed' ? 'Re-Sweep Logs' : archiveStatus === 'running' ? 'Archiving...' : 'Start Sweep'}
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

export default InventoryReports;
