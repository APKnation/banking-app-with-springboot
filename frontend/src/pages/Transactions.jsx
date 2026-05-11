import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container anim-fade-up">
      <div className="section-header" style={{ marginTop: '2.5rem' }}>
        <div>
          <h2>Transaction History</h2>
          <p>View your recent financial activities across all accounts</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : transactions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="empty-icon" style={{ background: 'rgba(20, 184, 166, 0.12)', color: 'var(--secondary)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h3>No Transactions Yet</h3>
          <p>Your transaction history will appear here once you start depositing or withdrawing funds.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                  <th className="p-4" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                  <th className="p-4" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Account Owner</th>
                  <th className="p-4" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Type</th>
                  <th className="p-4 text-right" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)', transition: '0.2s' }} className="hover-row">
                    <td className="p-4 text-muted" style={{ fontSize: '0.85rem' }}>{formatDate(tx.timestamp)}</td>
                    <td className="p-4" style={{ fontWeight: 500 }}>{tx.accountOwnerName}</td>
                    <td className="p-4">
                      <span className={`badge ${tx.type === 'DEPOSIT' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '0.7rem' }}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold ${tx.type === 'DEPOSIT' ? 'text-success' : 'text-error'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .hover-row:hover { background: rgba(255,255,255,0.02); }
        .text-success { color: #10b981; }
        .text-error { color: #f43f5e; }
        .font-bold { font-weight: 700; }
      `}} />
    </div>
  );
};

export default Transactions;
