import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/employees', label: 'Employees', icon: '👥' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-icon">EM</div>
        <div>
          <p className="brand-label">Employee Management</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-button" type="button" onClick={() => navigate('/employees?open=true')}>
        ➕ Add Employee
      </button>
    </aside>
  );
}
