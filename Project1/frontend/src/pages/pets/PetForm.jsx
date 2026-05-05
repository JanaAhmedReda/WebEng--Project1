import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { petService } from '../../services/petService';
import { shelterService } from '../../services/shelterService';
import { useAuth } from '../../hooks/useAuth.jsx';

const emptyForm = {
  name: '',
  breed: '',
  age: '',
  ageUnit: 'Years',
  healthNotes: '',
  isVaccinated: false,
  shelterId: '',
};

export default function PetForm() {
  const [form, setForm] = useState(emptyForm);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError('');

      try {
        const [shelterData, petData] = await Promise.all([
          shelterService.getAll(),
          isEditing ? petService.getById(id) : Promise.resolve(null),
        ]);

        if (!active) {
          return;
        }

        setShelters(Array.isArray(shelterData) ? shelterData : []);

        if (petData) {
          setForm({
            name: petData.name || '',
            breed: petData.breed || '',
            age: petData.age ?? '',
            ageUnit: petData.ageUnit || 'Years',
            healthNotes: petData.healthNotes && petData.healthNotes !== 'No health notes provided' ? petData.healthNotes : '',
            isVaccinated: Boolean(petData.isVaccinated),
            shelterId: petData.shelterId || '',
          });
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to prepare the pet form.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  if (!canManage) {
    return <div className="alert alert-danger">You do not have permission to access this page.</div>;
  }

  const getErrorMessage = (requestError, fallbackMessage) => {
    const responseData = requestError?.response?.data;

    if (!responseData) {
      return fallbackMessage;
    }

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (responseData.message) {
      return responseData.message;
    }

    if (responseData.Message) {
      return responseData.Message;
    }

    if (responseData.title) {
      return responseData.title;
    }

    if (responseData.errors && typeof responseData.errors === 'object') {
      const messages = Object.values(responseData.errors).flat().filter(Boolean);
      if (messages.length > 0) {
        return messages.join('; ');
      }
    }

    return fallbackMessage;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      breed: form.breed.trim() || null,
      age: Number(form.age),
      ageUnit: form.ageUnit,
      healthNotes: form.healthNotes.trim() || null,
      isVaccinated: Boolean(form.isVaccinated),
      shelterId: Number(form.shelterId),
    };

    try {
      if (isEditing) {
        await petService.update(id, payload);
      } else {
        await petService.create(payload);
      }

      navigate('/pets');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Save failed. Check the form and try again.'));
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
                <h1 className="h3 fw-bold mb-1">{isEditing ? 'Edit pet' : 'Add pet'}</h1>
                <p className="text-muted mb-0">Use a controlled form to submit data through Axios.</p>
              </div>
              <Link to="/pets" className="btn btn-outline-secondary btn-sm">
                Back to pets
              </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="pet-name">
                  Name
                </label>
                <input id="pet-name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="pet-breed">
                  Breed
                </label>
                <input id="pet-breed" name="breed" className="form-control" value={form.breed} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="pet-age">
                  Age value
                </label>
                <input id="pet-age" type="number" min="0" max="999" name="age" className="form-control" value={form.age} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="pet-ageUnit">
                  Age unit
                </label>
                <select id="pet-ageUnit" name="ageUnit" className="form-select" value={form.ageUnit} onChange={handleChange} required>
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                  <option value="Weeks">Weeks</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="pet-shelterId">
                  Shelter
                </label>
                <select id="pet-shelterId" name="shelterId" className="form-select" value={form.shelterId} onChange={handleChange} required>
                  <option value="">Choose shelter</option>
                  {shelters.map((shelter) => (
                    <option key={shelter.id} value={shelter.id}>
                      {shelter.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="pet-healthNotes">
                  Health notes
                </label>
                <textarea
                  id="pet-healthNotes"
                  name="healthNotes"
                  className="form-control"
                  rows="4"
                  value={form.healthNotes}
                  onChange={handleChange}
                  placeholder="Describe any health notes or leave blank for the default message"
                />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input
                    id="pet-isVaccinated"
                    name="isVaccinated"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.isVaccinated}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="pet-isVaccinated">
                    Vaccinated
                  </label>
                </div>
              </div>
              <div className="col-12 d-flex gap-2 flex-wrap">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save pet'}
                </button>
                <Link to="/pets" className="btn btn-outline-secondary">
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