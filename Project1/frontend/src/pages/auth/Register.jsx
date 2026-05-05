import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { isValidEmail } from '../../utils/validators';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    role: 'User',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) {
      errors.firstName = 'First name is required (min 2 characters)';
    } else if (form.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!form.lastName.trim()) {
      errors.lastName = 'Last name is required (min 2 characters)';
    } else if (form.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      errors.password = 'Password is required (6-32 characters)';
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (form.password.length > 32) {
      errors.password = 'Password must not exceed 32 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(form.password)) {
      errors.password = 'Password must contain uppercase, lowercase, number, and special character (!, @, #, $, %, etc.)';
    }

    if (form.phoneNumber && !/^\+?[\d\s\-\(\)]{9,}$/.test(form.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((current) => {
        const updated = { ...current };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (submitError) {
      console.error('Registration error:', submitError);
      const data = submitError?.response?.data;
      
      // Handle different error response formats
      if (data?.message) {
        setError(data.message);
      } else if (data?.errors && typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat().join('; ');
        setError(errorMessages);
      } else if (data?.title) {
        setError(data.title);
      } else if (submitError?.message) {
        setError(submitError.message);
      } else {
        setError('Registration failed. Please review the form and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 fw-bold mb-3">Create account</h1>
            <p className="text-muted mb-4">Register once, then log in with the same cookie-backed session.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="firstName">
                  First name
                </label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                  value={form.firstName} 
                  onChange={handleChange} 
                  required 
                />
                {validationErrors.firstName && <div className="invalid-feedback d-block">{validationErrors.firstName}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="lastName">
                  Last name
                </label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                  value={form.lastName} 
                  onChange={handleChange} 
                  required 
                />
                {validationErrors.lastName && <div className="invalid-feedback d-block">{validationErrors.lastName}</div>}
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="phoneNumber">
                  Phone number
                </label>
                <input 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  className={`form-control ${validationErrors.phoneNumber ? 'is-invalid' : ''}`}
                  value={form.phoneNumber} 
                  onChange={handleChange} 
                />
                {validationErrors.phoneNumber && <div className="invalid-feedback d-block">{validationErrors.phoneNumber}</div>}
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="role">
                  Account type
                </label>
                <select 
                  id="role" 
                  name="role" 
                  className="form-select"
                  value={form.role} 
                  onChange={handleChange} 
                >
                  <option value="User">User</option>
                  <option value="Employee">Employee (Requires Admin Approval)</option>
                  <option value="Admin">Admin (Requires Admin Approval)</option>
                </select>
                <small className="form-text text-muted d-block mt-1">
                  Employee and Admin roles require administrator approval. You will be registered as a User and promoted by an admin if approved.
                </small>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="register-email">
                  Email
                </label>
                <input 
                  id="register-email" 
                  type="email" 
                  name="email" 
                  className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
                {validationErrors.email && <div className="invalid-feedback d-block">{validationErrors.email}</div>}
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
            {validationErrors.password ? (
              <div className="invalid-feedback d-block">{validationErrors.password}</div>
            ) : (
              <ul className="form-text text-muted ps-3 mt-1 mb-0" style={{ fontSize: '0.825rem' }}>
                <li>At least 6 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one non-alphanumeric character (e.g., !, @, #, ?)</li>
              </ul>
            )}
              </div>
              <div className="col-12 d-flex gap-2 flex-wrap">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating account...' : 'Register'}
                </button>
                <Link to="/login" className="btn btn-outline-secondary">
                  I already have an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}