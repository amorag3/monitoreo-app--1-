export const SensorCard = ({ icon, title, value, unit }) => {
  return (
    <div className="card">
      <div className="card-header">
        {icon && <span className="card-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      <p className="value">
        {value ?? '--'} <span className="unit">{unit}</span>
      </p>
    </div>
  );
};
