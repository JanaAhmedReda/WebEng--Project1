import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { petService } from '../../services/petService';
import { shelterService } from '../../services/shelterService';
import { useAuth } from '../../hooks/useAuth.jsx';
import { formatAge } from '../../utils/formatters';

export default function ShelterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shelter, setShelter] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [petsError, setPetsError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    const loadShelter = async () => {
      setError('');
      setPetsError('');
      setNotFound(false);

      try {
        const shelterData = await shelterService.getById(id);
        if (active) {
          setShelter(shelterData);
        }

        try {
          const petData = await petService.getByShelterId(id);
          if (active) {
            setPets(Array.isArray(petData) ? petData : []);
          }
        } catch (petRequestError) {
          if (active) {
            setPets([]);
            setPetsError(petRequestError?.response?.data?.message || 'Unable to load pets for this shelter.');
          }
        }
      } catch (requestError) {
        const status = requestError?.response?.status;
        if (status === 404) {
          setNotFound(true);
        } else {
          setError(requestError?.response?.data?.message || 'Unable to load shelter details.');
        }
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
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this shelter?');
    if (!confirmed) {
      return;
    }

    try {
      await shelterService.delete(id);
      navigate('/shelters');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (notFound || !shelter) {
    return <div className="alert alert-warning">Shelter not found.</div>;
  }


  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');

  return (
    <div className="vstack gap-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div>
              <h1 className="h3 fw-bold mb-1">{shelter.name}</h1>
              <p className="text-muted mb-0">Shelter record details</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Link to="/shelters" className="btn btn-outline-primary btn-sm">
                Back to shelters
              </Link>
              {canManage && (
                <>
                  <Link to={`/shelters/${id}/edit`} className="btn btn-outline-secondary btn-sm">
                    Edit
                  </Link>
                  {user?.roles?.includes('Admin') && (
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <dl className="row mb-0">
            <dt className="col-sm-3">Name</dt>
            <dd className="col-sm-9">{shelter.name || 'N/A'}</dd>
            <dt className="col-sm-3">Address</dt>
            <dd className="col-sm-9">{shelter.address || 'N/A'}</dd>
          </dl>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <h2 className="h5 fw-semibold mb-3">Pets in this shelter</h2>
          {petsError && <div className="alert alert-warning">{petsError}</div>}
          {pets.length === 0 ? (
            <p className="text-muted mb-0">No pets were returned for this shelter.</p>
          ) : (
            <div className="row g-3">
              {pets.map((pet) => (
                <div className="col-12 col-md-6" key={pet.id}>
                  <div className="border rounded-4 p-3 h-100 bg-body-tertiary">
                    <h3 className="h6 fw-semibold mb-1">{pet.name}</h3>
                    <p className="text-muted small mb-3">{pet.breed || 'Breed not listed'}</p>
                    <p className="text-muted small mb-3">Age: {formatAge(pet.age, pet.ageUnit)}</p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link to={`/pets/${pet.id}`} className="btn btn-outline-primary btn-sm">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}