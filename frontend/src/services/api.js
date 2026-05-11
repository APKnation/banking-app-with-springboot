import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/account';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getAccounts = () => api.get('/');
export const getAccount = (id) => api.get(`/${id}`);
export const createAccount = (account) => api.post('/', account);
export const updateAccount = (id, account) => api.put(`/${id}`, account);
export const deleteAccount = (id) => api.delete(`/${id}`);
export const deposit = (id, amount) => api.put(`/${id}/deposit`, { amount });
export const withdraw = (id, amount) => api.put(`/${id}/withdraw`, { amount });

export default api;
