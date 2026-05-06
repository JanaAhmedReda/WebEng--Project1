import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import axios from 'axios';

export default function RoleRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(null); // Track which request is being processed

  const isAdminOrEmployee = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/auth/role-requests');
      console.log('Role requests response:', res.data);
      setRequests(res.data || []);
    } catch (err) {
      console.error('Error loading requests:', err);
      setError('Failed to load role requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminOrEmployee) return;
    loadRequests();
  }, [isAdminOrEmployee]);

  const handleApprove = async (userId, requestedRole) => {
    setProcessing(userId);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/auth/role-requests/${userId}/approve`);
      setSuccess(`Approved: User promoted to ${requestedRole}`);
      await loadRequests();
    } catch (err) {
      console.error('Error approving request:', err);
      setError('Failed to approve request');
    } finally {
      setProcessing(null);
    }
  };

  const handleDeny = async (userId, requestedRole) => {
    setProcessing(userId);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/auth/role-requests/${userId}/deny`);
      setSuccess(`Denied: ${requestedRole} request removed`);
      await loadRequests();
    } catch (err) {
      console.error('Error denying request:', err);
      setError('Failed to deny request');
    } finally {
      setProcessing(null);
    }
  };

  if (!isAdminOrEmployee) return <div className="alert alert-danger">Admins or Employees only</div>;
  
  if (loading) {
    return (
      <div className="container py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading role requests...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Role Requests</h1>
          <p className="text-muted mb-0">Manage requests from users and employees to be promoted to higher roles</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {requests.length === 0 ? (
        <div className="alert alert-info">
          <h5 className="alert-heading">No pending role requests</h5>
          <p className="mb-0">
            There are currently no users requesting a role upgrade. Users can request to become an Employee or Admin during registration, 
            and their requests will appear here for approval or denial.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Current Role</th>
                <th>Requested Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 && requests.map((req, index) => (
                <tr key={req.Id || index}>
                  <td>{req.Email}</td>
                  <td>{req.FirstName} {req.LastName}</td>
                  <td>
                    <span className="badge bg-secondary">{req.CurrentRole}</span>
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">{req.RequestedRole}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(req.Id, req.RequestedRole)}
                      disabled={processing === req.Id}
                    >
                      {processing === req.Id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeny(req.Id, req.RequestedRole)}
                      disabled={processing === req.Id}
                    >
                      {processing === req.Id ? 'Processing...' : 'Deny'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
