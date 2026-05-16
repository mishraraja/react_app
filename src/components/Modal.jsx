export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop-custom">
      <div className="modal-card">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 mb-0">{title}</h2>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
