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

// Transactions
export const getTransactions = () => api.get('/transactions');

export default api;
