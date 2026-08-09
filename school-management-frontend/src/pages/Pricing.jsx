import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Check, Award, ShieldCheck, ArrowRight, HelpCircle, 
  Globe, Users, Zap as ZapIcon, Shield, CreditCard, Sparkles, MessageCircle, Star, Activity,
  Share2, Mail, Layers, Cpu, Database, Smartphone, BarChart3, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [activeTab, setActiveTab] = useState('academic');
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Starter',
      price: isYearly ? '0' : '0',
      desc: 'Perfect for small coaching centers and emerging schools.',
      icon: <Shield size={28} />,
      color: '#6366f1',
      features: ['Up to 50 Students', 'Digital Attendance', 'Basic Gradebook', 'Email Support', '1 Admin User'],
      cta: 'Start for Free',
      popular: false,
      tier: 'Level 1',
      path: '/register'
    },
    {
      name: 'Professional',
      price: isYearly ? '49' : '59',
      desc: 'The complete digital operating system for K-12 schools.',
      icon: <ZapIcon size={28} />,
      color: '#8b5cf6',
      features: ['Unlimited Students', 'AI Performance Insights', 'Online Fee Payments', 'Parent Portal App', '24/7 Priority Support', 'Smart ID Cards'],
      cta: 'Get Started Now',
      popular: true,
      tier: 'Most Popular',
      path: '/register'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'Advanced solutions for large school networks and universities.',
      icon: <Award size={28} />,
      color: '#ec4899',
      features: ['Multi-Campus Sync', 'White-label Branding', 'Custom API Access', 'Dedicated Account Manager', 'On-site Training', 'Single Sign-On (SSO)'],
      cta: 'Contact Sales',
      popular: false,
      tier: 'Custom Solutions',
      path: '/contact'
    }
  ];

  const comparisons = {
    academic: [
      { name: 'Student Information System', starter: true, pro: true, enterprise: true },
      { name: 'Attendance & Tracking', starter: 'Basic', pro: 'Biometric/AI', enterprise: 'Global Sync' },
      { name: 'Examination Suite', starter: 'Standard', pro: 'Advanced AI', enterprise: 'Custom Formats' },
      { name: 'LMS Integration', starter: false, pro: true, enterprise: true }
    ],
    finance: [
      { name: 'Online Fee Collection', starter: false, pro: true, enterprise: true },
      { name: 'Expense Management', starter: 'Basic', pro: 'Advanced', enterprise: 'Full ERP' },
      { name: 'Payroll & HR', starter: false, pro: true, enterprise: true },
      { name: 'Inventory & Assets', starter: false, pro: false, enterprise: true }
    ],
    technical: [
      { name: 'Mobile App (Parent/Student)', starter: false, pro: true, enterprise: true },
      { name: 'Custom Domain', starter: false, pro: false, enterprise: true },
      { name: 'API Access', starter: false, pro: 'Limited', enterprise: 'Unlimited' },
      { name: 'Data Security', starter: 'Standard', pro: 'Bank-Grade', enterprise: 'ISO Certified' }
    ]
  };

  return (
    <div style={{ backgroundColor: '#030712', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      {/* Animated Background Elements */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
      </div>

      {/* Premium Navbar */}
      <nav style={{ 
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '0 8%', backgroundColor: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
          <div style={{ padding: '10px', backgroundColor: '#6366f1', borderRadius: '14px', color: 'white', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <span style={{ fontSize: '1.75rem', fontWeight: 950, color: 'white', letterSpacing: '-2.2px', lineHeight: 1 }}>
              EduPro <small style={{ color: '#6366f1', fontSize: '0.8rem', verticalAlign: 'middle', marginLeft: '4px' }}>ELITE</small>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
               <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366f1' }}></div>
               <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>Operating System</span>
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Link to="/about" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>Features</Link>
          <Link to="/gallery" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>Showcase</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>Support</Link>
          <Link to="/login" style={{ padding: '12px 28px', borderRadius: '12px', fontWeight: 700, backgroundColor: '#6366f1', color: 'white', textDecoration: 'none', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>Portal Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '120px 8% 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 20px', borderRadius: '30px', marginBottom: '32px' }}>
            <Sparkles size={16} color="#6366f1" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#818cf8' }}>Future-Proof Your Institution</span>
          </div>
          <h1 style={{ fontSize: '5rem', fontWeight: 950, margin: '0 0 24px', lineHeight: 0.95, letterSpacing: '-4px' }}>
            Predictable Pricing. <br/>
            <span style={{ background: 'linear-gradient(to right, #818cf8, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unmatched Intelligence.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 60px', lineHeight: 1.6, fontWeight: 500 }}>
            Join the educational elite. Secure a digital operating system that scales as fast as your ambition. 
            Transparent, secure, and built for the next century of learning.
          </p>

          {/* Yearly Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '80px' }}>
            <span style={{ fontWeight: 800, color: !isYearly ? 'white' : '#4b5563', fontSize: '1.1rem' }}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              style={{ 
                width: '80px', height: '40px', borderRadius: '40px', backgroundColor: '#1f2937', 
                position: 'relative', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', padding: '4px'
              }}
            >
              <motion.div 
                animate={{ x: isYearly ? 40 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ width: '32px', height: '32px', backgroundColor: '#6366f1', borderRadius: '50%', boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}
              ></motion.div>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 800, color: isYearly ? 'white' : '#4b5563', fontSize: '1.1rem' }}>Yearly</span>
              <span style={{ padding: '6px 14px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 900, borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>SAVE 20%</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', maxWidth: '1300px', margin: '0 auto' }}>
          {plans.map((plan, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, borderColor: plan.color }}
              style={{ 
                padding: '60px 40px', textAlign: 'left', borderRadius: '32px', position: 'relative',
                backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
              }}
            >
              {plan.popular && (
                <div style={{ 
                  position: 'absolute', top: 0, right: 0, 
                  backgroundColor: plan.color, color: 'white', padding: '8px 24px', 
                  fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px',
                  borderBottomLeftRadius: '20px'
                }}>
                  Best Value
                </div>
              )}

              <div style={{ 
                width: '64px', height: '64px', borderRadius: '18px', 
                backgroundColor: `${plan.color}20`, color: plan.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px',
                border: `1px solid ${plan.color}40`
              }}>
                {plan.icon}
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: plan.color, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>{plan.tier}</span>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '12px' }}>{plan.name}</h3>
              <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '40px', lineHeight: 1.6, height: '50px' }}>{plan.desc}</p>

              <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '4rem', fontWeight: 950 }}>{plan.price !== 'Custom' ? `$${plan.price}` : 'Custom'}</span>
                {plan.price !== 'Custom' && <span style={{ fontSize: '1.25rem', color: '#4b5563', fontWeight: 700 }}>/mo</span>}
              </div>

              <button 
                onClick={() => navigate(plan.path)}
                style={{ 
                  width: '100%', padding: '20px', marginBottom: '48px', borderRadius: '16px',
                  backgroundColor: plan.popular ? plan.color : 'rgba(255,255,255,0.05)',
                  color: 'white', fontWeight: 800, border: 'none',
                  fontSize: '1.1rem', transition: '0.3s', cursor: 'pointer',
                  boxShadow: plan.popular ? `0 15px 30px ${plan.color}40` : 'none'
                }}
              >
                {plan.cta}
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {plan.features.map((feat, index) => (
                  <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${plan.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color={plan.color} strokeWidth={4} />
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 500, color: '#e5e7eb' }}>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Section - High Tech Version */}
      <section style={{ padding: '120px 8%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2px' }}>Deep <span style={{ color: '#6366f1' }}>Capability</span> Matrix</h2>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Every module, engineered for high-performance institutions.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '60px' }}>
          {[
            { id: 'academic', label: 'Academic Suite', icon: <Cpu size={18} /> },
            { id: 'finance', label: 'Finance Hub', icon: <CreditCard size={18} /> },
            { id: 'technical', label: 'Infrastructure', icon: <Layers size={18} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '14px 28px', borderRadius: '14px', backgroundColor: activeTab === tab.id ? '#6366f1' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? 'white' : '#94a3b8', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, cursor: 'pointer', transition: '0.3s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '32px', padding: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.2 }}
             >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ color: '#4b5563', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                      <th style={{ textAlign: 'left', padding: '24px' }}>Feature Module</th>
                      <th style={{ textAlign: 'center', padding: '24px' }}>Starter</th>
                      <th style={{ textAlign: 'center', padding: '24px' }}>Pro</th>
                      <th style={{ textAlign: 'center', padding: '24px' }}>Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons[activeTab].map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '24px', fontWeight: 600, color: 'white', fontSize: '1.1rem' }}>{row.name}</td>
                        <td style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>{typeof row.starter === 'boolean' ? (row.starter ? <Check color="#6366f1" /> : '-') : row.starter}</td>
                        <td style={{ padding: '24px', textAlign: 'center', color: '#8b5cf6', fontWeight: 800 }}>{typeof row.pro === 'boolean' ? (row.pro ? <Check color="#8b5cf6" /> : '-') : row.pro}</td>
                        <td style={{ padding: '24px', textAlign: 'center', color: '#ec4899', fontWeight: 800 }}>{typeof row.enterprise === 'boolean' ? (row.enterprise ? <Check color="#ec4899" /> : '-') : row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </motion.div>
           </AnimatePresence>
        </div>
      </section>

      {/* Global Tech Stats */}
      <section style={{ padding: '100px 8%', textAlign: 'center', backgroundColor: 'rgba(99, 102, 241, 0.03)' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {[
              { icon: <Database />, val: '99.99%', label: 'Uptime SLA' },
              { icon: <Smartphone />, val: '500k+', label: 'Active Mobile Users' },
              { icon: <Lock />, val: 'AES-256', label: 'Encryption Standard' },
              { icon: <BarChart3 />, val: '50M+', label: 'Insights Generated' }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ color: '#6366f1', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: '4px' }}>{stat.val}</h4>
                <p style={{ color: '#4b5563', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Testimonials - Elite Edition */}
      <section style={{ padding: '140px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-2px' }}>Voices of the <span style={{ color: '#ec4899' }}>Elite.</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {[
            { name: 'Dr. Sunita Rao', role: 'Global Director, Acadia Group', text: 'EduPro ELITE is not just a platform; it is a force multiplier for our pedagogical mission.' },
            { name: 'Marcus Thorne', role: 'Head of IT, Sterling Network', text: 'The security and multi-campus sync are years ahead of the competition. Simply peerless.' },
            { name: 'Elena Rodriguez', role: 'COO, BrightFuture Systems', text: 'Our operational efficiency jumped by 40% in the first quarter alone. Incredible data fidelity.' }
          ].map((t, i) => (
            <div key={i} style={{ padding: '48px', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '32px' }}>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.6, marginBottom: '32px', color: '#d1d5db', fontStyle: 'italic' }}>"{t.text}"</p>
              <div>
                <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>{t.name}</h5>
                <p style={{ margin: 0, color: '#6366f1', fontSize: '0.9rem', fontWeight: 700 }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '140px 8%', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #4f46e5, #ec4899)', opacity: 0.1 }}></div>
         <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h2 style={{ fontSize: '4.5rem', fontWeight: 950, letterSpacing: '-3px', marginBottom: '32px' }}>Ready to Command the Future?</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Link to="/register" style={{ padding: '20px 48px', borderRadius: '18px', backgroundColor: 'white', color: '#030712', fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>Initialize Setup</Link>
              <Link to="/contact" style={{ padding: '20px 48px', borderRadius: '18px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 800, fontSize: '1.2rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>Request Briefing</Link>
            </div>
         </div>
      </section>

      <Footer shareTitle="EduPro Elite Pricing" newsletterId="newsletter-email-pricing" />
    </div>
  );
};

export default Pricing;
