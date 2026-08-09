import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, ArrowRight, ShieldCheck, BarChart3, 
  Users, Globe, CircleCheck, Star, PlayCircle, MessageCircle,
  Mail, Phone, MapPin, Share2, ExternalLink, X, ChevronUp,
  Cpu, Layout, Rocket, Award, Heart, HelpCircle, FileText, Clock,
  MousePointer2, Zap as ZapIcon, Sparkles, Monitor, Smartphone, Layers,
  Sun, Moon
} from 'lucide-react';
import Footer from '../components/Footer';
import { useToast, ToastRenderer } from '../hooks/useToast';

import aiWhitepaper from '../assets/resources/ai_whitepaper.png';
import campusGuide from '../assets/resources/campus_guide.png';
import universityScaling from '../assets/resources/university_scaling.png';
import eleanorAvatar from '../assets/eleanor_avatar.png';
import janeAvatar from '../assets/jane_avatar.png';
import robertAvatar from '../assets/robert_avatar.png';
import studentAvatar from '../assets/student_avatar.png';
import devonAvatar from '../assets/devon_avatar.png';

const Home = () => {
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [counts, setCounts] = useState({ institutions: 0, students: 0, uptime: 0 });
  const [showDemo, setShowDemo] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSolution, setActiveSolution] = useState(0);
  const [selectedResource, setSelectedResource] = useState(null);
  const isSharing = useRef(false);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => ({
        institutions: prev.institutions < 5200 ? prev.institutions + 130 : 5200,
        students: prev.students < 450000 ? prev.students + 15000 : 450000,
        uptime: prev.uptime < 99.99 ? prev.uptime + 1.5 : 99.99
      }));
    }, 50);

    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const solutions = [
    { title: 'K-12 Education', icon: <Heart size={20} />, color: '#ec4899', desc: 'Holistic growth tracking and deep parent-teacher collaboration.', features: ['Progress Reports', 'Attendance Tracking', 'Behavior Analytics'] },
    { title: 'Higher Education', icon: <Award size={20} />, color: '#4f46e5', desc: 'Streamlined campus operations and advanced academic research tools.', features: ['Course Planning', 'Grant Management', 'Alumni Network'] },
    { title: 'Corporate Learning', icon: <ZapIcon size={20} />, color: '#f59e0b', desc: 'Skill-based learning paths and automated compliance certifications.', features: ['Skill Gap Analysis', 'LMS Integration', 'Compliance Tracking'] }
  ];

  return (
    <div className="home-page-container" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', minHeight: '100vh', overflowX: 'hidden', color: isDark ? '#cbd5e0' : '#1e293b', fontFamily: 'var(--font-main)', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
      <style>{`
        @media (max-width: 992px) {
          .home-page-container [style*="grid-template-columns: 1.2fr 0.8fr"],
          .home-page-container [style*="grid-template-columns: 0.8fr 1.2fr"],
          .home-page-container [style*="grid-template-columns: repeat(4, 1fr)"],
          .home-page-container [style*="grid-template-columns: repeat(3, 1fr)"] {
             grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .home-page-container [style*="grid-template-columns"] {
             grid-template-columns: 1fr !important;
          }
          .home-page-container section {
             padding: 80px 20px !important;
          }
          .home-page-container .nav-link, .home-page-container .btn-demo-minimal, .home-page-container .btn-hero-secondary {
             display: none !important;
          }
          .home-page-container h1 { font-size: 3rem !important; }
          .home-page-container h2 { font-size: 2.5rem !important; }
          .home-page-container h3 { font-size: 2rem !important; }
        }
      `}</style>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', backgroundColor: '#4f46e5', transformOrigin: '0%', zIndex: 1100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
      />

      {/* Floating Elements */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ 
              position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000,
              width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#4f46e5',
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
            }}
            whileHover={{ scale: 1.1 }}
          >
            <ChevronUp size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Elite Navbar */}
      <nav style={{ 
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 8%', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
        position: 'fixed', top: 0, width: '100%', zIndex: 1000, borderBottom: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9',
        transition: 'background-color 0.3s ease, border-bottom 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '10px', backgroundColor: '#4f46e5', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: isDark ? '#ffffff' : '#0f172a', letterSpacing: '-2.2px', lineHeight: 1, transition: 'color 0.3s ease' }}>
              EduPro <small style={{ color: '#4f46e5', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4f46e5' }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isDark ? '#94a3b8' : '#64748b', letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s ease' }}>Operating System</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {['Features', 'Solutions', 'Resources'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textDecoration: 'none', fontSize: '0.95rem', transition: '0.3s' }} className="nav-link">{item}</a>
          ))}
          <Link to="/pricing" style={{ fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textDecoration: 'none', fontSize: '0.95rem', transition: '0.3s' }} className="nav-link">Pricing</Link>
          
          {/* Custom Theme Toggle Button */}
          <motion.button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
              color: isDark ? '#f59e0b' : '#4f46e5',
              transition: 'all 0.3s ease',
              boxShadow: isDark ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 4px 12px rgba(79, 70, 229, 0.1)',
            }}
            whileHover={{ scale: 1.1, backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.1)' }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <div style={{ width: '1px', height: '24px', backgroundColor: isDark ? '#1e293b' : '#e2e8f0', margin: '0 8px', transition: 'background-color 0.3s ease' }}></div>
          <Link to="/register" style={{ 
            padding: '14px 28px', borderRadius: '14px', backgroundColor: '#4f46e5', color: 'white', 
            textDecoration: 'none', fontWeight: 900, fontSize: '0.95rem', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)' 
          }}>
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section: The AI Era */}
      <section style={{ 
        padding: '200px 8% 120px', position: 'relative', overflow: 'hidden',
        background: isDark ? 'linear-gradient(to bottom, #0b0f19 0%, #0f172a 100%)' : 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '600px', height: '600px', backgroundColor: '#4f46e5', filter: 'blur(180px)', opacity: isDark ? 0.15 : 0.08, borderRadius: '50%', transition: 'opacity 0.3s ease' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '500px', height: '500px', backgroundColor: '#06b6d4', filter: 'blur(180px)', opacity: isDark ? 0.12 : 0.05, borderRadius: '50%', transition: 'opacity 0.3s ease' }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 20px', 
              backgroundColor: isDark ? 'rgba(79, 70, 229, 0.2)' : '#4f46e510', borderRadius: '40px', marginBottom: '32px', border: isDark ? '1px solid rgba(79, 70, 229, 0.4)' : '1px solid #4f46e520',
              transition: 'background-color 0.3s ease, border 0.3s ease'
            }}>
              <Sparkles size={16} color="#4f46e5" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.5px' }}>NEW: PREDICTIVE AI ENGINE IS LIVE</span>
              <ArrowRight size={14} color="#4f46e5" />
            </div>
            
            <h1 style={{ fontSize: '5rem', fontWeight: 950, lineHeight: 1.05, letterSpacing: '-3px', marginBottom: '32px', color: isDark ? '#ffffff' : '#0f172a', transition: 'color 0.3s ease' }}>
              The Operating System <br/>for <span style={{ color: '#4f46e5' }}>Institutional Success.</span>
            </h1>
            
            <p style={{ fontSize: '1.35rem', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '650px', marginBottom: '56px', lineHeight: 1.6, fontWeight: 500, transition: 'color 0.3s ease' }}>
              EduPro blends cutting-edge administrative automation with deep-learning student insights to build the world's most intelligent schools.
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link to="/register" style={{ 
                padding: '20px 48px', fontSize: '1.15rem', backgroundColor: isDark ? '#ffffff' : '#1e293b', color: isDark ? '#0f172a' : 'white', 
                borderRadius: '16px', textDecoration: 'none', fontWeight: 900, transition: '0.3s' 
              }} className="btn-hero-primary">Start Institutional Journey</Link>
              <Link to="/login" style={{ 
                padding: '20px 40px', fontSize: '1.15rem', backgroundColor: 'transparent', color: isDark ? '#ffffff' : '#1e293b', 
                borderRadius: '16px', border: isDark ? '2px solid #334155' : '2px solid #e2e8f0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '14px',
                textDecoration: 'none', transition: '0.3s'
              }} className="btn-hero-secondary">
                <ShieldCheck size={28} /> Access Portal
              </Link>
              <button onClick={() => setShowDemo(true)} style={{ 
                padding: '20px 30px', fontSize: '1.15rem', backgroundColor: 'transparent', color: isDark ? '#94a3b8' : '#64748b', 
                borderRadius: '16px', border: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.3s'
              }} className="btn-demo-minimal">
                <PlayCircle size={24} /> Demo
              </button>
            </div>

            <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '20px' }}>
               <div style={{ display: 'flex' }}>
                 {[eleanorAvatar, janeAvatar, robertAvatar, studentAvatar, devonAvatar].map((avatarSrc, i) => (
                   <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', border: isDark ? '3px solid #0f172a' : '3px solid white', backgroundColor: isDark ? '#1e293b' : '#e2e8f0', marginLeft: i === 0 ? 0 : '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border 0.3s ease, background-color 0.3s ease', overflow: 'hidden' }}>
                     <img src={avatarSrc} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   </div>
                 ))}
               </div>
               <p style={{ margin: 0, fontSize: '0.95rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, transition: 'color 0.3s ease' }}>
                 <span style={{ color: isDark ? '#ffffff' : '#1e293b', fontWeight: 900, transition: 'color 0.3s ease' }}>450k+</span> Students already empowered.
               </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ position: 'relative' }}
          >
            <div style={{ 
              backgroundColor: isDark ? '#1e293b' : '#ffffff', borderRadius: '40px', padding: '12px', 
              boxShadow: isDark ? '0 50px 100px -20px rgba(0, 0, 0, 0.4)' : '0 50px 100px -20px rgba(15, 23, 42, 0.15)', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
              transition: 'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{ backgroundColor: isDark ? '#0f172a' : '#1e293b', borderRadius: '32px', overflow: 'hidden', aspectRatio: '4/3', position: 'relative', transition: 'background-color 0.3s ease' }}>
                 {/* Mock UI Elements */}
                 <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff5f56' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffbd2e' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27c93f' }}></div>
                    </div>
                 </div>
                 <div style={{ padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                   {[...Array(3)].map((_, i) => <div key={i} style={{ height: '60px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', transition: 'background-color 0.3s ease' }}></div>)}
                 </div>
                 <div style={{ margin: '24px', height: '140px', backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.05)', borderRadius: '16px', transition: 'background-color 0.3s ease' }}></div>
                 <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '120px', height: '120px', backgroundColor: '#4f46e5', borderRadius: '24px', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <BarChart3 size={48} />
                 </div>
              </div>
            </div>
            
            {/* Floating Stat Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
              style={{ position: 'absolute', top: '20%', left: '-60px', backgroundColor: isDark ? '#1e293b' : 'white', padding: '16px 24px', borderRadius: '20px', boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.05)', border: isDark ? '1px solid #334155' : 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease' }}
            >
              <div style={{ padding: '8px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '10px' }}><ShieldCheck size={20} /></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>DATA SECURITY</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>100% SECURE</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              style={{ position: 'absolute', bottom: '10%', right: '-40px', backgroundColor: isDark ? '#1e293b' : 'white', padding: '16px 24px', borderRadius: '20px', boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(0,0,0,0.05)', border: isDark ? '1px solid #334155' : 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease' }}
            >
              <div style={{ padding: '8px', backgroundColor: '#eef2ff', color: '#4f46e5', borderRadius: '10px' }}><Cpu size={20} /></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8' }}>AI ENGINE</p>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 900, color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>ACTIVE</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section: Engineering Excellence */}
      <section id="features" style={{ padding: '140px 8%', backgroundColor: isDark ? '#0f172a' : '#ffffff', transition: 'background-color 0.3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '3px' }}>Unmatched Capabilities</span>
          <h2 style={{ fontSize: '4rem', fontWeight: 950, marginTop: '20px', letterSpacing: '-2px', color: isDark ? '#ffffff' : '#0f172a', transition: 'color 0.3s ease' }}>Engineered for <span style={{ color: '#4f46e5' }}>Excellence.</span></h2>
          <p style={{ fontSize: '1.25rem', color: isDark ? '#94a3b8' : '#64748b', maxWidth: '700px', margin: '24px auto', lineHeight: 1.6, transition: 'color 0.3s ease' }}>Every module is meticulously designed to eliminate friction and maximize institutional growth.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          {[
            { icon: <Cpu />, title: 'Predictive Analytics', desc: 'Identify student challenges months before exams with AI behavior mapping.', color: '#4f46e5' },
            { icon: <Monitor />, title: 'Hyper-Fluid Dashboards', desc: 'Interfaces that adapt to your role, whether you are an Admin, Teacher, or Parent.', color: '#06b6d4' },
            { icon: <ShieldCheck />, title: 'Institutional Security', desc: 'Bank-grade encryption for every student record and financial transaction.', color: '#10b981' },
            { icon: <Rocket />, title: 'Rapid Scalability', desc: 'Launch your entire institutional network onto the cloud in record time.', color: '#f59e0b' },
            { icon: <Globe />, title: 'Global Multi-Campus', desc: 'Manage 100+ campuses from a single pane of glass with real-time sync.', color: '#6366f1' },
            { icon: <Award />, title: 'Dynamic Compliance', desc: 'Automated reporting for government and institutional accreditation bodies.', color: '#ec4899' }
          ].map((item, i) => (
            <motion.div 
              key={i} whileHover={{ y: -15 }}
              style={{ 
                padding: '56px 48px', borderRadius: '40px', backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: item.color }}></div>
              <div style={{ width: '64px', height: '64px', backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : `${item.color}10`, color: item.color, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', transition: 'background-color 0.3s ease' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 900, marginBottom: '20px', color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>{item.title}</h3>
              <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 500, transition: 'color 0.3s ease' }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Access Portals */}
      <section style={{ padding: '100px 8%', backgroundColor: isDark ? '#0b0f19' : '#f8fafc', transition: 'background-color 0.3s ease' }}>
        <div style={{ 
          backgroundColor: isDark ? '#0f172a' : '#ffffff', borderRadius: '48px', padding: '80px', 
          border: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9', boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.2)' : '0 40px 80px rgba(0,0,0,0.03)',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', transition: 'all 0.3s ease'
        }}>
          <div style={{ gridColumn: 'span 4', textAlign: 'center', marginBottom: '40px' }}>
             <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '2px' }}>Institutional Access</span>
             <h2 style={{ fontSize: '3rem', fontWeight: 950, marginTop: '16px', letterSpacing: '-1.5px', color: isDark ? '#ffffff' : '#0f172a', transition: 'color 0.3s ease' }}>One Portal. <span style={{ color: '#4f46e5' }}>Total Control.</span></h2>
          </div>
          {[
            { role: 'Admin', icon: <ShieldCheck size={32} />, color: '#4f46e5', desc: 'Central command for school operations and infrastructure.' },
            { role: 'Teacher', icon: <GraduationCap size={32} />, color: '#f59e0b', desc: 'Manage classrooms, grades, and student engagement tools.' },
            { role: 'Student', icon: <Users size={32} />, color: '#3b82f6', desc: 'Access learning materials, assignments, and academic stats.' },
            { role: 'Parent', icon: <Heart size={32} />, color: '#10b981', desc: 'Stay updated on student progress and fee payments.' }
          ].map((p, i) => (
            <motion.div 
              key={i} whileHover={{ y: -10 }}
              onClick={() => navigate('/login', { state: { initialRole: p.role.toLowerCase() } })}
              style={{ 
                padding: '40px', borderRadius: '32px', backgroundColor: isDark ? '#1e293b' : '#f8fafc', 
                border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.3s ease'
              }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: isDark ? '#0f172a' : 'white', color: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: 'background-color 0.3s ease' }}>
                {p.icon}
              </div>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '12px', color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>{p.role} Portal</h4>
              <p style={{ fontSize: '0.95rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, marginBottom: '24px', fontWeight: 500, transition: 'color 0.3s ease' }}>{p.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: p.color, fontWeight: 800, fontSize: '0.9rem' }}>
                Enter Portal <ArrowRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Solutions: Institutional Fit */}
      <section id="solutions" style={{ padding: '140px 8%', backgroundColor: isDark ? '#0b0f19' : '#f8fafc', transition: 'background-color 0.3s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '3px' }}>Institutional Alignment</span>
            <h2 style={{ fontSize: '4rem', fontWeight: 950, marginTop: '20px', lineHeight: 1.1, letterSpacing: '-2px', color: isDark ? '#ffffff' : '#0f172a', transition: 'color 0.3s ease' }}>Adaptive Solutions <br/>for <span style={{ color: '#4f46e5' }}>Every Need.</span></h2>
            <p style={{ fontSize: '1.2rem', color: isDark ? '#94a3b8' : '#64748b', margin: '32px 0 48px', lineHeight: 1.6, transition: 'color 0.3s ease' }}>Our platform scales to match the unique pedagogical and operational requirements of your institution.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {solutions.map((sol, i) => (
                <div 
                  key={i} onClick={() => setActiveSolution(i)}
                  style={{ 
                    padding: '24px 32px', borderRadius: '24px', backgroundColor: activeSolution === i ? (isDark ? '#1e293b' : 'white') : 'transparent',
                    boxShadow: activeSolution === i ? (isDark ? '0 20px 40px rgba(0,0,0,0.15)' : '0 20px 40px rgba(0,0,0,0.03)') : 'none',
                    border: activeSolution === i ? (isDark ? '1px solid #334155' : '1px solid #f1f5f9') : '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '20px'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${sol.color}15`, color: sol.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sol.icon}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: activeSolution === i ? (isDark ? '#ffffff' : '#1e293b') : (isDark ? '#94a3b8' : '#64748b'), transition: 'color 0.3s ease' }}>{sol.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
             <AnimatePresence mode="wait">
               <motion.div 
                 key={activeSolution}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 style={{ 
                   backgroundColor: isDark ? '#1e293b' : 'white', borderRadius: '48px', padding: '60px', 
                   boxShadow: isDark ? '0 40px 80px -15px rgba(0,0,0,0.2)' : '0 40px 80px -15px rgba(0,0,0,0.05)', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9',
                   transition: 'background-color 0.3s ease, border 0.3s ease, box-shadow 0.3s ease'
                 }}
               >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                   <div style={{ width: '70px', height: '70px', borderRadius: '22px', backgroundColor: `${solutions[activeSolution].color}15`, color: solutions[activeSolution].color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {solutions[activeSolution].icon}
                   </div>
                   <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>{solutions[activeSolution].title}</h3>
                 </div>
                 <p style={{ fontSize: '1.3rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.6, marginBottom: '48px', fontWeight: 500, transition: 'color 0.3s ease' }}>{solutions[activeSolution].desc}</p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {solutions[activeSolution].features.map((f, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '1.1rem', fontWeight: 700, color: isDark ? '#cbd5e0' : '#475569', transition: 'color 0.3s ease' }}>
                        <div style={{ color: solutions[activeSolution].color }}><CircleCheck size={20} /></div> {f}
                      </div>
                    ))}
                 </div>
                 <button 
                   onClick={() => navigate('/register', { state: { tier: solutions[activeSolution].title } })}
                   style={{ 
                    marginTop: '56px', width: '100%', padding: '20px', borderRadius: '18px', 
                    backgroundColor: solutions[activeSolution].color, color: 'white', 
                    border: 'none', fontSize: '1.1rem', fontWeight: 900, boxShadow: `0 10px 20px ${solutions[activeSolution].color}30`,
                    cursor: 'pointer'
                   }}
                 >
                   Explore {solutions[activeSolution].title}
                 </button>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Stats Section: Scale & Reliability */}
      <section style={{ padding: '120px 8%', backgroundColor: '#1e293b', color: 'white', textAlign: 'center' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '80px', maxWidth: '1200px', margin: '0 auto' }}>
            {[
              { label: 'Elite Institutions', value: counts.institutions, color: '#4f46e5' },
              { label: 'Active Students', value: counts.students.toLocaleString(), color: '#06b6d4' },
              { label: 'System Uptime', value: counts.uptime + '%', color: '#10b981' }
            ].map((stat, i) => (
              <div key={i}>
                <h3 style={{ fontSize: '5rem', fontWeight: 900, color: stat.color, margin: 0, letterSpacing: '-3px' }}>{stat.value}{stat.label !== 'System Uptime' && '+'}</h3>
                <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94a3b8', marginTop: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Resources: Institutional Intelligence */}
      <section id="resources" style={{ padding: '140px 8%', backgroundColor: isDark ? '#0f172a' : '#ffffff', transition: 'background-color 0.3s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '3px' }}>Knowledge Hub</span>
          <h2 style={{ fontSize: '4rem', fontWeight: 950, marginTop: '20px', letterSpacing: '-2px', color: isDark ? '#ffffff' : '#0f172a', transition: 'color 0.3s ease' }}>Insights & <span style={{ color: '#ec4899' }}>Guides.</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
          {[
            { 
              tag: 'Whitepaper', 
              title: 'The Future of AI in K-12', 
              desc: 'Exploring how adaptive learning algorithms and generative AI are transforming student outcomes and teacher efficiency.',
              fullText: 'Artificial Intelligence is no longer a futuristic concept but a present reality in K-12 education. This whitepaper explores the implementation of predictive analytics to identify learning gaps, the role of generative AI in personalized tutoring, and the ethical frameworks required to protect student data. We analyze case studies from 500+ global institutions that have seen a 30% increase in student engagement since adopting AI-driven pedagogical tools.',
              time: '12 min read', 
              img: aiWhitepaper,
              color: '#4f46e5' 
            },
            { 
              tag: 'Guide', 
              title: 'Modernizing Campus Operations', 
              desc: 'A comprehensive framework for transitioning traditional institutional workflows to a unified digital ecosystem.',
              fullText: 'Modernizing a campus requires more than just new software; it requires a paradigm shift in operational strategy. This guide outlines the "Fluid Campus" model, focusing on the decentralization of administrative tasks, the integration of real-time financial auditing, and the elimination of departmental data silos. Learn how to achieve 99.9% operational efficiency while reducing overhead costs by up to 40% through unified digital transformation.',
              time: '15 min read', 
              img: campusGuide,
              color: '#06b6d4' 
            },
            { 
              tag: 'Case Study', 
              title: 'Global University Scaling', 
              desc: 'How the world’s leading university networks maintain 99.9% availability while serving millions of concurrent requests.',
              fullText: 'Scaling to serve millions of students across continents requires a robust, cloud-native infrastructure. This case study examines the architecture of the EduPro Elite OS, focusing on our multi-region database synchronization, edge-computing for low-latency LMS delivery, and the fail-safe protocols that ensure uninterrupted institutional access. We detail the technology stack that allows a single institution to manage 100+ global campuses from a unified command center.',
              time: '8 min read', 
              img: universityScaling,
              color: '#10b981' 
            }
          ].map((res, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -15, boxShadow: isDark ? '0 40px 80px rgba(0,0,0,0.4)' : '0 40px 80px rgba(0,0,0,0.1)' }}
              onClick={() => setSelectedResource(res)}
              style={{ 
                backgroundColor: isDark ? '#1e293b' : 'white', borderRadius: '40px', overflow: 'hidden', 
                boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(0,0,0,0.03)', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column'
              }}
            >
              <div style={{ height: '280px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={res.img} 
                  alt={res.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s ease' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ 
                  position: 'absolute', top: '24px', left: '24px', padding: '10px 20px', 
                  backgroundColor: isDark ? '#0f172a' : 'white', borderRadius: '30px', fontSize: '0.75rem', 
                  fontWeight: 900, color: res.color, letterSpacing: '1px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'background-color 0.3s ease'
                }}>
                  {res.tag}
                </div>
              </div>
              <div style={{ padding: '48px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 700 }}>
                   <Clock size={16} /> {res.time}
                </div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 950, marginBottom: '20px', color: isDark ? '#ffffff' : '#1e293b', lineHeight: 1.2, letterSpacing: '-0.5px', transition: 'color 0.3s ease' }}>{res.title}</h3>
                <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px', flex: 1, transition: 'color 0.3s ease' }}>{res.desc}</p>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', color: res.color, 
                  fontWeight: 900, fontSize: '1rem', transition: '0.3s' 
                }}>
                  Read Full Insight <ArrowRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 2000, 
              backgroundColor: 'rgba(2, 6, 23, 0.98)', backdropFilter: 'blur(24px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              style={{ 
                width: '100%', maxWidth: '900px', backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                borderRadius: '48px', overflow: 'hidden', boxShadow: '0 80px 160px rgba(0,0,0,0.6)',
                position: 'relative', maxHeight: '90vh', overflowY: 'auto', border: isDark ? '1px solid #334155' : 'none', transition: 'all 0.3s ease'
              }}
            >
              <div style={{ height: '350px', position: 'relative' }}>
                <img src={selectedResource.img} alt={selectedResource.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setSelectedResource(null)}
                  style={{ position: 'absolute', top: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isDark ? '#0f172a' : 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#ffffff' : '#1e293b', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' }}
                >
                  <X size={24} />
                </button>
              </div>
              <div style={{ padding: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                   <span style={{ padding: '8px 20px', borderRadius: '30px', backgroundColor: isDark ? '#0f172a' : `${selectedResource.color}15`, color: selectedResource.color, fontWeight: 900, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', transition: 'background-color 0.3s ease' }}>{selectedResource.tag}</span>
                   <span style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s ease' }}><Clock size={18} /> {selectedResource.time}</span>
                </div>
                <h2 style={{ fontSize: '3rem', fontWeight: 950, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '32px', lineHeight: 1.1, letterSpacing: '-2px', transition: 'color 0.3s ease' }}>{selectedResource.title}</h2>
                <div style={{ fontSize: '1.25rem', color: isDark ? '#cbd5e0' : '#475569', lineHeight: 1.8, marginBottom: '48px', transition: 'color 0.3s ease' }}>
                   {selectedResource.fullText}
                </div>
                <div style={{ padding: '32px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '24px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', transition: 'all 0.3s ease' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', transition: 'color 0.3s ease' }}>Institutional Access Required</h4>
                        <button 
                          onClick={async () => {
                            if (isSharing.current) return;
                            isSharing.current = true;
                            const shareUrl = `${window.location.origin}/knowledge-hub/${selectedResource.title.toLowerCase().replace(/ /g, '-')}`;
                            try {
                              if (navigator.share) {
                                await navigator.share({ title: selectedResource.title, text: selectedResource.desc, url: shareUrl });
                              } else {
                                throw new Error('Fallback to clipboard');
                              }
                            } catch (err) {
                               if (err.name !== 'AbortError') {
                                 await navigator.clipboard.writeText(shareUrl);
                                 showToast('Link to this insight copied to clipboard!', 'success', 'Link Copied');
                               }
                            } finally {
                              isSharing.current = false;
                            }
                          }}
                          style={{ 
                            background: 'none', border: 'none', color: selectedResource.color, 
                            fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' 
                          }}
                        >
                          <Share2 size={16} /> Share This Insight
                        </button>
                     </div>
                     <p style={{ margin: 0, color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500, transition: 'color 0.3s ease' }}>To download the full 50-page PDF whitepaper and accompanying data sets, please authenticate with your institutional account or register as a new partner.</p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                       <Link to="/register" style={{ padding: '16px 32px', backgroundColor: isDark ? '#ffffff' : '#1e293b', color: isDark ? '#0f172a' : 'white', borderRadius: '14px', textDecoration: 'none', fontWeight: 900, fontSize: '0.95rem', transition: 'all 0.3s ease' }}>Partner Registration</Link>
                       <Link to="/login" style={{ padding: '16px 32px', backgroundColor: 'transparent', color: isDark ? '#ffffff' : '#1e293b', borderRadius: '14px', textDecoration: 'none', fontWeight: 800, border: isDark ? '2px solid #334155' : '2px solid #e2e8f0', fontSize: '0.95rem', transition: 'all 0.3s ease' }}>Member Login</Link>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive CTA */}
      <section style={{ padding: '160px 8%', textAlign: 'center', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a', color: 'white' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #4f46e5 0%, transparent 70%)', opacity: 0.1 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '4.5rem', fontWeight: 950, marginBottom: '32px', letterSpacing: '-3px' }}>Empower Your <br/>Institution Today.</h2>
          <p style={{ fontSize: '1.5rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 64px', lineHeight: 1.6, fontWeight: 500 }}>Join thousands of educational leaders who are building the future with EduPro.</p>
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <Link to="/register" style={{ padding: '24px 64px', fontSize: '1.3rem', backgroundColor: '#4f46e5', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 900, boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4)' }}>Create Institution Account</Link>
            <Link to="/contact" style={{ padding: '24px 64px', fontSize: '1.3rem', backgroundColor: 'transparent', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 800, border: '2px solid rgba(255,255,255,0.1)' }}>Request Private Demo</Link>
          </div>
        </div>
      </section>
      {/* Video Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 2000, 
              backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(24px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              style={{ 
                width: '100%', maxWidth: '1280px', backgroundColor: isDark ? '#1e293b' : '#ffffff', 
                borderRadius: '48px', overflow: 'hidden', boxShadow: '0 80px 160px rgba(0,0,0,0.6)',
                display: 'grid', gridTemplateColumns: '1.4fr 1fr', height: '85vh', minHeight: '700px',
                border: isDark ? '1px solid #334155' : 'none', transition: 'all 0.3s ease'
              }}
            >
              {/* Immersive Video Side */}
              <div style={{ backgroundColor: '#020617', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {/* Cyberpunk Grid Background */}
                 <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }}></div>
                 
                 {/* Animated Scanning Line */}
                 <motion.div 
                   animate={{ top: ['-10%', '110%'] }}
                   transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                   style={{ position: 'absolute', left: 0, right: 0, height: '200px', background: 'linear-gradient(to bottom, transparent, rgba(79, 70, 229, 0.2), transparent)', zIndex: 1 }}
                 />

                 <div style={{ position: 'absolute', top: '48px', left: '48px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 15px #ef4444' }}></div>
                    <span style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px' }}>LIVE_SYSTEM_WALKTHROUGH.OS</span>
                 </div>

                 {/* Central Interaction Mockup */}
                 <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ 
                        width: '120px', height: '120px', borderRadius: '50%', border: '2px solid rgba(79, 70, 229, 0.5)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)', boxShadow: '0 0 60px rgba(79, 70, 229, 0.3)'
                      }}
                    >
                       <PlayCircle size={60} color="#4f46e5" fill="#4f46e5" style={{ filter: 'drop-shadow(0 0 20px #4f46e5)' }} />
                    </motion.div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                       <h4 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 950, letterSpacing: '-1px' }}>EduPro Intelligence Engine v4.0</h4>
                       <p style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>Synchronizing Global Data Nodes...</p>
                    </div>
                 </div>

                 {/* Floating Data Chips */}
                 <motion.div 
                   animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                   transition={{ duration: 5, repeat: Infinity }}
                   style={{ position: 'absolute', top: '150px', right: '60px', padding: '16px 24px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
                 >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                       <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>PREDICTIVE_ACTIVE</span>
                    </div>
                 </motion.div>
              </div>

              {/* Content Side */}
              <div style={{ padding: '80px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <button 
                  onClick={() => setShowDemo(false)}
                  style={{ position: 'absolute', top: '48px', right: '48px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#ffffff' : '#1e293b', transition: 'all 0.3s ease' }}
                  className="modal-close-btn"
                >
                  <X size={28} />
                </button>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: '#4f46e510', padding: '8px 20px', borderRadius: '30px', marginBottom: '32px' }}>
                    <Sparkles size={16} color="#4f46e5" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '1px' }}>Interactive Showcase</span>
                  </div>

                  <h3 style={{ fontSize: '3.5rem', fontWeight: 950, color: isDark ? '#ffffff' : '#0f172a', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-2px', transition: 'color 0.3s ease' }}>
                    The Intelligence <br/>Behind <span style={{ color: '#4f46e5' }}>EduPro.</span>
                  </h3>
                  <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '56px', fontWeight: 500, transition: 'color 0.3s ease' }}>
                    Witness the fusion of administrative precision and AI-driven pedagogical insights. A platform built for the elite institution.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                     {[
                       { title: 'Automated Operations', desc: 'No-manual workflows.', icon: <Rocket size={20} /> },
                       { title: 'AI Student Insights', desc: 'Behavioral mapping.', icon: <BarChart3 size={20} /> },
                       { title: 'Financial Integrity', desc: 'Automated auditing.', icon: <ShieldCheck size={20} /> },
                       { title: 'Global Multi-Sync', desc: 'Real-time campus data.', icon: <Globe size={20} /> }
                     ].map((item, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.1 + 0.3 }}
                         style={{ padding: '24px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '24px', border: isDark ? '1px solid #334155' : '1px solid #f1f5f9', transition: 'all 0.3s ease' }}
                       >
                          <div style={{ color: '#4f46e5', marginBottom: '16px' }}>{item.icon}</div>
                          <h5 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '6px', color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.3s ease' }}>{item.title}</h5>
                          <p style={{ fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, margin: 0, transition: 'color 0.3s ease' }}>{item.desc}</p>
                       </motion.div>
                     ))}
                  </div>
                </div>

                <div style={{ marginTop: '60px', display: 'flex', gap: '20px' }}>
                   <Link to="/register" style={{ flex: 1.5, textAlign: 'center', padding: '24px', backgroundColor: isDark ? '#ffffff' : '#1e293b', color: isDark ? '#0f172a' : 'white', borderRadius: '18px', textDecoration: 'none', fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' }}>Initialize System Account</Link>
                   <button onClick={() => setShowDemo(false)} style={{ flex: 1, padding: '24px', backgroundColor: 'transparent', color: isDark ? '#cbd5e0' : '#64748b', borderRadius: '18px', border: isDark ? '2px solid #334155' : '2px solid #e2e8f0', fontWeight: 800, fontSize: '1.1rem', transition: 'all 0.3s ease', cursor: 'pointer' }}>Close Briefing</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link:hover { color: #4f46e5 !important; }
        .btn-hero-primary:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
        .btn-hero-secondary:hover { background-color: ${isDark ? '#1e293b' : '#f8fafc'}; border-color: #4f46e5; color: #4f46e5 !important; }
        .btn-login-portal:hover { border-color: #4f46e5 !important; background-color: ${isDark ? '#1e293b' : '#f8fafc'}; }
        .btn-demo-minimal:hover { color: #4f46e5 !important; }
      ` }} />
      <Footer shareTitle="EduPro Elite Home" newsletterId="newsletter-email-home" />
      <ToastRenderer toast={toast} onClose={hideToast} />
    </div>
  );
};

export default Home;
