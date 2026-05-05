import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10">
        <div className="card border-0 shadow-lg overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-7 p-4 p-md-5 hero-panel text-white">
              <span className="badge bg-warning text-dark mb-3">Frontend Integration</span>
              <h1 className="display-5 fw-bold">Pet Shelter Management System</h1>
              <p className="lead mt-3 mb-4">
                A React + Axios frontend connected to your ASP.NET Core backend for managing pets, shelters,
                and adoption workflows.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/pets" className="btn btn-light fw-semibold">
                  View Pets
                </Link>
                <Link to="/shelters" className="btn btn-outline-light fw-semibold">
                  View Shelters
                </Link>
                <Link to="/adoptions" className="btn btn-outline-light fw-semibold">
                  Adoption Center
                </Link>
              </div>
            </div>
            <div className="col-lg-5 p-4 p-md-5 bg-body-tertiary">
              <h2 className="h4 fw-semibold">{isAuthenticated ? 'Dashboard' : 'Welcome'}</h2>
              <p className="text-muted">
                {isAuthenticated
                  ? `Signed in as ${user?.email || 'a user'}. Use the navigation to manage application data.`
                  : 'Register or log in to access the protected application pages.'}
              </p>
              <ul className="list-unstyled small text-muted mb-4">
                <li className="mb-2">React Router for seamless navigation</li>
                <li className="mb-2">Axios for API communication</li>
                <li className="mb-2">Cookie-based authentication from the backend</li>
                <li className="mb-2">Controlled forms and loading/error states</li>
              </ul>
              {!isAuthenticated && (
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/login" className="btn btn-primary">
                    Log in
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary">
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}