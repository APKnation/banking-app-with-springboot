import React, { useState, useEffect } from 'react';
import AccountCard from '../components/AccountCard';
import TransactionModal from '../components/TransactionModal';
import * as api from '../services/api';

const Dashboard = ({ showToast, refreshTrigger, onOpenAddAccount }) => {
  const [accounts, setAccounts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [modalOpen, setModalOpen]         = useState(false);
  const [modalType, setModalType]         = useState('deposit');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const Icon = {
    plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    total: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    accounts: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    trend: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    bank: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  };

  useEffect(() => { fetchAccounts(); }, [refreshTrigger]);

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
    <div className="anim-fade-up">
      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card anim-fade-up anim-delay-1">
          <div className="stat-icon icon-indigo">{Icon.total}</div>
          <p className="stat-label">Total Assets</p>
          <div className="stat-value">
            Tsh {totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
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
            Tsh {accounts.length ? (totalBalance / accounts.length).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
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
              <p>Open your first account from the sidebar to get started with WEKEZA Bank.</p>
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

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleTransaction}
        type={modalType}
        account={selectedAccount}
      />
    </div>
  );
};

export default Dashboard;
