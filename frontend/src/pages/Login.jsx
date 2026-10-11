import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', form);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login Successful!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input type="email" placeholder="Email" className="w-full p-2 border mb-3 rounded"
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" className="w-full p-2 border mb-4 rounded"
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        <p className="mt-4 text-sm text-center">Don't have an account? <Link to="/register" className="text-blue-500">Register</Link></p>
      </form>
    </div>
  );
}