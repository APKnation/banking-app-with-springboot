import axios from 'axios';

// Base URL matches Spring Boot controller: @RequestMapping("/api/account")
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
export const getTransactions = (params) => api.get('/transactions', { params });
export const getMiniStatement = (accountId) => api.get(`/transactions/account/${accountId}/mini-statement`);

// Loans
export const getLoans = () => api.get('/loans');
export const getAccountLoans = (accountId) => api.get(`/loans/account/${accountId}`);
export const applyLoan = (loanData) => api.post('/loans/apply', loanData);
export const approveLoan = (id) => api.put(`/loans/${id}/approve`);
export const rejectLoan = (id) => api.put(`/loans/${id}/reject`);
export const repayLoan = (id, amount) => api.put(`/loans/${id}/repay`, { amount });

export const approveTransfer = (id) => api.put(`/account/transactions/${id}/approve`);
export const rejectTransfer = (id) => api.put(`/account/transactions/${id}/reject`);

// Customers
export const getCustomers = () => api.get('/customers');
export const searchCustomers = (query) => api.get('/customers/search', { params: { query } });
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (customer) => api.post('/customers', customer);
export const updateCustomer = (id, customer) => api.put(`/customers/${id}`, customer);
export const deactivateCustomer = (id) => api.delete(`/customers/${id}`);
export const activateCustomer = (id) => api.put(`/customers/${id}/activate`);

export default api;
