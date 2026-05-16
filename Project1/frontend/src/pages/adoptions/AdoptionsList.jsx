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
  const [showDetails, setShowDetails] = useState(false);

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

  const openDetails = (application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
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
                      <th>Reason</th>
                      <th>Actions</th>
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
                      <td className="text-truncate" style={{maxWidth: '240px'}}>{application.motivationMessage || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetails(application);
                          }}
                        >
                          Details
                        </button>
                      </td>
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

      {showDetails && selectedApplication && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{zIndex:1050}}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{opacity:0.5}} onClick={closeDetails} />
          <div className="card shadow-lg" style={{width: 'min(720px, 95%)', zIndex:1051}}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="mb-0">Application details</h5>
                <button className="btn-close" onClick={closeDetails} aria-label="Close" />
              </div>

              <dl className="row">
                <dt className="col-sm-4">Applicant</dt>
                <dd className="col-sm-8">{selectedApplication.adopterName || 'Unknown'}</dd>

                <dt className="col-sm-4">User ID</dt>
                <dd className="col-sm-8 small text-muted">{selectedApplication.userId}</dd>

                <dt className="col-sm-4">Pet</dt>
                <dd className="col-sm-8">{selectedApplication.petName}</dd>

                <dt className="col-sm-4">Date</dt>
                <dd className="col-sm-8">{formatDateTime(selectedApplication.applicationDate)}</dd>

                <dt className="col-sm-4">Status</dt>
                <dd className="col-sm-8">{selectedApplication.status}</dd>

                <dt className="col-sm-4">Why do you want to adopt this pet?</dt>
                <dd className="col-sm-8">{selectedApplication.motivationMessage || 'No response provided.'}</dd>
              </dl>

              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary" onClick={closeDetails}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}