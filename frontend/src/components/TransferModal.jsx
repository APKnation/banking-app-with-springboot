import React, { useState, useEffect } from 'react';

const icons = {
  transfer: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 11 21 7 17 3"></polyline>
      <path d="M21 7H9a5 5 0 0 0-5 5v3"></path>
      <polyline points="7 13 3 17 7 21"></polyline>
      <path d="M3 17h12a5 5 0 0 0 5-5V9"></path>
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  bank: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>
    </svg>
  )
};

const TransferModal = ({ isOpen, onClose, onSubmit, sourceAccount }) => {
  const [manualSourceId, setManualSourceId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setManualSourceId('');
      setToAccountId('');
      setAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const fromId = sourceAccount ? sourceAccount.id : parseInt(manualSourceId);
    if (!fromId || !toAccountId || !amount || parseFloat(amount) <= 0) return;
    onSubmit(fromId, parseInt(toAccountId), parseFloat(amount));
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>{icons.close}</button>

        <div className="modal-icon" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary-light)' }}>
          {icons.transfer}
        </div>

        <h2>Internal Fund Transfer</h2>
        <p className="modal-sub">
          {sourceAccount ? (
            <>Transfer money from <span>{sourceAccount.accountOwnerName}</span></>
          ) : (
            <>Transfer funds between accounts</>
          )}
        </p>

        <form onSubmit={handleSubmit}>
          {!sourceAccount && (
            <div className="form-group">
              <label className="label">Source Account ID</label>
              <div className="input-icon-wrap">
                <span className="icon-prefix">{icons.bank}</span>
                <input
                  type="number"
                  className="input"
                  placeholder="From Account ID"
                  value={manualSourceId}
                  onChange={(e) => setManualSourceId(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="label">Destination Account ID</label>
            <div className="input-icon-wrap">
              <span className="icon-prefix">{icons.bank}</span>
              <input
                type="number"
                className="input"
                placeholder="Enter Account ID"
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                required
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              {icons.transfer}
              Execute Transfer
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

export default TransferModal;
