import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { shelterService } from '../../services/shelterService';
import { useAuth } from '../../hooks/useAuth.jsx';

const emptyForm = {
  name: '',
  address: '',
};

export default function ShelterForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');
  if (!canManage) return <div className="alert alert-danger">You do not have permission to access this page.</div>;

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadShelter = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }

      try {
        const data = await shelterService.getById(id);
        if (active && data) {
          setForm({
            name: data.name || '',
            address: data.address || '',
          });
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load shelter details.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadShelter();

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || null,
    };

    try {
      if (isEditing) {
        await shelterService.update(id, payload);
      } else {
        await shelterService.create(payload);
      }

      navigate('/shelters');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div>
                <h1 className="h3 fw-bold mb-1">{isEditing ? 'Edit shelter' : 'Add shelter'}</h1>
                <p className="text-muted mb-0">Manage shelter records with a controlled form.</p>
              </div>
              <Link to="/shelters" className="btn btn-outline-secondary btn-sm">
                Back to shelters
              </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="vstack gap-3">
              <div>
                <label className="form-label" htmlFor="shelter-name">
                  Name
                </label>
                <input id="shelter-name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="form-label" htmlFor="shelter-address">
                  Address
                </label>
                <textarea
                  id="shelter-address"
                  name="address"
                  className="form-control"
                  rows="4"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save shelter'}
                </button>
                <Link to="/shelters" className="btn btn-outline-secondary">
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