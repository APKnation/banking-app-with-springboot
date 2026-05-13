import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const Icon = {
    back: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    edit: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    wallet: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const custRes = await api.getCustomerById(id);
      setCustomer(custRes.data);
      setEditData(custRes.data);
      
      // Fetch all accounts and filter by owner ID
      const accRes = await api.getAccounts();
      setAccounts(accRes.data.filter(acc => acc.owner?.id === parseInt(id)));
    } catch (err) {
      console.error("Failed to fetch profile", err);
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.updateCustomer(id, editData);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      alert("Update failed");
    }
  };

  const toggleStatus = async () => {
    try {
      if (customer.isActive) {
        await api.deactivateCustomer(id);
      } else {
        await api.activateCustomer(id);
      }
      fetchData();
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) return <div className="container"><div className="spinner" /></div>;

  return (
    <div className="container anim-fade-up">
      <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/customers')} style={{ marginBottom: '1rem' }}>
          {Icon.back} Back to Registry
        </button>
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="profile-avatar">
              {customer.fullName?.charAt(0) || customer.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', letterSpacing: '-0.04em' }}>{customer.fullName}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Customer ID: #{customer.id} • Registered as {customer.username}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className={`btn \${customer.isActive ? 'btn-danger' : 'btn-teal'}`} onClick={toggleStatus}>
              {customer.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button className="btn btn-primary" onClick={() => setIsEditing(!isEditing)}>
              {Icon.edit} {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* ── KYC Information ─── */}
        <div className="glass-card p-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--primary-light)' }}>
            {Icon.shield} <h3 style={{ margin: 0, fontSize: '1.25rem' }}>KYC Verification Data</h3>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-group">
                <label className="label">Full Legal Name</label>
                <input type="text" className="input" value={editData.fullName} onChange={e => setEditData({...editData, fullName: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">National Identification Number</label>
                <input type="text" className="input" value={editData.nationalId} onChange={e => setEditData({...editData, nationalId: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Email Address</label>
                <input type="email" className="input" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Phone Number</label>
                <input type="text" className="input" value={editData.phoneNumber} onChange={e => setEditData({...editData, phoneNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="label">Residential Address</label>
                <textarea className="input" rows="3" value={editData.address} onChange={e => setEditData({...editData, address: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Changes</button>
            </form>
          ) : (
            <div className="info-display">
              <div className="info-item">
                <label>National ID</label>
                <p>{customer.nationalId || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <p>{customer.email}</p>
              </div>
              <div className="info-item">
                <label>Phone Number</label>
                <p>{customer.phoneNumber || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Residential Address</label>
                <p>{customer.address || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Account Status</label>
                <p><span className={`status-pill \${customer.isActive ? 'completed' : 'rejected'}`}>\${customer.isActive ? 'Active' : 'Deactivated'}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* ── Linked Accounts ─── */}
        <div className="glass-card p-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--primary-light)' }}>
            {Icon.wallet} <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Financial Accounts</h3>
          </div>
          
          {accounts.length === 0 ? (
            <div className="empty-state">
              <p>No active accounts found for this customer.</p>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: '1rem' }}>Open New Account</button>
            </div>
          ) : (
            <div className="accounts-list">
              {accounts.map(acc => (
                <div key={acc.id} className="account-item">
                  <div>
                    <h4>{acc.accountType} Account</h4>
                    <code>{acc.accountNumber}</code>
                  </div>
                  <div className="balance">
                    Tsh {acc.balance.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .info-display {
          display: grid;
          gap: 1.5rem;
        }

        .info-item label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .info-item p {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text);
        }

        .accounts-list {
          display: grid;
          gap: 1rem;
        }

        .account-item {
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .account-item h4 {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text);
        }

        .account-item code {
          font-size: 0.75rem;
          color: var(--primary-light);
          opacity: 0.8;
        }

        .account-item .balance {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          color: var(--text);
        }

        @media (max-width: 992px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
};

export default CustomerProfile;
