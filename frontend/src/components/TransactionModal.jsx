import React, { useState, useEffect } from 'react';

const icons = {
  deposit: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  withdraw: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  dollar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
};

const TransactionModal = ({ isOpen, onClose, onSubmit, type, account }) => {
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) setAmount('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    onSubmit(account.id, parseFloat(amount));
  };

  const isDeposit = type === 'deposit';

  return (
    <div className="overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>{icons.close}</button>

        <div className={`modal-icon ${type}`}>{isDeposit ? icons.deposit : icons.withdraw}</div>

        <h2>{isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}</h2>
        <p className="modal-sub">
          Account: <span>{account?.accountOwnerName}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Amount (Tsh)</label>
            <div className="input-icon-wrap">
              <span className="icon-prefix" style={{ fontSize: '0.75rem', fontWeight: 800 }}>Tsh</span>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                autoFocus
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className={`btn ${isDeposit ? 'btn-teal' : 'btn-purple'}`} style={{ width: '100%', padding: '0.85rem' }}>
              {isDeposit ? icons.deposit : icons.withdraw}
              Confirm {isDeposit ? 'Deposit' : 'Withdrawal'}
            </button>
            <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
