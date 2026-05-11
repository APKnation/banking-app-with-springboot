import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const Icon = {
    deposit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    withdraw: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
    empty: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.getTransactions();
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

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
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Transaction History</h2>
          <p style={{ color: 'var(--text-muted)' }}>Real-time overview of all financial movements</p>
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
        <div className="transaction-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>TRANSACTION DATE</th>
                <th>ACCOUNT OWNER</th>
                <th>TYPE</th>
                <th className="text-right">AMOUNT</th>
                <th className="text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="date-cell">{formatDate(tx.timestamp)}</td>
                  <td className="owner-cell">{tx.accountOwnerName}</td>
                  <td>
                    <span className={`type-tag ${tx.type.toLowerCase()}`}>
                      {tx.type === 'DEPOSIT' ? Icon.deposit : Icon.withdraw}
                      {tx.type}
                    </span>
                  </td>
                  <td className={`amount-cell text-right ${tx.type === 'DEPOSIT' ? 'deposit-text' : 'withdraw-text'}`}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </td>
                  <td className="text-right">
                    <span className="status-pill">Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .transaction-container {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          overflow-x: auto;
        }

        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .transaction-table th {
          text-align: left;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .transaction-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }

        .transaction-table tr:last-child td {
          border-bottom: none;
        }

        .transaction-table tr:hover {
          background: rgba(255, 255, 255, 0.015);
        }

        .date-cell {
          color: var(--text-muted);
          white-space: nowrap;
        }

        .owner-cell {
          font-weight: 600;
          color: var(--text);
        }

        .type-tag {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .type-tag.deposit {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .type-tag.withdraw {
          background: rgba(244, 63, 94, 0.1);
          color: #f43f5e;
        }

        .amount-cell {
          font-family: 'JetBrains Mono', 'Roboto Mono', monospace;
          font-weight: 700;
          font-size: 1rem;
        }

        .deposit-text { color: #10b981; }
        .withdraw-text { color: #f43f5e; }

        .status-pill {
          font-size: 0.7rem;
          color: #34d399;
          padding: 0.25rem 0.5rem;
          background: rgba(52, 211, 153, 0.05);
          border: 1px solid rgba(52, 211, 153, 0.2);
        }

        .text-right { text-align: right; }
      `}} />
    </div>
  );
};

export default Transactions;
