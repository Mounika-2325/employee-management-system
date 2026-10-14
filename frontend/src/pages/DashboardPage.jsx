import { useCallback, useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard';
import api, { getErrorMessage } from '../services/api';

const departmentMeta = {
  IT: { icon: '💻', tone: 'primary' },
  HR: { icon: '🧑‍💼', tone: 'secondary' },
  Finance: { icon: '💰', tone: 'success' },
  Marketing: { icon: '📣', tone: 'warning' },
  Sales: { icon: '📈', tone: 'purple' },
  Operations: { icon: '⚙️', tone: 'danger' },
};

export default function DashboardPage({ notify }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/employees');
      const employeesData = Array.isArray(response.data)
        ? response.data
        : (response.data?.data || []);

      if (!Array.isArray(employeesData)) {
        throw new Error('Employees API response is not an array');
      }

      setEmployees(employeesData);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to load dashboard data');
      setError(message);
      notify(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const stats = useMemo(() => {
    const departmentTotals = employees.reduce((accumulator, employee) => {
      accumulator[employee.department] = (accumulator[employee.department] || 0) + 1;
      return accumulator;
    }, {});

    const recentEmployees = [...employees].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

    return {
      total: employees.length,
      departmentTotals,
      recentEmployees,
    };
  }, [employees]);

  return (
    <div className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      {loading ? (
        <div className="loading-box">Loading employees...</div>
      ) : error ? (
        <div className="empty-state">
          <span style={{ fontSize: '2.5rem' }}>⚠️</span>
          <h3>Connection Error</h3>
          <p>{error}</p>
          <button type="button" className="primary-button" onClick={getEmployees}>Retry</button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard title="Total Employees" value={stats.total} icon="👥" tone="primary" />
            <StatCard title="IT Department" value={stats.departmentTotals.IT || 0} icon="💻" tone="secondary" />
            <StatCard title="HR Department" value={stats.departmentTotals.HR || 0} icon="🧑‍💼" tone="success" />
            <StatCard title="Finance" value={stats.departmentTotals.Finance || 0} icon="💰" tone="warning" />
          </div>

          <div className="dashboard-grid">
            <section className="panel-card">
              <div className="panel-header">
                <h3>Department Overview</h3>
              </div>

              <div className="department-list">
                {Object.entries(departmentMeta).map(([department, meta]) => (
                  <div className="department-item" key={department}>
                    <div className="department-left">
                      <span className="mini-icon">{meta.icon}</span>
                      <span>{department}</span>
                    </div>
                    <strong>{stats.departmentTotals[department] || 0}</strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel-card">
              <div className="panel-header">
                <h3>Recent Employees</h3>
              </div>

              {stats.recentEmployees.length === 0 ? (
                <p className="muted-text">No recent employees.</p>
              ) : (
                <ul className="recent-list">
                  {stats.recentEmployees.map((employee) => (
                    <li key={employee._id || employee.employeeId} className="recent-item">
                      <div className="recent-avatar">
                        {employee.profileImage ? (
                          <img src={employee.profileImage} alt={employee.name} />
                        ) : (
                          <span>{employee.name?.charAt(0)?.toUpperCase() || 'E'}</span>
                        )}
                      </div>
                      <div>
                        <strong>{employee.name}</strong>
                        <p>{employee.position}</p>
                      </div>
                      <span className="recent-date">{new Date(employee.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
