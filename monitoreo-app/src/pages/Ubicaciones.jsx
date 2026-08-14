import { Link } from 'react-router-dom';
import { useUbicaciones } from '../hooks/useUbicaciones';

export const Ubicaciones = () => {
  const { sensores, cargando } = useUbicaciones();

  return (
    <div className="lista-ubicaciones">
      <h2>Directorio de Sensores</h2>
      <p className="subtitulo">Campus La María · UTEQ</p>

      {cargando && <p>Cargando sensores registrados...</p>}

      <div className="tarjetas-sensores">
        {sensores.map((sensor) => (
          <Link to={`/sensor/${sensor.id}`} key={sensor.id} className="tarjeta-sensor">
            <div className="tarjeta-sensor-header">
              <h3>{sensor.nombre}</h3>
              <span className={`badge ${sensor.estado === 'activo' ? 'online' : 'offline'}`}>
                ● {sensor.estado}
              </span>
            </div>
            <p className="tarjeta-sensor-ubicacion">{sensor.zona}</p>
            <p className="tarjeta-sensor-coords">
              Lat: {sensor.latitud} · Lng: {sensor.longitud}
            </p>
            <p className="tarjeta-sensor-id">{sensor.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
