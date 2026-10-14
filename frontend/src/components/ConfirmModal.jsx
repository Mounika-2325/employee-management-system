export default function ConfirmModal({ title, message, onCancel, onConfirm, confirmText = 'Delete' }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card confirm-card">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
          <button type="button" className="danger-button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
