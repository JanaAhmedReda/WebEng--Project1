import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { adoptionService } from '../../services/adoptionService';
import { formatDateTime } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function AdoptionsList() {
  const { user } = useAuth();
  const isStaff = user?.roles?.includes('Admin') || user?.roles?.includes('Employee');
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadApplications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = isStaff ? await adoptionService.getAll() : await adoptionService.getByUser(user.id);
        if (active) {
          setApplications(Array.isArray(data) ? data : []);
          setSelectedApplication(null);
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Unable to load adoption applications.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      active = false;
    };
  }, [user?.id, isStaff]);

  if (loading) {
    return <Loading />;
  }

  const title = isStaff ? 'All adoption applications' : 'My adoption applications';
  const description = isStaff
    ? 'Review every application, then use the status page to approve or reject them.'
    : 'Track the applications you have submitted.';

  const handleRowClick = (application) => {
    if (!isStaff) {
      return;
    }

    setSelectedApplication(application);
  };

  return (
    <div className="vstack gap-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <h1 className="h3 fw-bold mb-1">Adoptions</h1>
          <p className="text-muted mb-0">{description}</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/adoptions/new" className="btn btn-primary">
            New application
          </Link>
          {isStaff && (
            <Link
              to="/adoptions/status"
              state={selectedApplication ? { application: selectedApplication } : undefined}
              className={`btn btn-outline-secondary ${!selectedApplication ? 'disabled' : ''}`}
              aria-disabled={!selectedApplication}
              tabIndex={!selectedApplication ? -1 : undefined}
              onClick={(event) => {
                if (!selectedApplication) {
                  event.preventDefault();
                }
              }}
            >
              Update status
            </Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h5 fw-semibold mb-0">{title}</h2>
            <span className="badge bg-secondary">{applications.length} total</span>
          </div>

          {applications.length === 0 ? (
            <div className="alert alert-info mb-0">No adoption applications found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    {isStaff && <th>Applicant</th>}
                    {isStaff && <th>User ID</th>}
                    <th>Pet</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={`${application.userId}-${application.petId}-${application.applicationDate}`}
                      role={isStaff ? 'button' : undefined}
                      tabIndex={isStaff ? 0 : undefined}
                      className={isStaff ? `cursor-pointer ${selectedApplication?.petId === application.petId && selectedApplication?.userId === application.userId ? 'table-primary' : ''}` : ''}
                      onClick={() => handleRowClick(application)}
                      onKeyDown={(event) => {
                        if (!isStaff) {
                          return;
                        }

                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleRowClick(application);
                        }
                      }}
                    >
                      {isStaff && <td>{application.adopterName}</td>}
                      {isStaff && <td className="small text-muted">{application.userId}</td>}
                      <td>{application.petName}</td>
                      <td>{formatDateTime(application.applicationDate)}</td>
                      <td>{application.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}