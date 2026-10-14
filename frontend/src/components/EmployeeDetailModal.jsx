export default function EmployeeDetailModal({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card detail-card">
        <div className="modal-header">
          <h3>Employee Details</h3>
          <button type="button" className="icon-button" onClick={onClose}>×</button>
        </div>

        <div className="profile-header">
          <div className="profile-avatar">
            {employee.profileImage ? (
              <img src={employee.profileImage} alt={employee.name} />
            ) : (
              <span>{employee.name?.charAt(0)?.toUpperCase() || 'E'}</span>
            )}
          </div>
          <div>
            <h4>{employee.name}</h4>
            <p>{employee.position}</p>
          </div>
        </div>

        <div className="detail-grid">
          <div><span className="detail-label">Employee ID</span><strong>{employee.employeeId}</strong></div>
          <div><span className="detail-label">Email</span><strong>{employee.email}</strong></div>
          <div><span className="detail-label">Phone</span><strong>{employee.phone}</strong></div>
          <div><span className="detail-label">Department</span><strong>{employee.department}</strong></div>
          <div><span className="detail-label">Salary</span><strong>${Number(employee.salary || 0).toLocaleString()}</strong></div>
          <div><span className="detail-label">Joining Date</span><strong>{new Date(employee.joiningDate).toLocaleDateString()}</strong></div>
          <div><span className="detail-label">Status</span><strong>{employee.status}</strong></div>
        </div>
      </div>
    </div>
  );
}
