import { useEffect, useState } from 'react';
import ChangePassword from './ChangePassword';
import { useAuth } from '../../hooks/useAuth.jsx';

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileValidationErrors, setProfileValidationErrors] = useState({});
  const roles = user?.roles ?? [];

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    });
  }, [user]);

  const validateProfile = () => {
    const errors = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (profileForm.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (profileForm.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    return errors;
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
    setProfileError('');
    setProfileSuccess('');

    if (profileValidationErrors[name]) {
      setProfileValidationErrors((current) => {
        const updated = { ...current };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    const errors = validateProfile();
    if (Object.keys(errors).length > 0) {
      setProfileValidationErrors(errors);
      return;
    }

    setProfileLoading(true);

    try {
      await updateProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      });
      setProfileValidationErrors({});
      setProfileSuccess('Profile updated successfully.');
    } catch (submitError) {
      const data = submitError?.response?.data;
      if (data?.message) {
        setProfileError(data.message);
      } else if (data?.errors && typeof data.errors === 'object') {
        setProfileError(Object.values(data.errors).flat().join('; '));
      } else if (submitError?.message) {
        setProfileError(submitError.message);
      } else {
        setProfileError('Unable to update profile right now.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="vstack gap-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <h1 className="h3 fw-bold mb-1">Account</h1>
          <p className="text-muted mb-4">Review your profile details and manage your login settings.</p>

          {profileError && <div className="alert alert-danger">{profileError}</div>}
          {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

          <form onSubmit={handleProfileSubmit} className="vstack gap-3 mb-4">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="account-first-name">
                  First name
                </label>
                <input
                  id="account-first-name"
                  name="firstName"
                  className={`form-control ${profileValidationErrors.firstName ? 'is-invalid' : ''}`}
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  required
                />
                {profileValidationErrors.firstName && <div className="invalid-feedback d-block">{profileValidationErrors.firstName}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="account-last-name">
                  Last name
                </label>
                <input
                  id="account-last-name"
                  name="lastName"
                  className={`form-control ${profileValidationErrors.lastName ? 'is-invalid' : ''}`}
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  required
                />
                {profileValidationErrors.lastName && <div className="invalid-feedback d-block">{profileValidationErrors.lastName}</div>}
              </div>
            </div>

            <div>
              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving changes...' : 'Save profile'}
              </button>
            </div>
          </form>

          <dl className="row mb-0">
            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{user?.email || 'N/A'}</dd>
            <dt className="col-sm-3">First name</dt>
            <dd className="col-sm-9">{user?.firstName || 'N/A'}</dd>
            <dt className="col-sm-3">Last name</dt>
            <dd className="col-sm-9">{user?.lastName || 'N/A'}</dd>
            <dt className="col-sm-3">Roles</dt>
            <dd className="col-sm-9">
              {roles.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <span key={role} className="badge text-bg-secondary">
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                'N/A'
              )}
            </dd>
          </dl>
        </div>
      </div>

      <ChangePassword />
    </div>
  );
}