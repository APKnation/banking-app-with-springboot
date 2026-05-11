import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const icons = {
  loan: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

const Loans = ({ showToast }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Apply form state
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [rate] = useState(0.12); // Fixed 12% annual interest for now

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await api.getLoans();
      setLoans(res.data);
    } catch {
      showToast('Failed to load loans.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.applyLoan({
        accountId: parseInt(accountId),
        principalAmount: parseFloat(amount),
        durationMonths: parseInt(duration),
        interestRate: rate
      });
      setIsApplyModalOpen(false);
      fetchLoans();
      showToast('Loan application submitted!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Application failed.', 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveLoan(id);
      fetchLoans();
      showToast('Loan approved and disbursed!');
    } catch { showToast('Approval failed.', 'error'); }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectLoan(id);
      fetchLoans();
      showToast('Loan application rejected.');
    } catch { showToast('Action failed.', 'error'); }
  };

  const handleRepay = async (id, amount) => {
    try {
      await api.repayLoan(id, amount);
      fetchLoans();
      showToast('Repayment successful!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Repayment failed.', 'error');
    }
  };

  return (
    <div className="anim-fade-up">
      <div className="section-header">
        <div>
          <h2>{icons.loan}&nbsp; Loan Management</h2>
          <p>Track your active loans and repayments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsApplyModalOpen(true)}>
          {icons.plus} Apply for Loan
        </button>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Owner</th>
                <th className="text-left">Principal</th>
                <th className="text-left">Total Due</th>
                <th className="text-left">Remaining</th>
                <th className="text-left">Monthly</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center" style={{ padding: '4rem', color: 'var(--text-muted)' }}>
                    No loans found.
                  </td>
                </tr>
              ) : (
                loans.map(loan => (
                  <tr key={loan.id}>
                    <td><span className="account-id">#{loan.id}</span></td>
                    <td className="font-semibold">{loan.accountOwnerName}</td>
                    <td className="font-semibold">Tsh {loan.principalAmount.toLocaleString()}</td>
                    <td>Tsh {loan.totalRepayable.toLocaleString()}</td>
                    <td className="font-bold" style={{ color: 'var(--primary-light)' }}>
                      Tsh {loan.remainingBalance.toLocaleString()}
                    </td>
                    <td>Tsh {loan.monthlyInstallment.toLocaleString()}</td>
                    <td className="text-center">
                      <span className={`status-pill ${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        {loan.status === 'PENDING' && (
                          <>
                            <button className="btn btn-teal btn-sm" onClick={() => handleApprove(loan.id)}>Approve</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(loan.id)}>Reject</button>
                          </>
                        )}
                        {loan.status === 'APPROVED' && (
                          <button className="btn btn-purple btn-sm" onClick={() => {
                            const amt = window.prompt("Enter repayment amount (Tsh):", loan.monthlyInstallment.toFixed(0));
                            if (amt) handleRepay(loan.id, parseFloat(amt));
                          }}>Repay</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Loan Modal */}
      {isApplyModalOpen && (
        <div className="overlay">
          <div className="modal">
            <button className="modal-close" onClick={() => setIsApplyModalOpen(false)}>{icons.x}</button>
            <div className="modal-icon deposit">{icons.loan}</div>
            <h2>Apply for Loan</h2>
            <p className="modal-sub">Fixed interest rate: 12% annually</p>
            
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="label">Your Account ID</label>
                <input 
                  type="number" 
                  className="input" 
                  value={accountId} 
                  onChange={e => setAccountId(e.target.value)} 
                  required 
                  placeholder="e.g. 1"
                />
              </div>
              <div className="form-group">
                <label className="label">Loan Amount (Tsh)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  required 
                  placeholder="Enter amount"
                />
              </div>
              <div className="form-group">
                <label className="label">Duration (Months)</label>
                <select 
                  className="input" 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)}
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>
              
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .status-pill {
          padding: 0.25rem 0.6rem;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-pill.pending { background: rgba(99, 102, 241, 0.1); color: var(--primary-light); }
        .status-pill.approved { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .status-pill.rejected { background: rgba(244, 63, 94, 0.1); color: var(--danger); }
        .status-pill.closed { background: rgba(255, 255, 255, 0.05); color: var(--text-muted); }
      `}} />
    </div>
  );
};

export default Loans;
