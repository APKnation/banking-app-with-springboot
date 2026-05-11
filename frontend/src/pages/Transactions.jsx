import React from 'react';

const Transactions = () => (
  <div className="container anim-fade-up">
    <div className="section-header" style={{ marginTop: '2.5rem' }}>
      <div>
        <h2>Transaction History</h2>
        <p>View your recent financial activities</p>
      </div>
    </div>
    <div className="glass-card p-12 text-center">
      <div className="empty-icon" style={{ background: 'rgba(20, 184, 166, 0.12)', color: 'var(--secondary)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <h3>No Transactions Yet</h3>
      <p>Your transaction history will appear here once you start using your accounts.</p>
    </div>
  </div>
);

export default Transactions;
