import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar">
      <span className="navbar-brand">UTEQ Sensor Monitor</span>
      <div className="navbar-links">
        <Link to="/">Dashboard</Link>
        <Link to="/ubicaciones">Ubicaciones</Link>
      </div>
    </nav>
  );
};
