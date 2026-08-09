/* EduPro Elite - Standard Performance Tracker (Simple Edition) */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, CheckCircle, XCircle, Search, 
  ArrowRight, BarChart, AlertCircle, RefreshCw
} from 'lucide-react';

const SimplePerformance = () => {
  const [search, setSearch] = useState('');
  const [predictingId, setPredictingId] = useState(null);
  const [predictions, setPredictions] = useState({});

  const students = [
    { id: '101', name: 'Lokesh Roy', grade: '10th', attendance: '72%' },
    { id: '102', name: 'Divya Joshi', grade: '11th', attendance: '98%' },
    { id: '103', name: 'Noah Patel', grade: '9th', attendance: '65%' },
    { id: '104', name: 'Neha Sharma', grade: '12th', attendance: '88%' },
    { id: '105', name: 'Madhav Yadav', grade: '10th', attendance: '92%' },
    { id: '106', name: 'Ekta Kinger', grade: '9th', attendance: '81%' }
  ];

  const handlePredict = (id) => {
    setPredictingId(id);
    setTimeout(() => {
      const isPass = Math.random() > 0.4;
      setPredictions(prev => ({
        ...prev,
        [id]: { result: isPass ? 'PASS' : 'FAIL', score: Math.floor(Math.random() * 40 + 50) + '%' }
      }));
      setPredictingId(null);
    }, 1000);
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--perf-simple-bg)', color: 'var(--perf-simple-text-main)', transition: 'background-color 0.3s, color 0.3s', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        :root {
          --perf-simple-bg: #f8fafc;
          --perf-simple-card: #ffffff;
          --perf-simple-text-main: #1e293b;
          --perf-simple-text-muted: #64748b;
          --perf-simple-border: #e2e8f0;
          --perf-simple-hover: #f8fafc;
          --perf-simple-input-bg: #ffffff;
          --perf-simple-pass-bg: #dcfce7;
          --perf-simple-pass-text: #15803d;
          --perf-simple-fail-bg: #fee2e2;
          --perf-simple-fail-text: #b91c1c;
        }
        
        [data-theme='dark'] {
          --perf-simple-bg: #1a202c;
          --perf-simple-card: #2d3748;
          --perf-simple-text-main: #f7fafc;
          --perf-simple-text-muted: #a0aec0;
          --perf-simple-border: #4a5568;
          --perf-simple-hover: #3a475d;
          --perf-simple-input-bg: #1a202c;
          --perf-simple-pass-bg: rgba(21, 128, 61, 0.2);
          --perf-simple-pass-text: #4ade80;
          --perf-simple-fail-bg: rgba(185, 28, 28, 0.2);
          --perf-simple-fail-text: #f87171;
        }
      `}</style>
      
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Simple Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--perf-simple-text-main)', marginBottom: '8px' }}>Student Performance Tracker</h1>
          <p style={{ color: 'var(--perf-simple-text-muted)', fontSize: '1.1rem' }}>Basic AI prediction model for student outcomes.</p>
        </div>

        {/* Simple Search */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <input 
            type="text" 
            placeholder="Search student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '16px 50px', borderRadius: '16px', border: '1px solid var(--perf-simple-border)', backgroundColor: 'var(--perf-simple-input-bg)', color: 'var(--perf-simple-text-main)', fontSize: '1rem', outline: 'none', transition: '0.2s' }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = 'var(--perf-simple-border)'}
          />
          <Search style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} color="var(--perf-simple-text-muted)" size={20} />
        </div>

        {/* Student Table/List */}
        <div style={{ backgroundColor: 'var(--perf-simple-card)', borderRadius: '24px', border: '1px solid var(--perf-simple-border)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ padding: '20px 24px', backgroundColor: 'var(--perf-simple-bg)', borderBottom: '1px solid var(--perf-simple-border)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', fontWeight: 700, color: 'var(--perf-simple-text-muted)', fontSize: '0.9rem' }}>
            <span>STUDENT NAME</span>
            <span>GRADE</span>
            <span>ATTENDANCE</span>
            <span style={{ textAlign: 'right' }}>PREDICTION</span>
          </div>

          {filteredStudents.map((student) => (
            <div key={student.id} style={{ padding: '20px 24px', borderBottom: '1px solid var(--perf-simple-border)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', alignItems: 'center', transition: '0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--perf-simple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--perf-simple-text-muted)' }}>
                  <User size={18} />
                </div>
                <span style={{ fontWeight: 600, color: 'var(--perf-simple-text-main)' }}>{student.name}</span>
              </div>
              <span style={{ color: 'var(--perf-simple-text-muted)', fontWeight: 500 }}>{student.grade}</span>
              <span style={{ color: student.attendance.replace('%', '') < 75 ? 'var(--perf-simple-fail-text, #ef4444)' : 'var(--perf-simple-text-main)', fontWeight: 600 }}>{student.attendance}</span>
              
              <div style={{ textAlign: 'right' }}>
                {predictions[student.id] ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: predictions[student.id].result === 'PASS' ? 'var(--perf-simple-pass-bg)' : 'var(--perf-simple-fail-bg)', color: predictions[student.id].result === 'PASS' ? 'var(--perf-simple-pass-text)' : 'var(--perf-simple-fail-text)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {predictions[student.id].result === 'PASS' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {predictions[student.id].result} ({predictions[student.id].score})
                  </div>
                ) : (
                  <button 
                    onClick={() => handlePredict(student.id)}
                    disabled={predictingId === student.id}
                    style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', backgroundColor: '#6366f1', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', transition: '0.2s' }}
                  >
                    {predictingId === student.id ? <RefreshCw size={14} className="spin" /> : <BarChart size={14} />}
                    {predictingId === student.id ? 'Analyzing...' : 'Predict Outcome'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default SimplePerformance;
