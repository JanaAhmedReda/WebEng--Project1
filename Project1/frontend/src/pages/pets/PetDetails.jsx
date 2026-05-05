import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { petService } from '../../services/petService';
import { useAuth } from '../../hooks/useAuth.jsx';
import { formatAge } from '../../utils/formatters';

export default function PetDetails() {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadPet = async () => {
      setError('');
      setNotFound(false);

      try {
        const data = await petService.getById(id);
        if (active) {
          setPet(data);
        }
      } catch (requestError) {
        if (requestError?.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(requestError?.response?.data?.message || 'Unable to load pet details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPet();

    return () => {
      active = false;
    };
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this pet?');
    if (!confirmed) {
      return;
    }

    try {
      await petService.delete(id);
      navigate('/pets');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Delete failed.');
    }
  };

  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (notFound || !pet) {
    return <div className="alert alert-warning">Pet not found.</div>;
  }


  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
              <div>
                <h1 className="h3 fw-bold mb-1">{pet.name}</h1>
                <p className="text-muted mb-0">Pet record details</p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/pets" className="btn btn-outline-primary btn-sm">
                  Back to pets
                </Link>
                {canManage && (
                  <>
                    <Link to={`/pets/${id}/edit`} className="btn btn-outline-secondary btn-sm">
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
              <dt className="col-sm-3">Breed</dt>
              <dd className="col-sm-9">{pet.breed || 'N/A'}</dd>

              <dt className="col-sm-3">Age</dt>
              <dd className="col-sm-9">{formatAge(pet.age, pet.ageUnit)}</dd>

              <dt className="col-sm-3">Shelter</dt>
              <dd className="col-sm-9">{pet.shelterName || 'N/A'}</dd>

              <dt className="col-sm-3">Health notes</dt>
              <dd className="col-sm-9">{pet.healthNotes || 'No health notes provided'}</dd>

              <dt className="col-sm-3">Vaccinated</dt>
              <dd className="col-sm-9">{pet.isVaccinated ? 'Yes' : 'No'}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}