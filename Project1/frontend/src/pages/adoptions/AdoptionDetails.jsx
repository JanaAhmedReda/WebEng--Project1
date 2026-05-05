import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adoptionService } from '../../services/adoptionService';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function AdoptionDetails() {
  const [form, setForm] = useState({
    petId: '',
    userId: '',
    status: 'Pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();

  useEffect(() => {
    const selectedApplication = location.state?.application;
    if (!selectedApplication) {
      return;
    }

    setForm({
      petId: selectedApplication.petId ?? '',
      userId: selectedApplication.userId ?? '',
      status: selectedApplication.status ?? 'Pending',
    });
  }, [location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adoptionService.updateStatus({
        petId: Number(form.petId),
        userId: form.userId.trim(),
        status: form.status,
      });
      setSuccess('Adoption status updated successfully.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to update adoption status.');
    } finally {
      setLoading(false);
    }
  };


  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');
  if (!canManage) {
    return <div className="alert alert-danger">You do not have permission to access this page.</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h1 className="h3 fw-bold mb-1">Update adoption status</h1>
                <p className="text-muted mb-0">Select a row from All adoption applications, then update its status here.</p>
              </div>
              <Link to="/adoptions" className="btn btn-outline-secondary btn-sm">
                Back to adoptions
              </Link>
            </div>

            {location.state?.application && (
              <div className="alert alert-info">
                Loaded application for pet ID {location.state.application.petId} and user ID {location.state.application.userId}.
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label" htmlFor="status-petId">
                  Pet ID
                </label>
                <input id="status-petId" name="petId" type="number" min="1" className="form-control" value={form.petId} onChange={handleChange} required />
              </div>
              <div className="col-md-8">
                <label className="form-label" htmlFor="status-userId">
                  User ID
                </label>
                <input id="status-userId" name="userId" className="form-control" value={form.userId} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="status-value">
                  Status
                </label>
                <select id="status-value" name="status" className="form-select" value={form.status} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-12 d-flex gap-2 flex-wrap">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update status'}
                </button>
                <Link to="/adoptions" className="btn btn-outline-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}