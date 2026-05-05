import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user?.roles?.includes('Admin');

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    axios.get('/api/auth/users')
      .then(res => {
        // Normalize roles property for each user (backend returns 'Roles')
        const normalized = (res.data || []).map(u => ({ ...u, roles: u.roles ?? u.Roles ?? [] }));
        setUsers(normalized);
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/auth/users/${userId}/role`, { role: newRole });
      setSuccess('Role updated successfully');
      setUsers(users.map(u => u.Id === userId ? { ...u, roles: [newRole] } : u));
    } catch {
      setError('Failed to update role');
    }
  };

  if (!isAdmin) return <div className="alert alert-danger">Admins only</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">User Management</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
              <tr key={u.Id}>
              <td>{u.Email}</td>
              <td>{u.FirstName} {u.LastName}</td>
              <td>{(u.roles ?? u.Roles)?.join(', ')}</td>
              <td>
                <select
                  value={(u.roles ?? u.Roles)?.[0] || 'User'}
                  onChange={e => handleRoleChange(u.Id, e.target.value)}
                  className="form-select form-select-sm"
                >
                  <option value="User">User</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
