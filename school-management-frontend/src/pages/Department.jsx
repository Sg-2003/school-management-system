import React, { useState } from 'react';
import { useToast, ToastRenderer } from '../hooks/useToast';
import { Building, Plus, Edit, Trash2, Search, Filter, Info, Save, X, Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Department = () => {
  const { toast, showToast, hideToast } = useToast();
  const nameInputRef = React.useRef(null);
  
  // Lazy initialize departments with localStorage persistence
  const [departments, setDepartments] = useState(() => {
    const stored = localStorage.getItem('institutional_departments_v2');
    if (stored) {
      return JSON.parse(stored);
    } else {
      const initial = [
        { id: 1, name: 'Mathematics & Science', head: 'Dr. Rajesh Malhotra', staff: 24, budget: '$45,000', status: 'Active' },
        { id: 2, name: 'Languages & Arts', head: 'Sunita Rao', staff: 18, budget: '$32,000', status: 'Active' },
        { id: 3, name: 'Physical Education', head: 'Amit Bose', staff: 12, budget: '$28,000', status: 'Active' },
        { id: 4, name: 'Campus Administration', head: 'Priya Patel', staff: 15, budget: '$60,000', status: 'Active' },
        { id: 5, name: 'IT & Infrastructure', head: 'Vikram Malhotra', staff: 8, budget: '$55,000', status: 'Active' },
      ];
      localStorage.setItem('institutional_departments_v2', JSON.stringify(initial));
      return initial;
    }
  });

  // Dynamic workforce heads list pulling from employees database
  const employees = React.useMemo(() => {
    const stored = localStorage.getItem('employees');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      { name: 'Dr. Rajesh Malhotra' },
      { name: 'Sunita Rao' },
      { name: 'Amit Bose' },
      { name: 'Priya Patel' },
      { name: 'Vikram Malhotra' }
    ];
  }, []);

  // Form states
  const [editingDept, setEditingDept] = useState(null);
  const [formName, setFormName] = useState('');
  const [formHead, setFormHead] = useState('Select Employee');
  const [formBudget, setFormBudget] = useState('');

  // Reset form inputs
  const handleResetForm = () => {
    setEditingDept(null);
    setFormName('');
    setFormHead('Select Employee');
    setFormBudget('');
  };

  // Header quick create click trigger
  const handleCreateClick = () => {
    handleResetForm();
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Row-level edit details loader
  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setFormName(dept.name);
    setFormHead(dept.head);
    // Extract numerical digits from budget string
    const budgetVal = dept.budget ? dept.budget.replace(/[^0-9]/g, '') : '';
    setFormBudget(budgetVal);
    
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // Delete department trigger
  const handleDeleteDept = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the department "${name}"?`)) {
      const updated = departments.filter(d => d.id !== id);
      setDepartments(updated);
      localStorage.setItem('institutional_departments_v2', JSON.stringify(updated));
      if (editingDept && editingDept.id === id) {
        handleResetForm();
      }
      showToast(`Department "${name}" successfully deleted.`, 'success', 'Department Deleted');
    }
  };

  // Save / Submit department profile
  const handleSaveDept = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a department name.', 'warning', 'Missing Field');
      return;
    }

    const rawBudget = parseFloat(formBudget) || 0;
    const formattedBudget = '$' + rawBudget.toLocaleString('en-US');

    let updated = [];
    if (editingDept) {
      // Edit Mode
      updated = departments.map(d => d.id === editingDept.id ? {
        ...d,
        name: formName.trim(),
        head: formHead,
        budget: formattedBudget
      } : d);
      showToast(`Department "${formName}" updated successfully.`, 'success', 'Department Updated');
    } else {
      // Create Mode
      const newId = departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1;
      const newDept = {
        id: newId,
        name: formName.trim(),
        head: formHead,
        staff: 0, // Seeds with 0 active staff
        budget: formattedBudget,
        status: 'Active'
      };
      updated = [...departments, newDept];
      showToast(`Department "${formName}" successfully created.`, 'success', 'Department Created');
    }

    setDepartments(updated);
    localStorage.setItem('institutional_departments_v2', JSON.stringify(updated));
    handleResetForm();
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '8px' }}>Institutional Departments</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage organizational units, departmental heads, and operational budgets.</p>
        </div>
        <button 
           onClick={handleCreateClick}
           className="btn btn-primary" 
           style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: 900 }}
        >
           <Plus size={20} /> Create Department
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
         {/* Department Grid */}
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignContent: 'start' }}>
            {departments.map((dept, idx) => (
               <div 
                  key={dept.id} 
                  className="card" 
                  style={{ 
                    padding: '32px', 
                    border: editingDept?.id === dept.id ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                    backgroundColor: editingDept?.id === dept.id ? 'var(--primary-light)' : 'var(--bg-card)',
                    position: 'relative',
                    transition: '0.2s' 
                  }}
               >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Building size={24} />
                     </div>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEditClick(dept)}
                          className="icon-btn" 
                          style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                          title="Edit Department"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDept(dept.id, dept.name)}
                          className="icon-btn" 
                          style={{ width: '32px', height: '32px', color: 'var(--danger)', cursor: 'pointer' }}
                          title="Delete Department"
                        >
                          <Trash2 size={14} />
                        </button>
                     </div>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 950, marginBottom: '8px' }}>{dept.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px' }}>
                     <User size={14} /> Head: {dept.head}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--bg-body)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                     <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Staff</div>
                        <div style={{ fontWeight: 950, fontSize: '1.1rem' }}>{dept.staff}</div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Budget</div>
                        <div style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--primary)' }}>{dept.budget}</div>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Quick Add Form */}
         <div className="card" style={{ padding: '32px', border: '1px solid var(--border-color)', alignSelf: 'flex-start', position: 'relative' }}>
            {editingDept && (
              <button 
                onClick={handleResetForm}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '6px', borderRadius: '8px', backgroundColor: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Cancel Edit"
              >
                <X size={16} />
              </button>
            )}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 950, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <Users size={20} className="text-muted" /> 
               {editingDept ? 'Edit Department' : 'Add Department'}
            </h3>
            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Department Name</label>
                  <input 
                     type="text" 
                     ref={nameInputRef}
                     required
                     value={formName}
                     onChange={(e) => setFormName(e.target.value)}
                     placeholder="e.g. Science & Tech" 
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                  />
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Department Head</label>
                  <select 
                     value={formHead}
                     onChange={(e) => setFormHead(e.target.value)}
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600, cursor: 'pointer' }}
                  >
                     <option value="Select Employee">Select Employee</option>
                     {employees.map((emp, eidx) => (
                        <option key={eidx} value={emp.name}>{emp.name}</option>
                     ))}
                  </select>
               </div>
               <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Annual Budget (USD)</label>
                  <input 
                     type="number" 
                     required
                     value={formBudget}
                     onChange={(e) => setFormBudget(e.target.value)}
                     placeholder="50000" 
                     style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', color: 'var(--text-main)', outline: 'none', fontWeight: 600 }} 
                  />
               </div>
               <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                     type="submit" 
                     className="btn btn-primary" 
                     style={{ flex: 1, padding: '14px', borderRadius: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
                  >
                     <Save size={18} /> SAVE DEPARTMENT
                  </button>
                  <button 
                     type="button" 
                     onClick={handleResetForm}
                     className="btn" 
                     style={{ padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)', cursor: 'pointer' }}
                     title="Reset Form"
                  >
                     <X size={18} />
                  </button>
               </div>
            </form>
         </div>
      </div>
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default Department;
