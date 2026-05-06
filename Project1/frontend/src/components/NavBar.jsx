import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

export default function NavBar() {
  const { isAuthenticated, logout, deleteAccount, user } = useAuth();
  const navigate = useNavigate();
  const roles = user?.roles ?? [];
  const isAdmin = roles.includes('Admin');
  const isEmployee = roles.includes('Employee');
  const isStaff = isAdmin || isEmployee;

  const linkClass = ({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : 'text-white-50'}`;

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      await deleteAccount();
      navigate('/register');
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.Message || 'Unable to delete account. Please try again.';
      window.alert(message);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-light-subtle shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          Pet Shelter
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav me-auto">
            <NavLink className={linkClass} to="/">
              Home
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink className={linkClass} to="/pets">
                  View pets
                </NavLink>

                <NavLink className={linkClass} to="/shelters">
                  View shelters
                </NavLink>

                {isStaff ? (
                  <NavLink className={linkClass} to="/adoptions">
                    View adoption applications
                  </NavLink>
                ) : (
                  <NavLink className={linkClass} to="/adoptions/new">
                    New adoption application
                  </NavLink>
                )}

                {isAdmin && (
                  <>
                    <NavLink className={linkClass} to="/admin/users">
                      Admin
                    </NavLink>
                    <NavLink className={linkClass} to="/admin/role-requests">
                      Role Requests
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-white-50 small d-none d-lg-inline">{user?.email || 'Signed in'}</span>
                <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDeleteAccount}>
                  Delete account
                </button>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn btn-warning btn-sm" to="/register">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}