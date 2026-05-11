import axios from 'axios';

// Base URL matches Spring Boot controller: @RequestMapping("/api/account")
const api = axios.create({
  baseURL: 'http://localhost:8081/api/account',
  headers: { 'Content-Type': 'application/json' },
});

// GET  /api/account        → list all accounts
export const getAccounts = () => api.get('');

// GET  /api/account/{id}   → get single account
export const getAccount = (id) => api.get(`/${id}`);

// POST /api/account        → create account  (@PostMapping with no path)
export const createAccount = (account) => api.post('', account);

// PUT  /api/account/{id}   → update account
export const updateAccount = (id, account) => api.put(`/${id}`, account);

// DELETE /api/account/{id} → delete account
export const deleteAccount = (id) => api.delete(`/${id}`);

// PUT  /api/account/{id}/deposit   → deposit  (@PutMapping("/{id}/deposit"))
export const deposit = (id, amount) => api.put(`/${id}/deposit`, { amount });

// PUT  /api/account/{id}/withdraw  → withdraw (@PutMapping("/{id}/withdraw"))
export const withdraw = (id, amount) => api.put(`/${id}/withdraw`, { amount });

export default api;
