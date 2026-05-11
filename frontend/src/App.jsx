import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import './App.css';

/* ── SVG Icons ─────────────────────────────────────────── */
const Icon = {
  wallet: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

const Settings = () => (
  <div className="container anim-fade-up">
    <div className="section-header" style={{ marginTop: '2.5rem' }}>
      <div>
        <h2>Account Settings</h2>
        <p>Manage your profile and security preferences</p>
      </div>
    </div>
    <div className="glass-card p-12 text-center">
      <p className="text-muted">Security settings and profile management coming soon.</p>
    </div>
  </div>
);

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* ── Navbar ─── */}
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <div className="logo-icon">{Icon.wallet}</div>
              <h1>Vortex<span>Bank</span></h1>
            </Link>
            <div className="navbar-links">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Dashboard</NavLink>
              <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Transactions</NavLink>
              <NavLink to="/cards" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Cards</NavLink>
              <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Settings</NavLink>
            </div>
            <div className="navbar-actions">
              <div className="avatar">VB</div>
            </div>
          </div>
        </nav>

        {/* ── Main ─── */}
        <main className="dashboard">
          <div className="container">
            <Routes>
              <Route path="/" element={<Dashboard showToast={showToast} />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>

        {/* ── Toast ─── */}
        {toast && (
          <div style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 200,
            background: toast.type === 'error' ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
            backdropFilter: 'blur(12px)',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            color: toast.type === 'error' ? '#fb7185' : '#34d399',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            animation: 'fadeUp 0.3s ease-out both',
            maxWidth: '320px',
          }}>
            {toast.msg}
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
