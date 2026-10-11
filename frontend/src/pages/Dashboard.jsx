import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Define and call the async fetch function inside the effect
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await API.put(`/users/${editUserId}`, formData);
        alert('User updated successfully');
      } else {
        await API.post('/users/register', formData);
        alert('User added successfully');
      }
      setIsModalOpen(false);
      setEditUserId(null);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setFormData({ name: user.name, email: user.email, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await API.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => { setEditUserId(null); setFormData({ name: '', email: '', password: '' }); setIsModalOpen(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Add User</button>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSaveUser} className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">{editUserId ? 'Edit User' : 'Add User'}</h2>
            <input type="text" placeholder="Name" value={formData.name} className="w-full p-2 border mb-3 rounded"
              onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <input type="email" placeholder="Email" value={formData.email} className="w-full p-2 border mb-3 rounded"
              onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            {!editUserId && (
              <input type="password" placeholder="Password" value={formData.password} className="w-full p-2 border mb-3 rounded"
                onChange={e => setFormData({ ...formData, password: e.target.value })} required />
            )}
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}