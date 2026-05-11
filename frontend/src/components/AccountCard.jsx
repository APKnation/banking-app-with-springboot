import React from 'react';
import { CreditCard, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const AccountCard = ({ account, onDeposit, onWithdraw, onDelete }) => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-indigo-500/10 rounded-xl">
          <CreditCard className="text-indigo-400" size={24} />
        </div>
        <button 
          onClick={() => onDelete(account.id)}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
      
      <div className="mb-4">
        <p className="text-slate-400 text-sm font-medium mb-1">Account Holder</p>
        <h3 className="text-xl font-bold text-white">{account.accountOwnerName}</h3>
      </div>

      <div className="mb-6">
        <p className="text-slate-400 text-sm font-medium mb-1">Available Balance</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">${account.balance.toLocaleString()}</span>
          <span className="text-slate-500 text-sm">USD</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onDeposit(account)}
          className="btn btn-outline flex-1"
        >
          <ArrowDownLeft size={18} className="text-teal-400" />
          Deposit
        </button>
        <button 
          onClick={() => onWithdraw(account)}
          className="btn btn-outline flex-1"
        >
          <ArrowUpRight size={18} className="text-indigo-400" />
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
