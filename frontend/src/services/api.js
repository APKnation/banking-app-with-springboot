import axios from 'axios';

// Base URL matches Spring Boot controller: @RequestMapping("/api/account")
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

// Accounts
export const getAccounts = () => api.get('/account');
export const getAccount = (id) => api.get(`/account/${id}`);
export const createAccount = (account) => api.post('/account', account);
export const updateAccount = (id, account) => api.put(`/account/${id}`, account);
export const deleteAccount = (id) => api.delete(`/account/${id}`);
export const deposit = (id, amount) => api.put(`/account/${id}/deposit`, { amount });
export const withdraw = (id, amount) => api.put(`/account/${id}/withdraw`, { amount });
export const transfer = (fromId, toId, amount) => api.put(`/account/${fromId}/transfer`, { toAccountId: toId, amount });

// Transactions
export const getTransactions = () => api.get('/transactions');

// Loans
export const getLoans = () => api.get('/loans');
export const getAccountLoans = (accountId) => api.get(`/loans/account/${accountId}`);
export const applyLoan = (loanData) => api.post('/loans/apply', loanData);
export const approveLoan = (id) => api.put(`/loans/${id}/approve`);
export const rejectLoan = (id) => api.put(`/loans/${id}/reject`);
export const repayLoan = (id, amount) => api.put(`/loans/${id}/repay`, { amount });

export const approveTransfer = (id) => api.put(`/account/transactions/${id}/approve`);
export const rejectTransfer = (id) => api.put(`/account/transactions/${id}/reject`);

export default api;
