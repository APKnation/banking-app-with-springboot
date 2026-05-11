import React, { useState, useEffect } from 'react';
import AccountCard from './components/AccountCard';
import TransactionModal from './components/TransactionModal';
import * as api from './services/api';
import './App.css';

/* ── SVG Icons ─────────────────────────────────────────── */
const Icon = {
  wallet: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  total: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  accounts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  trend: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  bank: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
};

export default function App() {
  const [accounts, setAccounts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [modalType, setModalType]         = useState('deposit');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [addOpen, setAddOpen]             = useState(false);
  const [newName, setNewName]             = useState('');
  const [toast, setToast]                 = useState(null);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.getAccounts();
      setAccounts(res.data);
    } catch {
      showToast('Failed to load accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createAccount({ accountOwnerName: newName, balance: 0 });
      setNewName(''); setAddOpen(false);
      fetchAccounts();
      showToast('Account created successfully!');
    } catch { showToast('Failed to create account.', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this account permanently?')) return;
    try {
      await api.deleteAccount(id);
      fetchAccounts();
      showToast('Account deleted.');
    } catch { showToast('Could not delete account.', 'error'); }
  };

  const handleTransaction = async (id, amount) => {
    try {
      if (modalType === 'deposit') await api.deposit(id, amount);
      else                         await api.withdraw(id, amount);
      setModalOpen(false);
      fetchAccounts();
      showToast(`${modalType === 'deposit' ? 'Deposit' : 'Withdrawal'} of $${amount.toFixed(2)} successful!`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Transaction failed.', 'error');
    }
  };

  const openModal = (type, account) => {
    setModalType(type); setSelectedAccount(account); setModalOpen(true);
  };

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <>
      {/* ── Navbar ─── */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <div className="logo-icon">{Icon.wallet}</div>
            <h1>Vortex<span>Bank</span></h1>
          </div>
          <div className="navbar-links">
            <a href="#" className="nav-link active">Dashboard</a>
            <a href="#" className="nav-link">Transactions</a>
            <a href="#" className="nav-link">Cards</a>
            <a href="#" className="nav-link">Settings</a>
          </div>
          <div className="navbar-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
              {Icon.plus} New Account
            </button>
            <div className="avatar">VB</div>
          </div>
        </div>
      </nav>

      {/* ── Main ─── */}
      <main className="dashboard">
        <div className="container">

          {/* Stats */}
          <div className="stats-grid">
            <div className="glass-card stat-card anim-fade-up anim-delay-1">
              <div className="stat-icon icon-indigo">{Icon.total}</div>
              <p className="stat-label">Total Assets</p>
              <div className="stat-value">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="stat-badge">
                <span className="badge badge-success">↑ Active</span>
              </div>
            </div>

            <div className="glass-card stat-card anim-fade-up anim-delay-2">
              <div className="stat-icon icon-teal">{Icon.accounts}</div>
              <p className="stat-label">Total Accounts</p>
              <div className="stat-value">{accounts.length}</div>
              <p className="stat-sub">{accounts.length === 1 ? '1 active account' : `${accounts.length} active accounts`}</p>
            </div>

            <div className="glass-card stat-card anim-fade-up anim-delay-3">
              <div className="stat-icon icon-rose">{Icon.trend}</div>
              <p className="stat-label">Avg. Balance</p>
              <div className="stat-value">
                ${accounts.length ? (totalBalance / accounts.length).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </div>
              <p className="stat-sub">Per account</p>
            </div>
          </div>

          {/* Section header */}
          <div className="section-header anim-fade-up anim-delay-4">
            <div>
              <h2>{Icon.bank}&nbsp; Your Accounts</h2>
              <p>{accounts.length} account{accounts.length !== 1 ? 's' : ''} registered</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>
              {Icon.plus} Open Account
            </button>
          </div>

          {/* Accounts grid */}
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="accounts-grid">
              {accounts.length === 0 ? (
                <div className="glass-card empty-state anim-fade-up">
                  <div className="empty-icon">{Icon.bank}</div>
                  <h3>No Accounts Yet</h3>
                  <p>Open your first account to get started with VortexBank.</p>
                  <button className="btn btn-primary" style={{ marginTop: '1.25rem' }} onClick={() => setAddOpen(true)}>
                    {Icon.plus} Open New Account
                  </button>
                </div>
              ) : (
                accounts.map((acc, i) => (
                  <AccountCard
                    key={acc.id}
                    account={acc}
                    animDelay={Math.min(i + 1, 5)}
                    onDeposit={(a) => openModal('deposit', a)}
                    onWithdraw={(a) => openModal('withdraw', a)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}
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

      {/* ── Transaction Modal ─── */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTransaction}
        type={modalType}
        account={selectedAccount}
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
    </>
  );
}
