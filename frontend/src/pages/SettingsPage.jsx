export default function SettingsPage() {
  return (
    <div className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">System</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel-card settings-card">
          <h3>Organization Preferences</h3>
          <ul>
            <li>Employee management preferences</li>
            <li>Department naming rules</li>
            <li>Notification preferences</li>
            <li>Security settings</li>
          </ul>
        </div>

        <div className="panel-card settings-card">
          <h3>Profile</h3>
          <p>System settings panel for admin configuration.</p>
        </div>
      </div>
    </div>
  );
}
