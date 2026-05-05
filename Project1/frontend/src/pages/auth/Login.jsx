import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (submitError) {
      console.error('Login error:', submitError);
      const data = submitError?.response?.data;
      const message = data?.message || data?.Message || data?.title || data || submitError?.message || 'Login failed. Check your credentials and try again.';
      // If errors object (validation), join messages
      if (data?.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat().join('; ');
        setError(errorMessages);
      } else {
        setError(typeof message === 'string' ? message : JSON.stringify(message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 fw-bold mb-3">Log in</h1>
            <p className="text-muted mb-4">Use your account to access the protected pages.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="vstack gap-3">
              <div>
                <label className="form-label" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Log in'}
              </button>
            </form>
            <p className="text-muted small mt-3 mb-0">
              No account yet? <Link to="/register">Create one here</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}