export default function StatCard({ title, value, icon, tone = 'primary' }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-header">
        <span className="stat-icon">{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
