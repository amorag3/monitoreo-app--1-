import { useParams } from 'react-router-dom';
import { useSensorData } from '../hooks/useSensorData';
import { useUbicacionSensor } from '../hooks/useUbicaciones';
import { SensorCard } from '../components/SensorCard';
import { HistorialTable } from '../components/HistorialTable';

const formatearFecha = (timestamp) => {
  if (!timestamp) return '--';
  return new Date(timestamp).toLocaleString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const Dashboard = ({ defaultSensor }) => {
  // Usa el sensor de la URL (/sensor/:sensorId); si estamos en "/", usa el sensor por defecto
  const { sensorId: sensorIdParam } = useParams();
  const sensorId = sensorIdParam || defaultSensor;

  const { actual, historial } = useSensorData(sensorId);
  const ubicacion = useUbicacionSensor(sensorId);

  if (!actual) return <p className="loading">Cargando datos del sensor...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-encabezado">
        <p className="campus">{ubicacion?.campus || 'Campus La María · UTEQ'}</p>
        <h1>{ubicacion?.nombre || sensorId}</h1>
        <p className="ubicacion-texto">{ubicacion?.zona}</p>
        <p className={`estado ${ubicacion?.estado === 'activo' ? 'online' : 'offline'}`}>
          ● {ubicacion?.estado === 'activo' ? 'En Línea' : (ubicacion?.estado || 'Desconocido')}
        </p>
      </div>

      <div className="dashboard-grid">
        <SensorCard icon="🌡️" title="Temperatura" value={actual.temperatura} unit="°C" />
        <SensorCard icon="💧" title="Humedad" value={actual.humedad} unit="%" />
        <SensorCard icon="🧭" title="Presión atmosférica" value={actual.presionAtmosferica} unit="hPa" />
      </div>

      <p className="ultima-actualizacion">
        Última actualización: {formatearFecha(actual.timestamp)}
        <br />
        Identificador: {sensorId}
      </p>

      <HistorialTable registros={historial} />
    </div>
  );
};
