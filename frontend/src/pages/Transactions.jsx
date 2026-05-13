import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    accountId: ''
  });

  const Icon = {
    deposit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>,
    withdraw: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>,
    empty: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    filter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    print: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>,
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      
      // Convert dates to ISO if present
      if (activeFilters.startDate) activeFilters.startDate = new Date(activeFilters.startDate).toISOString();
      if (activeFilters.endDate) activeFilters.endDate = new Date(activeFilters.endDate).toISOString();

      const res = await api.getTransactions(activeFilters);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions();
    }, 500); // Debounce
    return () => clearTimeout(timer);
  }, [filters]);

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

  const handleDownloadStatement = async (accountId) => {
    if (!accountId) {
      alert("Please enter an Account ID to generate a mini statement.");
      return;
    }
    try {
      const res = await api.getMiniStatement(accountId);
      const statementData = res.data;
      if (statementData.length === 0) {
          alert("No transactions found for this account.");
          return;
      }
      
      // Create a clean print view
      const printWindow = window.open('', '_blank');
      const html = `
        <html>
          <head>
            <title>Mini Statement - Account #${accountId}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              h1 { color: #6366f1; border-bottom: 2px solid #eee; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
              th { background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; }
              .amount { font-weight: bold; text-align: right; }
              .deposit { color: #10b981; }
              .withdraw { color: #f43f5e; }
              .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; text-align: center; }
            </style>
          </head>
          <body>
            <h1>WekezaBank Mini Statement</h1>
            <p><strong>Account Number:</strong> #${accountId}</p>
            <p><strong>Date Generated:</strong> ${new Date().toLocaleString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th style="text-align: right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${statementData.map(tx => \`
                  <tr>
                    <td>\${new Date(tx.timestamp).toLocaleDateString()}</td>
                    <td>\${tx.type}</td>
                    <td>\${tx.type === 'TRANSFER_OUT' ? 'Transfer to #' + tx.targetAccountId : tx.type}</td>
                    <td class="amount \${tx.type.includes('DEPOSIT') || tx.type.includes('IN') ? 'deposit' : 'withdraw'}">
                      \${tx.type.includes('DEPOSIT') || tx.type.includes('IN') ? '+' : '-'}Tsh \${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
            <div class="footer">Thank you for banking with WekezaBank. This is a computer-generated statement.</div>
            <script>window.print();</script>
          </body>
        </html>
      \`;
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (err) {
      alert("Failed to generate mini statement.");
    }
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
      <div className="section-header" style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Transaction Ledger</h2>
          <p style={{ color: 'var(--text-muted)' }}>Financial oversight and dynamic reporting</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleDownloadStatement(filters.accountId || prompt("Enter Account ID:"))}>
          {Icon.print} Mini Statement
        </button>
      </div>

      {/* ── Filter Bar ─── */}
      <div className="glass-card p-6" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="label">Type</label>
          <select className="input" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}>
            <option value="">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
            <option value="TRANSFER_OUT">Transfer Out</option>
            <option value="TRANSFER_IN">Transfer In</option>
            <option value="LOAN_DISBURSEMENT">Loan Disbursement</option>
            <option value="LOAN_REPAYMENT">Loan Repayment</option>
          </select>
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="label">Min Amount</label>
          <input type="number" className="input" placeholder="0" value={filters.minAmount} onChange={(e) => setFilters({...filters, minAmount: e.target.value})} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="label">Start Date</label>
          <input type="date" className="input" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="label">End Date</label>
          <input type="date" className="input" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="label">Account ID</label>
          <input type="text" className="input" placeholder="Search ID..." value={filters.accountId} onChange={(e) => setFilters({...filters, accountId: e.target.value})} />
        </div>
        <button className="btn btn-ghost" onClick={() => setFilters({type:'', minAmount:'', maxAmount:'', startDate:'', endDate:'', accountId:''})} style={{ height: '42px' }}>
          Clear
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : transactions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="empty-icon" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            {Icon.empty}
          </div>
          <h3>No Matching Records</h3>
          <p>No transactions found for the selected filters.</p>
        </div>
      ) : (
        <div className="transaction-container glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="text-left">Date & Time</th>
                <th className="text-left">Details</th>
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
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Acc: #{tx.accountId}</span>
                    {tx.targetAccountId && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Recipient: #{tx.targetAccountId}</span>}
                  </td>
                  <td>
                    <span className={`type-tag \${tx.type.toLowerCase().replace('_', '-')}`}>
                      {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' || tx.type === 'LOAN_DISBURSEMENT') ? Icon.deposit : Icon.withdraw}
                      {tx.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`amount-cell text-right \${(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' || tx.type === 'LOAN_DISBURSEMENT') ? 'deposit-text' : 'withdraw-text'}`}>
                    {(tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' || tx.type === 'LOAN_DISBURSEMENT') ? '+' : '-'}Tsh {tx.amount.toLocaleString()}
                  </td>
                  <td className="text-center">
                    <span className={`status-pill \${tx.status?.toLowerCase() || 'completed'}`}>
                      {tx.status || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="text-right">
                    {tx.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-teal btn-sm" onClick={() => handleApprove(tx.id)} title="Approve">
                          {Icon.check}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(tx.id)} title="Reject">
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

      <style dangerouslySetInnerHTML={{__html: \`
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
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .type-tag.deposit, .type-tag.transfer-in, .type-tag.loan-disbursement {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .type-tag.withdraw, .type-tag.transfer-out, .type-tag.loan-repayment {
          background: rgba(168, 85, 247, 0.1);
          color: #a855f7;
        }
        
        .amount-cell {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .deposit-text { color: #10b981; }
        .withdraw-text { color: #f43f5e; }

        .status-pill {
          font-size: 0.6rem;
          padding: 0.25rem 0.6rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 99px;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .status-pill.completed { color: #34d399; background: rgba(52, 211, 153, 0.05); border-color: rgba(52, 211, 153, 0.2); }
        .status-pill.pending   { color: #fbbf24; background: rgba(251, 191, 36, 0.05); border-color: rgba(251, 191, 36, 0.2); }
        .status-pill.rejected  { color: #f87171; background: rgba(248, 113, 113, 0.05); border-color: rgba(248, 113, 113, 0.2); }

        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .text-center { text-align: center; }

        @media (max-width: 768px) {
          .glass-card.p-6 { grid-template-columns: 1fr 1fr; }
        }
      \`}} />
    </div>
  );
};

export default Transactions;
