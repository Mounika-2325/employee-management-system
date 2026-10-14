export default function Toast({ message, type, onClose }) {
  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}
