import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { petService } from '../../services/petService';
import Loading from '../../components/Loading';
import { useAuth } from '../../hooks/useAuth.jsx';
import { formatAge } from '../../utils/formatters';

export default function PetsList() {
  const [pets, setPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [petIdSearch, setPetIdSearch] = useState('');
  const [isFilteredById, setIsFilteredById] = useState(false);

  const loadPets = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await petService.getAll();
      const normalizedPets = Array.isArray(data) ? data : [];
      setAllPets(normalizedPets);
      setPets(normalizedPets);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load pets right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleSearchById = async (event) => {
    event.preventDefault();
    setError('');

    const parsedId = Number(petIdSearch);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setError('Enter a valid pet ID (positive integer).');
      return;
    }

    const petByDisplayedId = allPets[parsedId - 1];
    if (petByDisplayedId) {
      setPets([petByDisplayedId]);
      setIsFilteredById(true);
      return;
    }

    setPets([]);
    setIsFilteredById(true);
    setError(`No pet found with ID ${parsedId}.`);
  };

  const handleClearSearch = async () => {
    setPetIdSearch('');
    setIsFilteredById(false);
    await loadPets();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this pet?');
    if (!confirmed) {
      return;
    }

    try {
      await petService.delete(id);
      await loadPets();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Delete failed.');
    }
  };

  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');
  const isAdmin = user?.roles?.includes('Admin');
  const getDisplayId = (pet) => {
    const indexInAllPets = allPets.findIndex((item) => item.id === pet.id);
    return indexInAllPets >= 0 ? indexInAllPets + 1 : null;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Pets</h1>
          <p className="text-muted mb-0">Browse animals stored in the backend.</p>
        </div>
        {canManage && (
          <Link to="/pets/new" className="btn btn-primary">
            Add pet
          </Link>
        )}
      </div>

      <form className="row g-2 align-items-end mb-3" onSubmit={handleSearchById}>
        <div className="col-12 col-md-4 col-lg-3">
          <label htmlFor="pet-id-search" className="form-label mb-1">
            Search by Pet ID (starts from 1)
          </label>
          <input
            id="pet-id-search"
            type="number"
            min="1"
            step="1"
            className="form-control"
            value={petIdSearch}
            onChange={(event) => setPetIdSearch(event.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="col-auto d-flex gap-2">
          <button type="submit" className="btn btn-outline-primary">
            Search
          </button>
          {isFilteredById && (
            <button type="button" className="btn btn-outline-secondary" onClick={handleClearSearch}>
              Clear
            </button>
          )}
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {pets.length === 0 ? (
        <div className="alert alert-info">No pets were returned from the backend yet.</div>
      ) : (
        <div className="row g-3">
          {pets.map((pet) => (
            <div className="col-12 col-md-6 col-xl-4" key={pet.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <p className="small text-muted mb-1">ID: {getDisplayId(pet) ?? 'N/A'}</p>
                  <h2 className="h5 fw-semibold">{pet.name}</h2>
                  <p className="text-muted mb-2">{pet.breed || 'Breed not listed'}</p>
                  <dl className="small text-muted mb-4">
                    <div className="d-flex justify-content-between">
                      <dt>Age</dt>
                      <dd>{formatAge(pet.age, pet.ageUnit)}</dd>
                    </div>
                    <div className="d-flex justify-content-between">
                      <dt>Shelter</dt>
                      <dd>{pet.shelterName || 'Unknown'}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto d-flex flex-wrap gap-2">
                    <Link to={`/pets/${pet.id}`} className="btn btn-outline-primary btn-sm">
                      Details
                    </Link>
                    {canManage && (
                      <Link to={`/pets/${pet.id}/edit`} className="btn btn-outline-secondary btn-sm">
                        Edit
                      </Link>
                    )}
                    {isAdmin && (
                      <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(pet.id)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}