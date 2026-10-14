import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { useCallback, useState } from 'react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, variant = 'success') => {
    setToast({ message, variant });
    setTimeout(() => {
      setToast(null);
    }, 2600);
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-shell">
        <Sidebar />

        <div className="content-shell">
          <header className="topbar">
            <div className="topbar-search">
              <span className="brand-mark">EM</span>
              <span>Admin Panel</span>
            </div>
            <nav className="topbar-nav" aria-label="Main navigation">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
              <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Employees</NavLink>
              <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Settings</NavLink>
            </nav>
          </header>

          <main className="content-area">
            <Routes>
              <Route path="/" element={<DashboardPage notify={notify} />} />
              <Route path="/employees" element={<EmployeesPage notify={notify} />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          📊
        </NavLink>
        <NavLink to="/employees" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          👥
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          ⚙️
        </NavLink>
      </nav>

      {toast && <Toast message={toast.message} type={toast.variant} onClose={() => setToast(null)} />}
    </BrowserRouter>
  );
}
