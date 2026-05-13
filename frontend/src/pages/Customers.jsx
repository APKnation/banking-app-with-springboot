import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    email: '',
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    address: '',
    password: ''
  });

  const Icon = {
    search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    plus: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    user: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    more: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = searchQuery 
        ? await api.searchCustomers(searchQuery) 
        : await api.getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(newCustomer);
      setIsModalOpen(false);
      setNewCustomer({ username: '', email: '', fullName: '', nationalId: '', phoneNumber: '', address: '', password: '' });
      fetchCustomers();
    } catch (err) {
      alert("Failed to create customer: " + (err.response?.data?.message || "Internal error"));
    }
  };

  return (
    <div className="container anim-fade-up">
      <div className="section-header" style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>Customer Registry</h2>
          <p style={{ color: 'var(--text-muted)' }}>Management and KYC oversight</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          {Icon.plus} Add Customer
        </button>
      </div>

      <div className="glass-card p-4" style={{ marginBottom: '2rem' }}>
        <div className="search-bar">
          <span className="search-icon">{Icon.search}</span>
          <input 
            type="text" 
            placeholder="Search by name, ID, phone or email..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="customer-grid">
          {customers.map(customer => (
            <div key={customer.id} className="glass-card customer-card anim-scale-in">
              <div className="card-header">
                <div className="avatar">
                  {customer.fullName?.charAt(0) || customer.username.charAt(0).toUpperCase()}
                </div>
                <div className="status-badge" style={{ backgroundColor: customer.isActive ? '#10b981' : '#f43f5e' }} />
              </div>
              <div className="card-body">
                <h3>{customer.fullName || customer.username}</h3>
                <p className="email">{customer.email}</p>
                <div className="kyc-mini">
                  <span>ID: {customer.nationalId || 'N/A'}</span>
                  <span>Ph: {customer.phoneNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="card-footer">
                <a href={`/customers/${customer.id}`} className="btn btn-ghost btn-sm" style={{ width: '100%' }}>View Profile</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Customer Modal ─── */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card anim-scale-in" style={{ maxWidth: '600px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Customer</h2>
            <form onSubmit={handleCreate} className="customer-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input type="text" className="input" required value={newCustomer.fullName} onChange={e => setNewCustomer({...newCustomer, fullName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Username</label>
                  <input type="text" className="input" required value={newCustomer.username} onChange={e => setNewCustomer({...newCustomer, username: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input type="email" className="input" required value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Phone Number</label>
                  <input type="text" className="input" value={newCustomer.phoneNumber} onChange={e => setNewCustomer({...newCustomer, phoneNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">National ID</label>
                  <input type="text" className="input" value={newCustomer.nationalId} onChange={e => setNewCustomer({...newCustomer, nationalId: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Password</label>
                  <input type="password" placeholder="Default: Welcome@123" className="input" value={newCustomer.password} onChange={e => setNewCustomer({...newCustomer, password: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Address</label>
                <textarea className="input" rows="2" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
              </div>
              <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .customer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .customer-card {
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }

        .customer-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-light);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .customer-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .status-badge {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--bg-card);
        }

        .customer-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: var(--text);
        }

        .customer-card .email {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .kyc-mini {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          margin-bottom: 1.5rem;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem 1.25rem;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .search-input {
          background: transparent;
          border: none;
          color: var(--text);
          width: 100%;
          font-size: 0.95rem;
          outline: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          width: 100%;
          padding: 2.5rem;
          border: 1px solid var(--border);
        }
      `}} />
    </div>
  );
};

export default Customers;
