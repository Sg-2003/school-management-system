import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AIChatbot from '../components/AIChatbot';
import { Menu, Sun, Moon, Bell, User, LogOut, Activity, Search, X, Settings } from 'lucide-react';
import { logout } from '../services/service';

const MainLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Academic Alert: Exam Results Out', time: '2h ago', type: 'academic', unread: true },
    { id: 2, title: 'Finance: Fee Receipt Generated', time: '5h ago', type: 'finance', unread: true },
    { id: 3, title: 'Security: New Login Detected', time: '1d ago', type: 'security', unread: false }
  ]);

  useEffect(() => {
    const syncTheme = () => {
      const storedTheme = localStorage.getItem('theme');
      setIsDark(storedTheme === 'dark');
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('storage', syncTheme);
    window.addEventListener('resize', handleResize);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    return () => {
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div>
      {/* Mobile Backdrop Overlay */}
      {isMobile && mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1015,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isMobile={isMobile} />
      
      <Topbar toggleSidebar={() => {
        if (isMobile) {
          setMobileOpen(!mobileOpen);
        } else {
          setCollapsed(!collapsed);
        }
      }} />

      <main className="main-content">
        <div style={{ minHeight: 'calc(100vh - 160px)' }}>
          <Outlet />
        </div>
        
        {/* Global Footer */}
        <footer style={{ 
          marginTop: '40px', padding: '32px 0', borderTop: '1px solid var(--border-color)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          color: 'var(--text-muted)', fontSize: '0.85rem'
        }}>
          <div>
            © {new Date().getFullYear()} <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>EduPro Elite</span> OS. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '24px', fontWeight: 600 }}>
            <span 
              onClick={() => navigate('/privacy')} 
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Privacy Policy
            </span>
            <span 
              onClick={() => navigate('/terms')} 
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Terms of Service
            </span>
            <span 
              onClick={() => navigate('/contact')} 
              style={{ cursor: 'pointer', transition: '0.3s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              Support
            </span>
          </div>
        </footer>
      </main>

      <AIChatbot />
    </div>
  );
};

export default MainLayout;
