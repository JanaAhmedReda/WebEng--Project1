export default function Loading() {
  return (
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" aria-hidden="true" />
        <div className="mt-3 text-muted">Loading...</div>
      </div>
    </div>
  );
}