import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/register', form);
      alert('Registration Successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input type="text" placeholder="Name" className="w-full p-2 border mb-3 rounded"
          onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" className="w-full p-2 border mb-3 rounded"
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" className="w-full p-2 border mb-4 rounded"
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Register</button>
        <p className="mt-4 text-sm text-center">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
      </form>
    </div>
  );
}