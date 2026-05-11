import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionModal = ({ isOpen, onClose, onSubmit, type, account }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(account.id, parseFloat(amount));
    setAmount('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-md p-8 relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-2">
            {type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}
          </h2>
          <p className="text-slate-400 mb-6">
            Account: <span className="text-white font-medium">{account?.accountOwnerName}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field pl-10"
                  placeholder="0.00"
                  required
                  step="0.01"
                  min="0.01"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-lg">
              Confirm {type === 'deposit' ? 'Deposit' : 'Withdrawal'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransactionModal;
