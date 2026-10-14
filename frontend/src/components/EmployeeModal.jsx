import { useEffect, useState } from 'react';

const defaultValues = {
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

export default function EmployeeModal({ initialValues, onSubmit, onClose, isSubmitting, title }) {
  const [formData, setFormData] = useState(initialValues || defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialValues || defaultValues);
  }, [initialValues]);

  const validate = (values) => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s-]{7,15}$/;

    if (!values.name?.trim()) nextErrors.name = 'Name is required';
    if (!values.email?.trim() || !emailPattern.test(values.email.trim())) nextErrors.email = 'Email must be valid';
    if (!values.phone?.trim() || !phonePattern.test(values.phone.trim())) nextErrors.phone = 'Phone number must be valid';
    if (!values.department) nextErrors.department = 'Department is required';
    if (!values.position?.trim()) nextErrors.position = 'Position is required';
    if (!values.salary || Number(values.salary) <= 0 || Number.isNaN(Number(values.salary))) {
      nextErrors.salary = 'Salary should contain a valid number';
    }
    if (!values.joiningDate) nextErrors.joiningDate = 'Joining date is required';

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card wide">
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="icon-button" onClick={onClose}>×</button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="department">Department</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange}>
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="position">Position</label>
              <input id="position" name="position" value={formData.position} onChange={handleChange} />
              {errors.position && <span className="error-text">{errors.position}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="salary">Salary</label>
              <input id="salary" name="salary" type="number" min="0" step="0.01" value={formData.salary} onChange={handleChange} />
              {errors.salary && <span className="error-text">{errors.salary}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="joiningDate">Joining Date</label>
              <input id="joiningDate" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} />
              {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
            </div>

            <div className="field-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            <div className="field-group full-width">
              <label htmlFor="profileImage">Profile Image URL</label>
              <input id="profileImage" name="profileImage" placeholder="https://example.com/profile.jpg" value={formData.profileImage} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : title.includes('Edit') ? 'Update Employee' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
