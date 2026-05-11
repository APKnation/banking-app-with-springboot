import React, { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, Wallet, TrendingUp, Search } from 'lucide-react';
import AccountCard from './components/AccountCard';
import TransactionModal from './components/TransactionModal';
import * as api from './services/api';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('deposit');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await api.createAccount({ accountOwnerName: newOwnerName, balance: 0 });
      setNewOwnerName('');
      setShowAddForm(false);
      fetchAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await api.deleteAccount(id);
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleTransaction = async (id, amount) => {
    try {
      if (modalType === 'deposit') {
        await api.deposit(id, amount);
      } else {
        await api.withdraw(id, amount);
      }
      fetchAccounts();
    } catch (error) {
      alert(error.response?.data?.message || 'Transaction failed');
    }
  };

  const openModal = (type, account) => {
    setModalType(type);
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wallet className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Vortex<span className="text-indigo-400">Bank</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Dashboard</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Transactions</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Cards</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Stats Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-8 lg:col-span-2 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-slate-400 font-medium mb-1">Total Assets</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">${totalBalance.toLocaleString()}</span>
                <span className="text-teal-400 font-medium flex items-center gap-1">
                  <TrendingUp size={16} /> +2.4%
                </span>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
          </div>

          <div className="glass-card p-8 flex flex-col justify-center items-center text-center">
            <p className="text-slate-400 mb-4">Ready to expand?</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary w-full py-4"
            >
              <Plus size={20} />
              Open New Account
            </button>
          </div>
        </div>

        {/* Account Grid */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Your Accounts</h3>
          <div className="flex gap-2">
            <button className="p-2 glass-card rounded-lg"><LayoutDashboard size={20} /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account}
                onDeposit={(acc) => openModal('deposit', acc)}
                onWithdraw={(acc) => openModal('withdraw', acc)}
                onDelete={handleDeleteAccount}
              />
            ))}
            {accounts.length === 0 && !showAddForm && (
              <div className="col-span-full py-20 text-center glass-card">
                <p className="text-slate-400">No accounts found. Start by opening one!</p>
              </div>
            )}
          </div>
        )}

        {/* Add Account Form Overlay */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md p-8 relative">
              <button 
                onClick={() => setShowAddForm(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-6">Open New Account</h2>
              <form onSubmit={handleCreateAccount}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Owner Name</label>
                  <input 
                    type="text" 
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="input-field"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full py-4">Create Account</button>
              </form>
            </div>
          </div>
        )}

        <TransactionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleTransaction}
          type={modalType}
          account={selectedAccount}
        />
      </main>
    </div>
  );
}

// Minimal X icon replacement since I missed importing it
const X = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default App;
