import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Loans from './pages/Loans';
import TransferModal from './components/TransferModal';
import * as api from './services/api';
import './App.css';

/* ── SVG Icons ─────────────────────────────────────────── */
const Icon = {
  wallet: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  transactions: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  cards: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
  loan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1V11a2 2 0 0 1-2-2 2 2 0 0 1 2-2v.09A1.65 1.65 0 0 0 5 4.6a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  menu: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  bank: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  transfer: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 21 7 17 3"></polyline><path d="M21 7H9a5 5 0 0 0-5 5v3"></path><polyline points="7 13 3 17 7 21"></polyline><path d="M3 17h12a5 5 0 0 0 5-5V9"></path></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [newName, setNewName] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createAccount({ accountOwnerName: newName, balance: 0 });
      setNewName(''); setAddOpen(false);
      setRefreshTrigger(prev => prev + 1);
      showToast('Account created successfully!');
    } catch { showToast('Failed to create account.', 'error'); }
  };

  const handleTransfer = async (fromId, toId, amount) => {
    try {
      await api.transfer(fromId, toId, amount);
      setTransferOpen(false);
      setRefreshTrigger(prev => prev + 1);
      showToast(`Transfer of Tsh ${amount.toLocaleString()} successful!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Transfer failed.', 'error');
    }
  };

  const triggerTransfer = (source = null) => {
    setSelectedSource(source);
    setTransferOpen(true);
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* ── Mobile Overlay ─── */}
        {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        {/* ── Sidebar ─── */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <Link to="/" className="navbar-brand" onClick={() => setSidebarOpen(false)}>
              <div className="logo-icon">{Icon.wallet}</div>
              <h1>Wekeza<span>Bank</span></h1>
            </Link>
          </div>
          
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end onClick={() => setSidebarOpen(false)}>
              {Icon.dashboard} Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {Icon.transactions} Transactions
            </NavLink>
            <NavLink to="/cards" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {Icon.cards} Cards
            </NavLink>
            <NavLink to="/loans" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
              {Icon.loan} Loans
            </NavLink>

            <button 
              className="sidebar-link" 
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem' }}
              onClick={() => { setAddOpen(true); setSidebarOpen(false); }}
            >
              <span style={{ color: 'var(--primary-light)', display: 'flex', alignItems: 'center' }}>{Icon.plus}</span> 
              Open Account
            </button>

            <button 
              className="sidebar-link" 
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              onClick={() => triggerTransfer(null)}
            >
              <span style={{ color: '#a855f7', display: 'flex', alignItems: 'center' }}>{Icon.transfer}</span> 
              Transfer Funds
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar">WK</div>
              <div className="user-info">
                <h4>Wekeza User</h4>
                <p>Premium Member</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile Navbar ─── */}
        <nav className="navbar md-only" style={{ display: 'none' }}>
           <div className="container">
              <button className="btn btn-ghost p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {Icon.menu}
              </button>
              <div className="navbar-brand">
                <h1>Wekeza<span>Bank</span></h1>
              </div>
              <div className="avatar">WK</div>
           </div>
        </nav>
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 1024px) {
            .navbar.md-only { display: flex !important; }
          }
        `}} />

        {/* ── Main Content ─── */}
        <main className="main-content">
          <div className="container" style={{ paddingTop: '2.5rem' }}>
            <Routes>
              <Route path="/" element={<Dashboard showToast={showToast} refreshTrigger={refreshTrigger} onTriggerTransfer={triggerTransfer} />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/loans" element={<Loans showToast={showToast} />} />
            </Routes>
          </div>
        </main>

        {/* ── Create Account Modal ─── */}
        {addOpen && (
          <div className="overlay">
            <div className="modal">
              <button className="modal-close" onClick={() => setAddOpen(false)}>{Icon.close}</button>
              <div className="modal-icon deposit">{Icon.bank}</div>
              <h2>Open New Account</h2>
              <p className="modal-sub">Fill in the details to create a new bank account.</p>
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="label">Account Owner Name</label>
                  <div className="input-icon-wrap">
                    <span className="icon-prefix">{Icon.user}</span>
                    <input
                      type="text"
                      className="input"
                      placeholder="Enter full name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                    {Icon.plus} Create Account
                  </button>
                  <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setAddOpen(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <TransferModal
          isOpen={transferOpen}
          onClose={() => setTransferOpen(false)}
          onSubmit={handleTransfer}
          sourceAccount={selectedSource}
        />

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
