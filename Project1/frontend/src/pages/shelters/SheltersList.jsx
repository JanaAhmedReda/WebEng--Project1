import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { shelterService } from '../../services/shelterService';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function SheltersList() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadShelters = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await shelterService.getAll();
      setShelters(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to load shelters right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this shelter?');
    if (!confirmed) {
      return;
    }

    try {
      await shelterService.delete(id);
      await loadShelters();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Delete failed.');
    }
  };

  const { user } = useAuth();
  const canManage = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Shelters</h1>
          <p className="text-muted mb-0">Manage the shelter records stored in the backend.</p>
        </div>
        {canManage && (
          <Link to="/shelters/new" className="btn btn-primary">
            Add shelter
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {shelters.length === 0 ? (
        <div className="alert alert-info">No shelters were returned from the backend yet.</div>
      ) : (
        <div className="row g-3">
          {shelters.map((shelter) => (
            <div className="col-12 col-md-6 col-xl-4" key={shelter.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h2 className="h5 fw-semibold">{shelter.name}</h2>
                  <p className="text-muted mb-4">{shelter.address || 'No address provided'}</p>
                  <div className="mt-auto d-flex flex-wrap gap-2">
                    <Link to={`/shelters/${shelter.id}`} className="btn btn-outline-primary btn-sm">
                      Details
                    </Link>
                    {canManage && (
                      <>
                        <Link to={`/shelters/${shelter.id}/edit`} className="btn btn-outline-secondary btn-sm">
                          Edit
                        </Link>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(shelter.id)}>
                          Delete
                        </button>
                      </>
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