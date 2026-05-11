import React from 'react';

const AccountCard = ({ account, onDeposit, onWithdraw, onDelete, animDelay }) => {
  return (
    <div className={`glass-card account-card anim-fade-up anim-delay-${animDelay || 1}`}>
      {/* Header */}
      <div className="account-card-header">
        <div className="account-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>
        <span className="account-id">#{String(account.id).padStart(6, '0')}</span>
      </div>

      {/* Owner */}
      <p className="account-owner">Account Holder</p>
      <h3 className="account-name">{account.accountOwnerName}</h3>

      {/* Balance */}
      <p className="account-balance-label">Available Balance</p>
      <div className="account-balance">
        Tsh {account.balance.toLocaleString()}
        <span className="currency">TZS</span>
      </div>

      <div className="account-divider" />

      {/* Actions */}
      <div className="account-actions">
        <button className="btn btn-teal btn-sm" onClick={() => onDeposit(account)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Deposit
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => onWithdraw(account)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Withdraw
        </button>
      </div>

      <button
        className="btn btn-danger btn-sm"
        onClick={() => onDelete(account.id)}
        style={{ marginTop: '0.5rem', width: '100%' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>
        Delete Account
      </button>
    </div>
  );
};

export default AccountCard;
