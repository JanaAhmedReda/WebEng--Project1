import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import { adoptionService } from '../../services/adoptionService';
import { petService } from '../../services/petService';
import { useAuth } from '../../hooks/useAuth.jsx';

const nowValue = new Date().toISOString().slice(0, 16);

export default function AdoptionForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roles = user?.roles ?? [];
  const isStaff = roles.includes('Admin') || roles.includes('Employee');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    petId: '',
    motivationMessage: '',
    applicationDate: nowValue,
  });

  const canSubmit = Boolean(user?.id);

  useEffect(() => {
    let active = true;

    const loadPets = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await petService.getAll();
        if (active) {
          setPets(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load pets for adoption.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPets();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('You must be signed in to submit an adoption application.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await adoptionService.apply({
        petId: Number(form.petId),
        adopterId: user.id,
        motivationMessage: form.motivationMessage.trim() || null,
        applicationDate: new Date(form.applicationDate).toISOString(),
      });

      setSuccess('Application submitted successfully.');
      navigate(isStaff ? '/adoptions' : '/pets');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to submit the adoption application.');
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
                <h1 className="h3 fw-bold mb-1">New adoption application</h1>
                <p className="text-muted mb-0">Choose a pet and submit your application as the current signed-in user.</p>
              </div>
              <Link to={isStaff ? '/adoptions' : '/pets'} className="btn btn-outline-secondary btn-sm">
                Back to {isStaff ? 'adoptions' : 'pets'}
              </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="alert alert-info d-flex flex-wrap justify-content-between align-items-center gap-2">
              <span>Submitting as: {user?.firstName || user?.email || 'Current user'}</span>
              <span className="small text-muted">User ID: {user?.id || 'Unavailable'}</span>
            </div>

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <label className="form-label" htmlFor="adoption-petId">
                  Pet
                </label>
                <select id="adoption-petId" name="petId" className="form-select" value={form.petId} onChange={handleChange} required>
                  <option value="">Choose a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} {pet.shelterName ? `(${pet.shelterName})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label" htmlFor="adoption-userId">
                  Applicant
                </label>
                <input id="adoption-userId" className="form-control" value={user?.email || user?.id || ''} readOnly />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="adoption-motivationMessage">
                  Why do you want to adopt this pet?
                </label>
                <textarea
                  id="adoption-motivationMessage"
                  name="motivationMessage"
                  className="form-control"
                  rows="4"
                  value={form.motivationMessage}
                  onChange={handleChange}
                  placeholder="Tell us a little about your home, experience, and why this pet is a good fit."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="adoption-applicationDate">
                  Application date
                </label>
                <input
                  id="adoption-applicationDate"
                  name="applicationDate"
                  type="datetime-local"
                  className="form-control"
                  value={form.applicationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 d-flex gap-2 flex-wrap">
                <button type="submit" className="btn btn-primary" disabled={saving || !canSubmit}>
                  {saving ? 'Submitting...' : 'Submit application'}
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
