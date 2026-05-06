import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const passwordRules = [
  'At least 6 characters',
  'At least one uppercase letter (A-Z)',
  'At least one lowercase letter (a-z)',
  'At least one number (0-9)',
  'At least one non-alphanumeric character (e.g., !, @, #, ?)',
];

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!form.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!form.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (form.newPassword.length > 32) {
      errors.newPassword = 'Password must not exceed 32 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(form.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!form.confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmNewPassword) {
      errors.confirmNewPassword = 'New password and confirmation do not match';
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setSuccess('');

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
    setSuccess('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await changePassword(form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setValidationErrors({});
    } catch (submitError) {
      const data = submitError?.response?.data;

      if (data?.message) {
        setError(data.message);
      } else if (data?.errors && typeof data.errors === 'object') {
        setError(Object.values(data.errors).flat().join('; '));
      } else if (submitError?.message) {
        setError(submitError.message);
      } else {
        setError('Unable to change your password right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4 p-md-5">
            <h1 className="h3 fw-bold mb-3">Change password</h1>
            <p className="text-muted mb-4">Update the password for {user?.email || 'your account'}.</p>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="vstack gap-3">
              <div>
                <label className="form-label" htmlFor="current-password">
                  Current password
                </label>
                <input
                  id="current-password"
                  type="password"
                  name="currentPassword"
                  className={`form-control ${validationErrors.currentPassword ? 'is-invalid' : ''}`}
                  value={form.currentPassword}
                  onChange={handleChange}
                  required
                />
                {validationErrors.currentPassword && <div className="invalid-feedback d-block">{validationErrors.currentPassword}</div>}
              </div>

              <div>
                <label className="form-label" htmlFor="new-password">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  name="newPassword"
                  className={`form-control ${validationErrors.newPassword ? 'is-invalid' : ''}`}
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
                {validationErrors.newPassword ? (
                  <div className="invalid-feedback d-block">{validationErrors.newPassword}</div>
                ) : (
                  <ul className="form-text text-muted ps-3 mt-1 mb-0" style={{ fontSize: '0.825rem' }}>
                    {passwordRules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="confirm-new-password">
                  Confirm new password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  name="confirmNewPassword"
                  className={`form-control ${validationErrors.confirmNewPassword ? 'is-invalid' : ''}`}
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  required
                />
                {validationErrors.confirmNewPassword && <div className="invalid-feedback d-block">{validationErrors.confirmNewPassword}</div>}
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating password...' : 'Update password'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/account')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}