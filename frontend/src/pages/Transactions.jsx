import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const Icon = {
    deposit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    withdraw: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
    empty: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.getTransactions();
      // Sort by latest first
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setTransactions(sorted);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.approveTransfer(id);
      fetchTransactions();
    } catch (err) { alert(err.response?.data?.message || "Approval failed"); }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectTransfer(id);
      fetchTransactions();
    } catch (err) { alert(err.response?.data?.message || "Rejection failed"); }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container anim-fade-up">
      <div className="section-header" style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Transaction Ledger</h2>
          <p style={{ color: 'var(--text-muted)' }}>Financial oversight and transfer approvals</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : transactions.length === 0 ? (
        <div className="glass-card p-12 text-center" style={{ borderRadius: '0' }}>
          <div className="empty-icon" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            {Icon.empty}
          </div>
          <h3>No Transactions Record</h3>
          <p>Your transaction ledger is currently empty.</p>
        </div>
      ) : (
        <div className="transaction-container glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="text-left">Date & Time</th>
                <th className="text-left">Account Owner</th>
                <th className="text-left">Type</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="date-cell">{formatDate(tx.timestamp)}</td>
                  <td className="owner-cell">
                    {tx.accountOwnerName}
                    {tx.targetAccountId && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>To Acc: #{tx.targetAccountId}</span>}
                  </td>
                  <td>
                    <span className={`type-tag ${tx.type.toLowerCase().replace('_', '-')}`}>
                      {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? Icon.deposit : Icon.withdraw}
                      {tx.type}
                    </span>
                  </td>
                  <td className={`amount-cell text-right ${(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? 'deposit-text' : 'withdraw-text'}`}>
                    {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN') ? '+' : '-'}Tsh {tx.amount.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <span className={`status-pill ${tx.status?.toLowerCase() || 'completed'}`}>
                      {tx.status || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="text-right">
                    {tx.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-teal btn-sm" onClick={() => handleApprove(tx.id)} style={{ padding: '0.3rem 0.6rem' }}>
                          {Icon.check}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(tx.id)} style={{ padding: '0.3rem 0.6rem' }}>
                          {Icon.x}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .transaction-container {
          background: var(--bg-card);
          border: 1px solid var(--border);
          overflow-x: auto;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .transaction-table th {
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .transaction-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }

        .transaction-table tr:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }

        .date-cell {
          color: var(--text-muted);
          white-space: nowrap;
          font-size: 0.8rem;
        }

        .owner-cell {
          font-weight: 600;
          color: var(--text);
        }

        .type-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 4px;
        }

        .type-tag.deposit, .type-tag.transfer-in {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .type-tag.withdraw, .type-tag.transfer-out {
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
        }
        
        .type-tag.loan-disbursement { background: rgba(20, 184, 166, 0.1); color: #14b8a6; }
        .type-tag.loan-repayment { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

        .amount-cell {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .deposit-text { color: #10b981; }
        .withdraw-text { color: #a855f7; }

        .status-pill {
          font-size: 0.65rem;
          padding: 0.25rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 99px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .status-pill.completed { color: #34d399; background: rgba(52, 211, 153, 0.05); border-color: rgba(52, 211, 153, 0.2); }
        .status-pill.pending   { color: #fbbf24; background: rgba(251, 191, 36, 0.05); border-color: rgba(251, 191, 36, 0.2); }
        .status-pill.rejected  { color: #f87171; background: rgba(248, 113, 113, 0.05); border-color: rgba(248, 113, 113, 0.2); }

        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }
      `}} />
    </div>
  );
};

export default Transactions;
