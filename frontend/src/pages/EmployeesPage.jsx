import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import EmployeeModal from '../components/EmployeeModal';
import api, { getErrorMessage } from '../services/api';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  department: 'IT',
  position: '',
  salary: '',
  joiningDate: '',
  status: 'Active',
  profileImage: '',
};

export default function EmployeesPage({ notify }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [showModal, setShowModal] = useState(new URLSearchParams(location.search).get('open') === 'true');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/employees', {
        params: {
          search,
          department,
        },
      });
      const employeesList = Array.isArray(data) ? data : (data?.data || []);
      setEmployees(employeesList);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to load employees');
      setError(message);
      notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [department, notify, search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('open') === 'true') {
      setShowModal(true);
      navigate('/employees', { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleSubmitEmployee = async (formValues) => {
    setIsSubmitting(true);
    try {
      const safePayload = {
        ...formValues,
        salary: Number(formValues.salary),
      };

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id || editingEmployee.employeeId}`, safePayload);
        notify('Employee updated successfully');
      } else {
        await api.post('/employees', safePayload);
        notify('Employee added successfully');
      }

      setShowModal(false);
      setEditingEmployee(null);
      loadEmployees();
    } catch (error) {
      notify(error?.response?.data?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deleteEmployee) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/employees/${deleteEmployee._id || deleteEmployee.employeeId}`);
      notify('Employee deleted successfully');
      setDeleteEmployee(null);
      loadEmployees();
    } catch (error) {
      notify(error?.response?.data?.message || 'Failed to delete employee', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEmployees = employees.length > 0;

  const tableRows = useMemo(() => employees, [employees]);

  return (
    <div className="page-panel">
      <div className="page-header employee-header">
        <div>
          <p className="eyebrow">Team</p>
          <h2>Employees</h2>
        </div>
        <button type="button" className="primary-button" onClick={handleOpenCreateModal}>+ Add Employee</button>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <span>🔍</span>
          <input
            type="text"
            aria-label="Search employees"
            placeholder="Search employees..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-wrap">
          <select aria-label="Department filter" value={department} onChange={(event) => setDepartment(event.target.value)}>
            <option value="All Departments">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-box">Loading employees...</div>
      ) : error ? (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem' }}>⚠️</span>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <button type="button" className="primary-button" onClick={loadEmployees}>Retry</button>
        </div>
      ) : !hasEmployees ? (
        <div className="empty-state">
          <h3>No employees found.</h3>
          <p>Add your first employee to get started.</p>
          <button type="button" className="primary-button" onClick={handleOpenCreateModal}>+ Add Employee</button>
        </div>
      ) : (
        <>
          <div className="table-wrap desktop-table">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tableRows.map((employee) => (
                  <tr key={employee._id || employee.employeeId}>
                    <td>{employee.employeeId}</td>
                    <td>
                      <button type="button" className="link-button" onClick={() => setDetailEmployee(employee)}>
                        {employee.name}
                      </button>
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      <span className="department-badge">{employee.department}</span>
                    </td>
                    <td>{employee.position}</td>
                    <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${employee.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button type="button" className="icon-button-text edit" onClick={() => handleOpenEditModal(employee)}>✏️ Edit</button>
                        <button type="button" className="icon-button-text delete" onClick={() => setDeleteEmployee(employee)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mobile-cards mobile-card-list">
            {tableRows.map((employee) => (
              <article className="employee-card" key={employee._id || employee.employeeId}>
                <div className="card-head">
                  <div className="profile-mini">
                    {employee.profileImage ? (
                      <img src={employee.profileImage} alt={employee.name} />
                    ) : (
                      <span>{employee.name?.charAt(0)?.toUpperCase() || 'E'}</span>
                    )}
                  </div>
                  <div>
                    <button type="button" className="link-button" onClick={() => setDetailEmployee(employee)}>{employee.name}</button>
                    <p>{employee.position}</p>
                  </div>
                </div>

                <div className="card-meta">
                  <span>📧 {employee.email}</span>
                  <span>📱 {employee.phone}</span>
                  <span>🏢 {employee.department}</span>
                </div>

                <div className="card-footer">
                  <span className={`status-badge ${employee.status.toLowerCase().replace(/\s+/g, '-')}`}>{employee.status}</span>
                  <div className="action-buttons">
                    <button type="button" className="icon-button-text edit" onClick={() => handleOpenEditModal(employee)}>✏️ Edit</button>
                    <button type="button" className="icon-button-text delete" onClick={() => setDeleteEmployee(employee)}>🗑️ Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <EmployeeModal
          title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
          initialValues={
            editingEmployee
              ? {
                  ...emptyForm,
                  ...editingEmployee,
                  joiningDate: editingEmployee.joiningDate ? new Date(editingEmployee.joiningDate).toISOString().split('T')[0] : '',
                  salary: editingEmployee.salary ?? '',
                }
              : emptyForm
          }
          onSubmit={handleSubmitEmployee}
          onClose={() => {
            setShowModal(false);
            setEditingEmployee(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {detailEmployee && <EmployeeDetailModal employee={detailEmployee} onClose={() => setDetailEmployee(null)} />}

      {deleteEmployee && (
        <ConfirmModal
          title="Delete Employee?"
          message="Are you sure you want to delete this employee?"
          onCancel={() => setDeleteEmployee(null)}
          onConfirm={handleDeleteEmployee}
          confirmText={isSubmitting ? 'Deleting...' : 'Delete'}
        />
      )}
    </div>
  );
}
