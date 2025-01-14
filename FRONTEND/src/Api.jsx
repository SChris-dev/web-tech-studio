import axios from 'axios';

const Api = axios.create({
  // withCredentials: true,
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('login_token')}`,
    'Content-Type': 'application/json',
  },
});

export default Api;