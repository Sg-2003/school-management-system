import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Download, Plus, Building, 
  User, Calendar, ShieldCheck, Folder, File, ArrowUpRight, 
  Upload, X, Trash2, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast, ToastRenderer } from '../hooks/useToast';

const StaffDocuments = () => {
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const { toast, showToast, hideToast } = useToast();
  
  // Stateful Documents list loaded from localStorage
  const [documentList, setDocumentList] = useState(() => {
    const stored = localStorage.getItem('staff_documents');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initialDocs = [
        { id: 'DOC-1021', name: 'Dr. Rajesh Malhotra - Contract', type: 'Employment Contract', staff: 'Rajesh Malhotra', dept: 'Mathematics', date: '2021-01-12', size: '1.2 MB' },
        { id: 'DOC-1022', name: 'Sunita Rao - Degree', type: 'Academic Credential', staff: 'Sunita Rao', dept: 'Administration', date: '2022-03-05', size: '2.4 MB' },
        { id: 'DOC-1023', name: 'Amit Bose - ID Proof', type: 'Identification', staff: 'Amit Bose', dept: 'Technical', date: '2023-09-15', size: '0.8 MB' },
        { id: 'DOC-1024', name: 'Priya Patel - Experience', type: 'Experience Certificate', staff: 'Priya Patel', dept: 'Student Welfare', date: '2024-02-20', size: '1.5 MB' },
        { id: 'DOC-1025', name: 'Institutional Policy 2026', type: 'Legal/Policy', staff: 'System', dept: 'General', date: '2026-01-01', size: '3.1 MB' },
      ];
      localStorage.setItem('staff_documents', JSON.stringify(initialDocs));
      return initialDocs;
    }
  });

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Dropdown / Popover controls
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showDatePopover, setShowDatePopover] = useState(false);
  
  // Document Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Upload Form states
  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'Employment Contract',
    staff: '',
    dept: 'Mathematics',
    fileName: '',
    fileSize: ''
  });

  const departments = ['All', 'Mathematics', 'Administration', 'Technical', 'Student Welfare', 'General'];
  const documentTypes = ['Employment Contract', 'Academic Credential', 'Identification', 'Experience Certificate', 'Legal/Policy'];

  // Dynamic storage calculation
  const totalStorageGb = 10;
  const initialUsedGb = 6.2;
  // Calculate newly uploaded documents weight (simulate ~1.5 MB per doc)
  const additionalMb = (documentList.length - 5) * 1.5;
  const currentUsedGb = (initialUsedGb + additionalMb / 1024).toFixed(2);
  const usedPercentage = ((parseFloat(currentUsedGb) / totalStorageGb) * 100).toFixed(0);

  // Dynamic counts for left folders
  const allCount = documentList.length;
  const contractCount = documentList.filter(d => d.type === 'Employment Contract').length;
  const credentialCount = documentList.filter(d => d.type === 'Academic Credential').length;
  const idCount = documentList.filter(d => d.type === 'Identification').length;
  const policyCount = documentList.filter(d => d.type === 'Legal/Policy').length;

  // Folder type filtering logic
  const getFilteredByCategory = (list, category) => {
    if (category === 'All Documents') return list;
    if (category === 'Employment Contracts') return list.filter(d => d.type === 'Employment Contract');
    if (category === 'Academic Credentials') return list.filter(d => d.type === 'Academic Credential');
    if (category === 'Identification Proofs') return list.filter(d => d.type === 'Identification');
    if (category === 'Institutional Policies') return list.filter(d => d.type === 'Legal/Policy');
    return list;
  };

  // Main filtering engine
  const filteredDocuments = getFilteredByCategory(documentList, activeCategory).filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.staff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.dept.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || doc.dept === selectedDept;

    let matchesDate = true;
    if (startDateFilter) {
      matchesDate = matchesDate && new Date(doc.date) >= new Date(startDateFilter);
    }
    if (endDateFilter) {
      matchesDate = matchesDate && new Date(doc.date) <= new Date(endDateFilter);
    }

    return matchesSearch && matchesDept && matchesDate;
  });

  // Handle file input changes and mock sizes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadForm(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: `${sizeInMb} MB`
      }));
    }
  };

  // Handle document upload
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.name.trim() || !uploadForm.staff.trim()) {
      showToast('Please provide both document name and staff member.', 'warning', 'Validation Error');
      return;
    }
    if (!uploadForm.fileName) {
      showToast('Please attach a document file first.', 'warning', 'File Required');
      return;
    }

    const newDoc = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: uploadForm.name.trim(),
      type: uploadForm.type,
      staff: uploadForm.staff.trim(),
      dept: uploadForm.dept,
      date: new Date().toISOString().split('T')[0],
      size: uploadForm.fileSize || '1.2 MB'
    };

    const updatedDocs = [newDoc, ...documentList];
    setDocumentList(updatedDocs);
    localStorage.setItem('staff_documents', JSON.stringify(updatedDocs));
    setShowUploadModal(false);
    setUploadForm({
      name: '',
      type: 'Employment Contract',
      staff: '',
      dept: 'Mathematics',
      fileName: '',
      fileSize: ''
    });
    showToast(`Document successfully uploaded to institutional vault: ${newDoc.id}`, 'success', 'Upload Complete');
  };

  // Simulate file download
  const handleDownloadDoc = (doc, e) => {
    e.stopPropagation();
    
    const fileContent = `EduPro Elite Staff Document Vault
==================================================
DOCUMENT ID:   ${doc.id}
DOCUMENT NAME: ${doc.name}
DOCUMENT TYPE: ${doc.type}
DEPARTMENT:    ${doc.dept}
STAFF OWNER:   ${doc.staff}
UPLOAD DATE:   ${formatDateString(doc.date)}
VAULT SIZE:    ${doc.size}
COMPLIANCE:    Institutional Encrypted Security Ledger Handshake
==================================================
This is a secure digital certificate backup. Unauthorized duplication is strictly prohibited.
Secured under Crypto Signature: CERT-${Math.floor(100000 + Math.random() * 900000)}`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${doc.name.replace(/\s+/g, '_')}_verified.txt`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Date formatter (yyyy-mm-dd -> dd MMM yyyy)
  const formatDateString = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return dateStr;
  };

  // Clear all filters (View All Documents & History)
  const handleViewAllDocuments = () => {
    setActiveCategory('All Documents');
    setSearchQuery('');
    setSelectedDept('All');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  // Stateful document deletion
  const handleDeleteDoc = (id, name, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${name}" (${id}) from the secure vault?`)) {
      const updatedDocs = documentList.filter(d => d.id !== id);
      setDocumentList(updatedDocs);
      localStorage.setItem('staff_documents', JSON.stringify(updatedDocs));
      if (selectedDoc && selectedDoc.id === id) {
         setSelectedDoc(null);
      }
    }
  };

  return (
    <>
    <div style={{ padding: '20px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Staff Document Repository</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Centralized vault for institutional contracts, academic credentials, and compliance documentation.</p>
        </div>
        <button 
           onClick={() => setShowUploadModal(true)}
           className="btn btn-primary" 
           style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 900 }}
        >
           <Upload size={18} /> UPLOAD DOCUMENT
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
         {/* Left Sidebar: Categories & Storage */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
               <h3 style={{ fontSize: '0.9rem', fontWeight: 950, marginBottom: '20px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Folders</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                     { name: 'All Documents', count: allCount, icon: <Folder size={18} /> },
                     { name: 'Employment Contracts', count: contractCount, icon: <FileText size={18} /> },
                     { name: 'Academic Credentials', count: credentialCount, icon: <ShieldCheck size={18} /> },
                     { name: 'Identification Proofs', count: idCount, icon: <User size={18} /> },
                     { name: 'Institutional Policies', count: policyCount, icon: <Building size={18} /> }
                  ].map((cat, i) => (
                     <div 
                        key={i} 
                        onClick={() => setActiveCategory(cat.name)}
                        style={{ 
                           display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
                           backgroundColor: activeCategory === cat.name ? 'var(--primary-light)' : 'transparent',
                           color: activeCategory === cat.name ? 'var(--primary)' : 'var(--text-main)',
                           fontWeight: activeCategory === cat.name ? 800 : 600,
                           transition: '0.2s'
                        }}
                        onMouseOver={(e) => {
                           if(activeCategory !== cat.name) e.currentTarget.style.backgroundColor = 'var(--bg-body)';
                        }}
                        onMouseOut={(e) => {
                           if(activeCategory !== cat.name) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                     >
                        <span style={{ opacity: activeCategory === cat.name ? 1 : 0.6 }}>{cat.icon}</span>
                        <span style={{ flex: 1, fontSize: '0.9rem' }}>{cat.name}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{cat.count}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
               <h4 style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-main)' }}>Storage Status</h4>
               <div style={{ height: '8px', backgroundColor: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ width: `${usedPercentage}%`, height: '100%', backgroundColor: 'var(--primary)', transition: 'width 0.5s ease-out' }}></div>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{currentUsedGb} GB of {totalStorageGb} GB used</span>
                  <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => showToast('Enterprise scale tier upgraded to 50 GB. Contact administration for activation.', 'info', 'Storage Upgrade')}>Upgrade</span>
               </div>
            </div>
         </div>

         {/* Right Main Content: Document List */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
               <div style={{ position: 'relative', width: '400px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                     type="text" 
                     placeholder="Search by document name, staff or ID..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     style={{ width: '100%', padding: '10px 12px 10px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.85rem' }} 
                  />
               </div>
               
               <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                  {/* Department Filters Popover */}
                  <div style={{ position: 'relative' }}>
                     <button 
                        onClick={() => {
                           setShowFilterPopover(!showFilterPopover);
                           setShowDatePopover(false);
                        }}
                        className="btn" 
                        style={{ border: '1px solid var(--border-color)', backgroundColor: showFilterPopover ? 'var(--primary-light)' : 'var(--bg-body)', color: showFilterPopover ? 'var(--primary)' : 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                     >
                        <Filter size={16} /> FILTERS
                        {selectedDept !== 'All' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                     </button>
                     
                     <AnimatePresence>
                        {showFilterPopover && (
                           <motion.div 
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, width: '220px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '10px' }}
                           >
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter by Dept</span>
                              <select 
                                 value={selectedDept} 
                                 onChange={(e) => setSelectedDept(e.target.value)}
                                 style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                              >
                                 {departments.map(d => (
                                    <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                                 ))}
                              </select>
                              <button 
                                 onClick={() => {
                                    setSelectedDept('All');
                                    setShowFilterPopover(false);
                                 }}
                                 style={{ alignSelf: 'flex-end', border: 'none', background: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                              >
                                 Clear
                              </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  {/* Date Range Popover */}
                  <div style={{ position: 'relative' }}>
                     <button 
                        onClick={() => {
                           setShowDatePopover(!showDatePopover);
                           setShowFilterPopover(false);
                        }}
                        className="btn" 
                        style={{ border: '1px solid var(--border-color)', backgroundColor: showDatePopover ? 'var(--primary-light)' : 'var(--bg-body)', color: showDatePopover ? 'var(--primary)' : 'var(--text-main)', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                     >
                        <Calendar size={16} /> DATE RANGE
                        {(startDateFilter || endDateFilter) && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>}
                     </button>
                     
                     <AnimatePresence>
                        {showDatePopover && (
                           <motion.div 
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, width: '260px', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: '14px' }}
                           >
                              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter by Date</span>
                              <div>
                                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>START DATE</label>
                                 <input 
                                    type="date" 
                                    value={startDateFilter}
                                    onChange={(e) => setStartDateFilter(e.target.value)}
                                    style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                 />
                              </div>
                              <div>
                                 <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>END DATE</label>
                                 <input 
                                    type="date" 
                                    value={endDateFilter}
                                    onChange={(e) => setEndDateFilter(e.target.value)}
                                    style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 700 }}
                                 />
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <button 
                                    onClick={() => {
                                       setStartDateFilter('');
                                       setEndDateFilter('');
                                       setShowDatePopover(false);
                                    }}
                                    style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                                 >
                                    Reset
                                 </button>
                                 <button 
                                    onClick={() => setShowDatePopover(false)}
                                    style={{ border: 'none', background: 'var(--primary)', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                                 >
                                    Apply
                                 </button>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>

            <div className="card" style={{ padding: '0', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>DOCUMENT NAME</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>STAFF / DEPT</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>TYPE</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>SIZE</th>
                        <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc, i) => (
                           <tr 
                              key={i} 
                              onClick={() => setSelectedDoc(doc)}
                              style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: '0.2s' }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-body)'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                           >
                              <td style={{ padding: '20px 24px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'var(--bg-body)', color: 'var(--primary)' }}>
                                       <File size={20} />
                                    </div>
                                    <div>
                                       <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{doc.name}</div>
                                       <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>ID: {doc.id} • Added {formatDateString(doc.date)}</div>
                                    </div>
                                 </div>
                              </td>
                              <td style={{ padding: '20px 24px' }}>
                                 <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{doc.staff}</div>
                                 <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{doc.dept}</div>
                              </td>
                              <td style={{ padding: '20px 24px' }}>
                                 <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{doc.type}</span>
                              </td>
                              <td style={{ padding: '20px 24px' }}>
                                 <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{doc.size}</span>
                              </td>
                              <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                 <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button 
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedDoc(doc);
                                       }}
                                       className="icon-btn" 
                                       style={{ backgroundColor: 'var(--bg-body)' }} 
                                       title="Open/View"
                                    >
                                       <ArrowUpRight size={16} />
                                    </button>
                                    <button 
                                       onClick={(e) => handleDownloadDoc(doc, e)}
                                       className="icon-btn" 
                                       style={{ backgroundColor: 'var(--bg-body)' }} 
                                       title="Download"
                                    >
                                       <Download size={16} />
                                    </button>
                                    <button 
                                       onClick={(e) => handleDeleteDoc(doc.id, doc.name, e)}
                                       className="icon-btn" 
                                       style={{ backgroundColor: 'var(--bg-body)', color: '#ef4444' }} 
                                       title="Delete Document"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                              <FileText size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
                              <div style={{ fontWeight: 800 }}>No documents found</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Relax your filters or upload a new record.</div>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
               
               {/* View All Documents & History reset trigger */}
               <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <button 
                     onClick={handleViewAllDocuments}
                     style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                  >
                     View All Documents & History
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* 1. UPLOAD DOCUMENT MODAL */}
      <AnimatePresence>
         {showUploadModal && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  style={{ width: '100%', maxWidth: '520px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: 'var(--shadow-2xl)', position: 'relative' }}
               >
                  <button 
                     onClick={() => setShowUploadModal(false)}
                     style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                     <X size={20} />
                  </button>
                  
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={22} color="var(--primary)" /> Secure Document Upload</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Onboard verified credentials, contracts, and certifications securely to the encrypted vault.</p>

                  <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Document Name</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Rajesh Malhotra Degree Certificate"
                           required
                           value={uploadForm.name}
                           onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                           style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        />
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Doc Type</label>
                           <select 
                              value={uploadForm.type}
                              onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
                              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                           >
                              {documentTypes.map(t => (
                                 <option key={t} value={t}>{t}</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Department</label>
                           <select 
                              value={uploadForm.dept}
                              onChange={(e) => setUploadForm({...uploadForm, dept: e.target.value})}
                              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                           >
                              {departments.filter(d => d !== 'All').map(d => (
                                 <option key={d} value={d}>{d}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Staff Owner</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Dr. Rajesh Malhotra"
                           required
                           value={uploadForm.staff}
                           onChange={(e) => setUploadForm({...uploadForm, staff: e.target.value})}
                           style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }}
                        />
                     </div>

                     {/* Functional File Attachment block */}
                     <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>File Attachment</label>
                        <input 
                           type="file" 
                           id="vault-modal-file-upload" 
                           onChange={handleFileChange} 
                           style={{ display: 'none' }} 
                        />
                        <div 
                           onClick={() => !uploadForm.fileName && document.getElementById('vault-modal-file-upload').click()}
                           style={{ 
                              padding: '20px', 
                              border: '2px dashed var(--border-color)', 
                              borderRadius: '12px', 
                              textAlign: 'center', 
                              backgroundColor: uploadForm.fileName ? 'var(--primary-light)' : 'var(--bg-body)', 
                              cursor: uploadForm.fileName ? 'default' : 'pointer',
                              position: 'relative'
                           }}
                        >
                           {uploadForm.fileName ? (
                              <div>
                                 <CheckCircle2 size={20} color="var(--primary)" style={{ marginBottom: '6px' }} />
                                 <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>File Attached Successfully</span>
                                 <span style={{ fontSize: '0.65rem', color: 'var(--primary)', opacity: 0.8, display: 'block', wordBreak: 'break-all', padding: '0 10px' }}>
                                    {uploadForm.fileName} ({uploadForm.fileSize})
                                 </span>
                                 <button 
                                    type="button" 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setUploadForm(prev => ({ ...prev, fileName: '', fileSize: '' }));
                                    }}
                                    style={{ 
                                       background: 'none', border: 'none', color: '#ef4444', 
                                       fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', marginTop: '8px' 
                                    }}
                                 >
                                    Remove Attachment
                                 </button>
                              </div>
                           ) : (
                              <>
                                 <Upload size={20} color="var(--primary)" style={{ marginBottom: '6px' }} />
                                 <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800 }}>Choose verified PDF / Image scan</span>
                                 <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Max file limit: 10MB</span>
                              </>
                           )}
                        </div>
                     </div>

                     <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ padding: '14px', borderRadius: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', border: 'none', marginTop: '12px' }}
                     >
                        <CheckCircle2 size={18} /> CONFIRM ENCRYPTED UPLOAD
                     </button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* 2. VIEW DOCUMENT DETAIL MODAL */}
      <AnimatePresence>
         {selectedDoc && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  style={{ width: '100%', maxWidth: '560px', backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: 'var(--shadow-2xl)', position: 'relative' }}
               >
                  <button 
                     onClick={() => setSelectedDoc(null)}
                     style={{ position: 'absolute', top: '24px', right: '24px', border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                     <X size={20} />
                  </button>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '20px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <FileText size={22} color="var(--primary)" /> Document Vault Record
                  </h3>

                  {/* Document Card Showcase */}
                  <div style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: '16px', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-color)', marginBottom: '24px', alignItems: 'center' }}>
                     <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <File size={28} />
                     </div>
                     <div>
                        <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>{selectedDoc.name}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>ID: {selectedDoc.id}</span>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                     <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Staff Owner</label>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedDoc.staff}</span>
                     </div>
                     <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Department</label>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedDoc.dept}</span>
                     </div>
                     <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Upload Date</label>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatDateString(selectedDoc.date)}</span>
                     </div>
                     <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'var(--bg-body)' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Storage size</label>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{selectedDoc.size}</span>
                     </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                     <button 
                        onClick={(e) => handleDeleteDoc(selectedDoc.id, selectedDoc.name, e)}
                        className="btn" 
                        style={{ border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', borderRadius: '12px' }}
                     >
                        <Trash2 size={16} /> Delete Record
                     </button>
                     
                     <button 
                        onClick={(e) => handleDownloadDoc(selectedDoc, e)}
                        className="btn btn-primary" 
                        style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '12px', fontWeight: 900 }}
                     >
                        <Download size={16} /> Download Copy
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </>
  );
};

export default StaffDocuments;
