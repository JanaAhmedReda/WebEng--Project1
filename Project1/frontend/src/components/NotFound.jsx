import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-5 fw-bold">404</h1>
      <p className="lead text-muted">The page you requested could not be found.</p>
      <Link to="/" className="btn btn-primary">
        Go home
      </Link>
    </div>
  );
}