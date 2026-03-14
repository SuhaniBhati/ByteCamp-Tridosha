import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Navbar */}
      <nav style={{ 
        padding: '1rem 2rem', 
        background: 'rgba(30, 41, 59, 0.8)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--panel-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600', fontSize: '1.25rem' }}>
          <LayoutDashboard color="var(--accent-color)" />
          <span>MyApp</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <User size={18} />
            <span style={{ fontSize: '0.875rem' }}>{user?.name || user?.email || 'User'}</span>
          </div>
          <button 
            type="button"
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--error-color)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={16} style={{ pointerEvents: 'none' }} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="animate-fade-in">
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Welcome to your Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
            You have successfully authenticated multi-layer security.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {[1, 2, 3].map((card) => (
              <div key={card} className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'rgba(59, 130, 246, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-color)', borderRadius: '4px' }}></div>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Module {card}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  This is a placeholder card to demonstrate the premium glassmorphism aesthetic of your new application dashboard.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
